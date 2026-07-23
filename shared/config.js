// ============================================
// CONFIGURACIÓN COMPARTIDA — NESTLÉ BIENESTAR
// ============================================

// APP SCRIPT
const API_URL_DEFAULT =
  "https://script.google.com/macros/s/AKfycbzafwIFIdxr3JcImyZ3wCMUf4W-OVKesySRRAbmyXXjA-gJj7Zbu_3Hv_uK3zZMFPpx/exec";

function getApiUrl() {
  return API_URL_DEFAULT;
}

// Colores de marca
const BRAND = {
  red: "#D72B2B",
  green: "#2A9B5B",
  amber: "#E07B0D",
  dark: "#111111",
  soft: "#F5F3EF",
};

// Los 5 tipos de pregunta que RR.HH. puede elegir.
const TIPOS_PREGUNTA = {
  emoji: { nombre: "Caritas (1 a 5)", icono: "fa-face-smile" },
  scale: { nombre: "Escala del 1 al 10", icono: "fa-sliders" },
  si_no: { nombre: "Sí / No", icono: "fa-circle-check" },
  multiple: { nombre: "Opción múltiple", icono: "fa-list-ul" },
  open: { nombre: "Respuesta abierta", icono: "fa-comment-dots" },
};

// ============================================
// CONEXIÓN CON EL APPS SCRIPT
// ============================================

// Lecturas. Ej: await apiGet('encuestaActiva')
async function apiGet(action, params) {
  let url = getApiUrl() + "?action=" + encodeURIComponent(action);
  if (params) {
    for (const k in params) {
      url += "&" + k + "=" + encodeURIComponent(params[k]);
    }
  }
  const res = await fetch(url);
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Error del servidor");
  return data.data;
}

// Escrituras. Ojo: va como text/plain a propósito.
// Si mandás application/json, el navegador hace preflight y Apps Script lo rechaza.
async function apiPost(action, payload) {
  const body = Object.assign({ action: action }, payload || {});
  const res = await fetch(getApiUrl(), {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Error del servidor");
  return data.data;
}
