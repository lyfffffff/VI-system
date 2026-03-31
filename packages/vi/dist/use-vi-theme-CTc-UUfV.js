import { ref as S, computed as D, watch as F } from "vue";
const W = ["red", "orange", "amber", "yellow", "pink", "rose"], Y = "linear-gradient(180deg, #fcf3eb 0%, #faf6f0 48%, #f8f6f3 100%)", U = "linear-gradient(180deg, #e8f0fb 0%, #eef3fb 48%, #f2f6fb 100%)", J = "linear-gradient(180deg, #141618 0%, #111214 48%, #0f1012 100%)";
function X(e) {
  return e < 0 ? 0 : e > 255 ? 255 : Math.round(e);
}
function K(e) {
  const t = e.replace("#", ""), r = t.length === 3 ? t.split("").map((s) => `${s}${s}`).join("") : t, n = Number.parseInt(r.slice(0, 2), 16), c = Number.parseInt(r.slice(2, 4), 16), l = Number.parseInt(r.slice(4, 6), 16);
  return [n, c, l];
}
function f([e, t, r]) {
  const n = (c) => X(c).toString(16).padStart(2, "0");
  return `#${n(e)}${n(t)}${n(r)}`;
}
function h(e, t, r) {
  const n = (c, l) => c + (l - c) * r;
  return [n(e[0], t[0]), n(e[1], t[1]), n(e[2], t[2])];
}
function j(e) {
  const [t, r, n] = K(e);
  return `${t},${r},${n}`;
}
function q(e) {
  const t = K(e), r = [255, 255, 255], n = [0, 0, 0];
  return {
    light3: f(h(t, r, 0.3)),
    light5: f(h(t, r, 0.5)),
    light7: f(h(t, r, 0.7)),
    light8: f(h(t, r, 0.8)),
    light9: f(h(t, r, 0.9)),
    dark2: f(h(t, n, 0.2))
  };
}
function Q(e, t, r) {
  const n = t ? 0.06 : 0.12;
  if (t)
    return `radial-gradient(circle at top right, rgba(${e},${n}), transparent 32%), ${J}`;
  const c = W.includes(r) ? Y : U;
  return `radial-gradient(circle at top right, rgba(${e},${n}), transparent 32%), ${c}`;
}
function $(e = "vi") {
  return e.trim().replace(/^-+/, "").replace(/-+$/, "") || "vi";
}
function o(e, t) {
  return `--${$(e)}-${t}`;
}
const k = 17, Z = /^#[0-9a-f]{6}$/i, d = [
  { key: "red", name: "热烈红色", englishName: "Red", hex: "#ef4444" },
  { key: "orange", name: "活力橙色", englishName: "Orange", hex: "#f97316" },
  { key: "amber", name: "琥珀暖黄", englishName: "Amber", hex: "#f59e0b" },
  { key: "yellow", name: "明亮黄色", englishName: "Yellow", hex: "#eab308" },
  { key: "lime", name: "青柠绿色", englishName: "Lime", hex: "#84cc16" },
  { key: "green", name: "翠绿色", englishName: "Green", hex: "#22c55e" },
  { key: "emerald", name: "祖母绿", englishName: "Emerald", hex: "#10b981" },
  { key: "teal", name: "青绿色", englishName: "Teal", hex: "#14b8a6" },
  { key: "cyan", name: "青蓝色", englishName: "Cyan", hex: "#06b6d4" },
  { key: "sky", name: "天空蓝", englishName: "Sky", hex: "#0ea5e9" },
  { key: "blue", name: "经典蓝", englishName: "Blue", hex: "#3b82f6" },
  { key: "indigo", name: "靛青色", englishName: "Indigo", hex: "#6366f1" },
  { key: "violet", name: "紫罗兰", englishName: "Violet", hex: "#8b5cf6" },
  { key: "purple", name: "纯紫色", englishName: "Purple", hex: "#a855f7" },
  { key: "fuchsia", name: "品红紫", englishName: "Fuchsia", hex: "#d946ef" },
  { key: "pink", name: "粉红色", englishName: "Pink", hex: "#ec4899" },
  { key: "rose", name: "玫瑰红", englishName: "Rose", hex: "#f43f5e" }
];
function ee() {
  if (d.length !== k)
    throw new Error(`Theme preset count mismatch: expected ${k}, got ${d.length}`);
  const e = /* @__PURE__ */ new Set();
  for (const t of d) {
    if (e.has(t.key))
      throw new Error(`Duplicate theme key detected: ${t.key}`);
    if (!Z.test(t.hex))
      throw new Error(`Invalid theme hex color for key ${t.key}: ${t.hex}`);
    e.add(t.key);
  }
}
ee();
const b = "teal", te = "vi-theme-key", re = "vi-theme-dark", ae = d.map((e, t) => ({
  ...e,
  order: t + 1,
  rgb: j(e.hex)
})), m = ae.reduce((e, t) => (e[t.key] = t, e), {}), a = {
  prefix: "vi",
  themeStorageKey: te,
  darkStorageKey: re,
  initialized: !1,
  watcherBound: !1,
  themeKey: S(b),
  isDark: S(!1)
};
function y() {
  return typeof window != "undefined" && typeof document != "undefined";
}
function E(e, t) {
  if (!y()) return t;
  try {
    const r = window.localStorage.getItem(e);
    return r == null ? t : JSON.parse(r);
  } catch {
    return t;
  }
}
function p(e, t) {
  if (y())
    try {
      window.localStorage.setItem(e, JSON.stringify(t));
    } catch {
    }
}
function T() {
  p(a.themeStorageKey, a.themeKey.value), p(a.darkStorageKey, a.isDark.value);
}
function ne(e) {
  if (!e)
    return {
      prefixChanged: !1,
      storageKeyChanged: !1
    };
  let t = !1, r = !1;
  if (e.prefix) {
    const n = $(e.prefix);
    n !== a.prefix && (a.prefix = n, t = !0);
  }
  return e.themeStorageKey && e.themeStorageKey !== a.themeStorageKey && (a.themeStorageKey = e.themeStorageKey, r = !0), e.darkStorageKey && e.darkStorageKey !== a.darkStorageKey && (a.darkStorageKey = e.darkStorageKey, r = !0), {
    prefixChanged: t,
    storageKeyChanged: r
  };
}
function v() {
  const e = E(a.themeStorageKey, b), t = E(a.darkStorageKey, !1);
  a.themeKey.value = m[e] ? e : b, a.isDark.value = t;
}
function i(e, t) {
  y() && document.documentElement.style.setProperty(e, t);
}
function x(e, t, r) {
  const n = m[t], c = q(n.hex), l = r ? "#111214" : "#f4f7fc", s = r ? "#1d1e1f" : "#ffffff", g = r ? "#232425" : "#f8fafd", w = r ? "rgba(20, 28, 32, 0.96)" : "rgba(248, 250, 252, 0.96)", N = r ? "#e5eaf3" : "#23345f", _ = r ? "#b7c0d0" : "#52607a", P = r ? "#98a2b3" : "#7d8799", R = r ? "#7f8797" : "#a6adbb", M = r ? "#363637" : "#dfe5ef", H = r ? "#2f3134" : "#edf2f7", B = r ? "#4b4e53" : "#c7d0dd", C = r ? "#242629" : "#f3f6fb", A = r ? "#2f3237" : "#e9eff7", O = `rgba(${n.rgb}, 0.26)`, I = `rgba(${n.rgb}, ${r ? "0.22" : "0.14"})`, G = `rgba(${n.rgb}, ${r ? "0.14" : "0.06"})`, L = `rgba(${n.rgb}, ${r ? "0.2" : "0.1"})`, V = `rgba(${n.rgb}, ${r ? "0.32" : "0.16"})`, z = Q(n.rgb, r, t);
  i(o(e, "color-primary"), n.hex), i(o(e, "color-primary-rgb"), n.rgb), i(o(e, "color-primary-light-3"), c.light3), i(o(e, "color-primary-light-5"), c.light5), i(o(e, "color-primary-light-7"), c.light7), i(o(e, "color-primary-light-8"), c.light8), i(o(e, "color-primary-light-9"), c.light9), i(o(e, "color-primary-dark-2"), c.dark2), i(o(e, "page-bg"), z), i(o(e, "surface-body"), l), i(o(e, "surface-panel"), s), i(o(e, "surface-panel-muted"), g), i(o(e, "surface-overlay"), w), i(o(e, "text-primary"), N), i(o(e, "text-secondary"), _), i(o(e, "text-muted"), P), i(o(e, "text-disabled"), R), i(o(e, "border-default"), M), i(o(e, "border-light"), H), i(o(e, "border-strong"), B), i(o(e, "fill-soft"), C), i(o(e, "fill-muted"), A), i(o(e, "focus-ring"), O), i(o(e, "sidebar-item-active"), I), i(o(e, "sidebar-item-hover"), G), i(o(e, "tag-bg"), L), i(o(e, "tag-border"), V), i(o(e, "tag-text"), n.hex), i(o(e, "shadow-panel"), r ? "0 8px 24px rgba(0, 0, 0, 0.36)" : "0 6px 18px rgba(31, 42, 68, 0.04)"), i(o(e, "shadow-popover"), r ? "0 12px 32px rgba(0, 0, 0, 0.38)" : "0 12px 32px rgba(15, 23, 42, 0.14)");
}
function u() {
  if (!y()) return;
  const e = document.documentElement;
  if (x("vi", a.themeKey.value, a.isDark.value), a.prefix !== "vi" && x(a.prefix, a.themeKey.value, a.isDark.value), e.dataset.theme = a.themeKey.value, e.dataset.viPrefix = a.prefix, a.isDark.value) {
    e.classList.add("dark");
    return;
  }
  e.classList.remove("dark");
}
function oe() {
  a.watcherBound || (F([a.themeKey, a.isDark], () => {
    u(), T();
  }), a.watcherBound = !0);
}
function ce(e) {
  const t = ne(e);
  a.initialized ? t.storageKeyChanged ? (v(), u()) : t.prefixChanged && u() : (v(), u(), oe(), a.initialized = !0);
  const r = D(() => m[a.themeKey.value]);
  function n(g) {
    m[g] && (a.themeKey.value = g);
  }
  function c(g) {
    a.isDark.value = g;
  }
  function l() {
    a.isDark.value = !a.isDark.value;
  }
  function s() {
    u(), T();
  }
  return {
    themeKey: a.themeKey,
    isDark: a.isDark,
    currentTheme: r,
    setTheme: n,
    setDark: c,
    toggleDark: l,
    applyTheme: s
  };
}
export {
  b as D,
  ae as T,
  ce as u
};
//# sourceMappingURL=use-vi-theme-CTc-UUfV.js.map
