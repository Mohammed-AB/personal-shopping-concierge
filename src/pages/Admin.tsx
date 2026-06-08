import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminConversationList from '@/components/AdminConversationList';
import AdminChatView from '@/components/AdminChatView';
import EmployeeManagement from '@/components/EmployeeManagement';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { ArrowLeft, LogOut, Bell, BellOff } from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { permission, requestPermission, listenForNewMessages } = usePushNotifications();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (permission === "granted") {
      return listenForNewMessages();
    }
  }, [permission]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      navigate('/auth');
      return;
    }

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const hasAdminRole = roles?.some(r => r.role === 'admin');
    setIsAdmin(hasAdminRole || false);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleNotificationRequest = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast({
        title: "Success",
        description: "Push notifications enabled",
      });
    } else {
      toast({
        title: "Denied",
        description: "Push notifications were denied",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-zinc-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Store Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage customer conversations</p>
            </div>
          </div>
          <div className="flex gap-2">
            {permission !== "granted" && (
              <Button variant="outline" size="sm" onClick={handleNotificationRequest}>
                <Bell className="w-4 h-4 mr-2" />
                Enable Notifications
              </Button>
            )}
            {permission === "granted" && (
              <Button variant="outline" size="sm" disabled>
                <BellOff className="w-4 h-4 mr-2" />
                Notifications On
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto p-4">
        <Tabs defaultValue="conversations" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            {isAdmin && <TabsTrigger value="employees">Employee Management</TabsTrigger>}
          </TabsList>

          <TabsContent value="conversations">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 h-[calc(100vh-12rem)]">
              <div className="md:col-span-1">
                <AdminConversationList
                  onSelectConversation={setSelectedConversation}
                  selectedId={selectedConversation}
                />
              </div>
              <div className="md:col-span-2">
                {selectedConversation ? (
                  <AdminChatView conversationId={selectedConversation} />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Select a conversation to view messages
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="employees">
              <EmployeeManagement />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
