import { defineComponent as D, computed as h, resolveComponent as v, openBlock as c, createBlock as g, withCtx as _, createElementVNode as e, createVNode as r, unref as o, normalizeClass as f, createElementBlock as k, Fragment as M, renderList as $, normalizeStyle as F, createCommentVNode as O, toDisplayString as y } from "vue";
import { Moon as x, BrushFilled as H, Select as I } from "@element-plus/icons-vue";
import { T as L, u as P } from "./use-vi-theme-CTc-UUfV.js";
const R = { class: "theme-drawer" }, U = { class: "theme-drawer__section" }, j = { class: "theme-drawer__section-title" }, q = { class: "mode-switch" }, A = { class: "theme-drawer__section" }, G = { class: "theme-drawer__section-title" }, J = { class: "theme-grid" }, Q = ["onClick"], W = { class: "theme-grid__en" }, X = { class: "theme-grid__zh" }, Y = /* @__PURE__ */ D({
  __name: "theme-drawer",
  props: {
    open: { type: Boolean, default: !1 },
    placement: { default: "right" },
    themes: { default: () => L }
  },
  emits: ["update:open", "theme-change", "mode-change"],
  setup(d, { emit: m }) {
    const a = d, l = m, { themeKey: i, isDark: u, setTheme: C, setDark: b } = P(), E = h(() => a.open), S = h(() => a.placement === "left" ? "ltr" : "rtl"), T = h(() => a.themes);
    function V(s) {
      l("update:open", s);
    }
    function B() {
      l("update:open", !1);
    }
    function z(s) {
      i.value !== s && (C(s), l("theme-change", s));
    }
    function w(s) {
      u.value !== s && (b(s), l("mode-change", s));
    }
    return (s, t) => {
      const p = v("el-icon"), N = v("el-drawer");
      return c(), g(N, {
        "model-value": E.value,
        "with-header": !1,
        direction: S.value,
        size: 320,
        class: "vi-theme-drawer",
        "onUpdate:modelValue": V
      }, {
        default: _(() => [
          e("div", R, [
            e("div", { class: "theme-drawer__header" }, [
              t[2] || (t[2] = e("span", { class: "theme-drawer__title" }, "主题设置", -1)),
              e("button", {
                type: "button",
                class: "theme-drawer__close",
                onClick: B
              }, " ✕ ")
            ]),
            e("section", U, [
              e("div", j, [
                r(p, null, {
                  default: _(() => [
                    r(o(x))
                  ]),
                  _: 1
                }),
                t[3] || (t[3] = e("span", null, "模式设置", -1))
              ]),
              e("div", q, [
                e("button", {
                  type: "button",
                  class: f(["mode-switch__item", { "is-active": !o(u) }]),
                  onClick: t[0] || (t[0] = (n) => w(!1))
                }, [...t[4] || (t[4] = [
                  e("span", { class: "mode-switch__name" }, "浅色模式", -1),
                  e("span", { class: "mode-switch__desc" }, "明亮清爽", -1)
                ])], 2),
                e("button", {
                  type: "button",
                  class: f(["mode-switch__item", { "is-active": o(u) }]),
                  onClick: t[1] || (t[1] = (n) => w(!0))
                }, [...t[5] || (t[5] = [
                  e("span", { class: "mode-switch__name" }, "暗黑模式", -1),
                  e("span", { class: "mode-switch__desc" }, "护眼舒适", -1)
                ])], 2)
              ])
            ]),
            e("section", A, [
              e("div", G, [
                r(p, null, {
                  default: _(() => [
                    r(o(H))
                  ]),
                  _: 1
                }),
                t[6] || (t[6] = e("span", null, "主题颜色", -1))
              ]),
              e("div", J, [
                (c(!0), k(M, null, $(T.value, (n) => (c(), k("button", {
                  key: n.key,
                  type: "button",
                  class: "theme-grid__item",
                  onClick: (K) => z(n.key)
                }, [
                  e("span", {
                    class: f(["theme-grid__swatch", { "is-active": o(i) === n.key }]),
                    style: F({ backgroundColor: n.hex })
                  }, [
                    o(i) === n.key ? (c(), g(p, { key: 0 }, {
                      default: _(() => [
                        r(o(I))
                      ]),
                      _: 1
                    })) : O("", !0)
                  ], 6),
                  e("span", W, y(n.englishName), 1),
                  e("span", X, y(n.name), 1)
                ], 8, Q))), 128))
              ])
            ])
          ])
        ]),
        _: 1
      }, 8, ["model-value", "direction"]);
    };
  }
}), Z = (d, m) => {
  const a = d.__vccOpts || d;
  for (const [l, i] of m)
    a[l] = i;
  return a;
}, ne = /* @__PURE__ */ Z(Y, [["__scopeId", "data-v-39f2f502"]]);
export {
  ne as T
};
//# sourceMappingURL=theme-drawer-CbyzU7mq.js.map
