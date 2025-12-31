import { useRef, useEffect, useCallback } from 'react';

class Star {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 0;
        this.maxSize = Math.random() * 2 + 1;
        this.growth = 0.05 + Math.random() * 0.05;
        this.isIncreasing = true;
    }

    update() {
        if (this.size >= this.maxSize) {
            this.isIncreasing = false;
        }

        if (this.isIncreasing) {
            this.size += this.growth;
        } else {
            this.size -= this.growth * 0.5;
        }

        return this.size > 0;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.closePath();
    }
}

export const useStarsAnimation = (isNight) => {
    const canvasRef = useRef(null);
    const starsRef = useRef([]);
    const animationRef = useRef(null);
    const spawnIntervalRef = useRef(null);

    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.offsetWidth;
            canvas.height = parent.offsetHeight;
        }
    }, []);

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        starsRef.current = starsRef.current.filter(star => {
            const isAlive = star.update();
            if (isAlive) {
                star.draw(ctx);
            }
            return isAlive;
        });

        animationRef.current = requestAnimationFrame(animate);
    }, []);

    const spawnStar = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || canvas.width === 0) return;

        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        starsRef.current.push(new Star(x, y));
    }, []);

    useEffect(() => {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, [resizeCanvas]);

    useEffect(() => {
        if (isNight) {
            // Start animation
            animate();
            // Spawn stars periodically
            spawnIntervalRef.current = setInterval(spawnStar, 150);
        } else {
            // Stop animation and clear stars
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (spawnIntervalRef.current) {
                clearInterval(spawnIntervalRef.current);
            }
            starsRef.current = [];

            // Clear canvas
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (spawnIntervalRef.current) {
                clearInterval(spawnIntervalRef.current);
            }
        };
    }, [isNight, animate, spawnStar]);

    return canvasRef;
};
