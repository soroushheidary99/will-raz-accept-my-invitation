import { useState, useEffect, useRef } from 'react';

export const useTimePicker = () => {
    const [hour, setHour] = useState(7);
    const [minute, setMinute] = useState(0);
    const [period, setPeriod] = useState('PM');

    const clockRef = useRef(null);
    const hourHandRef = useRef(null);
    const minuteHandRef = useRef(null);

    const generateHourMarkers = () => {
        const markersGroup = clockRef.current?.querySelector('.hour-markers');
        if (!markersGroup) return;

        const cx = 100, cy = 100, outerR = 82, innerR = 75;

        for (let i = 0; i < 12; i++) {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const isMajor = i % 3 === 0;
            const startR = isMajor ? outerR : outerR - 2;
            const endR = isMajor ? innerR - 5 : innerR;

            const x1 = cx + startR * Math.cos(angle);
            const y1 = cy + startR * Math.sin(angle);
            const x2 = cx + endR * Math.cos(angle);
            const y2 = cy + endR * Math.sin(angle);

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            line.classList.add('hour-marker');
            if (isMajor) line.classList.add('major');

            markersGroup.appendChild(line);
        }
    };

    useEffect(() => {
        if (clockRef.current) {
            generateHourMarkers();
        }
    }, []);

    const updateClockHands = () => {
        if (!hourHandRef.current || !minuteHandRef.current) return;

        const hourAngle = (hour % 12) * 30 + (minute / 60) * 30;
        hourHandRef.current.style.transform = `rotate(${hourAngle}deg)`;

        const minuteAngle = minute * 6;
        minuteHandRef.current.style.transform = `rotate(${minuteAngle}deg)`;
    };

    useEffect(() => {
        updateClockHands();
    }, [hour, minute]);

    const getTime = () => {
        return {
            hour,
            minute,
            period,
            formatted: `${hour}:${minute.toString().padStart(2, '0')} ${period}`
        };
    };

    return {
        hour,
        minute,
        period,
        setHour,
        setMinute,
        setPeriod,
        clockRef,
        hourHandRef,
        minuteHandRef,
        getTime
    };
};
