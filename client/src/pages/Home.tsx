import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Star, Truck, ShieldCheck, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: products, isLoading } = useProducts();
  
  // Show latest 4 products
  const featuredProducts = products?.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 py-24 md:py-32">
        {/* Abstract Background pattern */}
        <div className="absolute inset-0 opacity-20">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="url(#grad1)" />
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{stopColor: "rgb(56, 189, 248)", stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: "rgb(3, 105, 161)", stopOpacity: 1}} />
                </linearGradient>
              </defs>
            </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight mb-6">
                Smart Deals on <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
                  Tech & Repair Tools
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl leading-relaxed">
                Discover professional-grade tools and the latest gadgets at unbeatable prices. Quality tested, reliable, and ready to ship.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/shop">
                  <Button size="lg" className="text-lg px-8 py-6 rounded-full bg-sky-500 hover:bg-sky-400 border-none shadow-lg shadow-sky-500/30">
                    Start Shopping
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full border-slate-700 text-white hover:bg-white/10 hover:text-white">
                    Join for Updates
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: "Fast Delivery", desc: "Quick shipping to your doorstep" },
              { icon: ShieldCheck, title: "Quality Guarantee", desc: "All products tested for quality" },
              { icon: Clock, title: "24/7 Support", desc: "We're here to help anytime" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Featured Products</h2>
              <p className="text-slate-500">Hand-picked selections just for you</p>
            </div>
            <Link href="/shop">
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-[400px] bg-slate-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts?.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust/Reviews Banner */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center gap-1 mb-6 text-yellow-400">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-6 h-6 fill-current" />)}
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-4">
            "The best place to buy repair tools. <br/>Top quality and excellent service."
          </h2>
          <p className="text-slate-500 font-medium">- Alex M., Verified Buyer</p>
        </div>
      </section>
    </div>
  );
}
