export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  dimensions?: {
    width: number;
    height: number;
  };
  style?: string;
}

export interface GenerationRequest {
  prompt: string;
  style?: string;
  dimensions?: string;
}

export interface GenerationResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export interface APIError {
  message: string;
  code?: string;
  details?: any;
}