import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types/auth';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string) => boolean;
  signup: (userData: {
    name: string;
    email: string;
    startingBalance?: number;
    carName?: string;
  }) => User;
  logout: () => void;
  switchDemoDriver: () => void;
  unlockCreatorMode: (passcode: string) => boolean;
  exitCreatorMode: () => void;
  isCreator: boolean;
  hasSeenTutorial: boolean;
  completeTutorial: () => void;
  resetTutorial: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default Creator and Initial Driver
const CREATOR_ACCOUNT: User = {
  id: 'user-creator-master',
  name: 'Ignition Creator',
  email: 'creator@ignition.pk',
  role: 'admin',
  createdAt: '2026-01-01T00:00:00.000Z',
  avatar: '👑'
};

const INITIAL_USERS: User[] = [
  CREATOR_ACCOUNT,
  {
    id: 'user-driver-1',
    name: 'Hamza',
    email: 'driver@ignition.pk',
    role: 'driver',
    targetCarName: 'Suzuki Alto VXR',
    startingBalance: 265000,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    avatar: '🏎️'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ignition_users_v2');
    if (saved) return JSON.parse(saved);
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ignition_current_user_v2');
    if (saved) return JSON.parse(saved);
    // Default to the first driver
    return INITIAL_USERS.find(u => u.role === 'driver') || INITIAL_USERS[1];
  });

  const [hasSeenTutorial, setHasSeenTutorial] = useState<boolean>(() => {
    const saved = localStorage.getItem('ignition_tutorial_seen');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('ignition_users_v2', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ignition_current_user_v2', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ignition_current_user_v2');
    }
  }, [currentUser]);

  // Regular user login - public
  const login = (email: string): boolean => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      // If someone tries logging into creator via standard form, require passcode via creator portal
      if (found.role === 'admin') {
        return false;
      }
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  // Regular user signup - ALWAYS creates role 'driver'
  const signup = (userData: {
    name: string;
    email: string;
    startingBalance?: number;
    carName?: string;
  }): User => {
    const newUser: User = {
      id: 'driver-' + Date.now(),
      name: userData.name,
      email: userData.email,
      role: 'driver', // Strictly driver
      startingBalance: userData.startingBalance ?? 0,
      targetCarName: userData.carName ?? 'Suzuki Alto VXR',
      createdAt: new Date().toISOString(),
      avatar: '🏎️'
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setHasSeenTutorial(false);
    localStorage.setItem('ignition_tutorial_seen', 'false');
    return newUser;
  };

  const logout = () => {
    // Return to default guest or first driver
    const driverDemo = users.find(u => u.role === 'driver') || null;
    setCurrentUser(driverDemo);
  };

  const switchDemoDriver = () => {
    const demo = users.find(u => u.email === 'driver@ignition.pk');
    if (demo) setCurrentUser(demo);
  };

  // Secret Creator Access - Master Passcode verification
  const unlockCreatorMode = (passcode: string): boolean => {
    // Secret Passcode for the Creator
    if (passcode.trim() === 'ignition2026' || passcode.trim() === 'creator875') {
      let creator = users.find(u => u.role === 'admin');
      if (!creator) {
        creator = CREATOR_ACCOUNT;
        setUsers(prev => [creator!, ...prev]);
      }
      setCurrentUser(creator);
      return true;
    }
    return false;
  };

  const exitCreatorMode = () => {
    const driver = users.find(u => u.role === 'driver') || INITIAL_USERS[1];
    setCurrentUser(driver);
  };

  const completeTutorial = () => {
    setHasSeenTutorial(true);
    localStorage.setItem('ignition_tutorial_seen', 'true');
  };

  const resetTutorial = () => {
    setHasSeenTutorial(false);
    localStorage.setItem('ignition_tutorial_seen', 'false');
  };

  const isCreator = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        signup,
        logout,
        switchDemoDriver,
        unlockCreatorMode,
        exitCreatorMode,
        isCreator,
        hasSeenTutorial,
        completeTutorial,
        resetTutorial
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
