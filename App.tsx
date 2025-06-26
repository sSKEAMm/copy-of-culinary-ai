import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PreferencesProvider, usePreferences } from './contexts/PreferencesContext';
import { ShoppingListProvider } from './contexts/ShoppingListContext';
import LoginScreen from './components/auth/LoginScreen';
import OnboardingDietStep from './components/onboarding/OnboardingDietStep';
import OnboardingKitchenStep from './components/onboarding/OnboardingKitchenStep';
import OnboardingProfileStep from './components/onboarding/OnboardingProfileStep';
import HomePage from './pages/HomePage';
import CookbookPage from './pages/CookbookPage';
import ShoppingListPage from './pages/ShoppingListPage';
import SettingsPage from './pages/SettingsPage';
import BottomNavBar from './components/shared/BottomNavBar';
import PlaceholderPage from './pages/PlaceholderPage';
import AlgoliaTest from './components/test/AlgoliaTest';
import { ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY, ALGOLIA_INDEX_NAME } from './constants';

// Create Mantine theme with culinary colors
const theme = createTheme({
  colors: {
    primary: [
      '#ffe6e6',
      '#ffcccc',
      '#ff9999',
      '#ff6666',
      '#ff3333',
      '#D9534F', // Main red-orange
      '#cc4a46',
      '#b8423e',
      '#a53a36',
      '#91322e'
    ],
    secondary: [
      '#e6f5e6',
      '#ccebcc',
      '#99d699',
      '#66c266',
      '#33ad33',
      '#5CB85C', // Main green
      '#52a652',
      '#479447',
      '#3d823d',
      '#337033'
    ]
  },
  primaryColor: 'primary',
  fontFamily: 'Inter, sans-serif',
  headings: {
    fontFamily: 'Inter, sans-serif',
  },
});

const AppContent: React.FC = () => {
  const { user, loadingAuth } = useAuth();
  const { preferences, loadingPreferences, isOnboardingComplete } = usePreferences();
  const [geminiApiKeyMissing, setGeminiApiKeyMissing] = useState(false);
  const [algoliaConfigMissing, setAlgoliaConfigMissing] = useState(false);

  useEffect(() => {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      setGeminiApiKeyMissing(true);
      console.warn("VITE_GEMINI_API_KEY environment variable is not set. AI features will be disabled.");
    }
    if (!ALGOLIA_APP_ID || !ALGOLIA_SEARCH_KEY || !ALGOLIA_INDEX_NAME) {
      setAlgoliaConfigMissing(true);
      console.warn("Algolia environment variables (APP_ID, SEARCH_KEY, INDEX_NAME) are not fully set. Algolia search may be disabled or degraded.");
    }
  }, []);

  if (loadingAuth || loadingPreferences) {
    return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div></div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {geminiApiKeyMissing && (
        <div className="bg-red-500 text-white p-2 text-center text-sm">
          Warning: Gemini API_KEY is not configured. AI features may not work.
        </div>
      )}
      {algoliaConfigMissing && (
        <div className="bg-yellow-500 text-black p-2 text-center text-sm">
          Warning: Algolia configuration is incomplete. Recipe search may be limited to local data.
        </div>
      )}
      <div className="flex-grow pb-16"> {/* Add padding for bottom nav bar */}
        <Routes>
          {!user ? (
            <Route path="/login" element={<LoginScreen />} />
          ) : !isOnboardingComplete ? (
            <>
              <Route path="/onboarding/diet" element={<OnboardingDietStep />} />
              <Route path="/onboarding/kitchen" element={<OnboardingKitchenStep />} />
              <Route path="/onboarding/profile" element={<OnboardingProfileStep />} />
              <Route path="*" element={<Navigate to="/onboarding/diet" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/cookbook" element={<CookbookPage />} />
              <Route path="/shopping-list" element={<ShoppingListPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/test-algolia" element={<AlgoliaTest />} />
              <Route path="/add-users" element={<PlaceholderPage title="Add Users" message="This feature is coming soon! Manage household members and share lists." />} />
              <Route path="/pantry" element={<PlaceholderPage title="Pantry Inventory" message="Track your pantry items. This feature is under development." />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
          <Route path="*" element={<Navigate to={!user ? "/login" : (isOnboardingComplete ? "/" : "/onboarding/diet")} replace />} />
        </Routes>
      </div>
      {user && isOnboardingComplete && <BottomNavBar />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <MantineProvider theme={theme}>
      <HashRouter>
        <AuthProvider>
          <PreferencesProvider>
            <ShoppingListProvider>
              <AppContent />
            </ShoppingListProvider>
          </PreferencesProvider>
        </AuthProvider>
      </HashRouter>
    </MantineProvider>
  );
};

export default App;