import React, { useState } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Paper, 
  Group, 
  TextInput, 
  Button, 
  Stack, 
  Checkbox, 
  ActionIcon,
  Badge,
  Box,
  Divider
} from '@mantine/core';
import { useShoppingList } from '../contexts/ShoppingListContext';
import { ShoppingListItem } from '../types';
import { PlusIcon, TrashIcon } from '../components/icons/ActionIcons';

const ShoppingListPage: React.FC = () => {
  const { items, addItem, removeItem, toggleItem, clearList } = useShoppingList();
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim() === '') return;
    addItem({ name: newItemName.trim(), quantity: newItemQuantity.trim() || '1' });
    setNewItemName('');
    setNewItemQuantity('');
  };

  const pendingItems = items.filter(item => !item.isChecked);
  const completedItems = items.filter(item => item.isChecked);

  return (
    <Container size="md" px="md" py="lg">
      <Stack align="center" mb="xl">
        <Title order={1} c="primary.5" ta="center">
          Shopping List
        </Title>
        <Text size="lg" c="dimmed" ta="center">
          Your organized grocery checklist.
        </Text>
      </Stack>

      <Paper shadow="md" radius="lg" p="lg" mb="xl">
        <form onSubmit={handleAddItem}>
          <Group>
            <TextInput
              placeholder="Item name (e.g., Apples)"
              value={newItemName}
              onChange={(e) => setNewItemName(e.currentTarget.value)}
              style={{ flex: 1 }}
              size="md"
            />
            <TextInput
              placeholder="Quantity (e.g., 6 pcs)"
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(e.currentTarget.value)}
              style={{ minWidth: 150 }}
              size="md"
            />
            <Button
              type="submit"
              leftSection={<PlusIcon style={{ width: 18, height: 18 }} />}
              color="secondary"
              size="md"
            >
              Add Item
            </Button>
          </Group>
        </form>
      </Paper>

      {items.length === 0 ? (
        <Text ta="center" c="dimmed" size="lg" py="xl">
          Your shopping list is empty. Add some items!
        </Text>
      ) : (
        <Stack gap="xl">
          {pendingItems.length > 0 && (
            <Stack gap="md">
              <Group>
                <Title order={2} c="dark.7">To Buy</Title>
                <Badge color="primary" variant="light">{pendingItems.length}</Badge>
              </Group>
              <Stack gap="sm">
                {pendingItems.map(item => (
                  <ShoppingListItemRow key={item.id} item={item} onToggle={toggleItem} onRemove={removeItem} />
                ))}
              </Stack>
            </Stack>
          )}

          {completedItems.length > 0 && (
            <Stack gap="md">
              <Group>
                <Title order={2} c="dimmed">Completed</Title>
                <Badge color="gray" variant="light">{completedItems.length}</Badge>
              </Group>
              <Stack gap="sm">
                {completedItems.map(item => (
                  <ShoppingListItemRow key={item.id} item={item} onToggle={toggleItem} onRemove={removeItem} />
                ))}
              </Stack>
            </Stack>
          )}
          
          <Group justify="flex-end">
            <Button
              onClick={clearList}
              leftSection={<TrashIcon style={{ width: 18, height: 18 }} />}
              color="red"
              variant="light"
            >
              Clear All Items
            </Button>
          </Group>
        </Stack>
      )}
    </Container>
  );
};

interface ShoppingListItemRowProps {
    item: ShoppingListItem;
    onToggle: (id: string) => void;
    onRemove: (id: string) => void;
}

const ShoppingListItemRow: React.FC<ShoppingListItemRowProps> = ({ item, onToggle, onRemove }) => {
    return (
      <Paper 
        shadow="xs" 
        radius="md" 
        p="md"
        style={{ 
          opacity: item.isChecked ? 0.6 : 1,
          transition: 'all 300ms ease'
        }}
      >
        <Group justify="space-between">
          <Group>
            <Checkbox
              checked={item.isChecked}
              onChange={() => onToggle(item.id)}
              color="primary"
              size="lg"
            />
            <Box>
              <Text 
                size="lg" 
                fw={500}
                td={item.isChecked ? 'line-through' : 'none'}
                c={item.isChecked ? 'dimmed' : 'dark.7'}
              >
                {item.name}
              </Text>
              {item.quantity && (
                <Text 
                  size="sm" 
                  c={item.isChecked ? 'gray.4' : 'dimmed'}
                >
                  {item.quantity} {item.unit || ''}
                </Text>
              )}
            </Box>
          </Group>
          <ActionIcon
            onClick={() => onRemove(item.id)}
            color="red"
            variant="subtle"
            size="lg"
            aria-label="Remove item"
          >
            <TrashIcon style={{ width: 18, height: 18 }} />
          </ActionIcon>
        </Group>
      </Paper>
    );
};

export default ShoppingListPage;
    