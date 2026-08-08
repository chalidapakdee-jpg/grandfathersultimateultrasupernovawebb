import { kp, shoulderWidth } from "./poseUtils";

/**
 * Each movement gets a Thai voice cue and a `check(keypoints)` function that
 * returns true when the elder is currently holding the target pose.
 * Thresholds are scaled by shoulder width so they work at any distance from
 * the camera, and are deliberately forgiving — this is a wellness game for
 * elderly users, not a strict fitness test.
 */
export const MOVEMENTS = [
  {
    id: "raise_both_arms",
    nameTh: "ยกแขนทั้งสองข้างขึ้นเหนือศีรษะ",
    instructionTh: "ยกแขนทั้งสองข้างขึ้นเหนือศีรษะช้า ๆ ค้างไว้",
    check(keypoints) {
      const sw = shoulderWidth(keypoints);
      const lw = kp(keypoints, "left_wrist");
      const rw = kp(keypoints, "right_wrist");
      const ls = kp(keypoints, "left_shoulder");
      const rs = kp(keypoints, "right_shoulder");
      if (!lw || !rw || !ls || !rs) return false;
      return lw.y < ls.y - sw * 0.25 && rw.y < rs.y - sw * 0.25;
    },
  },
  {
    id: "arms_out_side",
    nameTh: "กางแขนออกด้านข้างระดับไหล่",
    instructionTh: "กางแขนทั้งสองข้างออกด้านข้างให้เสมอไหล่ เหมือนตัวอักษรที",
    check(keypoints) {
      const sw = shoulderWidth(keypoints);
      const lw = kp(keypoints, "left_wrist");
      const rw = kp(keypoints, "right_wrist");
      const ls = kp(keypoints, "left_shoulder");
      const rs = kp(keypoints, "right_shoulder");
      if (!lw || !rw || !ls || !rs) return false;
      const heightOk = Math.abs(lw.y - ls.y) < sw * 0.5 && Math.abs(rw.y - rs.y) < sw * 0.5;
      const widthOk = lw.x < ls.x - sw * 0.6 && rw.x > rs.x + sw * 0.6;
      return heightOk && widthOk;
    },
  },
  {
    id: "raise_right_arm",
    nameTh: "ยกแขนขวาขึ้นสูง",
    instructionTh: "ยกแขนขวาขึ้นสูงเหนือศีรษะ",
    check(keypoints) {
      const sw = shoulderWidth(keypoints);
      const rw = kp(keypoints, "right_wrist");
      const rs = kp(keypoints, "right_shoulder");
      if (!rw || !rs) return false;
      return rw.y < rs.y - sw * 0.25;
    },
  },
  {
    id: "raise_left_arm",
    nameTh: "ยกแขนซ้ายขึ้นสูง",
    instructionTh: "ยกแขนซ้ายขึ้นสูงเหนือศีรษะ",
    check(keypoints) {
      const sw = shoulderWidth(keypoints);
      const lw = kp(keypoints, "left_wrist");
      const ls = kp(keypoints, "left_shoulder");
      if (!lw || !ls) return false;
      return lw.y < ls.y - sw * 0.25;
    },
  },
  {
    id: "clap_front",
    nameTh: "ปรบมือด้านหน้าลำตัว",
    instructionTh: "ยกมือทั้งสองข้างมาปรบกันด้านหน้าลำตัว",
    check(keypoints) {
      const sw = shoulderWidth(keypoints);
      const lw = kp(keypoints, "left_wrist");
      const rw = kp(keypoints, "right_wrist");
      const ls = kp(keypoints, "left_shoulder");
      if (!lw || !rw || !ls) return false;
      const close = Math.hypot(lw.x - rw.x, lw.y - rw.y) < sw * 0.55;
      const chestHeight = lw.y < ls.y + sw * 0.9 && rw.y < ls.y + sw * 0.9;
      return close && chestHeight;
    },
  },
  {
    id: "lift_left_knee",
    nameTh: "ยกเข่าซ้ายขึ้น",
    instructionTh: "ยกเข่าซ้ายขึ้นช้า ๆ เหมือนย่ำเท้าอยู่กับที่",
    check(keypoints) {
      const sw = shoulderWidth(keypoints);
      const lk = kp(keypoints, "left_knee");
      const lh = kp(keypoints, "left_hip");
      if (!lk || !lh) return false;
      return lk.y < lh.y - sw * 0.15;
    },
  },
  {
    id: "lift_right_knee",
    nameTh: "ยกเข่าขวาขึ้น",
    instructionTh: "ยกเข่าขวาขึ้นช้า ๆ เหมือนย่ำเท้าอยู่กับที่",
    check(keypoints) {
      const sw = shoulderWidth(keypoints);
      const rk = kp(keypoints, "right_knee");
      const rh = kp(keypoints, "right_hip");
      if (!rk || !rh) return false;
      return rk.y < rh.y - sw * 0.15;
    },
  },
  {
    id: "lean_side",
    nameTh: "เอียงลำตัวไปด้านข้างเบา ๆ",
    instructionTh: "ยืดตัวตรงแล้วเอียงลำตัวไปด้านข้างเบา ๆ ยืดกล้ามเนื้อลำตัว",
    check(keypoints) {
      const sw = shoulderWidth(keypoints);
      const ls = kp(keypoints, "left_shoulder");
      const rs = kp(keypoints, "right_shoulder");
      const lh = kp(keypoints, "left_hip");
      const rh = kp(keypoints, "right_hip");
      if (!ls || !rs || !lh || !rh) return false;
      const shoulderMidX = (ls.x + rs.x) / 2;
      const hipMidX = (lh.x + rh.x) / 2;
      return Math.abs(shoulderMidX - hipMidX) > sw * 0.35;
    },
  },
];

export function pickRoundOrder(count) {
  const order = [];
  for (let i = 0; i < count; i += 1) {
    order.push(MOVEMENTS[i % MOVEMENTS.length]);
  }
  return order;
}
