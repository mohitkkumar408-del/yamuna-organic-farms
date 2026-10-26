import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/index.ts';

interface AuthContextType {
  currentUser: User;
  users: User[];
  switchUser: (userId: string, pin?: string) => Promise<boolean>;
  canEditFinance: boolean;
  canAdjustStock: boolean;
  canManageUsers: boolean;
  canCancelOrders: boolean;
}

const defaultOwner: User = {
  id: 'USR-01',
  name: 'Rajesh Kumar Verma',
  nameHi: 'राजेश कुमार वर्मा',
  username: 'rajesh_owner',
  role: 'owner',
  pin: '1111',
  phone: '+91 94311 82740',
  active: true
};

const AuthContext = createContext<AuthContextType>({
  currentUser: defaultOwner,
  users: [],
  switchUser: async () => false,
  canEditFinance: true,
  canAdjustStock: true,
  canManageUsers: true,
  canCancelOrders: true
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('yof_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return defaultOwner;
  });

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUsers(data);
          const found = data.find(u => u.id === currentUser.id);
          if (found) setCurrentUser(found);
        }
      })
      .catch(console.error);
  }, []);

  const switchUser = async (userId: string, pin?: string): Promise<boolean> => {
    const target = users.find(u => u.id === userId);
    if (!target) return false;

    if (pin && target.pin !== pin) {
      return false;
    }

    setCurrentUser(target);
    localStorage.setItem('yof_current_user', JSON.stringify(target));
    return true;
  };

  const isOwner = currentUser.role === 'owner';
  const isManager = currentUser.role === 'manager';

  const canEditFinance = isOwner || isManager;
  const canAdjustStock = isOwner || isManager;
  const canManageUsers = isOwner;
  const canCancelOrders = isOwner || isManager;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        switchUser,
        canEditFinance,
        canAdjustStock,
        canManageUsers,
        canCancelOrders
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
