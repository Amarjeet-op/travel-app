'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { CITIES } from '@/constants/cities';
import { toast } from 'react-hot-toast';
import { db, storage } from '@/lib/firebase/config';
import { deleteDoc, doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signOutUser } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import {
  MapPin, Mail, Phone, Calendar, Edit2, Save, X, Plus, Trash2,
  User, Shield, LogOut, Camera, AlertTriangle, Clock
} from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user, profileCompleted, isAdmin } = useAuthContext();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    displayName: '', bio: '', phone: '', homeCity: '', gender: '', age: '',
  });
  const [emergencyContacts, setEmergencyContacts] = useState<{ name: string; phone: string; relationship: string }[]>([]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setProfile(data);
      setForm({
        displayName: data.displayName || '',
        bio: data.bio || '',
        phone: data.phone || '',
        homeCity: data.homeCity || '',
        gender: data.gender || '',
        age: data.age || '',
      });
      setEmergencyContacts(data.emergencyContacts || []);
      setPhotoPreview(data.photoURL || null);
    } catch {
      console.error('Failed to fetch profile');
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      let photoURL = profile?.photoURL || null;
      if (photo) {
        const photoRef = ref(storage, `profiles/${user.uid}/avatar.jpg`);
        await uploadBytes(photoRef, photo);
        photoURL = await getDownloadURL(photoRef);
      }
      await setDoc(doc(db, 'users', user.uid), {
        ...form,
        age: parseInt(form.age) || profile?.age,
        emergencyContacts,
        photoURL,
        updatedAt: serverTimestamp(),
        profileCompleted: true,
      }, { merge: true });
      toast.success('Profile updated!');
      setEditing(false);
      fetchProfile();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (!confirm('Are you sure? This will permanently delete your account and all data.')) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'users', user.uid));
      await user.delete();
      await fetch('/api/auth/session', { method: 'DELETE' });
      toast.success('Account deleted');
      router.push('/auth');
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        toast.error('Please re-login to delete your account');
        await signOutUser();
        router.push('/auth');
      } else {
        toast.error(error.message || 'Failed to delete account');
      }
    } finally {
      setLoading(false);
    }
  };

  const addContact = () => {
    setEmergencyContacts([...emergencyContacts, { name: '', phone: '', relationship: '' }]);
  };

  const removeContact = (i: number) => {
    setEmergencyContacts(emergencyContacts.filter((_, idx) => idx !== i));
  };

  const updateContact = (i: number, field: string, value: string) => {
    const updated = [...emergencyContacts];
    updated[i] = { ...updated[i], [field]: value };
    setEmergencyContacts(updated);
  };

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-muted rounded-2xl" />
          <div className="grid md:grid-cols-3 gap-6">
            <div className="h-64 bg-muted rounded-2xl" />
            <div className="h-64 bg-muted rounded-2xl" />
            <div className="h-64 bg-muted rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Profile Banner */}
      <div className="relative">
        <div className="h-36 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl flex items-center px-8">
          <div className="ml-32">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{profile.displayName}</h1>
              {profile.isVerified && (
                <Badge variant="success" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" /> Verified
                </Badge>
              )}
            </div>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            {editing ? (
              <>
                <Button size="sm" onClick={() => { setEditing(false); setPhotoPreview(profile.photoURL || null); }}>
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={loading}>
                  <Save className="h-4 w-4 mr-1" /> {loading ? 'Saving...' : 'Save'}
                </Button>
              </>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                <Edit2 className="h-4 w-4 mr-1" /> Edit Profile
              </Button>
            )}
          </div>
        </div>
        <div className="absolute left-8 top-1/2 -translate-y-1/2">
          <div className="relative">
            <Avatar className="h-28 w-28 ring-4 ring-background shadow-xl">
              <AvatarImage src={photoPreview || ''} />
              <AvatarFallback className={`text-4xl font-bold ${isAdmin ? 'bg-red-500 text-white' : 'bg-primary/10 text-primary'}`}>
                {isAdmin ? 'A' : (profile.displayName?.[0] || 'U')}
              </AvatarFallback>
            </Avatar>
            {editing && (
              <label className="absolute bottom-2 right-2 h-8 w-8 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-primary/90 transition-colors">
                <Camera className="h-4 w-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setPhoto(file);
                      setPhotoPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {/* About Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> About
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editing ? (
              <>
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Mobile</Label>
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Home City</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={form.homeCity}
                      onChange={(e) => setForm({ ...form, homeCity: e.target.value })}
                    >
                      <option value="">Select city</option>
                      {CITIES.map((city) => (
                        <option key={city.name} value={city.name}>{city.name}, {city.state}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} maxLength={300} rows={3} />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <User className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Gender</p>
                      <p className="text-sm font-medium capitalize">{profile.gender || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Calendar className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Age</p>
                      <p className="text-sm font-medium">{profile.age ? `${profile.age} years` : 'Not set'}</p>
                    </div>
                  </div>
                </div>
                {profile.bio && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">{profile.bio}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Mail className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">{profile.email}</p>
                    </div>
                  </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Mobile</p>
                      <p className="text-sm font-medium">{profile.phone || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Home City</p>
                      <p className="text-sm font-medium">{profile.homeCity || 'Not set'}</p>
                    </div>
                  </div>
                  {profile.createdAt?.toDate && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Clock className="h-4 w-4 text-primary shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Member Since</p>
                        <p className="text-sm font-medium">{format(profile.createdAt.toDate(), 'MMM yyyy')}</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Stats Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Travel Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">Trips Posted</span>
                <span className="text-lg font-bold">{profile.tripsPosted || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">Trips Joined</span>
                <span className="text-lg font-bold">{profile.tripsJoined || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={profile.status === 'active' ? 'success' : 'secondary'}>
                  {profile.status || 'active'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" /> Emergency Contacts
                </span>
                {editing && (
                  <Button size="sm" variant="ghost" onClick={addContact}>
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {emergencyContacts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No emergency contacts added</p>
              ) : (
                emergencyContacts.map((contact, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/50">
                    {editing ? (
                      <div className="space-y-2">
                        <Input
                          placeholder="Name"
                          value={contact.name}
                          onChange={(e) => updateContact(i, 'name', e.target.value)}
                          className="h-8 text-sm"
                        />
                        <Input
                          placeholder="Phone"
                          value={contact.phone}
                          onChange={(e) => updateContact(i, 'phone', e.target.value)}
                          className="h-8 text-sm"
                        />
                        <div className="flex gap-2">
                          <Input
                            placeholder="Relationship"
                            value={contact.relationship}
                            onChange={(e) => updateContact(i, 'relationship', e.target.value)}
                            className="h-8 text-sm flex-1"
                          />
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive" onClick={() => removeContact(i)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold text-sm">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.relationship}</p>
                        <p className="text-sm font-medium mt-1">{contact.phone}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Button variant="destructive" className="w-full" onClick={handleDeleteAccount} disabled={loading}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
