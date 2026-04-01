'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import UserDetailModal from '@/components/admin/UserDetailModal';
import { toast } from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevCursors, setPrevCursors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => { fetchUsers(); }, [activeTab]);

  const fetchUsers = async (cursor?: string | null) => {
    setLoading(true);
    try {
      let url = `/api/admin/users?limit=20`;
      if (activeTab === 'pending') {
        url += '&verified=false';
      } else if (activeTab === 'suspended') {
        url += '&status=suspended';
      }
      if (cursor) url += `&cursor=${cursor}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const res = await fetch(url);
      const data = await res.json();
      setUsers(data.users || []);
      setNextCursor(data.nextCursor || null);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPrevCursors([]);
    fetchUsers();
  };

  const handleNextPage = () => {
    if (nextCursor) {
      setPrevCursors([...prevCursors, nextCursor]);
      fetchUsers(nextCursor);
    }
  };

  const handlePrevPage = () => {
    if (prevCursors.length > 1) {
      const newCursors = prevCursors.slice(0, -1);
      setPrevCursors(newCursors);
      fetchUsers(newCursors[newCursors.length - 1]);
    } else if (prevCursors.length === 1) {
      setPrevCursors([]);
      fetchUsers();
    }
  };

  const handleAction = async (userId: string, action: string) => {
    try {
      await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action, notes: `${action} by admin` }),
      });
      toast.success(`User ${action}ed successfully`);
      fetchUsers();
    } catch (e: any) { toast.error(e.message || 'Action failed'); }
  };

  if (loading && users.length === 0) return <div className="container mx-auto px-4 py-8">Loading...</div>;

  const tabs = [
    { value: 'pending', label: 'Pending Verification' },
    { value: 'all', label: 'All Users' },
    { value: 'suspended', label: 'Suspended' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Link href="/admin" className={buttonVariants({ variant: 'outline' }) + " flex items-center gap-2"}>
            ← Back to Dashboard
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card>
              <CardHeader>
                <CardTitle>{tab.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50"
                      onClick={() => { setSelectedUser(user); setModalOpen(true); }}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.photoURL || ''} />
                          <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{user.displayName}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.isVerified ? 'success' : 'secondary'}>
                          {user.isVerified ? 'Verified' : 'Pending'}
                        </Badge>
                        <Badge variant={user.status === 'suspended' ? 'destructive' : 'secondary'}>
                          {user.status || 'active'}
                        </Badge>
                        {!user.isVerified && (
                          <Button
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); handleAction(user.id, 'verify'); }}
                          >
                            Verify
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {users.length === 0 && (
                  <p className="text-center py-8 text-muted-foreground">No users found</p>
                )}

                <div className="flex justify-between mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={prevCursors.length === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!nextCursor}
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <UserDetailModal
        user={selectedUser}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onAction={handleAction}
      />
    </div>
  );
}
