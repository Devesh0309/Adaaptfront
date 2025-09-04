import React, { useState, useEffect } from 'react';
import apiClient from "../../api/apiClient";

// --- TYPE DEFINITIONS ---

interface IconProps {
  path: string;
  className?: string;
}

interface File {
  id: string;
  title: string;
  file_name: string;
  uploaded_at: string;
  department_id: string;
}

interface Domain {
  id: string;
  name: string;
  display_name: string;
}

// --- HELPER COMPONENTS ---

const Icon: React.FC<IconProps> = ({ path, className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
  <button
    type="button"
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
      checked ? 'bg-blue-600' : 'bg-gray-200'
    }`}
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
  >
    <span
      className={`absolute left-0 inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

// --- MAIN COMPONENT ---

const AdministrationScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  // General State
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'register' | 'database'>('register');

  // Database Tab State
  const [files, setFiles] = useState<File[]>([]);
  const [isDbLoading, setIsDbLoading] = useState<boolean>(false);

  // Register User Tab State
  const [isDomainsLoading, setIsDomainsLoading] = useState<boolean>(false);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [email, setEmail] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [organization, setOrganization] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [role, setRole] = useState<string>('employee');
  const [password, setPassword] = useState<string>('');
  const [allowedDomains, setAllowedDomains] = useState<string[]>([]);
  const [isSuperuser, setIsSuperuser] = useState<boolean>(false);

  // Effect for fetching data based on the active tab
  useEffect(() => {
    const fetchTabData = async () => {
      setMessage(null); // Clear message on tab switch
      if (activeTab === 'database') {
        setIsDbLoading(true);
        try {
          const response = await apiClient.get<File[]>('/ingestion/documents');
          setFiles(response.data);
        } catch (error) {
          console.error("Failed to fetch files:", error);
          setFiles([
            { id: "file1", title: "Q3 Sales Report", file_name: "q3_sales.pdf", uploaded_at: "2025-08-31T10:00:00.000Z", department_id: "sales_dept_123" },
            { id: "file2", title: "HR Policy 2025", file_name: "hr_policy.pdf", uploaded_at: "2025-08-30T12:00:00.000Z", department_id: "hr_dept_456" }
          ]);
          setMessage({ type: 'error', text: 'Could not load files. Displaying fallback data.' });
        } finally {
          setIsDbLoading(false);
        }
      } else if (activeTab === 'register') {
        setIsDomainsLoading(true);
        try {
          const response = await apiClient.get<Domain[]>('/knowledge-base/domains');
          setDomains(response.data);
          if (response.data.length > 0) {
            setDepartment(response.data[0].name); // Default to the first department
          }
        } catch (error) {
          console.error("Failed to fetch domains:", error);
          setMessage({ type: 'error', text: 'Could not load departments and domains.' });
        } finally {
          setIsDomainsLoading(false);
        }
      }
    };

    fetchTabData();
  }, [activeTab]);

  const handleAllowedDomainsChange = (domain: string) => {
    setAllowedDomains(prev => 
      prev.includes(domain) 
        ? prev.filter(d => d !== domain)
        : [...prev, domain]
    );
  };
  
  const resetForm = () => {
    setEmail('');
    setFullName('');
    setOrganization('');
    setDepartment(domains.length > 0 ? domains[0].name : '');
    setRole('employee');
    setPassword('');
    setAllowedDomains([]);
    setIsSuperuser(false);
  }

  const handleRegisterUser = async () => {
    if (!email || !fullName || !password || !department || !organization) {
      setMessage({ type: 'error', text: 'Please fill out all required fields.' });
      return;
    }

    const requestBody = {
      email,
      full_name: fullName,
      organization,
      department,
      role,
      password,
      allowed_domains: allowedDomains,
      is_superuser: isSuperuser,
      is_active: true,
      is_verified: false,
    };

    try {
      await apiClient.post('/auth/register', requestBody);
      setMessage({ type: 'success', text: 'User registered successfully!' });
      resetForm();
    } catch (error) {
      console.error("User registration failed:", error);
      setMessage({ type: 'error', text: 'User registration failed. Please try again.' });
    }
  };

  // --- RENDER LOGIC ---

  const renderRegisterForm = () => {
    if (isDomainsLoading) {
      return <p className="text-gray-600">Loading registration form...</p>;
    }
    return (
      <>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Register a User</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1 */}
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Enter full name" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Enter user email" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Enter a secure password" />
            </div>
            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
              <input id="organization" type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Enter organization name" />
            </div>
          </div>
          {/* Column 2 */}
          <div className="space-y-4">
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select id="department" value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg">
                {domains.map(d => <option key={d.id} value={d.name}>{d.display_name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg">
                <option value="employee">Employee</option>
                <option value="sales_manager">Sales Manager</option>
                <option value="hr_specialist">HR Specialist</option>
                <option value="analyst">Analyst</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allowed Departments</label>
              <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                {domains.map(d => (
                  <div key={d.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`domain-${d.id}`}
                      checked={allowedDomains.includes(d.name)}
                      onChange={() => handleAllowedDomainsChange(d.name)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`domain-${d.id}`} className="ml-2 text-sm text-gray-700">{d.display_name}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="is_superuser" className="block text-sm font-medium text-gray-700">Create as Superuser</label>
              <ToggleSwitch checked={isSuperuser} onChange={setIsSuperuser} />
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button onClick={handleRegisterUser} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300" disabled={!email || !fullName || !password}>
            Register User
          </button>
        </div>
      </>
    );
  };

  const renderDatabaseView = () => (
    <>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Database - Uploaded Files</h3>
      {isDbLoading ? (
        <p className="text-gray-600">Loading files...</p>
      ) : files.length === 0 ? (
        <p className="text-gray-600">No files uploaded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department ID</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {files.map(file => (
                <tr key={file.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{file.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{file.file_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(file.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{file.domain_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="mb-4 flex items-center text-blue-600 hover:underline">
          <Icon path="M15 19l-7-7 7-7" className="w-5 h-5 mr-2" />
          Back to Ask AI
        </button>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Administration</h2>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button onClick={() => setActiveTab('register')} className={`${activeTab === 'register' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
              Register a User
            </button>
            <button onClick={() => setActiveTab('database')} className={`${activeTab === 'database' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
              Database
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          {activeTab === 'register' ? renderRegisterForm() : renderDatabaseView()}
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdministrationScreen;