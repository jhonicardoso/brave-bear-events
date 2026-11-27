# Prova social (depoimentos reais)

A seção `#depoimentos` do `index.html` está oculta (`hidden`) até existirem depoimentos reais, com autorização de quem os deu.

## Como ativar
1. Abra `depoimentos-data.js` e acrescente cada depoimento real:
   ```js
   window.BRAVE_DEPOIMENTOS = [
     { quote: "Texto exato enviado pelo cliente.", name: "Nome", role: "Cargo", company: "Empresa", source: "Google" },
   ];
   ```
   O primeiro da lista aparece em destaque. `source` é opcional.
2. A seção "Quem fala da Brave Bear" aparece sozinha quando a lista deixa de estar vazia.
3. Guarde a autorização (e-mail ou WhatsApp) de cada cliente.

## Mensagem para pedir o depoimento
> Olá, [nome]! Foi um prazer atender o [evento]. Você poderia nos enviar 2 ou 3 frases sobre como foi trabalhar com a Brave Bear? Podemos publicar no nosso site com seu nome, cargo e empresa. Se preferir, pode também deixar uma avaliação no nosso perfil do Google: [link].

Também vale pedir a avaliação no Google e a autorização para usar o logo do cliente na seção de clientes.
