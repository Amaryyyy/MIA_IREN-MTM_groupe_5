export function getAdaptiveGridSettings(baseTile = 20) {
  const viewportWidth = window.innerWidth || 1200;
  const viewportHeight = window.innerHeight || 800;

  // The maze map in game1 is 10x10.
  const mapCols = 10;
  const mapRows = 10;

  // Keep margins so the game fits in the container on small screens.
  const maxCanvasWidth = Math.max(220, Math.floor(viewportWidth * 0.78));
  const maxCanvasHeight = Math.max(220, Math.floor(viewportHeight * 0.58));

  const maxTileFromWidth = Math.floor(maxCanvasWidth / mapCols);
  const maxTileFromHeight = Math.floor(maxCanvasHeight / mapRows);

  const gridSize = Math.max(14, Math.min(baseTile, maxTileFromWidth, maxTileFromHeight));

  const cols = mapCols;
  const rows = mapRows;
  const canvasWidth = cols * gridSize;
  const canvasHeight = rows * gridSize;

  return {
    gridSize,
    cols,
    rows,
    canvasWidth,
    canvasHeight,
  };
}

export function setResponsiveText(element, minPx = 14, maxPx = 24) {
  if (!element) return;

  const viewportWidth = window.innerWidth || 1200;
  const candidate = Math.floor(viewportWidth / 28);
  const fontSize = Math.max(minPx, Math.min(maxPx, candidate));
  element.style.fontSize = `${fontSize}px`;
}
