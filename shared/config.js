// ============================================
// CONFIGURACIÓN COMPARTIDA — NESTLÉ BIENESTAR
// La usan tanto el dashboard como la tablet.
// ============================================

// ⬇️ PEGÁ AQUÍ LA URL /exec DE TU IMPLEMENTACIÓN DE APPS SCRIPT
const API_URL_DEFAULT = 'https://script.google.com/macros/s/TU_URL_AQUI/exec';

// Permite cambiar la URL desde el dashboard sin tocar el código.
// Útil mientras probás: cada quien apunta a su propio Sheet.
function getApiUrl() {
  return localStorage.getItem('nestle_api_url') || API_URL_DEFAULT;
}

function setApiUrl(url) {
  localStorage.setItem('nestle_api_url', url.trim());
}

// Colores de marca
const BRAND = {
  red:   '#D72B2B',
  green: '#2A9B5B',
  amber: '#E07B0D',
  dark:  '#111111',
  soft:  '#F5F3EF'
};

// Los 5 tipos de pregunta que RR.HH. puede elegir.
const TIPOS_PREGUNTA = {
  emoji:    { nombre: 'Caritas (1 a 5)',      icono: 'fa-face-smile' },
  scale:    { nombre: 'Escala del 1 al 10',   icono: 'fa-sliders' },
  si_no:    { nombre: 'Sí / No',              icono: 'fa-circle-check' },
  multiple: { nombre: 'Opción múltiple',      icono: 'fa-list-ul' },
  open:     { nombre: 'Respuesta abierta',    icono: 'fa-comment-dots' }
};

// ============================================
// CONEXIÓN CON EL APPS SCRIPT
// ============================================

// Lecturas. Ej: await apiGet('encuestaActiva')
async function apiGet(action, params) {
  let url = getApiUrl() + '?action=' + encodeURIComponent(action);
  if (params) {
    for (const k in params) {
      url += '&' + k + '=' + encodeURIComponent(params[k]);
    }
  }
  const res = await fetch(url);
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Error del servidor');
  return data.data;
}

// Escrituras. Ojo: va como text/plain a propósito.
// Si mandás application/json, el navegador hace preflight y Apps Script lo rechaza.
async function apiPost(action, payload) {
  const body = Object.assign({ action: action }, payload || {});
  const res = await fetch(getApiUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Error del servidor');
  return data.data;
}
