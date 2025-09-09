"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { GeneratedImage } from "@/types/image";
import { downloadImage } from "@/lib/api";
import LoadingSpinner from "./LoadingSpinner";

interface ImageCardProps {
  image: GeneratedImage;
  onDelete?: (id: string) => void;
}

export default function ImageCard({ image, onDelete }: ImageCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    try {
      const filename = `ai-image-${image.id}.jpg`;
      await downloadImage(image.url, filename);
    } catch (error) {
      console.error('Download failed:', error);
      // You could add a toast notification here
    } finally {
      setIsDownloading(false);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-0">
        <div className="relative aspect-square">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <LoadingSpinner size="md" text="Loading image..." />
            </div>
          )}
          
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">⚠️</div>
                <p className="text-sm">Failed to load image</p>
              </div>
            </div>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <img
                  src={image.url}
                  alt={image.prompt}
                  className={`w-full h-full object-cover cursor-pointer transition-transform duration-200 group-hover:scale-105 ${
                    isLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  loading="lazy"
                />
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] p-2">
                <div className="relative">
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="bg-black/70 hover:bg-black/80 text-white"
                    >
                      {isDownloading ? '⏳' : '⬇️'} {isDownloading ? 'Downloading...' : 'Download'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Overlay with actions - appears on hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
            <Button 
              size="sm" 
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-white/90 hover:bg-white text-black"
            >
              {isDownloading ? '⏳' : '⬇️'}
            </Button>
            {onDelete && (
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => onDelete(image.id)}
                className="bg-red-500/90 hover:bg-red-600 text-white"
              >
                🗑️
              </Button>
            )}
          </div>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {image.prompt}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {image.style && (
                <Badge variant="secondary" className="text-xs">
                  {image.style}
                </Badge>
              )}
              {image.dimensions && (
                <Badge variant="outline" className="text-xs">
                  {image.dimensions.width}×{image.dimensions.height}
                </Badge>
              )}
            </div>
            
            <span className="text-xs text-gray-400">
              {formatTimestamp(image.timestamp)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}