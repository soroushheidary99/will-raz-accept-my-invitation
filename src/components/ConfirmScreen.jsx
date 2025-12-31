import React, { useEffect, useCallback } from 'react';

const ConfirmScreen = ({ data, isActive }) => {
    const transportText = data.transport === 'pickup'
        ? "You'll be picked up"
        : "We'll meet there";

    const formatDate = (date) => {
        if (!date) return '';
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    };

    const isMobile = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    const buildMessage = useCallback(() => {
        const dateStr = formatDate(data.date);
        const timeStr = data.time?.formatted || 'sometime';
        const placeStr = data.place?.name || 'somewhere mysterious';
        
        return `Hey! Just confirmed our date:

📅 ${dateStr} at ${timeStr}
📍 ${placeStr}
🚗 ${transportText}

See you there!`;
    }, [data, transportText]);

    const openContact = useCallback(() => {
        const message = buildMessage();
        
        if (isMobile()) {
            // Open Telegram on mobile
            const telegramUrl = `https://t.me/soroushheidary?text=${encodeURIComponent(message)}`;
            window.open(telegramUrl, '_blank');
        } else {
            // Open email on desktop
            const subject = encodeURIComponent("🎉 It's a Date! (Official Confirmation)");
            const body = encodeURIComponent(message);
            const mailtoUrl = `mailto:soroush.h.dev@gmail.com?subject=${subject}&body=${body}`;
            window.location.href = mailtoUrl;
        }
    }, [buildMessage]);

    useEffect(() => {
        if (isActive) {
            // Small delay to let the screen transition complete
            const timer = setTimeout(() => {
                openContact();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isActive, openContact]);

    return (
        <section id="screen-confirm" className={`screen ${isActive ? 'active' : ''}`}>
            <div className="screen-content">
                <h2 className="confirm-title">It's a date.</h2>
                <div className="confirm-summary">
                    <div className="confirm-item">
                        <span className="confirm-label">Date</span>
                        <span className="confirm-value" id="confirm-date">{formatDate(data.date)}</span>
                    </div>
                    <div className="confirm-item">
                        <span className="confirm-label">Time</span>
                        <span className="confirm-value" id="confirm-time">{data.time?.formatted || ''}</span>
                    </div>
                    <div className="confirm-item">
                        <span className="confirm-label">Where</span>
                        <span className="confirm-value" id="confirm-place">{data.place?.name || ''}</span>
                    </div>
                    <div className="confirm-item">
                        <span className="confirm-label">How</span>
                        <span className="confirm-value" id="confirm-transport">{transportText}</span>
                    </div>
                </div>
                <button 
                    className="btn btn-primary confirm-send-btn"
                    onClick={openContact}
                >
                    Let me know
                </button>
            </div>
        </section>
    );
};

export default ConfirmScreen;

