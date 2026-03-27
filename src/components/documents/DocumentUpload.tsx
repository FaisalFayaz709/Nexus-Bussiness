import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

interface DocumentUploadProps {
  onFilesSelected?: (files: File[]) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ onFilesSelected }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  };

  const processFiles = (fileList: File[]) => {
    const newFiles = fileList
      .filter((file) => {
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        return validTypes.includes(file.type);
      })
      .map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'uploading' as const,
      }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((file) => {
      simulateUpload(file.id);
    });

    if (onFilesSelected) {
      onFilesSelected(fileList);
    }
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, progress: 100, status: 'completed' } : f
          )
        );
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress } : f))
        );
      }
    }, 500);
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
            <Upload size={32} className="text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Drop your documents here
          </h3>
          <p className="text-gray-600 mb-4">
            or click to select files
          </p>
          <p className="text-sm text-gray-500">
            Supported formats: PDF, DOC, DOCX (Max 50MB per file)
          </p>
        </div>
      </div>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="font-semibold text-gray-900">Upload Status</h4>
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <File size={20} className="text-gray-400 flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                {file.status === 'completed' ? (
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                ) : (
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                  >
                    <X size={20} className="text-gray-400" />
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    file.status === 'completed' ? 'bg-green-500' : 'bg-primary-500'
                  }`}
                  style={{ width: `${file.progress}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {file.status === 'uploading'
                    ? `${Math.round(file.progress)}%`
                    : 'Completed'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
