import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">Get in Touch</h1>
          <p className="text-slate-500 text-lg">We'd love to hear from you. Here's how you can reach us.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Phone</h3>
            <p className="text-slate-500">0792432661</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Email</h3>
            <p className="text-slate-500">mudbon23@gmail.com</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Office</h3>
            <p className="text-slate-500">Kigali, Chic Floor2</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h2>
            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Name</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Email</label>
                        <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="john@example.com" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Message</label>
                    <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[150px]" placeholder="How can we help?" />
                </div>
                <button type="button" className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                    Send Message
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}
