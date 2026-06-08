import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useStoreHours } from "@/hooks/useStoreHours";
import LiveChat from "./LiveChat";

interface BookingFormProps {
  serviceType: "chat" | "facetime";
  onBack: () => void;
}

const BookingForm = ({ serviceType, onBack }: BookingFormProps) => {
  const { toast } = useToast();
  const { isOpen, loading: storeLoading } = useStoreHours();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    preferredTime: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (serviceType === 'chat' && !isOpen) {
      toast({
        title: 'Store is closed',
        description: 'Live chat is only available during store hours',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    
    if (serviceType === 'chat') {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          customer_name: formData.name,
          customer_email: formData.email,
          service_type: 'chat'
        })
        .select()
        .single();

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to start chat',
          variant: 'destructive'
        });
      } else if (data) {
        setConversationId(data.id);
        toast({
          title: 'Chat started',
          description: 'You can now message our team live'
        });
      }
    } else {
      const { error } = await supabase
        .from('conversations')
        .insert({
          customer_name: formData.name,
          customer_email: formData.email,
          service_type: 'facetime'
        });

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to book appointment',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Appointment requested',
          description: 'We will contact you to confirm your FaceTime appointment'
        });
        onBack();
      }
    }
    
    setLoading(false);
  };

  const serviceTitle = serviceType === "chat" ? "Live Chat" : "FaceTime Appointment";

  if (conversationId) {
    return <LiveChat conversationId={conversationId} customerName={formData.name} onBack={onBack} />;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <CardTitle className="text-2xl">{serviceTitle}</CardTitle>
          {serviceType === "chat" && !storeLoading && (
            <Badge variant={isOpen ? "default" : "secondary"}>
              {isOpen ? "Store Open" : "Store Closed"}
            </Badge>
          )}
        </div>
        <CardDescription>
          {serviceType === "chat"
            ? isOpen 
              ? "Start a live chat with our team to find the perfect items"
              : "Live chat is only available during store hours (Mon-Fri 9am-6pm, Sat 10am-4pm)"
            : "Fill out the form below and we'll reach out to schedule your personalized video tour"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your full name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your.email@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(555) 123-4567"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="preferredTime">Preferred Time</Label>
            <Input
              id="preferredTime"
              value={formData.preferredTime}
              onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
              placeholder="e.g., Tomorrow afternoon, Next Monday 2pm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">What can we help you find?</Label>
            <Textarea
              id="message"
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us about your style preferences, what you're looking for..."
              rows={4}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              Back
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-accent to-accent/80 hover:opacity-90"
              disabled={loading || (serviceType === 'chat' && !isOpen)}
            >
              {loading ? 'Processing...' : serviceType === "chat" ? "Start Live Chat" : "Submit Request"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
