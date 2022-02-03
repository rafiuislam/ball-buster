const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
    // size, position, color
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class Projectile {
    // size, position, color, speed
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

const x = canvas.width / 2;
const y = canvas.height / 2;

const player = new Player(x, y, 50, "red");

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    projectiles.forEach((projectile) => {
        projectile.update();
    });
}

addEventListener("click", (e) => {
    const angle = Math.atan2(e.clientY - y, e.clientX - x);

    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
    };
    projectiles.push(new Projectile(x, y, 10, "blue", velocity));
});

const projectiles = [];

animate();
