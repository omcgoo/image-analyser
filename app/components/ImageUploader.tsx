import React, { useState, useRef, DragEvent } from 'react';
import { Loader2, Upload } from 'lucide-react';
import Image from 'next/image';

interface ImageUploaderProps {
  onUpload: (files: File[] | { [filename: string]: File }, previews: { [filename: string]: string }) => void;
  isLoading: boolean;
}

export default function ImageUploader({ onUpload, isLoading }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadCount, setUploadCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createFilePreview = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    const filePreviews: { [filename: string]: string } = {};
    
    // Create previews for all files
    for (const file of Array.from(files)) {
      const preview = await createFilePreview(file);
      filePreviews[file.name] = preview;
    }

    if (files.length === 1) {
      const file = files[0];
      setPreview(filePreviews[file.name]);
      onUpload([file], filePreviews);
    } else {
      const fileMap: { [filename: string]: File } = {};
      Array.from(files).forEach(file => {
        fileMap[file.name] = file;
      });
      onUpload(fileMap, filePreviews);
    }
    setUploadCount(files.length);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const onClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={onClick}
        className={`flex items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isDragActive ? 'border-amber-400 bg-amber-100' : 'border-amber-300 bg-amber-50 hover:bg-amber-100'
        }`}
        tabIndex={0}
        role="button"
        aria-label="Upload images"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          accept="image/*,.svg"
          multiple
          aria-label="Select images"
        />
        {preview ? (
          <Image src={preview} alt="Upload preview" className="max-w-full max-h-full object-contain" width={256} height={256} />
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 mb-3 text-amber-400" aria-hidden="true" />
            <p className="mb-2 text-sm text-amber-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-amber-500">
              Upload single or multiple images (including SVGs)
            </p>
          </div>
        )}
      </div>
      {isLoading && (
        <div className="flex justify-center" aria-live="polite">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500" aria-hidden="true" />
          <span className="sr-only">Loading...</span>
        </div>
      )}
      {uploadCount > 0 && !isLoading && (
        <p className="text-center text-amber-600">
          {uploadCount === 1 ? '1 image uploaded' : `${uploadCount} images uploaded`}
        </p>
      )}
    </div>
  );
}