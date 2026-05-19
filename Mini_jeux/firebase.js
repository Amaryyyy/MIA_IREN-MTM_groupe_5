// Stub Firebase connector — remplacez par votre configuration Firebase réelle.
// Ce fichier évite les erreurs de chargement lorsqu'aucune config n'est fournie.

export function initFirebase(config) {
  if (!config) {
    console.warn('firebase.js: aucun config fourni — Firebase non initialisé.');
    return null;
  }

  // Si vous souhaitez utiliser Firebase, importez et initialisez ici :
  // import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
  // const app = initializeApp(config);
  // return app;

  console.warn('firebase.js: initFirebase appelé, mais l\'initialisation réelle est commentée pour sécurité.');
  return null;
}

export async function saveScore(scoreObj) {
  console.warn('firebase.js: saveScore appelé mais Firebase non configuré.', scoreObj);
  return false;
}

export async function fetchTopScores(limit = 10) {
  console.warn('firebase.js: fetchTopScores appelé mais Firebase non configuré.');
  return [];
}

export default {
  initFirebase,
  saveScore,
  fetchTopScores,
};
