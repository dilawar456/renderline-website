// =============================================
// CLOUDINARY CONFIGURATION
// =============================================

const CLOUDINARY_CONFIG = {
    cloudName: 'dzp70azv3',
    apiKey: '124754412421972',
    // Note: API Secret should NOT be exposed in frontend code
    // It's only needed for server-side uploads
    uploadPreset: 'renderline_unsigned' // You'll create this in Cloudinary dashboard
};

// =============================================
// CLOUDINARY HELPER FUNCTIONS
// =============================================

// Get optimized image URL
function getCloudinaryUrl(publicId, options = {}) {
    const { width, height, quality = 'auto', format = 'auto' } = options;

    let transformations = `f_${format},q_${quality}`;
    if (width) transformations += `,w_${width}`;
    if (height) transformations += `,h_${height}`;

    return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformations}/${publicId}`;
}

// Get thumbnail URL
function getCloudinaryThumbnail(publicId, size = 200) {
    return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/w_${size},h_${size},c_thumb/${publicId}`;
}

// Upload image using unsigned preset (need to create in Cloudinary dashboard)
async function uploadToCloudinary(file, folder = 'portfolio') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', folder);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
            { method: 'POST', body: formData }
        );

        const data = await response.json();

        if (data.error) {
            return { error: data.error };
        }

        return {
            data: {
                url: data.secure_url,
                publicId: data.public_id,
                thumbnail: getCloudinaryThumbnail(data.public_id)
            }
        };
    } catch (error) {
        return { error: { message: error.message } };
    }
}

// =============================================
// YOUTUBE HELPER FUNCTIONS
// =============================================

// Extract video ID from YouTube URL
function getYouTubeVideoId(url) {
    if (!url) return null;

    // Handle different YouTube URL formats
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
        /^([a-zA-Z0-9_-]{11})$/ // Just the ID
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }

    return null;
}

// Get YouTube embed URL
function getYouTubeEmbedUrl(videoIdOrUrl) {
    const videoId = getYouTubeVideoId(videoIdOrUrl) || videoIdOrUrl;
    return `https://www.youtube.com/embed/${videoId}`;
}

// Get YouTube thumbnail
function getYouTubeThumbnail(videoIdOrUrl, quality = 'maxresdefault') {
    const videoId = getYouTubeVideoId(videoIdOrUrl) || videoIdOrUrl;
    // quality options: default, mqdefault, hqdefault, sddefault, maxresdefault
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

// Create YouTube embed HTML
function createYouTubeEmbed(videoIdOrUrl, options = {}) {
    const videoId = getYouTubeVideoId(videoIdOrUrl) || videoIdOrUrl;
    const { width = '100%', height = '400', autoplay = false } = options;

    let src = `https://www.youtube.com/embed/${videoId}?rel=0`;
    if (autoplay) src += '&autoplay=1';

    return `<iframe 
        width="${width}" 
        height="${height}" 
        src="${src}" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
    </iframe>`;
}

console.log('✅ Cloudinary & YouTube config loaded');
console.log('   Cloud Name:', CLOUDINARY_CONFIG.cloudName);
