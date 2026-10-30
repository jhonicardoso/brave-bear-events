const ledCalcForm = document.querySelector("#led-calc-form");
const ledCalcMap = document.querySelector("#led-map");
const ledCalcFormat = (value, digits = 0) =>
  new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
const ledCalcValue = (name) => Number(ledCalcForm.elements[name].value);
let ledCalcState = null;

function updateLedCalculator() {
  if (!ledCalcForm || !ledCalcMap) return;
  ledCalcState = null;
  const feedback = document.querySelector("#led-calc-feedback");
  if (!ledCalcForm.checkValidity()) {
    if (feedback)
      feedback.textContent =
        "Revise os valores informados. Os resultados anteriores não são válidos.";
    ledCalcMap.replaceChildren();
    document.querySelectorAll("[data-result]").forEach((result) => {
      result.textContent = "—";
    });
    return;
  }
  if (feedback) feedback.textContent = "";
  const form = ledCalcForm.elements;
  const preset = form.modulePreset.value;
  const [moduleWidth, moduleHeight] =
    preset === "custom"
      ? [Number(form.moduleWidth.value), Number(form.moduleHeight.value)]
      : preset.split("x").map(Number);
  const pitch =
    form.pitch.value === "custom"
      ? Number(form.customPitch.value)
      : Number(form.pitch.value);
  const panelWidth = ledCalcValue("width");
  const panelHeight = ledCalcValue("height");
  if (
    ![moduleWidth, moduleHeight, pitch, panelWidth, panelHeight].every(
      (n) => Number.isFinite(n) && n > 0,
    )
  )
    return;

  const columns = Math.ceil(panelWidth / moduleWidth);
  const rows = Math.ceil(panelHeight / moduleHeight);
  const tiles = columns * rows;
  if (!Number.isSafeInteger(tiles) || tiles > 10000) {
    if (feedback)
      feedback.textContent =
        "O limite desta ferramenta é de 10.000 placas. Reduza as dimensões ou aumente o módulo.";
    ledCalcMap.replaceChildren();
    document.querySelectorAll("[data-result]").forEach((result) => {
      result.textContent = "—";
    });
    return;
  }
  const modulePixelsWide = Math.max(
    1,
    Math.round((moduleWidth * 1000) / pitch),
  );
  const modulePixelsHigh = Math.max(
    1,
    Math.round((moduleHeight * 1000) / pitch),
  );
  const resolutionWidth = columns * modulePixelsWide;
  const resolutionHeight = rows * modulePixelsHigh;
  const builtWidth = columns * moduleWidth;
  const builtHeight = rows * moduleHeight;
  const area = builtWidth * builtHeight;
  const weightEach =
    Number(form.weight.value) > 0
      ? Number(form.weight.value)
      : preset === "0.5x0.5"
        ? 7.5
        : preset === "0.5x1"
          ? 14
          : 30 * moduleWidth * moduleHeight;
  const weight = weightEach * tiles;
  const caseCapacity = Math.max(1, ledCalcValue("caseCapacity"));
  const pixelsPerPort = Math.max(1, ledCalcValue("pixelsPerPort"));
  const usablePixels = pixelsPerPort * (1 - ledCalcValue("signalMargin") / 100);
  const signalCascade = Math.max(1, ledCalcValue("signalCascade"));
  const perPort = Math.max(
    1,
    Math.min(
      signalCascade,
      Math.floor(usablePixels / (modulePixelsWide * modulePixelsHigh)),
    ),
  );
  const signalGroups = Math.ceil(tiles / perPort);
  const wattsPerSqm = Math.max(1, ledCalcValue("wattsPerSqm"));
  const power = area * wattsPerSqm;
  const voltage = ledCalcValue("voltage");
  const amps = Math.max(1, ledCalcValue("amps"));
  const circuitUse = ledCalcValue("circuitUse") / 100;
  const acCascade = Math.max(1, ledCalcValue("acCascade"));
  const wattsPerTile = area > 0 ? power / tiles : 0;
  const powerPerCircuit = voltage * amps * circuitUse;
  const tilesPerAcCircuit = Math.max(
    1,
    Math.min(acCascade, Math.floor(powerPerCircuit / wattsPerTile)),
  );
  const acGroups = Math.ceil(tiles / tilesPerAcCircuit);
  const estimatedKva = power / 1000 / 0.9;
  const distanceMin = pitch / 1000;
  const distanceMax = (pitch * 3) / 1000;

  ledCalcState = {
    rows,
    columns,
    tiles,
    modulePixelsWide,
    modulePixelsHigh,
    resolutionWidth,
    resolutionHeight,
    builtWidth,
    builtHeight,
    area,
    weightEach,
    weight,
    caseCapacity,
    perPort,
    signalGroups,
    power,
    estimatedKva,
    acGroups,
    tilesPerAcCircuit,
    distanceMin,
    distanceMax,
  };
  const results = {
    tiles: `${ledCalcFormat(tiles)} placas`,
    resolution: `${ledCalcFormat(resolutionWidth)} × ${ledCalcFormat(resolutionHeight)} px`,
    area: `${ledCalcFormat(area, 2)} m² (${ledCalcFormat(builtWidth, 2)} × ${ledCalcFormat(builtHeight, 2)} m)`,
    cases: `${ledCalcFormat(Math.ceil(tiles / caseCapacity))} (${ledCalcFormat(caseCapacity)} por case)`,
    weight: `${ledCalcFormat(weight, 1)} kg (${ledCalcFormat(weightEach, 1)} kg/placa)`,
    distance: `${ledCalcFormat(distanceMin, 1)}–${ledCalcFormat(distanceMax, 1)} m`,
    perPort: `${ledCalcFormat(perPort)} (${ledCalcFormat(Math.ceil(modulePixelsWide * modulePixelsHigh))} px/placa)`,
    signalCables: `${ledCalcFormat(signalGroups)} circuitos / ${ledCalcFormat(tiles - signalGroups)} jumpers`,
    power: `${ledCalcFormat(power)} W · ${ledCalcFormat(estimatedKva, 2)} kVA*`,
    acCircuits: `${ledCalcFormat(acGroups)} circuitos / ${ledCalcFormat(tiles - acGroups)} jumpers`,
  };
  Object.entries(results).forEach(([key, value]) => {
    const output = document.querySelector(`[data-result="${key}"]`);
    if (output) output.textContent = value;
  });
  const summary = document.querySelector('[data-result="mapSummary"]');
  if (summary)
    summary.textContent = `${rows} linhas × ${columns} colunas · ${builtWidth.toFixed(2)} × ${builtHeight.toFixed(2)} m`;
  drawLedMap();
}

function drawLedMap() {
  const state = ledCalcState;
  if (!state || !ledCalcMap) return;
  const maxVisibleTiles = 1200;
  if (state.tiles > maxVisibleTiles) {
    ledCalcMap.replaceChildren();
    ledCalcMap.style.gridTemplateColumns = "1fr";
    const message = document.createElement("p");
    message.className = "led-map-download-note";
    message.textContent = `O mapa detalhado tem ${ledCalcFormat(state.tiles)} placas. Reduza as dimensões para visualizar o mapa na página.`;
    ledCalcMap.append(message);
    return;
  }
  ledCalcMap.style.gridTemplateColumns = `repeat(${state.columns}, 56px)`;
  const fragment = document.createDocumentFragment();
  for (let row = 0; row < state.rows; row += 1) {
    const leftToRight = row % 2 === 0;
    for (let step = 0; step < state.columns; step += 1) {
      const column = leftToRight ? step : state.columns - 1 - step;
      const index = row * state.columns + step;
      const signalCircuit = Math.floor(index / state.perPort) + 1;
      const acCircuit = Math.floor(index / state.tilesPerAcCircuit) + 1;
      const tile = document.createElement("div");
      tile.className = "led-map-tile";
      tile.title = `Placa ${index + 1}, linha ${row + 1}, coluna ${column + 1}, sinal S${signalCircuit}, AC${acCircuit}`;
      const position = document.createElement("span");
      position.textContent = `${leftToRight ? "→" : "←"} L${row + 1} C${column + 1}`;
      const label = document.createElement("strong");
      label.textContent = `P${index + 1}`;
      const circuits = document.createElement("small");
      circuits.textContent = `S${signalCircuit} · AC${acCircuit}`;
      tile.append(position, label, circuits);
      fragment.append(tile);
    }
  }
  ledCalcMap.replaceChildren(fragment);
}

if (ledCalcForm) {
  ledCalcForm.addEventListener("input", updateLedCalculator);
  ledCalcForm.addEventListener("change", (_event) => {
    const showModule = ledCalcForm.elements.modulePreset.value === "custom";
    ledCalcForm.querySelectorAll(".custom-module-field").forEach((field) => {
      field.hidden = !showModule;
    });
    ledCalcForm.querySelector(".custom-pitch-field").hidden =
      ledCalcForm.elements.pitch.value !== "custom";
    updateLedCalculator();
  });
  const mapDownload = document.querySelector("#led-map-download");
  mapDownload?.addEventListener("click", () => {
    if (!ledCalcState) return;
    const state = ledCalcState;
    const lines = [
      "Pixel Map — Brave Bear Events",
      `Dimensões: ${state.builtWidth.toFixed(2)} × ${state.builtHeight.toFixed(2)} m`,
      `Resolução: ${state.resolutionWidth} × ${state.resolutionHeight} px`,
      `Placas: ${state.tiles}`,
      `Peso estimado: ${state.weight.toFixed(1)} kg`,
      `Circuitos de sinal estimados: ${state.signalGroups}`,
      `Circuitos AC estimados: ${state.acGroups}`,
      "",
      "Placa;Linha;Coluna;Circuito sinal;Circuito AC",
    ];
    for (let row = 0; row < state.rows; row += 1) {
      for (let step = 0; step < state.columns; step += 1) {
        const column = row % 2 === 0 ? step : state.columns - 1 - step;
        const index = row * state.columns + step;
        lines.push(
          `${index + 1};${row + 1};${column + 1};S${Math.floor(index / state.perPort) + 1};AC${Math.floor(index / state.tilesPerAcCircuit) + 1}`,
        );
      }
    }
    const blob = new Blob(["\ufeff", lines.join("\r\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "brave-bear-pixel-map.csv";
    link.click();
    URL.revokeObjectURL(url);
  });
  updateLedCalculator();
}
