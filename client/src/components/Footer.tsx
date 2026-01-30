import { Link } from "wouter";
import { ShoppingBag, Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary/10 p-2 rounded-xl">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              <span className="font-display font-bold text-lg text-slate-900">
                KIGALI SMART<span className="text-primary"> SHOPPING</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Your destination for smart deals on premium tech and professional repair tools. Quality guaranteed.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/shop?category=Tech" className="hover:text-primary transition-colors">Tech</Link></li>
              <li><Link href="/shop?category=Tools" className="hover:text-primary transition-colors">Repair Tools</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Email: mudbon23@gmail.com</li>
              <li>Tel: 0792432661</li>
              <li>Address: Kigali, Chic Floor2</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} KIGALI SMART SHOPPING. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-900">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
