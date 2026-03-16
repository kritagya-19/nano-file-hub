import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminGroups } from "@/hooks/useAdmin";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, UsersRound, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const AdminGroups = () => {
  const { groups, loading, deleteGroup } = useAdminGroups();
  const [memberCounts, setMemberCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchMemberCounts = async () => {
      const counts: Record<string, number> = {};
      for (const group of groups) {
        const { count } = await supabase
          .from('group_members')
          .select('*', { count: 'exact', head: true })
          .eq('group_id', group.id);
        counts[group.id] = count || 0;
      }
      setMemberCounts(counts);
    };
    if (groups.length > 0) fetchMemberCounts();
  }, [groups]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const handleDelete = async (groupId: string, groupName: string) => {
    if (!confirm(`Delete group "${groupName}"? This will remove all messages and members.`)) return;
    await deleteGroup(groupId);
    toast({ title: "Group deleted", description: `"${groupName}" has been removed.` });
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Group Management</h1>
            <p className="text-muted-foreground mt-1">{groups.length} groups total</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <UsersRound className="w-5 h-5 text-primary" />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Group Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groups.map((group) => (
                    <TableRow key={group.id}>
                      <TableCell className="font-medium text-foreground">{group.name}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">
                        {group.description || "No description"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {memberCounts[group.id] ?? "..."}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(group.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(group.id, group.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {groups.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                        No groups found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminGroups;
