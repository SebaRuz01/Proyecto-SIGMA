import { createContext, useEffect, useState, useContext } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Configurado para usar 'dark' por defecto si no hay nada guardado en localStorage
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

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