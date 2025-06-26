import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Title, Text, Button, Stack, Center, Box } from '@mantine/core';
import { WrenchScrewdriverIcon } from '../components/icons/FeatureIcons';

interface PlaceholderPageProps {
  title: string;
  message: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, message }) => {
  return (
    <Container size="sm" style={{ height: '100vh' }}>
      <Center style={{ height: '100%' }}>
        <Stack align="center" gap="xl">
          <WrenchScrewdriverIcon style={{ width: 96, height: 96, color: 'var(--mantine-color-primary-5)' }} />
          <Title order={1} c="primary.5" ta="center" size="h1">
            {title}
          </Title>
          <Text size="xl" c="dimmed" ta="center" maw={400}>
            {message}
          </Text>
          <Button
            component={Link}
            to="/"
            color="primary"
            size="lg"
            radius="md"
          >
            Go to Home
          </Button>
        </Stack>
      </Center>
    </Container>
  );
};

export default PlaceholderPage;
    