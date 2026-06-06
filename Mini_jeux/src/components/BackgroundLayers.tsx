export default function BackgroundLayers() {
  return (
    <>
      <canvas id="galaxyCanvas" aria-hidden="true" />
      <div className="nebula-layer" aria-hidden="true" />
      <div className="stars-layer" aria-hidden="true" />
      <div className="twinkle-layer" aria-hidden="true" />
    </>
  );
}
