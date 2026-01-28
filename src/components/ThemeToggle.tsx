import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
interface ThemeToggleProps {
  showLabel?: boolean;
}
export function ThemeToggle({ showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
      aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}>

      {resolvedTheme === 'light' ?
      <Moon className="w-5 h-5 text-muted-foreground" /> :

      <Sun className="w-5 h-5 text-muted-foreground" />
      }
      {showLabel &&
      <span className="text-sm text-muted-foreground">
          {resolvedTheme === 'light' ? 'Dark' : 'Light'} mode
        </span>
      }
    </button>);

}
export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const options = [
  {
    value: 'light',
    label: 'Light',
    icon: Sun
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: Moon
  },
  {
    value: 'system',
    label: 'System',
    icon: Monitor
  }] as
  const;
  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      {options.map(({ value, label, icon: Icon }) =>
      <button
        key={value}
        onClick={() => setTheme(value)}
        className={`
            flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
            transition-colors
            ${theme === value ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}
          `}>

          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      )}
    </div>);

}