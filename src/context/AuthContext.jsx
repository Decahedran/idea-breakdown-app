import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined); // key change: undefined instead of null

  useEffect(() => {
  const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    console.log("🔑 Initial session from getSession:", session);
    setSession(session ?? null);
  };
  getSession();

  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    console.log("🔄 Auth state changed:", session);
    setSession(session ?? null);
  });

  return () => listener.subscription.unsubscribe();
}, []);


  return (
    <AuthContext.Provider value={{ session, user: session?.user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
