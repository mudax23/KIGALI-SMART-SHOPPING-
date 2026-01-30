import { useAuth } from "@/hooks/use-auth";
import { useAdminStats } from "@/hooks/use-admin";
import { useCreateProduct, useDeleteProduct } from "@/hooks/use-products";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, Package, Eye, Loader2, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema, type InsertProduct } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["Tech", "Tools", "Accessories", "Parts"];

function AddProductDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { mutate: createProduct, isPending } = useCreateProduct();
  
  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "Tech",
      imageUrl: "",
    }
  });

  const onSubmit = (data: InsertProduct) => {
    createProduct(data, {
      onSuccess: () => {
        toast({ title: "Product Created", description: `${data.name} added successfully` });
        setOpen(false);
        form.reset();
      },
      onError: (err) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl><Input placeholder="Product name" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea placeholder="Product description..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              field.onChange(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      {field.value && (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-200">
                          <img 
                            src={field.value} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating..." : "Create Product"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminDashboard() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { mutate: deleteProduct } = useDeleteProduct();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id, {
        onSuccess: () => {
          toast({ title: "Product Deleted", description: "The product has been removed." });
        },
        onError: (err) => {
          toast({ title: "Error", description: err.message, variant: "destructive" });
        }
      });
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  if (authLoading || statsLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!stats) return null;

  const chartData = stats.mostViewedProducts.map(p => ({
    name: p.name,
    views: p.viewCount
  })).slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500">Overview of your store performance</p>
          </div>
          <AddProductDialog />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.mostViewedProducts.reduce((acc, curr) => acc + curr.viewCount, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle>Top Viewed Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{fontSize: 12}} interval={0} angle={-15} textAnchor="end" height={60} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle>Recent Top Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {stats.mostViewedProducts.slice(0, 5).map(product => (
                            <div key={product.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 overflow-hidden">
                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-slate-900">{product.name}</p>
                                        <p className="text-xs text-slate-500">{product.category}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                      <Eye className="w-4 h-4" /> {product.viewCount}
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleDelete(product.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
