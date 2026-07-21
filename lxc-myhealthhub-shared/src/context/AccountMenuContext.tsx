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
