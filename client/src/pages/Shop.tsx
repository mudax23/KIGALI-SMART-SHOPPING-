import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["All", "Tech", "Tools", "Accessories", "Parts"];

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: products, isLoading } = useProducts({
    category: selectedCategory === "All" ? undefined : selectedCategory,
    search: searchQuery || undefined
  });

  return (
    <div className="min-h-screen bg-slate-50/30 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">Shop</h1>
          <p className="text-slate-500 max-w-2xl">
            Explore our comprehensive collection of high-quality electronics and professional repair tools.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar / Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" /> Filters
                </h3>
                {selectedCategory !== "All" && (
                  <button 
                    onClick={() => setSelectedCategory("All")}
                    className="text-xs text-red-500 hover:underline flex items-center gap-1"
                  >
                    Clear <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
                      selectedCategory === cat
                        ? "bg-primary text-white shadow-lg shadow-primary/25 font-medium"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Search Bar */}
            <div className="mb-8 relative max-w-xl">
              <Input 
                placeholder="Search products..." 
                className="pl-12 py-6 rounded-2xl border-slate-200 bg-white shadow-sm focus:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-[380px] bg-slate-200 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : products?.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">No products found</h3>
                <p className="text-slate-500">Try adjusting your search or filters</p>
                <Button 
                  variant="link" 
                  onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
                  className="mt-2 text-primary"
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {products?.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
