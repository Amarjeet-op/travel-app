import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone } from 'lucide-react';

export default function EmergencyNumbers({ numbers }: { numbers: { police: string; hospital: string; womenHelpline: string } }) {
  return (
    <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Phone className="h-4 w-4" />Emergency Numbers</CardTitle></CardHeader><CardContent><div className="grid grid-cols-3 gap-4 text-center"><div><p className="text-sm text-muted-foreground">Police</p><p className="font-bold">{numbers?.police || '100'}</p></div><div><p className="text-sm text-muted-foreground">Women Helpline</p><p className="font-bold">{numbers?.womenHelpline || '1091'}</p></div><div><p className="text-sm text-muted-foreground">Hospital</p><p className="font-bold">{numbers?.hospital || '108'}</p></div></div></CardContent></Card>
  );
}
