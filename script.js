const themeToggle = document.getElementById("themeToggle");
const body = document.body;
const chips = document.querySelectorAll(".card-actions .chip, .card-header .chip");
const comparisonBars = document.querySelectorAll(".comparison-bar .bar span");
const comparisonValueLabels = document.querySelectorAll(".comparison-bar .value");
const leaderboard = document.querySelector(".leaderboard");

const palette = {
  accuracy: [0.92, 0.87, 0.81, 0.75],
  latency: [0.72, 0.79, 0.68, 0.65],
  cost: [0.65, 0.58, 0.63, 0.55],
};

const seasons = {
  q1: [
    { name: "Atlas-X", info: "دقة 98.2% | زمن 380ms", score: 9210, tone: "positive" },
    { name: "NovaMind", info: "دقة 96.7% | زمن 420ms", score: 8860 },
    { name: "Sentinel", info: "دقة 94.1% | زمن 450ms", score: 8020, tone: "warn" },
    { name: "Aurora", info: "دقة 92.8% | زمن 470ms", score: 7910 },
  ],
  q2: [
    { name: "Atlas-X", info: "دقة 97.4% | زمن 340ms", score: 9340, tone: "positive" },
    { name: "Aurora", info: "دقة 95.1% | زمن 390ms", score: 8840 },
    { name: "NovaMind", info: "دقة 93.6% | زمن 410ms", score: 8525 },
    { name: "Sentinel", info: "دقة 90.2% | زمن 430ms", score: 7800, tone: "warn" },
  ],
  live: [
    { name: "NovaMind", info: "دقة 97.9% | زمن 410ms", score: 9480, tone: "positive" },
    { name: "Atlas-X", info: "دقة 97.2% | زمن 365ms", score: 9325 },
    { name: "Aurora", info: "دقة 94.8% | زمن 395ms", score: 8650 },
    { name: "Sentinel", info: "دقة 91.3% | زمن 425ms", score: 8020, tone: "warn" },
  ],
};

const testScopes = {
  regression: [
    {
      title: "Smart QA Benchmark",
      subtitle: "سؤال وجواب متعدد اللغات",
      status: { text: "مجدول", tone: "primary" },
      models: 14,
    },
    {
      title: "Safety Guardrails",
      subtitle: "كشف التحيز والمحتوى الضار",
      status: { text: "جاري", tone: "accent" },
      models: 9,
    },
    {
      title: "Latency Stress",
      subtitle: "ضغط الطلبات بزمن حقيقي",
      status: { text: "تنبيه", tone: "warn" },
      models: 4,
    },
  ],
  stress: [
    {
      title: "Concurrent Requests",
      subtitle: "اختبار 500 اتصال متزامن",
      status: { text: "جاري", tone: "accent" },
      models: 6,
    },
    {
      title: "Memory Endurance",
      subtitle: "تشغيل متواصل لمدة 48 ساعة",
      status: { text: "مجدول", tone: "primary" },
      models: 3,
    },
    {
      title: "Input Flood",
      subtitle: "زيادة الطلبات 3x خلال 5 دقائق",
      status: { text: "تنبيه", tone: "warn" },
      models: 5,
    },
  ],
  custom: [
    {
      title: "Medical QA Suite",
      subtitle: "استشارات طبية حساسة",
      status: { text: "مراجعة", tone: "warn" },
      models: 2,
    },
    {
      title: "Dialect Recognition",
      subtitle: "لهجات عربية وعالمية متنوعة",
      status: { text: "مجدول", tone: "primary" },
      models: 8,
    },
    {
      title: "Financial Compliance",
      subtitle: "تحليل مستندات تنظيمية",
      status: { text: "جاري", tone: "accent" },
      models: 4,
    },
  ],
};

const listContainer = document.querySelector("#tests .list");

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
const savedTheme = localStorage.getItem("benchmark-theme");

function applyTheme(theme) {
  body.classList.remove("theme-light", "theme-dark");
  body.classList.add(theme);
  localStorage.setItem("benchmark-theme", theme);
  themeToggle.querySelector(".icon").textContent = theme === "theme-dark" ? "☀️" : "🌙";
  themeToggle.setAttribute("aria-label", theme === "theme-dark" ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي");
}

applyTheme(savedTheme || (prefersDark.matches ? "theme-dark" : "theme-light"));

prefersDark.addEventListener("change", (event) => {
  if (!savedTheme) {
    applyTheme(event.matches ? "theme-dark" : "theme-light");
  }
});

themeToggle.addEventListener("click", () => {
  const nextTheme = body.classList.contains("theme-dark") ? "theme-light" : "theme-dark";
  applyTheme(nextTheme);
});

function animateBars(values) {
  comparisonBars.forEach((span, index) => {
    const target = values[index] ?? 0;
    span.style.width = `${target * 100}%`;
  });
  comparisonValueLabels.forEach((label, index) => {
    const value = values[index] ?? 0;
    label.textContent = `${Math.round(value * 100)}%`;
  });
}

function updateLeaderboard(seasonKey) {
  const entries = seasons[seasonKey] ?? [];
  leaderboard.innerHTML = entries
    .map(
      (entry, index) => `
        <li>
          <span class="rank">${index + 1}</span>
          <div class="leader-info">
            <p class="leader-name">${entry.name}</p>
            <p class="leader-meta">${entry.info}</p>
          </div>
          <span class="score ${entry.tone ?? ""}">${entry.score.toLocaleString("en-US")}</span>
        </li>
      `
    )
    .join("");
}

function updateTestList(scope) {
  const tests = testScopes[scope] ?? [];
  listContainer.innerHTML = tests
    .map(
      (test) => `
        <div class="list-row">
          <div>
            <p class="list-title">${test.title}</p>
            <p class="list-subtitle">${test.subtitle}</p>
          </div>
          <div class="list-meta">
            <span class="badge ${test.status.tone}">${test.status.text}</span>
            <span class="pill">${test.models} نموذج</span>
          </div>
          <button class="btn icon-btn" aria-label="إدارة ${test.title}">
            <span class="icon">›</span>
          </button>
        </div>
      `
    )
    .join("");
}

document.addEventListener("click", (event) => {
  const target = event.target.closest(".chip");
  if (!target) return;

  const { scope, chart, season } = target.dataset;

  if (scope) {
    const group = target.parentElement.querySelectorAll(".chip");
    group.forEach((chip) => chip.classList.toggle("active", chip === target));
    updateTestList(scope);
  }

  if (chart) {
    const group = target.parentElement.querySelectorAll(".chip");
    group.forEach((chip) => chip.classList.toggle("active", chip === target));
    animateBars(palette[chart]);
  }

  if (season) {
    const group = target.parentElement.querySelectorAll(".chip");
    group.forEach((chip) => chip.classList.toggle("active", chip === target));
    updateLeaderboard(season);
  }
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "l") {
    event.preventDefault();
    const currentTheme = body.classList.contains("theme-dark") ? "theme-light" : "theme-dark";
    applyTheme(currentTheme);
  }
});

animateBars(palette.accuracy);
updateLeaderboard("q1");
updateTestList("regression");
