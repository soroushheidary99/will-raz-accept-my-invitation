/**
 * Main Application Controller
 * Handles screen transitions and data collection
 */

class DateInvitationApp {
    constructor() {
        this.currentScreen = 0;
        this.screens = [
            'screen-intro',
            'screen-time',
            'screen-place',
            'screen-transport',
            'screen-confirm'
        ];

        // Collected data
        this.data = {
            time: null,
            place: null,
            transport: null
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Intro screen button
        document.getElementById('btn-start').addEventListener('click', () => {
            this.nextScreen();
        });

        // Time screen button
        document.getElementById('btn-time-next').addEventListener('click', () => {
            this.data.time = timePicker.getTime();
            this.nextScreen();
        });

        // Restaurant selection event
        document.addEventListener('restaurantSelected', (e) => {
            this.data.place = e.detail;
            this.nextScreen();
        });

        // Transport selection
        document.querySelectorAll('.transport-card').forEach(card => {
            card.addEventListener('click', () => {
                // Update UI
                document.querySelectorAll('.transport-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');

                // Store data
                this.data.transport = card.dataset.transport;

                // Small delay for visual feedback, then advance
                setTimeout(() => {
                    this.showConfirmation();
                    this.nextScreen();
                }, 400);
            });
        });
    }

    nextScreen() {
        const currentScreenEl = document.getElementById(this.screens[this.currentScreen]);
        currentScreenEl.classList.remove('active');

        this.currentScreen++;

        if (this.currentScreen < this.screens.length) {
            const nextScreenEl = document.getElementById(this.screens[this.currentScreen]);
            nextScreenEl.classList.add('active');

            // Special handling for map screen
            if (this.screens[this.currentScreen] === 'screen-place') {
                // Initialize map if not already
                if (!restaurantMap.map) {
                    restaurantMap.init();
                } else {
                    restaurantMap.invalidateSize();
                }
            }
        }
    }

    prevScreen() {
        if (this.currentScreen > 0) {
            const currentScreenEl = document.getElementById(this.screens[this.currentScreen]);
            currentScreenEl.classList.remove('active');

            this.currentScreen--;

            const prevScreenEl = document.getElementById(this.screens[this.currentScreen]);
            prevScreenEl.classList.add('active');
        }
    }

    showConfirmation() {
        // Update confirmation screen with collected data
        document.getElementById('confirm-time').textContent = this.data.time?.formatted || '';
        document.getElementById('confirm-place').textContent = this.data.place?.name || '';

        const transportText = this.data.transport === 'pickup'
            ? "You'll be picked up"
            : "We'll meet there";
        document.getElementById('confirm-transport').textContent = transportText;
    }

    getData() {
        return this.data;
    }
}

// Initialize app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new DateInvitationApp();
});
