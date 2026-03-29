import React, { useState } from 'react';
import { Utensils, LogIn } from 'lucide-react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Button } from './ui/Button';

interface LoginProps {
  onLogin: (username: string) => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    try {
      const userQuery = query(collection(db, 'users'), where('username', '==', username), limit(1));
      const userSnap = await getDocs(userQuery);

      if (userSnap.empty) {
        setError('Fel användarnamn eller lösenord');
      } else {
        const userData = userSnap.docs[0].data();
        if (userData.password === password) {
          onLogin(username);
        } else {
          setError('Fel användarnamn eller lösenord');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Ett fel uppstod vid inloggning');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9F7] p-6 text-center">
      <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-8">
        <Utensils size={40} className="text-black" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Middagskompisen</h1>
      <p className="text-gray-500 max-w-md mb-8">
        Logga in för att planera din vecka och spara dina recept.
      </p>
      
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <div className="space-y-2">
          <input 
            type="text" 
            placeholder="Användarnamn"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-black outline-none transition-all"
            required
          />
          <input 
            type="password" 
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-black outline-none transition-all"
            required
          />
        </div>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <Button 
          type="submit" 
          size="lg" 
          className="w-full" 
          loading={isLoggingIn}
          icon={LogIn}
        >
          Logga in
        </Button>
      </form>
    </div>
  );
};
