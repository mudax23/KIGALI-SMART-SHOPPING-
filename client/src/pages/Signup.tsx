import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertStatsUserSchema, type InsertStatsUser } from "@shared/schema";
import { useCreateStatsUser } from "@/hooks/use-stats-users";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Signup() {
  const { toast } = useToast();
  const { mutate: createUser, isPending } = useCreateStatsUser();

  const form = useForm<InsertStatsUser>({
    resolver: zodResolver(insertStatsUserSchema),
    defaultValues: { name: "", email: "" }
  });

  const onSubmit = (data: InsertStatsUser) => {
    createUser(data, {
      onSuccess: () => {
        toast({
            title: "Welcome!",
            description: "Thanks for signing up for updates.",
        });
        form.reset();
      },
      onError: (err) => {
        toast({
            title: "Error",
            description: err.message,
            variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-slate-50 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50"
      >
        <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Join Our List</h1>
            <p className="text-slate-500">Sign up to get notified about new deals and exclusive offers.</p>
        </div>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your Name" {...field} className="h-12 rounded-xl" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="you@example.com" {...field} className="h-12 rounded-xl" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button 
                    type="submit" 
                    disabled={isPending}
                    className="w-full h-12 text-lg rounded-xl shadow-lg shadow-primary/25"
                >
                    {isPending ? "Signing up..." : "Sign Up Now"}
                </Button>
            </form>
        </Form>
      </motion.div>
    </div>
  );
}
