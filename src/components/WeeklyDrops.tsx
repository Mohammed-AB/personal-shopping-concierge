import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WeeklyDrop {
  id: string;
  title: string;
  description: string;
  image_url: string;
  price: string;
  drop_date: string;
}

const WeeklyDrops = () => {
  const [drops, setDrops] = useState<WeeklyDrop[]>([]);

  useEffect(() => {
    const fetchDrops = async () => {
      const { data } = await supabase
        .from('weekly_drops')
        .select('*')
        .eq('is_active', true)
        .order('drop_date', { ascending: false })
        .limit(3);
      
      if (data) {
        setDrops(data as WeeklyDrop[]);
      }
    };

    fetchDrops();
  }, []);

  if (drops.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-black text-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-accent text-accent">NEW ARRIVALS</Badge>
          <h2 className="text-5xl md:text-6xl font-display font-bold mb-4 tracking-tight">
            WEEKLY DROPS
          </h2>
          <p className="text-lg text-gray-400">Exclusive releases. Limited quantities.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {drops.map((drop) => (
            <Card 
              key={drop.id}
              className="group overflow-hidden border-0 bg-zinc-900 hover:bg-zinc-800 transition-all duration-300"
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={drop.image_url || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800"} 
                  alt={drop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-display font-bold mb-2">{drop.title}</h3>
                <p className="text-gray-400 mb-4 text-sm">{drop.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{drop.price}</span>
                  <Badge className="bg-accent hover:bg-accent/90">DROP</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WeeklyDrops;
