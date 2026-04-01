'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Shield, AlertTriangle, CheckCircle, Loader2, ExternalLink,
  MapPin, Clock, Users, Sun, Moon, Search, HeartHandshake
} from 'lucide-react';
import { CITIES } from '@/constants/cities';
import { toast } from 'react-hot-toast';
import type { SafetyResult } from '@/types/safety';

export default function SafetyCheckerPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SafetyResult | null>(null);
  const [form, setForm] = useState({
    area: '',
    city: '',
    travelerType: 'solo-woman',
    timeOfVisit: 'evening',
    concerns: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/safety/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Safety check failed');

      const data = await res.json();
      setResult(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to check safety');
    } finally {
      setLoading(false);
    }
  };

  const signalConfig = {
    green: { color: 'bg-green-500', text: 'Generally Safe', icon: CheckCircle, gradient: 'from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20', accent: 'from-green-500 to-emerald-500', shadow: 'shadow-green-500/30' },
    yellow: { color: 'bg-yellow-500', text: 'Exercise Caution', icon: AlertTriangle, gradient: 'from-amber-500/10 to-yellow-500/10 dark:from-amber-500/20 dark:to-yellow-500/20', accent: 'from-amber-500 to-yellow-500', shadow: 'shadow-amber-500/30' },
    red: { color: 'bg-red-500', text: 'High Risk Area', icon: AlertTriangle, gradient: 'from-red-500/10 to-rose-500/10 dark:from-red-500/20 dark:to-rose-500/20', accent: 'from-red-500 to-rose-500', shadow: 'shadow-red-500/30' },
  };

  const timeIcons: Record<string, any> = {
    morning: Sun,
    afternoon: Sun,
    evening: Moon,
    night: Moon,
  };
  const travelerLabels: Record<string, string> = {
    'solo-woman': 'Solo Woman',
    'solo-man': 'Solo Man',
    couple: 'Couple',
    group: 'Group',
    family: 'Family',
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <span className="text-gradient">AI Safety Checker</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">Get real-time safety assessments powered by Google AI</p>
      </div>

      {/* Form Card */}
      <div className="relative rounded-2xl bg-gradient-to-br p-px mb-8">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 opacity-50" />
        <div className="relative rounded-2xl bg-card dark:bg-card/95 p-5 sm:p-6 border border-border/50">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> Check Area Safety
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="area">Area/Locality</Label>
                <Input
                  id="area"
                  placeholder="e.g., Connaught Place"
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  required
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <select
                  id="city"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  required
                >
                  <option value="">Select city</option>
                  {CITIES.map((city) => (
                    <option key={`${city.name}-${city.state}`} value={city.name}>
                      {city.name}, {city.state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="travelerType">Traveler Type</Label>
                <select
                  id="travelerType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.travelerType}
                  onChange={(e) => setForm({ ...form, travelerType: e.target.value })}
                >
                  {Object.entries(travelerLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeOfVisit">Time of Visit</Label>
                <select
                  id="timeOfVisit"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.timeOfVisit}
                  onChange={(e) => setForm({ ...form, timeOfVisit: e.target.value })}
                >
                  <option value="morning">Morning (6AM-12PM)</option>
                  <option value="afternoon">Afternoon (12PM-6PM)</option>
                  <option value="evening">Evening (6PM-10PM)</option>
                  <option value="night">Night (10PM-6AM)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="concerns">Specific Concerns (Optional)</Label>
              <Textarea
                id="concerns"
                placeholder="e.g., Is it safe to walk at night?"
                value={form.concerns}
                onChange={(e) => setForm({ ...form, concerns: e.target.value })}
                rows={3}
                className="resize-none"
              />
            </div>

            <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking Safety...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Check Safety
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Results */}
      {result && (() => {
        const config = signalConfig[result.signal];
        const SigIcon = config.icon;
        const TimeIcon = timeIcons[form.timeOfVisit] || Clock;

        return (
          <div className="space-y-6">
            {/* Signal Card */}
            <div className="relative rounded-2xl bg-gradient-to-br p-px">
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${config.accent} opacity-10 blur-xl`} />
              <div className={`relative rounded-2xl bg-gradient-to-br ${config.gradient} p-5 sm:p-6 border border-border/50`}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <div className={`w-12 h-12 ${config.accent} rounded-xl flex items-center justify-center shadow-lg ${config.shadow}`}>
                    <SigIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold">{config.text}</h2>
                    <p className="text-sm text-muted-foreground">{form.area}, {form.city}</p>
                  </div>
                  <Badge variant={result.signal === 'green' ? 'success' : result.signal === 'yellow' ? 'warning' : 'destructive'} className="text-sm px-3 py-1">
                    Score: {result.score}/10
                  </Badge>
                </div>

                {/* Context badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/60 text-xs font-medium">
                    <Users className="h-3 w-3" />
                    {travelerLabels[form.travelerType]}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/60 text-xs font-medium">
                    <TimeIcon className="h-3 w-3" />
                    {form.timeOfVisit}
                  </div>
                </div>

                {/* Findings */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Key Findings</h3>
                  <ol className="list-decimal list-inside space-y-1.5 text-sm text-muted-foreground">
                    {result.findings.map((finding: string, i: number) => (
                      <li key={i}>{finding}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            {/* Women's Safety + Night Safety */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="relative rounded-2xl bg-gradient-to-br p-px">
                <div className="relative rounded-2xl bg-card dark:bg-card/95 p-5 border border-border/50">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <HeartHandshake className="h-4 w-4 text-primary" /> Women&apos;s Safety
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.womenSafety}</p>
                </div>
              </div>
              <div className="relative rounded-2xl bg-gradient-to-br p-px">
                <div className="relative rounded-2xl bg-card dark:bg-card/95 p-5 border border-border/50">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Moon className="h-4 w-4 text-primary" /> Night Safety
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.nightSafety}</p>
                </div>
              </div>
            </div>

            {/* Transport */}
            <div className="relative rounded-2xl bg-gradient-to-br p-px">
              <div className="relative rounded-2xl bg-card dark:bg-card/95 p-5 border border-border/50">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> Transport Recommendations
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.transport}</p>
              </div>
            </div>

            {/* Emergency Numbers */}
            <div className="relative rounded-2xl bg-gradient-to-br p-px">
              <div className="relative rounded-2xl bg-card dark:bg-card/95 p-5 border border-border/50">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" /> Emergency Numbers
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-xl bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Police</p>
                    <p className="font-bold text-lg">{result.emergencyNumbers?.police || '100'}</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Women Helpline</p>
                    <p className="font-bold text-lg">{result.emergencyNumbers?.womenHelpline || '1091'}</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Hospital</p>
                    <p className="font-bold text-lg">{result.emergencyNumbers?.hospital || '108'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sources */}
            {result.sources && result.sources.length > 0 && (
              <div className="relative rounded-2xl bg-gradient-to-br p-px">
                <div className="relative rounded-2xl bg-card dark:bg-card/95 p-5 border border-border/50">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-primary" /> Sources
                  </h3>
                  <div className="space-y-2">
                    {result.sources.map((source: any, i: number) => (
                      <a
                        key={i}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline transition-colors"
                      >
                        <ExternalLink className="h-3 w-3 shrink-0" />
                        <span className="truncate">{source.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
