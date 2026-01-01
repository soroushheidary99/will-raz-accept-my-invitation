import React, { useState } from 'react';

const IntroScreen = ({ onNext, isActive }) => {
    const [runawayPos, setRunawayPos] = useState({ x: 0, y: 0 });
    const [showSadOverlay, setShowSadOverlay] = useState(false);
    const [showSadText, setShowSadText] = useState(false);

    const handleTooSoonClick = () => {
        setShowSadOverlay(true);
        // After overlay animation completes, show the text
        setTimeout(() => {
            setShowSadText(true);
        }, 1500);
    };

    const moveButton = () => {
        // Generate random direction to escape
        const angle = Math.random() * Math.PI * 2;
        const escapeDistance = 150 + Math.random() * 100;

        let newX = runawayPos.x + Math.cos(angle) * escapeDistance;
        let newY = runawayPos.y + Math.sin(angle) * escapeDistance;

        // Keep button within viewport bounds
        const maxX = window.innerWidth / 3;
        const maxY = window.innerHeight / 3;

        newX = Math.max(-maxX, Math.min(maxX, newX));
        newY = Math.max(-maxY, Math.min(maxY, newY));

        setRunawayPos({ x: newX, y: newY });
    };

    const handleTouchStart = (e) => {
        e.preventDefault(); // Prevent the sticky hover state on mobile
        moveButton();
    };

    return (
        <section 
            id="screen-intro" 
            className={`screen ${isActive ? 'active' : ''}`}
        >
            <div className="screen-content">
                <h1 className="intro-title">Raz The Cute...</h1>
                <p className="intro-subtitle">Voudrais-tu partager un petit café avec moi ? ☕</p>
                <p className="intro-subtitle-small">I have no idea what that means :/ AI said it's cute</p>
                <div className="intro-buttons">
                    <button className="btn btn-primary" id="btn-start" onClick={onNext}>
                        <span>I'm listening</span>
                    </button>
                    <div
                        style={{
                            transform: `translate(${runawayPos.x}px, ${runawayPos.y}px)`,
                            transition: 'transform 0.3s ease-out',
                            backgroundColor: 'rgba(231, 247, 246, 0)'
                        }}
                    >
                        <button
                            className="btn btn-secondary btn-runaway"
                            style={{
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                backgroundColor: 'rgba(231, 247, 246, 0.3)'
                            }}
                            onMouseEnter={moveButton}
                            onTouchStart={handleTouchStart}
                        >
                            <span>no, get a life dude</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Small corner text */}
            <span
                className="too-soon-text"
                onClick={handleTooSoonClick}
            >
                cute, but srsly it's too soon for a date.
            </span>

            {/* Sad overlay */}
            <div className={`sad-overlay ${showSadOverlay ? 'active' : ''}`}>
                <div className={`sad-content ${showSadText ? 'visible' : ''}`}>
                    <p className="sad-main-text">it's okkkkkk, I'm not sadddddd</p>
                    <p className="sad-sub-text">*sad soroush noises*</p>
                </div>
            </div>
        </section>
    );
};

export default IntroScreen;

