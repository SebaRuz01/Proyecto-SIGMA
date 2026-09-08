import { createContext, useEffect, useState, useContext } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Busca el tema en localStorage, o usa el del sistema por defecto
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remueve la clase anterior y agrega la nueva a la etiqueta <html>
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    
    // Guarda la preferencia en el navegador
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook personalizado para usar el tema en cualquier componente
export const useTheme = () => useContext(ThemeContext);