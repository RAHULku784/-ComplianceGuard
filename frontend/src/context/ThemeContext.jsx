import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {

  const [theme, setTheme] = useState("dark");

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    document.body.className = newTheme;
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        changeTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);