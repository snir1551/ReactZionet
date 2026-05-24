import { useState, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';

/**
 * Custom hook for persisting state to localStorage
 * 
 * @param key - localStorage key
 * @param defaultValue - default value if nothing in localStorage
 * @returns [value, setValue] tuple like useState
 */
export function useLocalStorage<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] {
  // Initialize state from localStorage or use default
  const [value, setValue] = useState<T>(() => {
    try {
      // Check if running in browser
      if (typeof window === 'undefined') {
        return defaultValue;
      }

      const item = window.localStorage.getItem(key);
      
      if (item === null) {
        return defaultValue;
      }

      // Parse stored JSON
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  // Update localStorage when value changes
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
