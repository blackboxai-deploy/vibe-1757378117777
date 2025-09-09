"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GeneratedImage } from "@/types/image";
import { getImageHistory, clearImageHistory } from "@/lib/api";
import ImageCard from "./ImageCard";

interface ImageGalleryProps {
  newImage?: GeneratedImage | null;
}

export default function ImageGallery({ newImage }: ImageGalleryProps) {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    if (newImage) {
      setImages(prev => [newImage, ...prev]);
    }
  }, [newImage]);

  const loadImages = () => {
    setIsLoading(true);
    try {
      const history = getImageHistory();
      setImages(history);
    } catch (error) {
      console.error('Failed to load image history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = (imageId: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== imageId);
      // Update localStorage
      try {
        localStorage.setItem('imageHistory', JSON.stringify(filtered));
      } catch (error) {
        console.error('Failed to update localStorage:', error);
      }
      return filtered;
    });
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all generated images?')) {
      clearImageHistory();
      setImages([]);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your gallery...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (images.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">No images yet</h3>
            <p className="text-gray-600 mb-4">
              Your generated images will appear here. Start creating your first masterpiece!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <span>🖼️</span>
          <span>Your Gallery</span>
          <span className="text-sm font-normal text-gray-500">
            ({images.length} image{images.length !== 1 ? 's' : ''})
          </span>
        </CardTitle>
        {images.length > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleClearAll}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onDelete={handleDeleteImage}
            />
          ))}
        </div>
        
        {images.length >= 10 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> Your gallery stores the last 50 generated images locally. 
              Older images will be automatically removed to save space.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}