import React, { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: (dataset: string) => void;
}

export function UploadModal({ open, onOpenChange, onContinue }: UploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!open) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleSampleSelect = (dataset: string) => {
    onContinue(dataset);
    onOpenChange(false);
  };

  const handleContinue = () => {
    if (selectedFile) {
      // In a real app, this would upload the file
      onContinue(selectedFile.name.replace(/\.[^/.]+$/, ""));
      onOpenChange(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="panel-solid w-full max-w-md p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-h2">Upload your data</h2>
          <button 
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={16} className="text-muted" />
          </button>
        </div>

        {/* Dropzone */}
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            isDragging 
              ? 'border-brand-accent bg-brand-accent/5' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-body mb-2">
            Drag and drop your CSV file here
          </p>
          <p className="text-meta text-muted mb-4">
            or click to browse
          </p>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="button-outline cursor-pointer inline-block"
          >
            Choose file
          </label>
        </div>

        {/* Selected File */}
        {selectedFile && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <FileText size={20} className="text-green-600" />
            <span className="text-body flex-1">{selectedFile.name}</span>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-green-600 hover:text-green-800"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Sample Data Options */}
        <div className="mt-8">
          <p className="text-meta text-muted mb-4">Or try with sample data:</p>
          <div className="space-y-3">
            <button
              onClick={() => handleSampleSelect('Sales_Sample')}
              className="w-full p-4 border border-gray-200 rounded-lg hover:border-brand-accent hover:bg-brand-accent/5 transition-all text-left"
            >
              <div className="font-medium text-body">Sales Sample</div>
              <div className="text-meta text-muted">Sample e-commerce sales data</div>
            </button>
            <button
              onClick={() => handleSampleSelect('Finance_Sample')}
              className="w-full p-4 border border-gray-200 rounded-lg hover:border-brand-accent hover:bg-brand-accent/5 transition-all text-left"
            >
              <div className="font-medium text-body">Finance Sample</div>
              <div className="text-meta text-muted">Sample financial analytics data</div>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <button 
            onClick={() => onOpenChange(false)}
            className="button-outline flex-1"
          >
            Cancel
          </button>
          <button 
            onClick={handleContinue}
            disabled={!selectedFile}
            className="button-primary flex-1"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}