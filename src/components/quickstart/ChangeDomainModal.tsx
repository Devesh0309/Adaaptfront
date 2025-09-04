// src/components/quickstart/ChangeDomainModal.tsx

import React from 'react';

// --- INTERFACES (Can be moved to a shared types file) ---
interface Department {
    id: string;
    display_name: string;
}

interface Invite {
    email: string;
    role: string;
}

interface NewDepartmentInput {
    display_name: string;
    description: string;
    allowed_roles: string;
}

interface ChangeDomainModalProps {
    isStep1Complete: boolean;
    isAddingDepartment: boolean;
    existingDomains: Department[];
    newDepartmentInput: NewDepartmentInput;
    invites: Invite[];
    onNewDepartmentInputChange: (field: keyof NewDepartmentInput, value: string) => void;
    onAddDepartment: () => void;
    onUpdateInvite: (index: number, field: 'email' | 'role', value: string) => void;
    onAddInviteRow: () => void;
    onConfirmStep1: () => void;
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
export function ChangeDomainModal({
    isStep1Complete,
    isAddingDepartment,
    existingDomains,
    newDepartmentInput,
    invites,
    onNewDepartmentInputChange,
    onAddDepartment,
    onUpdateInvite,
    onAddInviteRow,
    onConfirmStep1,
}: ChangeDomainModalProps) {
    return (
        <div className="bg-white rounded-md border border-blue-300 p-6 sm:p-8 shadow-xl h-[72vh] overflow-y-auto">
            <div className="flex items-start gap-4 mb-6">
                <StepIndicator number={1} isActive={!isStep1Complete} isComplete={isStep1Complete} />
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Set up your organization</h2>
                    <p className="text-gray-600">Create departments and invite your team. Departments are required to continue.</p>
                </div>
            </div>

            <div className={`transition-opacity duration-500 ${isStep1Complete ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                {/* Create Departments Section */}
                <div className="mb-6">
                    <h3 className="text-md font-semibold text-gray-800 mb-3">Create Departments</h3>
                    <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <input
                            type="text"
                            value={newDepartmentInput.display_name}
                            onChange={(e) => onNewDepartmentInputChange('display_name', e.target.value)}
                            placeholder="Department Name (e.g., Sales, HR)"
                            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                            value={newDepartmentInput.description}
                            onChange={(e) => onNewDepartmentInputChange('description', e.target.value)}
                            placeholder="Description (Optional)"
                            rows={2}
                            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            value={newDepartmentInput.allowed_roles}
                            onChange={(e) => onNewDepartmentInputChange('allowed_roles', e.target.value)}
                            placeholder="Allowed Roles (comma-separated, e.g., Admin, Viewer)"
                            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={onAddDepartment}
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

                {/* Invite Teammates Section */}
                <div>
                    <h3 className="text-md font-semibold text-gray-800 mb-3">Invite Teammates (Optional)</h3>
                    <div className="space-y-3">
                        {invites.map((invite, index) => (
                            <div key={index} className="flex gap-3">
                                <input
                                    type="email"
                                    value={invite.email}
                                    onChange={(e) => onUpdateInvite(index, 'email', e.target.value)}
                                    placeholder="teammate@example.com"
                                    className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    value={invite.role}
                                    onChange={(e) => onUpdateInvite(index, 'role', e.target.value)}
                                    placeholder="Role"
                                    className="w-32 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        ))}
                        <button onClick={onAddInviteRow} className="text-sm font-semibold text-blue-600 hover:underline">+ Add another</button>
                    </div>
                </div>

                {/* Continue Button */}
                {!isStep1Complete && (
                    <div className="mt-8 text-right">
                        <button
                            onClick={onConfirmStep1}
                            disabled={existingDomains.length === 0}
                            className="px-6 py-2 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {existingDomains.length > 0 ? 'Continue to Step 2' : 'Create a Department to Continue'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}