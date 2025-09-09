import { NextRequest, NextResponse } from 'next/server';
import { GenerationRequest } from '@/types/image';

export async function POST(request: NextRequest) {
  try {
    const body: GenerationRequest = await request.json();
    const { prompt, style, dimensions } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Enhance prompt based on style and dimensions
    let enhancedPrompt = prompt;
    if (style && style !== 'realistic') {
      enhancedPrompt += `, ${style} style`;
    }
    if (dimensions) {
      enhancedPrompt += `, high quality, detailed`;
    }

    // Call the AI API with custom endpoint configuration
    const aiResponse = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'CustomerId': 'cus_T1BFlfXN1NyLqR',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx',
      },
      body: JSON.stringify({
        model: 'replicate/black-forest-labs/flux-1.1-pro',
        messages: [
          {
            role: 'user',
            content: enhancedPrompt
          }
        ]
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API Error:', aiResponse.status, errorText);
      
      return NextResponse.json(
        { 
          success: false, 
          error: `AI service error: ${aiResponse.status}. Please try again.` 
        },
        { status: 500 }
      );
    }

    const aiResult = await aiResponse.json();
    
    // Extract image URL from the response
    let imageUrl: string | null = null;
    
    if (aiResult.choices && aiResult.choices[0] && aiResult.choices[0].message) {
      const content = aiResult.choices[0].message.content;
      
      // Try to extract URL from the content
      if (typeof content === 'string') {
        // Look for various URL patterns
        const urlPatterns = [
          /https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp)/gi,
          /https?:\/\/[^\s]+/gi
        ];
        
        for (const pattern of urlPatterns) {
          const matches = content.match(pattern);
          if (matches && matches[0]) {
            imageUrl = matches[0];
            break;
          }
        }
      }
    }
    
    // If no URL found in message content, check if the response itself contains the URL
    if (!imageUrl && typeof aiResult === 'object') {
      // Check various possible response structures
      if (aiResult.url) {
        imageUrl = aiResult.url;
      } else if (aiResult.output && typeof aiResult.output === 'string') {
        imageUrl = aiResult.output;
      } else if (Array.isArray(aiResult.output) && aiResult.output[0]) {
        imageUrl = aiResult.output[0];
      }
    }

    if (!imageUrl) {
      console.error('No image URL found in AI response:', JSON.stringify(aiResult, null, 2));
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to generate image. The AI service did not return a valid image URL.' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl
    });

  } catch (error) {
    console.error('Image generation error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Image generation API endpoint. Use POST method.' },
    { status: 200 }
  );
}