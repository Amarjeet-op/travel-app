import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function UserDetailModal({ user, open, onOpenChange, onAction }: { user: any; open: boolean; onOpenChange: (open: boolean) => void; onAction: (userId: string, action: string) => void }) {
  if (!user) return null;
  
  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>User Details</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16"><AvatarImage src={user.photoURL || ''} /><AvatarFallback className="text-xl bg-primary/10 text-primary font-bold">{getInitials(user.displayName || '')}</AvatarFallback></Avatar>
            <div>
              <h3 className="text-xl font-bold">{user.displayName}</h3>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex gap-2 mt-1">
                <Badge variant={user.isVerified ? 'success' : 'secondary'}>{user.isVerified ? 'Verified' : 'Pending'}</Badge>
                <Badge variant={user.status === 'suspended' ? 'destructive' : 'secondary'}>{user.status || 'active'}</Badge>
                {user.role === 'admin' && <Badge className="bg-red-500 text-white">Admin</Badge>}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-muted-foreground">Phone</p><p>{user.phone || 'N/A'}</p></div>
            <div><p className="text-muted-foreground">City</p><p>{user.homeCity || 'N/A'}</p></div>
            <div><p className="text-muted-foreground">Gender</p><p>{user.gender || 'N/A'}</p></div>
            <div><p className="text-muted-foreground">Age</p><p>{user.age || 'N/A'}</p></div>
            <div><p className="text-muted-foreground">Role</p><p className="font-medium">{user.role || 'user'}</p></div>
            <div><p className="text-muted-foreground">Joined</p><p>{user.createdAt?.toDate ? new Date(user.createdAt.toDate()).toLocaleDateString() : 'N/A'}</p></div>
          </div>
          {user.bio && <div><p className="text-muted-foreground text-sm">Bio</p><p className="text-sm">{user.bio}</p></div>}
          {user.emergencyContacts?.length > 0 && (
            <div><p className="font-semibold mb-2">Emergency Contacts</p>
              {user.emergencyContacts.map((c: any, i: number) => <p key={i} className="text-sm">{c.name} ({c.relationship}) - {c.phone}</p>)}
            </div>
          )}
          <div className="flex gap-2 flex-wrap">
            {!user.isVerified && <Button onClick={() => { onAction(user.id, 'verify'); onOpenChange(false); }}>Verify</Button>}
            <Button variant="destructive" onClick={() => { onAction(user.id, user.status === 'suspended' ? 'unsuspend' : 'suspend'); onOpenChange(false); }}>{user.status === 'suspended' ? 'Unsuspend' : 'Suspend'}</Button>
            {user.role !== 'admin' && (
              <Button className="bg-red-500 hover:bg-red-600" onClick={() => { onAction(user.id, 'make_admin'); onOpenChange(false); }}>Make Admin</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
