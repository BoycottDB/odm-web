'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { Marque, SuggestionState } from '@/types';
import { KeyboardEvent } from 'react';

interface HeaderSearchContextType {
  // État de visibilité de la SearchBar dans le header
  showHeaderSearch: boolean;
  setShowHeaderSearch: (show: boolean) => void;
  
  // Props de la SearchBar pour synchronisation
  searchProps?: {
    value: string;
    onChange: (value: string) => void;
    onSearch: (query: string) => void;
    suggestions: SuggestionState;
    onSuggestionSelect: (marque: Marque) => void;
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
    onFocus: () => void;
    onBlur: () => void;
  };
  setSearchProps: (props: HeaderSearchContextType['searchProps']) => void;
}

const HeaderSearchContext = createContext<HeaderSearchContextType | undefined>(undefined);

export function HeaderSearchProvider({ children }: { children: ReactNode }) {
  const [showHeaderSearch, setShowHeaderSearch] = useState(false);
  const [searchProps, setSearchProps] = useState<HeaderSearchContextType['searchProps']>(undefined);

  return (
    <HeaderSearchContext.Provider 
      value={{ 
        showHeaderSearch, 
        setShowHeaderSearch, 
        searchProps, 
        setSearchProps 
      }}
    >
      {children}
    </HeaderSearchContext.Provider>
  );
}

export function useHeaderSearch() {
  const context = useContext(HeaderSearchContext);
  if (context === undefined) {
    throw new Error('useHeaderSearch must be used within a HeaderSearchProvider');
  }
  return context;
}