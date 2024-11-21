import React from 'react';
import { Plus, CalendarIcon, SettingsIcon, LogOut } from 'lucide-react';
import { useThemeContext } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

type View = 'habits' | 'calendar' | 'settings';

interface MobileNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeView, setActiveView }) => {
  const { theme } = useThemeContext();
  const { signOut } = useAuth();

  return (
    <>
      {/* Spacer to prevent content from being hidden behind the nav */}
      <div className="h-20 md:hidden" />
      
      <nav className={`
        fixed bottom-4 left-4 right-4 md:hidden
        ${theme.cardBackground} 
        rounded-2xl shadow-lg backdrop-blur-lg
        border ${theme.border}
        z-50
      `}>
        <div className="flex justify-around items-center p-2">
          <NavButton
            active={activeView === 'habits'}
            onClick={() => setActiveView('habits')}
            icon={<Plus className="h-5 w-5" />}
            label="Habits"
          />
          <NavButton
            active={activeView === 'calendar'}
            onClick={() => setActiveView('calendar')}
            icon={<CalendarIcon className="h-5 w-5" />}
            label="Calendar"
          />
          <NavButton
            active={activeView === 'settings'}
            onClick={() => setActiveView('settings')}
            icon={<SettingsIcon className="h-5 w-5" />}
            label="Settings"
          />
          <NavButton
            onClick={signOut}
            icon={<LogOut className="h-5 w-5" />}
            label="Sign Out"
            variant="danger"
          />
        </div>
      </nav>
    </>
  );
};

interface NavButtonProps {
  active?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  variant?: 'default' | 'danger';
}

const NavButton: React.FC<NavButtonProps> = ({ 
  active = false, 
  onClick, 
  icon, 
  label,
  variant = 'default'
}) => {
  const { theme } = useThemeContext();
  
  const baseStyles = "flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200";
  const variantStyles = variant === 'danger' 
    ? "text-red-500 hover:bg-red-500/10 active:bg-red-500/20" 
    : `${active ? theme.nav.active : theme.nav.inactive}`;
  
  return (
    <button
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variantStyles}
        ${active ? 'scale-95 shadow-inner' : 'hover:scale-105'}
      `}
    >
      <div className={`
        ${active ? 'scale-95' : ''}
        transition-transform duration-200
      `}>
        {icon}
      </div>
      <span className={`
        text-xs mt-1 font-medium
        ${active ? 'opacity-100' : 'opacity-70'}
      `}>
        {label}
      </span>
    </button>
  );
}; 