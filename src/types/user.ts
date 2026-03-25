export type UserRole = "student" | "teacher" | "org_admin";

export interface User {
  id?: string;
  fullName: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  classIds?: string[];
  createdAt: Date;
}
