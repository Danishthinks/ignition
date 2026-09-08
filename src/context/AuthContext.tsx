import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole, SubscriptionPlan, SubscriptionDetails } from '../types/auth';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string, password?: string) => { success: boolean; message?: string };
  signup: (userData: {
    name: string;
    email: string;
    password?: string;
    startingBalance?: number;
    carName?: string;
  }) => { success: boolean; user?: User; message?: string };
  resetPassword: (email: string, newPassword: string) => { success: boolean; message?: string };
  logout: () => void;
  switchDemoDriver: () => void;
  unlockCreatorMode: (passcode: string) => boolean;
  exitCreatorMode: () => void;
  isCreator: boolean;
  isPro: boolean;
  subscription: SubscriptionDetails | null;
  upgradeToPro: (
    plan: SubscriptionPlan,
    details: {
      trxId: string;
      senderPhone?: string;
      senderName?: string;
      paymentMethod?: 'nayapay' | 'raast' | 'easypaisa' | 'jazzcash' | 'creator_grant' | 'vip_pass';
    }
  ) => { success: boolean; message?: string; isInstant?: boolean };
  verifySubscription: (userId: string, approved: boolean, reason?: string) => void;
  redeemVipPass: (code: string) => { success: boolean; message: string };
  cancelPro: () => void;
  clearSubscription: (userId?: string) => void;
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

const INITIAL_USERS: User[] = [CREATOR_ACCOUNT];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ignition_users_v2');
    if (saved) {
      try {
        const parsed: User[] = JSON.parse(saved);
        return parsed.filter(u => u.id !== 'user-driver-1' && u.email !== 'driver@ignition.pk');
      } catch {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ignition_current_user_v2');
    if (saved) {
      try {
        const parsed: User = JSON.parse(saved);
        if (parsed?.id !== 'user-driver-1' && parsed?.email !== 'driver@ignition.pk') {
          return parsed;
        }
      } catch {
        return null;
      }
    }
    // Default to null (Guest explorer mode)
    return null;
  });

  const [hasSeenTutorial, setHasSeenTutorial] = useState<boolean>(() => {
    const saved = localStorage.getItem('ignition_tutorial_seen');
    // Default to true so visitors go straight into the application without the initial saving question popup
    return saved !== null ? saved === 'true' : true;
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

  // Regular user login with password authentication
  const login = (email: string, password?: string): { success: boolean; message?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      return { success: false, message: 'No driver account found with this email. Please create an account.' };
    }

    if (found.role === 'admin') {
      return { success: false, message: 'Creator access requires passcode via the Creator Terminal (Ctrl+Shift+A).' };
    }

    // Verify password if set on account
    if (found.password) {
      if (!password || found.password !== password.trim()) {
        return { success: false, message: 'Incorrect password. Please verify your password and try again.' };
      }
    }

    setCurrentUser(found);
    return { success: true };
  };

  // Regular user signup - strictly role 'driver' with password protection
  const signup = (userData: {
    name: string;
    email: string;
    password?: string;
    startingBalance?: number;
    carName?: string;
  }): { success: boolean; user?: User; message?: string } => {
    const cleanEmail = userData.email.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { 
        success: false, 
        message: 'An account with this email already exists. Please sign in instead.' 
      };
    }

    const newUser: User = {
      id: 'driver-' + Date.now(),
      name: userData.name.trim(),
      email: cleanEmail,
      password: userData.password?.trim(),
      role: 'driver',
      startingBalance: userData.startingBalance ?? 0,
      targetCarName: userData.carName?.trim() || 'Suzuki Alto VXR',
      createdAt: new Date().toISOString(),
      avatar: '🏎️'
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setHasSeenTutorial(true);
    localStorage.setItem('ignition_tutorial_seen', 'true');
    return { success: true, user: newUser };
  };

  // Password recovery / reset
  const resetPassword = (email: string, newPassword: string): { success: boolean; message?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const foundIndex = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
    if (foundIndex === -1) {
      return { 
        success: false, 
        message: 'No driver account found with this email. Please check your spelling or contact our WhatsApp support.' 
      };
    }

    if (newPassword.trim().length < 6) {
      return {
        success: false,
        message: 'New password must be at least 6 characters long.'
      };
    }

    const updatedUser = {
      ...users[foundIndex],
      password: newPassword.trim()
    };

    const updatedUsers = [...users];
    updatedUsers[foundIndex] = updatedUser;

    setUsers(updatedUsers);
    setCurrentUser(updatedUser);
    return { success: true, message: 'Password updated successfully! Welcome back to your vault.' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchDemoDriver = () => {
    // Demo driver removed
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
    const driver = users.find(u => u.role === 'driver') || null;
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
  const isPro = isCreator || currentUser?.subscription?.status === 'active';
  const subscription = currentUser?.subscription || null;

  const upgradeToPro = (
    plan: SubscriptionPlan,
    details: {
      trxId: string;
      senderPhone?: string;
      senderName?: string;
      paymentMethod?: 'nayapay' | 'raast' | 'easypaisa' | 'jazzcash' | 'creator_grant' | 'vip_pass';
    }
  ): { success: boolean; message?: string; isInstant?: boolean } => {
    if (!currentUser) {
      return { success: false, message: 'Please log in to upgrade to TURBO.' };
    }

    const cleanTrxId = details.trxId.trim();
    if (cleanTrxId.length < 6) {
      return { 
        success: false, 
        message: 'Please enter a valid Transaction ID / Reference No. (minimum 6 digits from your receipt).' 
      };
    }

    const now = new Date();
    let expiresAt = 'lifetime';
    let amountPaid = 999;

    if (plan === 'monthly') {
      amountPaid = 100;
      const expiry = new Date(now);
      expiry.setMonth(expiry.getMonth() + 1);
      expiresAt = expiry.toISOString();
    } else if (plan === 'quarterly') {
      amountPaid = 250;
      const expiry = new Date(now);
      expiry.setMonth(expiry.getMonth() + 3);
      expiresAt = expiry.toISOString();
    } else if (plan === 'annual') {
      amountPaid = 800;
      const expiry = new Date(now);
      expiry.setFullYear(expiry.getFullYear() + 1);
      expiresAt = expiry.toISOString();
    } else {
      amountPaid = 999;
      expiresAt = 'lifetime';
    }

    // Check if this is a VIP Pass / Creator code
    const isVipPass = ['VIP2026', 'DANISH-VIP', 'TURBO100', 'CREATOR-VIP', 'IGNITION2026'].includes(cleanTrxId.toUpperCase());

    const newSub: SubscriptionDetails = {
      tier: 'pro',
      planName: plan,
      amountPaid: isVipPass ? 0 : amountPaid,
      subscribedAt: now.toISOString(),
      expiresAt,
      paymentMethod: isVipPass ? 'vip_pass' : (details.paymentMethod || 'nayapay'),
      trxId: cleanTrxId,
      senderPhone: details.senderPhone?.trim() || undefined,
      senderName: details.senderName?.trim() || currentUser.name,
      status: isVipPass ? 'active' : 'pending',
      verifiedAt: isVipPass ? now.toISOString() : undefined
    };

    const updatedUser: User = {
      ...currentUser,
      subscription: newSub
    };

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));

    if (isVipPass) {
      return { 
        success: true, 
        message: 'VIP Pass confirmed! IGNITION TURBO activated immediately.',
        isInstant: true 
      };
    }

    return { 
      success: true, 
      message: 'Transaction ID submitted for verification! Danish Muhammad Khan will verify and unlock your TURBO VIP access.',
      isInstant: false 
    };
  };

  const redeemVipPass = (code: string): { success: boolean; message: string } => {
    if (!currentUser) {
      return { success: false, message: 'Please log in to redeem a VIP pass.' };
    }
    const clean = code.trim().toUpperCase();
    const validCodes = ['VIP2026', 'DANISH-VIP', 'TURBO100', 'CREATOR-VIP', 'IGNITION2026'];
    if (!validCodes.includes(clean)) {
      return { success: false, message: 'Invalid VIP Passcode or Promo Code.' };
    }

    const res = upgradeToPro('lifetime', {
      trxId: clean,
      paymentMethod: 'vip_pass',
      senderName: currentUser.name
    });

    return {
      success: res.success,
      message: res.message || 'VIP Pass confirmed! IGNITION TURBO activated.'
    };
  };

  const verifySubscription = (userId: string, approved: boolean, reason?: string) => {
    const now = new Date().toISOString();
    setUsers(prev => prev.map(u => {
      if (u.id !== userId || !u.subscription) return u;
      const updatedSub: SubscriptionDetails = {
        ...u.subscription,
        status: approved ? 'active' : 'rejected',
        verifiedAt: approved ? now : undefined,
        rejectionReason: approved ? undefined : (reason || 'Transaction ID could not be verified on NayaPay/Raast')
      };
      return { ...u, subscription: updatedSub };
    }));

    if (currentUser?.id === userId && currentUser.subscription) {
      const updatedSub: SubscriptionDetails = {
        ...currentUser.subscription,
        status: approved ? 'active' : 'rejected',
        verifiedAt: approved ? now : undefined,
        rejectionReason: approved ? undefined : (reason || 'Transaction ID could not be verified on NayaPay/Raast')
      };
      setCurrentUser({ ...currentUser, subscription: updatedSub });
    }
  };

  const cancelPro = () => {
    if (!currentUser) return;
    const updatedUser: User = {
      ...currentUser,
      subscription: undefined
    };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const clearSubscription = (userId?: string) => {
    const targetId = userId || currentUser?.id;
    if (!targetId) return;
    setUsers(prev => prev.map(u => u.id === targetId ? { ...u, subscription: undefined } : u));
    if (currentUser?.id === targetId) {
      setCurrentUser({ ...currentUser, subscription: undefined });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        signup,
        resetPassword,
        logout,
        switchDemoDriver,
        unlockCreatorMode,
        exitCreatorMode,
        isCreator,
        isPro,
        subscription,
        upgradeToPro,
        verifySubscription,
        redeemVipPass,
        cancelPro,
        clearSubscription,
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
