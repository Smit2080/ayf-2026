'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface PeriodContextType {
  period: string;
  setPeriod: (p: string) => void;
}

const AdminPeriodContext = createContext<PeriodContextType>({
  period: 'All Time',
  setPeriod: () => {},
});

export function AdminPeriodProvider({ children }: { children: ReactNode }) {
  const [period, setPeriod] = useState('All Time');
  return (
    <AdminPeriodContext.Provider value={{ period, setPeriod }}>
      {children}
    </AdminPeriodContext.Provider>
  );
}

export function useAdminPeriod() {
  return useContext(AdminPeriodContext);
}
