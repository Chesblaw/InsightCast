"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { AppProvider } from "./context/appContext";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AppProvider>
        <ThemeProvider>{children}</ThemeProvider>
    </AppProvider>
  );
}
