window.BRAVE_CATALOG = (() => {
const categories = [
  { id: "led", label: "Painel de LED", short: "Painel de LED", count: "12 opções", tagline: "Painéis, cubos e formatos que dão presença ao conteúdo visual.", image: "assets/led.webp", symbol: "▦" },
  { id: "interactive", label: "Interatividade", short: "Interatividade", count: "10 soluções", tagline: "Tecnologia que conecta pessoas e experiências.", image: "assets/interactive.webp", symbol: "⌁" },
  { id: "televisions", label: "Televisores", short: "Televisores", count: "8 opções", tagline: "Imagens impactantes com qualidade para o seu evento.", image: "assets/televisions.webp", symbol: "▣" },
  { id: "projection", label: "Projeção", short: "Projeção", count: "11 opções", tagline: "Soluções de projeção para impactar o público.", image: "assets/projection.webp", symbol: "▱" },
  { id: "processing", label: "Processamento e controle de LED", short: "Controle de LED", count: "12 opções", tagline: "Processamento e operação de painéis de LED.", image: "assets/processing.webp", symbol: "⌘" },
  { id: "audio", label: "Sonorização", short: "Sonorização", count: "15 opções", tagline: "Som de alta qualidade para diferentes formatos de evento.", image: "assets/audio.webp", symbol: "◖))" },
  { id: "lighting", label: "Iluminação", short: "Iluminação", count: "36 opções", tagline: "Luz para valorizar cada detalhe do evento.", image: "assets/lighting.webp", symbol: "✳" },
  { id: "structure", label: "Estrutura", short: "Estrutura", count: "9 opções", tagline: "Estrutura para dar suporte às ideias do seu evento.", image: "assets/structure.webp", symbol: "⌗" }
];

const products = {
  led: [
    ["LED P1.9MM Indoor", "Placa 50 × 50"],
    ["LED P2.9MM Flexível Indoor", "Placa 50 × 50"],
    ["LED P2.9MM Canto Vivo Indoor", "Placa 50 × 50"],
    ["LED P2.9MM Flexível Canto Vivo", "Placa 50 × 50"],
    ["LED P3.9MM Canto Vivo Outdoor", "Placa 50 × 50"],
    ["LED P2.9MM Indoor Curvo", "Placa 50 × 50"],
    ["LED P3.9MM Outdoor / Indoor", "Placa 50 × 50"],
    ["Piso de LED P3.9MM Indoor", "Indoor"],
    ["Totem de LED P1.8", "0,65 × 2 m · Resolução 344 × 1032"],
    ["Cubo de LED — no piso", "Formato de instalação para destacar marcas e produtos"],
    ["Cubos de LED — empilhados", "Composição vertical para ações e exposições"],
    ["Cubo de LED — suspenso", "Instalação aérea para ampliar a presença visual"]
  ],
  interactive: [
    ["Totem de LED P1.8", "0,65 × 2 m · Resolução 344 × 1032"],
    ["Totem interativo com tablet", ""],
    ["Totem interativo 43″", ""],
    ["Totem interativo 55″", ""],
    ["Totem interativo 65″", ""],
    ["Totem interativo 75″", ""],
    ["Totem interativo 85″", ""],
    ["Totem interativo vertical", ""],
    ["Totem interativo horizontal", ""],
    ["iPad e Tablet", "Dispositivos para experiências e interações personalizadas"]
  ],
  televisions: [
    ["TV 85″", ""], ["TV 75″", ""], ["TV 65″", ""], ["TV 55″", ""], ["TV 43″", ""],
    ["Dog House 43″ a 55″", ""], ["Dog House fechada", ""], ["Pedestal 43″ a 85″", ""]
  ],
  projection: [
    ["Projetor 3.000–4.000 ANSI", ""], ["Projetor 5.000–6.000 ANSI", ""],
    ["Projetor 8.000–10.000 ANSI", ""], ["Projetor de alta luminosidade", ""],
    ["Tela de projeção", "Diversos formatos"], ["Tela tripé", ""], ["Tela tensionada", ""],
    ["Tela frontal / traseira", ""], ["Projetor + lente de longo alcance", ""],
    ["Switcher para projeção", ""], ["Processadores / scalers", ""]
  ],
  processing: [
    ["Máquina de gerenciamento", ""], ["Processadora H2", ""], ["Processadora 4K", ""],
    ["Processadora VX1000", ""], ["Processadora 605S / 660", ""], ["Send Card 600", ""],
    ["Send Card 300", ""], ["Notebook Gamer", ""], ["Notebook i5–i7", ""],
    ["Cue Light", ""], ["Fibra Óptica HDMI 100M", ""], ["Main Power 5 KVA", ""]
  ],
  audio: [
    ["Mesa TF5", "32 canais"], ["Mesa iX32 Compact", "24 canais"],
    ["Mesa QSC TouchMix", "32 canais"], ["Mesa QSC TouchMix", "16 canais"],
    ["Mesa Arcano", "12 canais"], ["Mesa Promixer", "8 canais"],
    ["Mic bastão Sennheiser G3 / G4 / G5", ""],
    ["Mic headset Madonna / Countryman Sennheiser G4 / G5", ""],
    ["Mic headset lapela Sennheiser G4 / G5", ""],
    ["Rack microfone Sennheiser G5 EW-D 835-S", ""],
    ["Amplificador de antena", ""], ["Placa de áudio", ""],
    ["Caixa QSC KC12 Torre", ""], ["Caixa QSC K12.2 / K10.2", ""], ["Sub QSC KW181", ""]
  ],
  lighting: [
    ["Par LED Slim 3W", ""], ["Par LED Slim 12W", ""], ["Par LED Indoor 18W RGBW", ""],
    ["Par LED 15W RGBWA-UV", ""], ["Par LED Blindada 18W RGBW", ""], ["Par LED Bateria RGBWA-UV", ""],
    ["LED P5", ""], ["Ribalta RGBW 8W", ""], ["Ribalta RGBW 12W", ""], ["Ribalta Blindada RGBW 30W", ""],
    ["Strobo LED RGBW 1000W", ""], ["Fresnel 1000W", ""], ["Fresnel 2000W", ""],
    ["Fresnel LED 200W", ""], ["Vara de Pimbim LED e Quente", ""], ["Mini Brut LED", ""],
    ["Mini Brut Quente", "2L, 4L ou 6L"], ["Elipsoidal ETC 575W / 750W", ""], ["Elipsoidal LED AB 200W", ""], ["Canhão Seguidor 7R", ""],
    ["Moving Wash 320W", ""], ["Moving Beam 14R 295W com borda LED", ""],
    ["Moving Beam 17R 350W", ""], ["Moving Beam 7R 230W", ""], ["Moving Spot LED 150W", ""],
    ["Sky Light 4000W", ""], ["Sky Paper", ""], ["Rack Buffer", ""],
    ["Máquina de Fumaça 1500W", ""], ["Máquina de Fumaça 3000W", ""], ["Máquina de Haze", ""],
    ["Mesa DMX Operator 512", ""], ["Mesa Grand MA2", ""], ["Mesa Avolite 2010", ""], ["Mesa 1024", ""], ["Mesa Kingkong", ""]
  ],
  structure: [
    ["Box Truss Q15", ""], ["Box Truss Q25", ""], ["Box Truss Q30", ""],
    ["Sleeve", "Acessório de truss"], ["Pau de carga", "Acessório de truss"],
    ["AlumaLock", "Acessório de truss"], ["Talhas", "Acessório de truss"],
    ["Bases", "Acessório de truss"], ["Passa cabo", "Segurança e organização"]
  ]
};

return { categories, products };
})();
