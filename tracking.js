// @ts-check

/**
 * Medição e anúncios: Google Analytics 4 e Meta Pixel.
 *
 * Preencha os IDs abaixo para ativar. Enquanto estiverem vazios, nada é
 * carregado e nenhum aviso de cookies aparece. Com IDs preenchidos, os scripts
 * de terceiros só são carregados depois que o visitante aceita (LGPD).
 */
const TRACKING = {
  /** ID de medição do GA4, no formato "G-XXXXXXXXXX". */
  ga4MeasurementId: "",
  /** ID numérico do Meta Pixel (Gerenciador de Eventos da Meta). */
  metaPixelId: "",
};

const CONSENT_KEY = "bb-consent-v1";

/** Globais criadas pelos scripts do Google e da Meta. @type {any} */
const page = window;

/** @returns {"granted" | "denied" | null} */
function readConsent() {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

/** @param {"granted" | "denied"} value */
function saveConsent(value) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Navegação privada ou armazenamento bloqueado: a escolha vale só nesta página.
  }
}

/** @param {string} id */
function loadGa4(id) {
  if (!/^G-[A-Z0-9]{4,}$/.test(id)) return;
  page.dataLayer = page.dataLayer || [];
  // gtag.js exige o objeto `arguments`; um array comum é ignorado.
  page.gtag = function gtag() {
    // biome-ignore lint/complexity/noArguments: exigido pelo gtag.js
    page.dataLayer.push(arguments);
  };
  page.gtag("js", new Date());
  page.gtag("config", id);
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.append(script);
}

/** @param {string} id */
function loadMetaPixel(id) {
  if (!/^\d{8,20}$/.test(id) || page.fbq) return;
  /** @type {any} */
  const fbq = (/** @type {unknown[]} */ ...args) => {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  };
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.push = fbq;
  page.fbq = fbq;
  page._fbq = fbq;
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.append(script);
  fbq("init", id);
  fbq("track", "PageView");
}

function loadTrackers() {
  if (TRACKING.ga4MeasurementId) loadGa4(TRACKING.ga4MeasurementId);
  if (TRACKING.metaPixelId) loadMetaPixel(TRACKING.metaPixelId);
}

function showConsentBanner() {
  const banner = document.createElement("div");
  banner.className = "consent-banner";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-label", "Preferências de cookies");

  const text = document.createElement("p");
  text.textContent =
    "Usamos cookies de medição e publicidade (Google e Meta) para entender o uso do site e melhorar nossos anúncios. Você pode aceitar ou recusar; o site funciona normalmente nas duas opções.";

  const actions = document.createElement("div");
  actions.className = "consent-actions";

  /**
   * @param {string} label
   * @param {"granted" | "denied"} value
   * @param {string} className
   */
  const button = (label, value, className) => {
    const element = document.createElement("button");
    element.type = "button";
    element.className = className;
    element.textContent = label;
    element.addEventListener("click", () => {
      saveConsent(value);
      banner.remove();
      if (value === "granted") loadTrackers();
    });
    return element;
  };

  actions.append(
    button("Recusar", "denied", "consent-deny"),
    button("Aceitar", "granted", "consent-accept"),
  );
  banner.append(text, actions);
  document.body.append(banner);
}

if (TRACKING.ga4MeasurementId || TRACKING.metaPixelId) {
  const consent = readConsent();
  if (consent === "granted") loadTrackers();
  else if (consent === null) showConsentBanner();
}
