export type UserRole = 'driver' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  targetCarName?: string;
  startingBalance?: number;
}
