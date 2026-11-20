(() => {
  const id = "G-NGX6FHMRV6";
  const preferenceKey = "bravebear.analyticsConsent";
  const disableKey = "ga-disable-" + id;
  let preference = null;
  let loaded = false;

  try {
    preference = localStorage.getItem(preferenceKey);
  } catch {
    // Keep the choice in memory if storage is unavailable.
  }

  function applyConsent() {
    window[disableKey] = preference !== "accepted";
    if (window[disableKey] || loaded) return;

    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      if (!window[disableKey]) window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", id, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });

    const tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://www.googletagmanager.com/gtag/js?id=" + id;
    document.head.append(tag);
  }

  applyConsent();

  const settings = document.createElement("button");
  settings.type = "button";
  settings.className = "analytics-cookie-settings";
  settings.textContent = "Preferências de cookies";

  const panel = document.createElement("section");
  panel.className = "analytics-cookie-panel";
  panel.setAttribute("aria-label", "Cookies de análise");
  panel.hidden = preference === "accepted" || preference === "rejected";
  panel.innerHTML = `
    <p>Com sua permissão, usamos o Google Analytics para medir o uso do site.</p>
    <button type="button" data-consent="accepted">Aceitar cookies de análise</button>
    <button type="button" data-consent="rejected">Recusar</button>
  `;

  settings.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
    if (!panel.hidden) panel.querySelector("button")?.focus();
  });
  for (const button of panel.querySelectorAll("button")) {
    button.addEventListener("click", () => {
      preference = button.dataset.consent;
      try {
        localStorage.setItem(preferenceKey, preference);
      } catch {
        // Apply the choice to the current page even without storage.
      }
      applyConsent();
      panel.hidden = true;
      settings.focus();
    });
  }

  (document.querySelector("footer") || document.body).append(settings);
  document.body.append(panel);

  document.addEventListener("click", (event) => {
    if (window[disableKey] || !(event.target instanceof Element)) return;
    const link = event.target.closest("a[href]");
    if (!(link instanceof HTMLAnchorElement)) return;
    const hostname = link.hostname;
    if (hostname === "wa.me" || hostname === "api.whatsapp.com") {
      window.gtag("event", "whatsapp_click");
    }
  });
})();
