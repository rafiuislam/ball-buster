const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const scoreId = document.querySelector("#score");
const startBtn = document.querySelector("#startBtn");
const scoreBoard = document.querySelector("#scoreBoard");

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

class Enemy {
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

const inertia = 0.99;
class Particle {
    // size, position, color, speed
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }

    draw() {
        ctx.save();
        ctx.GlobablAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.draw();
        this.velocity.x *= inertia;
        this.velocity.y *= inertia;
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -= 0.01;
    }
}

const x = canvas.width / 2;
const y = canvas.height / 2;

const player = new Player(x, y, 15, "white");
const projectiles = [];
const enemies = [];
const particles = [];

function spawnEnemies() {
    setInterval(() => {
        const radius = Math.random() * (30 - 5) + 5;

        let x;
        let y;

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? -radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? -radius : canvas.height + radius;
        }
        const color = `hsl(${Math.random() * 360} , 50%, 50%)`;
        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);

        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle),
        };
        enemies.push(new Enemy(x, y, radius, color, velocity));
    }, 1000);
}

let score = 0;
let animateId;
function animate() {
    animateId = requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0,0,0,.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        } else {
            particle.update();
        }
    });
    projectiles.forEach((projectile) => {
        projectile.update();

        // remove projectiles from screen edges
        if (
            projectile.x - projectile.radius < 0 ||
            projectile.x + projectile.radius > canvas.width ||
            projectile.y - projectile.radius < 0 ||
            projectile.y + projectile.radius > canvas.height
        ) {
            setTimeout(() => {
                projectiles.splice(projectiles.indexOf(projectile), 1);
            }, 0);
        }
    });
    enemies.forEach((enemy) => {
        enemy.update();
        const dis = Math.hypot(player.x - enemy.x, player.y - enemy.y);

        // end game
        if (dis - player.radius - enemy.radius < 0) {
            cancelAnimationFrame(animateId);
        }

        projectiles.forEach((projectile) => {
            const dis = Math.hypot(
                projectile.x - enemy.x,
                projectile.y - enemy.y
            );
            // projectile collides enemy
            if (dis - projectile.radius - enemy.radius < 0) {
                // create explosions
                for (let i = 0; i < enemy.radius * 2; i++) {
                    particles.push(
                        new Particle(
                            projectile.x,
                            projectile.y,
                            2,
                            enemy.color,
                            {
                                x: (Math.random() - 0.5) * (Math.random() * 7),
                                y: (Math.random() - 0.5) * (Math.random() * 7),
                            }
                        )
                    );
                }

                if (enemy.radius / 2 > 7) {
                    // score increase when enemy is hit
                    score += 10;
                    scoreId.innerHTML = score;
                    gsap.to(enemy, {
                        radius: enemy.radius / 2,
                    });
                    setTimeout(() => {
                        projectiles.splice(projectiles.indexOf(projectile), 1);
                    }, 0);
                } else {
                    // score increase when enemy is removed
                    score += 25;
                    scoreId.innerHTML = score;
                    setTimeout(() => {
                        enemies.splice(enemies.indexOf(enemy), 1);
                        projectiles.splice(projectiles.indexOf(projectile), 1);
                    }, 0);
                }
            }
        });
    });
}

addEventListener("click", (e) => {
    console.log(projectiles);

    const angle = Math.atan2(e.clientY - y, e.clientX - x);

    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5,
    };
    projectiles.push(new Projectile(x, y, 4, "white", velocity));
});

startBtn.addEventListener("click", (e) => {
    animate();
    spawnEnemies();
    console.log(scoreBoard);
    scoreBoard.style.display = "none";
});
