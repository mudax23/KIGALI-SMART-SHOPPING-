import { Link } from "wouter";
import { type Product } from "@shared/schema";
import { Eye, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <motion.div 
        whileHover={{ y: -5 }}
        className="group cursor-pointer rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden h-full flex flex-col"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          
          <div className="absolute bottom-4 right-4 translate-y-10 group-hover:translate-y-0 transition-transform duration-300">
            <div className="bg-white text-primary p-2 rounded-full shadow-lg">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-slate-400 text-xs">
              <Eye className="w-3 h-3" />
              <span>{product.viewCount}</span>
            </div>
          </div>
          
          <h3 className="font-display font-bold text-lg text-slate-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-grow">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
            <span className="font-display font-bold text-xl text-slate-900">
              {Number(product.price).toLocaleString()} RWF
            </span>
            <span className="text-sm font-medium text-primary group-hover:underline">
              View Details
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
