// Recharts needs concrete color values – they match the :root variables
export const COLORS = {
  border: "#262b34",
  textDim: "#868c98",
  textDim2: "#565c68",
  accent: "#e4002b",
  flag: "#c8ff3d",
  blue: "#4f9dff",
};

export const AXIS_PROPS = {
  stroke: COLORS.textDim2,
  tick: { fill: COLORS.textDim, fontSize: 12 },
  tickLine: false,
  axisLine: { stroke: COLORS.border },
} as const;

export const CHART_HEIGHT = 280;
export const CHART_MARGIN = { top: 8, right: 8, left: -12, bottom: 0 };
export const LEGEND_STYLE = { fontSize: 12, color: COLORS.textDim };
export const BAR_CURSOR = { fill: "rgba(255,255,255,0.04)" };

export const TOOLTIP_PROPS = {
  contentStyle: {
    background: "#1a1e26",
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    fontSize: 13,
  },
  labelStyle: { color: "#edeef0", fontWeight: 700 },
  itemStyle: { color: COLORS.textDim },
};
