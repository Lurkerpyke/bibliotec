import { getUsers } from './actions';
import UserTable from './UserTable';
import { transformUser, UserFromDB } from './types';

export default async function UsersPage() {
    const usersFromDB: UserFromDB[] = await getUsers();
    const users = usersFromDB.map(transformUser);

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-blue-500">Manage Users</h1>
                <p className="text-gray-600">
                    Approve, reject, or manage user permissions
                </p>
            </div>

            <UserTable initialUsers={users} />
        </div>
    );
}
