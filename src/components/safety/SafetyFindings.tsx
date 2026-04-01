import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SafetyFindings({ findings }: { findings: string[] }) {
  return (
    <Card><CardHeader><CardTitle className="text-base">Key Findings</CardTitle></CardHeader><CardContent><ol className="list-decimal list-inside space-y-1 text-muted-foreground">{findings.map((f, i) => <li key={i}>{f}</li>)}</ol></CardContent></Card>
  );
}
