'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { APP_CONFIG } from '@/constants/config';

export default function EmergencyContacts({ contacts, onSave }: { contacts: any[]; onSave: (contacts: any[]) => void }) {
  const [list, setList] = useState(contacts.length > 0 ? contacts : [{ name: '', phone: '', relationship: '' }]);

  const addContact = () => {
    if (list.length >= APP_CONFIG.maxEmergencyContacts) {
      toast.error(`Maximum ${APP_CONFIG.maxEmergencyContacts} contacts allowed`);
      return;
    }
    setList([...list, { name: '', phone: '', relationship: '' }]);
  };

  const removeContact = (index: number) => {
    if (list.length <= APP_CONFIG.minEmergencyContacts) {
      toast.error('At least one emergency contact required');
      return;
    }
    setList(list.filter((_, i) => i !== index));
  };

  const updateContact = (index: number, field: string, value: string) => {
    const updated = [...list];
    updated[index] = { ...updated[index], [field]: value };
    setList(updated);
  };

  const handleSave = () => {
    const valid = list.filter((c) => c.name && c.phone);
    if (valid.length < APP_CONFIG.minEmergencyContacts) {
      toast.error('At least one complete contact required');
      return;
    }
    onSave(valid);
    toast.success('Emergency contacts saved!');
  };

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Phone className="h-5 w-5" />Emergency Contacts</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {list.map((contact, i) => (
          <div key={i} className="flex gap-2 items-start p-3 border rounded-lg">
            <div className="flex-1 space-y-2">
              <Input placeholder="Name" value={contact.name} onChange={(e) => updateContact(i, 'name', e.target.value)} />
              <Input placeholder="Phone" value={contact.phone} onChange={(e) => updateContact(i, 'phone', e.target.value)} />
              <Input placeholder="Relationship" value={contact.relationship} onChange={(e) => updateContact(i, 'relationship', e.target.value)} />
            </div>
            <Button variant="ghost" size="icon" onClick={() => removeContact(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Button variant="outline" onClick={addContact}><Plus className="h-4 w-4 mr-1" />Add Contact</Button>
          <Button onClick={handleSave}>Save Contacts</Button>
        </div>
      </CardContent>
    </Card>
  );
}
