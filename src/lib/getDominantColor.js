// Helper function to convert a single RGB component to hex with padding
function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}

// Convert RGB triplet to hex string
function rgbToHex(r, g, b) {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// Get contrast color based on luminance
function getContrastColor(r, g, b) {
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? 'black' : 'white';
}

export async function getDominantColorFromUrl(imageUrl) {
    return new Promise((resolve, reject) => {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Create an image element
        const img = new Image();

        // Handle CORS issues
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            try {
                // Set canvas size to 1x1 to get average color
                canvas.width = 1;
                canvas.height = 1;

                // Draw the image scaled down to 1x1 pixel
                ctx.drawImage(img, 0, 0, 1, 1);

                // Get the pixel data
                const imageData = ctx.getImageData(0, 0, 1, 1);
                const [r, g, b] = imageData.data;

                resolve({
                    hex: rgbToHex(r, g, b),
                    rgb: { r, g, b },
                    rgba: (alpha = 1) => `rgba(${r}, ${g}, ${b}, ${alpha})`,
                    contrast: getContrastColor(r, g, b)
                });
            } catch (error) {
                reject(new Error('Failed to process image: ' + error.message));
            }
        };

        img.onerror = () => {
            reject(new Error('Failed to load image'));
        };

        // Load the image
        img.src = imageUrl;
    });
}

// Alternative version using fetch + canvas for better error handling
export async function getDominantColorFromUrlFetch(imageUrl) {
    try {
        // Fetch the image
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error('Failed to fetch image');

        // Create blob from response
        const blob = await response.blob();
        const imageObjectUrl = URL.createObjectURL(blob);

        try {
            const result = await getDominantColorFromUrl(imageObjectUrl);
            return result;
        } finally {
            // Clean up the object URL
            URL.revokeObjectURL(imageObjectUrl);
        }
    } catch (error) {
        throw new Error('Failed to get dominant color: ' + error.message);
    }
}