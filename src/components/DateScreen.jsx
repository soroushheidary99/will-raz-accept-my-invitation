import React, { useState, useMemo, useRef, useEffect } from 'react';
import './DateScreen.css';

// Hardcoded unavailable dates (YYYY-MM-DD format)
const UNAVAILABLE_DATES = [
    '2026-1-1',
    '2026-1-2',
    '2026-1-3',
    '2026-1-4',
    '2026-1-5',
    '2026-1-6',
];

const DateScreen = ({ onNext, isActive }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);
    const [isVertical, setIsVertical] = useState(window.innerWidth <= 768);
    const scrollContainerRef = useRef(null);
    const messageTimeoutRef = useRef(null);
    const validRangeRef = useRef({ start: 0, end: 0 });

    // Drag scroll state
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const hasDragged = useRef(false);

    // Helper to check if a date is unavailable
    const isDateUnavailable = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return UNAVAILABLE_DATES.includes(dateStr);
    };

    // Generate dates: 3 past days + today + 11 future days + 3 extra future days (for blur effect)
    const allDates = useMemo(() => {
        const result = [];
        const today = new Date();

        // 3 past days (will be blurred)
        for (let i = -3; i < 0; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            result.push({
                date,
                dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                dayNumber: date.getDate(),
                month: date.toLocaleDateString('en-US', { month: 'short' }),
                isToday: false,
                isPast: true,
                isFuture: false,
                isValid: false
            });
        }

        // Today + 11 future days (valid selection range = 12 days total)
        let validIdx = 0;
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const unavailable = isDateUnavailable(date);
            result.push({
                date,
                dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                dayNumber: date.getDate(),
                month: date.toLocaleDateString('en-US', { month: 'short' }),
                isToday: i === 0,
                isPast: false,
                isFuture: false,
                isUnavailable: unavailable,
                isValid: !unavailable,
                validIndex: unavailable ? -1 : validIdx++
            });
        }

        // 3 extra future days (will be blurred)
        for (let i = 12; i < 15; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            result.push({
                date,
                dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                dayNumber: date.getDate(),
                month: date.toLocaleDateString('en-US', { month: 'short' }),
                isToday: false,
                isPast: false,
                isFuture: true,
                isValid: false
            });
        }

        return result;
    }, []);

    // Valid dates only (for selection)
    const validDates = useMemo(() => allDates.filter(d => d.isValid), [allDates]);

    const showMessage = (text, type) => {
        if (messageTimeoutRef.current) {
            clearTimeout(messageTimeoutRef.current);
        }
        setMessage(text);
        setMessageType(type);
        messageTimeoutRef.current = setTimeout(() => {
            setMessage(null);
            setMessageType(null);
        }, 2000);
    };

    // Drag scroll handlers (desktop only)
    const handleMouseDown = (e) => {
        const container = scrollContainerRef.current;
        if (!container || window.innerWidth <= 768) return;

        isDragging.current = true;
        hasDragged.current = false;
        startX.current = e.pageX - container.offsetLeft;
        scrollLeft.current = container.scrollLeft;
        container.style.cursor = 'grabbing';
        container.style.userSelect = 'none';
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        e.preventDefault();

        const container = scrollContainerRef.current;
        if (!container) return;

        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX.current) * 1.5; // Scroll speed multiplier

        // Mark as dragged if moved more than 5px
        if (Math.abs(x - startX.current) > 5) {
            hasDragged.current = true;
        }

        container.scrollLeft = scrollLeft.current - walk;
    };

    const handleMouseUp = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        isDragging.current = false;
        container.style.cursor = 'grab';
        container.style.userSelect = '';

        // Reset hasDragged after a short delay to allow click to check it
        setTimeout(() => {
            hasDragged.current = false;
        }, 50);
    };

    const handleMouseLeave = () => {
        if (isDragging.current) {
            handleMouseUp();
        }
    };

    
    // Track window resize for vertical/horizontal mode
    useEffect(() => {
        const handleResize = () => setIsVertical(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Scroll to today on mount
    useEffect(() => {
        if (isActive && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const todayElement = container.querySelector('.timeline-node.today');
            if (todayElement) {
                if (isVertical) {
                    const offsetTop = todayElement.offsetTop - container.clientHeight / 3;
                    container.scrollTop = offsetTop;
                } else {
                    const offsetLeft = todayElement.offsetLeft - container.clientWidth / 3;
                    container.scrollLeft = offsetLeft;
                }
            }
        }
    }, [isActive, isVertical]);

    const handleDateSelect = (dateInfo) => {
        // Prevent selection if user was dragging
        if (hasDragged.current) return;

        if (!dateInfo.isValid) {
            if (dateInfo.isPast) {
                showMessage("I wish I had a time machine too...", "past");
            } else if (dateInfo.isFuture) {
                showMessage("bru it's not a marraige proposal just pick a closer date", "future");
            } else if (dateInfo.isUnavailable) {
                showMessage("Sorry, I'm not available on this day", "unavailable");
            }
            return;
        }
        setSelectedIndex(dateInfo.validIndex);
        setMessage(null);
    };

    const handleContinue = () => {
        const selected = validDates[selectedIndex];
        onNext(selected.date);
    };

    return (
        <section id="screen-date" className={`screen ${isActive ? 'active' : ''}`}>
            <div className="screen-content date-screen-content">
                {/* Timeline scroll area */}
                <div
                    className="date-scroll-container"
                    ref={scrollContainerRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="date-timeline">
                        {allDates.map((dateInfo, index) => (
                            <div
                                key={index}
                                className={`timeline-node ${dateInfo.isValid && selectedIndex === dateInfo.validIndex ? 'selected' : ''} ${dateInfo.isToday ? 'today' : ''} ${dateInfo.isPast ? 'past-node' : ''} ${dateInfo.isFuture ? 'future-node' : ''} ${dateInfo.isUnavailable ? 'unavailable-node' : ''}`}
                                onClick={() => handleDateSelect(dateInfo)}
                            >
                                {dateInfo.isToday && <span className="today-label">Today</span>}
                                {(!dateInfo.isToday && isVertical) && <div className="node-dot"></div>}
                                <div className={`node-content ${dateInfo.isToday ? isVertical ? 'ml-2' : '' : ''}`}>
                                    <span className="node-day">{dateInfo.dayName}</span>
                                    <span className="node-date">{dateInfo.dayNumber}</span>
                                    <span className="node-month">{dateInfo.month}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content area: header + footer */}
                <div className="date-content">
                    <div className="date-header">
                        <h2 className="screen-title">Which day works for you?</h2>
                    </div>

                    <div className="date-footer">
                        <div className="selected-date-display">
                            <span className="selected-day">{validDates[selectedIndex]?.dayName}</span>
                            <span className="selected-full">
                                {validDates[selectedIndex]?.date.toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>

                        <button className="btn btn-primary" onClick={handleContinue}>
                            <span>Continue</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Snackbar overlay */}
            <div className={`snackbar-overlay ${message ? 'visible' : ''}`}>
                <div className={`snackbar-message ${messageType || ''}`}>
                    <p>{message}</p>
                </div>
            </div>
        </section>
    );
};

export default DateScreen;
