import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { validateFile, FileValidationResult } from '../app/utils/fileProcessing';
import { Paperclip } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (result: FileValidationResult) => void;
  onError: (error: string) => void;
  isLoading?: boolean;
}

export default function FileUpload({ onFileSelect, onError, isLoading }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0];
      if (!file) return;

      // Simulate upload progress
      setUploadProgress(0);
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev === null || prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      const result = await validateFile(file);
      
      // Complete the progress bar
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Reset progress after a short delay
      setTimeout(() => {
        setUploadProgress(null);
      }, 500);

      onFileSelect(result);
    } catch (error) {
      setUploadProgress(null);
      onError(error instanceof Error ? error.message : 'Failed to process file');
    }
  }, [onFileSelect, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
      'application/json': ['.json']
    },
    multiple: false,
    disabled: isLoading
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`relative p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 hover:border-gray-500'}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-200"></div>
              <span className="ml-2 text-gray-300">Processing file...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Paperclip className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-300">
                Drag and drop a file, or click to select
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Supported formats: JPG, PNG, GIF, PDF, DOCX, TXT, CSV, JSON (up to 10MB)
              </p>
            </div>
          )}
        </div>

        {/* Upload Progress Bar */}
        {uploadProgress !== null && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
} 