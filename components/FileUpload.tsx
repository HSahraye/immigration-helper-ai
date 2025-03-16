import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { validateFile, FileValidationResult } from '../app/utils/fileProcessing';
import { Paperclip, Image, FileText, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (result: FileValidationResult) => void;
  onError: (error: string) => void;
  isLoading?: boolean;
}

export default function FileUpload({ onFileSelect, onError, isLoading }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0];
      if (!file) return;

      setSelectedFileName(file.name);
      
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
      setSelectedFileName(null);
      onError(error instanceof Error ? error.message : 'Failed to process file');
    }
  }, [onFileSelect, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
      'application/json': ['.json']
    }
  });

  return (
    <div className="relative">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500 dark:hover:border-blue-400'}
        `}
      >
        <input {...getInputProps()} disabled={isLoading} />
        
        <div className="flex flex-col items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          {isLoading ? (
            <>
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p>Analyzing file...</p>
            </>
          ) : uploadProgress !== null ? (
            <>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p>Uploading... {uploadProgress}%</p>
            </>
          ) : (
            <>
              {selectedFileName ? (
                <div className="flex items-center gap-2">
                  {selectedFileName.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <Image className="w-5 h-5" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                  <span>{selectedFileName}</span>
                </div>
              ) : (
                <>
                  <Paperclip className="w-6 h-6" />
                  <p>Drop a file here or click to select</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Supported formats: JPG, PNG, GIF, PDF, DOCX, TXT, CSV, JSON
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-black/5 dark:bg-white/5 rounded-lg" />
      )}
    </div>
  );
} 