'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';
import { uploadFile } from '@/lib/firebase/storage';
import { toast } from 'react-hot-toast';

export default function FileUpload({ path, onUpload, accept = 'image/*', maxSize = 5 * 1024 * 1024 }: { path: string; onUpload: (url: string) => void; accept?: string; maxSize?: number }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > maxSize) { toast.error('File too large'); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(path, file);
      onUpload(url);
      toast.success('Upload successful!');
      setFile(null);
      setPreview(null);
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input type="file" accept={accept} onChange={handleSelect} />
        {preview && <Button variant="ghost" size="icon" onClick={() => { setFile(null); setPreview(null); }}><X className="h-4 w-4" /></Button>}
      </div>
      {preview && <img src={preview} alt="Preview" className="max-h-32 rounded" />}
      {file && <Button onClick={handleUpload} disabled={uploading} size="sm"><Upload className="h-4 w-4 mr-1" />{uploading ? 'Uploading...' : 'Upload'}</Button>}
    </div>
  );
}
