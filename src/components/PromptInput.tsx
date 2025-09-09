"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PromptInputProps {
  onGenerate: (prompt: string, style: string, dimensions: string) => void;
  isGenerating: boolean;
}

export default function PromptInput({ onGenerate, isGenerating }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [dimensions, setDimensions] = useState("1024x1024");

  const promptSuggestions = [
    "A futuristic cityscape at sunset with flying cars",
    "A magical forest with glowing mushrooms and fireflies", 
    "A serene mountain lake reflecting snow-capped peaks",
    "A cyberpunk street scene with neon lights",
    "A cozy cottage in a flower-filled meadow",
    "An underwater city with coral architecture"
  ];

  const styles = [
    { value: "realistic", label: "Realistic" },
    { value: "artistic", label: "Artistic" },
    { value: "cartoon", label: "Cartoon" },
    { value: "sci-fi", label: "Sci-Fi" },
    { value: "fantasy", label: "Fantasy" },
    { value: "minimalist", label: "Minimalist" }
  ];

  const dimensionOptions = [
    { value: "1024x1024", label: "Square (1024×1024)" },
    { value: "1024x768", label: "Landscape (1024×768)" },
    { value: "768x1024", label: "Portrait (768×1024)" },
    { value: "1152x896", label: "Wide (1152×896)" },
    { value: "896x1152", label: "Tall (896×1152)" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt.trim(), style, dimensions);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>🎨</span>
          <span>Create Your Masterpiece</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium">
              Describe your image
            </label>
            <Textarea
              id="prompt"
              placeholder="Describe the image you want to generate... Be creative and detailed!"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] resize-none"
              disabled={isGenerating}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Style</label>
              <Select value={style} onValueChange={setStyle} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {styles.map((styleOption) => (
                    <SelectItem key={styleOption.value} value={styleOption.value}>
                      {styleOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Dimensions</label>
              <Select value={dimensions} onValueChange={setDimensions} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dimensionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!prompt.trim() || isGenerating}
            size="lg"
          >
            {isGenerating ? "Generating..." : "Generate Image"}
          </Button>
        </form>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Need inspiration? Try these prompts:</h3>
          <div className="flex flex-wrap gap-2">
            {promptSuggestions.map((suggestion, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors p-2 text-xs"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}