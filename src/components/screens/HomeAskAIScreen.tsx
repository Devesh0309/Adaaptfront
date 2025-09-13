import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from "../../api/apiClient";
import { LeadershipInsights } from './LeadershipInsights';
import AdministrationScreen from "./AdministrationScreen";
import DesignDiscoverPage from './DesignDiscoverPage';
import { AdaaptLogo } from '../AdaabtLogo';

// --- MUI ICON IMPORTS ---
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import InsightsIcon from '@mui/icons-material/Insights';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import ForumIcon from '@mui/icons-material/Forum';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CloseIcon from '@mui/icons-material/Close';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import BoltIcon from '@mui/icons-material/Bolt';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DatasetIcon from '@mui/icons-material/Dataset';
import SendIcon from '@mui/icons-material/Send';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import AddIcon from '@mui/icons-material/Add';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CheckIcon from '@mui/icons-material/Check';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import GridOnIcon from '@mui/icons-material/GridOn';
import DescriptionIcon from '@mui/icons-material/Description';
import CodeIcon from '@mui/icons-material/Code';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';
import NotesIcon from '@mui/icons-material/Notes';
import AppsIcon from '@mui/icons-material/Apps';

// --- TYPE DEFINITIONS ---
interface NavItemProps {
    icon: React.ReactNode;
    text: string;
    active?: boolean;
    onClick?: () => void;
    isCollapsed?: boolean;
    isDarkMode?: boolean;
}

interface PromptPillProps {
    text: string;
    colorClasses: string;
    onClick: (text: string) => void;
    isDarkMode?: boolean;
}

interface Department {
    id: string;
    display_name: string;
    name: string;
    description: string;
    is_active: boolean;
    embedding_model: string;
    chunk_size: number;
    chunk_overlap: number;
    allowed_roles: string[];
    created_at: string;
    updated_at: string;
}

interface User {
    email: string;
    full_name: string;
    organization: string;
    department: string;
    role: string;
    is_active: boolean;
    is_verified: boolean;
    id: string;
    is_superuser: boolean;
    created_at: string;
    updated_at: string;
    last_login: string;
    allowed_domains: string[];
}

interface AIMessageData {
    answer?: string;
    domains_searched?: string[];
    sources?: any[];
    error?: string;
}

interface Message {
    type: 'user' | 'ai';
    content: string | AIMessageData;
}

// --- HELPER & MODAL COMPONENTS ---
const NavItem: React.FC<NavItemProps> = ({ icon, text, active = false, onClick, isCollapsed = false, isDarkMode = false }) => (
    <li
        className={`flex items-center p-3 rounded-none cursor-pointer transition-colors ${
            active
                ? isDarkMode
                    ? 'bg-blue-900 text-blue-300'
                    : 'bg-blue-100 text-blue-600'
                : isDarkMode
                    ? 'hover:bg-gray-800 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
        }`}
        onClick={onClick}
    >
        {icon}
        <span className={`ml-3 font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-200 ${isCollapsed ? 'w-0' : 'w-auto'}`}>
            {text}
        </span>
    </li>
);

const PromptPill: React.FC<PromptPillProps> = ({ text, colorClasses, onClick, isDarkMode = false }) => (
    <button
        onClick={() => onClick(text)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-transform hover:scale-105 ${
            isDarkMode ? 'bg-gray-800 border border-gray-600 text-gray-200 hover:bg-gray-700' : colorClasses
        }`}
    >
        <BoltIcon sx={{ width: 16, height: 16 }} />
        <span>{text}</span>
    </button>
);

const AgentIcon: React.FC<{ icon: React.ReactNode; text: string; bgColor: string; iconColor: string; isNew?: boolean; isDarkMode?: boolean }> = ({
    icon,
    text,
    bgColor,
    iconColor,
    isNew,
    isDarkMode = false,
}) => (
    <div className="flex flex-col items-center gap-1.5 text-center cursor-pointer group">
        <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg ${
            isDarkMode ? 'bg-gray-800 border border-gray-600' : bgColor
        }`}>
            {React.cloneElement(icon as React.ReactElement, { className: isDarkMode ? 'text-gray-300' : iconColor, sx: { fontSize: 24 } })}
            {isNew && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">NEW</span>
            )}
        </div>
        <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-600 group-hover:text-blue-600'}`}>{text}</p>
    </div>
);

const aiAgents = [
    { name: 'AI Slides', icon: <SlideshowIcon />, iconColor: 'text-orange-600', bgColor: 'bg-orange-50' },
    { name: 'AI Sheets', icon: <GridOnIcon />, iconColor: 'text-green-600', bgColor: 'bg-green-50' },
    { name: 'AI Docs', icon: <DescriptionIcon />, iconColor: 'text-blue-600', bgColor: 'bg-blue-50' },
    { name: 'AI Developer', icon: <CodeIcon />, iconColor: 'text-sky-600', bgColor: 'bg-sky-50' },
    { name: 'AI Designer', icon: <DesignServicesIcon />, iconColor: 'text-purple-600', bgColor: 'bg-purple-50' },
    { name: 'Clip Genius', icon: <ContentCutIcon />, iconColor: 'text-violet-600', bgColor: 'bg-violet-50' },
    { name: 'AI Chat', icon: <ChatBubbleOutlineIcon />, iconColor: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { name: 'AI Image', icon: <ImageIcon />, iconColor: 'text-amber-600', bgColor: 'bg-amber-50' },
    { name: 'AI Video', icon: <VideocamIcon />, iconColor: 'text-rose-600', bgColor: 'bg-rose-50' },
    { name: 'Meeting Notes', icon: <NotesIcon />, iconColor: 'text-teal-600', bgColor: 'bg-teal-50' },
    { name: 'All Agents', icon: <AppsIcon />, iconColor: 'text-gray-600', bgColor: 'bg-gray-50' },
];

const UploadModal: React.FC<{ onClose: () => void; isDarkMode?: boolean }> = ({ onClose, isDarkMode = false }) => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedDomainId, setSelectedDomainId] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
        exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2, ease: 'easeIn' } }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userPromise = apiClient.get<User>('/auth/me');
                const domainsPromise = apiClient.get<Department[]>('/knowledge-base/domains');
                const [userResponse, domainsResponse] = await Promise.all([userPromise, domainsPromise]);
                const currentUser = userResponse.data;
                const allowedDomains = domainsResponse.data.filter(domain =>
                    currentUser.allowed_domains.includes(domain.name)
                );
                setDepartments(allowedDomains);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setMessage({ type: 'error', text: 'Could not load departments.' });
            }
        };
        fetchData();
    }, []);

    const handleFileChange = (files: FileList | null) => {
        if (files && files[0]) {
            setSelectedFile(files[0]);
            setMessage(null);
        }
    };

    const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, isOver: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(isOver);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        handleDragEvents(e, false);
        handleFileChange(e.dataTransfer.files);
    };

    const handleUpload = async () => {
        if (!selectedDomainId || !selectedFile) {
            setMessage({ type: 'error', text: 'Please select a department and a file.' });
            return;
        }
        setIsUploading(true);
        setMessage(null);
        setUploadProgress(0);

        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 95) {
                    clearInterval(interval);
                    return 95;
                }
                return prev + 10;
            });
        }, 150);

        const formData = new FormData();
        formData.append('domain_id', selectedDomainId);
        formData.append('file', selectedFile);

        try {
            await apiClient.post('/ingestion/upload', formData);
            clearInterval(interval);
            setUploadProgress(100);
            setMessage({ type: 'success', text: 'File uploaded successfully!' });
            setTimeout(onClose, 1500);
        } catch (error) {
            clearInterval(interval);
            console.error("Upload failed:", error);
            setMessage({ type: 'error', text: 'Upload failed. Please try again.' });
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
            <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`rounded-2xl shadow-2xl p-6 w-full max-w-md m-4 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}
            >
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <h2 className="text-xl font-bold">Upload Document</h2>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Add a file to a department knowledge base.</p>
                    </div>
                    <button onClick={onClose} className={`p-1 rounded-full transition-colors ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-800'}`}>
                        <CloseIcon />
                    </button>
                </div>
                
                <div className="space-y-5">
                    <div>
                        <label htmlFor="department" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1.5`}>1. Select Department</label>
                        <select
                            id="department"
                            value={selectedDomainId}
                            onChange={(e) => setSelectedDomainId(e.target.value)}
                            className={`w-full p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-800'}`}
                        >
                            <option value="" disabled>Choose a department...</option>
                            {departments.map(dept => (<option key={dept.id} value={dept.id}>{dept.display_name}</option>))}
                        </select>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1.5`}>2. Attach File</label>
                        {isUploading ? (
                            <div className="w-full bg-gray-200 rounded-full h-2 my-4">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${uploadProgress}%`, transition: 'width 0.3s ease' }}></div>
                            </div>
                        ) : selectedFile ? (
                            <div className={`border rounded-lg p-3 flex items-center justify-between ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-blue-50 border-blue-200'}`}>
                                <div className="flex items-center gap-3">
                                    <InsertDriveFileIcon className={isDarkMode ? 'text-gray-300' : 'text-blue-500'} />
                                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{selectedFile.name}</span>
                                </div>
                                <button onClick={() => setSelectedFile(null)} className={`text-sm font-medium ${isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600'}`}>Remove</button>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => handleDragEvents(e, true)}
                                onDragLeave={(e) => handleDragEvents(e, false)}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
                                    isDragOver
                                        ? isDarkMode
                                            ? 'border-blue-500 bg-gray-800'
                                            : 'border-blue-500 bg-blue-50'
                                        : isDarkMode
                                            ? 'border-gray-600 hover:border-blue-400 bg-gray-900'
                                            : 'border-gray-300 hover:border-blue-400'
                                }`}
                            >
                                <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files)} className="hidden" />
                                <UploadFileIcon className={isDarkMode ? 'text-gray-400 mx-auto' : 'text-gray-400 mx-auto'} sx={{ width: 32, height: 32 }} />
                                <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    <span className={`font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Click to browse</span> or drag & drop
                                </p>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>PDF, DOCX, TXT (max. 25MB)</p>
                            </div>
                        )}
                    </div>
                </div>

                {message && (
                    <div className={`mt-5 p-3 rounded-lg flex items-center gap-3 text-sm ${
                        message.type === 'success'
                            ? isDarkMode
                                ? 'bg-green-900 text-green-300'
                                : 'bg-green-100 text-green-800'
                            : isDarkMode
                                ? 'bg-red-900 text-red-300'
                                : 'bg-red-100 text-red-800'
                    }`}>
                        {message.type === 'success' ? <CheckCircleIcon fontSize="small" /> : <ErrorIcon fontSize="small" />}
                        {message.text}
                    </div>
                )}

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleUpload}
                        className={`w-full font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center transition-colors disabled:cursor-not-allowed ${
                            isDarkMode
                                ? 'bg-blue-700 text-gray-100 hover:bg-blue-600 disabled:bg-blue-900'
                                : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300'
                        }`}
                        disabled={isUploading || !selectedFile || !selectedDomainId}
                    >
                        {isUploading ? `Uploading... ${uploadProgress}%` : 'Confirm Upload'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

interface DomainsModalProps {
    onClose: () => void;
    onDone: (selectedIds: string[]) => void;
    selectedDomains: string[];
    setSelectedDomains: React.Dispatch<React.SetStateAction<string[]>>;
    isDarkMode?: boolean;
}

const DomainsModal: React.FC<DomainsModalProps> = ({ onClose, onDone, selectedDomains, setSelectedDomains, isDarkMode = false }) => {
    const [domains, setDomains] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<{ text: string } | null>(null);

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
        exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2, ease: 'easeIn' } }
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const userPromise = apiClient.get<User>('/auth/me');
                const domainsPromise = apiClient.get<Department[]>('/knowledge-base/domains');
                const [userResponse, domainsResponse] = await Promise.all([userPromise, domainsPromise]);
                const currentUser = userResponse.data;
                const allowedDomains = domainsResponse.data.filter(domain => currentUser.allowed_domains.includes(domain.name));
                setDomains(allowedDomains);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setMessage({ text: 'Could not load domains.' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleToggleDomain = (domainId: string) => {
        setSelectedDomains(prev =>
            prev.includes(domainId) ? prev.filter(id => id !== domainId) : [...prev, domainId]
        );
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
            <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`rounded-2xl shadow-2xl p-6 w-full max-w-md m-4 flex flex-col max-h-[90vh] ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}
            >
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold">Select Data Sources</h2>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Choose domains for the AI to search.</p>
                    </div>
                    <button onClick={onClose} className={`p-1 rounded-full transition-colors ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-800'}`}>
                        <CloseIcon />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto pr-2 -mr-3 space-y-2.5">
                    {isLoading ? (
                        <p className={`text-center py-10 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading domains...</p>
                    ) : domains.length === 0 ? (
                        <p className={`text-center py-10 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No accessible domains found.</p>
                    ) : (
                        domains.map(domain => {
                            const isSelected = selectedDomains.includes(domain.id);
                            return (
                                <div
                                    key={domain.id}
                                    onClick={() => handleToggleDomain(domain.id)}
                                    className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                                        isSelected
                                            ? isDarkMode
                                                ? 'bg-blue-900 border-blue-700 ring-2 ring-blue-800'
                                                : 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                                            : isDarkMode
                                                ? 'border-gray-600 hover:border-gray-400 bg-gray-800'
                                                : 'border-gray-200 hover:border-gray-400'
                                    }`}
                                >
                                    <div className={`w-5 h-5 flex-shrink-0 rounded-md flex items-center justify-center border-2 transition-colors ${
                                        isSelected
                                            ? isDarkMode
                                                ? 'bg-blue-600 border-blue-600'
                                                : 'bg-blue-600 border-blue-600'
                                            : isDarkMode
                                                ? 'bg-gray-800 border-gray-600'
                                                : 'bg-white border-gray-300'
                                    }`}>
                                        {isSelected && <CheckIcon sx={{ color: 'white', fontSize: 16 }} />}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-medium text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{domain.display_name}</p>
                                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{domain.description}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                
                {message && (
                    <div className={`mt-4 p-3 rounded-lg flex items-center gap-3 text-sm ${isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800'}`}>
                        <ErrorIcon fontSize="small" />
                        {message.text}
                    </div>
                )}
                
                <div className="mt-6 flex justify-end space-x-3 border-t pt-5 -mx-6 px-6">
                    <button
                        onClick={onClose}
                        className={`font-semibold py-2 px-4 rounded-lg transition-colors text-sm ${
                            isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onDone(selectedDomains)}
                        className={`font-semibold py-2 px-4 rounded-lg transition-colors text-sm ${
                            isDarkMode ? 'bg-blue-700 text-gray-100 hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        Done {selectedDomains.length > 0 && `(${selectedDomains.length})`}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const UserMessage: React.FC<{ text: string; isDarkMode?: boolean }> = ({ text, isDarkMode = false }) => (
    <div className="flex justify-end">
        <div className={`rounded-2xl rounded-br-none py-2 px-4 max-w-lg shadow-sm ${
            isDarkMode ? 'bg-blue-800 text-gray-100' : 'bg-blue-600 text-white'
        }`}>
            {text}
        </div>
    </div>
);

const AIMessage: React.FC<{ data: AIMessageData; isDarkMode?: boolean }> = ({ data, isDarkMode = false }) => {
    if (data.error) {
        return (
            <div className="flex justify-start">
                <div className={`rounded-2xl rounded-bl-none py-2 px-4 max-w-lg shadow-sm ${
                    isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800'
                }`}>
                    <p>{data.error}</p>
                </div>
            </div>
        );
    }
    return (
        <div className="flex justify-start">
            <div className={`border rounded-2xl rounded-bl-none p-4 max-w-lg space-y-4 shadow-sm ${
                isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-200 text-gray-800'
            }`}>
                <p className="whitespace-pre-wrap">{data.answer}</p>
                {data.domains_searched && data.domains_searched.length > 0 && (
                    <div>
                        <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Domains Searched:</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {data.domains_searched.map((domain) => (
                                <span key={domain} className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>{domain}</span>
                            ))}
                        </div>
                    </div>
                )}
                {data.sources && data.sources.length > 0 && (
                    <div>
                        <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sources:</h4>
                        <div className="space-y-2 mt-1">
                            {data.sources.map((source, index) => (
                                <div key={index} className={`border p-2 rounded-md text-xs ${isDarkMode ? 'bg-gray-900 text-gray-400 border-gray-600' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                    <pre className="whitespace-pre-wrap break-all">{JSON.stringify(source, null, 2)}</pre>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const TypingIndicator: React.FC<{ isDarkMode?: boolean }> = ({ isDarkMode = false }) => (
    <div className="flex justify-start">
        <div className={`rounded-2xl rounded-bl-none py-3 px-4 shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <div className="flex items-center space-x-1.5">
                <span className={`w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s] ${isDarkMode ? 'bg-gray-400' : 'bg-gray-500'}`}></span>
                <span className={`w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s] ${isDarkMode ? 'bg-gray-400' : 'bg-gray-500'}`}></span>
                <span className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-gray-400' : 'bg-gray-500'}`}></span>
            </div>
        </div>
    </div>
);

const ThinkingAnimation: React.FC = () => {
    return (
        <motion.div
            className="fixed inset-0 bg-gradient-to-br from-red-500 via-orange-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-violet-500 z-50 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {[...Array(5)].map((_, index) => (
                <motion.div
                    key={index}
                    className="absolute w-48 h-8 bg-white bg-opacity-30 rounded-full"
                    style={{
                        top: `${index * 20 - 50}%`,
                        left: `${index * 20 - 50}%`,
                        transformOrigin: 'center',
                        boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
                    }}
                    animate={{
                        x: ['-100%', '200%'],
                        y: ['-100%', '200%'],
                        opacity: [0, 0.8, 0],
                        scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3,
                        ease: 'easeInOut',
                    }}
                />
            ))}
            <motion.div
                className="relative flex items-center justify-center"
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 360],
                    transition: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                }}
            >
                <div className="absolute w-24 h-24 bg-white bg-opacity-20 rounded-full blur-xl"></div>
                <motion.div
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg"
                    animate={{
                        boxShadow: [
                            "0 0 20px rgba(255, 255, 255, 0.5)",
                            "0 0 40px rgba(255, 255, 255, 0.8)",
                            "0 0 20px rgba(255, 255, 255, 0.5)",
                        ],
                        transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
                    }}
                >
                    <LightbulbOutlinedIcon className="text-violet-600" sx={{ fontSize: 32 }} />
                </motion.div>
            </motion.div>
            <motion.p
                className="mt-6 text-white text-lg font-semibold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                Hang in there...
            </motion.p>
        </motion.div>
    );
};

// --- MAIN COMPONENT ---
interface HomeAskAIScreenProps {
    onLogout: () => void;
}

const HomeAskAIScreen: React.FC<HomeAskAIScreenProps> = ({ onLogout }) => {
    const [query, setQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isDomainsModalOpen, setIsDomainsModalOpen] = useState(false);
    const [currentScreen, setCurrentScreen] = useState<'home' | 'administration' | 'insights' | 'discover'>('home');
    const [showConnectionMessage, setShowConnectionMessage] = useState(false);
    const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [showThinkingAnimation, setShowThinkingAnimation] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [greeting, setGreeting] = useState({
        text: 'Good morning,',
        icon: <WbSunnyOutlinedIcon sx={{ width: 32, height: 32 }} />,
    });

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const isChatting = messages.length > 0;

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    const handleDomainsSelected = (selectedIds: string[]) => {
        setSelectedDomains(selectedIds);
        console.log("Selected domain_ids:", selectedIds);
        setIsDomainsModalOpen(false);
        if (selectedIds.length > 0) {
            setShowConnectionMessage(true);
            setTimeout(() => setShowConnectionMessage(false), 3000);
        }
    };

    const handleSubmitWithAnimation = () => {
        if (!query.trim()) return;
        setShowThinkingAnimation(true);
        setTimeout(() => {
            setShowThinkingAnimation(false);
            window.open('https://text-state-48884904.figma.site/', '_blank');
        }, 3000);
    };

    const handleSubmit = async () => {
        if (!query.trim() || isSending) return;
        const newMessages: Message[] = [...messages, { type: 'user', content: query }];
        setMessages(newMessages);
        setIsSending(true);
        setQuery('');

        try {
            setTimeout(() => {
                const aiResponse: AIMessageData = {
                    answer: `This is a mock response to your query: "${query}"`,
                    domains_searched: ['mock_domain_1'],
                    sources: [{ source_id: 'mock_source_123', content: 'Mock source content...' }],
                };
                setMessages([...newMessages, { type: 'ai', content: aiResponse }]);
                setIsSending(false);
            }, 1500);
        } catch (error) {
            const errorResponse: AIMessageData = { error: 'Sorry, something went wrong.' };
            setMessages([...newMessages, { type: 'ai', content: errorResponse }]);
            setIsSending(false);
        }
    };

    useEffect(() => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) {
            setGreeting({ text: 'Good morning,', icon: <WbSunnyOutlinedIcon sx={{ width: 32, height: 32 }} /> });
        } else if (currentHour < 18) {
            setGreeting({ text: 'Good afternoon,', icon: <WbSunnyOutlinedIcon sx={{ width: 32, height: 32 }} /> });
        } else {
            setGreeting({ text: 'Good evening,', icon: <DarkModeOutlinedIcon sx={{ width: 32, height: 32 }} /> });
        }
    }, []);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [query]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isSending]);

    return (
        <div className={`min-h-screen font-serif ${isDarkMode ? 'bg-black text-gray-100' : 'bg-gradient-to-br from-slate-400 via-white to-blue-300 text-gray-800'}`}>
            <div className="flex h-screen">
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}
                <aside
                    className={`fixed inset-y-0 left-0 z-40 p-4 flex flex-col transform ${
                        isSidebarCollapsed ? 'w-20' : 'w-60'
                    } ${
                        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 ${
                        isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-r border-gray-200'
                    }`}
                >
                    <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} mb-6 h-[40px]`}>
                        {!isSidebarCollapsed && (
                            <AdaaptLogo />
                        )}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                className="hidden lg:block p-1 rounded-lg hover:bg-gray-100"
                            >
                                <ChevronLeftIcon sx={{ transition: 'transform 0.3s ease', transform: isSidebarCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', color: isDarkMode ? '#9ca3af' : '#6b7280' }} />
                            </button>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="lg:hidden p-1 rounded-md hover:bg-gray-100"
                            >
                                <CloseIcon sx={{ width: 20, height: 20, color: isDarkMode ? '#9ca3af' : '#6b7280' }} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-grow flex flex-col">
                        <nav>
                            <ul>
                                <NavItem
                                    text="Ask AI"
                                    isCollapsed={isSidebarCollapsed}
                                    active={currentScreen === 'home'}
                                    icon={<AutoAwesomeIcon sx={{ color: isDarkMode ? '#60a5fa' : '#2962ff' }} />}
                                    onClick={() => setCurrentScreen('home')}
                                    isDarkMode={isDarkMode}
                                />
                                <NavItem
                                    text="Insights"
                                    isCollapsed={isSidebarCollapsed}
                                    active={currentScreen === 'insights'}
                                    onClick={() => setCurrentScreen('insights')}
                                    icon={<InsightsIcon sx={{ color: isDarkMode ? '#4ade80' : '#00c853' }} />}
                                    isDarkMode={isDarkMode}
                                />
                                <NavItem
                                    text="Discover"
                                    isCollapsed={isSidebarCollapsed}
                                    active={currentScreen === 'discover'}
                                    onClick={() => setCurrentScreen('discover')}
                                    icon={<TravelExploreIcon sx={{ color: isDarkMode ? '#fb923c' : '#ff6d00' }} />}
                                    isDarkMode={isDarkMode}
                                />
                                <NavItem
                                    text="Setup Data Source"
                                    isCollapsed={isSidebarCollapsed}
                                    icon={<SettingsEthernetIcon sx={{ color: isDarkMode ? '#a78bfa' : '#6200ea' }} />}
                                    isDarkMode={isDarkMode}
                                />
                            </ul>
                        </nav>
                        <div className="mt-auto">
                            <ul>
                                <NavItem
                                    text="Team Chat"
                                    isCollapsed={isSidebarCollapsed}
                                    icon={<ForumIcon sx={{ color: isDarkMode ? '#e879f9' : '#d500f9' }} />}
                                    isDarkMode={isDarkMode}
                                />
                                <NavItem
                                    text="Administration"
                                    isCollapsed={isSidebarCollapsed}
                                    active={currentScreen === 'administration'}
                                    icon={<AdminPanelSettingsIcon sx={{ color: isDarkMode ? '#a78bfa' : '#6200ea' }} />}
                                    onClick={() => setCurrentScreen('administration')}
                                    isDarkMode={isDarkMode}
                                />
                            </ul>
                            <button
                                onClick={onLogout}
                                className={`w-full mt-4 font-semibold py-2 rounded-lg flex items-center transition-all text-sm ${
                                    isSidebarCollapsed
                                        ? 'justify-center'
                                        : 'justify-start px-4'
                                    } ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                <LogoutIcon sx={{ width: 20, height: 20, color: isDarkMode ? '#9ca3af' : '#6b7280' }} />
                                {!isSidebarCollapsed && <span className="ml-2">Log Out</span>}
                            </button>
                        </div>
                    </div>
                </aside>

                <div className="flex-1 flex flex-col relative">
                    <button
                        onClick={toggleDarkMode}
                        className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                            isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        aria-label="Toggle dark mode"
                    >
                        {isDarkMode ? (
                            <WbSunnyOutlinedIcon sx={{ width: 24, height: 24 }} />
                        ) : (
                            <DarkModeOutlinedIcon sx={{ width: 24, height: 24 }} />
                        )}
                    </button>
                    {currentScreen === 'home' ? (
                        <main className={`flex-1 flex flex-col p-4 md:p-6 ${isChatting ? 'overflow-hidden' : 'overflow-y-auto'} ${isDarkMode ? 'bg-black' : ''}`}>
                            <div className="lg:hidden flex items-center mb-4">
                                <button
                                    onClick={() => setIsSidebarOpen(true)}
                                    className={`p-2 rounded-md ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                                >
                                    <MenuIcon sx={{ width: 24, height: 24, color: isDarkMode ? '#9ca3af' : '#6b7280' }} />
                                </button>
                            </div>

                            <div className="w-full max-w-5xl mx-auto h-full flex flex-col">
                                <div className={`relative ${isChatting ? 'flex-1 min-h-0' : ''}`}>
                                    <AnimatePresence initial={false}>
                                        {isChatting ? (
                                            <motion.div
                                                key="chat-view"
                                                className="h-full"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                <div className="h-full overflow-y-auto space-y-6 pr-2">
                                                    {messages.map((msg, index) =>
                                                        msg.type === 'user' ? (
                                                            <UserMessage key={index} text={msg.content as string} isDarkMode={isDarkMode} />
                                                        ) : (
                                                            <AIMessage key={index} data={msg.content as AIMessageData} isDarkMode={isDarkMode} />
                                                        )
                                                    )}
                                                    {isSending && <TypingIndicator isDarkMode={isDarkMode} />}
                                                    <div ref={chatEndRef} />
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="welcome-view"
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="text-center py-4 md:py-8">
                                                    <div className="flex items-center justify-center gap-2 mb-4">
                                                        <div className={`inline-block p-2 rounded-full ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-500'}`}>
                                                            {greeting.icon}
                                                        </div>
                                                        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{greeting.text}</p>
                                                    </div>
                                                    <h2 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mt-1`}>
                                                        What would you like to analyze today?
                                                    </h2>
                                                    <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Start typing your query below</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <motion.div
                                    layout
                                    transition={{ type: 'spring', duration: 0.7, bounce: 0.2 }}
                                    className={`w-full pt-4 ${isChatting ? 'mt-auto' : 'mt-4'}`}
                                >
                                    <AnimatePresence>
                                        {!isChatting && (
                                            <motion.div
                                                key="prompt-pills"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="mb-6 flex items-center justify-center gap-3 flex-wrap px-2"
                                            >
                                                <span className={`text-sm font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Try:</span>
                                                <PromptPill
                                                    text="Relationship between promotions and sales"
                                                    colorClasses="bg-gray-50 border border-gray-200 text-black hover:bg-green-200 shadow-md"
                                                    onClick={setQuery}
                                                    isDarkMode={isDarkMode}
                                                />
                                                <PromptPill
                                                    text="Top sales promoters by amount"
                                                    colorClasses="bg-gray-50 border border-gray-200 text-black hover:bg-pink-200 shadow-md"
                                                    onClick={setQuery}
                                                    isDarkMode={isDarkMode}
                                                />
                                                <PromptPill
                                                    text="Clusters with highest average sale"
                                                    colorClasses="bg-gray-50 border border-gray-200 text-black hover:bg-orange-200 shadow-md"
                                                    onClick={setQuery}
                                                    isDarkMode={isDarkMode}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className={`border rounded-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200 flex flex-col shadow-xl ${
                                        isDarkMode
                                            ? 'bg-gray-900 border-gray-700'
                                            : 'bg-gradient-to-r from-pink-900 via-blue-200 to-orange-900 border-blue-300'
                                    }`}>
                                        <textarea
                                            ref={textareaRef}
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSubmit();
                                                }
                                            }}
                                            placeholder="Ask me anything..."
                                            rows={1}
                                            className={`w-full p-4 text-black border-none resize-none overflow-y-hidden focus:ring-0 ${isDarkMode ? 'bg-gray-900 text-gray-100 placeholder-gray-400' : 'bg-transparent text-gray-800'}`}
                                        />
                                        <div className="flex justify-between items-center p-2 pt-0">
                                            <div className="flex space-x-2 items-center">
                                                <button
                                                    name="UploadButton"
                                                    onClick={() => setIsUploadModalOpen(true)}
                                                    className={`p-2 rounded-full transition-colors ${
                                                        isDarkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                                                    }`}
                                                >
                                                    <AttachFileIcon sx={{ width: 20, height: 20 }} />
                                                </button>
                                                <button
                                                    name="DataSetsButton"
                                                    onClick={() => setIsDomainsModalOpen(true)}
                                                    className={`p-2 rounded-full transition-colors ${
                                                        isDarkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                                                    }`}
                                                >
                                                    <DatasetIcon sx={{ width: 20, height: 20 }} />
                                                </button>
                                                <button
                                                    className={`p-2 rounded-full transition-colors ${
                                                        isDarkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                                                    }`}
                                                >
                                                    <AddIcon sx={{ width: 20, height: 20 }} />
                                                </button>
                                                {showConnectionMessage && (
                                                    <div className={`text-sm font-medium ml-2 flex items-center gap-1 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                                                        ✔️ <span className="hidden md:inline">Dataset connected</span>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                name="SubmitButton"
                                                onClick={handleSubmitWithAnimation}
                                                className={`p-2 rounded-full transition-colors disabled:cursor-not-allowed ${
                                                    isDarkMode
                                                        ? 'bg-blue-700 text-gray-100 hover:bg-blue-600 disabled:bg-blue-900'
                                                        : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300'
                                                }`}
                                                disabled={!query.trim()}
                                            >
                                                <SendIcon sx={{ width: 20, height: 20 }} />
                                            </button>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {!isChatting && (
                                            <motion.div
                                                key="bottom-content"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0, y: 30 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="mt-5">
                                                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-11 gap-x-2 gap-y-4">
                                                        {aiAgents.map(agent => (
                                                            <AgentIcon
                                                                key={agent.name}
                                                                icon={agent.icon}
                                                                text={agent.name}
                                                                bgColor={agent.bgColor}
                                                                iconColor={agent.iconColor}
                                                                isNew={agent.isNew}
                                                                isDarkMode={isDarkMode}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </div>
                        </main>
                    ) : currentScreen === 'administration' ? (
                        <AdministrationScreen onBack={() => setCurrentScreen('home')} />
                    ) : currentScreen === 'insights' ? (
                        <LeadershipInsights />
                    ) : (
                        <DesignDiscoverPage onBack={() => setCurrentScreen('home')} />
                    )}
                </div>
            </div>

            <AnimatePresence>
                {isUploadModalOpen && currentScreen === 'home' && (
                    <UploadModal onClose={() => setIsUploadModalOpen(false)} isDarkMode={isDarkMode} />
                )}
                {isDomainsModalOpen && currentScreen === 'home' && (
                    <DomainsModal
                        onClose={() => setIsDomainsModalOpen(false)}
                        onDone={handleDomainsSelected}
                        selectedDomains={selectedDomains}
                        setSelectedDomains={setSelectedDomains}
                        isDarkMode={isDarkMode}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showThinkingAnimation && <ThinkingAnimation />}
            </AnimatePresence>
        </div>
    );
};

export default HomeAskAIScreen;