import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const usePushNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === "granted";
  };

  const sendNotification = (title: string, body: string) => {
    if (permission === "granted") {
      new Notification(title, {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
      });
    }
  };

  const listenForNewMessages = () => {
    const channel = supabase
      .channel('new-messages-notification')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: 'sender_type=eq.customer'
        },
        async (payload) => {
          console.log('New message notification:', payload);
          
          // Fetch conversation details
          const { data: conversation } = await supabase
            .from('conversations')
            .select('customer_name, assigned_to')
            .eq('id', payload.new.conversation_id)
            .single();

          if (conversation && !conversation.assigned_to) {
            sendNotification(
              "New Message",
              `${conversation.customer_name} sent a message`
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return {
    permission,
    requestPermission,
    sendNotification,
    listenForNewMessages,
  };
};
