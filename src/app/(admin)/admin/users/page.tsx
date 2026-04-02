'use client';

import { useState, useEffect, useCallback } from 'react';
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

  const fetchUsers = useCallback(async (cursor?: string | null) => {
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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [activeTab, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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

  if (loading && users.length === 0) return <div className="container mx-auto px-4 py-8 text-center">Loading users...</div>;

  const tabs = [
    { value: 'pending', label: 'Pending Verification' },
    { value: 'all', label: 'All Users' },
    { value: 'suspended', label: 'Suspended' },
  ];

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">User Management</h1>
        <Link href="/admin" className={buttonVariants({ variant: 'outline' }) + " flex items-center gap-2 text-sm"}>
            ← Back
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full flex overflow-x-auto">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex-shrink-0">{tab.label}</TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">{tab.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-3 sm:mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    className="pl-10 h-10 sm:h-11"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 border rounded-lg cursor-pointer hover:bg-muted/50"
                      onClick={() => { setSelectedUser(user); setModalOpen(true); }}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                          <AvatarImage src={user.photoURL || ''} />
                          <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">{user.displayName}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate max-w-[180px] sm:max-w-none">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 ml-13 sm:ml-0">
                        <Badge variant={user.isVerified ? 'success' : 'secondary'} className="text-xs">
                          {user.isVerified ? 'Verified' : 'Pending'}
                        </Badge>
                        <Badge variant={user.status === 'suspended' ? 'destructive' : 'secondary'} className="text-xs">
                          {user.status || 'active'}
                        </Badge>
                        {!user.isVerified && (
                          <Button
                            size="sm"
                            className="h-8 text-xs sm:text-sm"
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
                  <p className="text-center py-6 sm:py-8 text-muted-foreground">No users found</p>
                )}

                <div className="flex justify-between mt-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={prevCursors.length === 0}
                    className="flex-1 sm:flex-none"
                  >
                    <ChevronLeft className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">Previous</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!nextCursor}
                    className="flex-1 sm:flex-none"
                  >
                    <span className="hidden sm:inline">Next</span> <ChevronRight className="h-4 w-4 sm:ml-1" />
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
