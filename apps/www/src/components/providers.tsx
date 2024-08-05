"use client"

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ThemeProviderProps } from "next-themes/dist/types"
import { Provider as BalancerProvider } from "react-wrap-balancer"

import { TooltipProvider } from "@dingify/ui/components/tooltip"

import useCMDK from "./blog/cmdk"

// Create the context
export const AppContext = createContext<{
  setShowCMDK: Dispatch<SetStateAction<boolean>>
}>({
  setShowCMDK: () => {},
})

export function Providers({ children, ...props }: ThemeProviderProps) {
  const { CMDK, setShowCMDK } = useCMDK()

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
  )
}
