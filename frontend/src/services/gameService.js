import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { boardSpaces, chanceCards, communityChestCards, colorGroups } from '../boardData';

// Initialize game state
export const initializeGame = (room) => {
  return {
    currentPlayerIndex: 0,
    dice: [0, 0],
    lastRoll: null,
    doublesCount: 0,
    phase: 'rolling', // rolling, buying, trading, building, ended
    winner: null,
    turnCount: 0,
    freeParkingPot: 0,
    chanceCards: shuffleArray([...chanceCards]),
    communityChestCards: shuffleArray([...communityChestCards]),
  };
};

// Roll dice
export const rollDice = () => {
  const die1 = Math.floor(Math.random() * 6) + 1;
  const die2 = Math.floor(Math.random() * 6) + 1;
  return [die1, die2];
};

// Check if roll is doubles
export const isDoubles = (dice) => {
  return dice[0] === dice[1];
};

// Move player
export const movePlayer = (currentPosition, spaces) => {
  let newPosition = (currentPosition + spaces) % 40;
  const passedGo = (currentPosition + spaces) >= 40;
  return { newPosition, passedGo };
};

// Calculate rent
export const calculateRent = (property, owner, players, customRules) => {
  const space = boardSpaces.find(s => s.id === property.spaceId);
  
  if (!space || space.type !== 'property') return 0;
  
  // Check if in jail and rent collection is disabled
  if (customRules?.noRentInJail && owner.inJail) {
    return 0;
  }
  
  // Check if property is mortgaged
  if (property.mortgaged) return 0;
  
  // Check for monopoly (full color set ownership)
  const colorSet = colorGroups[space.color];
  const ownsFullSet = colorSet.every(spaceId => {
    const prop = Object.values(players).find(p => 
      p.properties.some(pr => pr.spaceId === spaceId)
    );
    return prop && prop.id === owner.id;
  });
  
  if (space.type === 'property') {
    const houses = property.houses || 0;
    let rent = space.rent[houses];
    
    // Double rent if monopoly but no houses
    if (ownsFullSet && houses === 0) {
      rent *= 2;
    }
    
    return rent;
  }
  
  if (space.type === 'railroad') {
    // Count railroads owned
    const railroadsOwned = owner.properties.filter(p => {
      const s = boardSpaces.find(bs => bs.id === p.spaceId);
      return s && s.type === 'railroad';
    }).length;
    
    return space.rent[railroadsOwned - 1];
  }
  
  if (space.type === 'utility') {
    // Count utilities owned
    const utilitiesOwned = owner.properties.filter(p => {
      const s = boardSpaces.find(bs => bs.id === p.spaceId);
      return s && s.type === 'utility';
    }).length;
    
    // Rent is 4x or 10x dice roll
    const multiplier = utilitiesOwned === 1 ? 4 : 10;
    return multiplier; // Will be multiplied by dice roll
  }
  
  return 0;
};

// Check if player can buy property
export const canBuyProperty = (player, spaceId) => {
  const space = boardSpaces.find(s => s.id === spaceId);
  if (!space || !space.price) return false;
  
  return player.money >= space.price;
};

// Buy property
export const buyProperty = (player, spaceId) => {
  const space = boardSpaces.find(s => s.id === spaceId);
  if (!space || !space.price) return null;
  
  return {
    spaceId: spaceId,
    houses: 0,
    hotels: 0,
    mortgaged: false,
  };
};

// Check if player can build
export const canBuild = (player, spaceId, customRules) => {
  const space = boardSpaces.find(s => s.id === spaceId);
  if (!space || space.type !== 'property') return false;
  
  // Must own the property
  const property = player.properties.find(p => p.spaceId === spaceId);
  if (!property || property.mortgaged) return false;
  
  // Must own full color set
  const colorSet = colorGroups[space.color];
  const ownsFullSet = colorSet.every(id => 
    player.properties.some(p => p.spaceId === id)
  );
  
  if (!ownsFullSet) return false;
  
  // Can't build beyond hotel
  if (property.hotels >= 1) return false;
  
  // Check if player has enough money
  if (player.money < space.houseCost) return false;
  
  // Check even build rule
  if (customRules?.evenBuildRule) {
    const houseCounts = colorSet.map(id => {
      const prop = player.properties.find(p => p.spaceId === id);
      return prop ? (prop.houses || 0) : 0;
    });
    
    const currentHouses = property.houses || 0;
    const minHouses = Math.min(...houseCounts);
    
    // Can't build if this property is ahead
    if (currentHouses > minHouses) return false;
  }
  
  return true;
};

// Build house/hotel
export const buildHouse = (property, space) => {
  const currentHouses = property.houses || 0;
  
  if (currentHouses < 4) {
    return {
      ...property,
      houses: currentHouses + 1
    };
  } else if (currentHouses === 4) {
    // Upgrade to hotel
    return {
      ...property,
      houses: 0,
      hotels: 1
    };
  }
  
  return property;
};

// Mortgage property
export const mortgageProperty = (property, space) => {
  return {
    ...property,
    mortgaged: true
  };
};

// Unmortgage property
export const unmortgageProperty = (property, space) => {
  return {
    ...property,
    mortgaged: false
  };
};

// Check bankruptcy
export const isBankrupt = (player) => {
  // Calculate total assets
  const propertyValue = player.properties.reduce((sum, prop) => {
    const space = boardSpaces.find(s => s.id === prop.spaceId);
    if (!space) return sum;
    
    let value = space.price || 0;
    if (prop.mortgaged) value = value / 2;
    value += (prop.houses || 0) * (space.houseCost || 0) / 2;
    value += (prop.hotels || 0) * (space.houseCost || 0) * 5 / 2;
    
    return sum + value;
  }, 0);
  
  return (player.money + propertyValue) < 0;
};

// Check winning condition
export const checkWinCondition = (gameState, players, customRules) => {
  const activePlayers = players.filter(p => !p.bankrupt);
  
  if (activePlayers.length === 1) {
    return activePlayers[0];
  }
  
  const condition = customRules.winningCondition;
  
  if (condition.type === 'time_limit') {
    if (gameState.turnCount >= condition.value * activePlayers.length) {
      // Find richest player
      return activePlayers.reduce((richest, player) => {
        const playerWealth = calculateWealth(player);
        const richestWealth = calculateWealth(richest);
        return playerWealth > richestWealth ? player : richest;
      });
    }
  }
  
  if (condition.type === 'money_goal') {
    const winner = activePlayers.find(p => p.money >= condition.value);
    if (winner) return winner;
  }
  
  return null;
};

// Calculate total wealth
export const calculateWealth = (player) => {
  const propertyValue = player.properties.reduce((sum, prop) => {
    const space = boardSpaces.find(s => s.id === prop.spaceId);
    if (!space) return sum;
    
    let value = space.price || 0;
    if (prop.mortgaged) value = value / 2;
    value += (prop.houses || 0) * (space.houseCost || 0);
    value += (prop.hotels || 0) * (space.houseCost || 0) * 5;
    
    return sum + value;
  }, 0);
  
  return player.money + propertyValue;
};

// Shuffle array
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Update game state in Firestore
export const updateGameState = async (roomId, updates) => {
  try {
    const roomRef = doc(db, 'rooms', roomId);
    await updateDoc(roomRef, {
      gameState: updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating game state:', error);
    throw error;
  }
};

// Handle landing on space
export const handleLandOnSpace = async (roomId, player, spaceId, diceTotal) => {
  const space = boardSpaces.find(s => s.id === spaceId);
  if (!space) return;
  
  const roomDoc = await getDoc(doc(db, 'rooms', roomId));
  const roomData = roomDoc.data();
  const gameState = roomData.gameState;
  const customRules = roomData.customRules;
  
  let updates = {};
  
  switch (space.type) {
    case 'property':
    case 'railroad':
    case 'utility':
      // Check if owned
      const owner = roomData.players.find(p => 
        p.properties.some(prop => prop.spaceId === spaceId)
      );
      
      if (!owner) {
        // Property available for purchase
        updates.phase = 'buying';
        updates.availableProperty = spaceId;
      } else if (owner.id !== player.id) {
        // Pay rent
        const rent = calculateRent(
          owner.properties.find(p => p.spaceId === spaceId),
          owner,
          roomData.players,
          customRules
        );
        
        let finalRent = rent;
        if (space.type === 'utility') {
          finalRent = rent * diceTotal;
        }
        
        updates.rentDue = {
          from: player.id,
          to: owner.id,
          amount: finalRent
        };
      }
      break;
      
    case 'tax':
      if (customRules.taxesToFreeParking) {
        updates.freeParkingPot = (gameState.freeParkingPot || 0) + space.amount;
      }
      updates.taxDue = space.amount;
      break;
      
    case 'chance':
    case 'community-chest':
      updates.cardDrawn = true;
      break;
      
    case 'go-to-jail':
      updates.sendToJail = true;
      break;
      
    case 'free-parking':
      if (customRules.taxesToFreeParking && gameState.freeParkingPot > 0) {
        updates.collectFromParking = gameState.freeParkingPot;
        updates.freeParkingPot = 0;
      }
      break;
  }
  
  await updateGameState(roomId, { ...gameState, ...updates });
};
