# Engenharia e operação

## Arquitetura

Site estático servido por CDN (GitHub Pages), sem banco, sessão ou backend. Manter HTML/CSS/JS evita dependências de runtime e builds de frameworks sem necessidade. O PDF de catálogo só é transferido quando solicitado pelo visitante.

- `catalog-data.js`: dados locais versionados do catálogo.
- `script.js`: navegação, orçamento e apresentação institucional.
- `calculator.js`: cálculo e exportação do mapa, carregados somente na calculadora.
- `equipamentos.js`: busca local, categorias e diálogo de imagens.
- `interactivity.js`: demonstrações, carregadas ao aproximar da seção.
- `enhancements.js`: imagens, placeholders e carregamento opcional compartilhado; `// @ts-check` e JSDoc ativam verificação estrita neste módulo.
- `enhancements.css`: foco acessível, skeleton estático e movimento reduzido.
- `tools/`: servidor local restrito ao loopback e empacotamento por lista explícita.

O JavaScript legado continua com análise sintática e lint, mas ainda não possui cobertura estrita de tipos. Expandir JSDoc e `checkJs` por módulo é uma evolução planejada; a validação atual não equivale a tipagem integral.

## Segurança e dados

Não existe login próprio nem emissão/armazenamento de credenciais ou tokens. O formulário prepara uma URL do WhatsApp com os dados informados. Esses dados seguem para o WhatsApp ao abrir a URL; não são persistidos pelo site e não integram os eventos de analytics. A interface de feedback usa APIs DOM, sem interpolação de dados do formulário em HTML. Links externos usam isolamento de `opener`.

O catálogo interpolado em templates é conteúdo local confiável, revisado em Git. Dados de CMS/API exigiriam validação e renderização segura antes de substituir essa origem. O parâmetro de categoria é validado contra IDs conhecidos.

O selo externo do Reclame Aqui possui execução de terceiros e é carregado perto do rodapé. Fontes Google continuam externas. Testes locais isolam serviços externos; não validam disponibilidade nem comportamento desses fornecedores. Uma CSP completa com hashes e cabeçalhos deve ser configurada quando houver controle de headers na hospedagem; não foi simulada uma proteção inexistente no Pages.

A calculadora valida as restrições do formulário, limpa resultados inválidos e limita exportações a 10.000 placas. A visualização mantém o limite prévio de 1.200 placas para limitar o DOM. Estimativas elétricas exigem validação técnica do projeto.

## Desenvolvimento e validação

Node 24 e pnpm 10.32.1. Instalar com `pnpm install --frozen-lockfile`, depois `pnpm exec playwright install chromium`. `pnpm dev` serve em `http://127.0.0.1:4173`. Nunca usar credenciais de produção nos testes.

`pnpm validate` executa Biome, TypeScript, análise sintática de todos os scripts, verificação de recursos HTML, orçamento de JavaScript (160 KB), testes Chromium em desktop e celular com movimento reduzido e auditoria de dependências (bloqueia severidade alta/crítica). Empacota `dist/` somente após sucesso. `pnpm format` aplica formatação JS/JSON; o HTML/CSS existente não está no escopo do formatador. A instalação é reproduzível pelo lockfile.

Os testes cobrem ausência de erros de runtime nas três páginas, layout sem overflow, catálogo/busca/diálogo, limites e recuperação da calculadora, carga sob demanda e preparação segura do orçamento. Testes determinísticos não substituem auditoria completa de acessibilidade, pentest, compatibilidade multi-browser ou métricas de campo de performance.

## Integração e publicação

Trabalhar em branch e abrir pull request. O workflow `Quality` valida PRs sem publicar. Apenas push em `main`, após sucesso do job `quality`, permite o job `deploy`. O artefato publicado contém somente arquivos da lista de distribuição; dependências, `.git`, relatórios e arquivos de ambiente ficam fora.

Para tornar o bloqueio efetivo no GitHub, o administrador deve configurar:

1. Settings → Pages → Source: **GitHub Actions**. Desativar publicação direta por branch e workflows alternativos que contornem `quality`.
2. Ruleset para `main`: exigir pull request, revisão aprovada, check `quality` e branch atualizada; impedir pushes diretos e bypass.
3. Environment `github-pages`: permitir apenas `main`; adicionar aprovação de deploy se exigida pelo processo da equipe.

Configuração aplicada em 30/10/2026: Pages com source GitHub Actions; proteção clássica de `main` exigindo PR, uma aprovação, descarte de aprovações após novos commits, check `quality`, branch atualizada e aplicação também a administradores. Force push e exclusão da branch não são permitidos. O redirecionamento obrigatório para HTTPS também foi ativado. A configuração de environment acima permanece uma opção adicional. Uma aprovação precisa vir de outro colaborador habilitado, pois o autor não aprova o próprio PR.

O workflow versionado depende da manutenção dessas configurações administrativas. Sua simples presença não impede publicação por um mecanismo alternativo. O PR permanece aberto para revisão; nenhuma alteração de código foi integrada em `main` ou publicada nesta entrega.

## Performance e evolução

Imagens do catálogo mantêm lazy loading nativo e dimensões explícitas. Placeholders estáticos não consomem animações contínuas e são removidos em sucesso/erro, inclusive em imagens inseridas dinamicamente. Scripts opcionais são carregados com margem de 600 px e antecipados por foco/ponteiro. Falhas podem ser tentadas novamente com nova interação.

Preservar o hero sem lazy loading. Medir LCP, CLS e INP em ambiente real antes de definir orçamento de performance; não há ganhos percentuais comprovados por esta alteração. Próximos passos incluem formatos mais leves para imagens grandes, tipagem dos módulos legados e auto-hospedagem de fontes se apropriado.
