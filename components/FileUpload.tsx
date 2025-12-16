"use client";

import { useCallback, useState } from "react";
import { Upload, X, FileText, Image as ImageIcon, File } from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import type { UploadedFile } from "@/types";

interface FileUploadProps {
  onFilesChange: (files: UploadedFile[]) => void;
  maxSize?: number; // in bytes
}

export default function FileUpload({ onFilesChange, maxSize = 50 * 1024 * 1024 }: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>("");

  const acceptedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
    "image/jpg",
  ];

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `${file.name}: Unsupported file type. Please upload PDF, DOCX, PNG, or JPG files.`;
    }
    if (file.size > maxSize) {
      return `${file.name}: File size exceeds ${formatFileSize(maxSize)} limit.`;
    }
    return null;
  };

  const processFiles = useCallback(
    async (fileList: FileList) => {
      setError("");
      const newFiles: UploadedFile[] = [];

      for (const file of Array.from(fileList)) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          continue;
        }

        const uploadedFile: UploadedFile = {
          id: `${Date.now()}-${file.name}`,
          name: file.name,
          type: file.type,
          size: file.size,
        };

        // Read file for processing
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            uploadedFile.base64 = e.target?.result as string;
          };
          reader.readAsDataURL(file);
        }

        newFiles.push(uploadedFile);
      }

      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    },
    [files, onFilesChange, maxSize]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        processFiles(e.target.files);
      }
    },
    [processFiles]
  );

  const removeFile = useCallback(
    (id: string) => {
      const updatedFiles = files.filter((f) => f.id !== id);
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    },
    [files, onFilesChange]
  );

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-5 w-5" />;
    if (type.includes("pdf")) return <FileText className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative rounded-lg border-2 border-dashed transition-all duration-200
          ${
            isDragging
              ? "border-dodger-blue bg-dodger-blue/10"
              : "border-yale-blue/50 bg-prussian-blue/30 hover:border-cool-sky/50"
          }
        `}
      >
        <label htmlFor="file-upload" className="cursor-pointer block p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <Upload
              className={`h-12 w-12 mb-4 ${
                isDragging ? "text-dodger-blue animate-bounce" : "text-cool-sky"
              }`}
            />
            <p className="text-sm font-medium text-white mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-400">
              PDF, DOCX, PNG, JPG (max {formatFileSize(maxSize)})
            </p>
          </div>
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          accept=".pdf,.docx,.png,.jpg,.jpeg"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-500/10 border border-red-500/50 p-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-300">
            Uploaded Files ({files.length})
          </p>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 rounded-md bg-prussian-blue/50 border border-yale-blue/30"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="text-cool-sky">{getFileIcon(file.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="ml-4 p-1 rounded-md text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
