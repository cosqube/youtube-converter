###not working sorry

# YouTube Converter & Downloader

A modern, responsive web application built with Next.js for converting YouTube videos to MP3 and downloading YouTube videos in high quality.

## Features

- 🎵 **Convert to MP3**: Extract high-quality audio from YouTube videos
- 📹 **Download Videos**: Download YouTube videos in their original quality
- 🎨 **Modern UI**: Beautiful, responsive design with dark mode support
- ⚡ **Fast Processing**: Quick video processing and downloads
- 🔒 **Secure**: Private downloads with no data storage
- 📱 **Mobile Friendly**: Works perfectly on all devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Next.js API Routes
- **Video Processing**: ytdl-core

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd youtube-converter
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Select Mode**: Choose between "Convert to MP3" or "Download Video"
2. **Enter URL**: Paste a valid YouTube URL
3. **Download**: Click the download button and wait for processing
4. **Save**: The file will be automatically downloaded to your device

## Supported URL Formats

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://www.youtube.com/v/VIDEO_ID`

## API Endpoints

### POST /api/download

Convert and download YouTube videos.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "type": "mp3" | "video"
}
```

**Response:**
- Returns the converted file as a downloadable blob
- Content-Type: `audio/mpeg` for MP3, `video/mp4` for video
- Content-Disposition: attachment with filename

## Development

### Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── download/
│   │       └── route.ts      # API endpoint for processing
│   ├── globals.css           # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
└── components/              # Reusable components (if any)
```

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Important Notes

- This application is for educational purposes
- Respect YouTube's Terms of Service
- Only download content you have permission to use
- Consider copyright restrictions

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is for educational purposes only. Please respect YouTube's Terms of Service and copyright laws.
