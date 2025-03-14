import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { validateImage } from '../../utils/imageProcessing';

interface ImageUploadProps {
  onImageSelect: (base64: string) => void;
  onError: (error: string) => void;
  isLoading?: boolean;
}

export default function ImageUpload({ onImageSelect, onError, isLoading }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0];
      if (!file) return;

      const base64 = await validateImage(file);
      onImageSelect(base64);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to process image');
    }
  }, [onImageSelect, onError]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    disabled: isLoading
  });

  return (
    <div
      {...getRootProps()}
      className={`relative p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span className="ml-2">Analyzing image...</span>
          </div>
        ) : (
          <>
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop an image, or click to select
            </p>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, GIF up to 5MB
            </p>
          </>
        )}
      </div>
    </div>
  );
} 