import { useAuth } from '../hooks/useAuth';

export function DebugAuth() {
  const { user, loading, isDeveloper, isClient } = useAuth();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <div className="font-bold mb-2">🔍 Debug Auth</div>
      <div>Loading: {loading ? '✅' : '❌'}</div>
      <div>User: {user ? '✅' : '❌'}</div>
      {user && (
        <>
          <div>Email: {user.email}</div>
          <div>Role: {user.role}</div>
          <div>Developer: {isDeveloper ? '✅' : '❌'}</div>
          <div>Client: {isClient ? '✅' : '❌'}</div>
        </>
      )}
    </div>
  );
}
