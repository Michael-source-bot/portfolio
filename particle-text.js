class ParticleText {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0, radius: 100 };
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = 200;
        
        const text = 'ScriptalDev';
        this.ctx.font = '90px "Segoe UI"';
        this.ctx.fillStyle = '#00ff9f';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, this.canvas.width/2, 120);

        const pixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for(let y = 0; y < this.canvas.height; y += 4) {
            for(let x = 0; x < this.canvas.width; x += 4) {
                const index = (y * this.canvas.width + x) * 4;
                const alpha = pixels.data[index + 3];
                if(alpha > 128) {
                    this.particles.push({
                        x: x,
                        y: y,
                        originX: x,
                        originY: y,
                        vx: 0,
                        vy: 0,
                        color: '#00ff9f'
                    });
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for(const particle of this.particles) {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (this.mouse.radius - distance) / this.mouse.radius;
            
            if(distance < this.mouse.radius) {
                particle.x += forceDirectionX * force * 5;
                particle.y += forceDirectionY * force * 5;
            } else {
                if(particle.x !== particle.originX) {
                    const dx = particle.x - particle.originX;
                    particle.x -= dx/10;
                }
                if(particle.y !== particle.originY) {
                    const dy = particle.y - particle.originY;
                    particle.y -= dy/10;
                }
            }

            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(particle.x, particle.y, 2, 2);
        }
        requestAnimationFrame(() => this.animate());
    }

    setupEventListeners() {
        window.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.particles = [];
            this.init();
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    canvas.classList.add('particle-text');
    document.querySelector('#home .content').prepend(canvas);
    new ParticleText(canvas);
}); 