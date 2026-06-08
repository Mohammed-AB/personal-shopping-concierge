import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ServiceCard from "@/components/ServiceCard";
import BookingForm from "@/components/BookingForm";
import PaymentMethods from "@/components/PaymentMethods";
import WeeklyDrops from "@/components/WeeklyDrops";
import InstagramFeed from "@/components/InstagramFeed";
import { MessageSquare, Video, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

type ViewState = "services" | "booking";
type ServiceType = "chat" | "facetime" | null;

const Index = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewState>("services");
  const [selectedService, setSelectedService] = useState<ServiceType>(null);

  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service);
    setView("booking");
  };

  const handleBack = () => {
    setView("services");
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-black via-zinc-900 to-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920')] bg-cover bg-center opacity-10"></div>
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin')}
            className="gap-2 text-white hover:bg-white/10"
          >
            <Settings className="h-4 w-4" />
            Admin
          </Button>
        </div>
        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 tracking-tighter animate-fade-in">
            LUXURY<br />STREETWEAR
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto font-light">
            Your personal shopping concierge for exclusive drops and curated style
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg"
              variant="inverse"
              onClick={() => handleServiceSelect("chat")}
            >
              Shop with Expert
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => handleServiceSelect("facetime")}
              className="border-white text-white hover:bg-white hover:text-black"
            >
              Book Video Tour
            </Button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Weekly Drops Section */}
      <WeeklyDrops />

      {/* Services Section */}
      {view === "services" && (
        <section className="py-20 px-4 bg-zinc-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">CONCIERGE SERVICES</h2>
              <p className="text-muted-foreground text-lg">Personalized shopping experience, your way</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <ServiceCard
                title="Live Chat"
                description="Message our style experts to find the perfect pieces or match your dream sneakers. Get real-time recommendations."
                icon={MessageSquare}
                onSelect={() => handleServiceSelect("chat")}
              />
              <ServiceCard
                title="Video Consultation"
                description="Book a FaceTime tour of our store. See products in real-time and get instant styling feedback."
                icon={Video}
                onSelect={() => handleServiceSelect("facetime")}
              />
            </div>
          </div>
        </section>
      )}

      {/* Booking Form */}
      {view === "booking" && selectedService && (
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <BookingForm serviceType={selectedService} onBack={handleBack} />
          </div>
        </section>
      )}

      {/* Instagram Feed */}
      {view === "services" && <InstagramFeed />}

      {/* Payment Methods */}
      {view === "services" && <PaymentMethods />}

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-black text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-display font-bold text-2xl mb-4">YOUR STORE</h3>
              <p className="text-gray-400">Luxury streetwear. Exclusive drops.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">CONNECT</h4>
              <div className="space-y-2 text-gray-400">
                <p>Instagram: @yourstore</p>
                <p>Email: shop@yourstore.com</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">HOURS</h4>
              <div className="space-y-1 text-gray-400">
                <p>Mon-Sat: 10AM - 8PM</p>
                <p>Sunday: 12PM - 6PM</p>
              </div>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm pt-8 border-t border-zinc-800">
            <p>© 2024 Your Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
