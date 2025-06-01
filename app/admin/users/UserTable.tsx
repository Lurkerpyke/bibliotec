'use client';

import { useState } from 'react';
import { updateUserStatus, deleteUser, updateUserRole } from './actions';
import { toast } from 'sonner';
import { User, UserAction } from './types';

export default function UserTable({ initialUsers }: { initialUsers: User[] }) {
    const [users, setUsers] = useState(initialUsers);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleAction = async (userId: string, action: UserAction) => {
        setLoadingId(userId);

        try {
            switch (action) {
                case 'approve':
                    await updateUserStatus(userId, 'APPROVED');
                    setUsers(users.map(u =>
                        u.id === userId ? { ...u, status: 'APPROVED' } : u
                    ));
                    toast.success('User approved');
                    break;
                case 'reject':
                    await updateUserStatus(userId, 'REJECTED');
                    setUsers(users.map(u =>
                        u.id === userId ? { ...u, status: 'REJECTED' } : u
                    ));
                    toast.success('User rejected');
                    break;
                case 'delete':
                    await deleteUser(userId);
                    setUsers(users.filter(u => u.id !== userId));
                    toast.success('User deleted');
                    break;
                case 'promote':
                    await updateUserRole(userId, 'ADMIN');
                    setUsers(users.map(u =>
                        u.id === userId ? { ...u, role: 'ADMIN' } : u
                    ));
                    toast.success('User promoted to admin');
                    break;
                case 'demote':
                    await updateUserRole(userId, 'USER');
                    setUsers(users.map(u =>
                        u.id === userId ? { ...u, role: 'USER' } : u
                    ));
                    toast.success('Admin privileges removed');
                    break;
            }
        } catch (error) {
            toast.error('Action failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            setLoadingId(null);
        }
    };
    // Status badge styling
    const statusBadge = (status: string) => {
        const base = "px-2 py-1 rounded-full text-xs font-medium";
        switch (status) {
            case 'APPROVED': return `${base} bg-green-100 text-green-800`;
            case 'PENDING': return `${base} bg-yellow-100 text-yellow-800`;
            case 'REJECTED': return `${base} bg-red-100 text-red-800`;
            default: return `${base} bg-gray-100 text-gray-800`;
        }
    };

    // Role badge styling
    const roleBadge = (role: string) => {
        const base = "px-2 py-1 rounded-full text-xs font-medium";
        return role === 'ADMIN'
            ? `${base} bg-purple-100 text-purple-800`
            : `${base} bg-blue-100 text-blue-800`;
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                University ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Joined
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-700 font-medium">
                                                {user.fullName.charAt(0)}
                                            </span>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.fullName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.universityId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={statusBadge(user.status!)}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={roleBadge(user.role!)}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(user.createdAt!).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end space-x-2">
                                        {user.status === 'PENDING' && (
                                            <>
                                                <button
                                                    onClick={() => handleAction(user.id, 'approve')}
                                                    disabled={loadingId === user.id}
                                                    className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleAction(user.id, 'reject')}
                                                    disabled={loadingId === user.id}
                                                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}

                                        {user.status === 'APPROVED' && user.role === 'USER' && (
                                            <button
                                                onClick={() => handleAction(user.id, 'promote')}
                                                disabled={loadingId === user.id}
                                                className="text-purple-600 hover:text-purple-900 disabled:opacity-50"
                                            >
                                                Make Admin
                                            </button>
                                        )}

                                        {user.role === 'ADMIN' && (
                                            <button
                                                onClick={() => handleAction(user.id, 'demote')}
                                                disabled={loadingId === user.id}
                                                className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                                            >
                                                Remove Admin
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleAction(user.id, 'delete')}
                                            disabled={loadingId === user.id}
                                            className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {users.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No users found
                    </div>
                )}
            </div>
        </div>
    );
}