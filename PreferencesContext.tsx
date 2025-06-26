
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { UserPreferences, DietRequirement, KitchenUtensils, ChefSkillLevel } from '../types';

interface PreferencesContextType {
  preferences: UserPreferences | null;
  loadingPreferences: boolean;
  isOnboardingComplete: boolean;
  savePreferences: (newPreferences: UserPreferences) => void;
  updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const defaultPreferences: UserPreferences = {
  dietaryRequirements: [DietRequirement.NONE],
  kitchenUtensils: [KitchenUtensils.BASIC_SET], // Updated to array with default
  chefSkillLevel: ChefSkillLevel.BEGINNER,
  servings: 2,
  weeklyBudget: 50,
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loadingPreferences, setLoadingPreferences] = useState(true);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  useEffect(() => {
    const storedPrefs = localStorage.getItem('userPreferences');
    const storedOnboardingStatus = localStorage.getItem('isOnboardingComplete');
    
    if (storedPrefs) {
      const parsedPrefs = JSON.parse(storedPrefs);
      // Ensure kitchenUtensils is an array, migrate if old format (string) is found
      if (typeof parsedPrefs.kitchenUtensils === 'string' || !Array.isArray(parsedPrefs.kitchenUtensils)) {
        parsedPrefs.kitchenUtensils = [parsedPrefs.kitchenUtensils || KitchenUtensils.BASIC_SET];
      }
      if (parsedPrefs.kitchenUtensils.length === 0) {
        parsedPrefs.kitchenUtensils = [KitchenUtensils.BASIC_SET];
      }
      setPreferences(parsedPrefs);
    } else {
      setPreferences(defaultPreferences);
    }
    if (storedOnboardingStatus) {
        setIsOnboardingComplete(JSON.parse(storedOnboardingStatus));
    }
    setLoadingPreferences(false);
  }, []);

  const savePreferences = (newPreferences: UserPreferences) => {
    // Ensure kitchenUtensils is an array and not empty
    if (!Array.isArray(newPreferences.kitchenUtensils) || newPreferences.kitchenUtensils.length === 0) {
      newPreferences.kitchenUtensils = [KitchenUtensils.BASIC_SET];
    }
    setPreferences(newPreferences);
    localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
  };

  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPreferences(prev => {
      const basePrefs = prev || defaultPreferences;
      let validatedValue = value;
      if (key === 'kitchenUtensils') {
        if (!Array.isArray(value) || (value as KitchenUtensils[]).length === 0) {
          validatedValue = [KitchenUtensils.BASIC_SET] as UserPreferences[K];
        }
      }
      const updatedPrefs = { ...basePrefs, [key]: validatedValue };
      localStorage.setItem('userPreferences', JSON.stringify(updatedPrefs));
      return updatedPrefs;
    });
  };
  
  const completeOnboarding = () => {
    setIsOnboardingComplete(true);
    localStorage.setItem('isOnboardingComplete', JSON.stringify(true));
  };

  const resetOnboarding = () => {
    setIsOnboardingComplete(false);
    setPreferences(defaultPreferences);
    localStorage.removeItem('userPreferences');
    localStorage.removeItem('isOnboardingComplete');
  };

  return (
    <PreferencesContext.Provider value={{ preferences, loadingPreferences, isOnboardingComplete, savePreferences, updatePreference, completeOnboarding, resetOnboarding }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = (): PreferencesContextType => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};