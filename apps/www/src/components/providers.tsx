"use client";

import { TooltipProvider } from "@propdock/ui/components/tooltip";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import {
  type Dispatch,
  ReactNode,
  type SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { Provider as BalancerProvider } from "react-wrap-balancer";

import useCMDK from "./blog/cmdk";

// Create the context
export const AppContext = createContext<{
  setShowCMDK: Dispatch<SetStateAction<boolean>>;
}>({
  setShowCMDK: () => {},
});

export function Providers({ children, ...props }: ThemeProviderProps) {
  const { CMDK, setShowCMDK } = useCMDK();

  return (
    <NextThemesProvider {...props}>
      <SessionProvider>
        <AppContext.Provider
          value={{
            setShowCMDK,
          }}
        >
          <CMDK />
          <BalancerProvider>
            <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
          </BalancerProvider>
        </AppContext.Provider>
      </SessionProvider>
    </NextThemesProvider>
  );
}
