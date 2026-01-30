import { Link, useLocation } from "wouter";
import { ShoppingBag, User, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-xl">
            <ShoppingBag className="w-6 h-6 text-primary" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-slate-900 uppercase">
            Kigali Smart<span className="text-primary"> Shopping</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.href) ? "text-primary" : "text-slate-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/admin" 
                className={`text-sm font-medium hover:text-primary ${
                  isActive("/admin") ? "text-primary" : "text-slate-600"
                }`}
              >
                Dashboard
              </Link>
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 truncate max-w-[100px]">
                  {user.firstName || user.email}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => logout()}
                  className="rounded-full hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <a href="/api/login">
                <Button variant="ghost" className="font-medium">
                  Log In
                </Button>
              </a>
              <Link href="/signup">
                <Button className="rounded-full px-6 shadow-lg shadow-primary/20">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 mt-10">
                {links.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium ${
                      isActive(link.href) ? "text-primary" : "text-slate-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="h-px bg-slate-100 my-2" />
                
                {user ? (
                  <>
                    <Link href="/admin" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-600">
                      Dashboard
                    </Link>
                    <Button 
                      onClick={() => { logout(); setIsOpen(false); }}
                      variant="outline" 
                      className="w-full justify-start gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <a href="/api/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">Log In</Button>
                    </a>
                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
