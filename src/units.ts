export const PX_PER_IN = 96;
export const PT_PER_IN = 72;
export const TWIP_PER_PT = 20;

export const pxToPt = (px?: number) =>
  typeof px === "number" ? (px * PT_PER_IN) / PX_PER_IN : undefined; // px * 0.75

export const ptToTwip = (pt?: number) =>
  typeof pt === "number" ? Math.round(pt * TWIP_PER_PT) : undefined;

export const pxToTwip = (px?: number) => ptToTwip(pxToPt(px));

// Optional: direct metric helpers if you ever need absolute sizes
export const cmToTwip = (cm: number) =>
  Math.round((cm / 2.54) * PT_PER_IN * TWIP_PER_PT);

export const mmToTwip = (mm: number) => cmToTwip(mm / 10);
