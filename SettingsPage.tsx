import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Title, 
  Text, 
  Button, 
  Stack, 
  Paper, 
  Group, 
  Avatar, 
  Checkbox, 
  Select, 
  NumberInput,
  Grid,
  Loader,
  Center
} from '@mantine/core';
import { useAuth } from '../contexts/AuthContext';
import { usePreferences } from '../contexts/PreferencesContext';
import { UserPreferences, DietRequirement, KitchenUtensils, ChefSkillLevel } from '../types';
import { DIET_OPTIONS, KITCHEN_UTENSILS_OPTIONS, CHEF_SKILL_LEVEL_OPTIONS } from '../constants';

const SettingsPage: React.FC = () => {
  const { logout, user } = useAuth();
  const { preferences, savePreferences, resetOnboarding, loadingPreferences } = usePreferences();
  const navigate = useNavigate();

  const [currentPrefs, setCurrentPrefs] = useState<UserPreferences | null>(null);

  useEffect(() => {
    if (preferences) {
      const validatedPrefs = {
        ...preferences,
        kitchenUtensils: Array.isArray(preferences.kitchenUtensils) && preferences.kitchenUtensils.length > 0
          ? preferences.kitchenUtensils
          : [KitchenUtensils.BASIC_SET],
      };
      setCurrentPrefs(validatedPrefs);
    }
  }, [preferences]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleResetOnboarding = () => {
    resetOnboarding();
    navigate('/onboarding/diet');
  };

  const handlePreferenceChange = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setCurrentPrefs(prev => {
      if (!prev) return null;
      let validatedValue = value;
      if (key === 'kitchenUtensils' && Array.isArray(value) && value.length === 0) {
        validatedValue = [KitchenUtensils.BASIC_SET] as UserPreferences[K];
      }
      return { ...prev, [key]: validatedValue };
    });
  };

  const handleSavePreferences = () => {
    if (currentPrefs) {
      const prefsToSave = {
        ...currentPrefs,
        kitchenUtensils: Array.isArray(currentPrefs.kitchenUtensils) && currentPrefs.kitchenUtensils.length > 0
          ? currentPrefs.kitchenUtensils
          : [KitchenUtensils.BASIC_SET],
      };
      savePreferences(prefsToSave);
      alert('Preferences saved!');
    }
  };
  
  const handleDietToggle = (diet: DietRequirement) => {
    if (!currentPrefs) return;
    const newDiets = currentPrefs.dietaryRequirements.includes(diet)
      ? currentPrefs.dietaryRequirements.filter(d => d !== diet)
      : [...currentPrefs.dietaryRequirements, diet];
    handlePreferenceChange('dietaryRequirements', newDiets.length > 0 ? newDiets : [DietRequirement.NONE]);
  };

  const handleUtensilToggle = (utensil: KitchenUtensils) => {
    if (!currentPrefs) return;
    const newUtensils = currentPrefs.kitchenUtensils.includes(utensil)
      ? currentPrefs.kitchenUtensils.filter(u => u !== utensil)
      : [...currentPrefs.kitchenUtensils, utensil];
    handlePreferenceChange('kitchenUtensils', newUtensils.length > 0 ? newUtensils : [KitchenUtensils.BASIC_SET]);
  };

  if (loadingPreferences || !currentPrefs) {
    return (
      <Center style={{ height: '100vh' }}>
        <Stack align="center">
          <Loader color="primary" size="lg" />
          <Text c="dimmed">Loading preferences...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Container size="md" px="md" py="lg">
      <Stack align="center" mb="xl">
        <Title order={1} c="primary.5" ta="center">
          Settings
        </Title>
        <Text size="lg" c="dimmed" ta="center">
          Manage your preferences and account.
        </Text>
      </Stack>

      <Paper shadow="md" radius="lg" p="xl">
        <Stack gap="xl">
          {/* Account Section */}
          <Stack gap="md">
            <Title order={2} c="dark.7">Account</Title>
            {user && (
              <Group mb="md">
                {user.photoURL && (
                  <Avatar src={user.photoURL} alt={user.displayName || 'User'} size="lg" radius="xl" />
                )}
                <Stack gap="xs">
                  <Text fw={600}>{user.displayName || 'User'}</Text>
                  <Text size="sm" c="dimmed">
                    {user.email || `Logged in with ${user.provider}`}
                  </Text>
                </Stack>
              </Group>
            )}
            <Button
              onClick={handleLogout}
              color="red"
              fullWidth
              size="md"
            >
              Log Out
            </Button>
          </Stack>

          {/* Preferences Section */}
          <Stack gap="md">
            <Title order={2} c="dark.7">Preferences</Title>
            <Text size="sm" c="dimmed">Update your culinary profile.</Text>

            {/* Dietary Requirements */}
            <Stack gap="sm">
              <Text fw={500} size="lg">Dietary Requirements</Text>
              <Grid>
                {DIET_OPTIONS.map(diet => (
                  <Grid.Col key={diet} span={{ base: 12, sm: 6 }}>
                    <Checkbox
                      label={diet}
                      checked={currentPrefs.dietaryRequirements.includes(diet)}
                      onChange={() => handleDietToggle(diet)}
                      color="primary"
                    />
                  </Grid.Col>
                ))}
              </Grid>
            </Stack>

            {/* Kitchen Utensils */}
            <Stack gap="sm">
              <Text fw={500} size="lg">Kitchen Utensils</Text>
              <Grid>
                {KITCHEN_UTENSILS_OPTIONS.map(utensil => (
                  <Grid.Col key={utensil} span={{ base: 12, sm: 6 }}>
                    <Checkbox
                      label={utensil}
                      checked={currentPrefs.kitchenUtensils.includes(utensil)}
                      onChange={() => handleUtensilToggle(utensil)}
                      color="primary"
                    />
                  </Grid.Col>
                ))}
              </Grid>
            </Stack>

            {/* Chef Skill Level */}
            <Stack gap="sm">
              <Text fw={500} size="lg">Chef Skill Level</Text>
              <Select
                value={currentPrefs.chefSkillLevel}
                onChange={(value) => value && handlePreferenceChange('chefSkillLevel', value as ChefSkillLevel)}
                data={CHEF_SKILL_LEVEL_OPTIONS.map(option => ({ value: option, label: option }))}
                size="md"
              />
            </Stack>

            {/* Servings */}
            <Stack gap="sm">
              <Text fw={500} size="lg">Typical Servings per Meal</Text>
              <NumberInput
                value={currentPrefs.servings}
                onChange={(value) => handlePreferenceChange('servings', typeof value === 'number' && value > 0 ? value : 1)}
                min={1}
                size="md"
              />
            </Stack>

            {/* Weekly Budget */}
            <Stack gap="sm">
              <Text fw={500} size="lg">Weekly Grocery Budget ($)</Text>
              <NumberInput
                value={currentPrefs.weeklyBudget}
                onChange={(value) => handlePreferenceChange('weeklyBudget', typeof value === 'number' && value >= 0 ? value : 0)}
                min={0}
                step={5}
                size="md"
              />
            </Stack>

            <Group grow>
              <Button
                onClick={handleSavePreferences}
                color="secondary"
                size="md"
              >
                Save Preferences
              </Button>
              <Button
                onClick={handleResetOnboarding}
                color="orange"
                variant="light"
                size="md"
              >
                Restart Onboarding
              </Button>
            </Group>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default SettingsPage;