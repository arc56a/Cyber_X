// تهيئة عناصر الكانفاس والمسرح
const canvas = document.querySelector(".scene");
const ctx = canvas.getContext("2d");
const stage = document.querySelector(".stage");

let width = 0;
let height = 0;
let dpr = 1;

// أنوية هادئة، أنيقة، ومتباعدة بدون ازدحام
const nodes = [];
const NODE_COUNT = 28; // عدد متوازن يمنح هدوء ومساحة مريحة للعين
const CONNECT_DIST = 125; // مدى الاتصال بين الأنوية

let touchPoint = null;

function initNodes() {
  nodes.length = 0;
  for (let i = 0; i < NODE_COUNT; i++) {
    const isMajor = i % 4 === 0;
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      // حركة بطيئة جداً وانسيابية لتعطي طابع الهدوء التام
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      phase: Math.random() * Math.PI * 2,
      radius: isMajor ? 2.4 : 1.5,
      isMajor: isMajor,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.012 + Math.random() * 0.008
    });
  }
}

function resize() {
  const rect = stage.getBoundingClientRect();
  const prevW = width;
  const prevH = height;
  width = rect.width;
  height = rect.height;
  if (!width || !height) return;

  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  if (nodes.length === 0) {
    initNodes();
  } else if (prevW && prevH) {
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].x = (nodes[i].x / prevW) * width;
      nodes[i].y = (nodes[i].y / prevH) * height;
    }
  }
  draw();
}

function draw() {
  if (!width || !height) return;

  // 1. خلفية سوداء عميقة مطعمة بلمسة أحمر داكن جداً وناعمة في العمق
  ctx.fillStyle = "#020102";
  ctx.fillRect(0, 0, width, height);

  // هالة خافتة جداً في عمق الشاشة
  const ambientGlow = ctx.createRadialGradient(
    width * 0.5, height * 0.45, 10,
    width * 0.5, height * 0.45, width * 0.75
  );
  ambientGlow.addColorStop(0, "rgba(90, 8, 20, 0.07)");
  ambientGlow.addColorStop(0.6, "rgba(50, 4, 10, 0.03)");
  ambientGlow.addColorStop(1, "rgba(2, 1, 2, 0)");
  ctx.fillStyle = ambientGlow;
  ctx.fillRect(0, 0, width, height);

  // 2. تحديث حركة الأنوية بسلاسة وهدوء
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    n.phase += 0.01;
    n.pulse += n.pulseSpeed;

    // تموج انسيابي خفيف كالطفو في الفضاء
    n.x += n.vx + Math.sin(n.phase) * 0.12;
    n.y += n.vy + Math.cos(n.phase) * 0.12;

    // ارتداد هادئ من الحواف
    if (n.x < 10) { n.x = 10; n.vx = Math.abs(n.vx); }
    else if (n.x > width - 10) { n.x = width - 10; n.vx = -Math.abs(n.vx); }

    if (n.y < 10) { n.y = 10; n.vy = Math.abs(n.vy); }
    else if (n.y > height - 10) { n.y = height - 10; n.vy = -Math.abs(n.vy); }
  }

  // 3. أسطح هندسية كريستالية هادئة وخافتة جداً عند تشكل مثلثات
  for (let i = 0; i < nodes.length; i++) {
    const n1 = nodes[i];
    for (let j = i + 1; j < nodes.length; j++) {
      const n2 = nodes[j];
      const d12 = Math.hypot(n1.x - n2.x, n1.y - n2.y);
      if (d12 > CONNECT_DIST * 0.8) continue;

      for (let k = j + 1; k < nodes.length; k++) {
        const n3 = nodes[k];
        const d23 = Math.hypot(n2.x - n3.x, n2.y - n3.y);
        const d31 = Math.hypot(n3.x - n1.x, n3.y - n1.y);

        if (d23 < CONNECT_DIST * 0.8 && d31 < CONNECT_DIST * 0.8) {
          const maxD = Math.max(d12, d23, d31);
          const facetAlpha = (1 - maxD / (CONNECT_DIST * 0.8)) * 0.038;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.lineTo(n3.x, n3.y);
          ctx.closePath();
          ctx.fillStyle = `rgba(189, 29, 50, ${facetAlpha})`;
          ctx.fill();
        }
      }
    }
  }

  // 4. خطوط الربط الهندسية الهادئة بين الأنوية بلون أحمر داكن راقٍ
  for (let i = 0; i < nodes.length; i++) {
    const n1 = nodes[i];

    for (let j = i + 1; j < nodes.length; j++) {
      const n2 = nodes[j];
      const dx = n1.x - n2.x;
      const dy = n1.y - n2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONNECT_DIST) {
        const ratio = 1 - dist / CONNECT_DIST;
        // شفافية ناعمة جداً تمنع أي إزعاج بصري
        const alpha = Math.pow(ratio, 1.4) * 0.38;

        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.strokeStyle = `rgba(189, 29, 50, ${alpha})`;
        ctx.lineWidth = Math.max(0.6, ratio * 1.2);
        ctx.stroke();
      }
    }

    // تفاعل هادئ مع اللمس
    if (touchPoint) {
      const tdx = n1.x - touchPoint.x;
      const tdy = n1.y - touchPoint.y;
      const tdist = Math.sqrt(tdx * tdx + tdy * tdy);
      if (tdist < CONNECT_DIST * 1.2) {
        const tRatio = 1 - tdist / (CONNECT_DIST * 1.2);
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(touchPoint.x, touchPoint.y);
        ctx.strokeStyle = `rgba(189, 29, 50, ${tRatio * 0.45})`;
        ctx.lineWidth = tRatio * 1.2;
        ctx.stroke();
      }
    }
  }

  // 5. رسم الأنوية المشعة باللون الأحمر الداكن والمركز الياقوتي
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    const pulseVal = Math.sin(n.pulse);
    const r = n.radius + pulseVal * 0.35;

    // هالة إشعاع النواة الداكنة الناعمة
    ctx.beginPath();
    ctx.arc(n.x, n.y, r + 4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(143, 14, 36, 0.16)";
    ctx.fill();

    // حلقة ناعمة للأنوية المميزة
    if (n.isMajor) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, r + 5.5, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(189, 29, 50, 0.22)";
      ctx.lineWidth = 0.75;
      ctx.stroke();
    }

    // قلب النواة بلون قرمزي داكن مع مركز ناصع هادئ
    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.fillStyle = n.isMajor ? "#ff6b7e" : "#bd1d32";
    ctx.shadowColor = "#8f0e24";
    ctx.shadowBlur = 8;
    ctx.fill();

    // نقطة ضوء لؤلؤية دقيقة في مركز النواة الكبرى
    if (n.isMajor) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 0.8, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }

    ctx.shadowBlur = 0;
  }

  requestAnimationFrame(draw);
}

// تفاعل اللمس الناعم
stage.addEventListener("pointerdown", (e) => {
  const rect = stage.getBoundingClientRect();
  touchPoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };
});
stage.addEventListener("pointermove", (e) => {
  if (touchPoint) {
    const rect = stage.getBoundingClientRect();
    touchPoint.x = e.clientX - rect.left;
    touchPoint.y = e.clientY - rect.top;
  }
});
window.addEventListener("pointerup", () => { touchPoint = null; });
window.addEventListener("pointercancel", () => { touchPoint = null; });

window.addEventListener("resize", resize);
window.addEventListener("orientationchange", resize);
new ResizeObserver(resize).observe(stage);
resize();

// تبديل النصوص كل 3 ثواني بسلاسة
const tickerMessages = [
  "مرحباً بك في المنظومة الرقمية لـ Cyber X",
  "حلول برمجية وأمان رقمي متقدم",
  "تابع حساباتنا الرسمية على منصات التواصل",
  "حمّل الآن تطبيقنا الخاص بهواتف الأندرويد",
  "Signal Found. Future Online."
];
let tickerIndex = 0;
const tickerEl = document.getElementById("cyclingText");

if (tickerEl) {
  setInterval(() => {
    tickerEl.classList.add("fade-out");
    setTimeout(() => {
      tickerIndex = (tickerIndex + 1) % tickerMessages.length;
      tickerEl.textContent = tickerMessages[tickerIndex];
      tickerEl.classList.remove("fade-out");
      tickerEl.classList.add("fade-in");
      setTimeout(() => {
        tickerEl.classList.remove("fade-in");
      }, 40);
    }, 350);
  }, 3000);
}

