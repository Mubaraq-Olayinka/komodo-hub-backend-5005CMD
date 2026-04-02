export interface Activity {
  id?: string;
  classId: string;
  title: string;
  description: string;
  dueDate?: string;
  createdBy: string; // teacherId
  organizationId: string;
  createdAt: string;
}
