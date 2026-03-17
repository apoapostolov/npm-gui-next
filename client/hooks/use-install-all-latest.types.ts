export interface ProgressStep {
  error?: string;
  from: string | null;
  name: string;
  startedAt: number | null;
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILURE';
  to: string | null;
}
