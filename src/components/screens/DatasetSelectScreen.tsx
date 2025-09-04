import React, { useState, useEffect } from 'react';
import { AdaaptLogo } from '../AdaabtLogo';

interface DatasetSelectScreenProps {
  preselectedDataset?: string;
  onComplete: (dataset: string, user?: string) => void;
  onSkip: () => void;
}

interface Dataset {
  id: string;
  name: string;
  meta: string;
  department: 'Sales' | 'Marketing' | 'Finance' | 'Support' | 'HR';
  source: 'Snowflake' | 'BigQuery' | 'Redshift' | 'Postgres' | 'MySQL' | 'Google Sheets' | 'S3';
  lastUpdated: string;
  rows: string;
  status: 'Ready' | 'Syncing' | 'Error';
  columns?: number;
  owner?: string;
}

interface AccessLogEntry {
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  result: 'Success' | 'Denied';
}

// Dataset Details Drawer Component
const DatasetDetailsDrawer = ({
  dataset,
  isOpen,
  onClose
}: {
  dataset: Dataset | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen || !dataset) return null;

  const sampleFields = [
    { name: 'customer_id', type: 'STRING' },
    { name: 'order_date', type: 'DATE' },
    { name: 'revenue', type: 'FLOAT' },
    { name: 'region', type: 'STRING' },
    { name: 'product_category', type: 'STRING' }
  ];

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50">
      <div className="absolute right-0 top-0 h-full w-[360px] bg-white rounded-l-md shadow-lg border-l border-blue-50">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">{dataset.name}</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-full transition ease-in-out"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Meta Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Source</div>
              <div className="text-sm text-gray-800">{dataset.source}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Owner</div>
              <div className="text-sm text-gray-800">{dataset.owner || 'Admin'}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Last Updated</div>
              <div className="text-sm text-gray-800">{dataset.lastUpdated}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Row Count</div>
              <div className="text-sm text-gray-800">{dataset.rows}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Columns</div>
              <div className="text-sm text-gray-800">{dataset.columns || 47}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Department</div>
              <div className="text-sm text-gray-800">{dataset.department}</div>
            </div>
          </div>

          {/* Sample Fields */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Sample Fields</h3>
            <div className="space-y-2">
              {sampleFields.map((field, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded-lg border border-blue-100 hover:shadow-md transition"
                >
                  <span className="text-sm text-gray-900 font-medium">{field.name}</span>
                  <span className="text-xs text-gray-600 bg-white border border-gray-100 px-2 py-1 rounded">{field.type}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition ease-in-out">
            Open schema
          </button>
        </div>
      </div>
    </div>
  );
};

// Access Log Drawer Component
const AccessLogDrawer = ({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  const accessLog: AccessLogEntry[] = [
    { timestamp: '2024-01-15 14:30', actor: 'john.doe@company.com', action: 'Dataset Access', target: 'Sales_Transactions', result: 'Success' },
    { timestamp: '2024-01-15 14:25', actor: 'jane.smith@company.com', action: 'Schema View', target: 'Sales_Transactions', result: 'Success' },
    { timestamp: '2024-01-15 14:20', actor: 'mike.johnson@company.com', action: 'Export Data', target: 'Finance_Analysis', result: 'Denied' },
    { timestamp: '2024-01-15 14:15', actor: 'sarah.wilson@company.com', action: 'Query Execute', target: 'Marketing_Leads', result: 'Success' },
    { timestamp: '2024-01-15 14:10', actor: 'admin@company.com', action: 'Permission Change', target: 'Product_Performance', result: 'Success' }
  ];

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50">
      <div className="absolute right-0 top-0 h-full w-[450px] bg-white rounded-l-md shadow-lg border-l border-blue-50">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Access & changes (last 30 days)</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-full transition ease-in-out"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Access Log Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Timestamp</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Actor</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Action</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Target</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Result</th>
                </tr>
              </thead>
              <tbody>
                {accessLog.map((entry, index) => (
                  <tr key={index} className={index % 2 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-3 px-4 text-gray-900">{entry.timestamp}</td>
                    <td className="py-3 px-4 text-gray-700">{entry.actor.split('@')[0]}</td>
                    <td className="py-3 px-4 text-gray-700">{entry.action}</td>
                    <td className="py-3 px-4 text-gray-700">{entry.target}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        entry.result === 'Success'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {entry.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3 pt-4">
            <button className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
              Export CSV
            </button>
            <button
              className="text-sm text-blue-600 hover:underline transition"
              onClick={() => {
                const event = new CustomEvent('show-toast', {
                  detail: { type: 'info', message: 'Full audit in Settings coming soon!' }
                });
                window.dispatchEvent(event);
              }}
            >
              Open full audit in Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export function DatasetSelectScreen({ preselectedDataset, onComplete, onSkip }: DatasetSelectScreenProps) {
  // Sample datasets with exact specifications
  const datasets: Dataset[] = [
    {
      id: 'sales_transactions',
      name: 'Sales_Transactions',
      meta: 'Primary sales data',
      department: 'Sales',
      source: 'Snowflake',
      lastUpdated: '3d ago',
      rows: '1.2M',
      status: 'Ready',
      columns: 47,
      owner: 'john.doe@company.com'
    },
    {
      id: 'regional_sales',
      name: 'Regional_Sales',
      meta: 'Regional breakdown',
      department: 'Sales',
      source: 'BigQuery',
      lastUpdated: '4d ago',
      rows: '620k',
      status: 'Ready',
      columns: 32,
      owner: 'jane.smith@company.com'
    },
    {
      id: 'finance_analysis',
      name: 'Finance_Analysis',
      meta: 'Financial reports',
      department: 'Finance',
      source: 'Postgres',
      lastUpdated: '2d ago',
      rows: '240k',
      status: 'Ready',
      columns: 28,
      owner: 'mike.johnson@company.com'
    },
    {
      id: 'product_performance',
      name: 'Product_Performance',
      meta: 'Product metrics',
      department: 'Sales',
      source: 'Redshift',
      lastUpdated: '4d ago',
      rows: '340k',
      status: 'Ready',
      columns: 35,
      owner: 'sarah.wilson@company.com'
    },
    {
      id: 'marketing_leads',
      name: 'Marketing_Leads',
      meta: 'Lead generation',
      department: 'Marketing',
      source: 'Google Sheets',
      lastUpdated: '5d ago',
      rows: '710k',
      status: 'Ready',
      columns: 19,
      owner: 'alex.brown@company.com'
    }
  ];

  // State management
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [datasetSelected, setDatasetSelected] = useState(false);
  const [selectedTeammate, setSelectedTeammate] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('Sales');
  const [selectedRole, setSelectedRole] = useState('Viewer');
  const [adminCanViewAll, setAdminCanViewAll] = useState(true);
  const [autoAssignByDomain, setAutoAssignByDomain] = useState(false);

  // Search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Drawers
  const [showDatasetDetails, setShowDatasetDetails] = useState(false);
  const [showAccessLog, setShowAccessLog] = useState(false);
  const [selectedDatasetForDetails, setSelectedDatasetForDetails] = useState<Dataset | null>(null);
  
  // Animation state
  const [isLoaded, setIsLoaded] = useState(false);

  // Preselection logic
  useEffect(() => {
    if (preselectedDataset === 'Sales_Transactions') {
      setSelectedDataset('sales_transactions');
      setDatasetSelected(true);
    }
  }, [preselectedDataset]);

  // Update role when admin status changes
  useEffect(() => {
    if (selectedRole === 'Admin') {
      setAdminCanViewAll(true);
    }
  }, [selectedRole]);

  // Effect to trigger the animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100); // Small delay to ensure initial state is rendered first
    return () => clearTimeout(timer);
  }, []);

  // Filter datasets
  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'All' || dataset.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  // Handlers
  const handleRowClick = (dataset: Dataset) => {
    setSelectedDataset(dataset.id);
    setDatasetSelected(true);
  };

  const handleContinue = () => {
    if (selectedDataset) {
      const dataset = datasets.find(d => d.id === selectedDataset);
      onComplete(dataset?.name || selectedDataset, selectedTeammate);
    }
  };

  const handleViewDetails = (dataset: Dataset) => {
    setSelectedDatasetForDetails(dataset);
    setShowDatasetDetails(true);
  };

  const handleViewAccessLog = () => {
    setShowAccessLog(true);
  };

  const handleExportAccessLog = () => {
    const event = new CustomEvent('show-toast', {
      detail: { type: 'success', message: 'Access log exported to CSV!' }
    });
    window.dispatchEvent(event);
  };

  // Helper functions
  const getStatusPillClass = (status: string) => {
    switch (status) {
      case 'Ready': return 'bg-green-100 text-green-700 border border-green-100';
      case 'Syncing': return 'bg-blue-50 text-blue-700 border border-blue-100';
      case 'Error': return 'bg-red-100 text-red-700 border border-red-100';
      default: return 'bg-gray-100 text-gray-700 border border-gray-100';
    }
  };

  const getDepartmentPillClass = (department: string) => {
    const colors = {
      'Sales': 'bg-blue-50 text-blue-700 border border-blue-100',
      'Marketing': 'bg-blue-50 text-blue-700 border border-blue-100',
      'Finance': 'bg-blue-50 text-blue-700 border border-blue-100',
      'Support': 'bg-blue-50 text-blue-700 border border-blue-100',
      'HR': 'bg-blue-50 text-blue-700 border border-blue-100'
    };
    return colors[department as keyof typeof colors] || 'bg-gray-100 text-gray-700 border border-gray-100';
  };

  const getSourceLogo = (source: string) => {
    const logos = {
      'Snowflake': '❄️',
      'BigQuery': '🔍',
      'Redshift': '🚀',
      'Postgres': '🐘',
      'MySQL': '🗄️',
      'Google Sheets': '📊',
      'S3': '📦'
    };
    return logos[source as keyof typeof logos] || '🔗';
  };

  const teammates = [
    'Jane D.',
    'Sam K.',
    'Priya R.',
    '+ Add new...'
  ];

  const departments = ['Sales', 'Marketing', 'Finance', 'Support', 'HR'];
  const roles = ['Admin', 'Manager', 'Analyst', 'Viewer'];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-4">
            <div className="p-1 rounded-md brounded-mdg-blue-50">
              <AdaaptLogo size="sm" className="h-7" />
            </div>
            <h1 className="text-lg font-bold text-gray-900">Choose a dataset & set scope</h1>
          </div>

          {/* Right: Help, Avatar, Logout */}
          <div className="flex items-center gap-4">
            <button
              className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:shadow-md transition"
              title="Help"
            >
              ?
            </button>

            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-700">JD</span>
            </div>

            <button
              className="text-sm text-blue-600 hover:underline transition"
              onClick={() => {
                const event = new CustomEvent('show-toast', {
                  detail: { type: 'info', message: 'Logout functionality coming soon!' }
                });
                window.dispatchEvent(event);
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-10 px-6 overflow-x-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ✨ Left Column: Added hover effects and updated transition */}
          <div
            className={`lg:col-span-2 bg-white rounded-md border border-blue-300 shadow-sm justify-between h-auto lg:h-[78vh] flex flex-col 
                       transition-all duration-500 ease-out 
                       hover:shadow-2xl hover:-translate-y-2  hover:border-blue-500
                       ${isLoaded ? 'translate-x-0' : '-translate-x-full'}`}
          >
            {/* Header with Search and Filters */}
            <div className="p-5 border-b border-gray-100 shrink-0">
              <div className="flex items-center justify-between">
                <div className="w-full max-w-lg relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search datasets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-2 rounded-md border border-gray-100 bg-gray-50 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="py-2 px-3 rounded-md border border-gray-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="All">Department ▾</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-auto scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
              <table className="w-full">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="text-left py-3 px-5 text-sm font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-5 text-sm font-semibold text-gray-700">Department</th>
                    <th className="text-left py-3 px-5 text-sm font-semibold text-gray-700">Source</th>
                    <th className="text-left py-3 px-5 text-sm font-semibold text-gray-700">Last updated</th>
                    <th className="text-left py-3 px-5 text-sm font-semibold text-gray-700">Rows</th>
                    <th className="text-left py-3 px-5 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-5 text-sm font-semibold text-gray-700">⋯</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDatasets.map((dataset, index) => (
                    <tr
                      key={dataset.id}
                      className={`cursor-pointer transition hover:shadow-md ${selectedDataset === dataset.id ? 'bg-blue-50' : index % 2 === 1 ? 'bg-white' : 'bg-gray-50'}`}
                      onClick={() => handleRowClick(dataset)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleRowClick(dataset);
                        }
                      }}
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <span className="text-lg">📊</span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{dataset.name}</div>
                            <div className="text-sm text-gray-500">{dataset.meta}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getDepartmentPillClass(dataset.department)}`}>
                          {dataset.department}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getSourceLogo(dataset.source)}</span>
                          <span className="text-sm text-gray-900">{dataset.source}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-sm text-gray-600">{dataset.lastUpdated}</td>
                      <td className="py-4 px-5 font-medium text-gray-900">{dataset.rows}</td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusPillClass(dataset.status)}`}>
                          {dataset.status}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <button
                          className="text-gray-500 hover:text-gray-700 p-2 rounded-full transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(dataset);
                          }}
                          title="View dataset details"
                        >
                          ⋯
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{filteredDatasets.length} datasets</span>
                <button
                  className="text-sm text-blue-600 hover:underline transition"
                  onClick={() => {
                    if (selectedDatasetForDetails) {
                      setShowDatasetDetails(true);
                    }
                  }}
                >
                  View dataset details →
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button className="py-1 px-3 rounded-md border border-gray-100 bg-white text-sm hover:shadow transition">Prev</button>
                <button className="py-1 px-3 rounded-md border border-gray-100 bg-white text-sm hover:shadow transition">Next</button>
              </div>
            </div>
          </div>

          {/* ✨ Right Column: Added hover effects and updated transition */}
          <aside
            className={`bg-white rounded-md border border-blue-300 shadow-md p-6 flex flex-col h-auto lg:h-[78vh] 
                       transition-all duration-500 ease-out 
                       hover:shadow-2xl hover:border-blue-500 hover:-translate-y-2
                       ${isLoaded ? 'translate-x-0' : 'translate-x-full'}`}
          >
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 pr-2 space-y-4">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Allot to a teammate (optional)
              </h3>

              {/* Teammate Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Teammate</label>
                <select
                  value={selectedTeammate}
                  onChange={(e) => setSelectedTeammate(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-gray-100 bg-gray-50 text-sm 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="">Select teammate...</option>
                  {teammates.map((teammate) => (
                    <option key={teammate} value={teammate}>
                      {teammate}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department Scope */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Department scope</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-gray-100 bg-gray-50 text-sm 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-gray-100 bg-gray-50 text-sm 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={adminCanViewAll}
                    onChange={(e) => setAdminCanViewAll(e.target.checked)}
                    disabled={selectedRole !== "Admin"}
                    className="h-4 w-4 rounded border-gray-200 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Admin can view all data</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={autoAssignByDomain}
                    onChange={(e) => setAutoAssignByDomain(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-200 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Auto-assign by email domain</span>
                </label>
              </div>

              {/* Helper Text */}
              <div className="text-sm text-gray-500">
                Permissions and changes are logged for audit.
              </div>

              {/* Inline Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleViewAccessLog}
                  className="text-sm text-blue-600 hover:underline transition text-left"
                >
                  View current access log
                </button>
                <button
                  onClick={handleExportAccessLog}
                  className="text-sm text-blue-600 hover:underline transition text-left"
                >
                  Export access log (CSV)
                </button>
              </div>
            </div>

            {/* Footer stays fixed at bottom */}
            <div className="pt-4 border-t mt-4 flex items-center justify-between gap-3">
              <button
                onClick={onSkip}
                className="flex-1 py-2 rounded-md border border-gray-100 bg-green-300 text-sm font-medium hover:shadow transition"
              >
                Skip
              </button>
              <button
                onClick={handleContinue}
                disabled={!datasetSelected}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                  datasetSelected
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-200 text-grey-400 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Drawers */}
      <DatasetDetailsDrawer
        dataset={selectedDatasetForDetails}
        isOpen={showDatasetDetails}
        onClose={() => setShowDatasetDetails(false)}
      />

      <AccessLogDrawer
        isOpen={showAccessLog}
        onClose={() => setShowAccessLog(false)}
      />
    </div>
  );
}