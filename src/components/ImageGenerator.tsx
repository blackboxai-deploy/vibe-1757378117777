"use client";

import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { GeneratedImage } from "@/types/image";
import { generateImage, saveImageToHistory } from "@/lib/api";
import PromptInput from "./PromptInput";
import ImageGallery from "./ImageGallery";
import LoadingSpinner from "./LoadingSpinner";

export default function ImageGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [generationTime, setGenerationTime] = useState<number | null>(null);

  const handleGenerate = async (prompt: string, style: string, dimensions: string) => {
    setIsGenerating(true);
    setError(null);
    setCurrentImage(null);
    setGenerationTime(null);

    const startTime = Date.now();

    try {
      const result = await generateImage({
        prompt: `${prompt}${style !== 'realistic' ? `, ${style} style` : ''}`,
        style,
        dimensions
      });

      const endTime = Date.now();
      setGenerationTime((endTime - startTime) / 1000);

      if (result.success && result.imageUrl) {
        const [width, height] = dimensions.split('x').map(Number);
        
        const newImage: GeneratedImage = {
          id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          url: result.imageUrl,
          prompt,
          timestamp: Date.now(),
          dimensions: { width, height },
          style
        };

        // Save to history
        saveImageToHistory(newImage);
        setCurrentImage(newImage);
      } else {
        setError(result.error || 'Failed to generate image. Please try again.');
      }
    } catch (error) {
      console.error('Generation error:', error);
      setError(
        error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <PromptInput 
        onGenerate={handleGenerate} 
        isGenerating={isGenerating} 
      />

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Generation Status */}
      {isGenerating && (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <LoadingSpinner size="lg" text="Creating your masterpiece..." />
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  This usually takes 15-30 seconds
                </p>
                <div className="max-w-md mx-auto bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {currentImage && generationTime && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="flex items-center text-green-800">
            <span className="mr-2">✅</span>
            Image generated successfully in {generationTime.toFixed(1)} seconds!
          </AlertDescription>
        </Alert>
      )}

      {/* Gallery */}
      <ImageGallery newImage={currentImage} />
    </div>
  );
}