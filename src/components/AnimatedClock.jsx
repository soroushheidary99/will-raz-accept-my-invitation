import React, { useRef, useEffect, useCallback } from 'react';
import { useStarsAnimation } from '../hooks/useStarsAnimation';
import './AnimatedClock.css';

const AnimatedClock = ({
    hour,
    minute,
    period,
    onPeriodToggle,
    onHourChange,
    onMinuteChange
}) => {
    const clockRef = useRef(null);
    const hourHandRef = useRef(null);
    const minuteHandRef = useRef(null);
    const isDraggingRef = useRef(false);
    const activeHandRef = useRef(null);
    const prevAngleRef = useRef(null);
    const accumulatedDeltaRef = useRef(0);

    const isNight = period === 'PM';
    const starsCanvasRef = useStarsAnimation(isNight);

    // Update clock hands rotation
    useEffect(() => {
        if (hourHandRef.current) {
            const hourAngle = (hour % 12) * 30 + (minute / 60) * 30;
            hourHandRef.current.style.transform = `rotate(${hourAngle}deg)`;
        }
        if (minuteHandRef.current) {
            const minuteAngle = minute * 6;
            minuteHandRef.current.style.transform = `rotate(${minuteAngle}deg)`;
        }
    }, [hour, minute]);

    const getAngleFromEvent = useCallback((e) => {
        if (!clockRef.current) return 0;

        const rect = clockRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let clientX, clientY;
        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const dx = clientX - centerX;
        const dy = clientY - centerY;

        let angle = Math.atan2(dx, -dy) * (180 / Math.PI);
        if (angle < 0) angle += 360;

        return angle;
    }, []);

    const startDrag = useCallback((e, handType) => {
        e.preventDefault();
        e.stopPropagation();
        isDraggingRef.current = true;
        activeHandRef.current = handType;
        prevAngleRef.current = getAngleFromEvent(e);
        accumulatedDeltaRef.current = 0;

        const hand = handType === 'hour' ? hourHandRef.current : minuteHandRef.current;
        if (hand) hand.classList.add('active');
    }, [getAngleFromEvent]);

    const drag = useCallback((e) => {
        if (!isDraggingRef.current || !activeHandRef.current) return;
        e.preventDefault();

        const angle = getAngleFromEvent(e);
        const prevAngle = prevAngleRef.current;
        
        if (prevAngle === null) {
            prevAngleRef.current = angle;
            return;
        }

        // Calculate the angle delta, handling wraparound
        let delta = angle - prevAngle;
        
        // Handle crossing the 0/360 boundary
        if (delta > 180) {
            delta -= 360;
        } else if (delta < -180) {
            delta += 360;
        }

        prevAngleRef.current = angle;
        accumulatedDeltaRef.current += delta;

        const threshold = 30; // 30 degrees per step

        if (activeHandRef.current === 'hour') {
            // Each hour = 30 degrees
            while (accumulatedDeltaRef.current >= threshold) {
                let newHour = hour + 1;
                if (newHour > 12) newHour = 1;
                onHourChange(newHour);
                accumulatedDeltaRef.current -= threshold;
            }
            while (accumulatedDeltaRef.current <= -threshold) {
                let newHour = hour - 1;
                if (newHour < 1) newHour = 12;
                onHourChange(newHour);
                accumulatedDeltaRef.current += threshold;
            }
        } else {
            // Each 5 minutes = 30 degrees
            while (accumulatedDeltaRef.current >= threshold) {
                let newMinute = minute + 5;
                if (newMinute >= 60) newMinute = 0;
                onMinuteChange(newMinute);
                accumulatedDeltaRef.current -= threshold;
            }
            while (accumulatedDeltaRef.current <= -threshold) {
                let newMinute = minute - 5;
                if (newMinute < 0) newMinute = 55;
                onMinuteChange(newMinute);
                accumulatedDeltaRef.current += threshold;
            }
        }
    }, [getAngleFromEvent, onHourChange, onMinuteChange, hour, minute]);

    const endDrag = useCallback(() => {
        if (activeHandRef.current) {
            const hand = activeHandRef.current === 'hour' ? hourHandRef.current : minuteHandRef.current;
            if (hand) hand.classList.remove('active');
        }
        isDraggingRef.current = false;
        activeHandRef.current = null;
        prevAngleRef.current = null;
        accumulatedDeltaRef.current = 0;
    }, []);

    const handleClockClick = useCallback((e) => {
        // Check if clicking on the celestial body (sun/moon)
        if (e.target.classList.contains('celestial-body')) {
            onPeriodToggle();
            return;
        }

        // Otherwise start minute drag
        if (e.target === clockRef.current ||
            e.target.classList.contains('clock-scene') ||
            e.target.classList.contains('clouds')) {
            startDrag(e, 'minute');
        }
    }, [onPeriodToggle, startDrag]);

    // Set up drag listeners
    useEffect(() => {
        const handleMouseMove = (e) => drag(e);
        const handleMouseUp = () => endDrag();
        const handleTouchMove = (e) => drag(e);
        const handleTouchEnd = () => endDrag();

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [drag, endDrag]);

    // Generate hour markers
    const hourMarkers = [];
    for (let i = 0; i < 12; i++) {
        const angle = i * 30;
        const isMajor = i % 3 === 0;
        hourMarkers.push(
            <div
                key={i}
                className={`hour-marker-animated ${isMajor ? 'major' : ''}`}
                style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
            />
        );
    }

    return (
        <div className="animated-clock">
            <div
                ref={clockRef}
                className="clock-scene"
                data-period={period}
                onMouseDown={handleClockClick}
                onTouchStart={handleClockClick}
            >
                {/* Stars canvas for night mode */}
                <canvas ref={starsCanvasRef} className="stars-canvas" />

                {/* Celestial bodies - Sun and Moon with arc animation */}
                <div
                    className="celestial-body sun"
                    onClick={onPeriodToggle}
                />
                <div
                    className="celestial-body moon"
                    onClick={onPeriodToggle}
                />

                {/* Clouds */}
                <div className="clouds" />

                {/* Hour markers */}
                <div className="hour-markers-animated">
                    {hourMarkers}
                </div>

                {/* Clock hands */}
                <div className="clock-hands">
                    <div
                        ref={hourHandRef}
                        className="animated-clock-hand animated-hour-hand"
                        onMouseDown={(e) => startDrag(e, 'hour')}
                        onTouchStart={(e) => startDrag(e, 'hour')}
                    />
                    <div
                        ref={minuteHandRef}
                        className="animated-clock-hand animated-minute-hand"
                        onMouseDown={(e) => startDrag(e, 'minute')}
                        onTouchStart={(e) => startDrag(e, 'minute')}
                    />
                    <div className="clock-center-dot" />
                </div>
            </div>
        </div>
    );
};

export default AnimatedClock;
