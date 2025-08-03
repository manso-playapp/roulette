import { createContext, useContext, useEffect, useState } from 'react';
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

// Tipos simplificados
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
  loginAsDemo: () => Promise<void>;
  isDeveloper: boolean;
  isClient: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Email del desarrollador
const DEVELOPER_EMAIL = 'grupomanso@gmail.com';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Timeout de seguridad para el loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('⚠️ Auth loading timeout reached');
        setLoading(false);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [loading]);

  const getUserData = async (firebaseUser: FirebaseUser): Promise<User | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: userData.displayName || firebaseUser.displayName || undefined,
          role: (userData.role || 'client') as 'developer' | 'client',
          createdAt: userData.createdAt?.toDate?.() || new Date(userData.createdAt) || new Date(),
          lastLogin: new Date(),
          isActive: userData.isActive !== undefined ? userData.isActive : true,
        };
        
        return user;
      } else {
        return null;
      }
      
    } catch (error) {
      logger.error('Error getting user data:', error);
      return null;
    }
  };

  const createUserDocument = async (firebaseUser: FirebaseUser, displayName?: string): Promise<User> => {
    const isDev = firebaseUser.email === DEVELOPER_EMAIL;
    
    // Asegurar que no enviamos undefined a Firestore
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
      
      try {
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
      } catch (error) {
        logger.error('Error in auth state change:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
    
    if (displayName) {
      await updateProfile(firebaseUser, { displayName });
    }
    
    await createUserDocument(firebaseUser, displayName);
  };

  const logout = async () => {
    await signOut(auth);
  };

  // Función para login demo sin Firebase Auth (solo para desarrollo/demo)
  const loginAsDemo = async () => {
    try {
      console.log('🎯 AuthProvider - Iniciando login demo...');
      setLoading(true);
      
      // Crear usuario demo temporal
      const demoUser: User = {
        uid: 'demo-user-' + Date.now(),
        email: 'demo@roulette.com',
        displayName: 'Usuario Demo',
        role: 'developer',
        createdAt: new Date(),
        lastLogin: new Date(),
        isActive: true,
      };
      
      console.log('🎯 AuthProvider - Usuario demo creado:', demoUser);
      setUser(demoUser);
      logger.info('Usuario demo iniciado exitosamente');
    } catch (error) {
      console.error('❌ AuthProvider - Error en login demo:', error);
      logger.error('Error en login demo:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logout,
    loginAsDemo,
    isDeveloper: user?.role === 'developer',
    isClient: user?.role === 'client',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
