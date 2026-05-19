// ===== FONCTION UTILITAIRE ROBUSTE POUR LES TAILLES D'ÉCRAN =====
export function getResponsiveDimensions() {
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  
  // Hauteur disponible pour le jeu (en soustrayant les marges)
  const availableHeight = Math.max(300, vh - 200);
  const availableWidth = Math.max(300, vw - 48);
  
  // Dimensions basées sur l'écran
  const dimensions = {
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
  };
  
  // Tailles recommandées pour canvas/conteneurs
  dimensions.canvasWidth = Math.min(500, availableWidth * 0.9);
  dimensions.canvasHeight = Math.min(500, availableHeight * 0.85);
  
  // Pour les grilles
  dimensions.gridSize = Math.max(15, Math.floor(availableHeight / 25));
  
  return dimensions;
}

// ===== FONCTION POUR ADAPTER UN CANVAS =====
export function setResponsiveCanvas(canvas, preferredWidth = 500, preferredHeight = 500) {
  const dims = getResponsiveDimensions();
  
  canvas.width = Math.min(preferredWidth, dims.canvasWidth);
  canvas.height = Math.min(preferredHeight, dims.canvasHeight);
  
  canvas.style.maxWidth = '100%';
  canvas.style.maxHeight = '100%';
  canvas.style.display = 'block';
  canvas.style.margin = '0 auto';
  
  return { width: canvas.width, height: canvas.height };
}

// ===== FONCTION POUR ADAPTER UN CONTENEUR =====
export function setResponsiveContainer(container) {
  const dims = getResponsiveDimensions();
  
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.justifyContent = 'center';
  container.style.alignItems = 'center';
  container.style.maxHeight = `${dims.availableHeight}px`;
  container.style.overflow = 'auto';
  
  return dims;
}

// ===== FONCTION POUR ADAPTER LES ÉLÉMENTS TEXTE =====
export function setResponsiveText(element, minSize = 12, maxSize = 24) {
  const dims = getResponsiveDimensions();
  
  // Taille de police adaptée à l'écran
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

// ===== FONCTION POUR ADAPTER LES GRILLES (GRILLE DE JEU) =====
export function getAdaptiveGridSettings(preferredGridSize = 20) {
  const dims = getResponsiveDimensions();
  
  // Adapter la taille de la grille selon la hauteur disponible
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
