# Nestlé Bienestar — Mockup v2

Sistema de encuestas de clima laboral. Una tablet en el ingreso a planta recoge las respuestas; RR.HH. las ve y administra desde un panel web.

Para ponerlo a andar: **[PASOS.md](PASOS.md)**.

## Estructura

```
apps-script/Codigo.gs     Backend: ruteo, 3 hojas, esquema de respuestas
shared/config.js          URL del Apps Script + funciones de conexión
dashboard/index.html      Panel de RR.HH.
tablet/index.html         Encuesta para los trabajadores
```

## Cómo funciona

El Sheet es la base de datos. Todo pasa por el Apps Script:

```
tablet  ──POST guardarRespuestas──►  Apps Script  ──►  Sheet
tablet  ──GET  encuestaActiva────►        │
dashboard ──GET encuestas/respuestas──────┘
dashboard ──POST guardarEncuesta/activarEncuesta──►
```

### Hojas

| Hoja | Contenido |
|---|---|
| `Encuestas` | id, nombre, descripción, activa, preguntas en JSON |
| `Respuestas` | **una fila por respuesta**, agrupadas por `sesion_id` |
| `Usuarios` | usuario, contraseña, rol, activo |

El formato largo de `Respuestas` es lo que permite encuestas de cualquier cantidad de preguntas sin tocar el backend.

### API

Lecturas (GET): `ping`, `encuestas`, `encuestaActiva`, `respuestas`, `usuarios`
Escrituras (POST): `login`, `guardarEncuesta`, `activarEncuesta`, `eliminarEncuesta`, `guardarRespuestas`, `guardarUsuario`, `eliminarUsuario`

## Qué hace el dashboard

- **Resumen** — sesiones totales, respuestas del día, ánimo promedio, alertas, gráfica de tendencia y promedio por pregunta.
- **Encuestas** — constructor con 5 tipos de pregunta, marca de pregunta crítica, y control de cuál encuesta está en la tablet.
- **Respuestas** — historial por sesión, filtros, detalle y exportación a CSV.
- **Usuarios** — alta y baja de trabajadores.

## Tipos de pregunta

| Tipo | Qué guarda | Cuenta como alerta si |
|---|---|---|
| Caritas | 1 a 5 | ≤ 2 |
| Escala | 1 a 10 | ≤ 4 |
| Sí / No | texto | responde "No" |
| Opción múltiple | texto | nunca |
| Abierta | texto | nunca |

Solo dispara alerta si además la pregunta está marcada como crítica.

## Qué cambió respecto a la v1

| Antes | Ahora |
|---|---|
| Preguntas escritas dentro del HTML | Se piden al Sheet |
| Usuarios y preguntas en `localStorage` (no sincronizaba entre dispositivos) | Todo en el Sheet |
| Columnas fijas `p1...p5` | Una fila por respuesta, cualquier cantidad de preguntas |
| POST en `no-cors` (no se sabía si guardaba) | POST `text/plain`, se lee la confirmación |
| 3 tipos de pregunta | 5 tipos |
| No existía el dashboard | Dashboard completo |

## Límites del mockup

- 2 encuestas y 10 preguntas por encuesta (`MAX_ENCUESTAS` / `MAX_PREGUNTAS` en `dashboard/index.html`).
- Sin modo offline: si la tablet pierde el wifi, no envía. Es una limitación de esta demo, no del producto final.
- Contraseñas en texto plano en el Sheet. Es un entorno de demostración, no lleva datos reales.
- El dashboard no se refresca solo: hay que darle **Actualizar datos**.

## Pendiente para el producto final

Backend propio (Node.js + PostgreSQL), autenticación real, PWA con service worker para trabajar sin conexión, notificaciones de alertas por correo o WhatsApp, y kiosk mode gestionado.

---

Desarrollo: André & Paula · Cliente: Nestlé Guatemala — RR.HH. · Julio 2026
