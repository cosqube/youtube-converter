import { NextRequest, NextResponse } from 'next/server';
import ytdl from 'ytdl-core';
import { Readable } from 'stream';

// Helper function to validate YouTube URL
function isValidYouTubeUrl(url: string): boolean {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/;
  return youtubeRegex.test(url);
}

// Helper function to convert stream to buffer
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

export async function POST(request: NextRequest) {
  try {
    const { url, type } = await request.json();

    // Validate input
    if (!url || !type) {
      return NextResponse.json(
        { error: 'URL and type are required' },
        { status: 400 }
      );
    }

    if (!isValidYouTubeUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    if (!['mp3', 'video'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be either "mp3" or "video"' },
        { status: 400 }
      );
    }

    // Check if URL is valid and accessible
    const isValid = await ytdl.validateURL(url);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or inaccessible YouTube URL' },
        { status: 400 }
      );
    }

    // Get video info
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s-]/g, '').trim();

    let stream: Readable;
    let contentType: string;
    let filename: string;

    if (type === 'mp3') {
      // For MP3, get audio-only format
      stream = ytdl(url, {
        quality: 'highestaudio',
        filter: 'audioonly',
      });
      contentType = 'audio/mpeg';
      filename = `${title}.mp3`;
    } else {
      // For video, get highest quality video
      stream = ytdl(url, {
        quality: 'highest',
        filter: 'videoandaudio',
      });
      contentType = 'video/mp4';
      filename = `${title}.mp4`;
    }

    // Convert stream to buffer
    const buffer = await streamToBuffer(stream);

    // Create response with appropriate headers
    const response = new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
      },
    });

    return response;
  } catch (error) {
    console.error('Download error:', error);
    
    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('No formats found')) {
        return NextResponse.json(
          { error: 'Video format not available' },
          { status: 400 }
        );
      }
      
      if (error.message.includes('Video unavailable')) {
        return NextResponse.json(
          { error: 'Video is unavailable or private' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to process video. Please try again.' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
