// Debug utilities for investigating interactive elements
export const debugLog = (component: string, action: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${component}] ${action}:`, data);
  }
};

export const checkEventListeners = (element: HTMLElement) => {
  const listeners = (element as any).getEventListeners?.() || {};
  console.log('Event listeners:', listeners);
  return listeners;
};

export const validateFormData = (formData: any) => {
  const errors: string[] = [];
  
  if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
    errors.push('Valid email is required');
  }
  
  if (!formData.password || formData.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const simulateAPICall = async (endpoint: string, data: any) => {
  console.log(`API Call to ${endpoint}:`, data);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate success/failure
  if (Math.random() > 0.1) {
    return { success: true, data: { id: Date.now(), ...data } };
  } else {
    throw new Error(`Failed to ${endpoint}`);
  }
};