import { useState, useCallback, useEffect } from 'react';
import { User, SavedSearch, TripHistory, TripBudget } from '../types/flight';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  addSavedSearch: (search: Omit<SavedSearch, 'id' | 'createdAt'>) => void;
  removeSavedSearch: (id: string) => void;
  toggleFavoriteDestination: (destinationId: string) => void;
  addBudgetPlan: (budget: Omit<TripBudget, 'id' | 'createdAt'>) => void;
}

const MOCK_USER: User = {
  id: '1',
  email: 'demo@skysearch.com',
  name: 'Demo User',
  avatar:
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  savedSearches: [
  {
    id: '1',
    origin: 'New York (JFK)',
    destination: 'London (LHR)',
    departureDate: '2026-03-15',
    returnDate: '2026-03-22',
    createdAt: '2026-01-15'
  },
  {
    id: '2',
    origin: 'Los Angeles (LAX)',
    destination: 'Tokyo (HND)',
    departureDate: '2026-04-01',
    createdAt: '2026-01-10'
  }],

  favoriteDestinations: ['japan', 'france', 'italy'],
  tripHistory: [
  {
    id: '1',
    origin: 'San Francisco',
    destination: 'Paris',
    departureDate: '2025-09-10',
    returnDate: '2025-09-20',
    price: 1250,
    airline: 'Air France',
    status: 'completed'
  },
  {
    id: '2',
    origin: 'New York',
    destination: 'Barcelona',
    departureDate: '2026-02-14',
    returnDate: '2026-02-21',
    price: 890,
    airline: 'Delta',
    status: 'upcoming'
  }],

  budgetPlans: []
};

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock validation
      if (email && password.length >= 6) {
        const loggedInUser = { ...MOCK_USER, email };
        setUser(loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    },
    []
  );

  const signup = useCallback(
    async (email: string, password: string, name: string): Promise<boolean> => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock validation
      if (email && password.length >= 6 && name) {
        const newUser: User = {
          ...MOCK_USER,
          id: Date.now().toString(),
          email,
          name,
          savedSearches: [],
          favoriteDestinations: [],
          tripHistory: [],
          budgetPlans: []
        };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addSavedSearch = useCallback(
    (search: Omit<SavedSearch, 'id' | 'createdAt'>) => {
      setUser((prev) => {
        if (!prev) return null;
        const newSearch: SavedSearch = {
          ...search,
          id: Date.now().toString(),
          createdAt: new Date().toISOString().split('T')[0]
        };
        const updated = {
          ...prev,
          savedSearches: [newSearch, ...prev.savedSearches].slice(0, 10)
        };
        localStorage.setItem('user', JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const removeSavedSearch = useCallback((id: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        savedSearches: prev.savedSearches.filter((s) => s.id !== id)
      };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const toggleFavoriteDestination = useCallback((destinationId: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const favorites = prev.favoriteDestinations.includes(destinationId) ?
      prev.favoriteDestinations.filter((d) => d !== destinationId) :
      [...prev.favoriteDestinations, destinationId];
      const updated = { ...prev, favoriteDestinations: favorites };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addBudgetPlan = useCallback(
    (budget: Omit<TripBudget, 'id' | 'createdAt'>) => {
      setUser((prev) => {
        if (!prev) return null;
        const newBudget: TripBudget = {
          ...budget,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        const updated = {
          ...prev,
          budgetPlans: [newBudget, ...prev.budgetPlans]
        };
        localStorage.setItem('user', JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    addSavedSearch,
    removeSavedSearch,
    toggleFavoriteDestination,
    addBudgetPlan
  };
}