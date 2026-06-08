import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onSelect: () => void;
}

const ServiceCard = ({ title, description, icon: Icon, onSelect }: ServiceCardProps) => {
  return (
    <Card className="group hover:border-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/20">
      <CardHeader>
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-accent-foreground" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onSelect} variant="outline" className="w-full group-hover:border-accent group-hover:text-accent">
          Select Service
        </Button>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
