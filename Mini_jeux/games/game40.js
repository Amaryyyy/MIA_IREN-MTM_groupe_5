import { startGame40 } from "./game40.js";

// Wrapper to make game41 functional by reusing the working game40 implementation.
export function startGame41(container, onFinish) {
  return startGame40(container, onFinish);
}

export default { startGame41 };