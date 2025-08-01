import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { logger } from '../utils/logger';

// Tipos simplificados compatibles con tu estructura actual
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: 'developer' | 'client';
  createdAt: Date;
  lastLogin: Date;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  isDeveloper: boolean;
  isClient: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Email del desarrollador
const DEVELOPER_EMAIL = 'grupomanso@gmail.com';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserData = async (firebaseUser: FirebaseUser): Promise<User | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || undefined,
          ...userData,
          createdAt: userData.createdAt?.toDate() || new Date(),
          lastLogin: new Date(),
        } as User;
      }
      
      return null;
    } catch (error) {
      logger.error('Error getting user data:', error);
      return null;
    }
  };

  const createUserDocument = async (firebaseUser: FirebaseUser, displayName?: string): Promise<User> => {
    const isDev = firebaseUser.email === DEVELOPER_EMAIL;
    
    const userData: any = {
      email: firebaseUser.email!,
      role: (isDev ? 'developer' : 'client') as 'developer' | 'client',
      createdAt: new Date(),
      lastLogin: new Date(),
      isActive: true,
    };

    // Solo agregar displayName si existe
    const name = displayName || firebaseUser.displayName;
    if (name) {
      userData.displayName = name;
    }

    try {
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      
      return { 
        uid: firebaseUser.uid, 
        ...userData,
        displayName: name
      } as User;
    } catch (error) {
      logger.error('Error creating user document:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        let userData = await getUserData(firebaseUser);
        
        if (!userData) {
          userData = await createUserDocument(firebaseUser);
        } else {
          // Actualizar último login
          await updateDoc(doc(db, 'users', firebaseUser.uid), {
            lastLogin: new Date(),
          });
        }
        
        setUser(userData);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      if (displayName) {
        await updateProfile(firebaseUser, { displayName });
      }
      
      await createUserDocument(firebaseUser, displayName);
    } catch (error) {
      logger.error('Error signing up:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      logger.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logout,
    isDeveloper: user?.role === 'developer',
    isClient: user?.role === 'client',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
