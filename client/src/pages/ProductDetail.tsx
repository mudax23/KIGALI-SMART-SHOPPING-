import { useProduct, useIncrementView } from "@/hooks/use-products";
import { useRoute, Link } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Truck, Shield, Share2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const id = Number(params?.id);
  
  const { data: product, isLoading, error } = useProduct(id);
  const { mutate: incrementView } = useIncrementView();

  useEffect(() => {
    if (id) {
      incrementView(id);
    }
  }, [id, incrementView]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h2>
        <Link href="/shop"><Button>Back to Shop</Button></Link>
      </div>
    );
  }

  const whatsappMessage = `Hello, I want to order: ${product.name} - Price: ${Number(product.price).toLocaleString()} RWF`;
  const whatsappUrl = `https://wa.me/250792432661?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="container mx-auto px-4">
        <Link href="/shop" className="inline-flex items-center text-slate-500 hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
        </Link>
        
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="bg-slate-100 relative h-[400px] lg:h-auto min-h-[500px]">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-6 left-6">
                <span className="bg-white/90 backdrop-blur text-slate-900 text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Info Section */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 leading-tight">
                    {product.name}
                  </h1>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
                
                <p className="text-4xl font-bold text-primary mb-8">
                  {Number(product.price).toLocaleString()} RWF
                </p>

                <div className="prose prose-slate text-slate-600 mb-10">
                  <p>{product.description}</p>
                </div>

                <div className="flex flex-col gap-4 mb-10">
                  <Button 
                    size="lg" 
                    className="w-full h-14 text-lg bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-green-500/20"
                    onClick={() => window.open(whatsappUrl, '_blank')}
                  >
                    <MessageCircle className="mr-2 w-6 h-6" />
                    Order on WhatsApp
                  </Button>
                  <p className="text-center text-xs text-slate-400">
                    Secure transaction via WhatsApp Business
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Fast Delivery</p>
                      <p className="text-xs text-slate-500">2-3 business days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Warranty</p>
                      <p className="text-xs text-slate-500">1 year included</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
