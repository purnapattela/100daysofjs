// Client-side helper functions and utilities

// Format file size to human readable format
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Format timestamp to readable date
function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Show notification message
function showNotification(message, type = 'info') {
    const colors = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800'
    };
    
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-4 rounded-lg border ${colors[type]} shadow-lg z-50 animate-slide-in`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Validate video file
function validateVideoFile(file) {
    const validExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
    const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
    
    const ext = file.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(ext)) {
        return { valid: false, error: 'Invalid file type. Supported: MP4, MOV, AVI, MKV, WebM' };
    }
    
    if (file.size > maxSize) {
        return { valid: false, error: 'File too large. Maximum size: 2GB' };
    }
    
    return { valid: true };
}

// Upload file with progress tracking
async function uploadFile(file, progressCallback) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('video', file);
        
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                if (progressCallback) {
                    progressCallback(percent);
                }
            }
        });
        
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                } catch (e) {
                    resolve({ success: true });
                }
            } else {
                reject(new Error('Upload failed with status: ' + xhr.status));
            }
        });
        
        xhr.addEventListener('error', () => {
            reject(new Error('Network error during upload'));
        });
        
        xhr.addEventListener('abort', () => {
            reject(new Error('Upload cancelled'));
        });
        
        xhr.open('POST', '/upload');
        xhr.send(formData);
    });
}

// Fetch queue status
async function fetchQueueStatus() {
    try {
        const response = await fetch('/queue-status');
        if (!response.ok) {
            throw new Error('Failed to fetch queue status');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching queue:', error);
        return [];
    }
}

// Fetch video progress
async function fetchVideoProgress(videoId) {
    try {
        const response = await fetch(`/video-progress/${videoId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch video progress');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching progress:', error);
        return null;
    }
}

// Get status badge HTML
function getStatusBadge(status) {
    const badges = {
        queued: '<span class="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">QUEUED</span>',
        processing: '<span class="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">PROCESSING</span>',
        completed: '<span class="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">COMPLETED</span>',
        failed: '<span class="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">FAILED</span>'
    };
    return badges[status] || badges.queued;
}

// Get status icon
function getStatusIcon(status) {
    const icons = {
        queued: '⏳',
        processing: '⚙️',
        completed: '✅',
        failed: '❌'
    };
    return icons[status] || '📄';
}

// Progress bar component
function createProgressBar(progress) {
    return `
        <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style="width: ${progress}%"></div>
        </div>
        <p class="text-xs text-gray-500 mt-1">${progress}% complete</p>
    `;
}

// Initialize HLS player
function initializeHLSPlayer(videoElement, manifestUrl) {
    if (typeof Hls !== 'undefined' && Hls.isSupported()) {
        const hls = new Hls({
            debug: false,
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
        });
        
        hls.loadSource(manifestUrl);
        hls.attachMedia(videoElement);
        
        return new Promise((resolve, reject) => {
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                resolve(hls);
            });
            
            hls.on(Hls.Events.ERROR, function(event, data) {
                if (data.fatal) {
                    reject(new Error(`HLS Error: ${data.type} - ${data.details}`));
                }
            });
        });
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        videoElement.src = manifestUrl;
        return Promise.resolve(null);
    } else {
        return Promise.reject(new Error('HLS is not supported in this browser'));
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatBytes,
        formatDateTime,
        showNotification,
        validateVideoFile,
        uploadFile,
        fetchQueueStatus,
        fetchVideoProgress,
        getStatusBadge,
        getStatusIcon,
        createProgressBar,
        initializeHLSPlayer
    };
}
