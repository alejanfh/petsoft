"use client";
import { ReactNode, createContext, useState } from "react";

type TSearchContext = {
  searchQuery: string;
  handleChangeSearchQuery: (newValue: string) => void;
};

export const SearchContext = createContext<TSearchContext | null>(null);

type SearchContextProviderProps = {
  children: ReactNode;
};

export default function SearchContextProvider({
  children,
}: SearchContextProviderProps) {
  // state
  const [searchQuery, setSearchQuery] = useState<string>("");

  // derived state

  // event handlers / actions
  const handleChangeSearchQuery = (newValue: string) => {
    setSearchQuery(newValue);
  };

  return (
    <SearchContext.Provider value={{ searchQuery, handleChangeSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}
