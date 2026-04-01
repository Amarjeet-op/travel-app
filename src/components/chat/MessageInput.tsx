'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Image as ImageIcon } from 'lucide-react';

export default function MessageInput({ onSend, onTyping }: { onSend: (content: string, type?: 'text' | 'image') => void; onTyping: (typing: boolean) => void }) {
  const [value, setValue] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value, 'text');
    setValue('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    onTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => onTyping(false), 2000);
  };

  return (
    <div className="border-t p-4">
      <div className="flex gap-2 items-end">
        <Button variant="ghost" size="icon" aria-label="Attach image"><ImageIcon className="h-5 w-5" /></Button>
        <Textarea value={value} onChange={handleChange} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Type a message..." className="resize-none min-h-[40px] max-h-[120px]" rows={1} />
        <Button onClick={handleSend} size="icon" disabled={!value.trim()}><Send className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
