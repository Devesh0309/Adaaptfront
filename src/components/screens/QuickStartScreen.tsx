import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AdaaptLogo } from '../AdaabtLogo';
import apiClient from "../../api/apiClient"; // Import the real axios client

// --- INTERFACES ---

// Represents the structure of a Department/Domain from the API
interface Department {
    id: string;
    display_name: string;
    description: string;
    // Add other fields from the API response if needed
}

interface SetupData {
    departments: Department[];
    invites: { email: string; role: string }[];
    upload: {
        department: string;
        file: File;
    };
}

interface QuickStartScreenProps {
    onSetupComplete: (data: SetupData) => void;
    onLogout?: () => void;
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

// Helper function to safely extract error message
const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') return error;
    if (error?.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (typeof detail === 'string') return detail;
        if (Array.isArray(detail)) {
            return detail.map(item => {
                if (typeof item === 'string') return item;
                if (item?.msg) return item.msg;
                return 'Validation error';
            }).join(', ');
        }
        if (typeof detail === 'object' && detail.msg) {
            return detail.msg;
        }
    }
    if (error?.message) return error.message;
    return 'An unexpected error occurred. Please try again.';
};

// --- MAIN COMPONENT ---
export function QuickStartScreen({ onSetupComplete, onLogout }: QuickStartScreenProps) {
    // Form & Step State
    const [existingDomains, setExistingDomains] = useState<Department[]>([]);
    const [newDepartmentInput, setNewDepartmentInput] = useState({
        display_name: '',
        description: '',
        allowed_roles: '',
    });

    const [invites, setInvites] = useState([{ email: '', role: 'Viewer' }]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedDomainId, setSelectedDomainId] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isStep1Complete, setIsStep1Complete] = useState(false);
    const [isLoadingDomains, setIsLoadingDomains] = useState(false);

    // API & Animation State
    const [isAddingDepartment, setIsAddingDepartment] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [error, setError] = useState('');
    const [isIntroAnimating, setIsIntroAnimating] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsIntroAnimating(false), 1800);
        return () => clearTimeout(timer);
    }, []);

    // Fetch existing domains when component mounts
    useEffect(() => {
        const fetchDomains = async () => {
            setIsLoadingDomains(true);
            try {
                const response = await apiClient.get('/knowledge-base/domains');
                setExistingDomains(response.data);
            } catch (err: any) {
                console.error('Failed to fetch domains:', err);
                setError(`Failed to load existing domains: ${getErrorMessage(err)}`);
            } finally {
                setIsLoadingDomains(false);
            }
        };

        fetchDomains();
    }, []);

    // --- HANDLERS ---
    const handleAddDepartment = async () => {
        if (!newDepartmentInput.display_name.trim() || isAddingDepartment) {
            setError('Department name cannot be empty.');
            return;
        }
        if (existingDomains.some(d => d.display_name === newDepartmentInput.display_name.trim())) {
            setError('A department with this name already exists.');
            return;
        }
        // Also validate that roles are provided
        if (!newDepartmentInput.allowed_roles.trim()) {
            setError('Please provide at least one role for the department.');
            return;
        }

        setIsAddingDepartment(true);
        setError('');

        const requestBody = {
            name: newDepartmentInput.display_name.trim().toLowerCase().replace(/\s+/g, '-'),
            display_name: newDepartmentInput.display_name.trim(),
            description: newDepartmentInput.description.trim() || `Domain for ${newDepartmentInput.display_name.trim()}`,
            is_active: true,
            embedding_model: null ,
            chunk_size: 1000,
            chunk_overlap: 200,
            allowed_roles: newDepartmentInput.allowed_roles.split(',').map(role => role.trim()).filter(Boolean),
        };

        try {
            const response = await apiClient.post('/knowledge-base/domains', requestBody);

            // Reset the form fields
            setNewDepartmentInput({
                display_name: '',
                description: '',
                allowed_roles: '',
            });

            // Re-fetch all domains to get the updated list including the new one
            const domainsResponse = await apiClient.get('/knowledge-base/domains');
            setExistingDomains(domainsResponse.data);

        } catch (err: any) {
            console.error('Failed to create department:', err);
            setError(getErrorMessage(err));
        } finally {
            setIsAddingDepartment(false);
        }
    };

    const handleUpdateInvite = (index: number, field: 'email' | 'role', value: string) => {
        const updated = [...invites];
        updated[index][field] = value;
        setInvites(updated);
    };

    const addInviteRow = () => {
        setInvites([...invites, { email: '', role: 'Viewer' }]);
    };

    const handleConfirmStep1 = () => {
        if (existingDomains.length > 0) {
            setIsStep1Complete(true);
            // Set the first available domain as selected by default
            if (existingDomains[0]) {
                setSelectedDepartment(existingDomains[0].display_name);
                setSelectedDomainId(existingDomains[0].id);
            }
        }
    };

    const handleDepartmentSelect = (displayName: string) => {
        setSelectedDepartment(displayName);
        // Find the corresponding ID from existing domains
        const selectedDomain = existingDomains.find(d => d.display_name === displayName);
        if (selectedDomain) {
            setSelectedDomainId(selectedDomain.id);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
            setUploadSuccess(false); // Reset upload success when new file is selected
        }
    };

    const handleUploadFile = async () => {
        if (!selectedFile || !selectedDomainId || isUploading) return;

        setIsUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('domain_id', selectedDomainId);
        formData.append('title', ''); // Send empty value as specified
        formData.append('author', ''); // Send empty value as specified  
        formData.append('language', '');
        formData.append('file', selectedFile);

        try {
            const response = await apiClient.post('/ingestion/upload', formData);

            console.log('File uploaded successfully:', response.data);
            setUploadSuccess(true);

        } catch (err: any) {
            console.error('Failed to upload file:', err);
            setError(getErrorMessage(err));
        } finally {
            setIsUploading(false);
        }
    };

    // ----- THIS IS THE CORRECTED FUNCTION -----
    const handleFinishSetup = async () => {
        if (!canFinishSetup || isSubmitting) return;
    
        setIsSubmitting(true);
        setError('');
    
        // Filter for invites that have an email entered.
        const validInvites = invites.filter(invite => invite.email.trim() !== '');
    
        // The 'departments' are the domains we've been tracking in the 'existingDomains' state.
        const departments = existingDomains;
    
        // Call the prop function passed from App.tsx with the correct data
        onSetupComplete({
            departments,
            invites: validInvites,
            upload: {
                department: selectedDepartment,
                file: selectedFile!,
            }
        });
    };
    // ------------------------------------------


    // --- RENDER LOGIC ---
    const canFinishSetup = isStep1Complete && !!selectedDepartment && !!selectedFile && uploadSuccess;
    const canUpload = !!selectedFile && !!selectedDomainId && !isUploading;

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.7 } },
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            {/* Top Bar */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isIntroAnimating ? 0 : 1 }}
                transition={{ duration: 0.7 }}
                className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-40"
            >
                <div className="flex items-center justify-between h-full px-6">
                    <div className="flex items-center">
                        <AdaaptLogo className="h-7" />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">JD</span>
                        </div>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors" title="Help">?</button>
                        <button
                            onClick={onLogout}
                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
                layout
                className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isIntroAnimating ? 'min-h-screen flex flex-col items-center justify-center' : 'pt-28 pb-12 flex flex-col items-center'}`}
            >
                <motion.div layout="position" className={`text-center ${isIntroAnimating ? '' : 'mb-12'}`}>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
                    >
                        WELCOME-LET'S GET YOU SET UP!
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-lg text-gray-600"
                    >
                        Complete these two steps to get started.
                    </motion.p>
                </motion.div>

                {!isIntroAnimating && (
                    <motion.div initial="hidden" animate="visible" variants={contentVariants} className="w-full">
                        {error && (
                            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8">

                            {/* STEP 1 CARD (The Form) */}
                            <div className="bg-white rounded-md border border-blue-300 p-6 sm:p-8 shadow-xl h-[72vh] overflow-y-auto">
                                <div className="flex items-start gap-4 mb-6">
                                    <StepIndicator number={1} isActive={!isStep1Complete} isComplete={isStep1Complete} />
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Set up your organization</h2>
                                        <p className="text-gray-600">Create departments and invite your team. Departments are required to continue.</p>
                                    </div>
                                </div>

                                <div className={`transition-opacity duration-500 ${isStep1Complete ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                                    <div className="mb-6">
                                        <h3 className="text-md font-semibold text-gray-800 mb-3">Create Departments</h3>
                                        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                            <input
                                                type="text"
                                                value={newDepartmentInput.display_name}
                                                onChange={(e) => setNewDepartmentInput(prev => ({ ...prev, display_name: e.target.value }))}
                                                placeholder="Department Name (e.g., Sales, HR)"
                                                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                            <textarea
                                                value={newDepartmentInput.description}
                                                onChange={(e) => setNewDepartmentInput(prev => ({ ...prev, description: e.target.value }))}
                                                placeholder="Description (Optional)"
                                                rows={2}
                                                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                            <input
                                                type="text"
                                                value={newDepartmentInput.allowed_roles}
                                                onChange={(e) => setNewDepartmentInput(prev => ({ ...prev, allowed_roles: e.target.value }))}
                                                placeholder="Allowed Roles (comma-separated, e.g., Admin, Viewer)"
                                                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                onClick={handleAddDepartment}
                                                disabled={isAddingDepartment}
                                                className="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-wait"
                                            >
                                                {isAddingDepartment ? 'Adding...' : 'Add Department'}
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-3 min-h-[34px]">
                                            {existingDomains.map(dept => (
                                                <span key={dept.id} className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-medium">
                                                    {dept.display_name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-md font-semibold text-gray-800 mb-3">Invite Teammates (Optional)</h3>
                                        <div className="space-y-3">
                                            {invites.map((invite, index) => (
                                                <div key={index} className="flex gap-3">
                                                    <input
                                                        type="email"
                                                        value={invite.email}
                                                        onChange={(e) => handleUpdateInvite(index, 'email', e.target.value)}
                                                        placeholder="teammate@example.com"
                                                        className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={invite.role}
                                                        onChange={(e) => handleUpdateInvite(index, 'role', e.target.value)}
                                                        placeholder="Role"
                                                        className="w-32 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            ))}
                                            <button onClick={addInviteRow} className="text-sm font-semibold text-blue-600 hover:underline">+ Add another</button>
                                        </div>
                                    </div>
                                    {!isStep1Complete && (
                                        <div className="mt-8 text-right">
                                            <button onClick={handleConfirmStep1} disabled={existingDomains.length === 0} className="px-6 py-2 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
                                                {existingDomains.length > 0 ? 'Continue to Step 2' : 'Confirm Step 1'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* CONNECTOR ARROW */}
                            <div className="hidden lg:flex items-center justify-center h-full pt-20">
                                <svg className={`w-12 h-12 transition-colors duration-500 ${isStep1Complete ? 'text-blue-500' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </div>

                            {/* STEP 2 CARD */}
                            <div className={`bg-white rounded-md border border-blue-300 p-6 sm:p-8 shadow-xl h-[72vh] transition-opacity duration-500 ${!isStep1Complete ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                                <div className="flex items-start gap-4 mb-6">
                                    <StepIndicator number={2} isActive={isStep1Complete} isComplete={canFinishSetup} />
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Upload your first document</h2>
                                        <p className="text-gray-600">Select a department and upload a file to begin analysis.</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="department-select" className="block text-sm font-medium text-gray-700 mb-1">Select Department</label>
                                        {isLoadingDomains ? (
                                            <div className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg">
                                                Loading domains...
                                            </div>
                                        ) : (
                                            <select
                                                id="department-select"
                                                value={selectedDepartment}
                                                onChange={(e) => handleDepartmentSelect(e.target.value)}
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
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                                        <div onClick={() => fileInputRef.current?.click()} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500">
                                            <div className="space-y-1 text-center">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                <div className="flex text-sm text-gray-600"><p className="pl-1">{selectedFile ? selectedFile.name : 'PDF, Excel, Document, etc.'}</p></div>
                                                <p className="text-xs text-gray-500">{selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Up to 10MB'}</p>
                                            </div>
                                        </div>
                                        <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" />

                                        {/* Upload Button */}
                                        {selectedFile && selectedDomainId && (
                                            <div className="mt-4">
                                                {uploadSuccess ? (
                                                    <div className="flex items-center justify-center p-3 bg-green-50 border border-green-200 rounded-lg">
                                                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span className="text-sm font-medium text-green-800">File uploaded successfully!</span>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={handleUploadFile}
                                                        disabled={!canUpload}
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
                        </div>

                        <div className="mt-12 text-center p-6 bg-gray-100 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800">More ways to connect your data are coming soon!</h3>
                            <p className="text-gray-600 mt-1 mb-4">Connect directly to Snowflake, BigQuery, Redshift, and more.</p>
                            <div className="flex justify-center items-center gap-6 opacity-50">
                                <span className="text-3xl" title="Snowflake">❄️</span><span className="text-3xl" title="BigQuery">🔍</span><span className="text-3xl" title="Redshift">🚀</span><span className="text-3xl" title="Postgres">🐘</span><span className="text-3xl" title="MySQL">🗄️</span><span className="text-3xl" title="S3">📦</span>
                            </div>
                        </div>

                        <div className="mt-12 flex items-center justify-end">
                            <button onClick={handleFinishSetup} disabled={!canFinishSetup || isSubmitting} className="px-8 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors ease-in-out disabled:bg-gray-300 disabled:cursor-not-allowed">
                                {isSubmitting ? 'Submitting...' : 'Finish Setup & Continue'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}