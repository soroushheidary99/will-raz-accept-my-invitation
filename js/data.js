/**
 * Restaurant Data Configuration
 *
 * Fill in your restaurant details below:
 * - name: Restaurant name
 * - coords: [latitude, longitude] - get from Google Maps
 * - description: Brief description/vibe
 * - image: Path to image in assets/images/ folder
 */

const APP_CONFIG = {
    // Map center coordinates (your city)
    // Get from Google Maps: right-click on location -> "What's here?"
    mapCenter: [40.7128, -74.0060], // Example: New York City
    mapZoom: 13,

    // Your restaurants (3-4 recommended)
    restaurants: [
        {
            id: 1,
            name: "Restaurant One",
            coords: [40.7580, -73.9855], // Replace with actual coordinates
            description: "A cozy spot with amazing atmosphere and delicious food.",
            image: "assets/images/restaurant1.jpg"
        },
        {
            id: 2,
            name: "Restaurant Two",
            coords: [40.7484, -73.9857], // Replace with actual coordinates
            description: "Known for their incredible dishes and warm ambiance.",
            image: "assets/images/restaurant2.jpg"
        },
        {
            id: 3,
            name: "Restaurant Three",
            coords: [40.7614, -73.9776], // Replace with actual coordinates
            description: "Perfect for a special evening with great views.",
            image: "assets/images/restaurant3.jpg"
        },
        {
            id: 4,
            name: "Restaurant Four",
            coords: [40.7527, -73.9772], // Replace with actual coordinates
            description: "An intimate setting with exquisite cuisine.",
            image: "assets/images/restaurant4.jpg"
        }
    ]
};

// Placeholder image for restaurants without images
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23e8ede5' width='400' height='300'/%3E%3Ctext fill='%237d9b76' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EAdd your image%3C/text%3E%3C/svg%3E";
