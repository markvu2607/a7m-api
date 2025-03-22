export interface Judge0SubmissionRequest {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
  cpu_time_limit?: number;
  memory_limit?: number;
}

export interface Judge0SubmissionResponse {
  token: string;
}

export interface Judge0SubmissionResult {
  stdin: string | null;
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: {
    id: number;
    description: string;
  };
  memory: number | null;
  time: number | null;
  expected_output?: string | null;
}

export interface Judge0SubmissionBatchResponse {
  submissions: Judge0SubmissionResult[];
}

export interface Judge0SubmissionBatchRequest {
  submissions: Judge0SubmissionRequest[];
}
