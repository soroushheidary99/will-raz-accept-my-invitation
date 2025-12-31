/**
 * Analog Clock Time Picker
 * Draggable hour and minute hands with snap behavior
 */

class TimePicker {
    constructor() {
        this.clock = document.getElementById('clock');
        this.hourHand = document.getElementById('hour-hand');
        this.minuteHand = document.getElementById('minute-hand');
        this.timeReadout = document.getElementById('time-readout');
        this.periodBtns = document.querySelectorAll('.period-btn');

        this.hour = 7;
        this.minute = 0;
        this.period = 'PM';
        this.activeHand = null;
        this.isDragging = false;

        this.init();
    }

    init() {
        this.generateHourMarkers();
        this.updateClockHands();
        this.setupEventListeners();
    }

    generateHourMarkers() {
        const markersGroup = this.clock.querySelector('.hour-markers');
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
    }

    setupEventListeners() {
        // Mouse events
        this.hourHand.addEventListener('mousedown', (e) => this.startDrag(e, 'hour'));
        this.minuteHand.addEventListener('mousedown', (e) => this.startDrag(e, 'minute'));
        this.clock.addEventListener('mousedown', (e) => this.handleClockClick(e));

        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.endDrag());

        // Touch events
        this.hourHand.addEventListener('touchstart', (e) => this.startDrag(e, 'hour'), { passive: false });
        this.minuteHand.addEventListener('touchstart', (e) => this.startDrag(e, 'minute'), { passive: false });
        this.clock.addEventListener('touchstart', (e) => this.handleClockClick(e), { passive: false });

        document.addEventListener('touchmove', (e) => this.drag(e), { passive: false });
        document.addEventListener('touchend', () => this.endDrag());

        // Period toggle
        this.periodBtns.forEach(btn => {
            btn.addEventListener('click', () => this.setPeriod(btn.dataset.period));
        });
    }

    handleClockClick(e) {
        // If clicking on the clock face (not the hands), determine which hand to move
        if (e.target === this.clock || e.target.classList.contains('clock-face') || e.target.classList.contains('clock-inner')) {
            const angle = this.getAngleFromEvent(e);
            // Determine if closer to hour or minute position
            // For simplicity, always move minute hand on clock face click
            this.startDrag(e, 'minute');
        }
    }

    startDrag(e, handType) {
        e.preventDefault();
        this.isDragging = true;
        this.activeHand = handType;

        const hand = handType === 'hour' ? this.hourHand : this.minuteHand;
        hand.classList.add('active');
    }

    drag(e) {
        if (!this.isDragging || !this.activeHand) return;
        e.preventDefault();

        const angle = this.getAngleFromEvent(e);

        if (this.activeHand === 'hour') {
            // Hours: 12 positions (0-11), each 30 degrees
            const hourValue = Math.round(angle / 30) % 12;
            this.hour = hourValue === 0 ? 12 : hourValue;
        } else {
            // Minutes: 12 positions (0, 5, 10, ... 55), each 30 degrees
            const minuteIndex = Math.round(angle / 30) % 12;
            this.minute = minuteIndex * 5;
        }

        this.updateClockHands();
        this.updateTimeDisplay();
    }

    endDrag() {
        if (this.activeHand) {
            const hand = this.activeHand === 'hour' ? this.hourHand : this.minuteHand;
            hand.classList.remove('active');
        }
        this.isDragging = false;
        this.activeHand = null;
    }

    getAngleFromEvent(e) {
        const rect = this.clock.getBoundingClientRect();
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

        // Calculate angle in degrees (0 = 12 o'clock, clockwise)
        let angle = Math.atan2(dx, -dy) * (180 / Math.PI);
        if (angle < 0) angle += 360;

        return angle;
    }

    updateClockHands() {
        // Hour hand: 30 degrees per hour, plus offset for minutes
        const hourAngle = (this.hour % 12) * 30 + (this.minute / 60) * 30;
        this.hourHand.style.transform = `rotate(${hourAngle}deg)`;

        // Minute hand: 6 degrees per minute (but we snap to 30 degrees / 5 min intervals)
        const minuteAngle = this.minute * 6;
        this.minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
    }

    updateTimeDisplay() {
        const displayHour = this.hour === 0 ? 12 : this.hour;
        const displayMinute = this.minute.toString().padStart(2, '0');
        this.timeReadout.textContent = `${displayHour}:${displayMinute}`;
    }

    setPeriod(period) {
        this.period = period;
        this.periodBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.period === period);
        });
    }

    getTime() {
        return {
            hour: this.hour,
            minute: this.minute,
            period: this.period,
            formatted: `${this.hour}:${this.minute.toString().padStart(2, '0')} ${this.period}`
        };
    }
}

// Initialize on DOM ready
let timePicker;
document.addEventListener('DOMContentLoaded', () => {
    timePicker = new TimePicker();
});
