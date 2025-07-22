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
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('chappi_user') || sessionStorage.getItem('chappi_user');
        const token = localStorage.getItem('chappi_token') || sessionStorage.getItem('chappi_token');

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
  }, [reload]);

  const signin = async ({
    accountType,
    email,
    password,
    rememberMe,
  }: {
    accountType: 'user' | 'brand';
    email: string;
    password: string;
    rememberMe: boolean;
  }) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await http.post<{ token: any, user:any }>('/auth/login', {
        email,
        password,
      });
      const { token, user: userData } = response.data;
      // const userData = response.data.user

      // In a real app, you'd decode the JWT to get user info
      // Or fetch user profile from another endpoint
      const user: User = {
        id: userData.id, // Placeholder, decode from token
        email: userData.email,
        firstName: userData.first_name, // Placeholder
        lastName: userData.last_name, // Placeholder
        accountType,
      };

      if (rememberMe) {
        localStorage.setItem('chappi_user', JSON.stringify(user));
        localStorage.setItem('chappi_token', token);
      } else {
        sessionStorage.setItem('chappi_user', JSON.stringify(user));
        sessionStorage.setItem('chappi_token', token);
      }

      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });
      return { success: true };
    } catch (error: any) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const sendOtp = async (email: string) => {
    console.log(`OTP sent to ${email}`);
    // Mock implementation
    return Promise.resolve(true);
  };

  const verifyOtp = async (email: string, otp: string) => {
    console.log(`Verifying OTP ${otp} for ${email}`);
    // Mock implementation
    return Promise.resolve(otp === '123456'); // Dummy OTP
  };

  const resetPassword = async (email: string, newPassword?: string) => {
    console.log(`Resetting password for ${email}`);
    // Mock implementation
    return Promise.resolve(true);
  };

  const signup = async (userData: Record<string, string>) => {
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

      const loginResponse = await signin({
        email,
        password,
        accountType: role as 'user' | 'brand',
        rememberMe: true, // Or based on a checkbox in signup form
      });

      if (loginResponse.success) {
        const newUser: User = {
          id: '', // This should be fetched or decoded from token
          email,
          firstName,
          lastName,
          accountType: role as 'user' | 'brand',
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
    sessionStorage.removeItem('chappi_user');
    sessionStorage.removeItem('chappi_token');
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  return {
    ...authState,
    signin,
    signup,
    logout,
    sendOtp,
    verifyOtp,
    resetPassword,
    reload,
    setReload,
  };
};
