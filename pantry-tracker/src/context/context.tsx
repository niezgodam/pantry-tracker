'use client'
import { createContext, useContext as useReactContext, useState, ReactNode, useEffect } from 'react';

interface ContextType {
    currentInventoryPage: string; 
    setCurrentInventoryPage: (page: string) => void;
    editDetect: boolean; 
    setEditDetect: (edit: boolean) => void;
    searchPhrase: string;
    setSearchPhrase: (searchPhrase: string) => void;
}


const defaultContextValue: ContextType = {
    currentInventoryPage: 'inventory', 
    setCurrentInventoryPage: () => { throw new Error('setCurrentPage function must be overridden'); },
    editDetect: false,
    setEditDetect: () => { throw new Error('editDetect function must be overridden'); },
    searchPhrase: '',
    setSearchPhrase: () => { throw new Error('searchPhrase function must be overridden'); }
};

const Context = createContext<ContextType>(defaultContextValue);

export const useContext = () => useReactContext(Context);

export const ContextProvider = ({ children }: { children: ReactNode }) => {

  const [currentInventoryPage, setCurrentInventoryPage] = useState(() => {
    return localStorage.getItem('currentInventoryPage') || 'inventory';
  });
  const [editDetect, setEditDetect] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState<string>('');



  useEffect(() => {
    localStorage.setItem('currentInventoryPage', currentInventoryPage);
  }, [currentInventoryPage]);

  

  return (
    <Context.Provider value={{ currentInventoryPage, setCurrentInventoryPage,editDetect, setEditDetect,searchPhrase, setSearchPhrase }}>
      {children}
    </Context.Provider>
  );
};
