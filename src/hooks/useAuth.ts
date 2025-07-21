import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: 'user' | 'brand';
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  first_name?: string;
  last_name?: string;
  company?: string;
  phone_number?: string;
  country?: string;
  email?: string;
  password?: string;
  accountType?: 'user' | 'brand';
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  });

  useEffect(() => {
    // Check for existing session
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('chappi_user');
        const token = localStorage.getItem('chappi_token');
        
        if (storedUser && token) {
          setAuthState({
            user: JSON.parse(storedUser),
            isLoading: false,
            isAuthenticated: true
          });
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        firstName: 'John',
        lastName: 'Doe',
        accountType: 'user'
      };
      
      const mockToken = 'mock_jwt_token_' + Date.now();
      
      localStorage.setItem('chappi_user', JSON.stringify(mockUser));
      localStorage.setItem('chappi_token', mockToken);
      
      setAuthState({
        user: mockUser,
        isLoading: false,
        isAuthenticated: true
      });
      
      return { success: true };
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signup = async (userData: any) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      const data = 
        { 
          email: userData.email, 
          password: userData.password, 
          phone_number: userData.phone_number, 
          name: userData.company ?? userData.first_name + ' ' + userData.last_name, 
          role: userData.accountType, 
          first_name: userData.firstName, 
          last_name: userData.lastName, 
          country: userData.country, 
        }
      
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        accountType: userData.accountType || 'user'
      };
      
      const mockToken = 'mock_jwt_token_' + Date.now();
      
      localStorage.setItem('chappi_user', JSON.stringify(newUser));
      localStorage.setItem('chappi_token', mockToken);
      
      setAuthState({
        user: newUser,
        isLoading: false,
        isAuthenticated: true
      });
      
      return { success: true, user: newUser };
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('chappi_user');
    localStorage.removeItem('chappi_token');
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false
    });
  };

  return {
    ...authState,
    login,
    signup,
    logout
  };
};