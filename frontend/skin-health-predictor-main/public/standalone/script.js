// ===== Data =====
const DISORDER_CLASSES = {
  0: { name: "Psoriasis", description: "A chronic autoimmune condition that causes rapid skin cell buildup, leading to scaling on the skin's surface. Common symptoms include red patches with silvery scales, dry cracked skin, and itching.", color: "hsl(0, 72%, 51%)" },
  1: { name: "Seborrheic Dermatitis", description: "A common skin condition that mainly affects the scalp, causing scaly patches, red skin, and stubborn dandruff. It can also affect oily areas of the body.", color: "hsl(25, 95%, 53%)" },
  2: { name: "Lichen Planus", description: "An inflammatory condition affecting skin and mucous membranes, characterized by purplish, flat-topped bumps that may be itchy.", color: "hsl(262, 60%, 50%)" },
  3: { name: "Pityriasis Rosea", description: "A relatively common skin condition that causes a temporary rash of raised red scaly patches. Typically starts with a single large herald patch.", color: "hsl(330, 65%, 50%)" },
  4: { name: "Chronic Dermatitis", description: "A long-term skin inflammation causing itchy, swollen, and cracked skin. Often related to allergies or irritants.", color: "hsl(210, 60%, 50%)" },
  5: { name: "Pityriasis Rubra Pilaris", description: "A rare skin disorder characterized by reddish-orange patches, scaling, and thickening of the skin.", color: "hsl(38, 92%, 50%)" },
  6: { name: "Normal (No Disorder)", description: "The clinical inputs do not indicate a significant skin disorder. Regular dermatological check-ups are still recommended.", color: "hsl(152, 60%, 40%)" },
};

const CLINICAL_FEATURES = [
  { key: "erythema", label: "Erythema", description: "Redness of the skin" },
  { key: "scaling", label: "Scaling", description: "Flaking or peeling skin" },
  { key: "definite_borders", label: "Definite Borders", description: "Clear boundaries of affected area" },
  { key: "itching", label: "Itching", description: "Pruritus intensity" },
  { key: "koebner_phenomenon", label: "Koebner Phenomenon", description: "Lesions at trauma sites" },
  { key: "polygonal_papules", label: "Polygonal Papules", description: "Angular raised bumps" },
  { key: "follicular_papules", label: "Follicular Papules", description: "Bumps around hair follicles" },
  { key: "oral_mucosal_involvement", label: "Oral Mucosal Involvement", description: "Mouth/mucous membrane affected" },
  { key: "knee_and_elbow_involvement", label: "Knee & Elbow Involvement", description: "Joints area affected" },
  { key: "scalp_involvement", label: "Scalp Involvement", description: "Scalp area affected" },
];

// ===== Initialize =====
document.addEventListener("DOMContentLoaded", () => {
  buildForm();
  setupNav();
  setupFormEvents();
  renderAboutDisorders();
});

// ===== Navigation =====
function setupNav() {
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const tab = link.dataset.tab;
      document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
      document.getElementById("page-" + tab).classList.add("active");
      if (tab === "dashboard") renderDashboard();
    });
  });
}

// ===== Build Form =====
function buildForm() {
  const grid = document.getElementById("features-grid");
  grid.innerHTML = CLINICAL_FEATURES.map(f => `
    <div class="feature-item">
      <div class="feature-header">
        <label class="label" for="${f.key}">${f.label}</label>
        <span class="feature-value" id="val-${f.key}">0</span>
      </div>
      <p class="feature-desc">${f.description}</p>
      <div class="slider-wrap">
        <input type="range" id="${f.key}" name="${f.key}" min="0" max="4" step="1" value="0"
          oninput="document.getElementById('val-${f.key}').textContent = this.value" />
      </div>
      <div class="slider-labels"><span>Absent</span><span>Severe</span></div>
    </div>
  `).join("");
}

// ===== Form Events =====
function setupFormEvents() {
  document.getElementById("prediction-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.getElementById("submit-btn");
    btn.disabled = true;
    btn.textContent = "⏳ Analyzing...";

    await new Promise(r => setTimeout(r, 800));

    const input = {};
    CLINICAL_FEATURES.forEach(f => {
      input[f.key] = parseInt(document.getElementById(f.key).value);
    });
    input.age = parseInt(document.getElementById("age").value) || 30;

    const result = mockPredict(input);
    renderResult(result);

    btn.disabled = false;
    btn.textContent = "✈️ Predict Disorder";
  });

  document.getElementById("reset-btn").addEventListener("click", () => {
    CLINICAL_FEATURES.forEach(f => {
      document.getElementById(f.key).value = 0;
      document.getElementById("val-" + f.key).textContent = "0";
    });
    document.getElementById("age").value = 30;
    document.getElementById("result-area").innerHTML = `
      <div class="placeholder-result">
        <div class="placeholder-icon">🩺</div>
        <p class="placeholder-text">Prediction results will appear here</p>
        <p class="placeholder-hint">Fill in clinical parameters and click Predict</p>
      </div>`;
  });
}

// ===== Mock Prediction =====
function mockPredict(input) {
  const features = CLINICAL_FEATURES.map(f => input[f.key]);
  const total = features.reduce((a, b) => a + b, 0);
  let predicted_class;

  if (input.scaling >= 3 && input.knee_and_elbow_involvement >= 2 && input.erythema >= 2) {
    predicted_class = 0;
  } else if (input.scaling >= 2 && input.scalp_involvement >= 3) {
    predicted_class = 1;
  } else if (input.polygonal_papules >= 3 && input.oral_mucosal_involvement >= 2) {
    predicted_class = 2;
  } else if (input.erythema >= 2 && input.definite_borders >= 2 && total < 15) {
    predicted_class = 3;
  } else if (input.itching >= 3 && input.erythema >= 2) {
    predicted_class = 4;
  } else if (input.follicular_papules >= 3 && input.scaling >= 2) {
    predicted_class = 5;
  } else if (total <= 5) {
    predicted_class = 6;
  } else {
    predicted_class = Math.floor(Math.random() * 6);
  }

  const probability = Math.round((0.78 + Math.random() * 0.15) * 100) / 100;
  const result = { predicted_class, probability, timestamp: new Date().toISOString(), inputs: input };

  // Save to localStorage
  const history = JSON.parse(localStorage.getItem("prediction_history") || "[]");
  history.push(result);
  localStorage.setItem("prediction_history", JSON.stringify(history));

  return result;
}

// ===== Render Result =====
function renderResult(result) {
  const disorder = DISORDER_CLASSES[result.predicted_class];
  const isNormal = result.predicted_class === 6;
  const confidence = Math.round(result.probability * 100);

  document.getElementById("result-area").innerHTML = `
    <div class="card result-card">
      <div class="result-bar" style="background:${disorder.color}"></div>
      <div class="card-header">
        <div class="result-header">
          <div>
            <p class="result-label">Prediction Result</p>
            <h3 class="result-name" style="color:${disorder.color}">${disorder.name}</h3>
          </div>
          ${isNormal
            ? '<span class="badge badge-success">✅ Healthy</span>'
            : `<span class="badge badge-danger">⚠️ Class ${result.predicted_class}</span>`}
        </div>
      </div>
      <div class="card-body">
        <p class="result-desc">${disorder.description}</p>
        <div class="confidence-row">
          <span>Model Confidence</span>
          <span class="confidence-value">${confidence}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${confidence}%"></div>
        </div>
        <div class="result-meta">
          <span>🕐 ${new Date(result.timestamp).toLocaleString()}</span>
          <span>•</span>
          <span>Model Accuracy: ~91%</span>
        </div>
        ${!isNormal ? `
          <div class="disclaimer">
            <strong>⚠️ Disclaimer:</strong> This is a demonstration ML model for academic purposes only. Always consult a qualified dermatologist for medical diagnosis.
          </div>` : ""}
      </div>
    </div>`;
}

// ===== Dashboard =====
function renderDashboard() {
  const history = JSON.parse(localStorage.getItem("prediction_history") || "[]");

  // Stats
  const counts = {};
  for (let i = 0; i <= 6; i++) counts[i] = 0;
  history.forEach(h => counts[h.predicted_class]++);
  const maxCount = Math.max(...Object.values(counts), 1);

  document.getElementById("stats-grid").innerHTML = `
    <div class="stat-card"><p class="stat-label">Total Predictions</p><p class="stat-value">${history.length}</p></div>
    <div class="stat-card"><p class="stat-label">Unique Classes</p><p class="stat-value">${Object.values(counts).filter(v => v > 0).length}</p></div>
    <div class="stat-card"><p class="stat-label">Most Common</p><p class="stat-value" style="font-size:1.2rem">${history.length ? DISORDER_CLASSES[Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]].name : "—"}</p></div>
  `;

  // Chart
  document.getElementById("chart-container").innerHTML = Object.entries(DISORDER_CLASSES).map(([cls, d]) => {
    const count = counts[cls] || 0;
    const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
    return `
      <div class="chart-bar-wrap">
        <div class="chart-bar-outer">
          <div class="chart-bar-inner" style="height:${height}%;background:${d.color}"></div>
        </div>
        <div class="chart-bar-label">${d.name.split(" ")[0]}</div>
        <div class="chart-bar-count">${count}</div>
      </div>`;
  }).join("");

  // Table
  const tbody = document.getElementById("history-tbody");
  const noHistory = document.getElementById("no-history");
  if (history.length === 0) {
    tbody.innerHTML = "";
    noHistory.style.display = "block";
  } else {
    noHistory.style.display = "none";
    tbody.innerHTML = history.slice().reverse().slice(0, 20).map(h => `
      <tr>
        <td>${new Date(h.timestamp).toLocaleString()}</td>
        <td>${h.predicted_class}</td>
        <td>${DISORDER_CLASSES[h.predicted_class].name}</td>
        <td>${Math.round(h.probability * 100)}%</td>
      </tr>`).join("");
  }
}

// ===== About =====
function renderAboutDisorders() {
  document.getElementById("disorder-list").innerHTML = Object.entries(DISORDER_CLASSES).map(([cls, d]) => `
    <div class="disorder-item">
      <span class="disorder-name" style="color:${d.color}">Class ${cls}: ${d.name}</span>
      <p class="disorder-desc">${d.description}</p>
    </div>`).join("");
}
