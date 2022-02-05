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

const x = canvas.width / 2;
const y = canvas.height / 2;

const player = new Player(x, y, 50, "red");

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
        const color = "green";
        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);

        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle),
        };
        enemies.push(new Enemy(x, y, radius, color, velocity));
        console.log(enemies);
    }, 1000);
}

let animateId;
function animate() {
    animateId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
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
        if (dis - player.radius - enemy.radius < 0) {
            cancelAnimationFrame(animateId);
        }

        projectiles.forEach((projectile) => {
            const dis = Math.hypot(
                projectile.x - enemy.x,
                projectile.y - enemy.y
            );

            if (dis - projectile.radius - enemy.radius < 0) {
                setTimeout(() => {
                    enemies.splice(enemies.indexOf(enemy), 1);
                    projectiles.splice(projectiles.indexOf(projectile), 1);
                }, 0);
            }
        });
    });
}

addEventListener("click", (e) => {
    console.log(projectiles);

    const angle = Math.atan2(e.clientY - y, e.clientX - x);

    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
    };
    projectiles.push(new Projectile(x, y, 10, "blue", velocity));
});

const projectiles = [];
const enemies = [];

animate();
spawnEnemies();

// addEventListener("keydown", ({ key }) => {
//     switch (key) {
//         case "a":
//             console.log("left");
//             break;
//     }
//     switch (key) {
//         case "d":
//             console.log("right");
//             break;
//     }

//     switch (key) {
//         case " ":
//             console.log("space");
//             break;
//     }
// });
