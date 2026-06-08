import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageSquare, Video, UserCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Employee {
  id: string;
  name: string;
}

interface Conversation {
  id: string;
  customer_name: string;
  customer_email: string;
  service_type: 'chat' | 'facetime';
  status: string;
  created_at: string;
  assigned_to: string | null;
  employees: Employee | null;
}

interface AdminConversationListProps {
  onSelectConversation: (id: string) => void;
  selectedId: string | null;
}

const AdminConversationList = ({ onSelectConversation, selectedId }: AdminConversationListProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
      const { data } = await supabase
        .from('conversations')
        .select(`
          *,
          employees:assigned_to (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (data) {
        setConversations(data as Conversation[]);
      }
    };

    fetchConversations();

    // Subscribe to new conversations
    const channel = supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const assignToMe = async (conversationId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: employee } = await supabase
      .from('employees')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!employee) return;

    const { error } = await supabase
      .from('conversations')
      .update({ 
        assigned_to: employee.id,
        assigned_at: new Date().toISOString()
      })
      .eq('id', conversationId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to assign conversation",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Conversation assigned to you",
    });
  };

  return (
    <div className="border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Conversations</h2>
        <p className="text-sm text-muted-foreground">{conversations.length} total</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {conversations.map((conv) => (
            <Card
              key={conv.id}
              className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                selectedId === conv.id ? 'bg-muted border-primary' : ''
              }`}
              onClick={() => onSelectConversation(conv.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {conv.service_type === 'chat' ? (
                    <MessageSquare className="h-4 w-4 text-primary" />
                  ) : (
                    <Video className="h-4 w-4 text-primary" />
                  )}
                  <span className="font-medium">{conv.customer_name}</span>
                </div>
                <Badge variant={conv.status === 'active' ? 'default' : 'secondary'}>
                  {conv.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">{conv.customer_email}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(conv.created_at).toLocaleString()}
              </p>
              {conv.employees && (
                <p className="text-xs text-primary mt-1 font-medium">
                  Handled by: {conv.employees.name}
                </p>
              )}
              {!conv.assigned_to && (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    assignToMe(conv.id);
                  }}
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Assign to Me
                </Button>
              )}
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AdminConversationList;
