// Mock data for development

export const mockBoards = [
  {
    id: 'international',
    name: 'International Classic',
    description: 'The classic Monopoly board with international properties',
    image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400&h=300&fit=crop',
    isPremium: false,
    properties: [
      { name: 'Boardwalk', color: 'blue', price: 400 },
      { name: 'Park Place', color: 'blue', price: 350 },
      { name: 'Pennsylvania Avenue', color: 'green', price: 320 },
    ]
  },
  {
    id: 'india',
    name: 'India Edition',
    description: 'Experience Indian cities and landmarks',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=300&fit=crop',
    isPremium: false,
    properties: [
      { name: 'Mumbai', color: 'blue', price: 400 },
      { name: 'Delhi', color: 'blue', price: 350 },
      { name: 'Bangalore', color: 'green', price: 320 },
    ]
  },
  {
    id: 'europe',
    name: 'European Cities',
    description: 'Tour through famous European destinations',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop',
    isPremium: true,
    properties: [
      { name: 'Paris', color: 'blue', price: 400 },
      { name: 'London', color: 'blue', price: 350 },
      { name: 'Rome', color: 'green', price: 320 },
    ]
  },
  {
    id: 'asia',
    name: 'Asian Markets',
    description: 'Explore bustling Asian cities',
    image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=400&h=300&fit=crop',
    isPremium: true,
    properties: [
      { name: 'Tokyo', color: 'blue', price: 400 },
      { name: 'Singapore', color: 'blue', price: 350 },
      { name: 'Hong Kong', color: 'green', price: 320 },
    ]
  },
];

export const mockRooms = [
  {
    id: 'room1',
    name: 'Friendly Game',
    board: 'international',
    boardName: 'International Classic',
    players: 3,
    maxPlayers: 4,
    isPrivate: false,
    status: 'waiting',
    host: 'Player123',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'room2',
    name: 'Quick Match',
    board: 'india',
    boardName: 'India Edition',
    players: 2,
    maxPlayers: 6,
    isPrivate: false,
    status: 'waiting',
    host: 'GameMaster',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'room3',
    name: 'Pro Tournament',
    board: 'europe',
    boardName: 'European Cities',
    players: 4,
    maxPlayers: 4,
    isPrivate: false,
    status: 'in-progress',
    host: 'ProGamer',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'room4',
    name: 'Evening Fun',
    board: 'international',
    boardName: 'International Classic',
    players: 1,
    maxPlayers: 4,
    isPrivate: false,
    status: 'waiting',
    host: 'ChillPlayer',
    createdAt: new Date().toISOString(),
  },
];

export const mockUsers = [
  {
    id: 'user1',
    username: 'Player123',
    email: 'player123@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Player123',
    isPremium: false,
    gamesPlayed: 45,
    gamesWon: 12,
    createdAt: '2024-01-15',
  },
];