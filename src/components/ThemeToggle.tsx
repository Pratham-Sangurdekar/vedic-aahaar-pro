import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Languages } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, language, toggleTheme, toggleLanguage } = useTheme();

  return (
    <div className="flex items-center gap-2">
      {/* Language Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleLanguage}
        className="relative"
      >
        <Languages className="h-4 w-4 mr-1" />
        <span className="text-xs font-medium">
          {language === 'en' ? 'हि' : 'EN'}
        </span>
      </Button>

      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
      >
        {theme === 'dark' ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default ThemeToggle;