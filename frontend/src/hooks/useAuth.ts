import { useState, useEffect } from 'react';

// Bypassing authentication for development
export const useAuth = () => {
  return { 
    isAuthenticated: true,  // Authentication bypassed
    isLoading: false, 
    logout: () => {} 
  };
};