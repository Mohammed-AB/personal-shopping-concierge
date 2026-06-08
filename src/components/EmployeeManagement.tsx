import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { UserPlus, Trash2 } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  username: string;
  chat_access_enabled: boolean;
  is_active: boolean;
  user_id: string;
}

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployeeUsername, setNewEmployeeUsername] = useState("");
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeePassword, setNewEmployeePassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();

    const channel = supabase
      .channel('employees-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'employees'
        },
        () => {
          fetchEmployees();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchEmployees = async () => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching employees:', error);
      return;
    }

    setEmployees(data || []);
  };

  const createEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create internal email using username
      const email = `${newEmployeeUsername}@internal.store`;

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: newEmployeePassword,
        email_confirm: true,
      });

      if (authError) throw authError;

      if (!authData.user) throw new Error("User creation failed");

      // Create employee record
      const { error: employeeError } = await supabase
        .from('employees')
        .insert({
          user_id: authData.user.id,
          name: newEmployeeName,
          username: newEmployeeUsername,
          email,
        });

      if (employeeError) throw employeeError;

      // Assign employee role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: 'employee',
        });

      if (roleError) throw roleError;

      toast({
        title: "Success",
        description: "Employee created successfully",
      });

      setNewEmployeeUsername("");
      setNewEmployeeName("");
      setNewEmployeePassword("");
      fetchEmployees();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleChatAccess = async (employeeId: string, currentAccess: boolean) => {
    const { error } = await supabase
      .from('employees')
      .update({ chat_access_enabled: !currentAccess })
      .eq('id', employeeId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update chat access",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Chat access ${!currentAccess ? 'enabled' : 'disabled'}`,
    });
  };

  const deactivateEmployee = async (employeeId: string, userId: string) => {
    const { error: employeeError } = await supabase
      .from('employees')
      .update({ is_active: false })
      .eq('id', employeeId);

    if (employeeError) {
      toast({
        title: "Error",
        description: "Failed to deactivate employee",
        variant: "destructive",
      });
      return;
    }

    // Also delete the auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
      console.error('Error deleting auth user:', authError);
    }

    toast({
      title: "Success",
      description: "Employee deactivated successfully",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Employee</CardTitle>
          <CardDescription>Create login credentials for a new employee</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={createEmployee} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={newEmployeeUsername}
                  onChange={(e) => setNewEmployeeUsername(e.target.value)}
                  placeholder="username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newEmployeeName}
                  onChange={(e) => setNewEmployeeName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newEmployeePassword}
                  onChange={(e) => setNewEmployeePassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              <UserPlus className="w-4 h-4 mr-2" />
              {loading ? "Creating..." : "Create Employee"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Employees</CardTitle>
          <CardDescription>Control chat access and manage employee accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employees.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No employees yet</p>
            ) : (
              employees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold">{employee.name}</h4>
                    <p className="text-sm text-muted-foreground">@{employee.username}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`access-${employee.id}`} className="text-sm">
                        Chat Access
                      </Label>
                      <Switch
                        id={`access-${employee.id}`}
                        checked={employee.chat_access_enabled}
                        onCheckedChange={() =>
                          toggleChatAccess(employee.id, employee.chat_access_enabled)
                        }
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deactivateEmployee(employee.id, employee.user_id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeManagement;
