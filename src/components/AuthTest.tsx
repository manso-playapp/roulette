import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { logger } from '../utils/logger';

export function AuthTest() {
  const [email, setEmail] = useState('grupomanso@gmail.com');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');

  const testLogin = async () => {
    try {
      logger.debug('Testing login with:', email);
      setResult('Intentando login...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      logger.success('Login successful:', userCredential.user.email);
      logger.debug('Auth current user after login:', auth.currentUser);
      setResult(`✅ Login exitoso: ${userCredential.user.email}`);
      
    } catch (error: any) {
      logger.error('Login failed:', error.message);
      setResult(`❌ Error: ${error.message}`);
    }
  };

  const testLogout = async () => {
    try {
      await signOut(auth);
      setResult('🚪 Logout exitoso');
    } catch (error: any) {
      setResult(`❌ Error logout: ${error.message}`);
    }
  };

  const cleanUserDoc = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setResult('Limpiando documento...');
        console.log('🧹 Cleaning user document for:', currentUser.uid);
        
        // Importar deleteDoc
        const { deleteDoc, doc } = await import('firebase/firestore');
        const { db } = await import('../firebase/config');
        
        await deleteDoc(doc(db, 'users', currentUser.uid));
        console.log('✅ User document deleted');
        setResult('✅ Documento limpiado. Haz logout/login.');
      } else {
        setResult('❌ No hay usuario logueado');
      }
    } catch (error: any) {
      console.error('❌ Clean error:', error);
      setResult(`❌ Error: ${error.message}`);
    }
  };

  const forceSync = async () => {
    console.log('🔄 Forcing auth sync...');
    const currentUser = auth.currentUser;
    console.log('Current user from auth:', currentUser);
    
    if (currentUser) {
      try {
        setResult('Sincronizando...');
        
        // Forzar trigger del onAuthStateChanged
        console.log('🔄 Triggering manual auth state change...');
        
        // Primero intentar hacer logout y login again
        await signOut(auth);
        console.log('🔄 Signed out, signing back in...');
        
        // Pequeña pausa
        setTimeout(async () => {
          // El usuario debería estar en los inputs del panel de test
          if (email && password) {
            try {
              await signInWithEmailAndPassword(auth, email, password);
              setResult('✅ Sincronización forzada exitosa');
            } catch (error: any) {
              setResult(`❌ Error en re-login: ${error.message}`);
            }
          } else {
            setResult('❌ Ingresa email y password para re-login');
          }
        }, 500);
        
      } catch (error: any) {
        console.error('❌ Force sync error:', error);
        setResult(`❌ Error en sync: ${error.message}`);
      }
    } else {
      setResult('❌ No hay usuario para sincronizar');
    }
  };

  const checkAuthState = () => {
    console.log('🔍 Manual auth state check:');
    console.log('- auth.currentUser:', auth.currentUser);
    console.log('- auth.currentUser?.email:', auth.currentUser?.email);
    console.log('- auth.currentUser?.uid:', auth.currentUser?.uid);
    setResult(`Current user: ${auth.currentUser?.email || 'None'}`);
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-300 p-4 rounded-lg shadow-lg max-w-xs z-50">
      <div className="font-bold mb-2">🧪 Auth Test</div>
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full mb-2 px-2 py-1 border rounded text-sm"
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full mb-2 px-2 py-1 border rounded text-sm"
      />
      
      <div className="flex gap-1 mb-2">
        <button 
          onClick={testLogin}
          className="flex-1 bg-blue-500 text-white px-2 py-1 rounded text-xs"
        >
          Login
        </button>
        <button 
          onClick={testLogout}
          className="flex-1 bg-red-500 text-white px-2 py-1 rounded text-xs"
        >
          Logout
        </button>
      </div>
      
      <button 
        onClick={checkAuthState}
        className="w-full bg-green-500 text-white px-2 py-1 rounded text-xs mb-1"
      >
        Check State
      </button>
      
      <button 
        onClick={forceSync}
        className="w-full bg-purple-500 text-white px-2 py-1 rounded text-xs mb-1"
      >
        Force Sync (Logout/Login)
      </button>
      
      <button 
        onClick={cleanUserDoc}
        className="w-full bg-orange-500 text-white px-2 py-1 rounded text-xs mb-2"
      >
        Clean User Doc
      </button>
      
      <div className="text-xs bg-gray-100 p-2 rounded">
        {result || 'Sin resultado'}
      </div>
    </div>
  );
}
