import { 
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const createRoom = async (roomData, hostUser) => {
  try {
    const room = {
      name: roomData.roomName,
      boardId: roomData.boardId,
      boardName: roomData.boardName,
      maxPlayers: roomData.maxPlayers,
      isPrivate: roomData.isPrivate,
      hostId: hostUser?.uid || 'guest',
      hostName: hostUser?.username || hostUser?.displayName || 'Guest',
      status: 'waiting',
      players: [{
        id: hostUser?.uid || 'guest-' + Date.now(),
        username: hostUser?.username || hostUser?.displayName || 'Guest',
        avatar: hostUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=Guest`,
        ready: false,
        isHost: true,
        position: 0,
        money: roomData.customRules.startingCash,
        properties: [],
        inJail: false
      }],
      customRules: roomData.customRules,
      winningCondition: roomData.winningCondition,
      gameState: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'rooms'), room);
    
    return {
      id: docRef.id,
      ...room,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

export const getRooms = async (includePrivate = false) => {
  try {
    const roomsRef = collection(db, 'rooms');
    let q = roomsRef;
    
    if (!includePrivate) {
      q = query(roomsRef, where('isPrivate', '==', false));
    }

    const querySnapshot = await getDocs(q);
    const rooms = [];
    
    querySnapshot.forEach((doc) => {
      rooms.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return rooms;
  } catch (error) {
    console.error('Error getting rooms:', error);
    throw error;
  }
};

export const getRoom = async (roomId) => {
  try {
    const roomDoc = await getDoc(doc(db, 'rooms', roomId));
    
    if (roomDoc.exists()) {
      return {
        id: roomDoc.id,
        ...roomDoc.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting room:', error);
    throw error;
  }
};

export const joinRoom = async (roomId, player) => {
  try {
    const roomRef = doc(db, 'rooms', roomId);
    const roomDoc = await getDoc(roomRef);
    
    if (!roomDoc.exists()) {
      throw new Error('Room not found');
    }

    const roomData = roomDoc.data();
    
    if (roomData.players.length >= roomData.maxPlayers) {
      throw new Error('Room is full');
    }

    if (roomData.status !== 'waiting') {
      throw new Error('Game already started');
    }

    const newPlayer = {
      id: player.id,
      username: player.username,
      avatar: player.avatar,
      ready: false,
      isHost: false,
      position: 0,
      money: roomData.customRules.startingCash,
      properties: [],
      inJail: false
    };

    await updateDoc(roomRef, {
      players: [...roomData.players, newPlayer],
      updatedAt: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('Error joining room:', error);
    throw error;
  }
};

export const leaveRoom = async (roomId, playerId) => {
  try {
    const roomRef = doc(db, 'rooms', roomId);
    const roomDoc = await getDoc(roomRef);
    
    if (!roomDoc.exists()) {
      return;
    }

    const roomData = roomDoc.data();
    const updatedPlayers = roomData.players.filter(p => p.id !== playerId);

    if (updatedPlayers.length === 0) {
      // Delete room if no players left
      await deleteDoc(roomRef);
    } else {
      // Update room with remaining players
      // If host left, assign new host
      if (roomData.hostId === playerId && updatedPlayers.length > 0) {
        updatedPlayers[0].isHost = true;
        await updateDoc(roomRef, {
          players: updatedPlayers,
          hostId: updatedPlayers[0].id,
          hostName: updatedPlayers[0].username,
          updatedAt: serverTimestamp()
        });
      } else {
        await updateDoc(roomRef, {
          players: updatedPlayers,
          updatedAt: serverTimestamp()
        });
      }
    }
  } catch (error) {
    console.error('Error leaving room:', error);
    throw error;
  }
};

export const subscribeToRoom = (roomId, callback) => {
  const roomRef = doc(db, 'rooms', roomId);
  
  return onSnapshot(roomRef, (doc) => {
    if (doc.exists()) {
      callback({
        id: doc.id,
        ...doc.data()
      });
    } else {
      callback(null);
    }
  });
};

export const subscribeToRooms = (callback) => {
  const roomsRef = collection(db, 'rooms');
  const q = query(roomsRef, where('isPrivate', '==', false));
  
  return onSnapshot(q, (querySnapshot) => {
    const rooms = [];
    querySnapshot.forEach((doc) => {
      rooms.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(rooms);
  });
};

export const updatePlayerReady = async (roomId, playerId, ready) => {
  try {
    const roomRef = doc(db, 'rooms', roomId);
    const roomDoc = await getDoc(roomRef);
    
    if (!roomDoc.exists()) {
      throw new Error('Room not found');
    }

    const roomData = roomDoc.data();
    const updatedPlayers = roomData.players.map(p => 
      p.id === playerId ? { ...p, ready } : p
    );

    await updateDoc(roomRef, {
      players: updatedPlayers,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating player ready status:', error);
    throw error;
  }
};

export const startGame = async (roomId) => {
  try {
    const roomRef = doc(db, 'rooms', roomId);
    await updateDoc(roomRef, {
      status: 'in-progress',
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error starting game:', error);
    throw error;
  }
};