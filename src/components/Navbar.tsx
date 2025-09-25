import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const { user, userType, signOut } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('aarambh');

  const navItems = [
    { id: 'aarambh', label: 'Aarambh', href: '#hero' },
    { id: 'yojan', label: 'Yojan', href: '#diet-generator' },
    { id: 'ankh', label: 'Ankh', href: '#calorie-tracker' },
    { id: 'sambandh', label: 'Sambandh', href: '#doctor-connectivity' },
    { id: 'recipes', label: 'Recipes', href: '/recipes' },
    { id: 'gyan', label: 'Gyan', href: '/gyan' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Update active section based on scroll position
      const sections = navItems.filter(item => item.href.startsWith('#'));
      for (const section of sections) {
        const element = document.querySelector(section.href);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.location.href = href;
    }
    setIsMobileMenuOpen(false);
  };

  const handleAuth = () => {
    // Always go to auth page for landing page
    navigate('/auth');
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background border-b border-border shadow-sm' 
          : 'bg-background/90 backdrop-blur-md border-b border-border/20'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo className="cursor-pointer" variant="dark" onClick={() => scrollToSection('#hero')} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.href)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeSection === item.id
                    ? 'text-primary'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-scale-in" />
                )}
              </button>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Button onClick={handleAuth} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Login
            </Button>
            <Button variant="outline" onClick={handleAuth} className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.href)}
                  className={`block w-full text-left px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground hover:text-primary hover:bg-muted'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              <div className="pt-4 border-t border-border space-y-3">
                <div className="flex justify-center">
                  <ThemeToggle />
                </div>
                <Button onClick={handleAuth} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Login
                </Button>
                <Button variant="outline" onClick={handleAuth} className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;