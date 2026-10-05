# Brave Bear Events — site institucional

Site institucional responsivo em HTML, CSS e JavaScript, usando a identidade e os materiais do catálogo oficial.

## Abrir

Abra `index.html` no navegador. O projeto não precisa de instalação ou processo de build.

## Conteúdo e conversão

- Navegação por soluções, kits, interatividade e categorias do catálogo.
- Busca local de equipamentos, sem preços.
- Formulário de orçamento com opções para abrir uma conversa no WhatsApp comercial `+55 11 91172-8323` ou preparar um e-mail para `comercial@bravebear.com.br`.
- Os dados do formulário não são armazenados pelo site; o visitante revisa e confirma a mensagem no WhatsApp ou em seu aplicativo de e-mail.
- SEO básico inclui metadados, Open Graph, sitemap, robots.txt e Schema.org.

## Integrações

O envio de leads para CRM, Google Analytics 4 e Meta Pixel depende dos IDs e do endpoint fornecidos pela Brave Bear. O formulário já publica o evento `quote_request_prepared` em `dataLayer` e chama `gtag` / `fbq` quando essas integrações estiverem carregadas. Nenhum identificador foi preenchido no projeto.

## Imagens

`prepare_assets.py` gera versões leves para web a partir do logo, do cartão e das páginas do catálogo oficial. `prepare_client_logos.py` converte as 30 marcas enviadas para versões brancas com fundo transparente. Ambos requerem Python com Pillow.

`assets/brand-lockup-white.png` preserva a logo oficial completa para o cabeçalho e o rodapé em fundos escuros; o favicon usa o símbolo oficial do urso. `assets/hero-bear.webp` é a nova imagem de abertura, com o símbolo oficial aplicado sobre o painel de LED. `assets/client-logos/` contém as logos dos clientes em branco para o carrossel institucional. A galeria de soluções usa as imagens de referência do catálogo oficial.

`assets/catalog-items/` contém recortes de produtos do catálogo usados nos cartões individuais de equipamentos. Quando vários tamanhos aparecem com uma única foto no PDF, o site reaproveita essa imagem.
