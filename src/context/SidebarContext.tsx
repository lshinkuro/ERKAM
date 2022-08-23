/** @format */

import React, { useState, useMemo } from "react";

type IContextProps = {
  isSidebarOpen: boolean;
  isDesktop: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  toggleDesktop: () => void;
};

// create context
export const SidebarContext = React.createContext({} as IContextProps);

export const SidebarProvider = ({ children }: any) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  function toggleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  function toggleDesktop() {
    setIsDesktop(!isDesktop);
  }

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  const value = useMemo(
    () => ({
      isSidebarOpen,
      isDesktop,
      toggleSidebar,
      toggleDesktop,
      closeSidebar,
    }),
    // eslint-disable-next-line
    [isSidebarOpen, isDesktop],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};
