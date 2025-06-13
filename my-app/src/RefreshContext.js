import { createContext, useContext, useState } from 'react';

const RefreshContext = createContext();

export const useRefresh = () => useContext(RefreshContext);

export function RefreshProvider({ children }) {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const triggerRefresh = () => {
    setRefreshFlag(prev => !prev); // Toggle to trigger update
  };

  return (
    <RefreshContext.Provider value={{ refreshFlag, triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
}
