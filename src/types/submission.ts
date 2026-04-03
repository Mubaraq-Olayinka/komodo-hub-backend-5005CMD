export type SubmissionStatus = "pending" | "graded";

export interface Submission {
  id?: string;
  activityId: string;
  studentId: string;
  content: string;
  fileUrl?: string;

  status: SubmissionStatus; // ✅ NEW
  grade?: number; // ✅ NEW
  feedback?: string; // ✅ NEW

  createdAt: string;
}
