import { useState, useEffect } from "react";
import { useCartStore } from "./store/useCartStore";
import { useAuthStore } from "./store/useAuthStore";
import { AuthModal } from "./components/ui/AuthModal";
import { 
  ShoppingBag, Search, Menu, Star, Filter, ArrowRight, Trash2, LogOut // Added Trash2
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  //CardContent, 
  //CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { fetchProducts, type Product } from "./services/api";

function App() {
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  
  // Calculate total dollar amount
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  const addItemToCart = useCartStore((state) => state.addItem);
  const removeItemFromCart = useCartStore((state) => state.removeItem);
  
  
  // New State for Backend Data
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const liveData = await fetchProducts();
      setProducts(liveData);
      setIsLoading(false);
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-900 font-sans antialiased">
      
      {/* 1. GLOBAL NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-zinc-950 stroke-[2]" />
            <span className="text-xl font-bold tracking-tight text-zinc-950">DropForge</span>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600">
            <a href="#" className="text-zinc-950 transition-colors">Shop All</a>
            <a href="#" className="hover:text-zinc-950 transition-colors">Trending</a>
            <a href="#" className="hover:text-zinc-950 transition-colors">New Arrivals</a>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-4">
            {/* Search (Icon representation for now) */}
            <button className="rounded-full p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition-all">
              <Search className="h-5 w-5" />
            </button>

            {/* User Profile / Auth Modal */}
            {isAuthenticated ? (
              <button 
                onClick={logout}
                className="rounded-full p-2 text-zinc-600 hover:bg-zinc-100 hover:text-red-600 transition-all group"
                title="Log Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            ) : (
              <AuthModal />
            )}

            {/* Shopping Cart Trigger & Sidebar */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="relative rounded-full p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition-all">
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-950 text-[10px] font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              
              {/* The Slide-out Sidebar */}
              <SheetContent className="flex w-full flex-col sm:max-w-lg bg-white">
                <SheetHeader className="border-b border-zinc-200 pb-4">
                  <SheetTitle className="text-xl font-bold">Shopping Cart</SheetTitle>
                </SheetHeader>
                
                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                  {cartItems.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-zinc-500 space-y-2">
                      <ShoppingBag className="h-12 w-12 opacity-20" />
                      <p>Your cart is empty.</p>
                    </div>
                  ) : (
                    cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 border-b border-zinc-100 pb-4">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-zinc-200">
                          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <span className="text-sm font-medium text-zinc-900 line-clamp-1">{item.title}</span>
                          <span className="text-sm text-zinc-500">Qty: {item.quantity}</span>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                          <button 
                            onClick={() => removeItemFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Checkout Footer */}
                {cartItems.length > 0 && (
                  <div className="border-t border-zinc-200 pt-4 space-y-4">
                    <div className="flex items-center justify-between font-bold text-lg">
                      <span>Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <Button className="w-full text-base h-12">
                      Secure Checkout
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            {/* Mobile Menu Toggle */}
            <button className="rounded-full p-2 text-zinc-600 hover:bg-zinc-100 md:hidden">
              <Menu className="h-5 w-5" />
            </button>
          </div>

        </div>
      </header>

      {/* 2. HERO / ANNOUNCEMENT BANNER */}
      <section className="bg-zinc-950 text-white py-12 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400">Curated Dropshipping Logistics</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">The Premium Storefront Template</h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-md mx-auto">
            A secure enterprise-grade infrastructure delivering curated products directly to your customer's door.
          </p>
        </div>
      </section>

      {/* 3. MAIN PRODUCT GRID SECTION */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        
        {/* Marketplace Controls */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-5">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-zinc-950">Trending Products</h3>
            <p className="text-sm text-zinc-500">Handpicked items with optimal market margins.</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </Button>
        </div>

        {/* Dynamic Card Grid Layout */}
        {isLoading ? (
          <div className="flex justify-center py-12 w-full text-zinc-500">
            Loading live inventory from catalog-service...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden border-zinc-200/60 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-zinc-300">
              
              {/* Product Thumbnail Wrapper */}
              <div className="aspect-square w-full overflow-hidden bg-zinc-100 relative">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-zinc-900 px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>

              {/* Card Metadata Details */}
              <CardHeader className="p-4 pb-2 space-y-1">
                <div className="flex items-center justify-between text-zinc-500 text-xs">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="font-medium text-zinc-700">{product.rating}</span>
                  </div>
                  <span>In Stock</span>
                </div>
                <CardTitle className="text-sm font-semibold leading-tight text-zinc-900 line-clamp-2 min-h-[40px] group-hover:text-zinc-700 transition-colors">
                  {product.title}
                </CardTitle>
              </CardHeader>

              {/* Price and Card Actions */}
              <CardFooter className="p-4 pt-0 flex items-center justify-between mt-2">
                <span className="text-base font-bold text-zinc-950">
                  ${product.price.toFixed(2)}
                </span>
                <Button 
                  size="sm" 
                  className="h-8 text-xs gap-1 shadow-sm font-medium"
                  onClick={() => addItemToCart(product)}
                >
                  Add to Cart
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </CardFooter>

            </Card>
          ))}
        </div>
      )}

      </main>

    </div>
  );
}

export default App;