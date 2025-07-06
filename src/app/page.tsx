'use client';

import { useState } from 'react';
import { Download, Music, Video, Loader2, AlertCircle } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadMode, setDownloadMode] = useState<'mp3' | 'video'>('mp3');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isValidYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }
    
    if (!isValidYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, type: downloadMode }),
      });
      
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `youtube-${downloadMode === 'mp3' ? 'audio' : 'video'}.${downloadMode === 'mp3' ? 'mp3' : 'mp4'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
      
      setSuccess(`${downloadMode === 'mp3' ? 'Audio' : 'Video'} downloaded successfully!`);
      setUrl('');
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              YouTube <span className="text-red-500">Converter</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Convert YouTube videos to MP3 or download them in high quality
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
            {/* Mode Selection */}
            <div className="flex justify-center mb-8">
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                <button
                  onClick={() => setDownloadMode('mp3')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    downloadMode === 'mp3'
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Music size={20} />
                  Convert to MP3
                </button>
                <button
                  onClick={() => setDownloadMode('video')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    downloadMode === 'video'
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Video size={20} />
                  Download Video
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  YouTube URL
                </label>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download size={24} />
                    {downloadMode === 'mp3' ? 'Convert to MP3' : 'Download Video'}
                  </>
                )}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
                <AlertCircle className="text-red-500" size={20} />
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <p className="text-green-700 dark:text-green-300">{success}</p>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <Music className="mx-auto mb-4 text-red-500" size={48} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">High Quality MP3</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Convert YouTube videos to high-quality MP3 audio files
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <Video className="mx-auto mb-4 text-red-500" size={48} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Video Download</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Download YouTube videos in their original quality
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <Download className="mx-auto mb-4 text-red-500" size={48} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Fast & Secure</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Quick processing with secure, private downloads
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
