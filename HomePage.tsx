import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Card, 
  Text, 
  Title, 
  Stack, 
  Group, 
  ActionIcon,
  Paper,
  Box,
  Flex
} from '@mantine/core';
import RecipeCard from '../components/shared/RecipeCard';
import { MOCK_RECIPES } from '../constants';
import { Recipe } from '../types';
import { BookOpenIconSolid, ShoppingCartIconSolid, UsersIconSolid, ArchiveBoxIconSolid } from '../components/icons/FeatureIconsSolid';

interface TabLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}

const TabLink: React.FC<TabLinkProps> = ({ to, icon, label, color }) => (
  <Card 
    component={Link} 
    to={to}
    shadow="md" 
    padding="xl" 
    radius="lg"
    style={{ 
      cursor: 'pointer', 
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      aspectRatio: '1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}
    styles={{
      root: {
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 'var(--mantine-shadow-xl)'
        }
      }
    }}
  >
    <Box mb="md" style={{ color }}>
      {icon}
    </Box>
    <Text fw={600} ta="center" c="dark.6">
      {label}
    </Text>
  </Card>
);

interface RecipeRowProps {
  title: string;
  recipes: Recipe[];
}

const RecipeRow: React.FC<RecipeRowProps> = ({ title, recipes }) => (
  <Stack gap="lg" mb="xl">
    <Title order={2} c="dark.7">{title}</Title>
    <Grid>
      {recipes.length > 0 ? (
        recipes.map(recipe => (
          <Grid.Col key={recipe.id} span={{ base: 12, sm: 6, lg: 3 }}>
            <RecipeCard recipe={recipe} />
          </Grid.Col>
        ))
      ) : (
        <Grid.Col span={12}>
          <Text c="dimmed">No recipes in this category yet.</Text>
        </Grid.Col>
      )}
    </Grid>
  </Stack>
);

const HomePage: React.FC = () => {
  const recipeCategories = {
    '15-Min Dinners': MOCK_RECIPES.filter(r => r.category === '15-Min Dinners'),
    'Budget Friendly': MOCK_RECIPES.filter(r => r.category === 'Budget Friendly'),
    'High Protein': MOCK_RECIPES.filter(r => r.category === 'High Protein'),
    'Weekend Specials': MOCK_RECIPES.filter(r => r.category === 'Weekend Specials'),
  };

  return (
    <Container size="xl" px="md" py="lg">
      {/* Header Section */}
      <Stack align="center" mb="xl">
        <Title order={1} size="h1" c="primary.5" ta="center">
          Welcome Back!
        </Title>
        <Text size="lg" c="dimmed" ta="center">
          Ready to cook something amazing?
        </Text>
      </Stack>
      
      {/* Navigation Cards */}
      <Grid mb="xl">
        <Grid.Col span={{ base: 6, md: 3 }}>
          <TabLink 
            to="/cookbook" 
            icon={<BookOpenIconSolid style={{ width: 40, height: 40 }} />} 
            label="Cookbook"
            color="var(--mantine-color-primary-5)"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 6, md: 3 }}>
          <TabLink 
            to="/shopping-list" 
            icon={<ShoppingCartIconSolid style={{ width: 40, height: 40 }} />} 
            label="Shopping List"
            color="var(--mantine-color-secondary-5)"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 6, md: 3 }}>
          <TabLink 
            to="/add-users" 
            icon={<UsersIconSolid style={{ width: 40, height: 40 }} />} 
            label="Add Users"
            color="var(--mantine-color-orange-5)"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 6, md: 3 }}>
          <TabLink 
            to="/pantry" 
            icon={<ArchiveBoxIconSolid style={{ width: 40, height: 40 }} />} 
            label="Pantry"
            color="var(--mantine-color-blue-5)"
          />
        </Grid.Col>
      </Grid>

      {/* Recipe Categories */}
      {Object.entries(recipeCategories).map(([title, recipes]) => (
        <RecipeRow key={title} title={title} recipes={recipes} />
      ))}
    </Container>
  );
};

export default HomePage;
    