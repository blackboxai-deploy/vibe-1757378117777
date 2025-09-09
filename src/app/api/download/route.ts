import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, filename } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Fetch the image from the URL
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch image' },
        { status: 400 }
      );
    }

    // Get the image data
    const imageBuffer = await imageResponse.arrayBuffer();
    
    // Determine content type
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    
    // Set appropriate headers for download
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${filename || 'generated-image.jpg'}"`);
    headers.set('Content-Length', imageBuffer.byteLength.toString());

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: headers,
    });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to download image' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Image download API endpoint. Use POST method with imageUrl and filename.' },
    { status: 200 }
  );
}