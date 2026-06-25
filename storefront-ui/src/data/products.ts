export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  rating: number;
}

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    title: "Minimalist Ergonomic Water Bottle",
    price: 34.99,
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
    rating: 4.8
  },
  {
    id: "prod-2",
    title: "Ultra-Thin Wireless Charging Pad",
    price: 29.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80",
    rating: 4.5
  },
  {
    id: "prod-3",
    title: "Premium Grain Leather Passport Wallet",
    price: 45.00,
    category: "Travel",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
    rating: 4.9
  },
  {
    id: "prod-4",
    title: "Acoustic Noise-Cancelling Earbuds",
    price: 89.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    rating: 4.6
  }
];