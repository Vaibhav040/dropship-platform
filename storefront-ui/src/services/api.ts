// We'll define the exact shape of the data we expect from your Java backend
export interface Product {
  id: string | number;
  title: string;
  price: number;
  category: string;
  image: string;
  rating: number;
}

// Ensure this matches the port your Java catalog-service runs on locally
const API_BASE_URL = "http://localhost:8080"; 

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch products from backend:", error);
    return []; 
  }
};