import { create } from 'zustand';
import { type Product } from '../services/api';

// 1. Define what an item in the cart looks like (A product + a quantity)
export interface CartItem extends Product {
  quantity: number;
}

// 2. Define the actions our store can perform
interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string | number) => void;
  clearCart: () => void;
}

// 3. Create the actual global store
export const useCartStore = create<CartStore>((set) => ({
  items: [],
  
  addItem: (product) => set((state) => {
    // Check if the item is already in the cart
    const existingItem = state.items.find((item) => item.id === product.id);
    
    if (existingItem) {
      // If it exists, just increase the quantity
      return {
        items: state.items.map((item) =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        ),
      };
    }
    // If it's new, add it to the array with a quantity of 1
    return { items: [...state.items, { ...product, quantity: 1 }] };
  }),

  removeItem: (productId) => set((state) => ({
    items: state.items.filter((item) => item.id !== productId)
  })),

  clearCart: () => set({ items: [] }),
}));