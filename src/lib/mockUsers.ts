// src/lib/mockUsers.ts
export interface User {
  role: 'admin' | 'instructor' | 'student';
  name: string;
}

export const mockUsers: Record<string, User> = {
  admin: { role: 'admin', name: 'Admin User' },
  instructor: { role: 'instructor', name: 'Instructor User' },
  student: { role: 'student', name: 'Student User' },
};