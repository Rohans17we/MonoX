import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../config/firebase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { ArrowLeft, Dice1, Users, DollarSign, Home, Hotel } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import GameBoard from '../components/GameBoard';
import { subscribeToRoom, leaveRoom, updatePlayerReady, startGame } from '../services/roomService';
import { 
  initializeGame, 
  rollDice, 
  isDoubles,
  movePlayer, 
  updateGameState,
  canBuyProperty,
  buyProperty,
  calculateRent,
  canBuild,
  buildHouse,
  checkWinCondition
} from '../services/gameService';
import { boardSpaces, playerColors } from '../data/boardData';

const GameRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rolling, setRolling] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    // Subscribe to room updates
    const unsubscribe = subscribeToRoom(roomId, (room) => {
      if (!room) {
        toast({
          title: 'Room not found',
          description: 'This room no longer exists',
          variant: 'destructive',
        });
        navigate('/dashboard');
        return;
      }
      
      // Assign player colors if not assigned
      if (room.players && room.players.length > 0) {
        room.players = room.players.map((p, idx) => ({
          ...p,
          color: p.color || playerColors[idx % playerColors.length].color,
          colorName: p.colorName || playerColors[idx % playerColors.length].name
        }));
      }
      
      setRoomData(room);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [roomId, navigate]);

  const getCurrentPlayer = () => {
    if (!roomData || !roomData.gameState) return null;
    return roomData.players[roomData.gameState.currentPlayerIndex];
  };

  const getMyPlayer = () => {
    const currentUser = auth.currentUser;
    const userId = currentUser?.uid || sessionStorage.getItem('guestNickname');
    return roomData?.players.find(p => p.id === userId || p.username === userId);
  };

  const isMyTurn = () => {
    const current = getCurrentPlayer();
    const me = getMyPlayer();
    return current && me && current.id === me.id;
  };

  const handleLeaveRoom = async () => {
    try {
      const myPlayer = getMyPlayer();
      if (myPlayer) {
        await leaveRoom(roomId, myPlayer.id);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  const handleStartGame = async () => {
    try {
      // Initialize game state
      const gameState = initializeGame(roomData);
      
      // Initialize players with starting cash and positions
      const initializedPlayers = roomData.players.map((player, index) => ({
        ...player,
        money: roomData.customRules.startingCash,
        position: 0,
        properties: [],
        jailFreeCards: 0,
        inJail: false,
        jailTurns: 0,
        bankrupt: false,
        color: playerColors[index % playerColors.length].color,
        colorName: playerColors[index % playerColors.length].name
      }));

      await updateGameState(roomId, {
        ...gameState,
        phase: 'rolling',
        players: initializedPlayers,
        status: 'in-progress'
      });
      
      await startGame(roomId);
      
      toast({
        title: 'Game started!',
        description: 'Let the monopoly begin!',
      });
    } catch (error) {
      console.error('Error starting game:', error);
      toast({
        title: 'Error',
        description: 'Failed to start game',
        variant: 'destructive',
      });
    }
  };

  const handleRollDice = async () => {
    if (!isMyTurn() || rolling) return;
    
    setRolling(true);
    
    try {
      const dice = rollDice();
      const diceTotal = dice[0] + dice[1];
      const doubles = isDoubles(dice);
      
      const currentPlayer = getCurrentPlayer();
      const { newPosition, passedGo } = movePlayer(currentPlayer.position, diceTotal);
      
      // Update player position
      const updatedPlayers = roomData.players.map(p => {
        if (p.id === currentPlayer.id) {
          let newMoney = p.money;
          if (passedGo) {
            newMoney += 200;
            toast({
              title: 'Passed GO!',
              description: 'Collect $200',
            });
          }
          return {
            ...p,
            position: newPosition,
            money: newMoney
          };
        }
        return p;
      });
      
      let newGameState = {
        ...roomData.gameState,
        dice: dice,
        lastRoll: Date.now(),
        players: updatedPlayers
      };
      
      // Check if doubles
      if (doubles) {
        newGameState.doublesCount = (roomData.gameState.doublesCount || 0) + 1;
        
        if (newGameState.doublesCount === 3) {
          // Go to jail on 3rd double
          toast({
            title: '3 Doubles!',
            description: 'Go to Jail!',
            variant: 'destructive',
          });
          newGameState.doublesCount = 0;
          // Handle jail logic here
        } else {
          toast({
            title: 'Doubles!',
            description: 'Roll again!',
          });
        }
      } else {
        newGameState.doublesCount = 0;
      }
      
      // Handle landing on space
      const landedSpace = boardSpaces.find(s => s.id === newPosition);
      if (landedSpace) {
        await handleLandOnSpace(landedSpace, currentPlayer, diceTotal);
      }
      
      await updateGameState(roomId, newGameState);
      
    } catch (error) {
      console.error('Error rolling dice:', error);
      toast({
        title: 'Error',
        description: 'Failed to roll dice',
        variant: 'destructive',
      });
    } finally {
      setRolling(false);
    }
  };

  const handleLandOnSpace = async (space, player, diceTotal) => {
    switch (space.type) {
      case 'property':
      case 'railroad':
      case 'utility':
        const owner = roomData.players.find(p => 
          p.properties && p.properties.some(prop => prop.spaceId === space.id)
        );
        
        if (!owner) {
          // Property available
          toast({
            title: space.name,
            description: `Available for $${space.price}`,
          });
          setSelectedProperty(space);
        } else if (owner.id !== player.id) {
          // Pay rent
          const ownerProperty = owner.properties.find(p => p.spaceId === space.id);
          let rent = calculateRent(ownerProperty, owner, roomData.players, roomData.customRules);
          
          if (space.type === 'utility') {
            rent = rent * diceTotal;
          }
          
          await handlePayRent(player, owner, rent);
        }
        break;
        
      case 'tax':
        await handlePayTax(player, space.amount);
        break;
        
      case 'go-to-jail':
        toast({
          title: 'Go to Jail!',
          description: 'Do not pass GO, do not collect $200',
          variant: 'destructive',
        });
        // Handle jail
        break;
    }
  };

  const handleBuyProperty = async () => {
    if (!selectedProperty || !isMyTurn()) return;
    
    const currentPlayer = getCurrentPlayer();
    
    if (!canBuyProperty(currentPlayer, selectedProperty.id)) {
      toast({
        title: 'Cannot buy',
        description: 'Not enough money',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const property = buyProperty(currentPlayer, selectedProperty.id);
      
      const updatedPlayers = roomData.players.map(p => {
        if (p.id === currentPlayer.id) {
          return {
            ...p,
            money: p.money - selectedProperty.price,
            properties: [...(p.properties || []), property]
          };
        }
        return p;
      });
      
      await updateGameState(roomId, {
        ...roomData.gameState,
        players: updatedPlayers
      });
      
      toast({
        title: 'Property purchased!',
        description: `You bought ${selectedProperty.name}`,
      });
      
      setSelectedProperty(null);
    } catch (error) {
      console.error('Error buying property:', error);
    }
  };

  const handlePayRent = async (player, owner, amount) => {
    const updatedPlayers = roomData.players.map(p => {
      if (p.id === player.id) {
        return { ...p, money: p.money - amount };
      }
      if (p.id === owner.id) {
        return { ...p, money: p.money + amount };
      }
      return p;
    });
    
    await updateGameState(roomId, {
      ...roomData.gameState,
      players: updatedPlayers
    });
    
    toast({
      title: 'Rent paid',
      description: `$${amount} paid to ${owner.username}`,
      variant: 'destructive',
    });
  };

  const handlePayTax = async (player, amount) => {
    const updatedPlayers = roomData.players.map(p => {
      if (p.id === player.id) {
        return { ...p, money: p.money - amount };
      }
      return p;
    });
    
    let updates = {
      ...roomData.gameState,
      players: updatedPlayers
    };
    
    if (roomData.customRules.taxesToFreeParking) {
      updates.freeParkingPot = (roomData.gameState.freeParkingPot || 0) + amount;
    }
    
    await updateGameState(roomId, updates);
    
    toast({
      title: 'Tax paid',
      description: `$${amount} paid in taxes`,
      variant: 'destructive',
    });
  };

  const handleEndTurn = async () => {
    if (!isMyTurn()) return;
    
    try {
      const nextPlayerIndex = (roomData.gameState.currentPlayerIndex + 1) % roomData.players.length;
      
      await updateGameState(roomId, {
        ...roomData.gameState,
        currentPlayerIndex: nextPlayerIndex,
        dice: [0, 0],
        turnCount: (roomData.gameState.turnCount || 0) + 1
      });
      
    } catch (error) {
      console.error('Error ending turn:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading room...</p>
        </div>
      </div>
    );
  }

  const currentPlayer = getCurrentPlayer();
  const myPlayer = getMyPlayer();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-emerald-50/50 to-teal-50/50 dark:from-green-950/10 dark:via-emerald-950/10 dark:to-teal-950/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleLeaveRoom}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Leave Room
          </Button>
          
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {roomData.status === 'waiting' ? 'Waiting for players' : 'In Progress'}
          </Badge>
        </div>

        {roomData.status === 'waiting' ? (
          // Waiting room
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{roomData.name}</CardTitle>
                <p className="text-muted-foreground">Board: {roomData.boardName}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Players ({roomData.players.length}/{roomData.maxPlayers})
                  </h3>
                  <div className="space-y-2">
                    {roomData.players.map((player) => (
                      <div key={player.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={player.avatar} />
                            <AvatarFallback>{player.username[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{player.username}</p>
                            {player.isHost && <Badge variant="secondary" className="text-xs">Host</Badge>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {myPlayer?.isHost && roomData.players.length >= 2 && (
                  <Button
                    onClick={handleStartGame}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700"
                    size="lg"
                  >
                    Start Game
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          // Game in progress
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Game Board */}
            <div className="lg:col-span-3">
              <GameBoard 
                gameState={roomData.gameState}
                players={roomData.players}
                onSpaceClick={setSelectedProperty}
              />
              
              {/* Game Controls */}
              {isMyTurn() && (
                <Card className="mt-4">
                  <CardContent className="p-4">
                    <div className="flex gap-2">
                      <Button
                        onClick={handleRollDice}
                        disabled={rolling}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700"
                        size="lg"
                      >
                        <Dice1 className="w-5 h-5 mr-2" />
                        {rolling ? 'Rolling...' : 'Roll Dice'}
                      </Button>
                      <Button
                        onClick={handleEndTurn}
                        variant="outline"
                        size="lg"
                      >
                        End Turn
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Current Turn */}
              {currentPlayer && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Turn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-full border-4 border-white shadow-lg"
                        style={{ backgroundColor: currentPlayer.color }}
                      />
                      <div>
                        <p className="font-bold">{currentPlayer.username}</p>
                        <p className="text-sm text-muted-foreground">
                          ${currentPlayer.money}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Players List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Players</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {roomData.players.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-2 rounded bg-muted/50">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-white shadow"
                          style={{ backgroundColor: player.color }}
                        />
                        <span className="text-sm font-medium">{player.username}</span>
                      </div>
                      <span className="text-sm font-bold">${player.money}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* My Properties */}
              {myPlayer && myPlayer.properties && myPlayer.properties.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">My Properties</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {myPlayer.properties.map((prop) => {
                      const space = boardSpaces.find(s => s.id === prop.spaceId);
                      return (
                        <div key={prop.spaceId} className="text-sm p-2 rounded bg-muted/50">
                          <p className="font-medium">{space?.name}</p>
                          {prop.houses > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <Home className="w-3 h-3" />
                              <span className="text-xs">{prop.houses} houses</span>
                            </div>
                          )}
                          {prop.hotels > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <Hotel className="w-3 h-3" />
                              <span className="text-xs">{prop.hotels} hotel</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Property Purchase Modal */}
        {selectedProperty && selectedProperty.type === 'property' && !roomData.players.find(p => p.properties?.some(pr => pr.spaceId === selectedProperty.id)) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedProperty(null)}>
            <Card className="max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <CardHeader>
                <CardTitle>{selectedProperty.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p><strong>Price:</strong> ${selectedProperty.price}</p>
                  <p><strong>Rent:</strong> ${selectedProperty.rent[0]}</p>
                  <p><strong>House Cost:</strong> ${selectedProperty.houseCost}</p>
                </div>
                {isMyTurn() && (
                  <div className="flex gap-2">
                    <Button onClick={handleBuyProperty} className="flex-1">
                      Buy for ${selectedProperty.price}
                    </Button>
                    <Button onClick={() => setSelectedProperty(null)} variant="outline">
                      Pass
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameRoom;
