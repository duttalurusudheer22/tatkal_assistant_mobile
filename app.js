const $ = id => document.getElementById(id);
const journeyKeys = ["from","to","journeyDate","travelClass","quota"];

function loadJourney() {
  try {
    const saved = JSON.parse(localStorage.getItem("tatkalJourney") || "{}");
    for (const id of journeyKeys) if (saved[id] != null) $(id).value = saved[id];
  } catch (_) {}
  try {
    const checks = JSON.parse(localStorage.getItem("tatkalChecks") || "{}");
    document.querySelectorAll("[data-check]").forEach(el => el.checked = !!checks[el.dataset.check]);
  } catch (_) {}
}
loadJourney();

$("openIrctc").addEventListener("click", () => {
  window.open("https://www.irctc.co.in/nget/train-search", "_blank", "noopener");
});

$("saveJourney").addEventListener("click", () => {
  const data = {};
  for (const id of journeyKeys) data[id] = $(id).value;
  localStorage.setItem("tatkalJourney", JSON.stringify(data));
  $("journeyStatus").textContent = "Saved on this device. Copy the details into IRCTC yourself.";
});

document.querySelectorAll("[data-check]").forEach(el => {
  el.addEventListener("change", () => {
    const checks = {};
    document.querySelectorAll("[data-check]").forEach(box => checks[box.dataset.check] = box.checked);
    localStorage.setItem("tatkalChecks", JSON.stringify(checks));
  });
});
$("resetChecks").addEventListener("click", () => {
  document.querySelectorAll("[data-check]").forEach(el => el.checked = false);
  localStorage.removeItem("tatkalChecks");
});

let reminderAt = null;
let timerInterval = null;
function formatRemaining(ms) {
  if (ms <= 0) return "Opening reminder time has arrived. Open IRCTC and follow its normal process.";
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `Time remaining: ${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}
function renderTimer() {
  if (!reminderAt) return;
  $("timerStatus").textContent = formatRemaining(reminderAt - Date.now());
}
$("setReminder").addEventListener("click", async () => {
  const date = $("reminderDate").value;
  const time = $("reminderTime").value;
  if (!date) { $("timerStatus").textContent = "Choose a reminder date first."; return; }
  const [y,mo,d] = date.split("-").map(Number);
  const [hh,mm] = time.split(":").map(Number);
  // Convert a selected IST wall-clock time to UTC.
  const target = Date.UTC(y, mo - 1, d, hh - 5, mm - 30, 0);
  if (target <= Date.now()) { $("timerStatus").textContent = "That time has passed. Choose a future date and time."; return; }
  reminderAt = target;
  localStorage.setItem("tatkalReminderAt", String(target));
  if (timerInterval) clearInterval(timerInterval);
  renderTimer();
  timerInterval = setInterval(renderTimer, 1000);
  if ("Notification" in window && Notification.permission === "default") {
    try { await Notification.requestPermission(); } catch (_) {}
  }
  $("timerStatus").textContent = formatRemaining(reminderAt - Date.now()) + (Notification.permission === "granted" ? " Keep this page open for the reminder." : " Keep this page open; browser notification permission is not enabled.");
});

const savedReminder = Number(localStorage.getItem("tatkalReminderAt"));
if (savedReminder > Date.now()) {
  reminderAt = savedReminder;
  renderTimer();
  timerInterval = setInterval(renderTimer, 1000);
}
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
