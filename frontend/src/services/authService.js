import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const signUpUser = async (email, password, username) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with username
    await updateProfile(user, {
      displayName: username
    });

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      username: username,
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      isPremium: false,
      gamesPlayed: 0,
      gamesWon: 0,
      createdAt: new Date().toISOString()
    });

    return {
      id: user.uid,
      username: username,
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      isPremium: false,
      gamesPlayed: 0,
      gamesWon: 0
    };
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      // Fallback if user document doesn't exist
      return {
        id: user.uid,
        username: user.displayName || email.split('@')[0],
        email: user.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        isPremium: false,
        gamesPlayed: 0,
        gamesWon: 0
      };
    }
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};