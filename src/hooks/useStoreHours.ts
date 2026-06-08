import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StoreHours {
  open: string;
  close: string;
  closed: boolean;
}

interface StoreHoursData {
  monday: StoreHours;
  tuesday: StoreHours;
  wednesday: StoreHours;
  thursday: StoreHours;
  friday: StoreHours;
  saturday: StoreHours;
  sunday: StoreHours;
}

export const useStoreHours = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [storeHours, setStoreHours] = useState<StoreHoursData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreHours = async () => {
      const { data } = await supabase
        .from('store_settings')
        .select('store_hours')
        .single();
      
      if (data?.store_hours) {
        setStoreHours(data.store_hours as unknown as StoreHoursData);
      }
      setLoading(false);
    };

    fetchStoreHours();
  }, []);

  useEffect(() => {
    if (!storeHours) return;

    const checkIfOpen = () => {
      const now = new Date();
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const currentDay = days[now.getDay()] as keyof StoreHoursData;
      const todayHours = storeHours[currentDay];

      if (todayHours.closed) {
        setIsOpen(false);
        return;
      }

      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const open = todayHours.open >= currentTime && currentTime < todayHours.close;
      setIsOpen(open);
    };

    checkIfOpen();
    const interval = setInterval(checkIfOpen, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [storeHours]);

  return { isOpen, storeHours, loading };
};
