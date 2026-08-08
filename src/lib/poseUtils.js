// Small helpers for reading MoveNet keypoints. Keypoint names follow the
// COCO-17 layout used by @tensorflow-models/pose-detection's MoveNet model.

const MIN_SCORE = 0.35; // ignore keypoints the model isn't confident about

export function kp(keypoints, name) {
  const point = keypoints.find((k) => k.name === name);
  if (!point || (point.score ?? 0) < MIN_SCORE) return null;
  return point;
}

export function dist(a, b) {
  if (!a || !b) return Infinity;
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function midpoint(a, b) {
  if (!a || !b) return null;
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/**
 * Rough "shoulder width" in pixels for the current frame — used to scale
 * all thresholds so detection works regardless of how close the person is
 * standing to the camera.
 */
export function shoulderWidth(keypoints) {
  const ls = kp(keypoints, "left_shoulder");
  const rs = kp(keypoints, "right_shoulder");
  const d = dist(ls, rs);
  return Number.isFinite(d) && d > 0 ? d : 150;
}
