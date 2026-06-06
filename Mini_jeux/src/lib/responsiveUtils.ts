export interface ResponsiveDimensions {
  screenHeight: number;
  screenWidth: number;
  availableHeight: number;
  availableWidth: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isSmallHeight: boolean;
  isNormalHeight: boolean;
  isLargeHeight: boolean;
  canvasWidth: number;
  canvasHeight: number;
  gridSize: number;
}

export interface AdaptiveGridSettings {
  gridSize: number;
  cols: number;
  rows: number;
  canvasWidth: number;
  canvasHeight: number;
}

export function getResponsiveDimensions(): ResponsiveDimensions {
  const vh = window.innerHeight;
  const vw = window.innerWidth;

  const availableHeight = Math.max(300, vh - 200);
  const availableWidth = Math.max(300, vw - 48);

  const dimensions: ResponsiveDimensions = {
    screenHeight: vh,
    screenWidth: vw,
    availableHeight,
    availableWidth,
    isMobile: vw < 768,
    isTablet: vw >= 768 && vw < 1024,
    isDesktop: vw >= 1024,
    isSmallHeight: vh < 700,
    isNormalHeight: vh >= 700 && vh < 900,
    isLargeHeight: vh >= 900,
    canvasWidth: Math.min(500, availableWidth * 0.9),
    canvasHeight: Math.min(500, availableHeight * 0.85),
    gridSize: Math.max(15, Math.floor(availableHeight / 25)),
  };

  return dimensions;
}

export function setResponsiveCanvas(
  canvas: HTMLCanvasElement,
  preferredWidth = 500,
  preferredHeight = 500
) {
  const dims = getResponsiveDimensions();

  canvas.width = Math.min(preferredWidth, dims.canvasWidth);
  canvas.height = Math.min(preferredHeight, dims.canvasHeight);

  canvas.style.maxWidth = "100%";
  canvas.style.maxHeight = "100%";
  canvas.style.display = "block";
  canvas.style.margin = "0 auto";

  return { width: canvas.width, height: canvas.height };
}

export function setResponsiveContainer(container: HTMLElement) {
  const dims = getResponsiveDimensions();

  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.justifyContent = "center";
  container.style.alignItems = "center";
  container.style.maxHeight = `${dims.availableHeight}px`;
  container.style.overflow = "auto";

  return dims;
}

export function setResponsiveText(
  element: HTMLElement,
  minSize = 12,
  maxSize = 24
) {
  const dims = getResponsiveDimensions();

  let fontSize = minSize;
  if (dims.isDesktop) {
    fontSize = maxSize;
  } else if (dims.isTablet) {
    fontSize = (minSize + maxSize) / 2;
  } else {
    fontSize = minSize + 2;
  }

  element.style.fontSize = `${fontSize}px`;
  return fontSize;
}

export function getAdaptiveGridSettings(preferredGridSize = 20): AdaptiveGridSettings {
  const dims = getResponsiveDimensions();

  let gridSize = preferredGridSize;

  if (dims.isSmallHeight) {
    gridSize = Math.max(12, preferredGridSize - 8);
  } else if (dims.isNormalHeight) {
    gridSize = preferredGridSize;
  } else {
    gridSize = Math.min(preferredGridSize + 5, 30);
  }

  return {
    gridSize,
    cols: Math.floor(dims.canvasWidth / gridSize),
    rows: Math.floor(dims.canvasHeight / gridSize),
    canvasWidth: Math.floor(dims.canvasWidth / gridSize) * gridSize,
    canvasHeight: Math.floor(dims.canvasHeight / gridSize) * gridSize,
  };
}
