import React, { useState } from 'react';

const TransportScreen = ({ onNext, isActive }) => {
    const [selectedTransport, setSelectedTransport] = useState(null);

    const handleTransportClick = (transport) => {
        setSelectedTransport(transport);
        
        // Small delay for visual feedback, then advance
        setTimeout(() => {
            onNext(transport);
        }, 400);
    };

    return (
        <section id="screen-transport" className={`screen ${isActive ? 'active' : ''}`}>
            <div className="screen-content">
                <h2 className="screen-title">One more thing...</h2>
                <p className="screen-subtitle">How would you like to get there?</p>
                <div className="transport-options">
                    <button 
                        className={`transport-card ${selectedTransport === 'pickup' ? 'selected' : ''}`}
                        data-transport="pickup"
                        onClick={() => handleTransportClick('pickup')}
                    >
                        <span className="transport-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M19 17h2l.64-2.54a6 6 0 0 0-1.26-5.5L18 6H6L3.62 8.96a6 6 0 0 0-1.26 5.5L3 17h2m14 0H5m14 0a2 2 0 1 1-4 0m4 0a2 2 0 1 0-4 0m-6 0a2 2 0 1 1-4 0m4 0a2 2 0 1 0-4 0"/>
                            </svg>
                        </span>
                        <span className="transport-title">I'll pick you up</span>
                        <span className="transport-desc">I'll be there at your door</span>
                    </button>
                    <button 
                        className={`transport-card ${selectedTransport === 'meet' ? 'selected' : ''}`}
                        data-transport="meet"
                        onClick={() => handleTransportClick('meet')}
                    >
                        <span className="transport-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M17.657 16.657L13.414 20.9a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"/>
                                <circle cx="12" cy="11" r="3"/>
                            </svg>
                        </span>
                        <span className="transport-title">Let's meet there</span>
                        <span className="transport-desc">I'll be waiting for you</span>
                    </button>
                </div>
                <p className="transport-note">Either way, I can't wait</p>
            </div>
        </section>
    );
};

export default TransportScreen;

