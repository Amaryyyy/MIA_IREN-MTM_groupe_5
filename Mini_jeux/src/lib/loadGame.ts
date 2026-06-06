import { getAllLevels, getLevelTitle } from "@/lib/level";
import { gameManager } from "@/lib/gameCleanup";
import type { GameStarter, LoadGameResult } from "@/types/game";

const gameModules = import.meta.glob<Record<string, unknown>>("../games/*.ts");

function resolveStarter(
  module: Record<string, unknown>,
  levelGameId: string
): GameStarter | null {
  const expectedExport = `start${levelGameId.charAt(0).toUpperCase()}${levelGameId.slice(1)}`;

  const expected = module[expectedExport];
  if (typeof expected === "function") {
    return expected as GameStarter;
  }

  const firstMatchingExport = Object.keys(module).find(
    (key) => /^startGame\d+$/.test(key) && typeof module[key] === "function"
  );

  return firstMatchingExport
    ? (module[firstMatchingExport] as GameStarter)
    : null;
}

export async function loadGame(
  container: HTMLElement,
  levelIndex: number,
  onFinish: () => void
): Promise<LoadGameResult> {
  const levels = getAllLevels();
  const currentLevelData = levels[levelIndex];

  gameManager.cleanup();

  if (!currentLevelData) {
    return { title: "Bravo !", finished: true, error: null };
  }

  const title =
    getLevelTitle(levelIndex) ||
    `Game ${levelIndex + 1} - ${currentLevelData.game}`;
  container.innerHTML = "";

  try {
    gameManager.startGame();

    const modulePath = `../games/${currentLevelData.game}.ts`;
    const importer = gameModules[modulePath];

    if (!importer) {
      throw new Error(`Fichier de jeu introuvable: ${modulePath}`);
    }

    const module = await importer();
    const startGameFunction = resolveStarter(module, currentLevelData.game);

    if (!startGameFunction) {
      throw new Error(
        `Aucune fonction de demarrage trouvee dans ${currentLevelData.game}.ts`
      );
    }

    const onFinishWrapper = () => {
      gameManager.cleanup();
      onFinish();
    };

    startGameFunction(container, onFinishWrapper);

    return { title, finished: false, error: null };
  } catch (error) {
    console.error(error);
    const safeMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    container.innerHTML = `<p>Erreur de chargement pour ${currentLevelData.game}: ${safeMessage}</p>`;
    return { title, finished: false, error: safeMessage };
  }
}

export { getAllLevels, getLevelTitle };
