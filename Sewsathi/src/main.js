import "./style.css";
import L from "leaflet";
import { createClient } from "@supabase/supabase-js";

/* =====================================================================
   0. CONFIG + CONNECTION MODE
   ===================================================================== */

const ENV = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || "",
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || "",
};

function looksLikePlaceholder(value) {
  if (!value) return true;
  const lowered = value.toLowerCase();
  return (
    lowered.includes("your-") ||
    lowered.includes("your_") ||
    lowered.includes("placeholder") ||
    lowered === "changeme"
  );
}

const HAS_SUPABASE =
  !looksLikePlaceholder(ENV.SUPABASE_URL) &&
  !looksLikePlaceholder(ENV.SUPABASE_ANON_KEY) &&
  ENV.SUPABASE_URL.startsWith("http");

const HAS_GEMINI = !looksLikePlaceholder(ENV.GEMINI_API_KEY);

let supabase = null;
if (HAS_SUPABASE) {
  try {
    supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);
  } catch (err) {
    console.warn("Supabase client failed to initialize, falling back to demo mode.", err);
    supabase = null;
  }
}

const KATHMANDU_CENTER = { lat: 27.7017, lng: 85.314 };
const HIGH_IMPACT_THRESHOLD = 20;
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${ENV.GEMINI_API_KEY}`;

/* =====================================================================
   1. MOCK / DEMO DATA
   Used automatically whenever Supabase credentials are missing,
   invalid, or a live request fails, so the UI stays fully functional.
   ===================================================================== */

let mockReports = [
  {
    id: "mock-1",
    title: "Collapsed manhole cover near Ratna Park",
    description: "Open manhole is a fall hazard for pedestrians at night.",
    category: "Sanitation",
    severity: "High",
    upvotes: 34,
    latitude: 27.7017,
    longitude: 85.3141,
    estimated_budget: "NPR 8,000 - 15,000",
    required_crew: "2 Workers",
    required_materials: "Cast-iron cover, sealant",
    repair_time: "24-48 Hours",
    image_url: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "mock-2",
    title: "Pothole cluster on Kalanki-Koteshwor road",
    description: "Multiple deep potholes causing traffic slowdowns and bike accidents.",
    category: "Roads",
    severity: "High",
    upvotes: 51,
    latitude: 27.6939,
    longitude: 85.2822,
    estimated_budget: "NPR 40,000 - 60,000",
    required_crew: "4-5 Workers",
    required_materials: "Cold asphalt mix, roller",
    repair_time: "48-72 Hours",
    image_url: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
  {
    id: "mock-3",
    title: "Exposed live wire in Baneshwor",
    description: "Low-hanging electrical wire sparking during rain.",
    category: "Electricity",
    severity: "High",
    upvotes: 22,
    latitude: 27.6933,
    longitude: 85.3411,
    estimated_budget: "NPR 5,000 - 9,000",
    required_crew: "2 Electricians",
    required_materials: "Insulated cable, clamps",
    repair_time: "12-24 Hours",
    image_url: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "mock-4",
    title: "Broken footpath tiles in Patan Durbar Square area",
    description: "Uneven tiles are a tripping hazard for tourists.",
    category: "Infrastructure",
    severity: "Medium",
    upvotes: 9,
    latitude: 27.6727,
    longitude: 85.3247,
    estimated_budget: "NPR 12,000 - 18,000",
    required_crew: "2 Workers",
    required_materials: "Interlocking tiles, sand base",
    repair_time: "24-48 Hours",
    image_url: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
];

/* =====================================================================
   2. DOM REFERENCES
   ===================================================================== */

const el = {
  dataModeBadge: document.getElementById("dataModeBadge"),
  dataModeText: document.getElementById("dataModeText"),
  statTotalReports: document.getElementById("statTotalReports"),
  statResolved: document.getElementById("statResolved"),
  statHighImpact: document.getElementById("statHighImpact"),

  photoInput: document.getElementById("photoInput"),
  photoTriggerBtn: document.getElementById("photoTriggerBtn"),
  photoEmptyState: document.getElementById("photoEmptyState"),
  photoPreviewWrap: document.getElementById("photoPreviewWrap"),
  photoPreview: document.getElementById("photoPreview"),
  photoRemoveBtn: document.getElementById("photoRemoveBtn"),

  estimateStamp: document.getElementById("estimateStamp"),
  estimateIdle: document.getElementById("estimateIdle"),
  estimateLoading: document.getElementById("estimateLoading"),
  estimateResult: document.getElementById("estimateResult"),
  estCategory: document.getElementById("estCategory"),
  estSeverity: document.getElementById("estSeverity"),
  estBudget: document.getElementById("estBudget"),
  estCrew: document.getElementById("estCrew"),
  estMaterials: document.getElementById("estMaterials"),
  estRepairTime: document.getElementById("estRepairTime"),

  reportForm: document.getElementById("reportForm"),
  titleInput: document.getElementById("titleInput"),
  descriptionInput: document.getElementById("descriptionInput"),
  categorySelect: document.getElementById("categorySelect"),
  severitySelect: document.getElementById("severitySelect"),
  submitBtn: document.getElementById("submitBtn"),
  submitBtnLabel: document.getElementById("submitBtnLabel"),
  coordReadout: document.getElementById("coordReadout"),

  micBtn: document.getElementById("micBtn"),
  micStatus: document.getElementById("micStatus"),

  filterTabs: document.getElementById("filterTabs"),
  reportList: document.getElementById("reportList"),

  toast: document.getElementById("toast"),
};

/* =====================================================================
   3. TOAST HELPER
   ===================================================================== */

let toastTimer = null;
function showToast(message) {
  el.toast.textContent = message;
  el.toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.remove("is-visible"), 3200);
}

/* =====================================================================
   4. DATA MODE BADGE
   ===================================================================== */

function setDataModeBadge(mode) {
  el.dataModeBadge.classList.remove("is-live", "is-demo");
  if (mode === "live") {
    el.dataModeBadge.classList.add("is-live");
    el.dataModeText.textContent = "Live \u00b7 Supabase connected";
  } else {
    el.dataModeBadge.classList.add("is-demo");
    el.dataModeText.textContent = "Demo mode \u00b7 local sample data";
  }
}

/* =====================================================================
   5. IMAGE HANDLING
   ===================================================================== */

let uploadedImageBase64 = null; // raw base64, no data: prefix
let uploadedImageMimeType = null;
let uploadedImageDataUrl = null;

el.photoTriggerBtn.addEventListener("click", () => el.photoInput.click());

el.photoInput.addEventListener("change", async (evt) => {
  const file = evt.target.files && evt.target.files[0];
  if (!file) return;
  try {
    const dataUrl = await fileToDataUrl(file);
    uploadedImageDataUrl = dataUrl;
    uploadedImageMimeType = file.type || "image/jpeg";
    uploadedImageBase64 = dataUrl.split(",")[1];

    el.photoPreview.src = dataUrl;
    el.photoEmptyState.classList.add("hidden");
    el.photoPreviewWrap.classList.remove("hidden");

    runAiEstimate();
  } catch (err) {
    console.error(err);
    showToast("Could not read that image. Try another photo.");
  }
});

el.photoRemoveBtn.addEventListener("click", () => {
  uploadedImageBase64 = null;
  uploadedImageMimeType = null;
  uploadedImageDataUrl = null;
  el.photoInput.value = "";
  el.photoPreviewWrap.classList.add("hidden");
  el.photoEmptyState.classList.remove("hidden");
  resetEstimateCard();
});

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}

/* =====================================================================
   6. GEMINI 1.5 FLASH \u2014 STRUCTURED RESOURCE ESTIMATOR
   ===================================================================== */

let currentEstimate = null;

const GEMINI_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    suggested_title: { type: "STRING" },
    category: {
      type: "STRING",
      enum: ["Roads", "Sanitation", "Electricity", "Infrastructure", "Other"],
    },
    severity: { type: "STRING", enum: ["Low", "Medium", "High"] },
    estimated_budget: { type: "STRING" },
    required_crew: { type: "STRING" },
    required_materials: { type: "STRING" },
    repair_time: { type: "STRING" },
  },
  required: [
    "suggested_title",
    "category",
    "severity",
    "estimated_budget",
    "required_crew",
    "required_materials",
    "repair_time",
  ],
};

const GEMINI_PROMPT = `You are a municipal civil engineer in Nepal assessing a photo of a civic
infrastructure problem (roads, sanitation, electricity, or general infrastructure).
Look closely at the photo and respond with a realistic, practical assessment
for a Nepali municipality context (use NPR currency for budget).
Return ONLY the structured JSON fields requested: a short suggested_title (under 8 words),
the best-fit category, a severity rating, a realistic estimated_budget range in NPR,
the required_crew size, the required_materials, and a realistic repair_time range.`;

function resetEstimateCard() {
  currentEstimate = null;
  el.estimateStamp.textContent = "AWAITING PHOTO";
  el.estimateStamp.classList.remove("is-analyzing", "is-verified");
  el.estimateLoading.classList.add("hidden");
  el.estimateResult.classList.add("hidden");
  el.estimateIdle.classList.remove("hidden");
}

function setEstimateLoading() {
  el.estimateStamp.textContent = "ANALYZING\u2026";
  el.estimateStamp.classList.remove("is-verified");
  el.estimateStamp.classList.add("is-analyzing");
  el.estimateIdle.classList.add("hidden");
  el.estimateResult.classList.add("hidden");
  el.estimateLoading.classList.remove("hidden");
}

function setEstimateResult(estimate) {
  currentEstimate = estimate;
  el.estimateStamp.textContent = "VERIFIED \u2713";
  el.estimateStamp.classList.remove("is-analyzing");
  el.estimateStamp.classList.add("is-verified");
  el.estimateLoading.classList.add("hidden");
  el.estimateIdle.classList.add("hidden");
  el.estimateResult.classList.remove("hidden");

  el.estCategory.textContent = estimate.category;
  el.estSeverity.textContent = estimate.severity;
  el.estBudget.textContent = estimate.estimated_budget;
  el.estCrew.textContent = estimate.required_crew;
  el.estMaterials.textContent = estimate.required_materials;
  el.estRepairTime.textContent = estimate.repair_time;

  // Pre-fill the form with the AI's read on the issue, user can still edit.
  if (!el.titleInput.value.trim()) el.titleInput.value = estimate.suggested_title;
  el.categorySelect.value = estimate.category;
  el.severitySelect.value = estimate.severity;
}

async function runAiEstimate() {
  if (!uploadedImageBase64) return;
  setEstimateLoading();

  if (!HAS_GEMINI) {
    // No key configured -> graceful mock estimate so the UI stays usable.
    await wait(900);
    setEstimateResult(mockEstimateFromHeuristics());
    return;
  }

  try {
    const response = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: GEMINI_PROMPT },
              {
                inline_data: {
                  mime_type: uploadedImageMimeType,
                  data: uploadedImageBase64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          response_mime_type: "application/json",
          response_schema: GEMINI_RESPONSE_SCHEMA,
          temperature: 0.4,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API responded with ${response.status}`);
    }

    const payload = await response.json();
    const rawText = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error("Gemini response missing structured text");

    const parsed = JSON.parse(rawText);
    setEstimateResult(normalizeEstimate(parsed));
  } catch (err) {
    console.warn("Gemini estimate failed, falling back to local heuristic estimate.", err);
    setEstimateResult(mockEstimateFromHeuristics());
    showToast("AI service unavailable \u2014 showing an offline estimate instead.");
  }
}

function normalizeEstimate(raw) {
  const validCategories = ["Roads", "Sanitation", "Electricity", "Infrastructure", "Other"];
  const validSeverities = ["Low", "Medium", "High"];
  return {
    suggested_title: raw.suggested_title || "Civic issue reported",
    category: validCategories.includes(raw.category) ? raw.category : "Other",
    severity: validSeverities.includes(raw.severity) ? raw.severity : "Medium",
    estimated_budget: raw.estimated_budget || "NPR 10,000 - 20,000",
    required_crew: raw.required_crew || "2-3 Workers",
    required_materials: raw.required_materials || "Standard repair materials",
    repair_time: raw.repair_time || "24-48 Hours",
  };
}

function mockEstimateFromHeuristics() {
  const pool = [
    {
      suggested_title: "Damaged road surface reported",
      category: "Roads",
      severity: "High",
      estimated_budget: "NPR 35,000 - 55,000",
      required_crew: "3-4 Workers",
      required_materials: "Cold asphalt mix, gravel base",
      repair_time: "48-72 Hours",
    },
    {
      suggested_title: "Blocked drainage / waste issue",
      category: "Sanitation",
      severity: "Medium",
      estimated_budget: "NPR 10,000 - 18,000",
      required_crew: "2 Workers",
      required_materials: "Drain rods, disposal bags, disinfectant",
      repair_time: "12-24 Hours",
    },
    {
      suggested_title: "Faulty electrical fixture",
      category: "Electricity",
      severity: "High",
      estimated_budget: "NPR 6,000 - 12,000",
      required_crew: "2 Electricians",
      required_materials: "Insulated cable, junction box",
      repair_time: "12-24 Hours",
    },
    {
      suggested_title: "Broken public infrastructure",
      category: "Infrastructure",
      severity: "Medium",
      estimated_budget: "NPR 15,000 - 25,000",
      required_crew: "2-3 Workers",
      required_materials: "Cement, tiles, fasteners",
      repair_time: "24-48 Hours",
    },
  ];
  return pool[Math.floor(Math.random() * pool.length)];
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* =====================================================================
   7. MULTILINGUAL VOICE INPUT (Web Speech API)
   ===================================================================== */

const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognizer = null;
let isListening = false;
let currentSpeechLang = "ne-NP";

if (SpeechRecognitionImpl) {
  recognizer = new SpeechRecognitionImpl();
  recognizer.continuous = false;
  recognizer.interimResults = true;
  recognizer.maxAlternatives = 1;

  recognizer.addEventListener("result", (event) => {
    let transcript = "";
    for (let i = 0; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    el.descriptionInput.value = transcript;
  });

  recognizer.addEventListener("end", () => {
    isListening = false;
    el.micBtn.setAttribute("aria-pressed", "false");
    el.micStatus.textContent = "";
  });

  recognizer.addEventListener("error", (event) => {
    isListening = false;
    el.micBtn.setAttribute("aria-pressed", "false");

    if (event.error === "language-not-supported" && currentSpeechLang !== "en-US") {
      currentSpeechLang = "en-US";
      el.micStatus.textContent = "Switched to English";
      showToast("Nepali speech input unavailable on this device \u2014 switched to English.");
      return;
    }
    if (event.error === "no-speech") {
      el.micStatus.textContent = "";
      return;
    }
    el.micStatus.textContent = "";
    showToast("Voice input error \u2014 please try again or type your report.");
  });
} else {
  el.micBtn.disabled = true;
  el.micBtn.title = "Voice input isn't supported in this browser";
}

el.micBtn.addEventListener("click", () => {
  if (!recognizer) return;

  if (isListening) {
    recognizer.stop();
    return;
  }

  currentSpeechLang = currentSpeechLang || "ne-NP";
  recognizer.lang = currentSpeechLang;

  try {
    recognizer.start();
    isListening = true;
    el.micBtn.setAttribute("aria-pressed", "true");
    el.micStatus.textContent = currentSpeechLang === "ne-NP" ? "\u0938\u0941\u0928\u094d\u0926\u0948 \u091b\u0941\u2026" : "Listening\u2026";
  } catch (err) {
    console.warn("Speech recognition failed to start", err);
    isListening = false;
  }
});

/* =====================================================================
   8. LEAFLET MAPS
   ===================================================================== */

// Fix default marker icon paths for bundlers like Vite.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// --- Picker map: draggable marker for precise location selection ---
const pickerMap = L.map("pickerMap", {
  center: [KATHMANDU_CENTER.lat, KATHMANDU_CENTER.lng],
  zoom: 13,
  scrollWheelZoom: false,
});
L.tileLayer(TILE_URL, { attribution: TILE_ATTRIBUTION, maxZoom: 19 }).addTo(pickerMap);

let selectedLatLng = { ...KATHMANDU_CENTER };
const pickerMarker = L.marker([selectedLatLng.lat, selectedLatLng.lng], {
  draggable: true,
}).addTo(pickerMap);

function updateCoordReadout() {
  el.coordReadout.textContent = `${selectedLatLng.lat.toFixed(4)}, ${selectedLatLng.lng.toFixed(4)}`;
}
updateCoordReadout();

pickerMarker.on("dragend", () => {
  const pos = pickerMarker.getLatLng();
  selectedLatLng = { lat: pos.lat, lng: pos.lng };
  updateCoordReadout();
});

pickerMap.on("click", (e) => {
  pickerMarker.setLatLng(e.latlng);
  selectedLatLng = { lat: e.latlng.lat, lng: e.latlng.lng };
  updateCoordReadout();
});

// Try to center the picker map on the user's real location, if allowed.
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      selectedLatLng = { lat: latitude, lng: longitude };
      pickerMap.setView([latitude, longitude], 15);
      pickerMarker.setLatLng([latitude, longitude]);
      updateCoordReadout();
    },
    () => {
      /* Permission denied or unavailable \u2014 keep the Kathmandu default. */
    },
    { timeout: 4000 }
  );
}

// --- Live map: plots all submitted reports across the city ---
const liveMap = L.map("liveMap", {
  center: [KATHMANDU_CENTER.lat, KATHMANDU_CENTER.lng],
  zoom: 12,
});
L.tileLayer(TILE_URL, { attribution: TILE_ATTRIBUTION, maxZoom: 19 }).addTo(liveMap);

const SEVERITY_COLOR = {
  High: "#e5484d",
  Medium: "#e8c468",
  Low: "#3ddc84",
};

let liveMarkersLayer = L.layerGroup().addTo(liveMap);

function renderLiveMap(reports) {
  liveMarkersLayer.clearLayers();

  reports.forEach((report) => {
    if (report.latitude == null || report.longitude == null) return;
    const isHot = report.upvotes >= HIGH_IMPACT_THRESHOLD;
    const color = SEVERITY_COLOR[report.severity] || "#a9b0b8";

    const marker = L.circleMarker([report.latitude, report.longitude], {
      radius: isHot ? 12 : 8,
      color: color,
      weight: isHot ? 3 : 2,
      fillColor: color,
      fillOpacity: 0.35,
      className: isHot ? "pulse-marker" : "",
    });

    const popupHtml = `
      <div class="popup-title">${isHot ? "\ud83d\udd25 " : ""}${escapeHtml(report.title)}</div>
      <div class="popup-meta">
        <span>${escapeHtml(report.category)} \u00b7 ${escapeHtml(report.severity)} severity</span>
        <span class="mono">\u2b06 ${report.upvotes} affected</span>
        <span class="mono">${escapeHtml(report.estimated_budget || "\u2014")}</span>
      </div>
    `;
    marker.bindPopup(popupHtml);
    marker.addTo(liveMarkersLayer);
  });
}

/* =====================================================================
   9. REPORT DATA LAYER (Supabase-backed, with mock fallback)
   ===================================================================== */

let allReports = [];
let activeFilter = "All";

async function loadReports() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("upvotes", { ascending: false });

      if (error) throw error;
      allReports = data || [];
      setDataModeBadge("live");
      renderAll();
      return;
    } catch (err) {
      console.warn("Supabase read failed, falling back to demo data.", err);
      showToast("Couldn't reach Supabase \u2014 showing demo data instead.");
    }
  }

  setDataModeBadge("demo");
  allReports = [...mockReports];
  renderAll();
}

async function submitReport(reportDraft) {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("reports").insert(reportDraft).select().single();
      if (error) throw error;
      allReports.unshift(data);
      renderAll();
      return true;
    } catch (err) {
      console.warn("Supabase insert failed, saving locally instead.", err);
      showToast("Couldn't save to Supabase \u2014 stored locally instead.");
    }
  }

  const localReport = {
    id: `mock-${Date.now()}`,
    ...reportDraft,
    upvotes: reportDraft.upvotes ?? 1,
    created_at: new Date().toISOString(),
  };
  mockReports.unshift(localReport);
  allReports.unshift(localReport);
  renderAll();
  return true;
}

async function upvoteReport(reportId) {
  if (supabase && !String(reportId).startsWith("mock-")) {
    try {
      const { data, error } = await supabase.rpc("increment_upvote", { report_id: reportId });
      if (error) throw error;
      const updated = Array.isArray(data) ? data[0] : data;
      allReports = allReports.map((r) => (r.id === reportId ? { ...r, upvotes: updated.upvotes } : r));
      renderAll();
      return;
    } catch (err) {
      console.warn("Supabase upvote RPC failed, updating locally instead.", err);
    }
  }

  allReports = allReports.map((r) => (r.id === reportId ? { ...r, upvotes: r.upvotes + 1 } : r));
  mockReports = mockReports.map((r) => (r.id === reportId ? { ...r, upvotes: r.upvotes + 1 } : r));
  renderAll();
}

/* =====================================================================
   10. RENDERING
   ===================================================================== */

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = String(str ?? "");
  return div.innerHTML;
}

function timeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function severityTagClass(severity) {
  if (severity === "High") return "tag tag--severity-high";
  if (severity === "Low") return "tag tag--severity-low";
  return "tag tag--severity-medium";
}

function renderStats(reports) {
  el.statTotalReports.textContent = reports.length;
  el.statResolved.textContent = reports.filter((r) => r.status === "Resolved").length;
  el.statHighImpact.textContent = reports.filter((r) => r.upvotes >= HIGH_IMPACT_THRESHOLD).length;
}

function renderReportList() {
  const filtered =
    activeFilter === "All" ? allReports : allReports.filter((r) => r.category === activeFilter);

  const sorted = [...filtered].sort((a, b) => b.upvotes - a.upvotes);

  if (sorted.length === 0) {
    el.reportList.innerHTML = `<p style="color:var(--text-dim); font-size:13px; padding:20px 4px;">
      No reports in this category yet. Be the first to flag one.
    </p>`;
    return;
  }

  el.reportList.innerHTML = sorted
    .map((report) => {
      const isHot = report.upvotes >= HIGH_IMPACT_THRESHOLD;
      const thumb = report.image_url
        ? `<img class="report-card__thumb" src="${escapeHtml(report.image_url)}" alt="" />`
        : `<div class="report-card__thumb" style="display:grid;place-items:center;font-size:20px;">${categoryEmoji(report.category)}</div>`;

      return `
        <article class="report-card ${isHot ? "is-hot" : ""}" data-id="${report.id}">
          ${thumb}
          <div class="report-card__body">
            ${isHot ? '<span class="hot-badge">\ud83d\udd25 HIGH-IMPACT CLUSTER</span>' : ""}
            <h3 class="report-card__title">${escapeHtml(report.title)}</h3>
            <div class="report-card__meta">
              <span class="tag">${escapeHtml(report.category)}</span>
              <span class="${severityTagClass(report.severity)}">${escapeHtml(report.severity)}</span>
              <span>${escapeHtml(report.estimated_budget || "Budget TBD")}</span>
              <span>${timeAgo(report.created_at)}</span>
            </div>
          </div>
          <div class="report-card__actions">
            <button class="upvote-btn" data-upvote-id="${report.id}">
              <span class="upvote-btn__count">\u2b06 ${report.upvotes}</span>
              <span class="upvote-btn__label">Affected Too</span>
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

function categoryEmoji(category) {
  switch (category) {
    case "Roads": return "\ud83d\udee3\ufe0f";
    case "Sanitation": return "\ud83d\uddd1\ufe0f";
    case "Electricity": return "\u26a1";
    case "Infrastructure": return "\ud83c\udfd7\ufe0f";
    default: return "\ud83d\udccc";
  }
}

function renderAll() {
  renderStats(allReports);
  renderReportList();
  renderLiveMap(allReports);
}

el.reportList.addEventListener("click", (evt) => {
  const btn = evt.target.closest("[data-upvote-id]");
  if (!btn) return;
  btn.disabled = true;
  upvoteReport(btn.dataset.upvoteId).finally(() => {
    btn.disabled = false;
  });
});

el.filterTabs.addEventListener("click", (evt) => {
  const tab = evt.target.closest(".filter-tab");
  if (!tab) return;
  activeFilter = tab.dataset.filter;
  [...el.filterTabs.children].forEach((c) => c.classList.remove("is-active"));
  tab.classList.add("is-active");
  renderReportList();
});

/* =====================================================================
   11. FORM SUBMISSION
   ===================================================================== */

el.reportForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();

  const title = el.titleInput.value.trim();
  if (!title) {
    showToast("Please give the issue a short title.");
    return;
  }

  el.submitBtn.disabled = true;
  el.submitBtnLabel.textContent = "Submitting\u2026";

  const draft = {
    title,
    description: el.descriptionInput.value.trim(),
    category: el.categorySelect.value,
    severity: el.severitySelect.value,
    upvotes: 1,
    latitude: selectedLatLng.lat,
    longitude: selectedLatLng.lng,
    estimated_budget: currentEstimate?.estimated_budget || null,
    required_crew: currentEstimate?.required_crew || null,
    required_materials: currentEstimate?.required_materials || null,
    repair_time: currentEstimate?.repair_time || null,
    image_url: uploadedImageDataUrl || null,
    status: "Reported",
  };

  await submitReport(draft);

  showToast("Report submitted \u2014 dhanyabad for making your street safer! \ud83d\ude4f");
  el.reportForm.reset();
  el.severitySelect.value = "Medium";
  uploadedImageBase64 = null;
  uploadedImageMimeType = null;
  uploadedImageDataUrl = null;
  el.photoInput.value = "";
  el.photoPreviewWrap.classList.add("hidden");
  el.photoEmptyState.classList.remove("hidden");
  resetEstimateCard();

  el.submitBtn.disabled = false;
  el.submitBtnLabel.textContent = "Submit Report";
});

/* =====================================================================
   12. BOOT
   ===================================================================== */

setDataModeBadge(supabase ? "live" : "demo");
loadReports();
