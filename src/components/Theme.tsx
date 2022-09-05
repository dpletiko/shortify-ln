import { createContext, useState, PropsWithChildren, useEffect } from "react";
import { useDarkMode } from "usehooks-ts";

enum ThemeColor {
  Dark = "dark",
  Light = "light"
}

type ThemeContextType = {
  theme: ThemeColor,
  toggle: () => void
};

const ThemeContext = createContext<ThemeContextType | null>(null);

const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { isDarkMode, toggle } = useDarkMode(true)
  const [theme, setTheme] = useState(ThemeColor.Light)
  
  useEffect(() => setTheme(isDarkMode ? ThemeColor.Dark : ThemeColor.Light), [isDarkMode])

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
};


export {
  ThemeColor,
  ThemeContext,
  ThemeProvider
}

export type {
  ThemeColor as ThemeColorType,
  ThemeContextType
}