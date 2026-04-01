'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/users?userId=${userId}`);
      const data = await res.json();
      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8"><div className="skeleton-shimmer h-64 rounded-lg" /></div>;
  if (!profile) return <div className="container mx-auto px-4 py-8 text-center"><h2 className="text-2xl font-bold mb-4">User not found</h2></div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-20 w-20"><AvatarImage src={profile.photoURL || ''} /><AvatarFallback className="text-2xl">{profile.displayName?.[0] || 'U'}</AvatarFallback></Avatar>
            <div>
              <h2 className="text-2xl font-bold">{profile.displayName}</h2>
              <div className="flex items-center gap-2 mt-1">
                {profile.isVerified && <Badge variant="success">Verified</Badge>}
                <Badge variant="secondary">{profile.gender}</Badge>
                <Badge variant="secondary">{profile.age} years</Badge>
              </div>
            </div>
          </div>
          <div className="space-y-3 text-muted-foreground">
            {profile.bio && <p>{profile.bio}</p>}
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{profile.homeCity}</span></div>
            {profile.createdAt?.toDate && <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>Member since {format(profile.createdAt.toDate(), 'MMMM yyyy')}</span></div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
