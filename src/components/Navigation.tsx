import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Plane,
  Search,
  MapPin,
  Calculator,
  Navigation as NavIcon,
  Hotel,
  Car,
  Bus,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown
} from
  'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/Button';
export function Navigation() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navLinks = [
    {
      href: '/search',
      label: 'Search Flights',
      icon: Search
    },
    {
      href: '/destinations',
      label: 'Destinations',
      icon: MapPin
    },
    {
      href: '/budget',
      label: 'Budget',
      icon: Calculator
    },
    {
      href: '/nearby',
      label: 'Nearby Airports',
      icon: NavIcon
    },
    {
      href: '/hotels',
      label: 'Hotels',
      icon: Hotel
    },
    {
      href: '/cars',
      label: 'Cars',
      icon: Car
    },
    {
      href: '/transfers',
      label: 'Transfers',
      icon: Bus
    }];

  const isActive = (href: string) => location.pathname === href;
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="page-container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <Plane className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">SkySearch</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) =>
              <Link
                key={href}
                to={href}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  transition-colors
                  ${isActive(href) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}
                `}>

                <Icon className="w-4 h-4" />
                {label}
              </Link>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* User Menu */}
            {isAuthenticated ?
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">

                  {user?.avatar ?
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover" /> :


                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-foreground">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  }
                  <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
                </button>

                {isUserMenuOpen &&
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)} />

                    <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50">
                      <div className="p-3 border-b border-border">
                        <p className="font-medium text-foreground">
                          {user?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">

                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-destructive">

                          <LogOut className="w-4 h-4" />
                          Log out
                        </button>
                      </div>
                    </div>
                  </>
                }
              </div> :

              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Sign up
                  </Button>
                </Link>
              </div>
            }

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors">

              {isMobileMenuOpen ?
                <X className="w-5 h-5" /> :

                <Menu className="w-5 h-5" />
              }
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen &&
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-1">
              {navLinks.map(({ href, label, icon: Icon }) =>
                <Link
                  key={href}
                  to={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                    transition-colors
                    ${isActive(href) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}
                  `}>

                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              )}

              {!isAuthenticated &&
                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  <Link
                    to="/login"
                    className="flex-1"
                    onClick={() => setIsMobileMenuOpen(false)}>

                    <Button variant="outline" size="md" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link
                    to="/signup"
                    className="flex-1"
                    onClick={() => setIsMobileMenuOpen(false)}>

                    <Button variant="primary" size="md" className="w-full">
                      Sign up
                    </Button>
                  </Link>
                </div>
              }
            </nav>
          </div>
        }
      </div>
    </header>);

}