
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ShoppingListItem } from '../types';

interface ShoppingListContextType {
  items: ShoppingListItem[];
  addItem: (item: Omit<ShoppingListItem, 'id' | 'isChecked'>) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  addRecipeIngredients: (recipeItems: Omit<ShoppingListItem, 'id' | 'isChecked'>[]) => void;
  clearList: () => void;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

export const ShoppingListProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ShoppingListItem[]>([]);

  useEffect(() => {
    const storedItems = localStorage.getItem('shoppingList');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<ShoppingListItem, 'id' | 'isChecked'>) => {
    const newItem: ShoppingListItem = {
      ...item,
      id: Date.now().toString(), // Simple unique ID
      isChecked: false,
    };
    setItems(prevItems => [...prevItems, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const toggleItem = (id: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };
  
  const addRecipeIngredients = (recipeItems: Omit<ShoppingListItem, 'id' | 'isChecked'>[]) => {
    const newItems: ShoppingListItem[] = recipeItems.map(item => ({
        ...item,
        id: `${item.name}-${item.recipeId}-${Date.now()}`, // More unique ID
        isChecked: false,
    }));
    setItems(prevItems => {
        // Avoid duplicates if adding same recipe again, or just add all
        const currentRecipeItemNames = new Set(newItems.map(ni => `${ni.name}-${ni.recipeId}`));
        const filteredOldItems = prevItems.filter(pi => !(pi.recipeId && currentRecipeItemNames.has(`${pi.name}-${pi.recipeId}`)));
        return [...filteredOldItems, ...newItems];
    });
  };

  const clearList = () => {
    setItems([]);
  };

  return (
    <ShoppingListContext.Provider value={{ items, addItem, removeItem, toggleItem, addRecipeIngredients, clearList }}>
      {children}
    </ShoppingListContext.Provider>
  );
};

export const useShoppingList = (): ShoppingListContextType => {
  const context = useContext(ShoppingListContext);
  if (context === undefined) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
};
    