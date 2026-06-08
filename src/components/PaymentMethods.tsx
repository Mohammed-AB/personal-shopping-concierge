import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, DollarSign, Link } from "lucide-react";

const PaymentMethods = () => {
  const methods = [
    {
      icon: Smartphone,
      name: "Cash App",
      description: "Quick & easy mobile payment",
    },
    {
      icon: Smartphone,
      name: "Apple Pay",
      description: "Secure contactless payment",
    },
    {
      icon: Link,
      name: "Payment Link",
      description: "We'll send you a secure link",
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Flexible Payment Options</h2>
          <p className="text-muted-foreground text-lg">Choose the payment method that works best for you</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {methods.map((method) => (
            <Card key={method.name} className="text-center hover:border-accent transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center mx-auto mb-4">
                  <method.icon className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle>{method.name}</CardTitle>
                <CardDescription>{method.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PaymentMethods;
