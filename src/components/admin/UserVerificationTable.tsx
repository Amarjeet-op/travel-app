import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function UserVerificationTable({ users, onAction }: { users: any[]; onAction: (userId: string, action: string) => void }) {
  const [search, setSearch] = useState('');
  const filtered = users.filter((u) => u.displayName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input placeholder="Search users..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      <div className="space-y-2">
        {filtered.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10"><AvatarImage src={user.photoURL || ''} /><AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback></Avatar>
              <div><p className="font-semibold">{user.displayName}</p><p className="text-sm text-muted-foreground">{user.email}</p></div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={user.isVerified ? 'success' : 'secondary'}>{user.isVerified ? 'Verified' : 'Pending'}</Badge>
              {!user.isVerified && <Button size="sm" onClick={() => onAction(user.id, 'verify')}>Verify</Button>}
              <Button size="sm" variant="destructive" onClick={() => onAction(user.id, user.status === 'suspended' ? 'unsuspend' : 'suspend')}>{user.status === 'suspended' ? 'Unsuspend' : 'Suspend'}</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
