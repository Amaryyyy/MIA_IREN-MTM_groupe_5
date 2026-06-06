export const AVATAR_OPTIONS = [
  { id: "duck", label: "Canard", url: "/assets/images/Fond_canard.png" },
  { id: "ghost", label: "Fantome", url: "/assets/images/fond_fantome.png" },
  { id: "pacman", label: "Pac-Man", url: "/assets/images/fond_pacman.png" },
  { id: "pizza", label: "Pizza", url: "/assets/images/fond_pizza.png" },
  { id: "planet", label: "Planete", url: "/assets/images/Fonds_planete.png" },
  { id: "rocket", label: "Fusee", url: "/assets/images/fond_fus%C3%A9e.png" },
  { id: "alien", label: "Martien", url: "/assets/images/fond_martien.png" },
  { id: "dog", label: "Chien", url: "/assets/images/dog.png" },
] as const;

export const DEFAULT_AVATAR_URL = AVATAR_OPTIONS[0].url;
