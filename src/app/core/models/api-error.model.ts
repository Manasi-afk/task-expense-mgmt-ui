// Mirrors com.taskexpense.app.exception.ApiError
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  details: string[];
}
