import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'RECRUITER' | 'HIRING_MANAGER' | 'ADMIN' | 'CANDIDATE';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  // Default to RECRUITER as requested to shift focus away from Admin
  const [role, setRole] = useState<UserRole>('RECRUITER');

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
