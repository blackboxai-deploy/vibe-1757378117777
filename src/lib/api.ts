import { GenerationRequest, GenerationResponse } from '@/types/image';

export const generateImage = async (request: GenerationRequest): Promise<GenerationResponse> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Image generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

export const downloadImage = async (imageUrl: string, filename: string): Promise<void> => {
  try {
    const response = await fetch('/api/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl, filename }),
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};

export const saveImageToHistory = (image: any): void => {
  try {
    const history = getImageHistory();
    const updatedHistory = [image, ...history].slice(0, 50); // Keep last 50 images
    localStorage.setItem('imageHistory', JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error saving to history:', error);
  }
};

export const getImageHistory = (): any[] => {
  try {
    const history = localStorage.getItem('imageHistory');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error loading history:', error);
    return [];
  }
};

export const clearImageHistory = (): void => {
  try {
    localStorage.removeItem('imageHistory');
  } catch (error) {
    console.error('Error clearing history:', error);
  }
};