// Complete Monopoly Board Data - 40 spaces

export const boardSpaces = [
  // Bottom row (0-10) - Right to Left
  { 
    id: 0, 
    name: 'GO', 
    type: 'go', 
    position: 'corner-bottom-right',
    description: 'Collect $200'
  },
  { 
    id: 1, 
    name: 'Mediterranean Avenue', 
    type: 'property', 
    color: 'brown',
    price: 60,
    rent: [2, 10, 30, 90, 160, 250],
    houseCost: 50,
    position: 'bottom'
  },
  { 
    id: 2, 
    name: 'Community Chest', 
    type: 'community-chest', 
    position: 'bottom'
  },
  { 
    id: 3, 
    name: 'Baltic Avenue', 
    type: 'property', 
    color: 'brown',
    price: 60,
    rent: [4, 20, 60, 180, 320, 450],
    houseCost: 50,
    position: 'bottom'
  },
  { 
    id: 4, 
    name: 'Income Tax', 
    type: 'tax',
    amount: 200,
    position: 'bottom'
  },
  { 
    id: 5, 
    name: 'Reading Railroad', 
    type: 'railroad',
    price: 200,
    rent: [25, 50, 100, 200],
    position: 'bottom'
  },
  { 
    id: 6, 
    name: 'Oriental Avenue', 
    type: 'property', 
    color: 'lightblue',
    price: 100,
    rent: [6, 30, 90, 270, 400, 550],
    houseCost: 50,
    position: 'bottom'
  },
  { 
    id: 7, 
    name: 'Chance', 
    type: 'chance', 
    position: 'bottom'
  },
  { 
    id: 8, 
    name: 'Vermont Avenue', 
    type: 'property', 
    color: 'lightblue',
    price: 100,
    rent: [6, 30, 90, 270, 400, 550],
    houseCost: 50,
    position: 'bottom'
  },
  { 
    id: 9, 
    name: 'Connecticut Avenue', 
    type: 'property', 
    color: 'lightblue',
    price: 120,
    rent: [8, 40, 100, 300, 450, 600],
    houseCost: 50,
    position: 'bottom'
  },
  { 
    id: 10, 
    name: 'Jail / Just Visiting', 
    type: 'jail', 
    position: 'corner-bottom-left'
  },
  
  // Left side (11-20) - Bottom to Top
  { 
    id: 11, 
    name: 'St. Charles Place', 
    type: 'property', 
    color: 'pink',
    price: 140,
    rent: [10, 50, 150, 450, 625, 750],
    houseCost: 100,
    position: 'left'
  },
  { 
    id: 12, 
    name: 'Electric Company', 
    type: 'utility',
    price: 150,
    position: 'left'
  },
  { 
    id: 13, 
    name: 'States Avenue', 
    type: 'property', 
    color: 'pink',
    price: 140,
    rent: [10, 50, 150, 450, 625, 750],
    houseCost: 100,
    position: 'left'
  },
  { 
    id: 14, 
    name: 'Virginia Avenue', 
    type: 'property', 
    color: 'pink',
    price: 160,
    rent: [12, 60, 180, 500, 700, 900],
    houseCost: 100,
    position: 'left'
  },
  { 
    id: 15, 
    name: 'Pennsylvania Railroad', 
    type: 'railroad',
    price: 200,
    rent: [25, 50, 100, 200],
    position: 'left'
  },
  { 
    id: 16, 
    name: 'St. James Place', 
    type: 'property', 
    color: 'orange',
    price: 180,
    rent: [14, 70, 200, 550, 750, 950],
    houseCost: 100,
    position: 'left'
  },
  { 
    id: 17, 
    name: 'Community Chest', 
    type: 'community-chest', 
    position: 'left'
  },
  { 
    id: 18, 
    name: 'Tennessee Avenue', 
    type: 'property', 
    color: 'orange',
    price: 180,
    rent: [14, 70, 200, 550, 750, 950],
    houseCost: 100,
    position: 'left'
  },
  { 
    id: 19, 
    name: 'New York Avenue', 
    type: 'property', 
    color: 'orange',
    price: 200,
    rent: [16, 80, 220, 600, 800, 1000],
    houseCost: 100,
    position: 'left'
  },
  { 
    id: 20, 
    name: 'Free Parking', 
    type: 'free-parking', 
    position: 'corner-top-left'
  },
  
  // Top row (21-30) - Left to Right
  { 
    id: 21, 
    name: 'Kentucky Avenue', 
    type: 'property', 
    color: 'red',
    price: 220,
    rent: [18, 90, 250, 700, 875, 1050],
    houseCost: 150,
    position: 'top'
  },
  { 
    id: 22, 
    name: 'Chance', 
    type: 'chance', 
    position: 'top'
  },
  { 
    id: 23, 
    name: 'Indiana Avenue', 
    type: 'property', 
    color: 'red',
    price: 220,
    rent: [18, 90, 250, 700, 875, 1050],
    houseCost: 150,
    position: 'top'
  },
  { 
    id: 24, 
    name: 'Illinois Avenue', 
    type: 'property', 
    color: 'red',
    price: 240,
    rent: [20, 100, 300, 750, 925, 1100],
    houseCost: 150,
    position: 'top'
  },
  { 
    id: 25, 
    name: 'B&O Railroad', 
    type: 'railroad',
    price: 200,
    rent: [25, 50, 100, 200],
    position: 'top'
  },
  { 
    id: 26, 
    name: 'Atlantic Avenue', 
    type: 'property', 
    color: 'yellow',
    price: 260,
    rent: [22, 110, 330, 800, 975, 1150],
    houseCost: 150,
    position: 'top'
  },
  { 
    id: 27, 
    name: 'Ventnor Avenue', 
    type: 'property', 
    color: 'yellow',
    price: 260,
    rent: [22, 110, 330, 800, 975, 1150],
    houseCost: 150,
    position: 'top'
  },
  { 
    id: 28, 
    name: 'Water Works', 
    type: 'utility',
    price: 150,
    position: 'top'
  },
  { 
    id: 29, 
    name: 'Marvin Gardens', 
    type: 'property', 
    color: 'yellow',
    price: 280,
    rent: [24, 120, 360, 850, 1025, 1200],
    houseCost: 150,
    position: 'top'
  },
  { 
    id: 30, 
    name: 'Go To Jail', 
    type: 'go-to-jail', 
    position: 'corner-top-right'
  },
  
  // Right side (31-39) - Top to Bottom
  { 
    id: 31, 
    name: 'Pacific Avenue', 
    type: 'property', 
    color: 'green',
    price: 300,
    rent: [26, 130, 390, 900, 1100, 1275],
    houseCost: 200,
    position: 'right'
  },
  { 
    id: 32, 
    name: 'North Carolina Avenue', 
    type: 'property', 
    color: 'green',
    price: 300,
    rent: [26, 130, 390, 900, 1100, 1275],
    houseCost: 200,
    position: 'right'
  },
  { 
    id: 33, 
    name: 'Community Chest', 
    type: 'community-chest', 
    position: 'right'
  },
  { 
    id: 34, 
    name: 'Pennsylvania Avenue', 
    type: 'property', 
    color: 'green',
    price: 320,
    rent: [28, 150, 450, 1000, 1200, 1400],
    houseCost: 200,
    position: 'right'
  },
  { 
    id: 35, 
    name: 'Short Line Railroad', 
    type: 'railroad',
    price: 200,
    rent: [25, 50, 100, 200],
    position: 'right'
  },
  { 
    id: 36, 
    name: 'Chance', 
    type: 'chance', 
    position: 'right'
  },
  { 
    id: 37, 
    name: 'Park Place', 
    type: 'property', 
    color: 'darkblue',
    price: 350,
    rent: [35, 175, 500, 1100, 1300, 1500],
    houseCost: 200,
    position: 'right'
  },
  { 
    id: 38, 
    name: 'Luxury Tax', 
    type: 'tax',
    amount: 100,
    position: 'right'
  },
  { 
    id: 39, 
    name: 'Boardwalk', 
    type: 'property', 
    color: 'darkblue',
    price: 400,
    rent: [50, 200, 600, 1400, 1700, 2000],
    houseCost: 200,
    position: 'right'
  },
];

// Property color groups
export const colorGroups = {
  brown: [1, 3],
  lightblue: [6, 8, 9],
  pink: [11, 13, 14],
  orange: [16, 18, 19],
  red: [21, 23, 24],
  yellow: [26, 27, 29],
  green: [31, 32, 34],
  darkblue: [37, 39],
  railroad: [5, 15, 25, 35],
  utility: [12, 28]
};

// Color scheme mapping
export const propertyColors = {
  brown: '#8B4513',
  lightblue: '#87CEEB',
  pink: '#FF1493',
  orange: '#FFA500',
  red: '#FF0000',
  yellow: '#FFD700',
  green: '#228B22',
  darkblue: '#00008B',
  railroad: '#000000',
  utility: '#FFFFFF'
};

// Chance cards
export const chanceCards = [
  { text: 'Advance to GO. Collect $200', action: 'move', target: 0, collect: 200 },
  { text: 'Go to Jail. Do not pass GO.', action: 'jail' },
  { text: 'Pay each player $50', action: 'pay-all', amount: 50 },
  { text: 'Bank pays you $50', action: 'collect', amount: 50 },
  { text: 'Get out of Jail Free', action: 'jail-free' },
  { text: 'Go back 3 spaces', action: 'move-back', spaces: 3 },
  { text: 'Advance to Illinois Avenue', action: 'move', target: 24 },
  { text: 'Advance to St. Charles Place', action: 'move', target: 11 },
];

// Community Chest cards
export const communityChestCards = [
  { text: 'Bank error in your favor. Collect $200', action: 'collect', amount: 200 },
  { text: 'Doctor\'s fees. Pay $50', action: 'pay', amount: 50 },
  { text: 'From sale of stock you get $50', action: 'collect', amount: 50 },
  { text: 'Go to Jail. Do not pass GO.', action: 'jail' },
  { text: 'Get out of Jail Free', action: 'jail-free' },
  { text: 'Grand Opera Night. Collect $50 from every player', action: 'collect-all', amount: 50 },
  { text: 'Holiday Fund matures. Receive $100', action: 'collect', amount: 100 },
  { text: 'Income tax refund. Collect $20', action: 'collect', amount: 20 },
];

export const playerColors = [
  { name: 'Red', color: '#FF0000', icon: '🚗' },
  { name: 'Blue', color: '#0000FF', icon: '🚢' },
  { name: 'Green', color: '#00FF00', icon: '🎩' },
  { name: 'Yellow', color: '#FFD700', icon: '🐕' },
  { name: 'Purple', color: '#800080', icon: '🎸' },
  { name: 'Orange', color: '#FFA500', icon: '👢' },
];
