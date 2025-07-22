import { useState, useEffect } from 'react';
import { http } from '../services/https';

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
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('chappi_user');
        const token = localStorage.getItem('chappi_token');

        if (storedUser && token) {
          setAuthState({
            user: JSON.parse(storedUser),
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await http.post<{ token: string }>('/auth/login', {
        email,
        password,
      });
      const { token } = response.data;

      // Assuming the token contains user info or we fetch it separately
      // For now, creating a placeholder user
      const user: User = {
        id: '', // This should be fetched or decoded from token
        email,
        firstName: 'User', // Placeholder
        lastName: '', // Placeholder
        accountType: 'user', // Placeholder
      };

      localStorage.setItem('chappi_user', JSON.stringify(user));
      localStorage.setItem('chappi_token', token);

      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });

      return { success: true };
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signup = async (userData: any) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    console.log('Signup data:', userData);
    
    try {
      const {
        email,
        password,
        phone,
        company,
        firstName,
        lastName,
        accountType,
        country,
      } = userData;

      const role = accountType === 'user' ? 'customer' : accountType;
      const name = company || `${firstName} ${lastName}`;

      await http.post('/auth/register', {
        email,
        password,
        phone_number: phone,
        name,
        role,
        first_name: firstName,
        last_name: lastName,
        country,
      });

      // After successful registration, log the user in
      const loginResponse = await login(email, password);

      if (loginResponse.success) {
        const newUser: User = {
          id: '', // This should be fetched or decoded from token
          email,
          firstName,
          lastName,
          accountType,
        };

        localStorage.setItem('chappi_user', JSON.stringify(newUser));
        
        setAuthState((prev) => ({
          ...prev,
          user: newUser,
          isLoading: false,
          isAuthenticated: true,
        }));
        return { success: true, user: newUser };
      } else {
        throw new Error('Signup succeeded but login failed.');
      }
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false, isAuthenticated: false, user: null }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('chappi_user');
    localStorage.removeItem('chappi_token');
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  return {
    ...authState,
    login,
    signup,
    logout,
  };
};
