/* Página de contato: monta a mensagem e abre o WhatsApp (nenhum dado é guardado no site). */
const form = document.querySelector("#formulario");
const feedback = document.querySelector("#form-feedback");
const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const values = new FormData(form);
  const required = ["name", "phone", "description"];
  let firstInvalid = null;
  for (const name of required) {
    const field = form.elements[name];
    const empty = !String(values.get(name) || "").trim();
    field.setAttribute("aria-invalid", String(empty));
    if (empty && !firstInvalid) firstInvalid = field;
  }
  if (firstInvalid) {
    feedback.textContent =
      "Preencha nome, WhatsApp e a mensagem para continuar.";
    firstInvalid.focus();
    return;
  }
  const services = values.getAll("services");
  const lines = [
    "Olá, Brave Bear! Gostaria de falar com a equipe.",
    "",
    `Nome: ${values.get("name")}`,
    values.get("company") ? `Empresa: ${values.get("company")}` : "",
    values.get("email") ? `E-mail: ${values.get("email")}` : "",
    `WhatsApp: ${values.get("phone")}`,
    values.get("eventInfo") ? `Data e cidade: ${values.get("eventInfo")}` : "",
    services.length ? `Procuro: ${services.join(", ")}` : "",
    values.get("source")
      ? `Como encontrou a Brave Bear: ${values.get("source")}`
      : "",
    `Mensagem: ${values.get("description")}`,
  ].filter(Boolean);
  const destination = `https://wa.me/5511911728323?text=${encodeURIComponent(lines.join("\n"))}`;
  const link = document.createElement("a");
  link.href = destination;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "WhatsApp";
  feedback.replaceChildren(
    "Sua mensagem está pronta. Revise e envie pelo ",
    link,
    ".",
  );
  window.open(destination, "_blank", "noopener,noreferrer");
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "quote_request_prepared",
    source: "contact_page",
    method: "whatsapp",
  });
  if (typeof window.gtag === "function") {
    window.gtag("event", "quote_form_submit", {
      form_name: "contact_form",
      destination: "whatsapp",
    });
  }
  if (typeof window.fbq === "function") window.fbq("track", "Lead");
});
