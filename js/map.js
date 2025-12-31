/**
 * Interactive Map with Restaurant Pins
 * Uses Leaflet.js with OpenStreetMap
 */

class RestaurantMap {
    constructor() {
        this.map = null;
        this.markers = [];
        this.selectedRestaurant = null;
        this.card = document.getElementById('restaurant-card');
        this.cardImg = document.getElementById('card-img');
        this.cardName = document.getElementById('card-name');
        this.cardDescription = document.getElementById('card-description');
        this.closeBtn = document.getElementById('card-close');
        this.selectBtn = document.getElementById('btn-select-place');
    }

    init() {
        // Initialize Leaflet map
        this.map = L.map('map', {
            center: APP_CONFIG.mapCenter,
            zoom: APP_CONFIG.mapZoom,
            zoomControl: true,
            scrollWheelZoom: true
        });

        // Add OpenStreetMap tiles with a cleaner style
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(this.map);

        // Add restaurant markers
        this.addRestaurantMarkers();

        // Setup event listeners
        this.setupEventListeners();
    }

    addRestaurantMarkers() {
        APP_CONFIG.restaurants.forEach(restaurant => {
            // Create custom marker icon
            const markerIcon = L.divIcon({
                className: 'custom-marker-wrapper',
                html: `<div class="custom-marker" data-id="${restaurant.id}"></div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });

            const marker = L.marker(restaurant.coords, { icon: markerIcon })
                .addTo(this.map);

            // Store reference
            marker.restaurantData = restaurant;
            this.markers.push(marker);

            // Hover and click events
            marker.on('mouseover', () => this.showCard(restaurant));
            marker.on('click', () => this.showCard(restaurant));
        });
    }

    setupEventListeners() {
        // Close card button
        this.closeBtn.addEventListener('click', () => this.hideCard());

        // Select restaurant button
        this.selectBtn.addEventListener('click', () => {
            if (this.selectedRestaurant) {
                this.confirmSelection(this.selectedRestaurant);
            }
        });

        // Close card when clicking on map (not on markers)
        this.map.on('click', (e) => {
            // Check if click was on a marker
            const clickedOnMarker = this.markers.some(marker => {
                const markerLatLng = marker.getLatLng();
                const clickLatLng = e.latlng;
                return markerLatLng.equals(clickLatLng);
            });

            if (!clickedOnMarker) {
                this.hideCard();
            }
        });
    }

    showCard(restaurant) {
        this.selectedRestaurant = restaurant;

        // Update card content
        this.cardName.textContent = restaurant.name;
        this.cardDescription.textContent = restaurant.description;

        // Handle image
        const img = new Image();
        img.onload = () => {
            this.cardImg.src = restaurant.image;
        };
        img.onerror = () => {
            this.cardImg.src = PLACEHOLDER_IMAGE;
        };
        img.src = restaurant.image;

        // Show card
        this.card.classList.remove('hidden');
        this.card.classList.add('visible');

        // Update marker styles
        this.updateMarkerStyles(restaurant.id);

        // Pan map to show marker and card
        this.map.panTo(restaurant.coords, { animate: true });
    }

    hideCard() {
        this.card.classList.remove('visible');
        this.card.classList.add('hidden');
        this.selectedRestaurant = null;

        // Reset marker styles
        this.updateMarkerStyles(null);
    }

    updateMarkerStyles(activeId) {
        document.querySelectorAll('.custom-marker').forEach(marker => {
            const markerId = parseInt(marker.dataset.id);
            marker.classList.remove('active');

            if (markerId === activeId) {
                marker.classList.add('active');
            }
        });
    }

    confirmSelection(restaurant) {
        // Mark as selected
        document.querySelectorAll('.custom-marker').forEach(marker => {
            marker.classList.remove('selected');
            if (parseInt(marker.dataset.id) === restaurant.id) {
                marker.classList.add('selected');
            }
        });

        // Trigger custom event for app.js to handle
        const event = new CustomEvent('restaurantSelected', {
            detail: restaurant
        });
        document.dispatchEvent(event);
    }

    getSelectedRestaurant() {
        return this.selectedRestaurant;
    }

    // Force map to recalculate size (needed when shown from hidden state)
    invalidateSize() {
        if (this.map) {
            setTimeout(() => {
                this.map.invalidateSize();
            }, 100);
        }
    }
}

// Initialize on DOM ready
let restaurantMap;
document.addEventListener('DOMContentLoaded', () => {
    restaurantMap = new RestaurantMap();
});
