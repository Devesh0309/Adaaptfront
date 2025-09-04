import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from "../../api/apiClient"; // Assuming you have this API client setup
import { LeadershipInsights } from './LeadershipInsights'; // Import LeadershipInsights
import AdministrationScreen from "./AdministrationScreen"; // Assuming this component exists
import DesignDiscoverPage from './DesignDiscoverPage'; // Assuming this component exists

// --- MUI ICON IMPORTS (Consolidated & Updated) ---
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
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DatasetIcon from '@mui/icons-material/Dataset';
import SendIcon from '@mui/icons-material/Send';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import AddIcon from '@mui/icons-material/Add';


// --- TYPE DEFINITIONS ---
interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  onClick?: () => void;
}

interface PromptCardProps {
  icon: React.ReactNode;
  text: string;
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
const NavItem: React.FC<NavItemProps> = ({ icon, text, active = false, onClick }) => (
  <li
    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
    onClick={onClick}
  >
    {icon}
    <span className="ml-3 font-medium text-sm">{text}</span>
  </li>
);

const PromptCard: React.FC<PromptCardProps> = ({ icon, text }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer flex flex-col h-36">
    <div className="flex items-start">
      {icon}
      <p className="ml-3 text-base font-semibold text-gray-700">{text}</p>
    </div>
  </div>
);

const UploadModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDomainId, setSelectedDomainId] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userPromise = apiClient.get<User>('/auth/me');
        const domainsPromise = apiClient.get<Department[]>('/knowledge-base/domains');
        const [userResponse, domainsResponse] = await Promise.all([userPromise, domainsPromise]);
        const currentUser = userResponse.data;
        const allDomains = domainsResponse.data;
        const allowedDomains = allDomains.filter(domain =>
          currentUser.allowed_domains.includes(domain.name)
        );
        setDepartments(allowedDomains);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        const mockUserData = { allowed_domains: ["sales_q3_2025_data"] };
        const mockAllDomains = [
          { name: "sales_q3_2025_data", display_name: "Sales Department (Fallback)", id: "3fa85f64-5717-4562-b3fc-2c963f66afa6" },
          { name: "hr_policy_docs_v2", display_name: "Human Resources (Fallback)", id: "a1b2c3d4-e5f6-7890-1234-567890abcdef" }
        ] as Department[];
        const filteredMockDomains = mockAllDomains.filter(domain => mockUserData.allowed_domains.includes(domain.name));
        setDepartments(filteredMockDomains);
        setMessage({ type: 'error', text: 'Could not load data. Displaying accessible fallback departments.' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedDomainId || !selectedFile) {
      setMessage({ type: 'error', text: 'Please select a department and a file.' });
      return;
    }
    setIsUploading(true);
    setMessage(null);
    const formData = new FormData();
    formData.append('domain_id', selectedDomainId);
    formData.append('title', '');
    formData.append('author', '');
    formData.append('language', '');
    formData.append('file', selectedFile);
    try {
      await apiClient.post('/ingestion/upload', formData);
      setMessage({ type: 'success', text: 'File uploaded successfully!' });
      setTimeout(onClose, 500);
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage({ type: 'error', text: 'Upload failed. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center font-sans">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Upload a Document</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-1 rounded-full">
            <CloseIcon sx={{ width: 20, height: 20 }} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Select Department</label>
            <select
              id="department"
              value={selectedDomainId}
              onChange={(e) => setSelectedDomainId(e.target.value)}
              disabled={isLoading}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="" disabled>{isLoading ? 'Loading departments...' : 'Choose a department...'}</option>
              {departments.length > 0 ? (
                departments.map(dept => (<option key={dept.id} value={dept.id}>{dept.display_name}</option>))
              ) : !isLoading && (<option value="" disabled>No accessible departments found</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attach File</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500"
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              {selectedFile ? (<p className="text-gray-700">{selectedFile.name}</p>) : (<p className="text-gray-500">Click to select a file</p>)}
            </div>
          </div>
        </div>
        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleUpload}
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            disabled={isUploading || isLoading || !selectedFile || !selectedDomainId}
          >
            {isUploading ? 'Uploading...' : 'Confirm Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface DomainsModalProps {
  onClose: () => void;
  onDone: (selectedIds: string[]) => void;
  selectedDomains: string[];
  setSelectedDomains: React.Dispatch<React.SetStateAction<string[]>>;
}

const DomainsModal: React.FC<DomainsModalProps> = ({ onClose, onDone, selectedDomains, setSelectedDomains }) => {
  const [domains, setDomains] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
        setMessage({ type: 'error', text: 'Could not load domains or user data.' });
        const mockDomains = [
          { name: "sales_q3_2025_data", display_name: "Sales Department (Fallback)", description: "Data related to sales figures and reports.", id: "3fa85f64-5717-4562-b3fc-2c963f66afa6" }
        ] as Department[];
        setDomains(mockDomains);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleDomain = (domainId: string) => {
    setSelectedDomains(prevSelected =>
      prevSelected.includes(domainId) ? prevSelected.filter(id => id !== domainId) : [...prevSelected, domainId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center font-sans">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Select domains for agentic search</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-1 rounded-full">
            <CloseIcon sx={{ width: 20, height: 20 }} />
          </button>
        </div>
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-gray-500 text-center">Loading domains...</p>
          ) : domains.length === 0 ? (
            <p className="text-gray-500 text-center">No accessible domains found.</p>
          ) : (
            <ul className="space-y-2 max-h-72 overflow-y-auto pr-2">
              {domains.map(domain => (
                <li key={domain.id}>
                  <label htmlFor={`domain-${domain.id}`} className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors flex items-center">
                    <input
                      type="checkbox"
                      id={`domain-${domain.id}`}
                      checked={selectedDomains.includes(domain.id)}
                      onChange={() => handleToggleDomain(domain.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-800">{domain.display_name}</p>
                      <p className="text-xs text-gray-500">{domain.description}</p>
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onDone(selectedDomains)}
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

const UserMessage: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex justify-end">
    <div className="bg-blue-600 text-white rounded-2xl rounded-br-none py-2 px-4 max-w-lg shadow-sm">
      {text}
    </div>
  </div>
);

const AIMessage: React.FC<{ data: AIMessageData }> = ({ data }) => {
  if (data.error) {
    return (
      <div className="flex justify-start">
        <div className="bg-red-100 text-red-800 rounded-2xl rounded-bl-none py-2 px-4 max-w-lg shadow-sm">
          <p>{data.error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none p-4 max-w-lg space-y-4 shadow-sm">
        <p className="text-gray-800 whitespace-pre-wrap">{data.answer}</p>
        {data.domains_searched && data.domains_searched.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-600">Domains Searched:</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {data.domains_searched.map((domain) => (
                <span key={domain} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">{domain}</span>
              ))}
            </div>
          </div>
        )}
        {data.sources && data.sources.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-600">Sources:</h4>
            <div className="space-y-2 mt-1">
              {data.sources.map((source, index) => (
                <div key={index} className="bg-gray-50 border p-2 rounded-md text-xs text-gray-600">
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

const TypingIndicator: React.FC = () => (
  <div className="flex justify-start">
    <div className="bg-gray-200 rounded-2xl rounded-bl-none py-3 px-4 shadow-sm">
      <div className="flex items-center space-x-1.5">
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
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
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDomainsModalOpen, setIsDomainsModalOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'administration' | 'insights' | 'discover'>('home');
  const [showConnectionMessage, setShowConnectionMessage] = useState(false);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showThinkingAnimation, setShowThinkingAnimation] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isChatting = messages.length > 0;

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
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="flex h-screen">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-60 bg-white border-r border-gray-200 p-4 flex flex-col transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <BoltIcon sx={{ width: 20, height: 20 }} />
              </div>
              <h1 className="text-lg font-bold ml-2">adaapt</h1>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <CloseIcon sx={{ width: 20, height: 20 }} />
            </button>
          </div>
          <nav className="flex-grow">
            <ul>
              <NavItem
                text="Ask AI"
                active={currentScreen === 'home'}
                icon={<AutoAwesomeIcon sx={{ color: '#2962ff' }} />}
                onClick={() => setCurrentScreen('home')}
              />
              <NavItem
                text="Insights"
                active={currentScreen === 'insights'}
                onClick={() => setCurrentScreen('insights')}
                icon={<InsightsIcon sx={{ color: '#00c853' }} />}
              />
              <NavItem
                text="Discover"
                active={currentScreen === 'discover'}
                onClick={() => setCurrentScreen('discover')}
                icon={<TravelExploreIcon sx={{ color: '#ff6d00' }} />}
              />
            </ul>
          </nav>
          <div className="mt-auto">
            <ul>
              <NavItem
                text="Team Chat"
                icon={<ForumIcon sx={{ color: '#d500f9' }} />}
              />
              <NavItem
                text="Administration"
                active={currentScreen === 'administration'}
                icon={<AdminPanelSettingsIcon sx={{ color: '#6200ea' }} />}
                onClick={() => setCurrentScreen('administration')}
              />
            </ul>
            <button
              onClick={onLogout}
              className="w-full mt-4 bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors text-sm"
            >
              <LogoutIcon sx={{ width: 20, height: 20, marginRight: '0.5rem' }} />
              Log Out
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          {currentScreen === 'home' ? (
            <main className={`flex-1 flex flex-col p-4 md:p-6 ${isChatting ? 'overflow-hidden' : 'overflow-y-auto'}`}>
              <div className="lg:hidden flex items-center mb-4">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <MenuIcon sx={{ width: 24, height: 24 }} />
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
                              <UserMessage key={index} text={msg.content as string} />
                            ) : (
                              <AIMessage key={index} data={msg.content as AIMessageData} />
                            )
                          )}
                          {isSending && <TypingIndicator />}
                          <div ref={chatEndRef} />
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="welcome-view"
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="text-center py-8 md:py-16">
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="inline-block bg-blue-100 text-blue-500 p-2 rounded-full">
                              <WbSunnyOutlinedIcon sx={{ width: 32, height: 32 }} />
                            </div>
                            <p className="text-lg text-gray-600">Good morning,</p>
                          </div>
                          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-1">
                            What would you like to analyze today?
                          </h2>
                          <p className="text-gray-500 mt-2">Start typing your query below</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.div
                  layout
                  transition={{ type: 'spring', duration: 0.7, bounce: 0.2 }}
                  className={`w-full pt-4 ${isChatting ? 'mt-auto' : 'mt-8'}`}
                >
                  <div className="bg-white border border-gray-200 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200 flex flex-col shadow-sm">
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
                      className="w-full p-4 border-none resize-none overflow-y-hidden bg-transparent focus:ring-0"
                    />
                    <div className="flex justify-between items-center p-2 pt-0">
                      <div className="flex space-x-2 items-center">
                        <button
                          name="UploadButton"
                          onClick={() => setIsUploadModalOpen(true)}
                          className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-800 transition-colors"
                        >
                          <AttachFileIcon sx={{ width: 20, height: 20 }} />
                        </button>
                        <button
                          name="DataSetsButton"
                          onClick={() => setIsDomainsModalOpen(true)}
                          className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-800 transition-colors"
                        >
                          <DatasetIcon sx={{ width: 20, height: 20 }} />
                        </button>
                        {showConnectionMessage && (
                          <div className="text-green-600 text-sm font-medium ml-2 flex items-center gap-1">
                            ✔️ <span className="hidden md:inline">Dataset connected</span>
                          </div>
                        )}
                      </div>
                      <button
                        name="SubmitButton"
                        onClick={handleSubmitWithAnimation}
                        className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                        disabled={!query.trim()}
                      >
                        <SendIcon sx={{ width: 20, height: 20 }} />
                      </button>
                    </div>
                  </div>
                </motion.div>

                <AnimatePresence>
                  {!isChatting && (
                    <motion.div
                      key="bottom-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, y: 30 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex-grow">
                          <div className="flex items-center">
                            <SettingsEthernetIcon className="text-blue-600" sx={{ width: 24, height: 24 }} />
                            <h3 className="text-lg font-semibold text-gray-800 ml-3">
                              Setup your data source
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            This is a feature of the enterprise plan, please contact our{' '}
                            <a href="#" className="text-blue-600 font-medium hover:underline">
                              adaapt expert
                            </a>{' '}
                            for more information and activation.
                          </p>
                        </div>
                        <button className="bg-white text-blue-600 font-semibold py-2 px-5 rounded-lg flex items-center hover:bg-blue-50 transition-colors whitespace-nowrap self-start md:self-center">
                          <AddIcon sx={{ width: 20, height: 20, marginRight: '0.5rem' }} />
                          Add Connection
                        </button>
                      </div>
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-800">Try these prompts</h3>
                        <div className="grid md:grid-cols-3 gap-4 mt-4">
                          <PromptCard
                            icon={<BoltIcon className="text-blue-600" sx={{ width: 20, height: 20 }} />}
                            text="What is the relationship between different types of promotions and..."
                          />
                          <PromptCard
                            icon={<BoltIcon className="text-blue-600" sx={{ width: 20, height: 20 }} />}
                            text="Who are the top sales promoters based on sales amount?"
                          />
                          <PromptCard
                            icon={<BoltIcon className="text-blue-600" sx={{ width: 20, height: 20 }} />}
                            text="Which clusters have the highest average sale amount?"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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

      {isUploadModalOpen && currentScreen === 'home' && (
        <UploadModal onClose={() => setIsUploadModalOpen(false)} />
      )}
      {isDomainsModalOpen && currentScreen === 'home' && (
        <DomainsModal
          onClose={() => setIsDomainsModalOpen(false)}
          onDone={handleDomainsSelected}
          selectedDomains={selectedDomains}
          setSelectedDomains={setSelectedDomains}
        />
      )}
      <AnimatePresence>
        {showThinkingAnimation && <ThinkingAnimation />}
      </AnimatePresence>
    </div>
  );
};

export default HomeAskAIScreen;