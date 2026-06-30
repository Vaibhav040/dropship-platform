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
const API_BASE_URL = "http://localhost:8081"; 

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
// --- AUTHENTICATION TYPES ---

export interface AuthResponse {
  token: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// --- AUTHENTICATION METHODS ---

export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Registration failed");
  return await response.json();
};

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/authenticate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Login failed");
  return await response.json();
};

// --- SECURE FETCH WRAPPER ---
// We will use this in the future for endpoints that require a user to be logged in
export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("jwt_token"); // We will store the token in the browser's memory
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  return await response.json();
};

export const checkoutOrder = async (orderData: any, token: string) => {
  // Notice we use port 8082 here, which targets the order-service container!
  const response = await fetch(`http://localhost:8082/api/orders/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  
  if (!response.ok) {
    throw new Error("Checkout processing failed");
  }
  return response.json();
};