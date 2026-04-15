/* ============================================
   VenueFlow — Application Logic
   Google-Inspired Light Theme
   ============================================ */

const state = {
    page: "dashboard",
    matchTime: 62 * 60 + 34,
    activeQueue: null,
    cart: [],
    evacSim: false,
    // Wayfinding state
    wayDest: "food",
    wayUserPos: { x: 0, y: 0 }, // animated pos along route
    wayProgress: 0, // 0-1 animated
    wayAnimId: null,
    // Heatmap animation
    heatAnimId: null,
    // Evac animation
    evacAnimId: null,
    // Parking animation
    parkAnimId: null,
    // Route definitions for each destination
    wayRoutes: {
        seat: {
            label: "My Seat (B-12-5)",
            pts: (bw, bh) => [
                { x: 0.1, y: 0.48 },
                { x: 0.1, y: 0.2 },
                { x: 0.3, y: 0.2 },
                { x: 0.3, y: -0.1 },
                { x: 0.2, y: -0.1 },
            ],
            dist: "120m",
            time: "1:45",
            levels: "0",
        },
        food: {
            label: "Food Court",
            pts: (bw, bh) => [
                { x: 0.1, y: 0.48 },
                { x: 0.1, y: 0.22 },
                { x: -0.48, y: 0.22 },
                { x: -0.48, y: 0 },
                { x: -0.68, y: 0 },
            ],
            dist: "180m",
            time: "2:30",
            levels: "1",
        },
        wc: {
            label: "Restroom Block C",
            pts: (bw, bh) => [
                { x: 0.1, y: 0.48 },
                { x: 0.1, y: 0.22 },
                { x: -0.48, y: 0.22 },
                { x: -0.68, y: 0.22 },
                { x: -0.78, y: 0 },
            ],
            dist: "160m",
            time: "2:00",
            levels: "0",
        },
        exit: {
            label: "Exit Gate 4",
            pts: (bw, bh) => [
                { x: 0.1, y: 0.48 },
                { x: 0.3, y: 0.48 },
                { x: 0.5, y: 0.48 },
                { x: 0.65, y: 0.6 },
                { x: 0.7, y: 0.7 },
            ],
            dist: "220m",
            time: "3:10",
            levels: "1",
        },
        merch: {
            label: "Merch Store",
            pts: (bw, bh) => [
                { x: 0.1, y: 0.48 },
                { x: 0.1, y: 0.55 },
                { x: 0, y: 0.7 },
                { x: -0.1, y: 0.78 },
            ],
            dist: "250m",
            time: "3:45",
            levels: "0",
        },
        med: {
            label: "Medical Station",
            pts: (bw, bh) => [
                { x: 0.1, y: 0.48 },
                { x: 0.3, y: 0.48 },
                { x: 0.5, y: 0.3 },
                { x: 0.6, y: 0.1 },
                { x: 0.75, y: 0 },
            ],
            dist: "280m",
            time: "4:00",
            levels: "1",
        },
        atm: {
            label: "ATM",
            pts: (bw, bh) => [
                { x: 0.1, y: 0.48 },
                { x: 0.1, y: 0.22 },
                { x: 0.3, y: 0.22 },
                { x: 0.5, y: 0.1 },
                { x: 0.6, y: -0.2 },
            ],
            dist: "200m",
            time: "2:50",
            levels: "1",
        },
        info: {
            label: "Info Desk",
            pts: (bw, bh) => [
                { x: 0.1, y: 0.48 },
                { x: 0, y: 0.48 },
                { x: -0.2, y: 0.55 },
                { x: -0.4, y: 0.65 },
            ],
            dist: "150m",
            time: "2:10",
            levels: "0",
        },
    },
};

// ============================================
// Boot
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    let pct = 0;
    const bar = document.getElementById("splash-progress");
    const iv = setInterval(() => {
        pct += Math.random() * 18 + 5;
        if (pct >= 100) {
            pct = 100;
            clearInterval(iv);
            setTimeout(() => {
                document.getElementById("splash").classList.add("fade-out");
                document.getElementById("app").classList.remove("hidden");
                setTimeout(boot, 300);
            }, 300);
        }
        bar.style.width = pct + "%";
    }, 180);
});

function boot() {
    initNav();
    initTimer();
    initStadium();
    initFeed();
    initRecs();
    initDensityChart();
    initHeatmap();
    initTwinCanvas();
    initWayfindingCanvas();
    initEnergyWave();
    initEvacCanvas();
    initParkingCanvas();
    initQueue();
    initFoodMenu();
    initFanBtns();
    initDests();
    initEvacBtn();
    initSOS();
    initMobile();
    initNotifPanel();
    initAccessCanvas();
    initAccessibility();
    setInterval(updateFeed, 8000);
    setInterval(updateStats, 5000);
    setTimeout(() => showToast("info", "Welcome!", "You're at Apex Arena. Thunder FC leads 2-1!"), 1200);
    setTimeout(() => showToast("success", "Flow Optimal", "AI reduced average wait times by 32%."), 3500);
}

// ============================================
// Navigation
// ============================================
function initNav() {
    document.querySelectorAll(".nav-link").forEach((a) => {
        a.addEventListener("click", () => {
            if (a.dataset.page) navigateTo(a.dataset.page);
        });
    });
}

function navigateTo(id) {
    state.page = id;
    document.querySelectorAll(".nav-link").forEach((n) => n.classList.remove("active"));
    const active = document.querySelector(`.nav-link[data-page="${id}"]`);
    if (active) active.classList.add("active");
    document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
    const page = document.getElementById("page-" + id);
    if (page) page.classList.add("active");
    const titles = {
        dashboard: "Dashboard",
        "digital-twin": "Digital Twin",
        "crowd-intel": "Crowd Intelligence",
        "smart-queue": "Smart Queue",
        wayfinding: "Wayfinding",
        "fan-zone": "Fan Zone",
        "social-pulse": "Social Pulse",
        "food-order": "Food & Beverage",
        parking: "Smart Parking",
        transport: "Transport Hub",
        accessibility: "Accessibility",
        safety: "Safety Center",
    };
    document.getElementById("header-title").textContent = titles[id] || "Dashboard";
    document.getElementById("breadcrumb-page").textContent = titles[id] || "Dashboard";
    document.getElementById("sidebar").classList.remove("open");
    // re-draw canvases
    if (id === "crowd-intel") initHeatmap();
    if (id === "wayfinding") initWayfindingCanvas();
    if (id === "social-pulse") initEnergyWave();
    if (id === "safety") initEvacCanvas();
    if (id === "parking") {
        initParkingCanvas();
        state.parkNav = false;
    }
    if (id === "digital-twin") initTwinCanvas();
    if (id === "accessibility") initAccessCanvas();
}

// ============================================
// Timer
// ============================================
function initTimer() {
    setInterval(() => {
        state.matchTime++;
        const m = Math.floor(state.matchTime / 60),
            s = state.matchTime % 60;
        const t = `${m}:${s.toString().padStart(2, "0")}`;
        const el = document.getElementById("ticker-time");
        if (el) el.textContent = t;
        const f = document.getElementById("fan-timer");
        if (f) f.textContent = t;
    }, 1000);
}

// ============================================
// Stadium Canvas
// ============================================
function initStadium() {
    const c = document.getElementById("stadium-canvas");
    if (!c) return;
    const ctx = c.getContext("2d");
    function resize() {
        const p = c.parentElement;
        c.width = p.clientWidth;
        c.height = p.clientHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    (function draw() {
        const w = c.width,
            h = c.height;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#f0f2f5";
        ctx.fillRect(0, 0, w, h);
        // Grid
        ctx.strokeStyle = "rgba(66,133,244,0.06)";
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
        const cx = w / 2,
            cy = h / 2,
            rx = w * 0.4,
            ry = h * 0.4;
        ctx.save();
        ctx.translate(cx, cy);
        // Outer
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(66,133,244,0.04)";
        ctx.fill();
        ctx.strokeStyle = "rgba(66,133,244,0.2)";
        ctx.lineWidth = 2;
        ctx.stroke();
        // Inner rings
        ctx.beginPath();
        ctx.ellipse(0, 0, rx * 0.85, ry * 0.85, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(66,133,244,0.1)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(0, 0, rx * 0.65, ry * 0.65, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(66,133,244,0.08)";
        ctx.stroke();
        // Field
        const fw = rx * 0.48,
            fh = ry * 0.48;
        ctx.strokeStyle = "rgba(52,168,83,0.35)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-fw, -fh, fw * 2, fh * 2);
        ctx.beginPath();
        ctx.arc(0, 0, fh * 0.3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -fh);
        ctx.lineTo(0, fh);
        ctx.stroke();
        ctx.strokeRect(-fw, -fh * 0.55, fw * 0.22, fh * 1.1);
        ctx.strokeRect(fw - fw * 0.22, -fh * 0.55, fw * 0.22, fh * 1.1);
        // Heatmap blobs
        const blobs = [
            { x: 0, y: -ry * 0.72, r: 50, c: [234, 67, 53] },
            { x: 0, y: ry * 0.72, r: 42, c: [251, 188, 4] },
            { x: rx * 0.72, y: 0, r: 46, c: [249, 115, 22] },
            { x: -rx * 0.72, y: 0, r: 38, c: [52, 168, 83] },
            { x: -rx * 0.3, y: -ry * 0.5, r: 28, c: [234, 67, 53] },
            { x: rx * 0.35, y: ry * 0.5, r: 25, c: [52, 168, 83] },
        ];
        blobs.forEach((b) => {
            const t = Date.now() / 3000;
            const bx = b.x + Math.sin(t + b.x) * 3,
                by = b.y + Math.cos(t + b.y) * 3;
            const g = ctx.createRadialGradient(bx, by, 0, bx, by, b.r);
            g.addColorStop(0, `rgba(${b.c.join(",")},0.25)`);
            g.addColorStop(0.6, `rgba(${b.c.join(",")},0.08)`);
            g.addColorStop(1, `rgba(${b.c.join(",")},0)`);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(bx, by, b.r, 0, Math.PI * 2);
            ctx.fill();
        });
        // Particles
        for (let i = 0; i < 50; i++) {
            const a = (i / 50) * Math.PI * 2 + Date.now() / 5000;
            const d = rx * 0.55 + Math.sin(a * 3 + Date.now() / 2000) * 18;
            const dy = ry * 0.55 + Math.cos(a * 3 + Date.now() / 2000) * 18;
            ctx.fillStyle = `rgba(66,133,244,${0.15 + Math.sin(Date.now() / 1000 + i) * 0.1})`;
            ctx.beginPath();
            ctx.arc(Math.cos(a) * d * 0.7, Math.sin(a) * dy * 0.7, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
        requestAnimationFrame(draw);
    })();
}

// ============================================
// Live Feed
// ============================================
const feedData = [
    {
        t: "alert",
        i: "fa-triangle-exclamation",
        title: "Congestion Building",
        desc: "North corridor at 90% — rerouting traffic.",
        time: "Now",
    },
    {
        t: "ok",
        i: "fa-check-circle",
        title: "Queue Optimized",
        desc: "Food Court A reduced from 18m to 12m wait.",
        time: "1m",
    },
    {
        t: "info",
        i: "fa-brain",
        title: "AI Prediction",
        desc: "Halftime rush in 8 min. Pre-staging staff.",
        time: "2m",
    },
    {
        t: "warn",
        i: "fa-people-arrows",
        title: "Flow Redirect",
        desc: "340 attendees rerouted Gate 3 → Gate 5.",
        time: "3m",
    },
    { t: "ok", i: "fa-shield-check", title: "Safety OK", desc: "All 24 exits clear. Response time: 45s.", time: "5m" },
    {
        t: "info",
        i: "fa-chart-line",
        title: "Engagement Spike",
        desc: "Energy 94/100 after goal. Wave detected!",
        time: "6m",
    },
];
const dynamicFeed = [
    {
        t: "info",
        i: "fa-route",
        title: "Smart Route",
        desc: "Optimal path recalculated — 15s faster via B.",
        time: "Now",
    },
    {
        t: "ok",
        i: "fa-utensils",
        title: "Orders Fulfilled",
        desc: "147 mobile orders in 5 min. Avg pickup: 38s.",
        time: "Now",
    },
    {
        t: "warn",
        i: "fa-users",
        title: "Crowd Surge",
        desc: "East Wing C rapid inflow. Flow control active.",
        time: "Now",
    },
    {
        t: "info",
        i: "fa-bell",
        title: "Perfect Timing",
        desc: "Your fav vendor has 2-min wait right now!",
        time: "Now",
    },
    { t: "ok", i: "fa-trophy", title: "XP Earned", desc: "+50 XP for attendance! Level 8: 72%.", time: "Now" },
];
function initFeed() {
    const el = document.getElementById("feed-body");
    if (!el) return;
    el.innerHTML = "";
    feedData.forEach((f, i) => {
        const d = mkFeed(f);
        d.style.animationDelay = `${i * 0.06}s`;
        el.appendChild(d);
    });
}
function mkFeed(f) {
    const d = document.createElement("div");
    d.className = "feed-item";
    d.innerHTML = `<div class="fi-icon ${f.t}"><i class="fas ${f.i}"></i></div><div class="fi-body"><div class="fi-title">${f.title}</div><div class="fi-desc">${f.desc}</div></div><span class="fi-time">${f.time}</span>`;
    return d;
}
function updateFeed() {
    const el = document.getElementById("feed-body");
    if (!el) return;
    const f = dynamicFeed[Math.floor(Math.random() * dynamicFeed.length)];
    el.insertBefore(mkFeed(f), el.firstChild);
    while (el.children.length > 10) el.removeChild(el.lastChild);
}

// ============================================
// Recommendations
// ============================================
function initRecs() {
    const el = document.getElementById("recs-body");
    if (!el) return;
    const recs = [
        {
            p: "high",
            i: "fa-route",
            t: "Pre-emptive Dispersal",
            d: "Open aux exits 5min before halftime. Impact: -40% congestion.",
            a: "Apply",
        },
        {
            p: "medium",
            i: "fa-utensils",
            t: "Activate Express Lanes",
            d: "Food Court A over threshold. Open 2 express lanes.",
            a: "Activate",
        },
        {
            p: "low",
            i: "fa-signs-post",
            t: "Update Digital Signage",
            d: "Redirect displays to promote Bev Station B (25% cap).",
            a: "Update",
        },
        {
            p: "medium",
            i: "fa-temperature-low",
            t: "Climate Adjust",
            d: "Section D reported warm by 34% of attendees. +2°C cool.",
            a: "Adjust",
        },
    ];
    recs.forEach((r) => {
        const d = document.createElement("div");
        d.className = `rec-item ${r.p}`;
        d.innerHTML = `<div class="ri-icon"><i class="fas ${r.i}"></i></div><div class="ri-text"><div class="ri-title">${r.t}</div><div class="ri-desc">${r.d}</div><span class="ri-action">${r.a} →</span></div>`;
        d.querySelector(".ri-action").addEventListener("click", () => {
            showToast("success", "Applied", `"${r.t}" executed by AI.`);
            d.style.opacity = ".5";
            d.querySelector(".ri-action").textContent = "✓ Applied";
        });
        el.appendChild(d);
    });
}

// ============================================
// Density Chart
// ============================================
function initDensityChart() {
    const c = document.getElementById("density-chart");
    if (!c) return;
    const ctx = c.getContext("2d");
    function resize() {
        const p = c.parentElement;
        c.width = p.clientWidth;
        c.height = 180;
        draw();
    }
    function draw() {
        const w = c.width,
            h = c.height;
        ctx.clearRect(0, 0, w, h);
        const data = [15, 22, 35, 58, 72, 85, 92, 88, 78, 95, 89, 82];
        const labels = ["4PM", "", "4:30", "", "5PM", "", "5:30", "", "6PM", "", "NOW", ""];
        const pad = { t: 16, r: 16, b: 28, l: 36 };
        const cw = w - pad.l - pad.r,
            ch = h - pad.t - pad.b;
        ctx.strokeStyle = "rgba(0,0,0,.05)";
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = pad.t + (ch / 4) * i;
            ctx.beginPath();
            ctx.moveTo(pad.l, y);
            ctx.lineTo(w - pad.r, y);
            ctx.stroke();
            ctx.fillStyle = "rgba(0,0,0,.3)";
            ctx.font = "10px Inter";
            ctx.textAlign = "right";
            ctx.fillText(Math.round(100 - (100 / 4) * i) + "%", pad.l - 6, y + 4);
        }
        ctx.fillStyle = "rgba(0,0,0,.3)";
        ctx.font = "10px Inter";
        ctx.textAlign = "center";
        data.forEach((_, i) => {
            if (labels[i]) {
                const x = pad.l + (cw / (data.length - 1)) * i;
                ctx.fillText(labels[i], x, h - 8);
            }
        });
        const grad = ctx.createLinearGradient(0, pad.t, 0, h - pad.b);
        grad.addColorStop(0, "rgba(66,133,244,0.2)");
        grad.addColorStop(1, "rgba(66,133,244,0)");
        ctx.beginPath();
        ctx.moveTo(pad.l, h - pad.b);
        data.forEach((v, i) => {
            const x = pad.l + (cw / (data.length - 1)) * i,
                y = pad.t + ch * (1 - v / 100);
            if (i === 0) ctx.lineTo(x, y);
            else {
                const px = pad.l + (cw / (data.length - 1)) * (i - 1),
                    py = pad.t + ch * (1 - data[i - 1] / 100),
                    mx = (px + x) / 2;
                ctx.bezierCurveTo(mx, py, mx, y, x, y);
            }
        });
        ctx.lineTo(pad.l + cw, h - pad.b);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.beginPath();
        data.forEach((v, i) => {
            const x = pad.l + (cw / (data.length - 1)) * i,
                y = pad.t + ch * (1 - v / 100);
            if (i === 0) ctx.moveTo(x, y);
            else {
                const px = pad.l + (cw / (data.length - 1)) * (i - 1),
                    py = pad.t + ch * (1 - data[i - 1] / 100),
                    mx = (px + x) / 2;
                ctx.bezierCurveTo(mx, py, mx, y, x, y);
            }
        });
        ctx.strokeStyle = "#4285F4";
        ctx.lineWidth = 2.5;
        ctx.stroke();
        const lx = pad.l + (cw / (data.length - 1)) * 10,
            ly = pad.t + ch * (1 - data[10] / 100);
        ctx.beginPath();
        ctx.arc(lx, ly, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#4285F4";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(lx, ly, 12, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(66,133,244,0.12)";
        ctx.fill();
    }
    resize();
    window.addEventListener("resize", resize);
}

// ============================================
// Heatmap — ANIMATED
// ============================================
function initHeatmap() {
    const c = document.getElementById("heatmap-canvas");
    if (!c) return;
    if (state.heatAnimId) cancelAnimationFrame(state.heatAnimId);
    const ctx = c.getContext("2d");
    const p = c.parentElement;
    c.width = p.clientWidth;
    c.height = 350;
    // Crowd particles for corridors
    const crowdParticles = [];
    for (let i = 0; i < 80; i++)
        crowdParticles.push({
            angle: Math.random() * Math.PI * 2,
            dist: 0.4 + Math.random() * 0.5,
            speed: 0.0003 + Math.random() * 0.0005,
            size: 1 + Math.random() * 2,
        });
    (function draw() {
        const w = c.width,
            h = c.height,
            t = Date.now() / 1000;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#f0f2f5";
        ctx.fillRect(0, 0, w, h);
        // Grid
        ctx.strokeStyle = "rgba(66,133,244,.04)";
        for (let x = 0; x < w; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
        const cx = w / 2,
            cy = h / 2;
        ctx.save();
        ctx.translate(cx, cy);
        const rx = w * 0.38,
            ry = h * 0.38;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(66,133,244,0.03)";
        ctx.fill();
        ctx.strokeStyle = "rgba(66,133,244,0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();
        // Animated heatmap zones — density shifts over time
        const zones = [
            {
                x: 0,
                y: -ry * 0.6,
                rx: rx * 0.38,
                ry: ry * 0.2,
                base: [234, 67, 53],
                density: 0.85 + Math.sin(t * 0.3) * 0.07,
            },
            {
                x: 0,
                y: ry * 0.6,
                rx: rx * 0.38,
                ry: ry * 0.2,
                base: [251, 188, 4],
                density: 0.7 + Math.sin(t * 0.5 + 1) * 0.08,
            },
            {
                x: rx * 0.6,
                y: 0,
                rx: rx * 0.2,
                ry: ry * 0.38,
                base: [249, 115, 22],
                density: 0.82 + Math.sin(t * 0.4 + 2) * 0.06,
            },
            {
                x: -rx * 0.6,
                y: 0,
                rx: rx * 0.2,
                ry: ry * 0.38,
                base: [52, 168, 83],
                density: 0.55 + Math.sin(t * 0.6 + 3) * 0.1,
            },
            {
                x: 0,
                y: 0,
                rx: rx * 0.22,
                ry: ry * 0.22,
                base: [66, 133, 244],
                density: 0.4 + Math.sin(t * 0.2 + 4) * 0.08,
            },
        ];
        zones.forEach((z) => {
            const jx = z.x + Math.sin(t * 0.5 + z.x) * 4,
                jy = z.y + Math.cos(t * 0.4 + z.y) * 4;
            const jrx = z.rx * (1 + Math.sin(t * 0.3 + z.y) * 0.08),
                jry = z.ry * (1 + Math.cos(t * 0.3 + z.x) * 0.08);
            const g = ctx.createRadialGradient(jx, jy, 0, jx, jy, Math.max(jrx, jry));
            g.addColorStop(0, `rgba(${z.base.join(",")},${z.density * 0.4})`);
            g.addColorStop(0.6, `rgba(${z.base.join(",")},${z.density * 0.12})`);
            g.addColorStop(1, "transparent");
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.ellipse(jx, jy, jrx, jry, 0, 0, Math.PI * 2);
            ctx.fill();
        });
        // Crowd particles moving in corridors
        crowdParticles.forEach((p) => {
            p.angle += p.speed * 16;
            const d = rx * p.dist,
                dy = ry * p.dist;
            const px = Math.cos(p.angle) * d * 0.7,
                py = Math.sin(p.angle) * dy * 0.7;
            ctx.fillStyle = `rgba(66,133,244,${0.1 + Math.sin(t * 2 + p.angle) * 0.08})`;
            ctx.beginPath();
            ctx.arc(px, py, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        // Flow arrows
        for (let i = 0; i < 6; i++) {
            const a = (i * Math.PI) / 3 + t * 0.2;
            const ad = rx * 0.5;
            const ax = Math.cos(a) * ad * 0.6,
                ay = Math.sin(a) * (ry * 0.5) * 0.6;
            const dx = Math.cos(a) * 8,
                dy = Math.sin(a) * 8;
            ctx.strokeStyle = "rgba(66,133,244,.15)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(ax + dx, ay + dy);
            ctx.stroke();
            // arrowhead
            ctx.beginPath();
            ctx.moveTo(ax + dx, ay + dy);
            ctx.lineTo(ax + dx - Math.cos(a - 0.4) * 5, ay + dy - Math.sin(a - 0.4) * 5);
            ctx.moveTo(ax + dx, ay + dy);
            ctx.lineTo(ax + dx - Math.cos(a + 0.4) * 5, ay + dy - Math.sin(a + 0.4) * 5);
            ctx.stroke();
        }
        ctx.font = "11px Outfit";
        ctx.fillStyle = "rgba(0,0,0,.4)";
        ctx.textAlign = "center";
        ctx.fillText("NORTH", 0, -ry * 0.6);
        ctx.fillText("SOUTH", 0, ry * 0.65);
        ctx.fillText("EAST", rx * 0.6, 5);
        ctx.fillText("WEST", -rx * 0.6, 5);
        ctx.fillText("VIP", 0, 5);
        ctx.restore();
        state.heatAnimId = requestAnimationFrame(draw);
    })();
}

// ============================================
// Twin Canvas (reuse stadium-like but polished)
// ============================================
function initTwinCanvas() {
    const c = document.getElementById("twin-canvas");
    if (!c) return;
    const ctx = c.getContext("2d");
    const p = c.parentElement;
    c.width = p.clientWidth;
    c.height = 400;
    const w = c.width,
        h = c.height;
    ctx.fillStyle = "#f0f2f5";
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2,
        cy = h / 2;
    ctx.save();
    ctx.translate(cx, cy);
    const bw = w * 0.38,
        bh = h * 0.36;
    // 3D-like layers
    for (let i = 3; i >= 0; i--) {
        const off = i * 4;
        ctx.fillStyle = `rgba(66,133,244,${0.03 + i * 0.01})`;
        ctx.strokeStyle = `rgba(66,133,244,${0.1 + i * 0.03})`;
        ctx.lineWidth = 1;
        roundRect(ctx, -bw + off, -bh + off, bw * 2, bh * 2, 16);
        ctx.fill();
        ctx.stroke();
    }
    // Inner structure
    ctx.strokeStyle = "rgba(66,133,244,.12)";
    ctx.lineWidth = 1;
    roundRect(ctx, -bw * 0.7, -bh * 0.7, bw * 1.4, bh * 1.4, 10);
    ctx.stroke();
    // Field
    ctx.fillStyle = "rgba(52,168,83,.06)";
    ctx.strokeStyle = "rgba(52,168,83,.2)";
    roundRect(ctx, -bw * 0.35, -bh * 0.35, bw * 0.7, bh * 0.7, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(52,168,83,.35)";
    ctx.font = "12px Outfit";
    ctx.textAlign = "center";
    ctx.fillText("ARENA FLOOR", 0, 5);
    // IoT sensor dots
    const sensors = [];
    for (let i = 0; i < 20; i++) {
        sensors.push({ x: (Math.random() - 0.5) * bw * 1.8, y: (Math.random() - 0.5) * bh * 1.8 });
    }
    sensors.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(66,133,244,0.3)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(s.x, s.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(66,133,244,0.06)";
        ctx.fill();
    });
    ctx.restore();
    ctx.strokeStyle = "rgba(66,133,244,.03)";
    for (let x = 0; x < w; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
    }
    for (let y = 0; y < h; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
    }
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

// ============================================
// Wayfinding Canvas — FULLY ANIMATED
// ============================================
var _wayCrowdParticles = [];
for (let i = 0; i < 40; i++)
    _wayCrowdParticles.push({
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        vx: (Math.random() - 0.5) * 0.002,
        vy: (Math.random() - 0.5) * 0.002,
        s: 1 + Math.random() * 1.5,
    });

function initWayfindingCanvas() {
    const c = document.getElementById("wayfinding-canvas");
    if (!c) return;
    if (state.wayAnimId) cancelAnimationFrame(state.wayAnimId);
    const ctx = c.getContext("2d");
    const par = c.parentElement;
    c.width = par.clientWidth;
    c.height = 400;
    state.wayProgress = 0;

    const rooms = [
        { rx: -0.85, ry: -0.85, rw: 0.3, rh: 0.3, l: "Gate 1", icon: "🚪" },
        { rx: 0.55, ry: -0.85, rw: 0.3, rh: 0.3, l: "Gate 2", icon: "🚪" },
        { rx: -0.85, ry: 0.55, rw: 0.3, rh: 0.3, l: "Gate 3", icon: "🚪" },
        { rx: 0.55, ry: 0.55, rw: 0.3, rh: 0.3, l: "Gate 4", icon: "🚪" },
        { rx: -0.2, ry: -0.88, rw: 0.4, rh: 0.18, l: "Food Court", icon: "🍔" },
        { rx: -0.2, ry: 0.7, rw: 0.4, rh: 0.18, l: "Merch Store", icon: "🛍️" },
        { rx: -0.88, ry: -0.12, rw: 0.18, rh: 0.24, l: "WC", icon: "🚻" },
        { rx: 0.7, ry: -0.12, rw: 0.18, rh: 0.24, l: "WC", icon: "🚻" },
        { rx: -0.5, ry: 0.35, rw: 0.18, rh: 0.15, l: "Med", icon: "🏥" },
        { rx: 0.35, ry: -0.5, rw: 0.22, rh: 0.15, l: "ATM", icon: "💳" },
    ];

    function getRoutePoints(bw, bh) {
        const r = state.wayRoutes[state.wayDest];
        if (!r) return [{ x: 0, y: 0 }];
        return r.pts(bw, bh).map((p) => ({ x: p.x * bw, y: p.y * bh }));
    }

    function getRouteLength(pts) {
        let len = 0;
        for (let i = 1; i < pts.length; i++) {
            const dx = pts[i].x - pts[i - 1].x,
                dy = pts[i].y - pts[i - 1].y;
            len += Math.sqrt(dx * dx + dy * dy);
        }
        return len;
    }
    function pointAlongRoute(pts, frac) {
        const totalLen = getRouteLength(pts);
        let target = frac * totalLen,
            accum = 0;
        for (let i = 1; i < pts.length; i++) {
            const dx = pts[i].x - pts[i - 1].x,
                dy = pts[i].y - pts[i - 1].y;
            const segLen = Math.sqrt(dx * dx + dy * dy);
            if (accum + segLen >= target) {
                const t = (target - accum) / segLen;
                return { x: pts[i - 1].x + dx * t, y: pts[i - 1].y + dy * t };
            }
            accum += segLen;
        }
        return pts[pts.length - 1];
    }

    (function draw() {
        const w = c.width,
            h = c.height,
            t = Date.now() / 1000;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#f0f2f5";
        ctx.fillRect(0, 0, w, h);
        // Grid
        ctx.strokeStyle = "rgba(66,133,244,.04)";
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 25) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += 25) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
        const cx = w / 2,
            cy = h / 2;
        ctx.save();
        ctx.translate(cx, cy);
        const bw = w * 0.38,
            bh = h * 0.36;
        // Building
        ctx.strokeStyle = "rgba(66,133,244,.2)";
        ctx.lineWidth = 2;
        roundRect(ctx, -bw, -bh, bw * 2, bh * 2, 16);
        ctx.stroke();
        ctx.strokeStyle = "rgba(66,133,244,.08)";
        ctx.lineWidth = 1;
        roundRect(ctx, -bw * 0.7, -bh * 0.7, bw * 1.4, bh * 1.4, 10);
        ctx.stroke();
        // Rooms with icons
        rooms.forEach((r) => {
            const rx = r.rx * bw,
                ry2 = r.ry * bh,
                rw2 = r.rw * bw,
                rh2 = r.rh * bh;
            ctx.fillStyle = "rgba(66,133,244,.04)";
            ctx.strokeStyle = "rgba(66,133,244,.1)";
            ctx.lineWidth = 1;
            ctx.fillRect(rx, ry2, rw2, rh2);
            ctx.strokeRect(rx, ry2, rw2, rh2);
            ctx.fillStyle = "rgba(0,0,0,.25)";
            ctx.font = "8px Inter";
            ctx.textAlign = "center";
            ctx.fillText(r.icon, rx + rw2 / 2, ry2 + rh2 / 2 - 2);
            ctx.fillText(r.l, rx + rw2 / 2, ry2 + rh2 / 2 + 9);
        });
        // Arena floor
        ctx.fillStyle = "rgba(52,168,83,.04)";
        ctx.strokeStyle = "rgba(52,168,83,.12)";
        roundRect(ctx, -bw * 0.32, -bh * 0.32, bw * 0.64, bh * 0.64, 8);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "rgba(52,168,83,.25)";
        ctx.font = "11px Outfit";
        ctx.textAlign = "center";
        ctx.fillText("ARENA", 0, 4);
        // Crowd particles (other people walking)
        _wayCrowdParticles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            if (Math.abs(p.x) > 0.9) {
                p.vx *= -1;
                p.x = Math.max(-0.9, Math.min(0.9, p.x));
            }
            if (Math.abs(p.y) > 0.9) {
                p.vy *= -1;
                p.y = Math.max(-0.9, Math.min(0.9, p.y));
            }
            // Occasionally change direction
            if (Math.random() < 0.005) {
                p.vx = (Math.random() - 0.5) * 0.003;
                p.vy = (Math.random() - 0.5) * 0.003;
            }
            const px = p.x * bw,
                py = p.y * bh;
            ctx.fillStyle = `rgba(150,150,180,${0.15 + Math.sin(t + p.x * 10) * 0.05})`;
            ctx.beginPath();
            ctx.arc(px, py, p.s, 0, Math.PI * 2);
            ctx.fill();
        });
        // Route
        const pts = getRoutePoints(bw, bh);
        if (pts.length > 1) {
            // Route shadow
            ctx.strokeStyle = "rgba(66,133,244,.08)";
            ctx.lineWidth = 8;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            pts.forEach((p, i) => {
                i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
            });
            ctx.stroke();
            // Animated marching ants
            const dashOffset = -(t * 40) % 20;
            ctx.strokeStyle = "#4285F4";
            ctx.lineWidth = 3;
            ctx.setLineDash([10, 6]);
            ctx.lineDashOffset = dashOffset;
            ctx.beginPath();
            pts.forEach((p, i) => {
                i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
            });
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.lineDashOffset = 0;
            // Direction arrows along route
            for (let f = 0.15; f < 0.95; f += 0.25) {
                const p1 = pointAlongRoute(pts, f),
                    p2 = pointAlongRoute(pts, Math.min(f + 0.02, 1));
                const ang = Math.atan2(p2.y - p1.y, p2.x - p1.x);
                ctx.save();
                ctx.translate(p1.x, p1.y);
                ctx.rotate(ang);
                ctx.fillStyle = "rgba(66,133,244,.5)";
                ctx.beginPath();
                ctx.moveTo(6, 0);
                ctx.lineTo(-3, -4);
                ctx.lineTo(-3, 4);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
            // Animated user moving along route
            state.wayProgress += 0.0008;
            if (state.wayProgress > 1) state.wayProgress = 0;
            const userP = pointAlongRoute(pts, state.wayProgress);
            // User pulse ring
            const pulseR = 8 + Math.sin(t * 3) * 3;
            ctx.beginPath();
            ctx.arc(userP.x, userP.y, pulseR, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(66,133,244,${0.08 + Math.sin(t * 3) * 0.04})`;
            ctx.fill();
            // Accuracy circle
            ctx.beginPath();
            ctx.arc(userP.x, userP.y, 18, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(66,133,244,.08)";
            ctx.lineWidth = 1;
            ctx.stroke();
            // User dot
            ctx.beginPath();
            ctx.arc(userP.x, userP.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = "#4285F4";
            ctx.fill();
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2.5;
            ctx.stroke();
            // Destination marker
            const dest = pts[pts.length - 1];
            const destPulse = 10 + Math.sin(t * 2) * 3;
            ctx.beginPath();
            ctx.arc(dest.x, dest.y, destPulse, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(52,168,83,${0.08 + Math.sin(t * 2) * 0.04})`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(dest.x, dest.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = "#34A853";
            ctx.fill();
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2.5;
            ctx.stroke();
            // Pin icon at destination
            ctx.fillStyle = "#34A853";
            ctx.font = "14px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("📍", dest.x, dest.y - 14);
        }
        ctx.restore();
        // Labels
        if (pts.length > 1) {
            const userP = pointAlongRoute(pts, state.wayProgress);
            ctx.fillStyle = "rgba(66,133,244,.6)";
            ctx.font = "bold 10px Inter";
            ctx.textAlign = "left";
            ctx.fillText("You", cx + userP.x + 12, cy + userP.y + 4);
            const dest = pts[pts.length - 1];
            const routeInfo = state.wayRoutes[state.wayDest];
            ctx.fillStyle = "rgba(52,168,83,.6)";
            ctx.font = "bold 10px Inter";
            ctx.fillText(routeInfo ? routeInfo.label : "Destination", cx + dest.x + 12, cy + dest.y + 4);
            // Distance remaining
            const remaining = Math.round((1 - state.wayProgress) * 100);
            ctx.fillStyle = "rgba(0,0,0,.3)";
            ctx.font = "9px Inter";
            ctx.textAlign = "center";
            ctx.fillText(`${remaining}% remaining`, cx, h - 10);
        }
        state.wayAnimId = requestAnimationFrame(draw);
    })();
}

// ============================================
// Energy Wave
// ============================================
function initEnergyWave() {
    const c = document.getElementById("energy-canvas");
    if (!c) return;
    const ctx = c.getContext("2d");
    const p = c.parentElement;
    c.width = p.clientWidth;
    c.height = 140;
    window.addEventListener("resize", () => {
        c.width = p.clientWidth;
        c.height = 140;
    });
    (function draw() {
        const w = c.width,
            h = c.height;
        ctx.clearRect(0, 0, w, h);
        const t = Date.now() / 1000;
        [
            { a: 18, f: 0.02, s: 1.5, c: "rgba(66,133,244,0.3)" },
            { a: 14, f: 0.025, s: 2, c: "rgba(124,58,237,0.25)" },
            { a: 22, f: 0.015, s: 1, c: "rgba(236,72,153,0.2)" },
            { a: 10, f: 0.035, s: 2.5, c: "rgba(13,148,136,0.15)" },
        ].forEach((wv) => {
            ctx.beginPath();
            ctx.moveTo(0, h);
            for (let x = 0; x <= w; x += 2) {
                const y =
                    h / 2 + Math.sin(x * wv.f + t * wv.s) * wv.a + Math.sin(x * wv.f * 2 + t * wv.s * 0.7) * wv.a * 0.3;
                ctx.lineTo(x, y);
            }
            ctx.lineTo(w, h);
            ctx.closePath();
            ctx.fillStyle = wv.c;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    })();
}

// ============================================
// Evac Canvas — ANIMATED with flowing people dots
// ============================================
var _evacPeople = [];
for (let i = 0; i < 60; i++)
    _evacPeople.push({
        gate: Math.floor(Math.random() * 8),
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.005,
    });

function initEvacCanvas() {
    const c = document.getElementById("evac-canvas");
    if (!c) return;
    if (state.evacAnimId) cancelAnimationFrame(state.evacAnimId);
    const ctx = c.getContext("2d");
    const p = c.parentElement;
    c.width = p.clientWidth;
    c.height = 380;
    const gates = [
        { a: -Math.PI / 2, l: "Exit 1", s: "ok" },
        { a: -Math.PI / 4, l: "Exit 2", s: "ok" },
        { a: 0, l: "Exit 3", s: "ok" },
        { a: Math.PI / 4, l: "Exit 4", s: "ok" },
        { a: Math.PI / 2, l: "Exit 5", s: "ok" },
        { a: (Math.PI * 3) / 4, l: "Exit 6", s: "ok" },
        { a: Math.PI, l: "Exit 7", s: "warn" },
        { a: (-Math.PI * 3) / 4, l: "Exit 8", s: "ok" },
    ];
    (function draw() {
        const w = c.width,
            h = c.height,
            t = Date.now() / 1000;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#f0f2f5";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "rgba(52,168,83,.03)";
        for (let x = 0; x < w; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
        const cx = w / 2,
            cy = h / 2;
        ctx.save();
        ctx.translate(cx, cy);
        const rx = w * 0.36,
            ry = h * 0.36;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(52,168,83,.03)";
        ctx.fill();
        ctx.strokeStyle = "rgba(52,168,83,.15)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(0, 0, rx * 0.7, ry * 0.7, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(52,168,83,.08)";
        ctx.lineWidth = 1;
        ctx.stroke();
        gates.forEach((g, gi) => {
            const gx = Math.cos(g.a) * rx,
                gy = Math.sin(g.a) * ry;
            const col = g.s === "ok" ? "#34A853" : "#F97316";
            // Animated pulse on gates during sim
            if (state.evacSim) {
                const pr = 12 + Math.sin(t * 3 + gi) * 4;
                ctx.beginPath();
                ctx.arc(gx, gy, pr, 0, Math.PI * 2);
                ctx.fillStyle = g.s === "ok" ? "rgba(52,168,83,.06)" : "rgba(249,115,22,.06)";
                ctx.fill();
            }
            ctx.beginPath();
            ctx.arc(gx, gy, 10, 0, Math.PI * 2);
            ctx.fillStyle = g.s === "ok" ? "rgba(52,168,83,.1)" : "rgba(249,115,22,.1)";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(gx, gy, 5, 0, Math.PI * 2);
            ctx.fillStyle = col;
            ctx.fill();
            const lx = Math.cos(g.a) * (rx + 22),
                ly = Math.sin(g.a) * (ry + 22);
            ctx.fillStyle = "rgba(0,0,0,.35)";
            ctx.font = "9px Inter";
            ctx.textAlign = "center";
            ctx.fillText(g.l, lx, ly + 3);
            if (state.evacSim) {
                const dashOff = -(t * 30) % 16;
                ctx.strokeStyle = "rgba(52,168,83,.2)";
                ctx.lineWidth = 1.5;
                ctx.setLineDash([6, 4]);
                ctx.lineDashOffset = dashOff;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(gx, gy);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.lineDashOffset = 0;
            }
        });
        // Animated people dots flowing to exits during simulation
        if (state.evacSim) {
            _evacPeople.forEach((p) => {
                p.progress += p.speed;
                if (p.progress > 1) {
                    p.progress = 0;
                    p.gate = Math.floor(Math.random() * 8);
                }
                const g = gates[p.gate];
                const gx = Math.cos(g.a) * rx,
                    gy = Math.sin(g.a) * ry;
                const px = gx * p.progress,
                    py = gy * p.progress;
                // Add slight randomness perpendicular to path
                const perp = Math.sin(p.progress * 10 + p.gate) * 4;
                const perpX = px + Math.cos(g.a + Math.PI / 2) * perp;
                const perpY = py + Math.sin(g.a + Math.PI / 2) * perp;
                ctx.fillStyle = `rgba(52,168,83,${0.3 + p.progress * 0.3})`;
                ctx.beginPath();
                ctx.arc(perpX, perpY, 2, 0, Math.PI * 2);
                ctx.fill();
            });
        }
        ctx.fillStyle = "rgba(0,0,0,.25)";
        ctx.font = "13px Outfit";
        ctx.textAlign = "center";
        ctx.fillText(state.evacSim ? "🚨 EVACUATION ACTIVE" : "✅ ALL CLEAR", 0, 0);
        ctx.font = "10px Inter";
        ctx.fillText(state.evacSim ? "All routes active — Est. 3.2 min" : "All exits operational", 0, 18);
        ctx.restore();
        state.evacAnimId = requestAnimationFrame(draw);
    })();
}

// ============================================
// Parking Canvas
// ============================================
function initParkingCanvas() {
    const c = document.getElementById("parking-canvas");
    if (!c) return;
    if (window._parkAnimId) cancelAnimationFrame(window._parkAnimId);
    const ctx = c.getContext("2d");
    const par = c.parentElement;
    c.width = par.clientWidth;
    c.height = 380;
    // Route for navigation: from stadium center exit to Lot B car
    const carFrac = { x: 0.525, y: 0.275 }; // Lot B center
    const navRoute = [
        { x: 0.5, y: 0.52 },
        { x: 0.5, y: 0.48 },
        { x: 0.4, y: 0.48 },
        { x: 0.4, y: 0.35 },
        { x: 0.5, y: 0.35 },
        { x: 0.525, y: 0.275 },
    ];
    const lots = [
        { x: 0.1, y: 0.1, w: 0.25, h: 0.35, l: "Lot A", pct: 95, c: "#EA4335" },
        { x: 0.4, y: 0.1, w: 0.25, h: 0.35, l: "Lot B", pct: 82, c: "#F97316" },
        { x: 0.7, y: 0.1, w: 0.2, h: 0.35, l: "Lot C", pct: 68, c: "#FBBC04" },
        { x: 0.1, y: 0.55, w: 0.35, h: 0.35, l: "Lot D", pct: 45, c: "#34A853" },
        { x: 0.5, y: 0.55, w: 0.2, h: 0.35, l: "VIP", pct: 72, c: "#7C3AED" },
        { x: 0.75, y: 0.55, w: 0.15, h: 0.35, l: "Lot E", pct: 30, c: "#34A853" },
    ];

    if (state.parkNavProgress === undefined) state.parkNavProgress = 0;

    (function draw() {
        const w = c.width,
            h = c.height,
            t = Date.now() / 1000;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#f0f2f5";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "rgba(66,133,244,.04)";
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
        // Parking lots
        lots.forEach((lot) => {
            const lx = w * lot.x,
                ly = h * lot.y,
                lw = w * lot.w,
                lh = h * lot.h;
            ctx.fillStyle = lot.c + "15";
            ctx.strokeStyle = lot.c + "40";
            ctx.lineWidth = 1.5;
            roundRect(ctx, lx, ly, lw, lh, 8);
            ctx.fill();
            ctx.stroke();
            const cols = Math.floor(lw / 18),
                rows = Math.floor(lh / 25);
            for (let r = 0; r < rows; r++) {
                for (let c2 = 0; c2 < cols; c2++) {
                    const sx = lx + 8 + c2 * 16,
                        sy = ly + 20 + r * 22;
                    const filled = ((r * cols + c2) * 17 + Math.floor(t / 3)) % 100 < lot.pct;
                    ctx.fillStyle = filled ? lot.c + "30" : "rgba(52,168,83,.1)";
                    ctx.fillRect(sx, sy, 12, 16);
                    ctx.strokeStyle = filled ? lot.c + "50" : "rgba(52,168,83,.2)";
                    ctx.lineWidth = 0.5;
                    ctx.strokeRect(sx, sy, 12, 16);
                }
            }
            ctx.fillStyle = "rgba(0,0,0,.5)";
            ctx.font = "bold 12px Outfit";
            ctx.textAlign = "center";
            ctx.fillText(lot.l, lx + lw / 2, ly + 14);
            ctx.fillStyle = lot.c;
            ctx.font = "bold 11px Outfit";
            ctx.fillText(lot.pct + "%", lx + lw / 2, ly + lh - 6);
        });
        // Car marker (always visible, pulsing)
        const carX = w * carFrac.x,
            carY = h * carFrac.y;
        const carPulse = 12 + Math.sin(t * 2) * 4;
        ctx.beginPath();
        ctx.arc(carX, carY, carPulse, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(66,133,244,.08)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(carX, carY, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#4285F4";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#4285F4";
        ctx.font = "bold 10px Inter";
        ctx.textAlign = "left";
        ctx.fillText("🚗 Your Car", carX + 14, carY + 4);
        // Stadium icon
        ctx.fillStyle = "rgba(0,0,0,.08)";
        ctx.font = "20px Outfit";
        ctx.textAlign = "center";
        ctx.fillText("🏟️", w * 0.5, h * 0.52);
        ctx.fillStyle = "rgba(0,0,0,.15)";
        ctx.font = "8px Inter";
        ctx.fillText("STADIUM EXIT", w * 0.5, h * 0.58);

        // Live navigation route
        if (state.parkNav) {
            state.parkNavProgress += 0.0005;
            if (state.parkNavProgress > 1) state.parkNavProgress = 1;
            // Route glow
            ctx.strokeStyle = "rgba(66,133,244,.1)";
            ctx.lineWidth = 12;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            navRoute.forEach((p, i) => {
                i === 0 ? ctx.moveTo(w * p.x, h * p.y) : ctx.lineTo(w * p.x, h * p.y);
            });
            ctx.stroke();
            // Marching dashes
            const dashOff = -(t * 40) % 20;
            ctx.strokeStyle = "#4285F4";
            ctx.lineWidth = 3;
            ctx.setLineDash([10, 6]);
            ctx.lineDashOffset = dashOff;
            ctx.beginPath();
            navRoute.forEach((p, i) => {
                i === 0 ? ctx.moveTo(w * p.x, h * p.y) : ctx.lineTo(w * p.x, h * p.y);
            });
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.lineDashOffset = 0;
            ctx.lineCap = "butt";
            // Direction arrows
            for (let f = 0.15; f < 0.85; f += 0.2) {
                const p1 = ptAlongAcc(navRoute, f, w, h),
                    p2 = ptAlongAcc(navRoute, Math.min(f + 0.02, 1), w, h);
                const ang = Math.atan2(p2.y - p1.y, p2.x - p1.x);
                ctx.save();
                ctx.translate(p1.x, p1.y);
                ctx.rotate(ang);
                ctx.fillStyle = "rgba(66,133,244,.45)";
                ctx.beginPath();
                ctx.moveTo(7, 0);
                ctx.lineTo(-3, -4);
                ctx.lineTo(-3, 4);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
            // Moving user dot
            const userP = ptAlongAcc(navRoute, state.parkNavProgress, w, h);
            const upulse = 10 + Math.sin(t * 3) * 3;
            ctx.beginPath();
            ctx.arc(userP.x, userP.y, upulse, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(66,133,244,.1)";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(userP.x, userP.y, 7, 0, Math.PI * 2);
            ctx.fillStyle = "#4285F4";
            ctx.fill();
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2.5;
            ctx.stroke();
            ctx.fillStyle = "rgba(66,133,244,.7)";
            ctx.font = "bold 10px Inter";
            ctx.textAlign = "left";
            ctx.fillText("🚶 You", userP.x + 12, userP.y + 4);
            // Distance remaining
            const totalDist = 180; //meters
            const remaining = Math.round(totalDist * (1 - state.parkNavProgress));
            ctx.fillStyle = "rgba(66,133,244,.8)";
            ctx.font = "bold 11px Outfit";
            ctx.textAlign = "center";
            ctx.fillText(remaining > 0 ? remaining + "m remaining" : "Arrived!", w * 0.5, h * 0.97);
            // ETA box
            if (state.parkNavProgress < 1) {
                const eta = Math.ceil(remaining / 1.3 / 60);
                ctx.fillStyle = "rgba(66,133,244,.08)";
                roundRect(ctx, w * 0.35, h * 0.62, w * 0.3, 24, 6);
                ctx.fill();
                ctx.fillStyle = "#4285F4";
                ctx.font = "bold 10px Inter";
                ctx.textAlign = "center";
                ctx.fillText("⏱️ ETA: ~" + Math.max(eta, 1) + " min · " + remaining + "m", w * 0.5, h * 0.62 + 16);
            } else {
                ctx.fillStyle = "rgba(52,168,83,.08)";
                roundRect(ctx, w * 0.35, h * 0.62, w * 0.3, 24, 6);
                ctx.fill();
                ctx.fillStyle = "#34A853";
                ctx.font = "bold 10px Inter";
                ctx.textAlign = "center";
                ctx.fillText("✅ You have arrived at your car!", w * 0.5, h * 0.62 + 16);
            }
        }
        window._parkAnimId = requestAnimationFrame(draw);
    })();
}

// ============================================
// Queue System
// ============================================
function initQueue() {
    const el = document.getElementById("queue-list");
    if (!el) return;
    const items = [
        {
            type: "food",
            icon: "fa-burger",
            name: "Main Food Court A",
            loc: "North Concourse, Lvl 1",
            wait: "12m",
            cls: "slow",
            ppl: 48,
        },
        {
            type: "food",
            icon: "fa-pizza-slice",
            name: "Pizza Express",
            loc: "East Wing, Lvl 2",
            wait: "6m",
            cls: "mid",
            ppl: 22,
        },
        {
            type: "food",
            icon: "fa-mug-hot",
            name: "Beverage Station B",
            loc: "South Concourse, Lvl 1",
            wait: "2m",
            cls: "fast",
            ppl: 8,
            rec: true,
        },
        {
            type: "merch",
            icon: "fa-shirt",
            name: "Official Merch Store",
            loc: "Main Entrance, Lvl 0",
            wait: "15m",
            cls: "slow",
            ppl: 62,
        },
        {
            type: "restroom",
            icon: "fa-restroom",
            name: "Restroom Block C",
            loc: "West Wing, Lvl 1",
            wait: "1m",
            cls: "fast",
            ppl: 3,
            rec: true,
        },
    ];
    items.forEach((q) => {
        const d = document.createElement("div");
        d.className = "q-item";
        d.dataset.type = q.type;
        d.innerHTML = `<div class="qi-icon ${q.type}"><i class="fas ${q.icon}"></i></div><div class="qi-info"><span class="qi-name">${q.name}</span><span class="qi-loc">${q.loc}</span></div><div class="qi-wait"><span class="qi-time ${q.cls}">${q.wait}</span><span class="qi-ppl"><i class="fas fa-users"></i> ${q.ppl}</span></div><button class="btn-join${q.rec ? " rec" : ""}">${q.rec ? "⭐ Recommended" : "Join Queue"}</button>`;
        d.querySelector(".btn-join").addEventListener("click", () => joinQueue(q, d.querySelector(".btn-join")));
        el.appendChild(d);
    });
    // Filter
    document.querySelectorAll(".chip[data-filter]").forEach((ch) => {
        ch.addEventListener("click", () => {
            ch.parentElement.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
            ch.classList.add("active");
            const f = ch.dataset.filter;
            document.querySelectorAll(".q-item").forEach((i) => {
                i.style.display = f === "all" || i.dataset.type === f ? "flex" : "none";
            });
        });
    });
}
function joinQueue(q, btn) {
    if (state.activeQueue) {
        showToast("warning", "Already Queued", "Leave your current queue first.");
        return;
    }
    state.activeQueue = { name: q.name, wait: q.wait, pos: Math.floor(Math.random() * 10) + 3 };
    const el = document.getElementById("your-queue");
    el.innerHTML = `<div style="text-align:center;padding:12px"><div style="font-family:Outfit;font-size:2.5rem;font-weight:900;background:linear-gradient(135deg,#4285F4,#7C3AED);-webkit-background-clip:text;-webkit-text-fill-color:transparent">#${state.activeQueue.pos}</div><span style="font-size:.72rem;color:var(--text-ter);text-transform:uppercase;letter-spacing:.04em;display:block;margin-bottom:10px">Your Position</span><div style="font-size:.88rem;font-weight:600;color:var(--blue);margin-bottom:12px">${q.name}</div><div style="display:flex;justify-content:center;gap:20px;margin-bottom:14px"><div style="text-align:center"><span style="font-family:Outfit;font-weight:700;font-size:1.1rem;display:block">${q.wait}</span><span style="font-size:.65rem;color:var(--text-ter)">Est. Wait</span></div><div style="text-align:center"><span style="font-family:Outfit;font-weight:700;font-size:1.1rem;display:block">${state.activeQueue.pos - 1}</span><span style="font-size:.65rem;color:var(--text-ter)">Ahead</span></div></div><button class="btn-outline" id="leave-q" style="color:var(--red);border-color:rgba(234,67,53,.3)">Leave Queue</button></div>`;
    document.getElementById("leave-q").addEventListener("click", leaveQueue);
    btn.textContent = "✓ Joined";
    btn.style.opacity = ".5";
    btn.disabled = true;
    showToast("success", "Joined Queue!", `You're #${state.activeQueue.pos} at ${q.name}.`);
    simulateQueueProgress();
}
function leaveQueue() {
    state.activeQueue = null;
    document.getElementById("your-queue").innerHTML =
        '<div class="empty-state"><i class="fas fa-inbox"></i><p>No active queue</p><small>Join a virtual queue to skip the line!</small></div>';
    document.querySelectorAll(".btn-join").forEach((b) => {
        if (b.textContent === "✓ Joined") {
            b.textContent = "Join Queue";
            b.style.opacity = "1";
            b.disabled = false;
        }
    });
    showToast("info", "Left Queue", "You have left the virtual queue.");
}
function simulateQueueProgress() {
    const iv = setInterval(() => {
        if (!state.activeQueue || state.activeQueue.pos <= 1) {
            clearInterval(iv);
            if (state.activeQueue) showToast("success", "🎉 Your Turn!", `Head to ${state.activeQueue.name} now!`);
            return;
        }
        state.activeQueue.pos--;
        const el = document.querySelector("#your-queue div div:first-child");
        if (el) el.textContent = `#${state.activeQueue.pos}`;
    }, 6000);
}

// ============================================
// Food Menu
// ============================================
function initFoodMenu() {
    const el = document.getElementById("menu-grid");
    if (!el) return;
    const items = [
        { emoji: "🍔", name: "Smash Burger", vendor: "Grill House", price: 12.99, time: "3 min" },
        { emoji: "🍕", name: "Margherita Pizza", vendor: "Pizza Express", price: 10.99, time: "5 min" },
        { emoji: "🌮", name: "Loaded Tacos", vendor: "Taco Shack", price: 9.49, time: "2 min" },
        { emoji: "🍺", name: "Craft IPA", vendor: "Beer Garden", price: 8.99, time: "1 min" },
        { emoji: "🥤", name: "Fresh Lemonade", vendor: "Juice Bar", price: 5.49, time: "1 min" },
        { emoji: "🍿", name: "Loaded Nachos", vendor: "Snack Stand", price: 7.99, time: "2 min" },
        { emoji: "🌭", name: "Stadium Dog", vendor: "Hot Dog Cart", price: 6.49, time: "1 min" },
        { emoji: "🍦", name: "Gelato Cup", vendor: "Sweet Spot", price: 4.99, time: "1 min" },
    ];
    items.forEach((item) => {
        const d = document.createElement("div");
        d.className = "menu-item";
        d.innerHTML = `<div class="mi-top"><span class="mi-emoji">${item.emoji}</span><div class="mi-info"><span class="mi-name">${item.name}</span><span class="mi-vendor">${item.vendor}</span></div></div><div class="mi-bottom"><span class="mi-price">$${item.price.toFixed(2)}</span><span class="mi-time">⏱ ${item.time}</span><button class="btn-add">+ Add</button></div>`;
        d.querySelector(".btn-add").addEventListener("click", (e) => {
            e.stopPropagation();
            addToCart(item);
        });
        el.appendChild(d);
    });
}
function addToCart(item) {
    state.cart.push(item);
    renderCart();
    showToast("success", "Added!", `${item.name} added to cart.`);
}
function renderCart() {
    const el = document.getElementById("cart-body");
    if (state.cart.length === 0) {
        el.innerHTML = '<div class="empty-state small"><i class="fas fa-cart-plus"></i><p>Cart is empty</p></div>';
        return;
    }
    let html = "";
    const total = state.cart.reduce((s, i) => s + i.price, 0);
    state.cart.forEach((item, idx) => {
        html += `<div class="cart-item"><span class="ci-emoji">${item.emoji}</span><div class="ci-info"><span class="ci-name">${item.name}</span><span class="ci-price">$${item.price.toFixed(2)}</span></div><button class="ci-remove" data-idx="${idx}"><i class="fas fa-times"></i></button></div>`;
    });
    html += `<div class="cart-total"><span class="cart-total-label">Total</span><span class="cart-total-val">$${total.toFixed(2)}</span></div><button class="btn-primary full-w" style="margin-top:12px" onclick="placeOrder()"><i class="fas fa-check"></i> Place Order</button>`;
    el.innerHTML = html;
    el.querySelectorAll(".ci-remove").forEach((b) => {
        b.addEventListener("click", () => {
            state.cart.splice(parseInt(b.dataset.idx), 1);
            renderCart();
        });
    });
}
function placeOrder() {
    if (state.cart.length === 0) return;
    const total = state.cart.reduce((s, i) => s + i.price, 0);
    showToast("success", "Order Placed! 🎉", `$${total.toFixed(2)} — Ready in ~3 min at nearest pickup.`);
    state.cart = [];
    renderCart();
}

// ============================================
// Fan Buttons
// ============================================
function initFanBtns() {
    document.querySelectorAll(".fan-btn").forEach((b) => {
        b.addEventListener("click", () => {
            b.style.transform = "scale(.95)";
            setTimeout(() => (b.style.transform = ""), 200);
            const ct = b.querySelector(".fb-count");
            const v = parseFloat(ct.textContent);
            ct.textContent = (v + 0.1).toFixed(1) + "K";
            showToast("success", `${b.querySelector(".fb-name").textContent}! 🎉`, "Shared with the stadium!");
        });
    });
}

// ============================================
// Destinations — Interactive route switching
// ============================================
function initDests() {
    document.querySelectorAll(".dest-card").forEach((b) => {
        b.addEventListener("click", () => {
            const dest = b.dataset.dest;
            if (dest && state.wayRoutes[dest]) {
                // Reset progress for new route
                state.wayDest = dest;
                state.wayProgress = 0;
                // Update route card
                const rc = document.getElementById("route-card");
                if (rc) rc.classList.remove("hidden");
                const info = state.wayRoutes[dest];
                // Update route details in the card
                const etaEl = rc?.querySelector(".eta-big");
                if (etaEl) etaEl.textContent = info.time;
                const metaEl = rc?.querySelector(".route-meta");
                if (metaEl)
                    metaEl.innerHTML = `<span><i class="fas fa-shoe-prints"></i> ${info.dist}</span><span><i class="fas fa-stairs"></i> ${info.levels} level(s)</span>`;
                // Update route steps
                const stepsEl = rc?.querySelector(".route-steps");
                if (stepsEl)
                    stepsEl.innerHTML = `<div class="rs"><div class="rs-dot current"></div><div class="rs-info"><span>From your current position</span><small>Section B corridor</small></div></div><div class="rs"><div class="rs-dot"></div><div class="rs-info"><span>Follow highlighted route</span><small>Main concourse</small></div></div><div class="rs"><div class="rs-dot dest"></div><div class="rs-info"><span>Arrive at ${info.label}</span><small>Est. ${info.time}</small></div></div>`;
                // Highlight active destination
                document.querySelectorAll(".dest-card").forEach((d) => (d.style.borderColor = "transparent"));
                b.style.borderColor = "var(--blue)";
                // Redraw wayfinding canvas with new route
                initWayfindingCanvas();
                showToast("info", "Route Updated", `Navigating to ${info.label} — ${info.dist}, ~${info.time}.`);
            }
        });
    });
}

// ============================================
// Evac Simulate
// ============================================
function initEvacBtn() {
    const btn = document.getElementById("sim-evac-btn");
    if (!btn) return;
    btn.addEventListener("click", () => {
        state.evacSim = !state.evacSim;
        // Reset people positions on toggle
        _evacPeople.forEach((p) => {
            p.progress = Math.random();
            p.gate = Math.floor(Math.random() * 8);
        });
        btn.innerHTML = state.evacSim ? '<i class="fas fa-stop"></i> Stop' : '<i class="fas fa-play"></i> Simulate';
        showToast(
            state.evacSim ? "warning" : "success",
            state.evacSim ? "Simulation Active" : "Simulation Ended",
            state.evacSim ? "Dynamic routing engaged — watch people flow to exits." : "Normal monitoring restored.",
        );
    });
}

// ============================================
// SOS
// ============================================
function initSOS() {
    const btn = document.getElementById("sos-btn");
    if (!btn) return;
    btn.addEventListener("click", () => {
        showToast("error", "🚨 SOS Sent", "Security dispatched to Section B, Row 12, Seat 5.");
    });
}

// ============================================
// Mobile Menu
// ============================================
function initMobile() {
    const h = document.getElementById("hamburger"),
        s = document.getElementById("sidebar");
    if (h && s) h.addEventListener("click", () => s.classList.toggle("open"));
}

// ============================================
// Notification Panel
// ============================================
function initNotifPanel() {
    const btn = document.getElementById("notif-btn"),
        panel = document.getElementById("notif-panel"),
        close = document.getElementById("np-close");
    if (btn) btn.addEventListener("click", () => panel.classList.toggle("hidden"));
    if (close) close.addEventListener("click", () => panel.classList.add("hidden"));
}

// ============================================
// Stats Update
// ============================================
function updateStats() {
    const el = document.getElementById("mc-attendance");
    if (el) {
        const v = 52400 + (Math.random() - 0.5) * 80;
        el.textContent = Math.round(v).toLocaleString();
    }
    const w = document.getElementById("mc-wait");
    if (w) {
        const v = 4.2 + (Math.random() - 0.5) * 0.6;
        w.textContent = v.toFixed(1) + "m";
    }
    const s = document.getElementById("mc-satisfaction");
    if (s) {
        const v = 94 + (Math.random() - 0.5) * 3;
        s.textContent = v.toFixed(0) + "%";
    }
}

// ============================================
// Toast System
// ============================================
function showToast(type, title, msg) {
    const box = document.getElementById("toast-box");
    const icons = {
        info: "fa-info-circle",
        success: "fa-check-circle",
        warning: "fa-triangle-exclamation",
        error: "fa-circle-xmark",
    };
    const t = document.createElement("div");
    t.className = `toast ${type}`;
    t.innerHTML = `<div class="toast-icon"><i class="fas ${icons[type]}"></i></div><div class="toast-content"><div class="toast-title">${title}</div><div class="toast-msg">${msg}</div></div><button class="toast-close" onclick="this.parentElement.classList.add('removing');setTimeout(()=>this.parentElement.remove(),300)"><i class="fas fa-times"></i></button><div class="toast-bar"></div>`;
    box.appendChild(t);
    setTimeout(() => {
        if (t.parentElement) {
            t.classList.add("removing");
            setTimeout(() => t.remove(), 300);
        }
    }, 5000);
}

// ============================================
// Accessibility — Full Interactivity
// ============================================
function initAccessibility() {
    initElevatorNav();
    initWheelchairRoutes();
    initAudioEnhancement();
    initLiveCaptions();
    initQuietRoom();
    initCompanionSupport();
    initElevatorUpdates();
}

// --- Elevator Navigation ---
window._accNavElevNum = "1";
function initElevatorNav() {
    const btn = document.getElementById("btn-elev-nav");
    if (!btn) return;

    let selectedElevator = null;
    const items = document.querySelectorAll(".elev-item");
    items.forEach((item) => {
        item.addEventListener("click", () => {
            if (!item.classList.contains("ok")) {
                showToast("warning", "Elevator Unavailable", "Please select an available elevator (green).");
                return;
            }
            items.forEach((i) => {
                i.style.borderColor = "";
                i.style.transform = "";
            });
            item.style.borderColor = "var(--blue)";
            item.style.transform = "scale(1.05)";
            selectedElevator = item;
            document.getElementById("elev-nearest").innerHTML = `Elevator ${item.dataset.elev} Selected`;
        });
    });

    btn.addEventListener("click", () => {
        const okItems = document.querySelectorAll(".elev-item.ok");
        if (okItems.length === 0) {
            showToast("warning", "No Elevators", "All elevators are currently busy.");
            return;
        }

        const target = selectedElevator || okItems[0];
        const elevNum = target.dataset.elev;
        window._accNavElevNum = elevNum;

        // Activate route on the map
        if (_accNavTarget === "elevator") {
            _accNavTarget = null;
            _accNavProgress = 0;
            btn.textContent = "Navigate";
            btn.style.borderColor = "";
            btn.style.color = "";
            showToast("info", "Navigation Stopped", "Elevator route cleared from map.");
        } else {
            _accNavTarget = "elevator";
            _accNavProgress = 0;
            showToast("success", "Navigating to Elevator E" + elevNum, "Follow the animated blue route on the map.");
            target.style.transform = "scale(1.15)";
            target.style.boxShadow = "0 0 12px rgba(66,133,244,.4)";
            setTimeout(() => {
                if (selectedElevator !== target) target.style.transform = "";
                else target.style.transform = "scale(1.05)";
                target.style.boxShadow = "";
            }, 2000);
            btn.textContent = "✓ Stop Nav";
            btn.style.borderColor = "var(--blue)";
            btn.style.color = "var(--blue)";
            // Reset wheelchair btn if active
            const wcBtn = document.getElementById("btn-wheelchair-routes");
            if (wcBtn && wcBtn.textContent.includes("Stop")) {
                wcBtn.textContent = "View Routes";
                wcBtn.style.borderColor = "";
                wcBtn.style.color = "";
            }
        }
    });
}

// Simulate elevator floor changes every few seconds
function initElevatorUpdates() {
    const floors = ["L1", "L2", "L3", "L1"];
    const statuses = ["ok", "busy", "ok"];
    setInterval(() => {
        const items = document.querySelectorAll(".elev-item:not(.maint)");
        if (!items.length) return;
        // Randomly update one elevator
        const idx = Math.floor(Math.random() * items.length);
        const item = items[idx];
        const newFloor = floors[Math.floor(Math.random() * floors.length)];
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        item.querySelector(".elev-floor").textContent = newFloor;
        item.className = "elev-item " + newStatus;
        // Update nearest display
        const okItems = document.querySelectorAll(".elev-item.ok");
        const nearestEl = document.getElementById("elev-nearest");
        if (nearestEl && okItems.length > 0) {
            const nearest = okItems[0];
            const dist = 30 + Math.floor(Math.random() * 40);
            nearestEl.textContent = `Elevator ${nearest.dataset.elev} — ${dist}m`;
        }
    }, 4000);
}

// --- Wheelchair Routes ---
function initWheelchairRoutes() {
    const btn = document.getElementById("btn-wheelchair-routes");
    const info = document.getElementById("wc-route-info");
    if (!btn || !info) return;
    let visible = false;
    btn.addEventListener("click", () => {
        visible = !visible;
        if (visible) {
            info.classList.remove("hidden");
            // Activate wheelchair route on the map
            _accNavTarget = "wheelchair";
            _accNavProgress = 0;
            btn.textContent = "✓ Stop Route";
            btn.style.borderColor = "var(--green)";
            btn.style.color = "var(--green)";
            showToast("success", "Accessible Route Active", "Green route shown on the map: 140m, 2 ramps.");
            // Reset elevator btn if active
            const elBtn = document.getElementById("btn-elev-nav");
            if (elBtn && elBtn.textContent.includes("Stop")) {
                elBtn.textContent = "Navigate";
                elBtn.style.borderColor = "";
                elBtn.style.color = "";
            }
        } else {
            info.classList.add("hidden");
            _accNavTarget = null;
            _accNavProgress = 0;
            btn.textContent = "View Routes";
            btn.style.borderColor = "";
            btn.style.color = "";
        }
    });
}

// --- Audio Enhancement ---
function initAudioEnhancement() {
    const btn = document.getElementById("btn-audio-connect");
    const ui = document.getElementById("audio-connected-ui");
    const statusText = document.getElementById("audio-status-text");
    if (!btn || !ui) return;
    let connected = false;
    btn.addEventListener("click", () => {
        if (!connected) {
            connected = true;
            btn.textContent = "Connecting...";
            btn.style.opacity = ".6";
            setTimeout(() => {
                ui.classList.remove("hidden");
                statusText.style.display = "none";
                btn.textContent = "Disconnect";
                btn.style.opacity = "1";
                btn.style.borderColor = "var(--red)";
                btn.style.color = "var(--red)";
                showToast("success", "T-Loop Connected", "Hearing aid connected via T-loop. Commentary: English.");
            }, 1500);
        } else {
            connected = false;
            ui.classList.add("hidden");
            statusText.style.display = "";
            btn.textContent = "Connect";
            btn.style.borderColor = "";
            btn.style.color = "";
            showToast("info", "Disconnected", "T-loop audio disconnected.");
        }
    });
    // Volume slider
    const vol = document.getElementById("audio-vol");
    const volVal = document.getElementById("audio-vol-val");
    if (vol && volVal) {
        vol.addEventListener("input", () => {
            volVal.textContent = vol.value + "%";
        });
    }
    // Language change
    const lang = document.getElementById("audio-lang");
    if (lang) {
        lang.addEventListener("change", () => {
            const langNames = {
                en: "English",
                es: "Español",
                fr: "Français",
                de: "Deutsch",
                pt: "Português",
                ja: "日本語",
                zh: "中文",
                ar: "العربية",
                hi: "हिन्दी",
                ko: "한국어",
                it: "Italiano",
                nl: "Nederlands",
            };
            showToast("info", "Language Changed", `Commentary now in ${langNames[lang.value] || lang.value}.`);
        });
    }
}

// --- Live Captions ---
function initLiveCaptions() {
    const btn = document.getElementById("btn-captions-toggle");
    const ui = document.getElementById("captions-ui");
    const statusText = document.getElementById("caption-status-text");
    const display = document.getElementById("captions-display");
    if (!btn || !ui) return;
    let enabled = false;
    let captionInterval = null;
    const captionLines = [
        "And Thunder FC maintaining possession in the midfield...",
        "Strong tackle from Storm United's defender.",
        "Corner kick coming up for Thunder FC!",
        "The crowd is absolutely electric here at Apex Arena!",
        "Free kick awarded just outside the box.",
        "Stadium announcement: Exits 1-4 are clear for your convenience.",
        "What a save by the goalkeeper! Brilliant reflexes.",
        "Substitution for Storm United — number 14 coming on.",
        "Thunder FC pressing high up the pitch now.",
        "Stadium announcement: Food Court A wait time now 6 minutes.",
        "Goal kick for Storm United...",
        "Lovely through ball — but the flag is up for offside.",
        "The atmosphere is incredible with 52,000 fans cheering!",
    ];
    btn.addEventListener("click", () => {
        if (!enabled) {
            enabled = true;
            ui.classList.remove("hidden");
            statusText.style.display = "none";
            btn.textContent = "Disable";
            btn.style.borderColor = "var(--red)";
            btn.style.color = "var(--red)";
            showToast("success", "Captions Enabled", "Live captions are now streaming to your device.");
            // Start streaming captions
            captionInterval = setInterval(() => {
                const line = captionLines[Math.floor(Math.random() * captionLines.length)];
                const m = Math.floor(state.matchTime / 60);
                const s = state.matchTime % 60;
                const timeStr = `${m}:${s.toString().padStart(2, "0")}`;
                const el = document.createElement("div");
                el.className = "caption-line";
                el.innerHTML = `<span class="cap-time">${timeStr}</span><span class="cap-text">${line}</span>`;
                display.appendChild(el);
                display.scrollTop = display.scrollHeight;
                // Keep max 20 lines
                while (display.children.length > 20) display.removeChild(display.firstChild);
            }, 4000);
        } else {
            enabled = false;
            ui.classList.add("hidden");
            statusText.style.display = "";
            btn.textContent = "Enable";
            btn.style.borderColor = "";
            btn.style.color = "";
            if (captionInterval) clearInterval(captionInterval);
            showToast("info", "Captions Disabled", "Live captions turned off.");
        }
    });
    // Text size buttons
    document.querySelectorAll(".cap-sz").forEach((szBtn) => {
        szBtn.addEventListener("click", () => {
            document.querySelectorAll(".cap-sz").forEach((b) => b.classList.remove("active"));
            szBtn.classList.add("active");
            const size = szBtn.dataset.size;
            display.className = "captions-display" + (size !== "medium" ? " sz-" + size : "");
        });
    });
}

// --- Quiet Room ---
function initQuietRoom() {
    const reserveBtn = document.getElementById("btn-quiet-info");
    const resUI = document.getElementById("quiet-reservation");
    const pods = document.getElementById("quiet-pods");
    if (!reserveBtn) return;
    let reservedPod = null;
    let timerInterval = null;
    let timerSecs = 30 * 60;

    // Pod selection
    document.querySelectorAll(".pod-btn.available").forEach((pod) => {
        pod.addEventListener("click", () => {
            if (reservedPod) {
                showToast("warning", "Already Reserved", "Cancel current reservation first.");
                return;
            }
            reservedPod = pod.dataset.pod;
            // Update pod visuals
            pod.classList.remove("available");
            pod.classList.add("reserved");
            pod.querySelector("small").textContent = "Reserved";
            // Show reservation card
            document.getElementById("res-pod-num").textContent = reservedPod;
            resUI.classList.remove("hidden");
            reserveBtn.textContent = "Reserved ✓";
            reserveBtn.style.borderColor = "var(--green)";
            reserveBtn.style.color = "var(--green)";
            reserveBtn.style.opacity = ".6";
            showToast("success", "Pod Reserved!", `Quiet Room Pod ${reservedPod} is reserved. Section G, Gate 5.`);
            // Start countdown
            timerSecs = 30 * 60;
            timerInterval = setInterval(() => {
                timerSecs--;
                if (timerSecs <= 0) {
                    clearInterval(timerInterval);
                    cancelPodReservation();
                    return;
                }
                const mm = Math.floor(timerSecs / 60);
                const ss = timerSecs % 60;
                const timerEl = document.getElementById("res-timer");
                if (timerEl) timerEl.textContent = `${mm}:${ss.toString().padStart(2, "0")}`;
            }, 1000);
        });
    });

    // Also make the Reserve button select the first available pod
    reserveBtn.addEventListener("click", () => {
        if (reservedPod) return;
        const firstAvail = document.querySelector(".pod-btn.available");
        if (firstAvail) firstAvail.click();
        else showToast("warning", "No Pods Available", "All quiet room pods are currently occupied.");
    });

    // Cancel
    const cancelBtn = document.getElementById("btn-cancel-pod");
    if (cancelBtn) cancelBtn.addEventListener("click", cancelPodReservation);

    function cancelPodReservation() {
        if (!reservedPod) return;
        if (timerInterval) clearInterval(timerInterval);
        const pod = document.querySelector(`.pod-btn[data-pod="${reservedPod}"]`);
        if (pod) {
            pod.classList.remove("reserved");
            pod.classList.add("available");
            pod.querySelector("small").textContent = "Available";
        }
        reservedPod = null;
        resUI.classList.add("hidden");
        reserveBtn.textContent = "Reserve";
        reserveBtn.style.borderColor = "";
        reserveBtn.style.color = "";
        reserveBtn.style.opacity = "1";
        showToast("info", "Reservation Cancelled", "Quiet room pod released.");
    }
}

// --- Companion Support ---
function initCompanionSupport() {
    const reqBtn = document.getElementById("btn-companion-req");
    const compUI = document.getElementById("companion-ui");
    const statusText = document.getElementById("companion-status-text");
    if (!reqBtn) return;
    let requested = false;
    let progressInterval = null;
    let etaSeconds = 165; // 2:45

    reqBtn.addEventListener("click", () => {
        if (requested) return;
        requested = true;
        reqBtn.textContent = "Requesting...";
        reqBtn.style.opacity = ".6";
        showToast("info", "Finding Companion...", "Matching you with nearest accessibility staff.");

        setTimeout(() => {
            compUI.classList.remove("hidden");
            statusText.style.display = "none";
            reqBtn.textContent = "Requested ✓";
            reqBtn.style.borderColor = "var(--green)";
            reqBtn.style.color = "var(--green)";
            showToast("success", "Companion Assigned!", "Maria M. is on her way. ETA: 2:45.");

            // Animate progress
            const totalSecs = etaSeconds;
            let elapsed = 0;
            progressInterval = setInterval(() => {
                elapsed += 1;
                const pct = Math.min((elapsed / totalSecs) * 100, 100);
                const remaining = Math.max(totalSecs - elapsed, 0);
                const mm = Math.floor(remaining / 60);
                const ss = remaining % 60;
                const progressEl = document.getElementById("companion-progress");
                const etaEl = document.getElementById("companion-eta");
                if (progressEl) progressEl.style.width = pct + "%";
                if (etaEl) etaEl.textContent = `${mm}:${ss.toString().padStart(2, "0")}`;
                if (remaining <= 0) {
                    clearInterval(progressInterval);
                    showToast("success", "🎉 Companion Arrived!", "Maria M. has arrived at your location.");
                    if (etaEl) etaEl.textContent = "Arrived!";
                }
            }, 1000);
        }, 2000);
    });

    // Message button
    const msgBtn = document.getElementById("btn-msg-companion");
    if (msgBtn)
        msgBtn.addEventListener("click", () => {
            showToast("info", "Message Sent", 'Quick message sent to Maria M.: "On my way, be right there!"');
        });

    // Cancel button
    const cancelBtn = document.getElementById("btn-cancel-companion");
    if (cancelBtn)
        cancelBtn.addEventListener("click", () => {
            requested = false;
            if (progressInterval) clearInterval(progressInterval);
            compUI.classList.add("hidden");
            statusText.style.display = "";
            reqBtn.textContent = "Request";
            reqBtn.style.borderColor = "";
            reqBtn.style.color = "";
            reqBtn.style.opacity = "1";
            // Reset progress
            const progressEl = document.getElementById("companion-progress");
            if (progressEl) progressEl.style.width = "0%";
            const etaEl = document.getElementById("companion-eta");
            if (etaEl) etaEl.textContent = "2:45";
            showToast("info", "Companion Cancelled", "Companion request cancelled.");
        });
}

// ============================================
// Accessibility Canvas — Animated Venue Map
// ============================================
var _accAnimId = null;
var _accNavTarget = null; // 'elevator' or 'wheelchair'
var _accNavProgress = 0;

function initAccessCanvas() {
    const c = document.getElementById("access-canvas");
    if (!c) return;
    if (_accAnimId) cancelAnimationFrame(_accAnimId);
    const ctx = c.getContext("2d");
    const par = c.parentElement;
    c.width = par.clientWidth;
    c.height = 420;

    const elevators = [
        { x: 0.12, y: 0.15, num: "E1" },
        { x: 0.88, y: 0.15, num: "E2" },
        { x: 0.12, y: 0.85, num: "E3" },
        { x: 0.88, y: 0.85, num: "E4" },
        { x: 0.05, y: 0.5, num: "E5" },
        { x: 0.95, y: 0.5, num: "E6" },
        { x: 0.4, y: 0.08, num: "E7" },
        { x: 0.6, y: 0.92, num: "E8" },
    ];
    const ramps = [
        { x1: 0.18, y1: 0.3, x2: 0.18, y2: 0.45, label: "Ramp A (5%)" },
        { x1: 0.82, y1: 0.55, x2: 0.82, y2: 0.7, label: "Ramp B (4%)" },
    ];
    const wcRooms = [
        { x: 0.22, y: 0.08, w: 0.14, h: 0.1, label: "♿ WC" },
        { x: 0.64, y: 0.82, w: 0.14, h: 0.1, label: "♿ WC" },
    ];
    // Wheelchair-accessible route
    const wcRoute = [
        { x: 0.5, y: 0.75 },
        { x: 0.18, y: 0.75 },
        { x: 0.18, y: 0.45 },
        { x: 0.18, y: 0.3 },
        { x: 0.18, y: 0.15 },
        { x: 0.35, y: 0.15 },
        { x: 0.5, y: 0.25 },
    ];

    function getElevRoute(num) {
        switch (String(num)) {
            case "1":
                return [
                    { x: 0.5, y: 0.75 },
                    { x: 0.5, y: 0.5 },
                    { x: 0.18, y: 0.5 },
                    { x: 0.18, y: 0.15 },
                    { x: 0.12, y: 0.15 },
                ];
            case "2":
                return [
                    { x: 0.5, y: 0.75 },
                    { x: 0.5, y: 0.5 },
                    { x: 0.82, y: 0.5 },
                    { x: 0.82, y: 0.15 },
                    { x: 0.88, y: 0.15 },
                ];
            case "3":
                return [
                    { x: 0.5, y: 0.75 },
                    { x: 0.5, y: 0.85 },
                    { x: 0.12, y: 0.85 },
                ];
            case "4":
                return [
                    { x: 0.5, y: 0.75 },
                    { x: 0.5, y: 0.85 },
                    { x: 0.88, y: 0.85 },
                ];
            case "5":
                return [
                    { x: 0.5, y: 0.75 },
                    { x: 0.5, y: 0.5 },
                    { x: 0.05, y: 0.5 },
                ];
            case "6":
                return [
                    { x: 0.5, y: 0.75 },
                    { x: 0.5, y: 0.5 },
                    { x: 0.95, y: 0.5 },
                ];
            case "7":
                return [
                    { x: 0.5, y: 0.75 },
                    { x: 0.5, y: 0.5 },
                    { x: 0.5, y: 0.15 },
                    { x: 0.4, y: 0.15 },
                    { x: 0.4, y: 0.08 },
                ];
            case "8":
                return [
                    { x: 0.5, y: 0.75 },
                    { x: 0.5, y: 0.85 },
                    { x: 0.6, y: 0.85 },
                    { x: 0.6, y: 0.92 },
                ];
            default:
                return [
                    { x: 0.5, y: 0.75 },
                    { x: 0.5, y: 0.5 },
                    { x: 0.18, y: 0.5 },
                    { x: 0.18, y: 0.15 },
                    { x: 0.12, y: 0.15 },
                ];
        }
    }

    const userStart = { x: 0.5, y: 0.75 };

    (function draw() {
        const w = c.width,
            h = c.height,
            t = Date.now() / 1000;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#f0f2f5";
        ctx.fillRect(0, 0, w, h);
        // Grid
        ctx.strokeStyle = "rgba(66,133,244,.04)";
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 25) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += 25) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
        // Building outline
        const bx = w * 0.08,
            by = h * 0.05,
            bw = w * 0.84,
            bh = h * 0.9;
        ctx.strokeStyle = "rgba(66,133,244,.18)";
        ctx.lineWidth = 2;
        roundRect(ctx, bx, by, bw, bh, 16);
        ctx.stroke();
        // Inner concourse
        ctx.strokeStyle = "rgba(66,133,244,.08)";
        ctx.lineWidth = 1;
        roundRect(ctx, bx + bw * 0.12, by + bh * 0.12, bw * 0.76, bh * 0.76, 10);
        ctx.stroke();
        // Arena field
        ctx.fillStyle = "rgba(52,168,83,.04)";
        ctx.strokeStyle = "rgba(52,168,83,.12)";
        ctx.lineWidth = 1;
        roundRect(ctx, w * 0.35, h * 0.3, w * 0.3, h * 0.35, 8);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "rgba(52,168,83,.2)";
        ctx.font = "10px Outfit";
        ctx.textAlign = "center";
        ctx.fillText("ARENA", w * 0.5, h * 0.48);
        // Corridors (grey lines)
        ctx.strokeStyle = "rgba(0,0,0,.06)";
        ctx.lineWidth = 12;
        ctx.lineCap = "round";
        // Horizontal corridors
        ctx.beginPath();
        ctx.moveTo(w * 0.1, h * 0.5);
        ctx.lineTo(w * 0.9, h * 0.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(w * 0.1, h * 0.15);
        ctx.lineTo(w * 0.9, h * 0.15);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(w * 0.1, h * 0.85);
        ctx.lineTo(w * 0.9, h * 0.85);
        ctx.stroke();
        // Vertical corridors
        ctx.beginPath();
        ctx.moveTo(w * 0.18, h * 0.1);
        ctx.lineTo(w * 0.18, h * 0.9);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(w * 0.82, h * 0.1);
        ctx.lineTo(w * 0.82, h * 0.9);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(w * 0.5, h * 0.1);
        ctx.lineTo(w * 0.5, h * 0.28);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(w * 0.5, h * 0.67);
        ctx.lineTo(w * 0.5, h * 0.9);
        ctx.stroke();
        ctx.lineCap = "butt";
        // WC Rooms
        wcRooms.forEach((r) => {
            ctx.fillStyle = "rgba(124,58,237,.06)";
            ctx.strokeStyle = "rgba(124,58,237,.15)";
            ctx.lineWidth = 1;
            ctx.fillRect(w * r.x, h * r.y, w * r.w, h * r.h);
            ctx.strokeRect(w * r.x, h * r.y, w * r.w, h * r.h);
            ctx.fillStyle = "rgba(124,58,237,.4)";
            ctx.font = "9px Inter";
            ctx.textAlign = "center";
            ctx.fillText(r.label, w * (r.x + r.w / 2), h * (r.y + r.h / 2) + 3);
        });
        // Ramps
        ramps.forEach((r) => {
            ctx.strokeStyle = "rgba(249,115,22,.35)";
            ctx.lineWidth = 6;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(w * r.x1, h * r.y1);
            ctx.lineTo(w * r.x2, h * r.y2);
            ctx.stroke();
            ctx.lineCap = "butt";
            // Ramp icon
            const mx = (w * (r.x1 + r.x2)) / 2,
                my = (h * (r.y1 + r.y2)) / 2;
            ctx.fillStyle = "rgba(249,115,22,.6)";
            ctx.font = "bold 8px Inter";
            ctx.textAlign = "center";
            ctx.fillText("⬆ " + r.label, mx + 20, my);
        });
        // Active route (wheelchair or elevator)
        let activeRoute = null;
        if (_accNavTarget === "elevator") activeRoute = getElevRoute(window._accNavElevNum || "1");
        else if (_accNavTarget === "wheelchair") activeRoute = wcRoute;

        if (activeRoute) {
            _accNavProgress += 0.0006;
            if (_accNavProgress > 1) _accNavProgress = 0;
            // Route shadow
            ctx.strokeStyle = _accNavTarget === "elevator" ? "rgba(66,133,244,.1)" : "rgba(52,168,83,.1)";
            ctx.lineWidth = 10;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            activeRoute.forEach((p, i) => {
                i === 0 ? ctx.moveTo(w * p.x, h * p.y) : ctx.lineTo(w * p.x, h * p.y);
            });
            ctx.stroke();
            // Animated dashes
            const dashOff = -(t * 40) % 20;
            ctx.strokeStyle = _accNavTarget === "elevator" ? "#4285F4" : "#34A853";
            ctx.lineWidth = 3;
            ctx.setLineDash([10, 6]);
            ctx.lineDashOffset = dashOff;
            ctx.beginPath();
            activeRoute.forEach((p, i) => {
                i === 0 ? ctx.moveTo(w * p.x, h * p.y) : ctx.lineTo(w * p.x, h * p.y);
            });
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.lineDashOffset = 0;
            ctx.lineCap = "butt";
            // Direction arrows
            for (let f = 0.2; f < 0.9; f += 0.25) {
                const totalLen = getRouteLenAcc(activeRoute, w, h);
                const p1 = ptAlongAcc(activeRoute, f, w, h),
                    p2 = ptAlongAcc(activeRoute, Math.min(f + 0.02, 1), w, h);
                const ang = Math.atan2(p2.y - p1.y, p2.x - p1.x);
                ctx.save();
                ctx.translate(p1.x, p1.y);
                ctx.rotate(ang);
                ctx.fillStyle = _accNavTarget === "elevator" ? "rgba(66,133,244,.5)" : "rgba(52,168,83,.5)";
                ctx.beginPath();
                ctx.moveTo(6, 0);
                ctx.lineTo(-3, -4);
                ctx.lineTo(-3, 4);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
            // Animated user dot
            const userP = ptAlongAcc(activeRoute, _accNavProgress, w, h);
            const pulseR = 10 + Math.sin(t * 3) * 3;
            ctx.beginPath();
            ctx.arc(userP.x, userP.y, pulseR, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(66,133,244,.08)";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(userP.x, userP.y, 7, 0, Math.PI * 2);
            ctx.fillStyle = "#4285F4";
            ctx.fill();
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2.5;
            ctx.stroke();
            ctx.fillStyle = "rgba(66,133,244,.6)";
            ctx.font = "bold 10px Inter";
            ctx.textAlign = "left";
            ctx.fillText("You", userP.x + 12, userP.y + 4);
            // Destination marker
            const dest = activeRoute[activeRoute.length - 1];
            const destPulse = 10 + Math.sin(t * 2) * 3;
            const destCol = _accNavTarget === "elevator" ? "#4285F4" : "#34A853";
            ctx.beginPath();
            ctx.arc(w * dest.x, h * dest.y, destPulse, 0, Math.PI * 2);
            ctx.fillStyle = destCol + "15";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(w * dest.x, h * dest.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = destCol;
            ctx.fill();
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2.5;
            ctx.stroke();
            ctx.fillStyle = destCol;
            ctx.font = "13px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("📍", w * dest.x, h * dest.y - 14);
        } else {
            // Static user dot
            const ux = w * userStart.x,
                uy = h * userStart.y;
            const pulseR = 10 + Math.sin(t * 2) * 3;
            ctx.beginPath();
            ctx.arc(ux, uy, pulseR, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(66,133,244,.08)";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(ux, uy, 7, 0, Math.PI * 2);
            ctx.fillStyle = "#4285F4";
            ctx.fill();
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2.5;
            ctx.stroke();
            ctx.fillStyle = "rgba(66,133,244,.6)";
            ctx.font = "bold 10px Inter";
            ctx.textAlign = "left";
            ctx.fillText("You (Section B)", ux + 14, uy + 4);
        }
        // Elevators
        elevators.forEach((e, i) => {
            const ex = w * e.x,
                ey = h * e.y;
            const elItem = document.querySelector(`.elev-item[data-elev="${i + 1}"]`);
            const isMaint = elItem && elItem.classList.contains("maint");
            const isBusy = elItem && elItem.classList.contains("busy");
            const col = isMaint ? "#999" : isBusy ? "#F97316" : "#4285F4";
            // Elevator pulse
            if (!isMaint) {
                const ep = 14 + Math.sin(t * 2 + i) * 3;
                ctx.beginPath();
                ctx.arc(ex, ey, ep, 0, Math.PI * 2);
                ctx.fillStyle = col + "10";
                ctx.fill();
            }
            ctx.beginPath();
            ctx.arc(ex, ey, 10, 0, Math.PI * 2);
            ctx.fillStyle = col + "20";
            ctx.fill();
            ctx.strokeStyle = col;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = col;
            ctx.font = "bold 8px Outfit";
            ctx.textAlign = "center";
            ctx.fillText(e.num, ex, ey + 3);
            // Label
            ctx.fillStyle = isMaint ? "rgba(0,0,0,.25)" : "rgba(0,0,0,.4)";
            ctx.font = "7px Inter";
            ctx.fillText(isMaint ? "MAINT" : isBusy ? "IN USE" : "AVAIL", ex, ey + 18);
        });
        // Labels
        ctx.fillStyle = "rgba(0,0,0,.2)";
        ctx.font = "8px Inter";
        ctx.textAlign = "center";
        ctx.fillText("GATE 1", w * 0.12, h * 0.05 - 2);
        ctx.fillText("GATE 2", w * 0.88, h * 0.05 - 2);
        ctx.fillText("GATE 3", w * 0.12, h * 0.98);
        ctx.fillText("GATE 4", w * 0.88, h * 0.98);
        _accAnimId = requestAnimationFrame(draw);
    })();
}

function getRouteLenAcc(pts, w, h) {
    let len = 0;
    for (let i = 1; i < pts.length; i++) {
        const dx = w * pts[i].x - w * pts[i - 1].x,
            dy = h * pts[i].y - h * pts[i - 1].y;
        len += Math.sqrt(dx * dx + dy * dy);
    }
    return len;
}
function ptAlongAcc(pts, frac, w, h) {
    const totalLen = getRouteLenAcc(pts, w, h);
    let target = frac * totalLen,
        accum = 0;
    for (let i = 1; i < pts.length; i++) {
        const dx = w * pts[i].x - w * pts[i - 1].x,
            dy = h * pts[i].y - h * pts[i - 1].y;
        const segLen = Math.sqrt(dx * dx + dy * dy);
        if (accum + segLen >= target) {
            const t = (target - accum) / segLen;
            return { x: w * pts[i - 1].x + dx * t, y: h * pts[i - 1].y + dy * t };
        }
        accum += segLen;
    }
    return { x: w * pts[pts.length - 1].x, y: h * pts[pts.length - 1].y };
}

// ============================================
// Parking — Live Navigation to Car
// ============================================
var _parkNavAnimId = null;

function initParkingNav() {
    state.parkNav = true;
    state.parkNavProgress = 0;
    // The parking canvas will now show the animated route
    // Reinit to start the animation loop
    initParkingCanvas();
}
