'use server';

import { auth } from '@/auth';
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { borrowRecords } from '@/database/schema';

// Fetch all users (excluding sensitive fields)
export async function getUsers() {
    return db.select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        universityId: users.universityId,
        status: users.status,
        role: users.role,
        lastActivityDate: users.lastActivityDate,
        createdAt: users.createdAt
    }).from(users);
  }

// Update user status
export async function updateUserStatus(
    userId: string,
    status: 'APPROVED' | 'REJECTED'
) {
    await db
        .update(users)
        .set({ status })
        .where(eq(users.id, userId));

    revalidatePath('/admin/users');
}

// Delete user
export async function deleteUser(userId: string) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error('Unauthorized: No session');
    }

    const isAdmin = await db
        .select({ role: users.role })
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1)
        .then((res) => res[0]?.role === 'ADMIN');

    if (!isAdmin) {
        throw new Error('Unauthorized: Admin only');
    }

    // Delete related borrow records first to avoid foreign key errors
    await db.delete(borrowRecords).where(eq(borrowRecords.userId, userId));

    // Then delete the user
    await db.delete(users).where(eq(users.id, userId));

    revalidatePath('/admin/users');
}

// Promote/demote admin status
export async function updateUserRole(
    userId: string,
    role: 'USER' | 'ADMIN'
) {
    await db
        .update(users)
        .set({ role })
        .where(eq(users.id, userId));

    revalidatePath('/admin/users');
}
