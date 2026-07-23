// ============================================================================
// FILE        : AccountMenuContext.tsx
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 23-July-2026 | 20:39 Hrs
//
// PURPOSE     : React context exposing openMenu() so any screen can open the
//               AccountMenu slide-in panel without prop-drilling.
// ============================================================================

import React, {createContext, PropsWithChildren, useContext} from 'react';

type AccountMenuContextValue = {
  openMenu: () => void;
};

const AccountMenuContext = createContext<AccountMenuContextValue | undefined>(undefined);

export function AccountMenuProvider({
  openMenu,
  children,
}: PropsWithChildren<AccountMenuContextValue>) {
  return (
    <AccountMenuContext.Provider value={{openMenu}}>{children}</AccountMenuContext.Provider>
  );
}

export function useAccountMenu() {
  const ctx = useContext(AccountMenuContext);
  if (!ctx) {
    throw new Error('useAccountMenu must be used within AccountMenuProvider');
  }
  return ctx;
}
