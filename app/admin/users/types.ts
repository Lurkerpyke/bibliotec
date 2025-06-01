// types.ts

// Dados crus do banco ou API
export type UserFromDB = {
    id: string;
    fullName: string;
    email: string;
    universityId: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | null;
    role: 'USER' | 'ADMIN' | null;
    lastActivityDate: string | null;
    createdAt: string | Date | null;
};

export function transformUser(user: UserFromDB): User {
    if (!user.status || !user.role || !user.createdAt || !user.lastActivityDate) {
        throw new Error(`Invalid user data: ${user.id}`);
    }

    return {
        ...user,
        status: user.status,
        role: user.role,
        createdAt: new Date(user.createdAt),
        lastActivityDate: new Date(user.lastActivityDate),
    };
}


// Dados tratados para uso no front
export type User = {
    id: string;
    fullName: string;
    email: string;
    universityId: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    role: 'USER' | 'ADMIN';
    lastActivityDate: Date;
    createdAt: Date;
};

export type UserAction =
    | 'approve'
    | 'reject'
    | 'delete'
    | 'promote'
    | 'demote';
