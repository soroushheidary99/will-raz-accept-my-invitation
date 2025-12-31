/**
 * Restaurant Data Configuration
 *
 * Fill in your restaurant details below:
 * - name: Restaurant name
 * - coords: [latitude, longitude] - get from Google Maps
 * - description: Brief description/vibe
 * - image: Path to image in assets/images/ folder
 */

export const APP_CONFIG = {
    // Map center coordinates (Tehran)
    mapCenter: [35.707, 51.408],
    mapZoom: 14,

    // Your restaurants
    restaurants: [
        {
            id: 1,
            name: "Platform 9¾ Cafe",
            coords: [35.715136, 51.4197928],
            description: "Good environment, good drinks. Might get crowded.",
            image: "/assets/images/3-4 caf.jpg",
            gmapLink: "https://maps.app.goo.gl/PiDoHqQ1jGyZnzEM8"
        },
        {
            id: 2,
            name: "Le Bistrot Pop Cafe",
            coords: [35.7046924, 51.4167626],
            description: "Good overall.",
            image: "/assets/images/le bistro.jpg",
            gmapLink: "https://maps.app.goo.gl/CHzajXAF5iVbdK4YA"
        },
        {
            id: 3,
            name: "Sialk Cafe",
            coords: [35.7060954, 51.390303],
            description: "Has board games. Didn't like the food though.",
            image: "/assets/images/sialk.jpg",
            gmapLink: "https://maps.app.goo.gl/aF7tivxCS9eddXBh9"
        },
        {
            id: 4,
            name: "Babel Café",
            coords: [35.7077147, 51.397849],
            description: "Cool items there. Might get crowded.",
            image: "/assets/images/babel.jpg",
            gmapLink: "https://maps.app.goo.gl/mYYG2uEWn8TmZGWP6"
        },
        {
            id: 5,
            name: "Cafe Diamond",
            coords: [35.703529, 51.4160242],
            description: "Good in general.",
            image: "/assets/images/diamond.jpg",
            gmapLink: "https://maps.app.goo.gl/SoCvZCMPWM43YLs39"
        },
        {
            id: 6,
            name: "Sangaki Bakery",
            coords: [35.704623, 51.4228536],
            description: "Just a sangaki :D Hot fresh noon!",
            image: "/assets/images/sangaki.jpg",
            gmapLink: "https://maps.app.goo.gl/YnTE1L1ii2QNCjWw8"
        }
    ]
};

// Placeholder image for restaurants without images
export const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23e8ede5' width='400' height='300'/%3E%3Ctext fill='%237d9b76' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EAdd your image%3C/text%3E%3C/svg%3E";

