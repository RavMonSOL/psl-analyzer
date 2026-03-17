'use client';

import { useRef, useState } from 'react';

interface ImageUploadProps {
  onUpload: (base64: string) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      onUpload(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto brainlet-box p-8 bg-white">
      <h2 className="font-brainlet text-3xl mb-4 text-center text-black">UPLOAD FACE MATRIX</h2>
      <div
        className={`border-3 border-dashed ${
          dragActive ? 'border-brainlet-blue bg-blue-50' : 'border-black'
        } p-12 text-center cursor-pointer transition-colors`}
        onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        <p className="font-mono text-lg mb-2">[ DRAG IMAGE HERE OR CLICK ]</p>
        <p className="text-sm text-gray-600">JPG, PNG, WEBP (MAX 5MB)</p>
      </div>
      <div className="mt-4 font-mono text-xs text-gray-500">
        <p>Never stored on server</p>
      </div>
    </div>
  );
}
