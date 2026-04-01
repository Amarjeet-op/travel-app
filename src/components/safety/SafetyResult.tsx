import type { SafetyResult } from '@/types/safety';
import SafetySignal from './SafetySignal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Phone } from 'lucide-react';

export default function SafetyResult({ result, onSave }: { result: SafetyResult; onSave?: () => void }) {
  return (
    <Card className={result.signal === 'green' ? 'border-green-500' : result.signal === 'yellow' ? 'border-yellow-500' : 'border-red-500'}>
      <CardHeader>
        <SafetySignal signal={result.signal} score={result.score} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div><h3 className="font-semibold mb-2">Key Findings</h3><ol className="list-decimal list-inside space-y-1 text-muted-foreground">{result.findings.map((f, i) => <li key={i}>{f}</li>)}</ol></div>
        <Card><CardHeader className="pb-2"><CardTitle className="text-base">Women&apos;s Safety</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">{result.womenSafety}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-base">Night Safety</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">{result.nightSafety}</p></CardContent></Card>
        <div><h3 className="font-semibold mb-2">Transport Recommendations</h3><p className="text-muted-foreground">{result.transport}</p></div>
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Phone className="h-4 w-4" />Emergency Numbers</CardTitle></CardHeader><CardContent><div className="grid grid-cols-3 gap-4 text-center"><div><p className="text-sm text-muted-foreground">Police</p><p className="font-bold text-lg">{result.emergencyNumbers?.police || '100'}</p></div><div><p className="text-sm text-muted-foreground">Women Helpline</p><p className="font-bold text-lg">{result.emergencyNumbers?.womenHelpline || '1091'}</p></div><div><p className="text-sm text-muted-foreground">Hospital</p><p className="font-bold text-lg">{result.emergencyNumbers?.hospital || '108'}</p></div></div></CardContent></Card>
        {result.sources?.length > 0 && <div><h3 className="font-semibold mb-2">Sources</h3><div className="space-y-1">{result.sources.map((s, i) => <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline"><ExternalLink className="h-3 w-3" />{s.title}</a>)}</div></div>}
        {onSave && <button onClick={onSave} className="text-sm text-primary hover:underline">Save This Check</button>}
      </CardContent>
    </Card>
  );
}
