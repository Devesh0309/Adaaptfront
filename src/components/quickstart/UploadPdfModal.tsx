// src/components/quickstart/UploadPdfModal.tsx

import React, { useRef } from 'react';

// --- INTERFACES (Can be moved to a shared types file) ---
interface Department {
    id: string;
    display_name: string;
}

interface UploadPdfModalProps {
    isStep1Complete: boolean;
    canFinishSetup: boolean;
    isLoadingDomains: boolean;
    isUploading: boolean;
    uploadSuccess: boolean;
    existingDomains: Department[];
    selectedDepartment: string;
    selectedFile: File | null;
    onDepartmentSelect: (displayName: string) => void;
    onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onUploadFile: () => void;
}

// --- UI COMPONENTS ---
const StepIndicator = ({ number, isActive, isComplete }: { number: number; isActive: boolean; isComplete: boolean }) => {
    const baseClasses = "w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-colors ease-in-out flex-shrink-0";
    const activeClasses = "bg-blue-600 text-white";
    const completeClasses = "bg-green-500 text-white";
    const inactiveClasses = "bg-gray-200 text-gray-500";

    const getClasses = () => {
        if (isComplete) return `${baseClasses} ${completeClasses}`;
        if (isActive) return `${baseClasses} ${activeClasses}`;
        return `${baseClasses} ${inactiveClasses}`;
    };

    return <div className={getClasses()}>{number}</div>;
};


// --- MAIN COMPONENT ---
export function UploadPdfModal({
    isStep1Complete,
    canFinishSetup,
    isLoadingDomains,
    isUploading,
    uploadSuccess,
    existingDomains,
    selectedDepartment,
    selectedFile,
    onDepartmentSelect,
    onFileSelect,
    onUploadFile,
}: UploadPdfModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className={`bg-white rounded-md border border-blue-300 p-6 sm:p-8 shadow-xl h-[72vh] transition-opacity duration-500 ${!isStep1Complete ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex items-start gap-4 mb-6">
                <StepIndicator number={2} isActive={isStep1Complete} isComplete={canFinishSetup} />
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Upload your first document</h2>
                    <p className="text-gray-600">Select a department and upload a file to begin analysis.</p>
                </div>
            </div>
            <div className="space-y-4">
                {/* Department Selection */}
                <div>
                    <label htmlFor="department-select" className="block text-sm font-medium text-gray-700 mb-1">Select Department</label>
                    {isLoadingDomains ? (
                        <div className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg">Loading domains...</div>
                    ) : (
                        <select
                            id="department-select"
                            value={selectedDepartment}
                            onChange={(e) => onDepartmentSelect(e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            disabled={!isStep1Complete}
                        >
                            <option value="" disabled>-- Select a department --</option>
                            {existingDomains.map(dept => (
                                <option key={dept.id} value={dept.display_name}>{dept.display_name}</option>
                            ))}
                        </select>
                    )}
                </div>

                {/* File Upload Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                    <div onClick={() => fileInputRef.current?.click()} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            <div className="flex text-sm text-gray-600"><p className="pl-1">{selectedFile ? selectedFile.name : 'PDF, Excel, Document, etc.'}</p></div>
                            <p className="text-xs text-gray-500">{selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Up to 10MB'}</p>
                        </div>
                    </div>
                    <input ref={fileInputRef} type="file" onChange={onFileSelect} className="hidden" />

                    {/* Upload Button & Success Message */}
                    {selectedFile && selectedDepartment && (
                        <div className="mt-4">
                            {uploadSuccess ? (
                                <div className="flex items-center justify-center p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    <span className="text-sm font-medium text-green-800">File uploaded successfully!</span>
                                </div>
                            ) : (
                                <button
                                    onClick={onUploadFile}
                                    disabled={isUploading}
                                    className="w-full px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isUploading ? 'Uploading...' : 'Upload File'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}