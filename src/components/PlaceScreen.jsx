import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { APP_CONFIG, PLACEHOLDER_IMAGE } from '../data';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MapUpdater = ({ isActive }) => {
    const map = useMap();
    
    useEffect(() => {
        if (isActive) {
            setTimeout(() => {
                map.invalidateSize();
            }, 100);
        }
    }, [isActive, map]);

    return null;
};

const PlaceScreen = ({ onNext, isActive }) => {
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [cardVisible, setCardVisible] = useState(false);
    const [cardImage, setCardImage] = useState('');

    useEffect(() => {
        // Create custom marker icons with pin and name
        const createCustomIcon = (restaurant) => {
            return L.divIcon({
                className: 'custom-marker-wrapper',
                html: `
                    <div class="custom-marker" data-id="${restaurant.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" class="pin-icon">
                            <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                        </svg>
                        <span class="marker-label">${restaurant.name}</span>
                    </div>
                `,
                iconSize: [100, 50],
                iconAnchor: [50, 32]
            });
        };

        // Store icons for each restaurant
        APP_CONFIG.restaurants.forEach(restaurant => {
            restaurant.customIcon = createCustomIcon(restaurant);
        });
    }, []);

    const showCard = (restaurant) => {
        setSelectedRestaurant(restaurant);
        
        // Handle image loading
        const img = new Image();
        img.onload = () => {
            setCardImage(restaurant.image);
        };
        img.onerror = () => {
            setCardImage(PLACEHOLDER_IMAGE);
        };
        img.src = restaurant.image;

        setCardVisible(true);
        updateMarkerStyles(restaurant.id);
    };

    const hideCard = () => {
        setCardVisible(false);
        setSelectedRestaurant(null);
        updateMarkerStyles(null);
    };

    const updateMarkerStyles = (activeId) => {
        document.querySelectorAll('.custom-marker').forEach(marker => {
            const markerId = parseInt(marker.dataset.id);
            marker.classList.remove('active');

            if (markerId === activeId) {
                marker.classList.add('active');
            }
        });
    };

    const confirmSelection = (restaurant) => {
        document.querySelectorAll('.custom-marker').forEach(marker => {
            marker.classList.remove('selected');
            if (parseInt(marker.dataset.id) === restaurant.id) {
                marker.classList.add('selected');
            }
        });

        onNext(restaurant);
    };

    const handleMarkerClick = (restaurant) => {
        showCard(restaurant);
    };

    if (!isActive) {
        return (
            <section id="screen-place" className="screen">
                <div className="screen-content screen-content-map"></div>
            </section>
        );
    }

    return (
        <section id="screen-place" className={`screen ${isActive ? 'active' : ''}`}>
            <div className="screen-content screen-content-map">
                <h2 className="screen-title">Where should we go?</h2>
                <p className="screen-subtitle">Hover over a pin to see more, click to select</p>
                <div className="map-container">
                    <MapContainer
                        center={APP_CONFIG.mapCenter}
                        zoom={APP_CONFIG.mapZoom}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={true}
                        scrollWheelZoom={true}
                    >
                        <MapUpdater isActive={isActive} />
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            subdomains="abcd"
                            maxZoom={19}
                        />
                        {APP_CONFIG.restaurants.map(restaurant => (
                            <Marker
                                key={restaurant.id}
                                position={restaurant.coords}
                                icon={restaurant.customIcon}
                                eventHandlers={{
                                    click: () => handleMarkerClick(restaurant),
                                    mouseover: () => showCard(restaurant),
                                }}
                            />
                        ))}
                    </MapContainer>
                </div>

                {/* Restaurant info card */}
                <div 
                    id="restaurant-card" 
                    className={`restaurant-card ${cardVisible ? 'visible' : 'hidden'}`}
                    onMouseLeave={hideCard}
                >
                    <button className="card-close" id="card-close" onClick={hideCard}>&times;</button>
                    <div className="card-image">
                        <img id="card-img" src={cardImage || PLACEHOLDER_IMAGE} alt="Restaurant" />
                    </div>
                    <div className="card-content">
                        {selectedRestaurant?.gmapLink && (
                            <a 
                                href={selectedRestaurant.gmapLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="gmap-link"
                                title="Open in Google Maps"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                </svg>
                            </a>
                        )}
                        <h3 id="card-name">{selectedRestaurant?.name}</h3>
                        <p id="card-description">{selectedRestaurant?.description}</p>
                        <button 
                            className="btn btn-secondary" 
                            id="btn-select-place"
                            onClick={() => selectedRestaurant && confirmSelection(selectedRestaurant)}
                        >
                            <span>Let's go here</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PlaceScreen;

