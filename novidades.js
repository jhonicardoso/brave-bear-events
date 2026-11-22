// Inscrição em novidades por e-mail. O atendimento grava o aceite e envia um e-mail de confirmação;
// só depois de a pessoa confirmar o contato entra na lista. Mensagens são inseridas como texto (sem HTML).
const form = document.getElementById("news-form");
if (form) {
  const endpoint = "https://atendimento.bravebear.com.br/api/novidades";
  const feedback = document.getElementById("news-feedback");
  const button = form.querySelector("button[type=submit]");
  const say = (text, isError = false) => {
    feedback.textContent = text;
    feedback.classList.toggle("is-error", isError);
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();
    if (!form.elements.aceito.checked)
      return say("Marque a caixa de aceite para continuar.", true);
    if (!email || !form.elements.email.checkValidity())
      return say("Informe um e-mail válido.", true);

    button.disabled = true;
    say("Enviando...");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          nome: String(data.get("nome") || "").trim(),
          website: String(data.get("website") || ""),
          aceito: true,
          origem: "site",
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        say(
          typeof result.error === "string"
            ? result.error
            : "Não foi possível enviar agora. Tente de novo em instantes.",
          true,
        );
      } else {
        form.reset();
        say(
          `Quase lá! Enviamos um e-mail de confirmação para ${email}. Clique no link dele para ativar a inscrição (olhe também o spam).`,
        );
      }
    } catch {
      say("Sem conexão. Verifique sua internet e tente de novo.", true);
    } finally {
      button.disabled = false;
    }
  });
}
