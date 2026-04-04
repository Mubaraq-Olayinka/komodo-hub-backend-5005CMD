export type SubmissionStatus = "pending" | "graded";

export interface Submission {
  id?: string;
  activityId: string;
  activityTitle: string; 
  studentId: string;
  content: string;
  fileUrl?: string;

  status: SubmissionStatus; 
  grade?: number; 
  feedback?: string; 

  createdAt: string;
}
