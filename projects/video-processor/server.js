const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const url = require("url");

const PORT = 3000;
const UPLOAD_DIR = "./uploads";
const PROCESSED_DIR = "./processed";

// Ensure directories exist
[UPLOAD_DIR, PROCESSED_DIR, "./pages"].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// In-memory queue
let queue = [];
let currentProcessing = null;

// HTML Pages Content
const HTML_PAGES = {
  upload: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload Video</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen">
    <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <h1 class="text-xl font-bold text-gray-800">🎬 Video Processor</h1>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="/" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Home</a>
                    <a href="/pages/upload.html" class="text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Upload</a>
                    <a href="/pages/queue.html" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Queue</a>
                </div>
            </div>
        </div>
    </nav>

    <main class="max-w-3xl mx-auto px-4 py-12">
        <div class="bg-white rounded-lg shadow-md p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Upload Video</h2>
            
            <div id="uploadArea" class="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <p class="mt-2 text-sm text-gray-600">Click to select or drag and drop video file</p>
                <p class="text-xs text-gray-500 mt-1">Supports: MP4, MOV, AVI, MKV, WebM</p>
                <input type="file" id="videoFile" accept="video/*,.mp4,.mov,.avi,.mkv,.webm" class="hidden">
            </div>

            <div id="fileInfo" class="mt-4 hidden">
                <p class="text-sm text-gray-700"><strong>Selected:</strong> <span id="fileName"></span></p>
                <p class="text-sm text-gray-500"><strong>Size:</strong> <span id="fileSize"></span></p>
            </div>

            <div id="progressSection" class="mt-6 hidden">
                <div class="mb-2">
                    <span class="text-sm font-medium text-gray-700">Uploading...</span>
                    <span class="text-sm text-gray-500 float-right" id="progressPercent">0%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div id="progressBar" class="bg-blue-600 h-2.5 rounded-full transition-all" style="width: 0%"></div>
                </div>
            </div>

            <div id="messageArea" class="mt-4"></div>

            <button id="uploadBtn" class="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Upload Video
            </button>
        </div>
    </main>

    <script>
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('videoFile');
        const fileInfo = document.getElementById('fileInfo');
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');
        const uploadBtn = document.getElementById('uploadBtn');
        const progressSection = document.getElementById('progressSection');
        const progressBar = document.getElementById('progressBar');
        const progressPercent = document.getElementById('progressPercent');
        const messageArea = document.getElementById('messageArea');

        let selectedFile = null;

        uploadArea.addEventListener('click', () => fileInput.click());
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('border-blue-500');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('border-blue-500');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('border-blue-500');
            if (e.dataTransfer.files.length > 0) {
                handleFileSelect(e.dataTransfer.files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
            }
        });

        function handleFileSelect(file) {
            selectedFile = file;
            fileName.textContent = file.name;
            fileSize.textContent = formatBytes(file.size);
            fileInfo.classList.remove('hidden');
            uploadBtn.disabled = false;
        }

        function formatBytes(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
        }

        uploadBtn.addEventListener('click', async () => {
            if (!selectedFile) return;

            uploadBtn.disabled = true;
            progressSection.classList.remove('hidden');
            messageArea.innerHTML = '';

            const formData = new FormData();
            formData.append('video', selectedFile);

            try {
                const xhr = new XMLHttpRequest();

                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percent = Math.round((e.loaded / e.total) * 100);
                        progressBar.style.width = percent + '%';
                        progressPercent.textContent = percent + '%';
                    }
                });

                xhr.addEventListener('load', () => {
                    if (xhr.status === 200) {
                        messageArea.innerHTML = '<div class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">Upload successful! Redirecting to queue...</div>';
                        setTimeout(() => {
                            window.location.href = '/pages/queue.html';
                        }, 1500);
                    } else {
                        messageArea.innerHTML = '<div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">Upload failed. Please try again.</div>';
                        uploadBtn.disabled = false;
                    }
                });

                xhr.addEventListener('error', () => {
                    messageArea.innerHTML = '<div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">Upload error. Please try again.</div>';
                    uploadBtn.disabled = false;
                });

                xhr.open('POST', '/upload');
                xhr.send(formData);
            } catch (error) {
                messageArea.innerHTML = '<div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">Error: ' + error.message + '</div>';
                uploadBtn.disabled = false;
            }
        });
    </script>
</body>
</html>`,

  queue: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Processing Queue</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen">
    <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <h1 class="text-xl font-bold text-gray-800">🎬 Video Processor</h1>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="/" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Home</a>
                    <a href="/pages/upload.html" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Upload</a>
                    <a href="/pages/queue.html" class="text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Queue</a>
                </div>
            </div>
        </div>
    </nav>

    <main class="max-w-6xl mx-auto px-4 py-12">
        <div class="mb-8">
            <h2 class="text-3xl font-bold text-gray-900">Processing Queue</h2>
            <p class="text-gray-600 mt-2">Track your video processing status in real-time</p>
        </div>

        <div id="queueContainer" class="space-y-4">
            <div class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p class="text-gray-500 mt-4">Loading queue...</p>
            </div>
        </div>

        <div id="emptyState" class="hidden text-center py-12">
            <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path>
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">No videos in queue</h3>
            <p class="mt-2 text-gray-500">Upload a video to get started</p>
            <a href="/pages/upload.html" class="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Upload Video</a>
        </div>
    </main>

    <script>
        let pollInterval;

        function getStatusColor(status) {
            const colors = {
                queued: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                processing: 'bg-blue-100 text-blue-800 border-blue-200',
                completed: 'bg-green-100 text-green-800 border-green-200',
                failed: 'bg-red-100 text-red-800 border-red-200'
            };
            return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
        }

        function getStatusIcon(status) {
            const icons = {
                queued: '⏳',
                processing: '⚙️',
                completed: '✅',
                failed: '❌'
            };
            return icons[status] || '📄';
        }

        function formatDate(timestamp) {
            return new Date(timestamp).toLocaleString();
        }

        function renderQueue(queue) {
            const container = document.getElementById('queueContainer');
            const emptyState = document.getElementById('emptyState');

            if (!queue || queue.length === 0) {
                container.innerHTML = '';
                emptyState.classList.remove('hidden');
                return;
            }

            emptyState.classList.add('hidden');
            
            container.innerHTML = queue.map(function(job) {
                const statusIcon = getStatusIcon(job.status);
                const statusColor = getStatusColor(job.status);
                const statusText = job.status === 'processing' ? 'Processing' : job.status.charAt(0).toUpperCase() + job.status.slice(1);
                let progressBar = '';
                if (job.status === 'processing' || job.status === 'queued') {
                    progressBar = '<div class="w-full bg-gray-200 rounded-full h-2.5"><div class="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style="width: ' + (job.progress || 0) + '%"></div></div><p class="text-xs text-gray-500 mt-1">' + (job.progress || 0) + '% complete</p>';
                }
                
                let actionButton = '';
                if (job.status === 'completed') {
                    actionButton = '<a href="/pages/video.html?id=' + job.id + '" class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>Watch</a>';
                } else {
                    actionButton = '<button class="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed" disabled><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>Processing</button>';
                }
                
                return '<div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"><div class="flex items-start justify-between"><div class="flex-1"><div class="flex items-center space-x-3"><span class="text-2xl">' + statusIcon + '</span><div><h3 class="text-lg font-semibold text-gray-900">' + job.originalName + '</h3><p class="text-sm text-gray-500">Uploaded: ' + formatDate(job.uploadTime) + '</p></div></div><div class="mt-4"><div class="flex items-center justify-between mb-2"><span class="text-sm font-medium text-gray-700">' + statusText + '</span><span class="px-3 py-1 rounded-full text-xs font-medium border ' + statusColor + '">' + job.status.toUpperCase() + '</span></div>' + progressBar + '</div></div><div class="ml-4">' + actionButton + '</div></div></div>';
            }).join('');
        }

        async function fetchQueue() {
            try {
                const response = await fetch('/queue-status');
                const queue = await response.json();
                renderQueue(queue);
            } catch (error) {
                console.error('Error fetching queue:', error);
            }
        }

        // Initial fetch
        fetchQueue();

        // Poll every 2 seconds
        pollInterval = setInterval(fetchQueue, 2000);

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            clearInterval(pollInterval);
        });
    </script>
</body>
</html>`,

  video: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Watch Video</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
</head>
<body class="bg-gray-50 min-h-screen">
    <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <h1 class="text-xl font-bold text-gray-800">🎬 Video Processor</h1>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="/" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Home</a>
                    <a href="/pages/upload.html" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Upload</a>
                    <a href="/pages/queue.html" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Queue</a>
                </div>
            </div>
        </div>
    </nav>

    <main class="max-w-5xl mx-auto px-4 py-12">
        <div class="mb-4">
            <a href="/pages/queue.html" class="inline-flex items-center text-blue-600 hover:text-blue-700">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to Queue
            </a>
        </div>

        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div id="videoContainer" class="bg-black">
                <video id="videoPlayer" class="w-full" controls></video>
            </div>
            
            <div class="p-6">
                <h2 id="videoTitle" class="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
                <p id="videoInfo" class="text-gray-600"></p>
                
                <div id="errorMessage" class="hidden mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                    <p class="font-semibold">Error loading video</p>
                    <p class="text-sm mt-1"></p>
                </div>

                <div id="loadingMessage" class="mt-4 text-center py-8">
                    <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    <p class="text-gray-600 mt-3">Loading video...</p>
                </div>
            </div>
        </div>

        <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 class="font-semibold text-blue-900 mb-2">📺 Video Player Features</h3>
            <ul class="text-sm text-blue-800 space-y-1">
                <li>• Progressive streaming with HLS format</li>
                <li>• Adaptive bitrate for smooth playback</li>
                <li>• Seekable timeline with segment loading</li>
                <li>• Full playback controls (play, pause, volume, fullscreen)</li>
            </ul>
        </div>
    </main>

    <script>
        const urlParams = new URLSearchParams(window.location.search);
        const videoId = urlParams.get('id');
        const videoPlayer = document.getElementById('videoPlayer');
        const videoTitle = document.getElementById('videoTitle');
        const videoInfo = document.getElementById('videoInfo');
        const errorMessage = document.getElementById('errorMessage');
        const loadingMessage = document.getElementById('loadingMessage');

        if (!videoId) {
            errorMessage.classList.remove('hidden');
            errorMessage.querySelector('p.text-sm').textContent = 'No video ID provided.';
            loadingMessage.classList.add('hidden');
        } else {
            loadVideo(videoId);
        }

        async function loadVideo(id) {
            try {
                // Fetch video info from queue
                const queueResponse = await fetch('/queue-status');
                const queue = await queueResponse.json();
                const video = queue.find(v => v.id === id);

                if (!video) {
                    throw new Error('Video not found in queue');
                }

                if (video.status !== 'completed') {
                    throw new Error('Video is still processing. Please wait.');
                }

                videoTitle.textContent = video.originalName;
                videoInfo.textContent = 'Processed on ' + new Date(video.uploadTime).toLocaleString();

                // Load HLS video
                const videoSrc = '/processed/' + id + '/output.m3u8';

                if (Hls.isSupported()) {
                    const hls = new Hls({
                        debug: false,
                        enableWorker: true,
                        lowLatencyMode: true,
                    });
                    
                    hls.loadSource(videoSrc);
                    hls.attachMedia(videoPlayer);
                    
                    hls.on(Hls.Events.MANIFEST_PARSED, function() {
                        loadingMessage.classList.add('hidden');
                        videoPlayer.play().catch(e => console.log('Autoplay prevented:', e));
                    });

                    hls.on(Hls.Events.ERROR, function(event, data) {
                        if (data.fatal) {
                            errorMessage.classList.remove('hidden');
                            errorMessage.querySelector('p.text-sm').textContent = 'HLS loading error: ' + data.type;
                            loadingMessage.classList.add('hidden');
                        }
                    });
                } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
                    // Native HLS support (Safari)
                    videoPlayer.src = videoSrc;
                    videoPlayer.addEventListener('loadedmetadata', function() {
                        loadingMessage.classList.add('hidden');
                        videoPlayer.play().catch(e => console.log('Autoplay prevented:', e));
                    });
                } else {
                    throw new Error('HLS is not supported in this browser');
                }

            } catch (error) {
                console.error('Error loading video:', error);
                errorMessage.classList.remove('hidden');
                errorMessage.querySelector('p.text-sm').textContent = error.message;
                loadingMessage.classList.add('hidden');
            }
        }
    </script>
</body>
</html>`,
};

// Create HTML page files
Object.keys(HTML_PAGES).forEach((page) => {
  const filePath = path.join("./pages", `${page}.html`);
  fs.writeFileSync(filePath, HTML_PAGES[page]);
});

console.log("✅ HTML page files created in ./pages/");

// Helper function to parse multipart form data
function parseMultipartData(data, boundary) {
  const parts = [];
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  let start = 0;

  while (start < data.length) {
    let end = data.indexOf(boundaryBuffer, start);
    if (end === -1) break;

    if (start !== 0) {
      const part = data.slice(start, end);
      const headerEnd = part.indexOf("\r\n\r\n");

      if (headerEnd !== -1) {
        const headers = part.slice(0, headerEnd).toString();
        const content = part.slice(headerEnd + 4, part.length - 2);

        const nameMatch = headers.match(/name="([^"]+)"/);
        const filenameMatch = headers.match(/filename="([^"]+)"/);

        if (nameMatch) {
          parts.push({
            name: nameMatch[1],
            filename: filenameMatch ? filenameMatch[1] : null,
            data: content,
          });
        }
      }
    }

    start = end + boundaryBuffer.length;
  }

  return parts;
}

// Process video with FFmpeg
function processVideo(job) {
  currentProcessing = job;
  job.status = "processing";
  job.progress = 0;

  const inputPath = path.join(UPLOAD_DIR, job.filename);
  const outputDir = path.join(PROCESSED_DIR, job.id);

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, "output.m3u8");

  // const ffmpeg = spawn("ffmpeg", [
  //   "-y",
  //   "-hwaccel",
  //   "cuda",
  //   "-i",
  //   inputPath,
  //   "-c:v",
  //   "h264_nvenc",
  //   "-preset",
  //   "p7", // You can keep p7
  //   "-rc:v",
  //   "vbr", // ✅ Simpler RC mode (compatible)
  //   "-cq",
  //   "19",
  //   "-b:v",
  //   "10M",
  //   "-maxrate",
  //   "15M",
  //   "-bufsize",
  //   "20M",
  //   "-pix_fmt",
  //   "yuv420p",
  //   "-start_number",
  //   "0",
  //   "-hls_time",
  //   "10",
  //   "-hls_list_size",
  //   "0",
  //   "-f",
  //   "hls",
  //   outputPath,
  // ]);
  const ffmpeg = spawn("ffmpeg", [
    "-y", // Overwrite output files automatically
    "-hwaccel",
    "cuda",
    "-i",
    inputPath,

    // Video encoding
    "-c:v",
    "h264_nvenc",
    "-preset",
    "slow", // ✅ High-quality preset (compatible with older NVENC)
    "-rc:v",
    "constqp", // ✅ Constant quality mode (no bitrate limits)
    "-qp",
    "18", // ✅ Lower = better quality (range: 1–51)
    "-profile:v",
    "high",
    "-pix_fmt",
    "yuv420p",

    // Optional: If you still want to use VBR HQ (for newer GPUs)
    // "-rc:v", "vbr",
    // "-cq", "15",
    // "-b:v", "20M",
    // "-maxrate", "25M",
    // "-bufsize", "30M",

    // HLS output
    "-start_number",
    "0",
    "-hls_time",
    "10",
    "-hls_list_size",
    "0",
    "-f",
    "hls",
    outputPath,
  ]);

  // EDIT
  // const ffmpeg = spawn("ffmpeg", [
  //   "-i",
  //   inputPath,
  //   "-codec:",
  //   "copy",
  //   "-start_number",
  //   "0",
  //   "-hls_time",
  //   "10",
  //   "-hls_list_size",
  //   "0",
  //   "-f",
  //   "hls",
  //   outputPath,
  // ]);
  ffmpeg.stderr.on("data", (data) => {
    const message = data.toString();
    console.log(`[FFmpeg] ${message}`);
    // (keep your duration/progress parsing code here)
  });

  let duration = 0;

  ffmpeg.stderr.on("data", (data) => {
    const output = data.toString();

    // Extract duration
    const durationMatch = output.match(
      /Duration: (\d{2}):(\d{2}):(\d{2})\.(\d{2})/
    );
    if (durationMatch && duration === 0) {
      duration =
        parseInt(durationMatch[1]) * 3600 +
        parseInt(durationMatch[2]) * 60 +
        parseInt(durationMatch[3]);
    }

    // Extract current time
    const timeMatch = output.match(/time=(\d{2}):(\d{2}):(\d{2})\.(\d{2})/);
    if (timeMatch && duration > 0) {
      const currentTime =
        parseInt(timeMatch[1]) * 3600 +
        parseInt(timeMatch[2]) * 60 +
        parseInt(timeMatch[3]);
      job.progress = Math.min(Math.round((currentTime / duration) * 100), 100);
    }
  });

  ffmpeg.on("close", (code) => {
    if (code === 0) {
      job.status = "completed";
      job.progress = 100;
      console.log(`✅ Video ${job.id} processed successfully`);
    } else {
      job.status = "failed";
      console.error(`❌ Video ${job.id} processing failed with code ${code}`);
    }

    currentProcessing = null;
    processNextInQueue();
  });

  ffmpeg.on("error", (err) => {
    job.status = "failed";
    console.error(`❌ FFmpeg error for video ${job.id}:`, err);
    currentProcessing = null;
    processNextInQueue();
  });
}

// Process next video in queue
function processNextInQueue() {
  if (currentProcessing) return;

  const nextJob = queue.find((job) => job.status === "queued");
  if (nextJob) {
    console.log(`🎬 Processing video: ${nextJob.id}`);
    processVideo(nextJob);
  }
}

// Get MIME type
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".m3u8": "application/x-mpegURL",
    ".ts": "video/MP2T",
  };
  return mimeTypes[ext] || "application/octet-stream";
}

// Create HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  console.log(`${req.method} ${pathname}`);

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Route: GET /
  if (pathname === "/" && req.method === "GET") {
    const indexPath = path.join(__dirname, "index.html");
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath);
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(content);
    } else {
      res.writeHead(404);
      res.end("index.html not found");
    }
    return;
  }

  // Route: GET /pages/*.html
  if (pathname.startsWith("/pages/") && req.method === "GET") {
    const filePath = path.join(__dirname, pathname);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath);
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(content);
    } else {
      res.writeHead(404);
      res.end("Page not found");
    }
    return;
  }

  // Route: POST /upload
  if (pathname === "/upload" && req.method === "POST") {
    const contentType = req.headers["content-type"];
    if (!contentType || !contentType.includes("multipart/form-data")) {
      res.writeHead(400);
      res.end("Invalid content type");
      return;
    }

    const boundary = contentType.split("boundary=")[1];
    let data = Buffer.alloc(0);

    req.on("data", (chunk) => {
      data = Buffer.concat([data, chunk]);
    });

    req.on("end", () => {
      try {
        const parts = parseMultipartData(data, boundary);
        const videoPart = parts.find((p) => p.filename);

        if (!videoPart) {
          res.writeHead(400);
          res.end("No video file found");
          return;
        }

        const timestamp = Date.now();
        const ext = path.extname(videoPart.filename);
        const filename = `video_${timestamp}${ext}`;
        const filePath = path.join(UPLOAD_DIR, filename);

        fs.writeFileSync(filePath, videoPart.data);

        const job = {
          id: `video_${timestamp}`,
          filename: filename,
          originalName: videoPart.filename,
          status: "queued",
          progress: 0,
          uploadTime: timestamp,
        };

        queue.push(job);
        console.log(`📤 Video uploaded: ${videoPart.filename}`);

        // Start processing if no other video is being processed
        processNextInQueue();

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, jobId: job.id }));
      } catch (error) {
        console.error("Upload error:", error);
        res.writeHead(500);
        res.end("Upload failed");
      }
    });
    return;
  }

  // Route: GET /queue-status
  if (pathname === "/queue-status" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(queue));
    return;
  }

  // Route: GET /video-progress/:id
  if (pathname.startsWith("/video-progress/") && req.method === "GET") {
    const videoId = pathname.split("/").pop();
    const job = queue.find((j) => j.id === videoId);

    if (job) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ progress: job.progress, status: job.status }));
    } else {
      res.writeHead(404);
      res.end("Video not found");
    }
    return;
  }

  // Route: GET /processed/:videoId/*
  if (pathname.startsWith("/processed/") && req.method === "GET") {
    const filePath = path.join(__dirname, pathname);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath);
      const mimeType = getMimeType(filePath);
      res.writeHead(200, { "Content-Type": mimeType });
      res.end(content);
    } else {
      res.writeHead(404);
      res.end("File not found");
    }
    return;
  }

  // Route: GET /uploads/:filename
  if (pathname.startsWith("/uploads/") && req.method === "GET") {
    const filename = pathname.split("/").pop();
    const filePath = path.join(UPLOAD_DIR, filename);

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath);
      const mimeType = getMimeType(filePath);
      res.writeHead(200, { "Content-Type": mimeType });
      res.end(content);
    } else {
      res.writeHead(404);
      res.end("File not found");
    }
    return;
  }

  // 404 for all other routes
  res.writeHead(404);
  res.end("Not Found");
});

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/`);
  console.log(`📁 Upload directory: ${UPLOAD_DIR}`);
  console.log(`📁 Processed directory: ${PROCESSED_DIR}`);
  console.log(`\n🎬 Video Processing Server Ready!`);
  console.log(
    `   - Upload videos at: http://localhost:${PORT}/pages/upload.html`
  );
  console.log(`   - View queue at: http://localhost:${PORT}/pages/queue.html`);
  console.log(`\n⚠️  Make sure FFmpeg is installed: ffmpeg -version\n`);
});
