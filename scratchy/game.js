(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

  // web/src/engine/math.js
  var clamp = /* @__PURE__ */ __name((v, a, b) => v < a ? a : v > b ? b : v, "clamp");
  var clamp01 = /* @__PURE__ */ __name((v) => clamp(v, 0, 1), "clamp01");
  var lerp = /* @__PURE__ */ __name((a, b, t) => a + (b - a) * t, "lerp");
  var DEG2RAD = Math.PI / 180;
  var RAD2DEG = 180 / Math.PI;
  var Vec3 = class _Vec3 {
    static {
      __name(this, "Vec3");
    }
    constructor(x = 0, y = 0, z = 0) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
    static from(o) {
      return o ? new _Vec3(o.x || 0, o.y || 0, o.z || 0) : new _Vec3();
    }
    clone() {
      return new _Vec3(this.x, this.y, this.z);
    }
    set(x, y, z = this.z) {
      this.x = x;
      this.y = y;
      this.z = z;
      return this;
    }
    copy(v) {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z ?? this.z;
      return this;
    }
    add(v) {
      return new _Vec3(this.x + v.x, this.y + v.y, this.z + (v.z || 0));
    }
    sub(v) {
      return new _Vec3(this.x - v.x, this.y - v.y, this.z - (v.z || 0));
    }
    mul(s2) {
      return new _Vec3(this.x * s2, this.y * s2, this.z * s2);
    }
    get magnitude() {
      return Math.hypot(this.x, this.y, this.z);
    }
    get normalized() {
      const m = this.magnitude;
      return m > 1e-6 ? this.mul(1 / m) : new _Vec3();
    }
    static lerp(a, b, t) {
      t = clamp01(t);
      return new _Vec3(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z || 0, b.z || 0, t));
    }
    static distance(a, b) {
      return Math.hypot(a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0));
    }
    static get zero() {
      return new _Vec3();
    }
    static get one() {
      return new _Vec3(1, 1, 1);
    }
  };
  var Color = class _Color {
    static {
      __name(this, "Color");
    }
    constructor(r = 1, g = 1, b = 1, a = 1) {
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a;
    }
    static from(o) {
      return o ? new _Color(o.r ?? 1, o.g ?? 1, o.b ?? 1, o.a ?? 1) : new _Color();
    }
    clone() {
      return new _Color(this.r, this.g, this.b, this.a);
    }
    mul(c) {
      return new _Color(this.r * c.r, this.g * c.g, this.b * c.b, this.a * c.a);
    }
    withAlpha(a) {
      return new _Color(this.r, this.g, this.b, a);
    }
    static lerp(a, b, t) {
      t = clamp01(t);
      return new _Color(lerp(a.r, b.r, t), lerp(a.g, b.g, t), lerp(a.b, b.b, t), lerp(a.a, b.a, t));
    }
    isWhiteRGB() {
      return this.r >= 0.999 && this.g >= 0.999 && this.b >= 0.999;
    }
    rgbKey() {
      return `${Math.round(this.r * 255)},${Math.round(this.g * 255)},${Math.round(this.b * 255)}`;
    }
    css(alphaMul = 1) {
      return `rgba(${Math.round(clamp01(this.r) * 255)},${Math.round(clamp01(this.g) * 255)},${Math.round(clamp01(this.b) * 255)},${clamp01(this.a * alphaMul)})`;
    }
    static hex(h) {
      h = h.replace("#", "");
      if (h.length === 3) h = h.split("").map((c) => c + c).join("");
      const n = parseInt(h.slice(0, 6), 16);
      const a = h.length >= 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
      return new _Color((n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255, a);
    }
    static get white() {
      return new _Color(1, 1, 1, 1);
    }
    static get clear() {
      return new _Color(0, 0, 0, 0);
    }
  };
  var Quat = class _Quat {
    static {
      __name(this, "Quat");
    }
    constructor(x = 0, y = 0, z = 0, w = 1) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
    }
    static from(o) {
      return o ? new _Quat(o.x || 0, o.y || 0, o.z || 0, o.w ?? 1) : new _Quat();
    }
    static euler(x, y, z) {
      const cx = Math.cos(x * DEG2RAD / 2), sx = Math.sin(x * DEG2RAD / 2);
      const cy = Math.cos(y * DEG2RAD / 2), sy = Math.sin(y * DEG2RAD / 2);
      const cz = Math.cos(z * DEG2RAD / 2), sz = Math.sin(z * DEG2RAD / 2);
      return new _Quat(
        sx * cy * cz + cx * sy * sz,
        cx * sy * cz - sx * cy * sz,
        cx * cy * sz - sx * sy * cz,
        cx * cy * cz + sx * sy * sz
      );
    }
    get eulerZ() {
      return Math.atan2(2 * (this.w * this.z + this.x * this.y), 1 - 2 * (this.y * this.y + this.z * this.z)) * RAD2DEG;
    }
    // 3x3 rotation matrix rows
    matrix() {
      const { x, y, z, w } = this;
      return [
        1 - 2 * (y * y + z * z),
        2 * (x * y - z * w),
        2 * (x * z + y * w),
        2 * (x * y + z * w),
        1 - 2 * (x * x + z * z),
        2 * (y * z - x * w),
        2 * (x * z - y * w),
        2 * (y * z + x * w),
        1 - 2 * (x * x + y * y)
      ];
    }
  };
  var Mat2D = class _Mat2D {
    static {
      __name(this, "Mat2D");
    }
    constructor(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) {
      this.a = a;
      this.b = b;
      this.c = c;
      this.d = d;
      this.e = e;
      this.f = f;
    }
    mul(m) {
      return new _Mat2D(
        this.a * m.a + this.c * m.b,
        this.b * m.a + this.d * m.b,
        this.a * m.c + this.c * m.d,
        this.b * m.c + this.d * m.d,
        this.a * m.e + this.c * m.f + this.e,
        this.b * m.e + this.d * m.f + this.f
      );
    }
    apply(x, y) {
      return { x: this.a * x + this.c * y + this.e, y: this.b * x + this.d * y + this.f };
    }
    invert() {
      const det = this.a * this.d - this.b * this.c || 1e-12;
      return new _Mat2D(
        this.d / det,
        -this.b / det,
        -this.c / det,
        this.a / det,
        (this.c * this.f - this.d * this.e) / det,
        (this.b * this.e - this.a * this.f) / det
      );
    }
    get scaleX() {
      return Math.hypot(this.a, this.b);
    }
    get scaleY() {
      return Math.hypot(this.c, this.d);
    }
  };
  var Random = {
    get value() {
      return Math.random();
    },
    range(min, max) {
      return min + Math.random() * (max - min);
    },
    rangeInt(min, max) {
      return max <= min ? min : min + Math.floor(Math.random() * (max - min));
    },
    insideUnitCircle() {
      const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random());
      return { x: Math.cos(a) * r, y: Math.sin(a) * r };
    }
  };

  // web/src/engine/node.js
  var Registry = /* @__PURE__ */ new Map();
  function register(cls, name = cls.name) {
    Registry.set(name, cls);
    cls.typeName = name;
    return cls;
  }
  __name(register, "register");
  var _nextId = 1;
  var Time = { time: 0, deltaTime: 0, unscaledDeltaTime: 0, unscaledTime: 0, timeScale: 1, frameCount: 0, realtimeSinceStartup: 0 };
  var Component = class {
    static {
      __name(this, "Component");
    }
    constructor(go) {
      this.gameObject = go;
      this.enabled = true;
      this._awoken = false;
      this._started = false;
      this._enabledCalled = false;
      this._destroyed = false;
      this.id = _nextId++;
      this._coroutines = /* @__PURE__ */ new Set();
    }
    get transform() {
      return this.gameObject.transform;
    }
    get name() {
      return this.gameObject.name;
    }
    get activeAndEnabled() {
      return this.enabled && this.gameObject.activeInHierarchy && !this._destroyed;
    }
    get isActiveAndEnabled() {
      return this.activeAndEnabled;
    }
    getComponent(t) {
      return this.gameObject.getComponent(t);
    }
    getComponents(t) {
      return this.gameObject.getComponents(t);
    }
    getComponentInChildren(t, inc = false) {
      return this.gameObject.getComponentInChildren(t, inc);
    }
    getComponentsInChildren(t, inc = false) {
      return this.gameObject.getComponentsInChildren(t, inc);
    }
    getComponentInParent(t, inc = false) {
      return this.gameObject.getComponentInParent(t, inc);
    }
    // Behaviour.enabled: toggling at runtime runs OnEnable/OnDisable (and schedules Start the first time)
    get enabled() {
      return this._enabled !== false;
    }
    set enabled(v) {
      v = !!v;
      const was = this._enabled !== false;
      this._enabled = v;
      if (v === was || !this._awoken && !this._enabledCalled || !this.gameObject?.activeInHierarchy) return;
      if (v) this._doEnable();
      else this._doDisable();
    }
    setEnabled(v) {
      this.enabled = v;
    }
    _doAwake() {
      if (this._awoken || this._destroyed) return;
      this._awoken = true;
      this.awake?.();
    }
    _doEnable() {
      if (this._enabledCalled || !this.enabled || this._destroyed) return;
      this._doAwake();
      this._enabledCalled = true;
      this.onEnable?.();
      this.gameObject.scene?.engine?._schedule(this);
    }
    _doDisable() {
      if (!this._enabledCalled) return;
      this._enabledCalled = false;
      this.stopAllCoroutines();
      this.onDisable?.();
    }
    // ---- coroutines (generator functions) ----
    startCoroutine(gen) {
      if (typeof gen === "function") gen = gen.call(this);
      const co = { gen, wait: null, owner: this, done: false, stack: [] };
      this._coroutines.add(co);
      Coroutines.add(co);
      Coroutines.step(co, true);
      return co;
    }
    stopCoroutine(co) {
      if (co) {
        co.done = true;
        this._coroutines.delete(co);
        Coroutines.list.delete(co);
      }
    }
    stopAllCoroutines() {
      for (const co of this._coroutines) {
        co.done = true;
        Coroutines.list.delete(co);
      }
      this._coroutines.clear();
    }
    invoke(fn, delay) {
      return this.startCoroutine(function* () {
        yield new WaitForSeconds(delay);
        fn.call(this);
      });
    }
    toString() {
      return `${this.constructor.typeName || this.constructor.name}(${this.gameObject.name})`;
    }
  };
  var WaitForSeconds = class {
    static {
      __name(this, "WaitForSeconds");
    }
    constructor(s2) {
      this.t = s2;
      this.realtime = false;
    }
  };
  var WaitForSecondsRealtime = class {
    static {
      __name(this, "WaitForSecondsRealtime");
    }
    constructor(s2) {
      this.t = s2;
      this.realtime = true;
    }
  };
  var WaitUntil = class {
    static {
      __name(this, "WaitUntil");
    }
    constructor(fn) {
      this.fn = fn;
    }
  };
  var WaitWhile = class {
    static {
      __name(this, "WaitWhile");
    }
    constructor(fn) {
      this.fn = fn;
    }
  };
  var Coroutines = {
    list: /* @__PURE__ */ new Set(),
    add(co) {
      this.list.add(co);
    },
    step(co, first = false) {
      if (co.done) return;
      for (let guard = 0; guard < 1e4; guard++) {
        const top = co.stack.length ? co.stack[co.stack.length - 1] : co.gen;
        let r;
        try {
          r = top.next();
        } catch (e) {
          console.error("coroutine error in", co.owner?.toString(), e);
          co.done = true;
          break;
        }
        if (r.done) {
          if (co.stack.length) {
            co.stack.pop();
            continue;
          }
          co.done = true;
          break;
        }
        const v = r.value;
        if (v && typeof v.next === "function" && typeof v.throw === "function") {
          co.stack.push(v);
          continue;
        }
        if (v instanceof WaitForSeconds || v instanceof WaitForSecondsRealtime) {
          co.wait = { until: (v.realtime ? Time.unscaledTime : Time.time) + v.t, realtime: v.realtime };
        } else if (v instanceof WaitUntil) co.wait = { fn: v.fn };
        else if (v instanceof WaitWhile) co.wait = { fn: /* @__PURE__ */ __name(() => !v.fn(), "fn") };
        else if (v && v.gen && "done" in v) co.wait = { fn: /* @__PURE__ */ __name(() => v.done, "fn") };
        else if (v instanceof Promise) {
          co.wait = { promise: true };
          v.then(() => {
            co.wait = null;
          }, () => {
            co.wait = null;
          });
        } else co.wait = { frame: Time.frameCount };
        break;
      }
      if (co.done) {
        this.list.delete(co);
        co.owner?._coroutines.delete(co);
      }
    },
    tick() {
      for (const co of [...this.list]) {
        if (co.done) {
          this.list.delete(co);
          continue;
        }
        const o = co.owner;
        if (o && (o._destroyed || !o.gameObject.activeInHierarchy)) {
          o.stopCoroutine(co);
          continue;
        }
        const w = co.wait;
        if (w) {
          if (w.promise) continue;
          if (w.until !== void 0 && (w.realtime ? Time.unscaledTime : Time.time) < w.until) continue;
          if (w.fn && !w.fn()) continue;
          if (w.frame !== void 0 && w.frame === Time.frameCount) continue;
        }
        co.wait = null;
        this.step(co);
      }
    }
  };
  var Transform = class _Transform extends Component {
    static {
      __name(this, "Transform");
    }
    constructor(go) {
      super(go);
      this.parent = null;
      this.children = [];
      this.localPosition = new Vec3();
      this.localRotation = new Quat();
      this.localScale = new Vec3(1, 1, 1);
    }
    get isRect() {
      return false;
    }
    get childCount() {
      return this.children.length;
    }
    getChild(i) {
      return this.children[i];
    }
    getSiblingIndex() {
      return this.parent ? this.parent.children.indexOf(this) : this.gameObject.scene?.roots.indexOf(this.gameObject) ?? 0;
    }
    setSiblingIndex(i) {
      if (!this.parent) return;
      const arr = this.parent.children;
      const cur2 = arr.indexOf(this);
      if (cur2 < 0) return;
      arr.splice(cur2, 1);
      i = Math.max(0, Math.min(arr.length, i));
      arr.splice(i, 0, this);
      this.parent._layoutDirty = true;
    }
    setAsLastSibling() {
      this.setSiblingIndex(1e9);
    }
    setAsFirstSibling() {
      this.setSiblingIndex(0);
    }
    setParent(p, worldPositionStays = true) {
      if (p && !(p instanceof _Transform)) p = p.transform;
      const wasActive = this.gameObject.activeInHierarchy;
      let wm = worldPositionStays ? this.worldMatrix : null;
      const wz = worldPositionStays ? this.position.z : 0;
      if (this.parent) {
        const i = this.parent.children.indexOf(this);
        if (i >= 0) this.parent.children.splice(i, 1);
        this.parent._layoutDirty = true;
      } else this.gameObject.scene?._removeRoot(this.gameObject);
      this.parent = p || null;
      if (p) {
        p.children.push(this);
        p._layoutDirty = true;
        this.gameObject.scene = p.gameObject.scene;
      } else this.gameObject.scene?._addRoot(this.gameObject);
      if (worldPositionStays && wm) this._setWorldFromMatrix(wm, wz);
      const nowActive = this.gameObject.activeInHierarchy;
      if (wasActive !== nowActive) this.gameObject._propagateActive(nowActive);
    }
    get root() {
      let t = this;
      while (t.parent) t = t.parent;
      return t;
    }
    find(path) {
      let t = this;
      for (const part of path.split("/")) {
        t = t.children.find((c) => c.gameObject.name === part);
        if (!t) return null;
      }
      return t;
    }
    isChildOf(p) {
      for (let t = this; t; t = t.parent) if (t === p) return true;
      return false;
    }
    // local 2D matrix (projection of TRS onto XY)
    get localMatrix() {
      const r = this.localRotation.matrix();
      const s2 = this.localScale;
      const p = this.localPosition;
      return new Mat2D(r[0] * s2.x, r[3] * s2.x, r[1] * s2.y, r[4] * s2.y, p.x, p.y);
    }
    get worldMatrix() {
      return this.parent ? this.parent.worldMatrix.mul(this.localMatrix) : this.localMatrix;
    }
    get position() {
      const m = this.worldMatrix;
      let z = this.localPosition.z;
      for (let t = this.parent; t; t = t.parent) z = z * t.localScale.z + t.localPosition.z;
      return new Vec3(m.e, m.f, z);
    }
    set position(v) {
      if (!this.parent) {
        this.localPosition = new Vec3(v.x, v.y, v.z ?? this.localPosition.z);
        return;
      }
      const inv = this.parent.worldMatrix.invert();
      const p = inv.apply(v.x, v.y);
      let pz = 0;
      for (let t = this.parent; t; t = t.parent) pz = pz * t.localScale.z + t.localPosition.z;
      this.localPosition = new Vec3(p.x, p.y, v.z !== void 0 ? v.z - pz : this.localPosition.z);
    }
    get lossyScale() {
      const m = this.worldMatrix;
      return new Vec3(m.scaleX, m.scaleY, 1);
    }
    get eulerZ() {
      let z = this.localRotation.eulerZ;
      for (let t = this.parent; t; t = t.parent) z += t.localRotation.eulerZ;
      return z;
    }
    set localEulerZ(z) {
      this.localRotation = Quat.euler(0, 0, z);
    }
    get localEulerZ() {
      return this.localRotation.eulerZ;
    }
    set rotationZ(z) {
      const pz = this.parent ? this.parent.eulerZ : 0;
      this.localRotation = Quat.euler(0, 0, z - pz);
    }
    _setWorldFromMatrix(wm, wz) {
      const pm = this.parent ? this.parent.worldMatrix : new Mat2D();
      const l = pm.invert().mul(wm);
      this.localPosition = new Vec3(l.e, l.f, this.localPosition.z);
      const sx = Math.hypot(l.a, l.b), sy = Math.sign(l.a * l.d - l.b * l.c) * Math.hypot(l.c, l.d);
      this.localScale = new Vec3(sx, sy, this.localScale.z);
      this.localRotation = Quat.euler(0, 0, Math.atan2(l.b, l.a) * 180 / Math.PI);
      if (wz !== void 0) {
        const p = this.position;
        this.position = new Vec3(p.x, p.y, wz);
      }
    }
    translate(dx, dy) {
      this.localPosition = this.localPosition.add({ x: dx, y: dy, z: 0 });
    }
    // world point -> local
    inverseTransformPoint(x, y) {
      return this.worldMatrix.invert().apply(x, y);
    }
    transformPoint(x, y) {
      return this.worldMatrix.apply(x, y);
    }
  };
  register(Transform, "Transform");
  var RectTransform = class extends Transform {
    static {
      __name(this, "RectTransform");
    }
    constructor(go) {
      super(go);
      this.anchorMin = { x: 0.5, y: 0.5 };
      this.anchorMax = { x: 0.5, y: 0.5 };
      this.anchoredPosition = { x: 0, y: 0 };
      this.sizeDelta = { x: 100, y: 100 };
      this.pivot = { x: 0.5, y: 0.5 };
      this._drivenSize = null;
    }
    get isRect() {
      return true;
    }
    get parentRectSize() {
      const p = this.parent;
      if (p && p.isRect) return p.rectSize;
      return { x: 0, y: 0 };
    }
    get rectSize() {
      const ps = this.parentRectSize;
      return { x: (this.anchorMax.x - this.anchorMin.x) * ps.x + this.sizeDelta.x, y: (this.anchorMax.y - this.anchorMin.y) * ps.y + this.sizeDelta.y };
    }
    // rect in local space (like RectTransform.rect)
    get rect() {
      const s2 = this.rectSize;
      return { x: -this.pivot.x * s2.x, y: -this.pivot.y * s2.y, width: s2.x, height: s2.y };
    }
    // recompute localPosition.xy from anchors (Unity does this continuously)
    updateFromAnchors() {
      const p = this.parent;
      if (!p || !p.isRect) return;
      const pr = p.rect;
      const amin = { x: pr.x + this.anchorMin.x * pr.width, y: pr.y + this.anchorMin.y * pr.height };
      const amax = { x: pr.x + this.anchorMax.x * pr.width, y: pr.y + this.anchorMax.y * pr.height };
      this.localPosition.x = amin.x + (amax.x - amin.x) * this.pivot.x + this.anchoredPosition.x;
      this.localPosition.y = amin.y + (amax.y - amin.y) * this.pivot.y + this.anchoredPosition.y;
    }
    // writing position/localPosition moves the anchoredPosition (localPosition is derived from it)
    get position() {
      return super.position;
    }
    set position(v) {
      super.position = v;
      const p = this.parent;
      if (!p || !p.isRect) return;
      const pr = p.rect;
      const lp = this.localPosition;
      const ax = pr.x + (this.anchorMin.x + (this.anchorMax.x - this.anchorMin.x) * this.pivot.x) * pr.width;
      const ay = pr.y + (this.anchorMin.y + (this.anchorMax.y - this.anchorMin.y) * this.pivot.y) * pr.height;
      this.anchoredPosition = { x: lp.x - ax, y: lp.y - ay };
    }
    setSizeWithCurrentAnchors(axis, size) {
      const ps = this.parentRectSize;
      if (axis === 0) this.sizeDelta = { x: size - (this.anchorMax.x - this.anchorMin.x) * ps.x, y: this.sizeDelta.y };
      else this.sizeDelta = { x: this.sizeDelta.x, y: size - (this.anchorMax.y - this.anchorMin.y) * ps.y };
    }
    setInsetAndSizeFromParentEdge(edge, inset, size) {
      const axis = edge === 2 || edge === 3 ? 1 : 0;
      const end = edge === 2 || edge === 1;
      const a = end ? 1 : 0;
      const amin = { ...this.anchorMin }, amax = { ...this.anchorMax }, sd = { ...this.sizeDelta }, ap = { ...this.anchoredPosition };
      const k = axis ? "y" : "x";
      amin[k] = a;
      amax[k] = a;
      sd[k] = size;
      ap[k] = end ? -inset - size * (1 - this.pivot[k]) : inset + size * this.pivot[k];
      this.anchorMin = amin;
      this.anchorMax = amax;
      this.sizeDelta = sd;
      this.anchoredPosition = ap;
    }
    // world corners (bl, tl, tr, br) like GetWorldCorners
    getWorldCorners() {
      const r = this.rect;
      const m = this.worldMatrix;
      return [m.apply(r.x, r.y), m.apply(r.x, r.y + r.height), m.apply(r.x + r.width, r.y + r.height), m.apply(r.x + r.width, r.y)];
    }
    containsWorldPoint(x, y, pad = null) {
      const l = this.inverseTransformPoint(x, y);
      const r = this.rect;
      const p = pad || { x: 0, y: 0, z: 0, w: 0 };
      return l.x >= r.x + p.x && l.x <= r.x + r.width - p.z && l.y >= r.y + p.y && l.y <= r.y + r.height - p.w;
    }
  };
  register(RectTransform, "RectTransform");
  var GameObject = class _GameObject {
    static {
      __name(this, "GameObject");
    }
    constructor(name = "GameObject", rect = false, scene = null) {
      this.name = name;
      this.id = _nextId++;
      this.activeSelf = true;
      this.layer = 0;
      this.tag = "Untagged";
      this.components = [];
      this.scene = scene;
      this._destroyed = false;
      this.srcId = null;
      this.transform = rect ? new RectTransform(this) : new Transform(this);
      this.components.push(this.transform);
    }
    get activeInHierarchy() {
      for (let t = this.transform; t; t = t.parent) if (!t.gameObject.activeSelf) return false;
      return !this._destroyed && !!this.scene;
    }
    setActive(v) {
      v = !!v;
      if (v === this.activeSelf) return;
      const before = this.activeInHierarchy;
      this.activeSelf = v;
      const after = this.activeInHierarchy;
      if (this.transform.parent) this.transform.parent._layoutDirty = true;
      if (before !== after) this._propagateActive(after);
    }
    _propagateActive(active) {
      if (active) {
        const list = [];
        const walk = /* @__PURE__ */ __name((go) => {
          if (!go.activeSelf) return;
          list.push(go);
          for (const c of go.transform.children) walk(c.gameObject);
        }, "walk");
        walk(this);
        for (const go of list) for (const c of [...go.components]) c._doAwake();
        for (const go of list) for (const c of [...go.components]) if (!c._destroyed) {
          c._doAwake();
          if (c.enabled) c._doEnable();
        }
      } else {
        const walk = /* @__PURE__ */ __name((go) => {
          if (!go.activeSelf) return;
          for (const c of [...go.components]) c._doDisable();
          for (const ch of go.transform.children) walk(ch.gameObject);
        }, "walk");
        walk(this);
      }
    }
    addComponent(cls, fields) {
      if (typeof cls === "string") cls = Registry.get(cls);
      const c = new cls(this);
      if (fields) Object.assign(c, fields);
      this.components.push(c);
      if (this.activeInHierarchy && c.enabled) {
        c._doAwake();
        c._doEnable();
      }
      return c;
    }
    static _match(c, t) {
      if (typeof t === "string") {
        for (let k = c.constructor; k && k !== Object; k = Object.getPrototypeOf(k)) if (k.typeName === t || k.name === t) return true;
        return c.constructor.typeName === t || c._typeName === t;
      }
      return c instanceof t;
    }
    getComponent(t) {
      for (const c of this.components) if (!c._destroyed && _GameObject._match(c, t)) return c;
      return null;
    }
    getComponents(t) {
      return this.components.filter((c) => !c._destroyed && _GameObject._match(c, t));
    }
    tryGetComponent(t) {
      return this.getComponent(t);
    }
    getComponentInChildren(t, includeInactive = false) {
      if (includeInactive || this.activeInHierarchy) {
        const c = this.getComponent(t);
        if (c) return c;
      }
      for (const ch of this.transform.children) {
        if (!includeInactive && !ch.gameObject.activeSelf) continue;
        const c = ch.gameObject.getComponentInChildren(t, includeInactive);
        if (c) return c;
      }
      return null;
    }
    getComponentsInChildren(t, includeInactive = false, out = []) {
      if (!includeInactive && !this.activeSelf) return out;
      out.push(...this.getComponents(t));
      for (const ch of this.transform.children) ch.gameObject.getComponentsInChildren(t, includeInactive, out);
      return out;
    }
    getComponentInParent(t, includeInactive = false) {
      for (let tr = this.transform; tr; tr = tr.parent) {
        if (!includeInactive && !tr.gameObject.activeInHierarchy) continue;
        const c = tr.gameObject.getComponent(t);
        if (c) return c;
      }
      return null;
    }
    compareTag(t) {
      return this.tag === t;
    }
    toString() {
      return `GameObject(${this.name})`;
    }
  };
  var alive = /* @__PURE__ */ __name((o) => !!o && !o._destroyed && !(o.gameObject && o.gameObject._destroyed), "alive");

  // web/src/engine/assets.js
  var BASE = "gamedata/";
  var Sprite = class {
    static {
      __name(this, "Sprite");
    }
    constructor(key, m) {
      Object.assign(this, m);
      this.key = key;
      this.img = null;
      this.rect = { width: m.rw, height: m.rh };
      this.bounds = { x: -m.px * m.rw / m.ppu, y: -m.py * m.rh / m.ppu, w: m.rw / m.ppu, h: m.rh / m.ppu };
    }
    get texture() {
      return this;
    }
    get pixelsPerUnit() {
      return this.ppu;
    }
  };
  var Assets = {
    sprites: /* @__PURE__ */ new Map(),
    spriteByName: /* @__PURE__ */ new Map(),
    spritesByTex: /* @__PURE__ */ new Map(),
    audioMeta: /* @__PURE__ */ new Map(),
    audioByName: /* @__PURE__ */ new Map(),
    audioBuffers: /* @__PURE__ */ new Map(),
    clips: {},
    controllers: {},
    fonts: {},
    fontByKey: {},
    data: {},
    loc: {},
    resources: {},
    scenes: {},
    nodeIndex: /* @__PURE__ */ new Map(),
    async json(p) {
      const r = await fetch(BASE + p);
      if (!r.ok) throw new Error(`load ${p}: ${r.status}`);
      return r.json();
    },
    async init(progress = () => {
    }) {
      const [sprites, audio, anims, fontIndex, resources] = await Promise.all([
        this.json("sprites.json"),
        this.json("audio.json"),
        this.json("anims.json"),
        this.json("fonts/index.json"),
        this.json("resources.json")
      ]);
      this.resources = resources;
      this.clips = anims.clips;
      this.controllers = anims.controllers;
      this.textures = /* @__PURE__ */ new Map();
      try {
        for (const [k, m] of Object.entries(await this.json("textures.json"))) this.textures.set(k, { key: k, ...m, img: null });
      } catch {
      }
      await Promise.all([...this.textures.values()].map(async (t) => {
        t.img = await loadImage(`${BASE}textures/${t.file}`);
      }));
      for (const [k, m] of Object.entries(sprites)) {
        const s2 = new Sprite(k, m);
        this.sprites.set(k, s2);
        if (!this.spriteByName.has(m.name)) this.spriteByName.set(m.name, s2);
        if (m.tex) {
          if (!this.spritesByTex.has(m.tex)) this.spritesByTex.set(m.tex, []);
          this.spritesByTex.get(m.tex).push(s2);
        }
      }
      for (const [k, m] of Object.entries(audio)) {
        this.audioMeta.set(k, m);
        if (!this.audioByName.has(m.name)) this.audioByName.set(m.name, k);
      }
      for (const name of [
        "TicketData",
        "SymbolData",
        "UpgradeData",
        "PerkData",
        "DialogueData",
        "ProgressionGoalData",
        "ChallengeData",
        "AchievementData",
        "LoanData",
        "CosmeticsData",
        "MachineTiersData"
      ]) {
        try {
          this.data[name] = await this.json(`data/${name}.json`);
        } catch {
          this.data[name] = {};
        }
      }
      const fonts = {};
      for (const [key, fn] of Object.entries(fontIndex)) {
        if (!fonts[fn]) {
          fonts[fn] = await this.json(`fonts/${fn}.json`);
          fonts[fn].img = await loadImage(`${BASE}fonts/${fonts[fn].atlas}`);
          fonts[fn].file = fn;
        }
        this.fontByKey[key] = fonts[fn];
      }
      this.fonts = fonts;
      let done = 0;
      const all = [...this.sprites.values()];
      let next = 0;
      const worker = /* @__PURE__ */ __name(async () => {
        while (next < all.length) {
          const s2 = all[next++];
          s2.img = await loadImage(`${BASE}sprites/${s2.file}`);
          progress(++done / all.length * 0.8);
        }
      }, "worker");
      await Promise.all(Array.from({ length: 12 }, worker));
      for (const f of ["resources.assets", "sharedassets0.assets", "sharedassets1.assets", "sharedassets2.assets", "level2", "level0", "level1"]) {
        this.scenes[f] = await this.json(`scenes/${f}.json`);
        this._index(this.scenes[f].roots);
        progress(0.8 + 0.2 * Object.keys(this.scenes).length / 7);
      }
    },
    cidIndex: /* @__PURE__ */ new Map(),
    rootOf: /* @__PURE__ */ new Map(),
    _index(nodes, root = null) {
      for (const n of nodes) {
        const r = root || n;
        this.nodeIndex.set(n.id, n);
        this.rootOf.set(n.id, r);
        for (const c of n.components || []) if (c.cid) this.cidIndex.set(c.cid, { node: n, root: r, comp: c });
        if (n.children) this._index(n.children, r);
      }
    },
    async loadLocale(code) {
      if (!this.loc[code]) {
        try {
          this.loc[code] = (await this.json(`loc/${code}.json`)).UI || {};
        } catch {
          this.loc[code] = {};
        }
      }
      return this.loc[code];
    },
    sprite(key) {
      return key ? this.sprites.get(key) || null : null;
    },
    // Resources.Load / LoadAll by path (case-insensitive, no extension)
    resourceEntries(path) {
      return this.resources[path.toLowerCase()] || [];
    },
    resourcesUnder(dir) {
      dir = dir.toLowerCase().replace(/\/$/, "");
      return Object.entries(this.resources).filter(([p]) => p === dir || p.startsWith(dir + "/")).flatMap(([p, es]) => es.map((e) => ({ path: p, ...e })));
    },
    loadAllSprites(dir) {
      const out = [];
      for (const e of this.resourcesUnder(dir)) {
        if (e.type === "Texture2D") out.push(...this.spritesByTex.get(e.key) || []);
      }
      return out;
    },
    loadAllTextures(dir) {
      return this.resourcesUnder(dir).filter((e) => e.type === "Texture2D").map((e) => this.textures.get(e.key)).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));
    },
    // RGBA pixels of an image (cached)
    pixels(img) {
      if (!img) return null;
      if (img._px) return img._px;
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const g = c.getContext("2d", { willReadFrequently: true });
      g.drawImage(img, 0, 0);
      img._px = g.getImageData(0, 0, img.width, img.height);
      return img._px;
    },
    loadAllPrefabs(dir) {
      return this.resourcesUnder(dir).filter((e) => e.type === "GameObject").map((e) => this.nodeIndex.get(e.key)).filter(Boolean);
    },
    loadAudio(path) {
      const e = this.resourceEntries(path).find((x) => x.type === "AudioClip");
      return e ? e.key : null;
    },
    prefabNode(key) {
      return this.nodeIndex.get(key) || null;
    },
    async audioBuffer(ctx, key) {
      if (this.audioBuffers.has(key)) return this.audioBuffers.get(key);
      const m = this.audioMeta.get(key);
      if (!m) return null;
      const p = fetch(`${BASE}audio/${m.file}`).then((r) => r.arrayBuffer()).then((b) => ctx.decodeAudioData(b)).catch(() => null);
      this.audioBuffers.set(key, p);
      return p;
    }
  };
  function loadImage(src, tries = 3) {
    return new Promise((res) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = () => {
        if (tries > 1) setTimeout(() => loadImage(src, tries - 1).then(res), 200);
        else {
          console.warn("img fail", src);
          res(null);
        }
      };
      i.src = src;
    });
  }
  __name(loadImage, "loadImage");
  function parseRef(s2) {
    if (typeof s2 !== "string" || s2[0] !== "@") return null;
    const hash = s2.lastIndexOf("#");
    const head = s2.slice(1, hash);
    const key = s2.slice(hash + 1);
    const colon = head.indexOf(":");
    return { type: colon >= 0 ? head.slice(0, colon) : head, name: colon >= 0 ? head.slice(colon + 1) : null, key };
  }
  __name(parseRef, "parseRef");

  // web/src/engine/scene.js
  var _LocalizedString = null;
  var _UnityEvent = null;
  function setSerializationTypes(ls, ue) {
    _LocalizedString = ls;
    _UnityEvent = ue;
  }
  __name(setSerializationTypes, "setSerializationTypes");
  var AudioClipRef = class {
    static {
      __name(this, "AudioClipRef");
    }
    constructor(key) {
      this.key = key;
      const m = Assets.audioMeta.get(key) || {};
      this.name = m.name || key;
      this.length = m.len || 0;
    }
  };
  var PrefabRef = class {
    static {
      __name(this, "PrefabRef");
    }
    constructor(node, key, root) {
      this.node = node;
      this.key = key;
      this.name = node.name;
      this.root = root || node;
    }
    get gameObject() {
      return this;
    }
    getComponent(t) {
      const c = this.node.components.find((x) => (x.script || x.type) === (typeof t === "string" ? t : t.typeName));
      return c ? { fields: c.fields, prefab: this } : null;
    }
  };
  var PrefabComponentRef = class {
    static {
      __name(this, "PrefabComponentRef");
    }
    constructor(entry, cid) {
      this.prefab = new PrefabRef(entry.root, entry.root.id);
      this.cid = cid;
      this.node = entry.node;
      this.script = entry.comp.script || entry.comp.type;
      this.name = entry.root.name;
    }
    get gameObject() {
      return this.prefab;
    }
  };
  var TextAssetRef = class {
    static {
      __name(this, "TextAssetRef");
    }
    constructor(key, name) {
      this.key = key;
      this.name = name;
    }
    get text() {
      return JSON.stringify(Assets.data[this.name] ?? {});
    }
  };
  var scriptables = null;
  async function loadScriptables() {
    scriptables = await Assets.json("scriptables.json");
  }
  __name(loadScriptables, "loadScriptables");
  var soCache = /* @__PURE__ */ new Map();
  function scriptableObject(key) {
    if (soCache.has(key)) return soCache.get(key);
    const e = scriptables?.[key];
    if (!e) return null;
    const cls = Registry.get(e.script);
    const o = cls ? Object.create(cls.prototype) : {};
    o.name = e.name;
    o._typeName = e.script;
    soCache.set(key, o);
    Object.assign(o, resolveValue(e.fields || {}, null));
    return o;
  }
  __name(scriptableObject, "scriptableObject");
  var Scene = class {
    static {
      __name(this, "Scene");
    }
    constructor(name, engine) {
      this.name = name;
      this.engine = engine;
      this.roots = [];
      this.isLoaded = true;
    }
    _addRoot(go) {
      if (!this.roots.includes(go)) this.roots.push(go);
      go.scene = this;
    }
    _removeRoot(go) {
      const i = this.roots.indexOf(go);
      if (i >= 0) this.roots.splice(i, 1);
    }
    getRootGameObjects() {
      return [...this.roots];
    }
  };
  function resolveValue(v, map) {
    if (typeof v === "string" && v[0] === "@") return resolveRef(v, map);
    if (Array.isArray(v)) return v.map((x) => resolveValue(x, map));
    if (v && typeof v === "object") {
      if (_LocalizedString && "m_TableEntryReference" in v) return new _LocalizedString(v);
      if (_UnityEvent && "m_PersistentCalls" in v && Object.keys(v).length <= 2) {
        const o2 = { m_PersistentCalls: { m_Calls: (v.m_PersistentCalls?.m_Calls || []).map((c) => resolveValue(c, map)) } };
        return new _UnityEvent(o2);
      }
      const o = {};
      for (const k in v) o[k] = resolveValue(v[k], map);
      if (Object.keys(o).length === 4 && "r" in o && "g" in o && "b" in o && "a" in o) return Color.from(o);
      return o;
    }
    return v;
  }
  __name(resolveValue, "resolveValue");
  function resolveRef(s2, map) {
    const r = parseRef(s2);
    if (!r) return null;
    if (map && map.has(r.key)) return map.get(r.key);
    const g = Engine.global.get(r.key);
    if (g && !g._destroyed) return g;
    switch (r.type) {
      case "Sprite":
        return Assets.sprite(r.key);
      case "Texture2D":
        return (Assets.spritesByTex.get(r.key) || [])[0] || { key: r.key, name: r.name };
      case "AudioClip":
        return new AudioClipRef(r.key);
      case "AnimatorController":
        return Assets.controllers[r.key] ? { key: r.key, ...Assets.controllers[r.key] } : null;
      case "AnimationClip":
        return Assets.clips[r.key] ? { key: r.key, ...Assets.clips[r.key] } : null;
      case "TextAsset":
        return new TextAssetRef(r.key, r.name);
      case "GameObject": {
        const n = Assets.prefabNode(r.key);
        if (!n) return null;
        const root = Assets.rootOf.get(r.key) || n;
        return new PrefabRef(n, r.key, root);
      }
      case "Material":
        return { key: r.key, name: r.name, isMaterial: true };
      case "MonoBehaviour": {
        if (Assets.fontByKey[r.key]) return Assets.fontByKey[r.key];
        const so = scriptableObject(r.key);
        if (so) return so;
        const e = !isSceneKey(r.key) && Assets.cidIndex.get(r.key);
        if (e) return new PrefabComponentRef(e, r.key);
        return { key: r.key, unresolved: true };
      }
      default: {
        const e = !isSceneKey(r.key) && Assets.cidIndex.get(r.key);
        if (e) return new PrefabComponentRef(e, r.key);
        return { key: r.key, name: r.name, type: r.type, unresolved: true };
      }
    }
  }
  __name(resolveRef, "resolveRef");
  var Engine = { global: /* @__PURE__ */ new Map(), current: null };
  function resolvePending(pending, map) {
    for (const [comp, f] of pending) {
      const resolved = resolveValue(f, map);
      try {
        if (comp.deserialize) comp.deserialize(resolved, f);
        else Object.assign(comp, resolved);
      } catch (e) {
        console.error("deserialize", comp._typeName, e);
      }
    }
  }
  __name(resolvePending, "resolvePending");
  var isSceneKey = /* @__PURE__ */ __name((k) => /^level\d+:/.test(k), "isSceneKey");
  function instantiateNode(node, scene, parent = null, opts = {}) {
    const map = opts.map || /* @__PURE__ */ new Map();
    const pending = opts.pending || [];
    const build = /* @__PURE__ */ __name((n, parentTr) => {
      const tr0 = n.components[0];
      const isRect = tr0 && tr0.type === "RectTransform";
      const go = new GameObject(n.name, isRect, scene);
      go.activeSelf = !!n.active;
      go.layer = n.layer || 0;
      go.srcId = n.id;
      map.set(n.id, go);
      const tr = go.transform;
      if (tr0 && tr0.type && tr0.type.endsWith("Transform")) {
        map.set(tr0.cid, tr);
        tr.localPosition = Vec3.from(tr0.pos);
        tr.localRotation = Quat.from(tr0.rot);
        tr.localScale = Vec3.from(tr0.scale);
        if (isRect) {
          tr.anchorMin = { ...tr0.m_AnchorMin };
          tr.anchorMax = { ...tr0.m_AnchorMax };
          tr.anchoredPosition = { ...tr0.m_AnchoredPosition };
          tr.sizeDelta = { ...tr0.m_SizeDelta };
          tr.pivot = { ...tr0.m_Pivot };
        }
      }
      if (parentTr) {
        tr.parent = parentTr;
        parentTr.children.push(tr);
      }
      for (const c of n.components) {
        if (c.type.endsWith("Transform")) continue;
        const typeName = c.type === "MonoBehaviour" ? c.script || "MissingScript" : c.type;
        if (typeName === "CanvasRenderer") continue;
        const cls = Registry.get(typeName) || Registry.get("GenericBehaviour");
        const comp = new cls(go);
        comp._typeName = typeName;
        const f = c.fields || {};
        if ("enabled" in c) comp.enabled = !!c.enabled;
        else if ("m_Enabled" in f) comp.enabled = !!f.m_Enabled;
        go.components.push(comp);
        map.set(c.cid, comp);
        pending.push([comp, f]);
      }
      for (const ch of n.children || []) build(ch, tr);
      return go;
    }, "build");
    const root = build(node, parent ? parent : null);
    if (!opts.pending) resolvePending(pending, map);
    if (opts.registerGlobal) for (const [k, v] of map) Engine.global.set(k, v);
    root._instanceMap = map;
    if (!parent) {
      if (scene) scene._addRoot(root);
    }
    return root;
  }
  __name(instantiateNode, "instantiateNode");

  // web/src/engine/engine.js
  var SCENE_FILES = { "Main Menu": "level0", "Game": "level1", "Persistent": "level2" };
  var SCENE_NAMES = ["Main Menu", "Game", "Persistent"];
  var Game = {
    scenes: [],
    persistent: null,
    toStart: [],
    updatables: /* @__PURE__ */ new Set(),
    lateUpdatables: /* @__PURE__ */ new Set(),
    toDestroy: [],
    sceneLoadedHandlers: [],
    frameHooks: { preUpdate: [], postUpdate: [], preRender: [] },
    _schedule(c) {
      this.toStart.push(c);
    },
    get activeScene() {
      return this.scenes.find((s2) => s2 !== this.persistent) || this.scenes[0];
    },
    init() {
      this.persistent = new Scene("DontDestroyOnLoad", this);
      this.scenes.push(this.persistent);
    },
    // Load a scene by name (single) or additively.
    loadScene(name, additive = false) {
      const idx = typeof name === "number" ? name : SCENE_NAMES.indexOf(name);
      const sname = SCENE_NAMES[idx];
      if (!additive) {
        for (const s2 of [...this.scenes]) if (s2 !== this.persistent) this.unloadScene(s2);
      }
      const scene = new Scene(sname, this);
      scene.buildIndex = idx;
      this.scenes.push(scene);
      const data = Assets.scenes[SCENE_FILES[sname]];
      const roots = [];
      const map = /* @__PURE__ */ new Map();
      const pending = [];
      for (const n of data.roots) roots.push(instantiateNode(n, null, null, { map, pending }));
      resolvePending(pending, map);
      for (const [k, v] of map) Engine.global.set(k, v);
      for (const go of roots) {
        go.scene = null;
        scene._addRoot(go);
        setSceneRec(go, scene);
      }
      const order = [];
      for (const go of roots) if (go.activeSelf) collectActive(go, order);
      order.sort((a, b) => (a.constructor.executionOrder || 0) - (b.constructor.executionOrder || 0));
      for (const c of order) c._doAwake();
      for (const c of order) if (c.enabled && !c._destroyed && c.gameObject.activeInHierarchy) c._doEnable();
      for (const h of this.sceneLoadedHandlers) h(scene);
      if (sname === "Persistent") {
        for (const go of [...scene.roots]) this.dontDestroyOnLoad(go);
        this.scenes.splice(this.scenes.indexOf(scene), 1);
        scene.isLoaded = false;
        return this.persistent;
      }
      return scene;
    },
    unloadScene(scene) {
      for (const go of [...scene.roots]) this.destroyImmediate(go);
      this.scenes.splice(this.scenes.indexOf(scene), 1);
      scene.isLoaded = false;
    },
    getSceneByIndex(i) {
      return this.scenes.find((s2) => s2.buildIndex === i);
    },
    dontDestroyOnLoad(go) {
      if (go instanceof Component) go = go.gameObject;
      while (go.transform.parent) go = go.transform.parent.gameObject;
      if (go.scene === this.persistent) return;
      go.scene?._removeRoot(go);
      this.persistent._addRoot(go);
      setSceneRec(go, this.persistent);
    },
    // Instantiate(prefab | GameObject | Component, parent?, worldPositionStays?) / (prefab, position, rotation, parent?)
    instantiate(orig, parentOrPos, wpsOrRot, maybeParent) {
      let parent = null, pos = null, rot = null, wps = false;
      if (parentOrPos && (parentOrPos.transform || parentOrPos.children)) {
        parent = parentOrPos.transform || parentOrPos;
        wps = !!wpsOrRot;
      } else if (parentOrPos && "x" in parentOrPos) {
        pos = parentOrPos;
        rot = wpsOrRot;
        parent = maybeParent ? maybeParent.transform || maybeParent : null;
      }
      let compType = null;
      let node = null;
      let compCid = null;
      if (orig instanceof PrefabComponentRef) {
        node = orig.prefab.root;
        compCid = orig.cid;
      } else if (orig instanceof PrefabRef) node = orig.node;
      else if (orig instanceof Component) {
        compType = orig.constructor;
        node = Assets.prefabNode(orig.gameObject.srcId) || null;
        if (!node) return null;
      } else if (orig instanceof GameObject) node = Assets.prefabNode(orig.srcId);
      else if (orig && orig.prefab) node = orig.prefab.node;
      if (!node) {
        console.warn("instantiate: no node for", orig);
        return null;
      }
      const scene = parent ? parent.gameObject.scene : this.activeScene;
      const go = instantiateNode(node, scene, null);
      if (orig instanceof GameObject && orig.name !== node.name) go.name = orig.name;
      go.name = go.name + "(Clone)";
      if (parent) {
        go.scene?._removeRoot(go);
        go.transform.parent = null;
        scene?._removeRoot(go);
        go.transform.parent = parent;
        parent.children.push(go.transform);
        parent._layoutDirty = true;
        setSceneRec(go, parent.gameObject.scene);
      } else {
        setSceneRec(go, scene);
      }
      if (pos) go.transform.position = pos;
      if (rot) go.transform.localRotation = rot;
      if (go.activeInHierarchy) go._propagateActive(true);
      if (compCid) return go._instanceMap.get(compCid) || null;
      if (compType) return go.getComponent(compType);
      return go;
    },
    destroy(obj, delay = 0) {
      if (!obj) return;
      if (delay > 0) {
        setTimeoutGame(() => this.destroy(obj), delay);
        return;
      }
      this.toDestroy.push(obj);
    },
    destroyImmediate(obj) {
      if (!obj || obj._destroyed) return;
      if (obj instanceof Component) {
        obj._doDisable();
        obj.onDestroy?.();
        obj._destroyed = true;
        const arr = obj.gameObject.components;
        const i = arr.indexOf(obj);
        if (i >= 0) arr.splice(i, 1);
        return;
      }
      const go = obj instanceof GameObject ? obj : obj.gameObject;
      if (!go || go._destroyed) return;
      if (go.activeInHierarchy) go._propagateActive(false);
      const kill = /* @__PURE__ */ __name((g) => {
        for (const ch of [...g.transform.children]) kill(ch.gameObject);
        for (const c of g.components) {
          if (c._awoken) c.onDestroy?.();
          c._destroyed = true;
          c.stopAllCoroutines();
        }
        g._destroyed = true;
      }, "kill");
      kill(go);
      if (go.transform.parent) {
        const a = go.transform.parent.children;
        const i = a.indexOf(go.transform);
        if (i >= 0) a.splice(i, 1);
        go.transform.parent._layoutDirty = true;
      } else go.scene?._removeRoot(go);
    },
    *allGameObjects(includeInactive = false) {
      for (const s2 of this.scenes) for (const r of s2.roots) yield* walkGO(r, includeInactive);
    },
    findObjectOfType(t, includeInactive = false) {
      for (const go of this.allGameObjects(includeInactive)) {
        const c = go.getComponent(t);
        if (c && (includeInactive || c.enabled)) return c;
      }
      return null;
    },
    findObjectsOfType(t, includeInactive = false) {
      const out = [];
      for (const go of this.allGameObjects(includeInactive)) out.push(...go.getComponents(t));
      return out;
    },
    find(name) {
      for (const go of this.allGameObjects(false)) if (go.name === name) return go;
      return null;
    },
    // ---- main loop ----
    step(dtReal) {
      dtReal = Math.min(dtReal, 0.1);
      Time.unscaledDeltaTime = dtReal;
      Time.unscaledTime += dtReal;
      Time.realtimeSinceStartup += dtReal;
      Time.deltaTime = dtReal * Time.timeScale;
      Time.time += Time.deltaTime;
      Time.frameCount++;
      for (const h of this.frameHooks.preUpdate) h();
      let guard = 0;
      while (this.toStart.length && guard++ < 50) {
        const list = this.toStart.splice(0);
        list.sort((a, b) => (a.constructor.executionOrder || 0) - (b.constructor.executionOrder || 0));
        for (const c of list) {
          if (c._destroyed || !c.activeAndEnabled) {
            if (!c._destroyed) this.toStart.push(c);
            continue;
          }
          if (!c._started) {
            c._started = true;
            try {
              const r = c.start?.();
              if (r && typeof r.next === "function") c.startCoroutine(r);
            } catch (e) {
              console.error("Start", c.toString(), e);
            }
          }
        }
        if (this.toStart.every((c) => !c.activeAndEnabled)) break;
      }
      const comps = [];
      for (const go of this.allGameObjects(false)) for (const c of go.components) if (c.enabled && c._started && !c._destroyed) comps.push(c);
      comps.sort((a, b) => (a.constructor.executionOrder || 0) - (b.constructor.executionOrder || 0));
      for (const c of comps) if (c.update && c.activeAndEnabled) {
        try {
          c.update();
        } catch (e) {
          console.error("Update", c.toString(), e);
        }
      }
      Coroutines.tick();
      tickTimers();
      for (const h of this.frameHooks.postUpdate) h();
      for (const c of comps) if (c.lateUpdate && c.activeAndEnabled) {
        try {
          c.lateUpdate();
        } catch (e) {
          console.error("LateUpdate", c.toString(), e);
        }
      }
      const d = this.toDestroy.splice(0);
      for (const o of d) this.destroyImmediate(o);
      for (const h of this.frameHooks.preRender) h();
    }
  };
  function setSceneRec(go, scene) {
    go.scene = scene;
    for (const ch of go.transform.children) setSceneRec(ch.gameObject, scene);
  }
  __name(setSceneRec, "setSceneRec");
  function collectActive(go, out) {
    if (!go.activeSelf) return;
    out.push(...go.components);
    for (const ch of go.transform.children) collectActive(ch.gameObject, out);
  }
  __name(collectActive, "collectActive");
  function* walkGO(go, inc) {
    if (!inc && !go.activeSelf) return;
    yield go;
    for (const ch of [...go.transform.children]) yield* walkGO(ch.gameObject, inc);
  }
  __name(walkGO, "walkGO");
  var timers = [];
  function setTimeoutGame(fn, s2, realtime = false) {
    timers.push({ fn, at: (realtime ? Time.unscaledTime : Time.time) + s2, realtime });
  }
  __name(setTimeoutGame, "setTimeoutGame");
  function tickTimers() {
    for (let i = timers.length - 1; i >= 0; i--) {
      const t = timers[i];
      if ((t.realtime ? Time.unscaledTime : Time.time) >= t.at) {
        timers.splice(i, 1);
        try {
          t.fn();
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
  __name(tickTimers, "tickTimers");
  Engine.current = Game;

  // web/src/engine/render.js
  var tintCache = /* @__PURE__ */ new Map();
  function tinted(img, color, key) {
    if (!img || color.isWhiteRGB()) return img;
    const k = (key || img.src || img._id || (img._id = Math.random().toString(36))) + "|" + color.rgbKey();
    let c = tintCache.get(k);
    if (!c) {
      c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const g = c.getContext("2d");
      g.drawImage(img, 0, 0);
      g.globalCompositeOperation = "multiply";
      g.fillStyle = `rgb(${color.rgbKey()})`;
      g.fillRect(0, 0, c.width, c.height);
      g.globalCompositeOperation = "destination-in";
      g.drawImage(img, 0, 0);
      if (tintCache.size > 4e3) tintCache.clear();
      tintCache.set(k, c);
    }
    return c;
  }
  __name(tinted, "tinted");
  function drawSprite(ctx, sprite, x, y, w, h, opts = {}) {
    const img = opts.image || sprite.img;
    if (!img) return;
    const src = opts.color ? tinted(img, opts.color, opts.image ? null : sprite.key) : img;
    const flipX = opts.flipX, flipY = opts.flipY;
    ctx.save();
    ctx.translate(x + (flipX ? w : 0), y + (flipY ? 0 : h));
    ctx.scale(flipX ? -1 : 1, flipY ? 1 : -1);
    if (opts.sliced && sprite.border && (sprite.border[0] || sprite.border[1] || sprite.border[2] || sprite.border[3])) {
      drawNine(ctx, src, sprite, w, h, opts.borderScale || 1, opts.fillCenter !== false);
    } else if (opts.tiled) {
      drawTiled(ctx, src, sprite, w, h, opts.tileScale || 1);
    } else if (opts.srcRect) {
      const s2 = opts.srcRect;
      ctx.drawImage(src, s2.x, s2.y, s2.w, s2.h, 0, 0, w, h);
    } else ctx.drawImage(src, 0, 0, w, h);
    ctx.restore();
  }
  __name(drawSprite, "drawSprite");
  function drawNine(ctx, img, sp, w, h, bs, center) {
    const [L, B, R, T] = sp.border;
    const iw = img.width, ih = img.height;
    const sx = bs, sy = bs;
    let l = L * sx, r = R * sx, t = T * sy, b = B * sy;
    if (l + r > w) {
      const k = w / (l + r);
      l *= k;
      r *= k;
    }
    if (t + b > h) {
      const k = h / (t + b);
      t *= k;
      b *= k;
    }
    const cols = [[0, L, 0, l], [L, iw - L - R, l, w - l - r], [iw - R, R, w - r, r]];
    const rows = [[0, T, 0, t], [T, ih - T - B, t, h - t - b], [ih - B, B, h - b, b]];
    for (let ri = 0; ri < 3; ri++) for (let ci = 0; ci < 3; ci++) {
      if (!center && ri === 1 && ci === 1) continue;
      const [sx0, sw, dx, dw] = cols[ci], [sy0, sh, dy, dh] = rows[ri];
      if (sw <= 0 || sh <= 0 || dw <= 0 || dh <= 0) continue;
      ctx.drawImage(img, sx0, sy0, sw, sh, dx, dy, dw + 0.01, dh + 0.01);
    }
  }
  __name(drawNine, "drawNine");
  function drawTiled(ctx, img, sp, w, h, scale) {
    const tw = img.width * scale, th = img.height * scale;
    for (let y = 0; y < h; y += th) for (let x = 0; x < w; x += tw) {
      const dw = Math.min(tw, w - x), dh = Math.min(th, h - y);
      ctx.drawImage(img, 0, 0, img.width * dw / tw, img.height * dh / th, x, y, dw, dh);
    }
  }
  __name(drawTiled, "drawTiled");
  var SpriteRenderer = class extends Component {
    static {
      __name(this, "SpriteRenderer");
    }
    constructor(go) {
      super(go);
      this.sprite = null;
      this.color = Color.white;
      this.sortingOrder = 0;
      this.flipX = false;
      this.flipY = false;
      this.drawMode = 0;
      this.size = { x: 1, y: 1 };
      this.overrideImage = null;
      this.maskInteraction = 0;
    }
    deserialize(f) {
      this.sprite = f.m_Sprite || null;
      this.color = Color.from(f.m_Color);
      this.sortingOrder = f.m_SortingOrder || 0;
      this.flipX = !!f.m_FlipX;
      this.flipY = !!f.m_FlipY;
      this.drawMode = f.m_DrawMode || 0;
      this.size = { ...f.m_Size || { x: 1, y: 1 } };
      this.maskInteraction = f.m_MaskInteraction || 0;
    }
    get bounds() {
      const s2 = this.sprite;
      if (!s2) {
        const p = this.transform.position;
        return aabb([p]);
      }
      const r = this.localRect();
      const m = this.transform.worldMatrix;
      return aabb([m.apply(r.x, r.y), m.apply(r.x + r.w, r.y), m.apply(r.x, r.y + r.h), m.apply(r.x + r.w, r.y + r.h)]);
    }
    localRect() {
      const s2 = this.sprite;
      if (this.drawMode !== 0) return { x: -s2.px * this.size.x, y: -s2.py * this.size.y, w: this.size.x, h: this.size.y };
      return { x: (s2.ox - s2.px * s2.rw) / s2.ppu, y: (s2.oy - s2.py * s2.rh) / s2.ppu, w: s2.w / s2.ppu, h: s2.h / s2.ppu };
    }
    render(ctx, alpha) {
      const s2 = this.sprite;
      if (!s2 || !s2.img) return;
      const a = this.color.a * alpha;
      if (a <= 1e-3) return;
      const r = this.localRect();
      ctx.globalAlpha = a;
      drawSprite(ctx, s2, r.x, r.y, r.w, r.h, {
        color: this.color,
        flipX: this.flipX,
        flipY: this.flipY,
        image: this.overrideImage,
        sliced: this.drawMode === 1,
        tiled: this.drawMode === 2,
        borderScale: 1 / s2.ppu,
        tileScale: 1 / s2.ppu
      });
    }
  };
  register(SpriteRenderer, "SpriteRenderer");
  function aabb(pts) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const p of pts) {
      x0 = Math.min(x0, p.x);
      y0 = Math.min(y0, p.y);
      x1 = Math.max(x1, p.x);
      y1 = Math.max(y1, p.y);
    }
    return {
      min: { x: x0, y: y0 },
      max: { x: x1, y: y1 },
      center: { x: (x0 + x1) / 2, y: (y0 + y1) / 2, z: 0 },
      size: { x: x1 - x0, y: y1 - y0 },
      extents: { x: (x1 - x0) / 2, y: (y1 - y0) / 2 },
      contains(p) {
        return p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1;
      }
    };
  }
  __name(aabb, "aabb");
  var SortingGroup = class extends Component {
    static {
      __name(this, "SortingGroup");
    }
    constructor(go) {
      super(go);
      this.sortingOrder = 0;
    }
    deserialize(f) {
      this.sortingOrder = f.m_SortingOrder || 0;
      this.enabled = f.m_Enabled !== 0;
    }
  };
  register(SortingGroup, "SortingGroup");
  var Camera = class _Camera extends Component {
    static {
      __name(this, "Camera");
    }
    constructor(go) {
      super(go);
      this.orthographicSize = 5;
      this.backgroundColor = new Color(0, 0, 0, 1);
      this.depth = 0;
    }
    deserialize(f) {
      this.orthographicSize = f["orthographic size"] ?? 5;
      this.backgroundColor = Color.from(f.m_BackGroundColor);
      this.depth = f.m_Depth || 0;
      this.clearFlags = f.m_ClearFlags;
    }
    static get main() {
      return _Camera._main && _Camera._main.activeAndEnabled ? _Camera._main : _Camera._main = Game.findObjectOfType(_Camera);
    }
    get aspect() {
      return Renderer.width / Renderer.height;
    }
    get pixelsPerUnit() {
      return Renderer.height / (2 * this.orthographicSize);
    }
    screenToWorldPoint(p) {
      const k = this.pixelsPerUnit;
      const c = this.transform.position;
      return { x: c.x + (p.x - Renderer.width / 2) / k, y: c.y + (p.y - Renderer.height / 2) / k, z: 0 };
    }
    worldToScreenPoint(p) {
      const k = this.pixelsPerUnit;
      const c = this.transform.position;
      return { x: (p.x - c.x) * k + Renderer.width / 2, y: (p.y - c.y) * k + Renderer.height / 2, z: 0 };
    }
    worldToViewportPoint(p) {
      const s2 = this.worldToScreenPoint(p);
      return { x: s2.x / Renderer.width, y: s2.y / Renderer.height, z: 0 };
    }
    viewportToWorldPoint(p) {
      return this.screenToWorldPoint({ x: p.x * Renderer.width, y: p.y * Renderer.height });
    }
  };
  register(Camera, "Camera");
  var Canvas = class _Canvas extends Component {
    static {
      __name(this, "Canvas");
    }
    constructor(go) {
      super(go);
      this.renderMode = 0;
      this.sortingOrder = 0;
      this.overrideSorting = false;
      this.scaleFactor = 1;
    }
    deserialize(f) {
      this.renderMode = f.m_RenderMode || 0;
      this.sortingOrder = f.m_SortingOrder || 0;
      this.overrideSorting = !!f.m_OverrideSorting;
      this.enabled = f.m_Enabled !== 0;
    }
    get isRootCanvas() {
      return !this.parentCanvas;
    }
    get parentCanvas() {
      let t = this.transform.parent;
      while (t) {
        const c = t.gameObject.getComponent(_Canvas);
        if (c && c.enabled) return c;
        t = t.parent;
      }
      return null;
    }
    get rootCanvas() {
      let c = this;
      for (let p = c.parentCanvas; p; p = p.parentCanvas) c = p;
      return c;
    }
  };
  register(Canvas, "Canvas");
  var CanvasScaler = class extends Component {
    static {
      __name(this, "CanvasScaler");
    }
    deserialize(f) {
      this.uiScaleMode = f.m_UiScaleMode;
      this.referenceResolution = { ...f.m_ReferenceResolution };
      this.matchWidthOrHeight = f.m_MatchWidthOrHeight;
      this.scaleFactor = f.m_ScaleFactor || 1;
      this.referencePixelsPerUnit = f.m_ReferencePixelsPerUnit || 100;
    }
    computeScale(W, H) {
      if (this.uiScaleMode === 1) {
        const lw = Math.log2(W / this.referenceResolution.x), lh = Math.log2(H / this.referenceResolution.y);
        return Math.pow(2, lw + (lh - lw) * this.matchWidthOrHeight);
      }
      return this.scaleFactor;
    }
  };
  register(CanvasScaler, "CanvasScaler");
  var CanvasGroup = class extends Component {
    static {
      __name(this, "CanvasGroup");
    }
    constructor(go) {
      super(go);
      this.alpha = 1;
      this.interactable = true;
      this.blocksRaycasts = true;
      this.ignoreParentGroups = false;
    }
    deserialize(f) {
      this.alpha = f.m_Alpha ?? 1;
      this.interactable = !!f.m_Interactable;
      this.blocksRaycasts = !!f.m_BlocksRaycasts;
      this.ignoreParentGroups = !!f.m_IgnoreParentGroups;
      this.enabled = f.m_Enabled !== 0;
    }
  };
  register(CanvasGroup, "CanvasGroup");
  var Collider2D = class extends Component {
    static {
      __name(this, "Collider2D");
    }
    constructor(go) {
      super(go);
      this.offset = { x: 0, y: 0 };
      this.isTrigger = false;
    }
    get bounds() {
      return aabb(this.worldPoly());
    }
    overlapPoint(p) {
      const l = this.transform.inverseTransformPoint(p.x, p.y);
      return this.containsLocal(l);
    }
  };
  var BoxCollider2D = class extends Collider2D {
    static {
      __name(this, "BoxCollider2D");
    }
    constructor(go) {
      super(go);
      this.size = { x: 1, y: 1 };
    }
    deserialize(f) {
      this.enabled = f.m_Enabled !== 0;
      this.offset = { ...f.m_Offset };
      this.size = { ...f.m_Size };
      this.isTrigger = !!f.m_IsTrigger;
    }
    containsLocal(l) {
      return Math.abs(l.x - this.offset.x) <= this.size.x / 2 && Math.abs(l.y - this.offset.y) <= this.size.y / 2;
    }
    worldPoly() {
      const m = this.transform.worldMatrix, o = this.offset, hx = this.size.x / 2, hy = this.size.y / 2;
      return [m.apply(o.x - hx, o.y - hy), m.apply(o.x + hx, o.y - hy), m.apply(o.x + hx, o.y + hy), m.apply(o.x - hx, o.y + hy)];
    }
  };
  register(BoxCollider2D, "BoxCollider2D");
  var CircleCollider2D = class extends Collider2D {
    static {
      __name(this, "CircleCollider2D");
    }
    constructor(go) {
      super(go);
      this.radius = 0.5;
    }
    deserialize(f) {
      this.enabled = f.m_Enabled !== 0;
      this.offset = { ...f.m_Offset };
      this.radius = f.m_Radius ?? 0.5;
      this.isTrigger = !!f.m_IsTrigger;
    }
    containsLocal(l) {
      return Math.hypot(l.x - this.offset.x, l.y - this.offset.y) <= this.radius;
    }
    worldPoly() {
      const m = this.transform.worldMatrix, o = this.offset, r = this.radius;
      return [m.apply(o.x - r, o.y - r), m.apply(o.x + r, o.y + r)];
    }
  };
  register(CircleCollider2D, "CircleCollider2D");
  var Physics2D = {
    overlapPoint(p) {
      return this.overlapPointAll(p)[0] || null;
    },
    overlapPointAll(p) {
      const out = [];
      for (const go of Game.allGameObjects(false)) for (const c of go.components) if (c instanceof Collider2D && c.activeAndEnabled && c.overlapPoint(p)) out.push(c);
      return out;
    },
    overlapBoxAll(center, size) {
      const out = [];
      const x0 = center.x - size.x / 2, x1 = center.x + size.x / 2, y0 = center.y - size.y / 2, y1 = center.y + size.y / 2;
      for (const go of Game.allGameObjects(false)) for (const c of go.components) if (c instanceof Collider2D && c.activeAndEnabled) {
        const b = c.bounds;
        if (b.max.x >= x0 && b.min.x <= x1 && b.max.y >= y0 && b.min.y <= y1) out.push(c);
      }
      return out;
    }
  };
  var Renderer = {
    canvas: null,
    ctx: null,
    width: 1,
    height: 1,
    dpr: 1,
    uiDrawers: [],
    debug: false,
    init(canvas2) {
      this.canvas = canvas2;
      this.ctx = canvas2.getContext("2d", { alpha: false, desynchronized: true });
      const resize = /* @__PURE__ */ __name(() => {
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = window.innerWidth, h = window.innerHeight;
        canvas2.style.width = w + "px";
        canvas2.style.height = h + "px";
        canvas2.width = Math.round(w * this.dpr);
        canvas2.height = Math.round(h * this.dpr);
        this.width = canvas2.width;
        this.height = canvas2.height;
      }, "resize");
      window.addEventListener("resize", resize);
      resize();
    },
    // Collect world renderables into a sort tree.
    collectWorld() {
      const root = { items: [] };
      const visit = /* @__PURE__ */ __name((go, group, groupAlpha) => {
        if (!go.activeSelf) return;
        let g = group;
        const sg = go.getComponent(SortingGroup);
        if (sg && sg.enabled) {
          const node = { kind: "group", order: sg.sortingOrder, z: go.transform.position.z, items: [], seq: seq++ };
          group.items.push(node);
          g = node;
        }
        for (const c of go.components) {
          if (!c.enabled) continue;
          if (c instanceof Canvas) {
            if (c.renderMode === 2 && (c.isRootCanvas || c.overrideSorting)) {
              root.items.push({ kind: "canvas", order: c.sortingOrder, z: go.transform.position.z, canvas: c, seq: seq++ });
            }
            if (c.renderMode !== 2 || true) return;
          }
          if (c.render && !c.isGraphic) g.items.push({ kind: "r", order: c.sortingOrder || 0, z: c.transform.position.z, c, seq: seq++ });
        }
        for (const ch of go.transform.children) visit(ch.gameObject, g, groupAlpha);
      }, "visit");
      let seq = 0;
      for (const s2 of Game.scenes) for (const r of s2.roots) visit(r, root, 1);
      return root;
    },
    sortItems(items) {
      items.sort((a, b) => a.order - b.order || b.z - a.z || a.seq - b.seq);
      for (const it of items) if (it.kind === "group") this.sortItems(it.items);
    },
    render() {
      const ctx = this.ctx;
      const W = this.width, H = this.height;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      ctx.imageSmoothingEnabled = false;
      const cam = Camera.main;
      ctx.fillStyle = cam ? cam.backgroundColor.css() : "#000";
      ctx.fillRect(0, 0, W, H);
      if (cam) {
        const k = cam.pixelsPerUnit;
        const c = cam.transform.position;
        const base = new Mat2D(k, 0, 0, -k, W / 2 - c.x * k, H / 2 + c.y * k);
        this.worldBase = base;
        const tree = this.collectWorld();
        this.sortItems(tree.items);
        this.drawItems(ctx, tree.items, base);
      }
      const overlays = [];
      for (const go of Game.allGameObjects(false)) {
        const cv = go.getComponent(Canvas);
        if (cv && cv.enabled && cv.renderMode !== 2 && (cv.isRootCanvas || cv.overrideSorting)) overlays.push(cv);
      }
      overlays.sort((a, b) => a.sortingOrder - b.sortingOrder);
      for (const cv of overlays) {
        this.layoutOverlay(cv);
        this.drawCanvas(ctx, cv, new Mat2D(1, 0, 0, -1, 0, H));
      }
      for (const d of this.uiDrawers) d(ctx);
    },
    layoutOverlay(cv) {
      if (!cv.isRootCanvas) return;
      const tr = cv.transform;
      const sc = cv.gameObject.getComponent(CanvasScaler);
      const s2 = sc ? sc.computeScale(this.width, this.height) : 1;
      cv.scaleFactor = s2;
      tr.localScale.x = s2;
      tr.localScale.y = s2;
      tr.localScale.z = s2;
      tr.sizeDelta = { x: this.width / s2, y: this.height / s2 };
      tr.anchorMin = { x: 0, y: 0 };
      tr.anchorMax = { x: 0, y: 0 };
      tr.pivot = { x: 0.5, y: 0.5 };
      tr.localPosition.x = this.width / 2;
      tr.localPosition.y = this.height / 2;
      tr.localRotation.x = tr.localRotation.y = tr.localRotation.z = 0;
      tr.localRotation.w = 1;
    },
    drawItems(ctx, items, base) {
      for (const it of items) {
        if (it.kind === "group") this.drawItems(ctx, it.items, base);
        else if (it.kind === "canvas") this.drawCanvas(ctx, it.canvas, base);
        else {
          ctx.save();
          const m = base.mul(it.c.transform.worldMatrix);
          ctx.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
          it.c.baseMatrix = base;
          try {
            it.c.render(ctx, 1);
          } catch (e) {
            console.error("render", it.c.toString(), e);
          }
          ctx.restore();
        }
      }
    },
    // draw a canvas subtree (UI graphics) in hierarchy order
    drawCanvas(ctx, cv, base) {
      if (UI.layout) UI.layout(cv.gameObject);
      const self = this;
      const walk = /* @__PURE__ */ __name((go, alpha, isRoot) => {
        if (!go.activeSelf) return;
        if (!isRoot) {
          const sub = go.getComponent(Canvas);
          if (sub && sub.enabled && sub.overrideSorting) return;
        }
        const cg = go.getComponent(CanvasGroup);
        if (cg && cg.enabled) alpha = cg.ignoreParentGroups ? cg.alpha : alpha * cg.alpha;
        if (alpha <= 1e-3) return;
        const tr = go.transform;
        const m = base.mul(tr.worldMatrix);
        let clipped = false;
        const mask = go.components.find((c) => c.isMask && c.enabled);
        for (const c of go.components) {
          if (c.isGraphic && c.enabled && c.renderUI) {
            if (mask && mask.showMaskGraphic === false && c === mask.graphic) continue;
            ctx.save();
            ctx.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
            try {
              c.renderUI(ctx, alpha);
            } catch (e) {
              console.error("renderUI", c.toString(), e);
            }
            ctx.restore();
          } else if (!c.isGraphic && c.render && c.enabled && c instanceof SpriteRenderer) {
            ctx.save();
            ctx.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
            c.render(ctx, alpha);
            ctx.restore();
          } else if (c.renderInCanvas && c.enabled) {
            ctx.save();
            ctx.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
            c.renderInCanvas(ctx, alpha);
            ctx.restore();
          }
        }
        if (mask && tr.isRect) {
          ctx.save();
          clipped = true;
          ctx.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
          const r = tr.rect;
          const p = mask.padding || { x: 0, y: 0, z: 0, w: 0 };
          ctx.beginPath();
          ctx.rect(r.x + p.x, r.y + p.y, r.width - p.x - p.z, r.height - p.y - p.w);
          ctx.clip();
          if (!mask.padding) mask.graphic?.clipToDrawn?.(ctx);
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        for (const ch of tr.children) walk(ch.gameObject, alpha, false);
        if (clipped) ctx.restore();
      }, "walk");
      let a = 1;
      for (let t = cv.transform.parent; t; t = t.parent) {
        const cg = t.gameObject.getComponent(CanvasGroup);
        if (cg && cg.enabled) {
          a *= cg.alpha;
          if (cg.ignoreParentGroups) break;
        }
      }
      walk(cv.gameObject, a, true);
    }
  };
  var UI = { layout: null };

  // web/src/engine/ui.js
  var Graphic = class extends Component {
    static {
      __name(this, "Graphic");
    }
    constructor(go) {
      super(go);
      this.color = Color.white;
      this.raycastTarget = true;
      this.raycastPadding = { x: 0, y: 0, z: 0, w: 0 };
      this.isGraphic = true;
    }
    deserialize(f) {
      this.color = Color.from(f.m_Color);
      this.raycastTarget = !!f.m_RaycastTarget;
      this.raycastPadding = f.m_RaycastPadding || this.raycastPadding;
      this.material = f.m_Material;
    }
    get canvas() {
      return this.gameObject.getComponentInParent(Canvas, true);
    }
    get rectTransform() {
      return this.transform;
    }
    set alpha(a) {
      this.color = this.color.withAlpha(a);
    }
    crossFadeAlpha(a, d) {
      this.color = this.color.withAlpha(a);
    }
    get refPPU() {
      const cv = this.canvas?.rootCanvas;
      const sc = cv?.gameObject.getComponent(CanvasScaler);
      return sc ? sc.referencePixelsPerUnit : 100;
    }
  };
  var Image2 = class extends Graphic {
    static {
      __name(this, "Image");
    }
    constructor(go) {
      super(go);
      this.sprite = null;
      this.type = 0;
      this.preserveAspect = false;
      this.fillCenter = true;
      this.fillMethod = 4;
      this.fillAmount = 1;
      this.fillClockwise = true;
      this.fillOrigin = 0;
      this.pixelsPerUnitMultiplier = 1;
      this.overrideSprite = null;
    }
    deserialize(f) {
      super.deserialize(f);
      this.sprite = f.m_Sprite || null;
      this.type = f.m_Type || 0;
      this.preserveAspect = !!f.m_PreserveAspect;
      this.fillCenter = f.m_FillCenter !== 0;
      this.fillMethod = f.m_FillMethod ?? 4;
      this.fillAmount = f.m_FillAmount ?? 1;
      this.fillClockwise = f.m_FillClockwise !== 0;
      this.fillOrigin = f.m_FillOrigin || 0;
      this.pixelsPerUnitMultiplier = f.m_PixelsPerUnitMultiplier || 1;
    }
    get activeSprite() {
      return this.overrideSprite || this.sprite;
    }
    get pixelsPerUnit() {
      const s2 = this.activeSprite;
      return (s2 ? s2.ppu : 100) / this.refPPU;
    }
    get multipliedPPU() {
      return this.pixelsPerUnit * this.pixelsPerUnitMultiplier;
    }
    setNativeSize() {
      const s2 = this.activeSprite;
      if (!s2) return;
      const tr = this.transform;
      tr.sizeDelta = { x: s2.rw / this.pixelsPerUnit, y: s2.rh / this.pixelsPerUnit };
    }
    layoutProps(axis) {
      const s2 = this.activeSprite;
      if (!s2) return { min: 0, pref: 0, flex: -1, prio: 0 };
      if (this.type === 1 || this.type === 2) {
        const b = s2.border;
        return { min: 0, pref: (axis ? b[1] + b[3] : b[0] + b[2]) / this.multipliedPPU, flex: -1, prio: 0 };
      }
      return { min: 0, pref: (axis ? s2.rh : s2.rw) / this.pixelsPerUnit, flex: -1, prio: 0 };
    }
    renderUI(ctx, alpha) {
      const tr = this.transform;
      const r = tr.rect;
      const a = this.color.a * alpha;
      if (a <= 1e-3) return;
      if (this.customRender) {
        ctx.globalAlpha = a;
        return this.customRender(ctx, r);
      }
      const s2 = this.activeSprite;
      ctx.globalAlpha = a;
      if (!s2 || !s2.img) {
        if (!s2) {
          ctx.fillStyle = this.color.css(1);
          ctx.fillRect(r.x, r.y, r.width, r.height);
        }
        return;
      }
      let x = r.x, y = r.y, w = r.width, h = r.height;
      if (this.type === 0 || this.type === 3) {
        if (this.preserveAspect) {
          const ar = s2.rw / s2.rh;
          if (w / h > ar) {
            const nw = h * ar;
            x += (w - nw) * tr.pivot.x;
            w = nw;
          } else {
            const nh = w / ar;
            y += (h - nh) * tr.pivot.y;
            h = nh;
          }
        }
        const sx = w / s2.rw, sy = h / s2.rh;
        const ix = x + s2.ox * sx, iy = y + s2.oy * sy, iw = s2.w * sx, ih = s2.h * sy;
        if (this.type === 3 && this.fillAmount < 1) return this.renderFilled(ctx, s2, ix, iy, iw, ih);
        drawSprite(ctx, s2, ix, iy, iw, ih, { color: this.color });
      } else if (this.type === 1) {
        drawSprite(ctx, s2, x, y, w, h, { color: this.color, sliced: true, borderScale: 1 / this.multipliedPPU, fillCenter: this.fillCenter });
      } else if (this.type === 2) {
        drawSprite(ctx, s2, x, y, w, h, { color: this.color, tiled: true, tileScale: 1 / this.multipliedPPU });
      }
    }
    renderFilled(ctx, s2, x, y, w, h) {
      const f = clamp01(this.fillAmount);
      if (f <= 0) return;
      const img = tinted(s2.img, this.color, s2.key);
      ctx.save();
      this.fillPath(ctx, x, y, w, h, f);
      ctx.clip();
      drawSprite(ctx, s2, x, y, w, h, { image: img });
      ctx.restore();
    }
    // path of the filled part of a Filled image inside (x, y, w, h)
    fillPath(ctx, x, y, w, h, f) {
      ctx.beginPath();
      if (this.fillMethod === 0 || this.fillMethod === 1) {
        const rev = this.fillOrigin === 1;
        if (this.fillMethod === 0) ctx.rect(rev ? x + w * (1 - f) : x, y, w * f, h);
        else ctx.rect(x, rev ? y + h * (1 - f) : y, w, h * f);
        return;
      }
      const cx = x + w / 2, cy = y + h / 2, R = Math.hypot(w, h);
      const cw = this.fillClockwise;
      const start = this.fillMethod === 4 ? [-Math.PI / 2, 0, Math.PI / 2, Math.PI][this.fillOrigin] ?? -Math.PI / 2 : Math.PI / 2;
      const span = (this.fillMethod === 2 ? Math.PI / 2 : this.fillMethod === 3 ? Math.PI : Math.PI * 2) * f;
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, start, cw ? start - span : start + span, cw);
      ctx.closePath();
    }
    // a Mask's stencil is the drawn graphic, so a Filled mask image only reveals its filled part
    clipToDrawn(ctx) {
      if (this.type !== 3 || this.fillAmount >= 1) return;
      const r = this.transform.rect;
      const f = clamp01(this.fillAmount);
      if (f <= 0) {
        ctx.beginPath();
        ctx.rect(0, 0, 0, 0);
        ctx.clip();
        return;
      }
      this.fillPath(ctx, r.x, r.y, r.width, r.height, f);
      ctx.clip();
    }
  };
  register(Image2, "Image");
  var RawImage = class extends Graphic {
    static {
      __name(this, "RawImage");
    }
    deserialize(f) {
      super.deserialize(f);
      this.texture = f.m_Texture;
    }
    renderUI(ctx, alpha) {
      const r = this.transform.rect;
      ctx.globalAlpha = this.color.a * alpha;
      if (this.texture?.img) drawSprite(ctx, this.texture, r.x, r.y, r.width, r.height, { color: this.color });
    }
  };
  register(RawImage, "RawImage");
  var Mask = class extends Component {
    static {
      __name(this, "Mask");
    }
    constructor(go) {
      super(go);
      this.isMask = true;
      this.showMaskGraphic = true;
    }
    deserialize(f) {
      this.showMaskGraphic = !!f.m_ShowMaskGraphic;
    }
    get graphic() {
      return this.gameObject.getComponent(Graphic);
    }
  };
  register(Mask, "Mask");
  var RectMask2D = class extends Component {
    static {
      __name(this, "RectMask2D");
    }
    constructor(go) {
      super(go);
      this.isMask = true;
      this.showMaskGraphic = true;
      this.padding = { x: 0, y: 0, z: 0, w: 0 };
    }
    deserialize(f) {
      this.padding = f.m_Padding || this.padding;
    }
  };
  register(RectMask2D, "RectMask2D");
  var NAMED_COLORS = { red: "#FF0000", white: "#FFFFFF", black: "#000000", green: "#00FF00", blue: "#0000FF", yellow: "#FFFF00", orange: "#FF8000", purple: "#A020F0", lightblue: "#ADD8E6" };
  function parseRich(text, baseColor, baseSize, rich) {
    const out = [];
    const colorStack = [baseColor];
    const sizeStack = [baseSize];
    let bold = 0, upper = 0, lower = 0, alphaOverride = null, nobr = 0, voffset = 0;
    const vStack = [0];
    let i = 0;
    while (i < text.length) {
      const ch = text[i];
      if (rich && ch === "<") {
        const j = text.indexOf(">", i);
        if (j > i) {
          const tag = text.slice(i + 1, j);
          const tl = tag.toLowerCase();
          let handled = true;
          if (tl.startsWith("color=")) {
            let v = tag.slice(6).replace(/["']/g, "");
            v = NAMED_COLORS[v.toLowerCase()] || v;
            colorStack.push(Color.hex(v));
          } else if (tl.startsWith("#")) colorStack.push(Color.hex(tag));
          else if (tl === "/color") {
            if (colorStack.length > 1) colorStack.pop();
          } else if (tl.startsWith("size=")) {
            const v = tag.slice(5).replace(/["']/g, "");
            let s2 = baseSize;
            if (v.endsWith("%")) s2 = sizeStack[sizeStack.length - 1] * parseFloat(v) / 100;
            else if (v.endsWith("em")) s2 = baseSize * parseFloat(v);
            else if (v[0] === "+" || v[0] === "-") s2 = baseSize + parseFloat(v);
            else s2 = parseFloat(v);
            sizeStack.push(s2);
          } else if (tl === "/size") {
            if (sizeStack.length > 1) sizeStack.pop();
          } else if (tl === "b") bold++;
          else if (tl === "/b") bold = Math.max(0, bold - 1);
          else if (tl === "uppercase" || tl === "allcaps") upper++;
          else if (tl === "/uppercase" || tl === "/allcaps") upper = Math.max(0, upper - 1);
          else if (tl === "lowercase") lower++;
          else if (tl === "/lowercase") lower = Math.max(0, lower - 1);
          else if (tl.startsWith("alpha=")) alphaOverride = parseInt(tag.slice(7), 16) / 255;
          else if (tl === "/alpha") alphaOverride = null;
          else if (tl === "br") out.push({ ch: "\n", color: colorStack.at(-1), size: sizeStack.at(-1) });
          else if (tl === "nobr") nobr++;
          else if (tl === "/nobr") nobr = Math.max(0, nobr - 1);
          else if (tl.startsWith("space=")) {
            const v = parseFloat(tag.slice(6));
            const em = /em$/.test(tag);
            out.push({ ch: "\u200B", spaceW: em ? v * sizeStack.at(-1) : v, color: colorStack.at(-1), size: sizeStack.at(-1), nobr: true });
          } else if (tl.startsWith("voffset=")) {
            vStack.push(parseFloat(tag.slice(8)));
          } else if (tl === "/voffset") {
            if (vStack.length > 1) vStack.pop();
          } else if (/^\/?(i|u|s|mark|font|cspace|line-height|align|indent|margin|link|style|sub|sup|smallcaps|space|width|pos|rotate|sprite|material|gradient|wave|shake|bounce|rainb|wiggle|swing|dangle|fade|pend|incr|slide|rot|size|appear|disappear|link|noparse|action|waitfor|speed|wait|\?|\{|#)/.test(tl) || tl.startsWith("sprite") || tl.startsWith("/")) handled = true;
          else handled = /^[a-z\/][\w=#."' %-]*$/i.test(tag) && tag.length < 40 ? true : false;
          if (handled) {
            i = j + 1;
            continue;
          }
        }
      }
      let c = ch;
      if (upper) c = c.toUpperCase();
      else if (lower) c = c.toLowerCase();
      if (ch === "\\" && text[i + 1] === "n") {
        out.push({ ch: "\n", color: colorStack.at(-1), size: sizeStack.at(-1) });
        i += 2;
        continue;
      }
      let col = colorStack.at(-1);
      if (alphaOverride !== null) col = col.withAlpha(alphaOverride);
      out.push({ ch: c, color: col, size: sizeStack.at(-1), bold: bold > 0, nobr: nobr > 0, voff: vStack.at(-1) });
      i++;
    }
    return out;
  }
  __name(parseRich, "parseRich");
  var TextMeshProUGUI = class extends Graphic {
    static {
      __name(this, "TextMeshProUGUI");
    }
    constructor(go) {
      super(go);
      this._text = "";
      this.font = null;
      this.fontSize = 36;
      this.enableAutoSizing = false;
      this.fontSizeMin = 18;
      this.fontSizeMax = 72;
      this.hAlign = 1;
      this.vAlign = 256;
      this.wrapping = 1;
      this.overflowMode = 0;
      this.characterSpacing = 0;
      this.lineSpacing = 0;
      this.wordSpacing = 0;
      this.margin = { x: 0, y: 0, z: 0, w: 0 };
      this.richText = true;
      this.fontStyle = 0;
      this.maxVisibleCharacters = 99999;
      this._layoutCache = null;
      this.paragraphSpacing = 0;
    }
    deserialize(f) {
      super.deserialize(f);
      this._text = f.m_text ?? "";
      this.font = f.m_fontAsset && f.m_fontAsset.chars ? f.m_fontAsset : Assets.fontByKey["sharedassets0.assets:152"];
      this.color = Color.from(f.m_fontColor || f.m_Color);
      this.fontSize = f.m_fontSize ?? 36;
      this.enableAutoSizing = !!f.m_enableAutoSizing;
      this.fontSizeMin = f.m_fontSizeMin ?? 18;
      this.fontSizeMax = f.m_fontSizeMax ?? 72;
      this.hAlign = f.m_HorizontalAlignment ?? 1;
      this.vAlign = f.m_VerticalAlignment ?? 256;
      this.wrapping = f.m_TextWrappingMode ?? (f.m_enableWordWrapping ? 1 : 0);
      this.overflowMode = f.m_overflowMode || 0;
      this.characterSpacing = f.m_characterSpacing || 0;
      this.lineSpacing = f.m_lineSpacing || 0;
      this.wordSpacing = f.m_wordSpacing || 0;
      this.margin = f.m_margin || this.margin;
      this.richText = f.m_isRichText !== 0;
      this.fontStyle = f.m_fontStyle || 0;
      this.paragraphSpacing = f.m_paragraphSpacing || 0;
      this.maxVisibleCharacters = f.m_maxVisibleCharacters ?? 99999;
    }
    get text() {
      return this._text;
    }
    set text(v) {
      v = v == null ? "" : String(v);
      if (v !== this._text) {
        this._text = v;
        this._layoutCache = null;
      }
    }
    setText(v) {
      this.text = v;
    }
    get alignment() {
      return this.hAlign | this.vAlign;
    }
    set alignment(v) {
      this.hAlign = v & 255;
      this.vAlign = v & 65280;
    }
    get textInfo() {
      const l = this._lastLayout;
      return { characterCount: l ? l.count : 0 };
    }
    forceMeshUpdate() {
      this._layoutCache = null;
    }
    _glyph(font, c) {
      const code = c.codePointAt(0);
      let g = font.chars[code];
      if (!g && (this.fontStyle & 16 || true)) {
        const u = c.toUpperCase().codePointAt(0);
        g = font.chars[u] && c !== c.toUpperCase() && !font.chars[code] ? font.chars[u] : g;
      }
      if (g) return { g, font };
      for (const fb of fallbackFonts()) {
        const gg = fb.chars[code];
        if (gg) return { g: gg, font: fb };
      }
      return null;
    }
    // lay out text for a given width and size; returns lines with glyph placements (in text-space, y down from top)
    _layout(size, maxWidth) {
      const font = this.font || Assets.fontByKey["sharedassets0.assets:152"];
      if (!font) return { lines: [], width: 0, height: 0, count: 0 };
      let txt = this._text;
      if (this.fontStyle & 16) txt = txt.toUpperCase();
      else if (this.fontStyle & 8) txt = txt.toLowerCase();
      const runs = parseRich(txt, this.color, size, this.richText);
      const wrap = (this.wrapping === 1 || this.wrapping === 2) && maxWidth > 0;
      const lines = [];
      let line = { glyphs: [], width: 0, maxSize: size };
      let lastBreak = -1;
      let count = 0;
      const lh = /* @__PURE__ */ __name((sz) => font.lineHeight / font.pointSize * sz + this.lineSpacing * 0.01 * sz, "lh");
      const push = /* @__PURE__ */ __name(() => {
        lines.push(line);
        line = { glyphs: [], width: 0, maxSize: size };
        lastBreak = -1;
      }, "push");
      for (let i = 0; i < runs.length; i++) {
        const r = runs[i];
        if (r.ch === "\n") {
          line.newline = true;
          push();
          continue;
        }
        const sc = r.size / font.pointSize;
        const gf = this._glyph(font, r.ch);
        let adv, glyph = null, gfont = font;
        if (r.spaceW !== void 0) {
          adv = r.spaceW;
        } else if (gf) {
          glyph = gf.g;
          gfont = gf.font;
          const s2 = r.size / gfont.pointSize;
          adv = glyph.adv * s2;
        } else adv = r.size * 0.5;
        adv += this.characterSpacing * 0.01 * r.size;
        if (r.ch === " ") adv += this.wordSpacing * 0.01 * r.size;
        if (r.ch === " " || r.ch === "	") lastBreak = line.glyphs.length;
        if (wrap && line.width + adv > maxWidth + 0.01 && r.ch !== " " && line.glyphs.length && !r.nobr) {
          if (lastBreak >= 0) {
            const rest = line.glyphs.splice(lastBreak);
            rest.shift();
            line.width = line.glyphs.reduce((a, g) => a + g.adv, 0);
            push();
            let x = 0;
            for (const g of rest) {
              g.x = x;
              x += g.adv;
              line.glyphs.push(g);
              line.maxSize = Math.max(line.maxSize, g.size);
            }
            line.width = x;
          } else push();
        }
        line.glyphs.push({ ch: r.ch, g: glyph, font: gfont, x: line.width, adv, size: r.size, color: r.color, bold: r.bold, idx: count++, voff: r.voff || 0 });
        line.width += adv;
        line.maxSize = Math.max(line.maxSize, r.size);
      }
      lines.push(line);
      for (const l of lines) {
        let w = l.width;
        for (let k = l.glyphs.length - 1; k >= 0 && l.glyphs[k].ch === " "; k--) w -= l.glyphs[k].adv;
        l.visWidth = w;
        l.height = lh(l.maxSize);
      }
      const width = Math.max(0, ...lines.map((l) => l.visWidth));
      const asc = font.ascent / font.pointSize;
      let height = 0;
      lines.forEach((l, k) => {
        height += k === lines.length - 1 ? (asc - font.descent / font.pointSize) * l.maxSize : l.height + (l.newline ? this.paragraphSpacing * 0.01 * l.maxSize : 0);
      });
      return { lines, width, height, count, font, size };
    }
    _rectInner() {
      const r = this.transform.rect;
      const m = this.margin;
      return { x: r.x + m.x, y: r.y + m.w, width: r.width - m.x - m.z, height: r.height - m.y - m.w };
    }
    _fit() {
      const r = this._rectInner();
      const key = `${this._text}|${r.width.toFixed(2)}|${r.height.toFixed(2)}|${this.fontSize}|${this.enableAutoSizing}|${this.font?.file}|${this.characterSpacing}|${this.fontStyle}|${this.color.rgbKey()}`;
      if (this._layoutCache && this._layoutCache.key === key) return this._layoutCache.lay;
      let lay;
      if (this.enableAutoSizing) {
        let lo = this.fontSizeMin, hi = this.fontSizeMax;
        lay = this._layout(lo, r.width);
        for (let it = 0; it < 12; it++) {
          const mid = (lo + hi) / 2;
          const l = this._layout(mid, r.width);
          const fits = l.height <= r.height + 0.01 && (this.wrapping ? true : l.width <= r.width + 0.01) && l.width <= r.width + 0.5;
          if (fits) {
            lo = mid;
            lay = l;
          } else hi = mid;
        }
        const top = this._layout(this.fontSizeMax, r.width);
        if (top.height <= r.height + 0.01 && top.width <= r.width + 0.5) lay = top;
      } else lay = this._layout(this.fontSize, r.width);
      this._layoutCache = { key, lay };
      this._lastLayout = lay;
      return lay;
    }
    get preferredWidth() {
      return this._layout(this.enableAutoSizing ? this.fontSizeMax : this.fontSize, 0).width + this.margin.x + this.margin.z;
    }
    get preferredHeight() {
      const r = this._rectInner();
      return this._layout(this.enableAutoSizing ? this.fontSizeMax : this.fontSize, r.width).height + this.margin.y + this.margin.w;
    }
    getPreferredValues(t) {
      const l = this._layout(this.fontSize, 0);
      return { x: l.width, y: l.height };
    }
    get renderedWidth() {
      return this._fit().width;
    }
    get renderedHeight() {
      return this._fit().height;
    }
    layoutProps(axis) {
      return { min: 0, pref: axis ? this.preferredHeight : this.preferredWidth, flex: -1, prio: 0 };
    }
    renderUI(ctx, alpha) {
      if (!this._text) return;
      const lay = this._fit();
      const font = lay.font;
      if (!font) return;
      const r = this._rectInner();
      const asc = font.ascent / font.pointSize;
      let top;
      const totalH = lay.height;
      if (this.vAlign & 256) top = r.y + r.height;
      else if (this.vAlign & 1024) top = r.y + totalH;
      else top = r.y + r.height / 2 + totalH / 2;
      if (this.vAlign & 2048) top = r.y + r.height / 2 + asc * lay.size;
      let baseY = top - asc * (lay.lines[0]?.maxSize || lay.size);
      const a0 = alpha;
      ctx.save();
      if (this.overflowMode === 2 || this.overflowMode === 3) {
        ctx.beginPath();
        ctx.rect(r.x, r.y, r.width, r.height);
        ctx.clip();
      }
      lay.lines.forEach((line, li) => {
        let x0;
        const hj = this.hAlign;
        if (hj & 2 || hj & 32) x0 = r.x + (r.width - line.visWidth) / 2;
        else if (hj & 4) x0 = r.x + r.width - line.visWidth;
        else x0 = r.x;
        for (const g of line.glyphs) {
          if (g.idx >= this.maxVisibleCharacters) break;
          if (!g.g || g.g.w === 0) {
            if (!g.g && g.ch.trim() && g.ch !== "\u200B") {
              ctx.save();
              ctx.translate(x0 + g.x, baseY);
              ctx.scale(1, -1);
              ctx.globalAlpha = g.color.a * a0 * this.color.a / (this.color.a || 1);
              ctx.fillStyle = g.color.css();
              ctx.font = `${g.size}px sans-serif`;
              ctx.fillText(g.ch, 0, 0);
              ctx.restore();
            }
            continue;
          }
          const gf = g.font;
          const s2 = g.size / gf.pointSize;
          const gl = g.g;
          const img = tinted(gf.img, g.color, "font:" + gf.file);
          const pad = 0;
          const dx = x0 + g.x + gl.bx * s2, dy = baseY + g.voff * 0.01 * g.size + gl.by * s2;
          const sy = gf.ah - gl.y - gl.h;
          ctx.globalAlpha = clamp01(g.color.a * a0);
          ctx.save();
          ctx.translate(dx, dy);
          ctx.scale(1, -1);
          ctx.drawImage(img, gl.x - pad, sy - pad, gl.w + pad * 2, gl.h + pad * 2, 0, 0, gl.w * s2, gl.h * s2);
          if (g.bold) ctx.drawImage(img, gl.x, sy, gl.w, gl.h, s2 * 0.6, 0, gl.w * s2, gl.h * s2);
          ctx.restore();
        }
        const next = lay.lines[li + 1];
        if (next) baseY -= Math.max(line.height, font.lineHeight / font.pointSize * next.maxSize) + (line.newline ? this.paragraphSpacing * 0.01 * line.maxSize : 0);
      });
      ctx.restore();
    }
  };
  register(TextMeshProUGUI, "TextMeshProUGUI");
  register(class TextMeshPro extends TextMeshProUGUI {
    static {
      __name(this, "TextMeshPro");
    }
  }, "TextMeshPro");
  var _fallbacks = null;
  function fallbackFonts() {
    if (!_fallbacks) _fallbacks = ["NotoSans-Bold_SDF", "NotoSans-Bold_SDF_Latin_Extended", "NotoSans-Bold_SDF_Cyrillic", "LiberationSans_SDF", "NotoSansJP-Bold_SDF", "NotoSansKR-Bold_SDF", "NotoSansSC-Bold_SDF", "NotoSansTC-Bold_SDF"].map((n) => Assets.fonts[n]).filter(Boolean);
    return _fallbacks;
  }
  __name(fallbackFonts, "fallbackFonts");
  var Text = class extends Graphic {
    static {
      __name(this, "Text");
    }
    deserialize(f) {
      super.deserialize(f);
      this.text = f.m_Text || "";
      this.fontSize = f.m_FontData?.m_FontSize || 14;
      this.alignment = f.m_FontData?.m_Alignment || 0;
    }
    layoutProps(axis) {
      return { min: 0, pref: axis ? this.fontSize * 1.2 : this.text.length * this.fontSize * 0.55, flex: -1, prio: 0 };
    }
    renderUI(ctx, alpha) {
      if (!this.text) return;
      const r = this.transform.rect;
      ctx.globalAlpha = this.color.a * alpha;
      ctx.fillStyle = this.color.css(1);
      ctx.save();
      ctx.translate(r.x, r.y + r.height);
      ctx.scale(1, -1);
      ctx.font = `${this.fontSize}px sans-serif`;
      ctx.textBaseline = "top";
      const col = this.alignment % 3;
      ctx.textAlign = ["left", "center", "right"][col];
      ctx.fillText(this.text, col === 0 ? 0 : col === 1 ? r.width / 2 : r.width, 0);
      ctx.restore();
    }
  };
  register(Text, "Text");
  var LayoutElement = class extends Component {
    static {
      __name(this, "LayoutElement");
    }
    deserialize(f) {
      this.ignoreLayout = !!f.m_IgnoreLayout;
      this.minWidth = f.m_MinWidth;
      this.minHeight = f.m_MinHeight;
      this.preferredWidth = f.m_PreferredWidth;
      this.preferredHeight = f.m_PreferredHeight;
      this.flexibleWidth = f.m_FlexibleWidth;
      this.flexibleHeight = f.m_FlexibleHeight;
      this.layoutPriority = f.m_LayoutPriority ?? 1;
    }
    layoutProps(axis) {
      return axis ? { min: this.minHeight, pref: this.preferredHeight, flex: this.flexibleHeight, prio: this.layoutPriority } : { min: this.minWidth, pref: this.preferredWidth, flex: this.flexibleWidth, prio: this.layoutPriority };
    }
  };
  register(LayoutElement, "LayoutElement");
  var LayoutGroup = class extends Component {
    static {
      __name(this, "LayoutGroup");
    }
    constructor(go) {
      super(go);
      this.padding = { m_Left: 0, m_Right: 0, m_Top: 0, m_Bottom: 0 };
      this.childAlignment = 0;
      this._calc = [{}, {}];
    }
    deserialize(f) {
      Object.assign(this, f);
      this.padding = f.m_Padding;
      this.childAlignment = f.m_ChildAlignment || 0;
      this.spacing = f.m_Spacing;
    }
    get rectChildren() {
      return this.transform.children.filter((t) => t.isRect && t.gameObject.activeSelf && !t.gameObject.getComponents(LayoutElement).some((l) => l.enabled && l.ignoreLayout));
    }
    layoutProps(axis) {
      const c = this._calc[axis];
      return { min: c.min ?? 0, pref: c.pref ?? 0, flex: c.flex ?? 0, prio: 0 };
    }
    startOffset(axis, required) {
      const pad = this.padding;
      const size = axis ? this.transform.rectSize.y : this.transform.rectSize.x;
      const req = required + (axis ? pad.m_Top + pad.m_Bottom : pad.m_Left + pad.m_Right);
      const surplus = size - req;
      const align = axis ? Math.floor(this.childAlignment / 3) * 0.5 : this.childAlignment % 3 * 0.5;
      return (axis ? pad.m_Top : pad.m_Left) + surplus * align;
    }
    static setChildAlongAxis(rt, axis, pos, size, scaleFactor = 1) {
      rt.anchorMin = axis ? { x: rt.anchorMin.x, y: 1 } : { x: 0, y: rt.anchorMin.y };
      rt.anchorMax = axis ? { x: rt.anchorMax.x, y: 1 } : { x: 0, y: rt.anchorMax.y };
      rt.anchorMin = { x: 0, y: 1 };
      rt.anchorMax = { x: 0, y: 1 };
      const sd = { ...rt.sizeDelta };
      if (size !== void 0) {
        if (axis) sd.y = size;
        else sd.x = size;
      }
      rt.sizeDelta = sd;
      const s2 = axis ? sd.y : sd.x;
      const sc = scaleFactor;
      const ap = { ...rt.anchoredPosition };
      if (axis) ap.y = -pos - s2 * (1 - rt.pivot.y) * sc;
      else ap.x = pos + s2 * rt.pivot.x * sc;
      rt.anchoredPosition = ap;
    }
  };
  var HorizontalOrVerticalLayoutGroup = class extends LayoutGroup {
    static {
      __name(this, "HorizontalOrVerticalLayoutGroup");
    }
    get isVertical() {
      return false;
    }
    childSizes(child, axis, control, expand) {
      let min, pref, flex;
      if (!control) {
        min = axis ? child.sizeDelta.y : child.sizeDelta.x;
        pref = min;
        flex = 0;
      } else {
        min = Layout.get(child, axis, "min");
        pref = Layout.get(child, axis, "pref");
        flex = Layout.get(child, axis, "flex");
      }
      if (expand) flex = Math.max(flex, 1);
      return { min, pref, flex };
    }
    calcAlongAxis(axis, isVertical) {
      const pad = this.padding;
      const combinedPad = axis ? pad.m_Top + pad.m_Bottom : pad.m_Left + pad.m_Right;
      const control = axis ? this.m_ChildControlHeight : this.m_ChildControlWidth;
      const expand = axis ? this.m_ChildForceExpandHeight : this.m_ChildForceExpandWidth;
      let tmin = combinedPad, tpref = combinedPad, tflex = 0;
      const along = isVertical ^ axis === 1;
      const kids = this.rectChildren;
      const useScale = axis ? this.m_ChildScaleHeight : this.m_ChildScaleWidth;
      for (let i = 0; i < kids.length; i++) {
        const s2 = this.childSizes(kids[i], axis, control, expand);
        if (useScale) {
          const k = axis ? kids[i].localScale.y : kids[i].localScale.x;
          s2.min *= k;
          s2.pref *= k;
          s2.flex *= k;
        }
        if (along) {
          tmin = Math.max(s2.min + combinedPad, tmin);
          tpref = Math.max(s2.pref + combinedPad, tpref);
          tflex = Math.max(s2.flex, tflex);
        } else {
          tmin += s2.min + this.spacing;
          tpref += s2.pref + this.spacing;
          tflex += s2.flex;
        }
      }
      if (!along && kids.length > 0) {
        tmin -= this.spacing;
        tpref -= this.spacing;
      }
      tpref = Math.max(tmin, tpref);
      this._calc[axis] = { min: tmin, pref: tpref, flex: tflex };
    }
    setChildrenAlongAxis(axis, isVertical) {
      const size = axis ? this.transform.rectSize.y : this.transform.rectSize.x;
      const control = axis ? this.m_ChildControlHeight : this.m_ChildControlWidth;
      const expand = axis ? this.m_ChildForceExpandHeight : this.m_ChildForceExpandWidth;
      const alignOnAxis = axis ? Math.floor(this.childAlignment / 3) * 0.5 : this.childAlignment % 3 * 0.5;
      const along = isVertical ^ axis === 1;
      const pad = this.padding;
      let kids = this.rectChildren;
      if (this.m_ReverseArrangement) kids = [...kids].reverse();
      const useScale = axis ? this.m_ChildScaleHeight : this.m_ChildScaleWidth;
      const scaleOf = /* @__PURE__ */ __name((ch) => useScale ? axis ? ch.localScale.y : ch.localScale.x : 1, "scaleOf");
      if (along) {
        const inner = size - (axis ? pad.m_Top + pad.m_Bottom : pad.m_Left + pad.m_Right);
        for (const ch of kids) {
          const s2 = this.childSizes(ch, axis, control, expand);
          const req = clamp(inner, s2.min, s2.flex > 0 ? size : s2.pref);
          const k = scaleOf(ch);
          const start = this.startOffset(axis, req * k);
          if (control) LayoutGroup.setChildAlongAxis(ch, axis, start, req, k);
          else {
            const off = (req - (axis ? ch.sizeDelta.y : ch.sizeDelta.x)) * alignOnAxis;
            LayoutGroup.setChildAlongAxis(ch, axis, start + off, void 0, k);
          }
        }
      } else {
        let pos = axis ? pad.m_Top : pad.m_Left;
        let flexMul = 0;
        const c = this._calc[axis];
        const surplus = size - c.pref;
        if (surplus > 0) {
          if (c.flex === 0) pos = this.startOffset(axis, c.pref - (axis ? pad.m_Top + pad.m_Bottom : pad.m_Left + pad.m_Right));
          else if (c.flex > 0) flexMul = surplus / c.flex;
        }
        const minMaxLerp = c.min === c.pref ? 0 : clamp01((size - c.min) / (c.pref - c.min));
        for (const ch of kids) {
          const s2 = this.childSizes(ch, axis, control, expand);
          const childSize = lerp(s2.min, s2.pref, minMaxLerp) + s2.flex * flexMul;
          const k = scaleOf(ch);
          if (control) LayoutGroup.setChildAlongAxis(ch, axis, pos, childSize, k);
          else {
            const off = (childSize - (axis ? ch.sizeDelta.y : ch.sizeDelta.x)) * alignOnAxis;
            LayoutGroup.setChildAlongAxis(ch, axis, pos + off, void 0, k);
          }
          pos += childSize * k + this.spacing;
        }
      }
    }
    calc(axis) {
      this.calcAlongAxis(axis, this.isVertical);
    }
    apply(axis) {
      this.setChildrenAlongAxis(axis, this.isVertical);
    }
  };
  var HorizontalLayoutGroup = class extends HorizontalOrVerticalLayoutGroup {
    static {
      __name(this, "HorizontalLayoutGroup");
    }
    get isVertical() {
      return false;
    }
  };
  var VerticalLayoutGroup = class extends HorizontalOrVerticalLayoutGroup {
    static {
      __name(this, "VerticalLayoutGroup");
    }
    get isVertical() {
      return true;
    }
  };
  register(HorizontalLayoutGroup, "HorizontalLayoutGroup");
  register(VerticalLayoutGroup, "VerticalLayoutGroup");
  var GridLayoutGroup = class extends LayoutGroup {
    static {
      __name(this, "GridLayoutGroup");
    }
    deserialize(f) {
      super.deserialize(f);
      this.cellSize = f.m_CellSize;
      this.spacing = f.m_Spacing;
      this.startCorner = f.m_StartCorner;
      this.startAxis = f.m_StartAxis;
      this.constraint = f.m_Constraint;
      this.constraintCount = f.m_ConstraintCount;
    }
    cols(width) {
      const n = this.rectChildren.length;
      const pad = this.padding;
      if (this.constraint === 1) return this.constraintCount;
      if (this.constraint === 2) return Math.ceil(n / this.constraintCount);
      return Math.max(1, Math.floor((width - pad.m_Left - pad.m_Right + this.spacing.x + 1e-3) / (this.cellSize.x + this.spacing.x)));
    }
    calc(axis) {
      const pad = this.padding;
      const n = this.rectChildren.length;
      if (axis === 0) {
        let minC = 1, prefC = Math.ceil(Math.sqrt(n));
        if (this.constraint === 1) minC = prefC = this.constraintCount;
        else if (this.constraint === 2) minC = prefC = Math.ceil(n / this.constraintCount - 1e-3);
        this._calc[0] = { min: pad.m_Left + pad.m_Right + (this.cellSize.x + this.spacing.x) * minC - this.spacing.x, pref: pad.m_Left + pad.m_Right + (this.cellSize.x + this.spacing.x) * prefC - this.spacing.x, flex: -1 };
      } else {
        const cols = this.cols(this.transform.rectSize.x);
        const rows = Math.ceil(n / cols);
        const h = pad.m_Top + pad.m_Bottom + (this.cellSize.y + this.spacing.y) * rows - this.spacing.y;
        this._calc[1] = { min: h, pref: h, flex: -1 };
      }
    }
    apply(axis) {
      if (axis === 0) return;
      const kids = this.rectChildren;
      const size = this.transform.rectSize;
      const pad = this.padding;
      const cols = Math.min(this.cols(size.x), Math.max(1, kids.length));
      const rows = Math.ceil(kids.length / cols);
      const reqW = cols * this.cellSize.x + (cols - 1) * this.spacing.x, reqH = rows * this.cellSize.y + (rows - 1) * this.spacing.y;
      const sx = this.startOffset(0, reqW), sy = this.startOffset(1, reqH);
      kids.forEach((ch, i) => {
        let c = this.startAxis === 0 ? i % cols : Math.floor(i / rows), r = this.startAxis === 0 ? Math.floor(i / cols) : i % rows;
        if (this.startCorner % 2 === 1) c = cols - 1 - c;
        if (this.startCorner >= 2) r = rows - 1 - r;
        LayoutGroup.setChildAlongAxis(ch, 0, sx + (this.cellSize.x + this.spacing.x) * c, this.cellSize.x);
        LayoutGroup.setChildAlongAxis(ch, 1, sy + (this.cellSize.y + this.spacing.y) * r, this.cellSize.y);
      });
    }
  };
  register(GridLayoutGroup, "GridLayoutGroup");
  var ContentSizeFitter = class extends Component {
    static {
      __name(this, "ContentSizeFitter");
    }
    deserialize(f) {
      this.horizontalFit = f.m_HorizontalFit || 0;
      this.verticalFit = f.m_VerticalFit || 0;
    }
    apply(axis) {
      const fit = axis ? this.verticalFit : this.horizontalFit;
      if (!fit) return;
      const v = fit === 1 ? Layout.get(this.transform, axis, "min") : Layout.get(this.transform, axis, "pref");
      this.transform.setSizeWithCurrentAnchors(axis, v);
    }
  };
  register(ContentSizeFitter, "ContentSizeFitter");
  var AspectRatioFitter = class extends Component {
    static {
      __name(this, "AspectRatioFitter");
    }
    deserialize(f) {
      this.aspectMode = f.m_AspectMode;
      this.aspectRatio = f.m_AspectRatio;
    }
  };
  register(AspectRatioFitter, "AspectRatioFitter");
  var Layout = {
    // LayoutUtility.GetMinSize / GetPreferredSize / GetFlexibleSize
    get(rt, axis, prop) {
      let best = prop === "flex" ? 0 : 0, bestPrio = -Infinity, found = false;
      let minV = 0;
      for (const c of rt.gameObject.components) {
        if (!c.enabled || !c.layoutProps) continue;
        if (c instanceof LayoutElement && c.ignoreLayout) continue;
        const p = c.layoutProps(axis);
        const v = prop === "min" ? p.min : prop === "pref" ? p.pref : p.flex;
        if (v === void 0 || v < 0) continue;
        if (p.prio > bestPrio) {
          best = v;
          bestPrio = p.prio;
          found = true;
        } else if (p.prio === bestPrio && v > best) best = v;
      }
      if (prop === "pref") {
        minV = Layout.get(rt, axis, "min");
        return Math.max(minV, found ? best : 0);
      }
      return found ? best : 0;
    },
    // Full layout pass for a canvas subtree.
    run(rootGo) {
      for (const axis of [0, 1]) {
        const calcRec = /* @__PURE__ */ __name((tr) => {
          if (!tr.gameObject.activeSelf) return;
          for (const ch of tr.children) calcRec(ch);
          for (const c of tr.gameObject.components) if (c.enabled && c.calc) c.calc(axis);
        }, "calcRec");
        calcRec(rootGo.transform);
        const applyRec = /* @__PURE__ */ __name((tr) => {
          if (!tr.gameObject.activeSelf) return;
          for (const c of tr.gameObject.components) if (c.enabled && c instanceof ContentSizeFitter) c.apply(axis);
          for (const c of tr.gameObject.components) if (c.enabled && c.apply && !(c instanceof ContentSizeFitter)) c.apply(axis);
          for (const ch of tr.children) applyRec(ch);
        }, "applyRec");
        applyRec(rootGo.transform);
      }
      const pos = /* @__PURE__ */ __name((tr) => {
        if (!tr.gameObject.activeSelf) return;
        if (tr.isRect) tr.updateFromAnchors();
        for (const ch of tr.children) pos(ch);
      }, "pos");
      pos(rootGo.transform);
    }
  };
  UI.layout = (go) => Layout.run(go);

  // web/src/engine/input.js
  var Input = {
    mousePosition: { x: 0, y: 0, z: 0 },
    _down: /* @__PURE__ */ new Set(),
    _held: /* @__PURE__ */ new Set(),
    _up: /* @__PURE__ */ new Set(),
    keysDown: /* @__PURE__ */ new Set(),
    keysHeld: /* @__PURE__ */ new Set(),
    keysUp: /* @__PURE__ */ new Set(),
    mouseScrollDelta: { x: 0, y: 0 },
    touchCount: 0,
    anyKeyDown: false,
    _wheel: 0,
    pointerType: "mouse",
    pointerOverCanvas: false,
    mouseDelta: { x: 0, y: 0 },
    _lastMouse: null,
    getMouseButtonDown(b) {
      return this._down.has(b);
    },
    getMouseButton(b) {
      return this._held.has(b);
    },
    getMouseButtonUp(b) {
      return this._up.has(b);
    },
    getKeyDown(k) {
      return this.keysDown.has(k.toLowerCase());
    },
    getKey(k) {
      return this.keysHeld.has(k.toLowerCase());
    },
    getKeyUp(k) {
      return this.keysUp.has(k.toLowerCase());
    },
    init(canvas2) {
      const pos = /* @__PURE__ */ __name((e) => {
        const r = canvas2.getBoundingClientRect();
        this.mousePosition = { x: (e.clientX - r.left) * Renderer.dpr, y: (r.bottom - e.clientY) * Renderer.dpr, z: 0 };
      }, "pos");
      canvas2.addEventListener("pointerdown", (e) => {
        canvas2.setPointerCapture(e.pointerId);
        pos(e);
        this.pointerType = e.pointerType;
        const b = e.button === 2 ? 1 : e.button === 1 ? 2 : 0;
        this._down.add(b);
        this._held.add(b);
        this.anyKeyDown = true;
        Audio_unlock();
        e.preventDefault();
      });
      canvas2.addEventListener("pointermove", (e) => {
        pos(e);
        this.pointerType = e.pointerType;
      });
      if ("onpointerrawupdate" in canvas2) canvas2.addEventListener("pointerrawupdate", (e) => pos(e));
      const up = /* @__PURE__ */ __name((e) => {
        pos(e);
        const b = e.button === 2 ? 1 : e.button === 1 ? 2 : 0;
        if (this._down.has(b) || this._pendingDown?.has(b)) {
          (this._pendingUp ||= /* @__PURE__ */ new Set()).add(b);
          return;
        }
        this._up.add(b);
        this._held.delete(b);
      }, "up");
      canvas2.addEventListener("pointerup", up);
      canvas2.addEventListener("pointercancel", up);
      canvas2.addEventListener("contextmenu", (e) => e.preventDefault());
      canvas2.addEventListener("wheel", (e) => {
        this._wheel += -Math.sign(e.deltaY);
        e.preventDefault();
      }, { passive: false });
      window.addEventListener("keydown", (e) => {
        const k = keyName(e);
        if (!this.keysHeld.has(k)) this.keysDown.add(k);
        this.keysHeld.add(k);
        this.anyKeyDown = true;
        Audio_unlock();
        if (k === "space" || k === "tab") e.preventDefault();
      });
      window.addEventListener("keyup", (e) => {
        const k = keyName(e);
        this.keysHeld.delete(k);
        this.keysUp.add(k);
      });
      window.addEventListener("blur", () => {
        this._held.clear();
        this.keysHeld.clear();
      });
    },
    // called at end of frame
    endFrame() {
      this._down.clear();
      this._up.clear();
      this.keysDown.clear();
      this.keysUp.clear();
      this.anyKeyDown = false;
      this.mouseScrollDelta = { x: 0, y: 0 };
    },
    beginFrame() {
      {
        const m = this.mousePosition;
        const l = this._lastMouse || m;
        this.mouseDelta = { x: m.x - l.x, y: m.y - l.y };
        this._lastMouse = { ...m };
      }
      if (this._deferUp) {
        for (const b of this._deferUp) {
          this._up.add(b);
          this._held.delete(b);
        }
        this._deferUp = null;
      }
      if (this._pendingUp?.size) {
        this._deferUp = this._pendingUp;
        this._pendingUp = null;
      }
      this.mouseScrollDelta = { x: 0, y: this._wheel };
      this._wheel = 0;
      this.touchCount = this._held.size && this.pointerType === "touch" ? 1 : 0;
    }
  };
  function keyName(e) {
    const m = { " ": "space", Escape: "escape", Enter: "return", Tab: "tab", Shift: "left shift", Control: "left ctrl", ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", Backspace: "backspace" };
    return (m[e.key] || e.key).toLowerCase();
  }
  __name(keyName, "keyName");
  var audioUnlock = null;
  function onAudioUnlock(fn) {
    audioUnlock = fn;
  }
  __name(onAudioUnlock, "onAudioUnlock");
  function Audio_unlock() {
    audioUnlock?.();
  }
  __name(Audio_unlock, "Audio_unlock");
  var UnityEvent = class _UnityEvent2 {
    static {
      __name(this, "UnityEvent");
    }
    constructor(data) {
      if (data instanceof _UnityEvent2) {
        this.listeners = data.listeners;
        this.persistent = data.persistent;
        return;
      }
      this.listeners = [];
      this.persistent = (data?.m_PersistentCalls?.m_Calls || []).filter((c) => c.m_Target && c.m_MethodName);
    }
    addListener(fn) {
      this.listeners.push(fn);
    }
    removeListener(fn) {
      const i = this.listeners.indexOf(fn);
      if (i >= 0) this.listeners.splice(i, 1);
    }
    removeAllListeners() {
      this.listeners = [];
    }
    invoke(...args) {
      for (const c of this.persistent) {
        if (c.m_CallState === 0) continue;
        let t = c.m_Target;
        if (!t || t.unresolved) continue;
        const name = c.m_MethodName;
        const lower = name[0].toLowerCase() + name.slice(1);
        const a = c.m_Arguments || {};
        let arg = args;
        switch (c.m_Mode) {
          // 1 void,2 object,3 int,4 float,5 string,6 bool
          case 1:
            arg = [];
            break;
          case 2:
            arg = [a.m_ObjectArgument];
            break;
          case 3:
            arg = [a.m_IntArgument];
            break;
          case 4:
            arg = [a.m_FloatArgument];
            break;
          case 5:
            arg = [a.m_StringArgument];
            break;
          case 6:
            arg = [!!a.m_BoolArgument];
            break;
          default:
            break;
        }
        try {
          if (name === "SetActive" && t.setActive) t.setActive(arg[0]);
          else if (name === "set_enabled" && "enabled" in t) t.setEnabled ? t.setEnabled(arg[0]) : t.enabled = arg[0];
          else if (name.startsWith("set_")) {
            const p = name.slice(4);
            t[p] = arg[0];
          } else if (typeof t[lower] === "function") t[lower](...arg);
          else if (typeof t[name] === "function") t[name](...arg);
          else console.warn("UnityEvent: missing method", name, "on", t.toString?.());
        } catch (e) {
          console.error("UnityEvent", name, e);
        }
      }
      for (const l of [...this.listeners]) {
        try {
          l(...args);
        } catch (e) {
          console.error(e);
        }
      }
    }
  };
  var EventSystem = {
    hovered: [],
    pressed: null,
    dragTarget: null,
    pressPos: null,
    dragging: false,
    current: null,
    selected: null,
    lastRaycast: [],
    isPointerOverGameObject() {
      return this.lastRaycast.length > 0;
    },
    // Raycast UI graphics from top-most canvas downwards; returns list of GameObjects.
    raycast(screen) {
      const hits = [];
      const canvases = [];
      for (const go of Game.allGameObjects(false)) {
        const cv = go.getComponent(Canvas);
        if (cv && cv.enabled && (cv.isRootCanvas || cv.overrideSorting) && go.getComponent("GraphicRaycaster")?.enabled !== false) canvases.push(cv);
      }
      canvases.sort((a, b) => (a.renderMode === 2) - (b.renderMode === 2) || b.sortingOrder - a.sortingOrder);
      for (const cv of canvases) {
        const H = Renderer.height;
        let pt;
        if (cv.renderMode === 2) {
          const cam = Camera.main;
          if (!cam) continue;
          pt = cam.screenToWorldPoint(screen);
        } else pt = { x: screen.x, y: screen.y };
        const list = [];
        const walk = /* @__PURE__ */ __name((go, blocks) => {
          if (!go.activeSelf) return;
          const cg = go.getComponent(CanvasGroup);
          if (cg && cg.enabled) {
            if (!cg.blocksRaycasts) blocks = false;
            if (cg.ignoreParentGroups) blocks = cg.blocksRaycasts;
          }
          if (!blocks) return;
          const tr = go.transform;
          const mask = go.components.find((c) => c.isMask && c.enabled);
          if (mask && tr.isRect && !tr.containsWorldPoint(pt.x, pt.y)) return;
          for (const c of go.components) {
            if (c instanceof Graphic && c.enabled && c.raycastTarget && tr.isRect && tr.containsWorldPoint(pt.x, pt.y, c.raycastPadding)) {
              if (c.color.a <= 0 && !(c instanceof Image2)) continue;
              list.push({ go, depth: list.length });
            }
          }
          for (const ch of tr.children) {
            const sub = ch.gameObject.getComponent(Canvas);
            if (sub && sub !== cv && sub.overrideSorting) continue;
            walk(ch.gameObject, blocks);
          }
        }, "walk");
        walk(cv.gameObject, true);
        if (list.length) {
          hits.push(...list.reverse().map((x) => x.go));
        }
        if (hits.length && cv.renderMode !== 2) break;
        if (hits.length) break;
      }
      return hits;
    },
    // ExecuteEvents semantics: every enabled handler on the first GameObject (walking up) that has one
    fire(go, method, ev) {
      const h = this.find(go, method);
      if (!h) return null;
      for (const c of [...h.gameObject.components]) if (c.enabled && !c._destroyed && typeof c[method] === "function") c[method](ev);
      return h.gameObject;
    },
    find(go, method) {
      for (let t = go?.transform; t; t = t.parent) for (const c of t.gameObject.components) if (c.enabled && typeof c[method] === "function" && !c._destroyed) return c;
      return null;
    },
    update() {
      const screen = Input.mousePosition;
      const hits = this.raycast(screen);
      this.lastRaycast = hits;
      const top = hits[0] || null;
      const ev = { position: { ...screen }, button: 0, delta: { x: 0, y: 0 }, pointerCurrentRaycast: { gameObject: top }, pressPosition: this.pressPos, clickCount: 1, used: false, pointerId: -1 };
      const chain = [];
      for (let t = top?.transform; t; t = t.parent) chain.push(t.gameObject);
      for (const g of this.hovered) if (!chain.includes(g)) {
        for (const c of g.components) if (c.enabled && c.onPointerExit) c.onPointerExit(ev);
      }
      for (const g of chain) if (!this.hovered.includes(g)) {
        for (const c of g.components) if (c.enabled && c.onPointerEnter) c.onPointerEnter(ev);
      }
      this.hovered = chain;
      if (Input.getMouseButtonDown(0)) {
        this.pressPos = { ...screen };
        ev.pressPosition = this.pressPos;
        const h = this.fire(top, "onPointerDown", ev);
        this.pressed = this.find(top, "onPointerClick")?.gameObject || h;
        this.pressRaw = top;
        this.dragTarget = this.find(top, "onDrag") || this.find(top, "onBeginDrag");
        this.dragging = false;
        this.find(top, "onInitializePotentialDrag")?.onInitializePotentialDrag?.(ev);
        this.lastPos = { ...screen };
      }
      if (Input.getMouseButton(0) && this.dragTarget) {
        ev.delta = { x: screen.x - this.lastPos.x, y: screen.y - this.lastPos.y };
        if (!this.dragging && Math.hypot(screen.x - this.pressPos.x, screen.y - this.pressPos.y) > 10 * Renderer.dpr) {
          this.dragging = true;
          this.dragTarget.onBeginDrag?.(ev);
        }
        if (this.dragging) this.dragTarget.onDrag?.(ev);
      }
      this.lastPos = { ...screen };
      if (Input.getMouseButtonUp(0)) {
        this.fire(this.pressRaw, "onPointerUp", ev);
        const clickGo = this.find(top, "onPointerClick")?.gameObject;
        if (this.pressed && clickGo === this.pressed && !this.dragging) this.fire(top, "onPointerClick", ev);
        if (this.dragging) {
          this.dragTarget?.onEndDrag?.(ev);
          this.find(top, "onDrop")?.onDrop?.(ev);
        }
        this.pressed = null;
        this.dragTarget = null;
        this.dragging = false;
        this.pressRaw = null;
      }
      if (Input.mouseScrollDelta.y && top) {
        const s2 = this.find(top, "onScroll");
        s2?.onScroll({ ...ev, scrollDelta: { x: 0, y: Input.mouseScrollDelta.y } });
      }
    },
    setSelectedGameObject(go) {
      this.selected = go;
    },
    get currentSelectedGameObject() {
      return this.selected;
    }
  };
  register(class EventSystemC extends Component {
    static {
      __name(this, "EventSystemC");
    }
    static get current() {
      return EventSystem;
    }
  }, "EventSystem");
  register(class GraphicRaycaster extends Component {
    static {
      __name(this, "GraphicRaycaster");
    }
  }, "GraphicRaycaster");
  register(class InputSystemUIInputModule extends Component {
    static {
      __name(this, "InputSystemUIInputModule");
    }
  }, "InputSystemUIInputModule");
  var Selectable = class extends Component {
    static {
      __name(this, "Selectable");
    }
    constructor(go) {
      super(go);
      this.interactable = true;
      this.transition = 1;
      this.state = "normal";
      this._hover = false;
      this._press = false;
    }
    deserialize(f) {
      this.interactable = f.m_Interactable !== 0;
      this.transition = f.m_Transition ?? 1;
      this.colors = f.m_Colors;
      this.spriteState = f.m_SpriteState;
      this.targetGraphic = f.m_TargetGraphic && !f.m_TargetGraphic.unresolved ? f.m_TargetGraphic : null;
    }
    start() {
      this._baseSprite = this.targetGraphic?.sprite;
    }
    get isInteractable() {
      if (!this.interactable) return false;
      for (let t = this.transform; t; t = t.parent) {
        const cg = t.gameObject.getComponent(CanvasGroup);
        if (cg && cg.enabled) {
          if (!cg.interactable) return false;
          if (cg.ignoreParentGroups) break;
        }
      }
      return true;
    }
    IsInteractable() {
      return this.isInteractable;
    }
    onPointerEnter() {
      this._hover = true;
    }
    onPointerExit() {
      this._hover = false;
      this._press = false;
    }
    onPointerDown() {
      if (this.isInteractable) this._press = true;
    }
    onPointerUp() {
      this._press = false;
    }
    onDisable() {
      this._hover = this._press = false;
      this.applyVisual(true);
    }
    lateUpdate() {
      this.applyVisual();
    }
    applyVisual(force) {
      const g = this.targetGraphic;
      if (!g) return;
      const st = !this.isInteractable ? "disabled" : this._press ? "pressed" : this._hover && Input.pointerType === "mouse" ? "highlighted" : "normal";
      if (st === this.state && !force) return;
      this.state = st;
      if (this.transition === 1 && this.colors) {
        const c = Color.from({ normal: this.colors.m_NormalColor, highlighted: this.colors.m_HighlightedColor, pressed: this.colors.m_PressedColor, disabled: this.colors.m_DisabledColor }[st]);
        const m = this.colors.m_ColorMultiplier || 1;
        g._tint = new Color(Math.min(1, c.r * m), Math.min(1, c.g * m), Math.min(1, c.b * m), Math.min(1, c.a * m));
      } else if (this.transition === 2 && this.spriteState && g instanceof Image2) {
        const sp = { highlighted: this.spriteState.m_HighlightedSprite, pressed: this.spriteState.m_PressedSprite, disabled: this.spriteState.m_DisabledSprite }[st];
        g.overrideSprite = sp || null;
      }
    }
  };
  var origRenderImage = Image2.prototype.renderUI;
  for (const Cls of [Image2]) {
    const orig = Cls.prototype.renderUI;
    Cls.prototype.renderUI = function(ctx, alpha) {
      if (!this._tint || this._tint.isWhiteRGB() && this._tint.a >= 1) return orig.call(this, ctx, alpha);
      const c = this.color;
      this.color = c.mul(this._tint);
      try {
        orig.call(this, ctx, alpha);
      } finally {
        this.color = c;
      }
    };
  }
  var Button = class extends Selectable {
    static {
      __name(this, "Button");
    }
    deserialize(f) {
      super.deserialize(f);
      this.onClick = new UnityEvent(f.m_OnClick);
    }
    onPointerClick(ev) {
      if (!this.activeAndEnabled || !this.isInteractable) return;
      this.onClick.invoke();
    }
    onPointerDown(ev) {
      super.onPointerDown(ev);
    }
  };
  register(Button, "Button");
  var Toggle = class extends Selectable {
    static {
      __name(this, "Toggle");
    }
    deserialize(f) {
      super.deserialize(f);
      this._isOn = !!f.m_IsOn;
      this.graphic = f.graphic;
      this.group = f.m_Group;
      this.onValueChanged = new UnityEvent(f.onValueChanged);
    }
    start() {
      super.start();
      this.updateGraphic();
    }
    get isOn() {
      return this._isOn;
    }
    set isOn(v) {
      this.set(v, true);
    }
    setIsOnWithoutNotify(v) {
      this.set(v, false);
    }
    set(v, notify) {
      v = !!v;
      if (v === this._isOn) return;
      this._isOn = v;
      this.updateGraphic();
      if (notify) this.onValueChanged.invoke(v);
    }
    updateGraphic() {
      if (this.graphic && this.graphic.gameObject) this.graphic.enabled = true, this.graphic._toggleAlpha = this._isOn ? 1 : 0, this.graphic.color = this.graphic.color.withAlpha(this._isOn ? 1 : 0);
    }
    onPointerClick() {
      if (this.isInteractable) this.isOn = !this._isOn;
    }
  };
  register(Toggle, "Toggle");
  var Slider = class extends Selectable {
    static {
      __name(this, "Slider");
    }
    deserialize(f) {
      super.deserialize(f);
      this.fillRect = f.m_FillRect;
      this.handleRect = f.m_HandleRect;
      this.direction = f.m_Direction || 0;
      this.minValue = f.m_MinValue ?? 0;
      this.maxValue = f.m_MaxValue ?? 1;
      this.wholeNumbers = !!f.m_WholeNumbers;
      this._value = f.m_Value ?? 0;
      this.onValueChanged = new UnityEvent(f.m_OnValueChanged);
    }
    get value() {
      return this._value;
    }
    set value(v) {
      this.set(v, true);
    }
    setValueWithoutNotify(v) {
      this.set(v, false);
    }
    get normalizedValue() {
      return this.maxValue === this.minValue ? 0 : (this._value - this.minValue) / (this.maxValue - this.minValue);
    }
    set normalizedValue(t) {
      this.value = lerp(this.minValue, this.maxValue, t);
    }
    set(v, notify) {
      v = clamp(v, this.minValue, this.maxValue);
      if (this.wholeNumbers) v = Math.round(v);
      if (v === this._value) return;
      this._value = v;
      this.updateVisuals();
      if (notify) this.onValueChanged.invoke(v);
    }
    start() {
      super.start();
      this.updateVisuals();
    }
    updateVisuals() {
      const t = this.normalizedValue;
      const rev = this.direction === 1 || this.direction === 3;
      const ax = this.direction >= 2 ? "y" : "x";
      if (this.fillRect?.anchorMin) {
        const amin = { ...this.fillRect.anchorMin }, amax = { ...this.fillRect.anchorMax };
        if (rev) {
          amin[ax] = 1 - t;
          amax[ax] = 1;
        } else {
          amin[ax] = 0;
          amax[ax] = t;
        }
        this.fillRect.anchorMin = amin;
        this.fillRect.anchorMax = amax;
      }
      if (this.handleRect?.anchorMin) {
        const amin = { ...this.handleRect.anchorMin }, amax = { ...this.handleRect.anchorMax };
        amin[ax] = amax[ax] = rev ? 1 - t : t;
        this.handleRect.anchorMin = amin;
        this.handleRect.anchorMax = amax;
      }
    }
    _setFromPointer(ev) {
      const area = this.handleRect?.parent || this.fillRect?.parent || this.transform;
      const cv = this.gameObject.getComponentInParent(Canvas);
      let pt = ev.position;
      if (cv?.rootCanvas.renderMode === 2) pt = Camera.main.screenToWorldPoint(pt);
      const l = area.inverseTransformPoint(pt.x, pt.y);
      const r = area.rect;
      const ax = this.direction >= 2;
      let t = ax ? (l.y - r.y) / r.height : (l.x - r.x) / r.width;
      if (this.direction === 1 || this.direction === 3) t = 1 - t;
      this.normalizedValue = clamp01(t);
    }
    onPointerDown(ev) {
      super.onPointerDown(ev);
      if (this.isInteractable) this._setFromPointer(ev);
    }
    onDrag(ev) {
      if (this.isInteractable) this._setFromPointer(ev);
    }
  };
  register(Slider, "Slider");
  var Scrollbar = class extends Selectable {
    static {
      __name(this, "Scrollbar");
    }
    deserialize(f) {
      super.deserialize(f);
      this.handleRect = f.m_HandleRect;
      this.direction = f.m_Direction || 0;
      this._value = f.m_Value ?? 0;
      this.size = f.m_Size ?? 0.2;
      this.onValueChanged = new UnityEvent(f.m_OnValueChanged);
    }
    get value() {
      return this._value;
    }
    set value(v) {
      v = clamp01(v);
      if (v === this._value) return;
      this._value = v;
      this.updateVisuals();
      this.onValueChanged.invoke(v);
    }
    setValueWithoutNotify(v) {
      this._value = clamp01(v);
      this.updateVisuals();
    }
    updateVisuals() {
      if (!this.handleRect?.anchorMin) return;
      const vert = this.direction >= 2;
      const ax = vert ? "y" : "x";
      const amin = { ...this.handleRect.anchorMin }, amax = { ...this.handleRect.anchorMax };
      const pos = this._value * (1 - this.size);
      amin[ax] = pos;
      amax[ax] = pos + this.size;
      this.handleRect.anchorMin = amin;
      this.handleRect.anchorMax = amax;
    }
  };
  register(Scrollbar, "Scrollbar");
  var ScrollRect = class extends Component {
    static {
      __name(this, "ScrollRect");
    }
    deserialize(f) {
      this.content = f.m_Content;
      this.horizontal = !!f.m_Horizontal;
      this.vertical = !!f.m_Vertical;
      this.movementType = f.m_MovementType;
      this.elasticity = f.m_Elasticity;
      this.inertia = !!f.m_Inertia;
      this.decelerationRate = f.m_DecelerationRate;
      this.scrollSensitivity = f.m_ScrollSensitivity;
      this.viewport = f.m_Viewport;
      this.verticalScrollbar = f.m_VerticalScrollbar;
      this.horizontalScrollbar = f.m_HorizontalScrollbar;
      this.onValueChanged = new UnityEvent(f.m_OnValueChanged);
      this.velocity = { x: 0, y: 0 };
      this._dragging = false;
      this.hVis = f.m_HorizontalScrollbarVisibility || 0;
      this.vVis = f.m_VerticalScrollbarVisibility || 0;
      this.hSpacing = f.m_HorizontalScrollbarSpacing || 0;
      this.vSpacing = f.m_VerticalScrollbarSpacing || 0;
    }
    // ScrollbarVisibility.AutoHideAndExpandViewport (2): the ScrollRect drives the viewport to fill it,
    // shrinking it by a scrollbar (+spacing) only while that scrollbar is needed.
    driveViewport() {
      const vp = this.viewport;
      if (!vp || !vp.isRect || this.hVis !== 2 && this.vVis !== 2) return;
      vp.anchorMin = { x: 0, y: 0 };
      vp.anchorMax = { x: 1, y: 1 };
      vp.anchoredPosition = { x: 0, y: 0 };
      const sd = { x: 0, y: 0 };
      const c = this.content;
      const me = this.transform.rect;
      if (c) {
        const vNeeded = this.vertical && c.rect.height > me.height + 0.01, hNeeded = this.horizontal && c.rect.width > me.width + 0.01;
        const vs = this.verticalScrollbar?.transform, hs = this.horizontalScrollbar?.transform;
        if (this.vVis === 2 && vNeeded && vs) sd.x = -(vs.rect.width + this.vSpacing);
        if (this.hVis === 2 && hNeeded && hs) sd.y = -(hs.rect.height + this.hSpacing);
        if (this.vVis === 2) vs?.gameObject.setActive(vNeeded);
        if (this.hVis === 2) hs?.gameObject.setActive(hNeeded);
      }
      vp.sizeDelta = sd;
    }
    get viewRect() {
      return this.viewport && this.viewport.rect ? this.viewport : this.transform;
    }
    _scale() {
      const cv = this.gameObject.getComponentInParent(Canvas);
      return cv ? cv.rootCanvas.renderMode === 2 ? Camera.main.pixelsPerUnit * this.transform.lossyScale.y : cv.rootCanvas.scaleFactor : 1;
    }
    bounds() {
      const c = this.content;
      if (!c) return null;
      const v = this.viewRect.rect;
      const cr = c.rect;
      const ox = c.localPosition.x, oy = c.localPosition.y;
      return { vmin: { x: v.x, y: v.y }, vmax: { x: v.x + v.width, y: v.y + v.height }, cmin: { x: ox + cr.x, y: oy + cr.y }, cmax: { x: ox + cr.x + cr.width, y: oy + cr.y + cr.height } };
    }
    offset() {
      const b = this.bounds();
      if (!b) return { x: 0, y: 0 };
      const o = { x: 0, y: 0 };
      const csx = b.cmax.x - b.cmin.x, vsx = b.vmax.x - b.vmin.x, csy = b.cmax.y - b.cmin.y, vsy = b.vmax.y - b.vmin.y;
      if (this.horizontal) {
        if (csx <= vsx) o.x = b.vmin.x - b.cmin.x;
        else if (b.cmin.x > b.vmin.x) o.x = b.vmin.x - b.cmin.x;
        else if (b.cmax.x < b.vmax.x) o.x = b.vmax.x - b.cmax.x;
      }
      if (this.vertical) {
        if (csy <= vsy) o.y = b.vmax.y - b.cmax.y;
        else if (b.cmax.y < b.vmax.y) o.y = b.vmax.y - b.cmax.y;
        else if (b.cmin.y > b.vmin.y) o.y = b.vmin.y - b.cmin.y;
      }
      return o;
    }
    get verticalNormalizedPosition() {
      const b = this.bounds();
      if (!b) return 0;
      const h = b.cmax.y - b.cmin.y - (b.vmax.y - b.vmin.y);
      return h <= 0 ? b.vmin.y > b.cmin.y ? 1 : 0 : (b.vmin.y - b.cmin.y) / h;
    }
    set verticalNormalizedPosition(t) {
      const b = this.bounds();
      if (!b) return;
      const h = b.cmax.y - b.cmin.y - (b.vmax.y - b.vmin.y);
      if (h <= 0) return;
      const target = b.vmin.y - t * h;
      const d = target - b.cmin.y;
      this.content.anchoredPosition = { x: this.content.anchoredPosition.x, y: this.content.anchoredPosition.y + d };
      this.velocity.y = 0;
    }
    get horizontalNormalizedPosition() {
      const b = this.bounds();
      if (!b) return 0;
      const w = b.cmax.x - b.cmin.x - (b.vmax.x - b.vmin.x);
      return w <= 0 ? 0 : (b.vmin.x - b.cmin.x) / w;
    }
    set horizontalNormalizedPosition(t) {
      const b = this.bounds();
      if (!b) return;
      const w = b.cmax.x - b.cmin.x - (b.vmax.x - b.vmin.x);
      if (w <= 0) return;
      const target = b.vmin.x - t * w;
      this.content.anchoredPosition = { x: this.content.anchoredPosition.x + target - b.cmin.x, y: this.content.anchoredPosition.y };
      this.velocity.x = 0;
    }
    stopMovement() {
      this.velocity = { x: 0, y: 0 };
    }
    onBeginDrag(ev) {
      this._dragging = true;
      this.velocity = { x: 0, y: 0 };
    }
    onDrag(ev) {
      if (!this.content) return;
      const s2 = this._scale();
      let dx = this.horizontal ? ev.delta.x / s2 : 0, dy = this.vertical ? ev.delta.y / s2 : 0;
      const o = this.offset();
      if (this.movementType === 1) {
        if (o.x) dx *= 0.3;
        if (o.y) dy *= 0.3;
      }
      this.content.anchoredPosition = { x: this.content.anchoredPosition.x + dx, y: this.content.anchoredPosition.y + dy };
      if (Time.unscaledDeltaTime > 0) this.velocity = { x: lerp(this.velocity.x, dx / Time.unscaledDeltaTime, 0.5), y: lerp(this.velocity.y, dy / Time.unscaledDeltaTime, 0.5) };
      this.onValueChanged.invoke();
    }
    onEndDrag() {
      this._dragging = false;
    }
    onScroll(ev) {
      if (!this.content) return;
      const d = ev.scrollDelta.y * this.scrollSensitivity * 3;
      if (this.vertical) this.content.anchoredPosition = { x: this.content.anchoredPosition.x, y: this.content.anchoredPosition.y - d };
      else if (this.horizontal) this.content.anchoredPosition = { x: this.content.anchoredPosition.x + d, y: this.content.anchoredPosition.y };
      if (this.movementType === 2) this.clampContent();
      this.onValueChanged.invoke();
    }
    clampContent() {
      const o = this.offset();
      if (o.x || o.y) this.content.anchoredPosition = { x: this.content.anchoredPosition.x + o.x, y: this.content.anchoredPosition.y + o.y };
    }
    lateUpdate() {
      this.driveViewport();
      if (!this.content) return;
      const dt = Time.unscaledDeltaTime;
      const o = this.offset();
      if (!this._dragging) {
        const ap = { ...this.content.anchoredPosition };
        for (const ax of ["x", "y"]) {
          if (this.movementType === 1 && o[ax]) {
            ap[ax] += o[ax] * Math.min(1, dt / Math.max(0.01, this.elasticity) * 0.6);
            this.velocity[ax] = 0;
          } else if (this.inertia) {
            this.velocity[ax] *= Math.pow(this.decelerationRate, dt);
            if (Math.abs(this.velocity[ax]) < 1) this.velocity[ax] = 0;
            ap[ax] += this.velocity[ax] * dt;
          } else this.velocity[ax] = 0;
        }
        this.content.anchoredPosition = ap;
        if (this.movementType === 2) this.clampContent();
      }
      if (this.verticalScrollbar?.setValueWithoutNotify) {
        const b = this.bounds();
        if (b) {
          this.verticalScrollbar.size = clamp01((b.vmax.y - b.vmin.y) / Math.max(1, b.cmax.y - b.cmin.y));
          this.verticalScrollbar.setValueWithoutNotify(this.verticalNormalizedPosition);
        }
      }
    }
  };
  register(ScrollRect, "ScrollRect");
  var EventTrigger = class extends Component {
    static {
      __name(this, "EventTrigger");
    }
    deserialize(f) {
      this.triggers = (f.m_Delegates || []).map((d) => ({ id: d.eventID, cb: new UnityEvent(d.callback) }));
    }
    fire(id, ev) {
      for (const t of this.triggers) if (t.id === id) t.cb.invoke(ev);
    }
    onPointerEnter(e) {
      this.fire(0, e);
    }
    onPointerExit(e) {
      this.fire(1, e);
    }
    onPointerDown(e) {
      this.fire(2, e);
    }
    onPointerUp(e) {
      this.fire(3, e);
    }
    onPointerClick(e) {
      this.fire(4, e);
    }
  };
  register(EventTrigger, "EventTrigger");

  // web/src/engine/anim.js
  var crcTable = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();
  function crc32(s2) {
    let c = 4294967295;
    for (let i = 0; i < s2.length; i++) c = crcTable[(c ^ s2.charCodeAt(i)) & 255] ^ c >>> 8;
    return (c ^ 4294967295) >>> 0;
  }
  __name(crc32, "crc32");
  function sampleKeys(keys, t) {
    if (!keys.length) return void 0;
    let k = keys[0];
    for (const x of keys) {
      if (x[0] <= t + 1e-5) k = x;
      else break;
    }
    if (typeof k[1] !== "number") return k[1];
    if (k[2]) {
      const d = t - k[0];
      const c = k[2];
      return ((c[0] * d + c[1]) * d + c[2]) * d + c[3];
    }
    return k[1];
  }
  __name(sampleKeys, "sampleKeys");
  var Animator = class extends Component {
    static {
      __name(this, "Animator");
    }
    constructor(go) {
      super(go);
      this.controller = null;
      this.speed = 1;
      this.params = {};
      this.layer = null;
      this.stateIdx = 0;
      this.stateTime = 0;
      this._targets = null;
      this.updateMode = 0;
      this.keepState = false;
    }
    deserialize(f) {
      this.controller = f.m_Controller && f.m_Controller.layers ? f.m_Controller : null;
      this.updateMode = f.m_UpdateMode || 0;
      this.enabled = f.m_Enabled !== 0;
      this._initController();
    }
    set runtimeAnimatorController(c) {
      this.controller = c && c.layers ? c : c && c.key ? { key: c.key, ...Assets.controllers[c.key] } : null;
      this._initController();
      this._targets = null;
    }
    get runtimeAnimatorController() {
      return this.controller;
    }
    _initController() {
      this.params = {};
      if (!this.controller) return;
      for (const p of this.controller.params) this.params[p.name] = p.type === 4 ? false : 0;
      this.layer = this.controller.layers[0];
      this.stateIdx = this.layer ? this.layer.default : 0;
      this.stateTime = 0;
    }
    onEnable() {
      if (!this.keepState) {
        this.stateIdx = this.layer ? this.layer.default : 0;
        this.stateTime = 0;
      }
    }
    setTrigger(n) {
      this.params[n] = true;
      this._trig = this._trig || /* @__PURE__ */ new Set();
      this._trig.add(n);
    }
    resetTrigger(n) {
      this.params[n] = false;
      this._trig?.delete(n);
    }
    setBool(n, v) {
      this.params[n] = !!v;
    }
    getBool(n) {
      return !!this.params[n];
    }
    setFloat(n, v) {
      this.params[n] = v;
    }
    getFloat(n) {
      return this.params[n] || 0;
    }
    setInteger(n, v) {
      this.params[n] = v | 0;
    }
    getInteger(n) {
      return this.params[n] | 0;
    }
    play(stateName, layer = 0, normalizedTime = 0) {
      if (!this.layer) return;
      const i = this.layer.states.findIndex((s2) => s2.name === stateName || crc32(s2.name) === stateName);
      if (i >= 0) {
        this.stateIdx = i;
        const c = this.currentClip;
        this.stateTime = (normalizedTime || 0) * (c ? c.stop - c.start : 0);
      }
    }
    get currentState() {
      return this.layer?.states[this.stateIdx];
    }
    get currentClip() {
      const s2 = this.currentState;
      const k = s2?.clips?.[0];
      return k ? Assets.clips[k] : null;
    }
    getCurrentAnimatorStateInfo() {
      const c = this.currentClip;
      const len = c ? Math.max(1e-4, c.stop - c.start) : 1;
      const s2 = this.currentState;
      return { normalizedTime: this.stateTime / len, length: len, isName: /* @__PURE__ */ __name((n) => s2?.name === n, "isName"), IsName: /* @__PURE__ */ __name((n) => s2?.name === n, "IsName"), shortNameHash: s2 ? crc32(s2.name) : 0 };
    }
    _resolveTargets() {
      const map = /* @__PURE__ */ new Map();
      const walk = /* @__PURE__ */ __name((tr, path) => {
        map.set(crc32(path), tr.gameObject);
        for (const ch of tr.children) walk(ch, path ? `${path}/${ch.gameObject.name}` : ch.gameObject.name);
      }, "walk");
      walk(this.transform, "");
      this._targets = map;
    }
    _cond(c) {
      const v = this.params[c.param];
      switch (c.mode) {
        case 1:
          return !!v;
        case 2:
          return !v;
        case 3:
          return v > c.th;
        case 4:
          return v < c.th;
        case 6:
          return v === c.th;
        case 7:
          return v !== c.th;
        default:
          return false;
      }
    }
    update() {
      if (!this.controller || !this.layer) return;
      const dt = (this.updateMode === 2 ? Time.unscaledDeltaTime : Time.deltaTime) * this.speed;
      const st = this.currentState;
      if (!st) return;
      this.stateTime += dt * Math.abs(st.speed ?? 1);
      const clip = this.currentClip;
      const len = clip ? Math.max(1e-4, clip.stop - clip.start) : 1;
      const tryTrans = /* @__PURE__ */ __name((list, fromAny) => {
        for (const t of list) {
          if (!fromAny && t.hasExit && this.stateTime / len < t.exitTime) continue;
          if (!t.conds.every((c) => this._cond(c))) continue;
          if (!fromAny && !t.hasExit && !t.conds.length) continue;
          for (const c of t.conds) if (this._trig?.has(c.param)) {
            this.params[c.param] = false;
            this._trig.delete(c.param);
          }
          if (t.dest >= 0 && t.dest < this.layer.states.length && (t.dest !== this.stateIdx || !fromAny)) {
            this.stateIdx = t.dest;
            this.stateTime = 0;
            return true;
          }
        }
        return false;
      }, "tryTrans");
      if (!tryTrans(this.layer.any || [], true)) tryTrans(st.trans || [], false);
      this.apply();
    }
    apply() {
      const clip = this.currentClip;
      if (!clip) return;
      if (!this._targets) this._resolveTargets();
      const len = Math.max(1e-4, clip.stop - clip.start);
      const st = this.currentState;
      const reverse = (st.speed ?? 1) < 0;
      let t = this.stateTime;
      if (clip.loop) {
        t = (t % len + len) % len;
      } else t = Math.max(0, Math.min(len, t));
      if (reverse) t = clip.loop ? len - (this.stateTime % len + len) % len : Math.max(0, len - this.stateTime);
      t += clip.start;
      if (clip.events?.length) {
        const prev = this._lastT ?? t;
        for (const e of clip.events) if (prev < e.time && t >= e.time || t < prev && (e.time >= prev || e.time <= t)) this._fireEvent(e);
        this._lastT = t;
      }
      for (const cv of clip.curves) {
        const go = this._targets.get(cv.path >>> 0);
        if (!go) continue;
        const v = sampleKeys(cv.keys, t);
        if (v === void 0) continue;
        applyCurve(go, cv, v);
      }
    }
    _fireEvent(e) {
      for (const c of this.gameObject.components) {
        const fn = c[e.fn] || c[e.fn[0].toLowerCase() + e.fn.slice(1)];
        if (typeof fn === "function") {
          fn.call(c, e.str || e.f || e.i);
        }
      }
    }
  };
  register(Animator, "Animator");
  function applyCurve(go, cv, v) {
    const tr = go.transform;
    switch (cv.attr) {
      case "m_Sprite": {
        const s2 = Assets.sprite(v);
        if (!s2) return;
        const sr = go.getComponent("SpriteRenderer");
        if (cv.type === "SpriteRenderer" && sr) {
          sr.sprite = s2;
          return;
        }
        const img = go.getComponent("Image");
        if (img) img.sprite = s2;
        else if (sr) sr.sprite = s2;
        return;
      }
      case "0": {
        const sr = go.getComponent("SpriteRenderer");
        if (sr && typeof v === "string") sr.sprite = Assets.sprite(v);
        return;
      }
      case "m_IsActive":
        go.setActive(v > 0.5);
        return;
      case "m_Enabled": {
        const c = go.getComponent(cv.type);
        if (c) c.setEnabled(v > 0.5);
        return;
      }
      case "m_Alpha": {
        const cg = go.getComponent("CanvasGroup");
        if (cg) cg.alpha = v;
        return;
      }
      case "m_FillAmount": {
        const im = go.getComponent("Image");
        if (im) im.fillAmount = v;
        return;
      }
    }
    const m = /^(m_LocalPosition|m_LocalScale|m_LocalEulerAngles|localEulerAnglesRaw|m_LocalEulerAnglesHint|m_AnchoredPosition|m_SizeDelta|m_Color|m_LocalRotation)\.([xyzwrgba])$/.exec(cv.attr);
    if (!m) return;
    const [, prop, comp] = m;
    if (prop === "m_LocalPosition") tr.localPosition[comp] = v;
    else if (prop === "m_LocalScale") tr.localScale[comp] = v;
    else if (prop.includes("Euler") && comp === "z") tr.localEulerZ = v;
    else if (prop === "m_LocalRotation") tr.localRotation[comp] = v;
    else if (prop === "m_AnchoredPosition" && tr.isRect) tr.anchoredPosition = { ...tr.anchoredPosition, [comp]: v };
    else if (prop === "m_SizeDelta" && tr.isRect) tr.sizeDelta = { ...tr.sizeDelta, [comp]: v };
    else if (prop === "m_Color") {
      const g = cv.type === "SpriteRenderer" ? go.getComponent("SpriteRenderer") : go.getComponent("Image") || go.getComponent("TextMeshProUGUI") || go.getComponent("SpriteRenderer");
      if (g) {
        const c = g.color.clone();
        c[comp] = v;
        g.color = c;
      }
    }
  }
  __name(applyCurve, "applyCurve");

  // web/src/engine/tween.js
  var tweens = /* @__PURE__ */ new Set();
  var PI = Math.PI;
  var Ease = {
    Unset: "OutQuad",
    Linear: "Linear",
    InSine: "InSine",
    OutSine: "OutSine",
    InOutSine: "InOutSine",
    InQuad: "InQuad",
    OutQuad: "OutQuad",
    InOutQuad: "InOutQuad",
    InCubic: "InCubic",
    OutCubic: "OutCubic",
    InOutCubic: "InOutCubic",
    InQuart: "InQuart",
    OutQuart: "OutQuart",
    InOutQuart: "InOutQuart",
    InQuint: "InQuint",
    OutQuint: "OutQuint",
    InOutQuint: "InOutQuint",
    InExpo: "InExpo",
    OutExpo: "OutExpo",
    InOutExpo: "InOutExpo",
    InCirc: "InCirc",
    OutCirc: "OutCirc",
    InOutCirc: "InOutCirc",
    InElastic: "InElastic",
    OutElastic: "OutElastic",
    InOutElastic: "InOutElastic",
    InBack: "InBack",
    OutBack: "OutBack",
    InOutBack: "InOutBack",
    InBounce: "InBounce",
    OutBounce: "OutBounce",
    InOutBounce: "InOutBounce",
    Flash: "Linear"
  };
  var EaseByIndex = ["Unset", "Linear", "InSine", "OutSine", "InOutSine", "InQuad", "OutQuad", "InOutQuad", "InCubic", "OutCubic", "InOutCubic", "InQuart", "OutQuart", "InOutQuart", "InQuint", "OutQuint", "InOutQuint", "InExpo", "OutExpo", "InOutExpo", "InCirc", "OutCirc", "InOutCirc", "InElastic", "OutElastic", "InOutElastic", "InBack", "OutBack", "InOutBack", "InBounce", "OutBounce", "InOutBounce"];
  function bounceOut(t) {
    if (t < 1 / 2.75) return 7.5625 * t * t;
    if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  }
  __name(bounceOut, "bounceOut");
  var s = 1.70158;
  var EaseFn = {
    Linear: /* @__PURE__ */ __name((t) => t, "Linear"),
    InSine: /* @__PURE__ */ __name((t) => 1 - Math.cos(t * PI / 2), "InSine"),
    OutSine: /* @__PURE__ */ __name((t) => Math.sin(t * PI / 2), "OutSine"),
    InOutSine: /* @__PURE__ */ __name((t) => -0.5 * (Math.cos(PI * t) - 1), "InOutSine"),
    InQuad: /* @__PURE__ */ __name((t) => t * t, "InQuad"),
    OutQuad: /* @__PURE__ */ __name((t) => -t * (t - 2), "OutQuad"),
    InOutQuad: /* @__PURE__ */ __name((t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t, "InOutQuad"),
    InCubic: /* @__PURE__ */ __name((t) => t * t * t, "InCubic"),
    OutCubic: /* @__PURE__ */ __name((t) => --t * t * t + 1, "OutCubic"),
    InOutCubic: /* @__PURE__ */ __name((t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1, "InOutCubic"),
    InQuart: /* @__PURE__ */ __name((t) => t ** 4, "InQuart"),
    OutQuart: /* @__PURE__ */ __name((t) => 1 - --t * t * t * t, "OutQuart"),
    InOutQuart: /* @__PURE__ */ __name((t) => t < 0.5 ? 8 * t ** 4 : 1 - 8 * --t * t * t * t, "InOutQuart"),
    InQuint: /* @__PURE__ */ __name((t) => t ** 5, "InQuint"),
    OutQuint: /* @__PURE__ */ __name((t) => 1 + --t * t ** 4, "OutQuint"),
    InOutQuint: /* @__PURE__ */ __name((t) => t < 0.5 ? 16 * t ** 5 : 1 + 16 * --t * t ** 4, "InOutQuint"),
    InExpo: /* @__PURE__ */ __name((t) => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)), "InExpo"),
    OutExpo: /* @__PURE__ */ __name((t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t), "OutExpo"),
    InOutExpo: /* @__PURE__ */ __name((t) => t === 0 || t === 1 ? t : t < 0.5 ? 0.5 * Math.pow(2, 20 * t - 10) : 1 - 0.5 * Math.pow(2, -20 * t + 10), "InOutExpo"),
    InCirc: /* @__PURE__ */ __name((t) => 1 - Math.sqrt(1 - t * t), "InCirc"),
    OutCirc: /* @__PURE__ */ __name((t) => Math.sqrt(1 - --t * t), "OutCirc"),
    InOutCirc: /* @__PURE__ */ __name((t) => t < 0.5 ? (1 - Math.sqrt(1 - 4 * t * t)) / 2 : (Math.sqrt(1 - (2 * t - 2) ** 2) + 1) / 2, "InOutCirc"),
    InElastic: /* @__PURE__ */ __name((t) => t === 0 || t === 1 ? t : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * (2 * PI / 3)), "InElastic"),
    OutElastic: /* @__PURE__ */ __name((t) => t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * PI / 3)) + 1, "OutElastic"),
    InOutElastic: /* @__PURE__ */ __name((t) => t === 0 || t === 1 ? t : t < 0.5 ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * (2 * PI / 4.5))) / 2 : Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * (2 * PI / 4.5)) / 2 + 1, "InOutElastic"),
    InBack: /* @__PURE__ */ __name((t) => t * t * ((s + 1) * t - s), "InBack"),
    OutBack: /* @__PURE__ */ __name((t) => --t * t * ((s + 1) * t + s) + 1, "OutBack"),
    InOutBack: /* @__PURE__ */ __name((t) => {
      const s2 = s * 1.525;
      return (t *= 2) < 1 ? 0.5 * (t * t * ((s2 + 1) * t - s2)) : 0.5 * ((t -= 2) * t * ((s2 + 1) * t + s2) + 2);
    }, "InOutBack"),
    InBounce: /* @__PURE__ */ __name((t) => 1 - bounceOut(1 - t), "InBounce"),
    OutBounce: bounceOut,
    InOutBounce: /* @__PURE__ */ __name((t) => t < 0.5 ? (1 - bounceOut(1 - 2 * t)) / 2 : (1 + bounceOut(2 * t - 1)) / 2, "InOutBounce")
  };
  var Tween = class {
    static {
      __name(this, "Tween");
    }
    constructor(dur, apply) {
      this.duration = Math.max(0, dur);
      this.applyFn = apply;
      this.elapsed = 0;
      this.delay = 0;
      this.ease = "OutQuad";
      this.loops = 1;
      this.loopType = 0;
      this.unscaled = false;
      this.killed = false;
      this.started = false;
      this.complete = false;
      this.paused = false;
      this.target = null;
      this.id = null;
      this.customEase = null;
      this.onCompleteFns = [];
      this.onUpdateFn = null;
      this.onStartFn = null;
      this.onKillFn = null;
      this.onStepCompleteFn = null;
      this.inSequence = false;
      this.autoKill = true;
      this.isRelative = false;
      this.isFrom = false;
      this._loopIdx = 0;
      tweens.add(this);
    }
    setEase(e, amp) {
      if (typeof e === "function") this.customEase = e;
      else if (typeof e === "number") this.ease = EaseByIndex[e] === "Unset" ? "OutQuad" : EaseByIndex[e];
      else if (e && e.keys) this.customEase = (t) => sampleCurve(e, t);
      else this.ease = e === "Unset" ? "OutQuad" : e;
      return this;
    }
    setDelay(d) {
      this.delay = d;
      return this;
    }
    setLoops(n, type = 0) {
      this.loops = n;
      this.loopType = type;
      return this;
    }
    setUpdate(unscaled) {
      this.unscaled = typeof unscaled === "boolean" ? unscaled : !!arguments[1];
      return this;
    }
    setTarget(t) {
      this.target = t;
      return this;
    }
    setId(id) {
      this.id = id;
      return this;
    }
    setRelative(v = true) {
      this.isRelative = v;
      return this;
    }
    setAutoKill(v = true) {
      this.autoKill = v;
      return this;
    }
    from(v) {
      this.isFrom = true;
      if (this.onFrom) this.onFrom(v);
      return this;
    }
    onComplete(fn) {
      this.onCompleteFns.push(fn);
      return this;
    }
    onUpdate(fn) {
      this.onUpdateFn = fn;
      return this;
    }
    onStart(fn) {
      this.onStartFn = fn;
      return this;
    }
    onKill(fn) {
      this.onKillFn = fn;
      return this;
    }
    onStepComplete(fn) {
      this.onStepCompleteFn = fn;
      return this;
    }
    setLink() {
      return this;
    }
    pause() {
      this.paused = true;
      return this;
    }
    play() {
      this.paused = false;
      return this;
    }
    playForward() {
      this.paused = false;
      return this;
    }
    restart() {
      this.elapsed = 0;
      this.complete = false;
      this.killed = false;
      this.started = false;
      tweens.add(this);
      return this;
    }
    isActive() {
      return !this.killed;
    }
    IsActive() {
      return !this.killed;
    }
    isPlaying() {
      return !this.killed && !this.paused && !this.complete;
    }
    IsPlaying() {
      return this.isPlaying();
    }
    isComplete() {
      return this.complete;
    }
    get Duration() {
      return this.duration;
    }
    kill(complete = false) {
      if (this.killed) return;
      if (complete) this.goto(this.totalDuration, true);
      this.killed = true;
      tweens.delete(this);
      this.onKillFn?.();
    }
    complete_() {
      this.kill(true);
    }
    get totalDuration() {
      return this.loops < 0 ? Infinity : this.duration * this.loops;
    }
    easeT(t) {
      if (this.customEase) return this.customEase(t);
      return (EaseFn[this.ease] || EaseFn.OutQuad)(t);
    }
    goto(time, fireComplete) {
      if (!this.started) {
        this.started = true;
        this.init?.();
        this.onStartFn?.();
      }
      const d = this.duration || 1e-9;
      let loopIdx = Math.floor(time / d);
      let t = (time - loopIdx * d) / d;
      if (this.loops >= 0 && time >= this.totalDuration) {
        loopIdx = this.loops - 1;
        t = 1;
      }
      if (loopIdx !== this._loopIdx) {
        this.onStepCompleteFn?.();
        this._loopIdx = loopIdx;
      }
      let e = t;
      if (this.loopType === 1 && loopIdx % 2 === 1) e = 1 - t;
      const v = this.easeT(this.duration === 0 ? 1 : e);
      this.applyFn(v, this.loopType === 2 ? loopIdx : 0, e);
      this.onUpdateFn?.();
      if (this.loops >= 0 && time >= this.totalDuration && !this.complete) {
        this.complete = true;
        if (fireComplete !== false) for (const f of this.onCompleteFns) {
          try {
            f();
          } catch (er) {
            console.error("tween onComplete", er);
          }
        }
        if (this.autoKill && !this.inSequence) {
          this.killed = true;
          tweens.delete(this);
          this.onKillFn?.();
        }
      }
    }
    tick(dt) {
      if (this.killed || this.paused || this.complete) return;
      if (this.target === void 0 || this.target && this.target.unresolved) {
        this.kill();
        return;
      }
      if (this.target && this.target._destroyed) {
        this.kill();
        return;
      }
      if (this.target && this.target.gameObject && this.target.gameObject._destroyed) {
        this.kill();
        return;
      }
      this.elapsed += dt;
      if (this.elapsed < this.delay) return;
      this.goto(this.elapsed - this.delay);
    }
    // await support:  yield tween.waitForCompletion()
    waitForCompletion() {
      const tw = this;
      return { next() {
        return { done: tw.complete || tw.killed, value: void 0 };
      }, throw() {
      }, [Symbol.iterator]() {
        return this;
      }, _wait: true };
    }
    WaitForCompletion() {
      return this.waitForCompletion();
    }
  };
  var Sequence = class extends Tween {
    static {
      __name(this, "Sequence");
    }
    constructor() {
      super(0, () => {
      });
      this.items = [];
      this.ease = "Linear";
      this.applyFn = (v, li, e) => this._apply(e);
    }
    append(tw) {
      return this.insert(this.duration, tw, true);
    }
    join(tw) {
      const last = this.items.length ? this.items[this.items.length - 1].at : 0;
      return this.insert(last, tw);
    }
    prepend(tw) {
      for (const it of this.items) it.at += tw.totalDuration + tw.delay;
      this.items.unshift({ at: 0, tw });
      this._own(tw);
      this.duration += tw.totalDuration + tw.delay;
      return this;
    }
    insert(at, tw, append) {
      this._own(tw);
      this.items.push({ at, tw });
      this.duration = Math.max(this.duration, at + tw.delay + tw.totalDuration);
      return this;
    }
    appendInterval(d) {
      this.duration += d;
      return this;
    }
    prependInterval(d) {
      for (const it of this.items) it.at += d;
      this.duration += d;
      return this;
    }
    appendCallback(fn) {
      return this.insertCallback(this.duration, fn);
    }
    insertCallback(at, fn) {
      this.items.push({ at, cb: fn, fired: false });
      this.duration = Math.max(this.duration, at);
      return this;
    }
    joinCallback(fn) {
      return this.appendCallback(fn);
    }
    _own(tw) {
      tw.inSequence = true;
      tweens.delete(tw);
    }
    _apply(e) {
      const time = e * this.duration;
      if (this._lastTime !== void 0 && time < this._lastTime) {
        for (const it of this.items) {
          if (it.cb) {
            if (!it.fired) {
              it.fired = true;
              try {
                it.cb();
              } catch (er) {
                console.error(er);
              }
            }
            it.fired = false;
          } else if (!it.tw.complete) it.tw.goto(it.tw.totalDuration, false);
        }
      }
      this._lastTime = time;
      for (const it of this.items) {
        if (it.cb) {
          if (!it.fired && time >= it.at) {
            it.fired = true;
            try {
              it.cb();
            } catch (er) {
              console.error(er);
            }
          }
          continue;
        }
        const local = time - it.at - it.tw.delay;
        if (local < 0) {
          if (it.tw.started && it.tw.isFrom) it.tw.goto(0, false);
          continue;
        }
        if (it.tw.complete && local >= it.tw.totalDuration) continue;
        it.tw.goto(Math.min(local, it.tw.totalDuration));
      }
    }
    restart() {
      for (const it of this.items) {
        it.fired = false;
        if (it.tw) {
          it.tw.complete = false;
          it.tw.started = false;
        }
      }
      return super.restart();
    }
  };
  function sampleCurve(curve, t) {
    const k = curve.keys || curve.m_Curve;
    if (!k || !k.length) return t;
    if (t <= k[0].time) return k[0].value;
    if (t >= k[k.length - 1].time) return k[k.length - 1].value;
    for (let i = 0; i < k.length - 1; i++) {
      const a = k[i], b = k[i + 1];
      if (t < a.time || t > b.time) continue;
      const dt = b.time - a.time;
      const u = (t - a.time) / dt;
      const m0 = a.outSlope * dt, m1 = b.inSlope * dt;
      const u2 = u * u, u3 = u2 * u;
      return (2 * u3 - 3 * u2 + 1) * a.value + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * b.value + (u3 - u2) * m1;
    }
    return t;
  }
  __name(sampleCurve, "sampleCurve");
  function evaluateCurve(curve, t) {
    return sampleCurve(curve, t);
  }
  __name(evaluateCurve, "evaluateCurve");
  var DOTween = {
    tick() {
      for (const tw of [...tweens]) tw.tick(tw.unscaled ? Time.unscaledDeltaTime : Time.deltaTime);
    },
    sequence() {
      return new Sequence();
    },
    to(getter, setter, endValue, dur) {
      let start;
      const tw = new Tween(dur, (v) => setter(lerpAny(start, endValue, v)));
      tw.init = () => {
        start = cloneV(getter());
      };
      tw.target = null;
      return tw;
    },
    toFloat(from, to, dur, setter) {
      const tw = new Tween(dur, (v) => setter(lerp(from, to, v)));
      return tw;
    },
    virtualFloat(from, to, dur, setter) {
      return this.toFloat(from, to, dur, setter);
    },
    delayedCall(d, fn, ignoreTimeScale = true) {
      const tw = new Tween(d, () => {
      });
      tw.ease = "Linear";
      tw.unscaled = ignoreTimeScale;
      tw.onComplete(fn);
      return tw;
    },
    kill(target, complete = false) {
      let n = 0;
      for (const tw of [...tweens]) if (tw.target === target || tw.id === target) {
        tw.kill(complete);
        n++;
      }
      return n;
    },
    killAll(complete = false) {
      for (const tw of [...tweens]) tw.kill(complete);
    },
    complete(target) {
      return this.kill(target, true);
    },
    isTweening(target) {
      for (const tw of tweens) if ((tw.target === target || tw.id === target) && tw.isPlaying()) return true;
      return false;
    },
    pause(target) {
      for (const tw of tweens) if (tw.target === target || tw.id === target) tw.pause();
    },
    play(target) {
      for (const tw of tweens) if (tw.target === target || tw.id === target) tw.play();
    }
  };
  function cloneV(v) {
    if (typeof v === "number") return v;
    if (v instanceof Color) return v.clone();
    if (v && typeof v === "object") return { ...v };
    return v;
  }
  __name(cloneV, "cloneV");
  function lerpAny(a, b, t) {
    if (typeof a === "number") return a + (b - a) * t;
    if (a instanceof Color || a && "r" in a) return new Color(lerp(a.r, b.r, t), lerp(a.g, b.g, t), lerp(a.b, b.b, t), lerp(a.a, b.a, t));
    return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), z: lerp(a.z || 0, b.z ?? a.z ?? 0, t) };
  }
  __name(lerpAny, "lerpAny");
  var vec = /* @__PURE__ */ __name((v, keepZ) => new Vec3(v.x, v.y, v.z ?? keepZ), "vec");
  var DO = {
    move(tr, to, d) {
      let from;
      const tw = new Tween(d, (v) => {
        tr.position = vec({ x: lerp(from.x, to.x, v), y: lerp(from.y, to.y, v), z: lerp(from.z, to.z ?? from.z, v) });
      });
      tw.init = () => {
        from = tr.position;
        if (tw.isRelative) to = { x: from.x + to.x, y: from.y + to.y, z: from.z + (to.z || 0) };
      };
      tw.onFrom = (f) => {
        const t0 = to;
        to = tr.position;
        tr.position = vec(f, to.z);
      };
      return tw.setTarget(tr);
    },
    moveX(tr, x, d) {
      let from;
      const tw = new Tween(d, (v) => {
        const p = tr.position;
        p.x = lerp(from, x, v);
        tr.position = p;
      });
      tw.init = () => {
        from = tr.position.x;
        if (tw.isRelative) x += from;
      };
      return tw.setTarget(tr);
    },
    moveY(tr, y, d) {
      let from;
      const tw = new Tween(d, (v) => {
        const p = tr.position;
        p.y = lerp(from, y, v);
        tr.position = p;
      });
      tw.init = () => {
        from = tr.position.y;
        if (tw.isRelative) y += from;
      };
      return tw.setTarget(tr);
    },
    localMove(tr, to, d) {
      let from;
      const tw = new Tween(d, (v) => {
        tr.localPosition = new Vec3(lerp(from.x, to.x, v), lerp(from.y, to.y, v), lerp(from.z, to.z ?? from.z, v));
      });
      tw.init = () => {
        from = tr.localPosition.clone();
        if (tw.isRelative) to = from.add(to);
      };
      tw.onFrom = (f) => {
        to = tr.localPosition.clone();
        tr.localPosition = vec(f, to.z);
      };
      return tw.setTarget(tr);
    },
    localMoveX(tr, x, d) {
      let from;
      const tw = new Tween(d, (v) => {
        tr.localPosition.x = lerp(from, x, v);
      });
      tw.init = () => {
        from = tr.localPosition.x;
        if (tw.isRelative) x += from;
      };
      return tw.setTarget(tr);
    },
    localMoveY(tr, y, d) {
      let from;
      const tw = new Tween(d, (v) => {
        tr.localPosition.y = lerp(from, y, v);
      });
      tw.init = () => {
        from = tr.localPosition.y;
        if (tw.isRelative) y += from;
      };
      return tw.setTarget(tr);
    },
    anchorPos(rt, to, d) {
      let from;
      const tw = new Tween(d, (v) => {
        rt.anchoredPosition = { x: lerp(from.x, to.x, v), y: lerp(from.y, to.y, v) };
      });
      tw.init = () => {
        from = { ...rt.anchoredPosition };
        if (tw.isRelative) to = { x: from.x + to.x, y: from.y + to.y };
      };
      tw.onFrom = (f) => {
        to = { ...rt.anchoredPosition };
        rt.anchoredPosition = { x: f.x, y: f.y };
      };
      return tw.setTarget(rt);
    },
    anchorPosX(rt, x, d) {
      let from;
      const tw = new Tween(d, (v) => {
        rt.anchoredPosition = { x: lerp(from, x, v), y: rt.anchoredPosition.y };
      });
      tw.init = () => {
        from = rt.anchoredPosition.x;
      };
      return tw.setTarget(rt);
    },
    anchorPosY(rt, y, d) {
      let from;
      const tw = new Tween(d, (v) => {
        rt.anchoredPosition = { x: rt.anchoredPosition.x, y: lerp(from, y, v) };
      });
      tw.init = () => {
        from = rt.anchoredPosition.y;
      };
      return tw.setTarget(rt);
    },
    sizeDelta(rt, to, d) {
      let from;
      const tw = new Tween(d, (v) => {
        rt.sizeDelta = { x: lerp(from.x, to.x, v), y: lerp(from.y, to.y, v) };
      });
      tw.init = () => {
        from = { ...rt.sizeDelta };
      };
      return tw.setTarget(rt);
    },
    scale(tr, to, d) {
      if (typeof to === "number") to = { x: to, y: to, z: to };
      let from;
      const tw = new Tween(d, (v) => {
        tr.localScale = new Vec3(lerp(from.x, to.x, v), lerp(from.y, to.y, v), lerp(from.z, to.z ?? 1, v));
      });
      tw.init = () => {
        from = tr.localScale.clone();
      };
      tw.onFrom = (f) => {
        if (typeof f === "number") f = { x: f, y: f, z: f };
        to = tr.localScale.clone();
        tr.localScale = new Vec3(f.x, f.y, f.z ?? 1);
      };
      return tw.setTarget(tr);
    },
    scaleX(tr, x, d) {
      let from;
      const tw = new Tween(d, (v) => {
        tr.localScale.x = lerp(from, x, v);
      });
      tw.init = () => {
        from = tr.localScale.x;
      };
      return tw.setTarget(tr);
    },
    scaleY(tr, y, d) {
      let from;
      const tw = new Tween(d, (v) => {
        tr.localScale.y = lerp(from, y, v);
      });
      tw.init = () => {
        from = tr.localScale.y;
      };
      return tw.setTarget(tr);
    },
    rotateZ(tr, z, d, mode = 0) {
      let from;
      const tw = new Tween(d, (v) => {
        tr.localEulerZ = lerp(from, z, v);
      });
      tw.init = () => {
        from = tr.localEulerZ;
        if (mode === 0) {
          let dz = ((z - from) % 360 + 540) % 360 - 180;
          z = from + dz;
        }
        if (tw.isRelative) z = from + z;
      };
      return tw.setTarget(tr);
    },
    localRotateZ(tr, z, d, mode) {
      return DO.rotateZ(tr, z, d, mode);
    },
    punchScale(tr, punch, d, vibrato = 10, elasticity = 1) {
      if (typeof punch === "number") punch = { x: punch, y: punch, z: punch };
      let base;
      const tw = new Tween(d, (v, li, raw) => {
        const k = punchCurve(raw, vibrato, elasticity);
        tr.localScale = new Vec3(base.x + punch.x * k, base.y + punch.y * k, base.z + (punch.z || 0) * k);
      });
      tw.ease = "Linear";
      tw.init = () => {
        base = tr.localScale.clone();
      };
      tw.onKill(() => {
        if (base && !tw._noRestore) tr.localScale = base.clone();
      });
      return tw.setTarget(tr);
    },
    punchPosition(tr, punch, d, vibrato = 10, elasticity = 1) {
      let base;
      const tw = new Tween(d, (v, li, raw) => {
        const k = punchCurve(raw, vibrato, elasticity);
        tr.localPosition = new Vec3(base.x + punch.x * k, base.y + punch.y * k, base.z);
      });
      tw.ease = "Linear";
      tw.init = () => {
        base = tr.localPosition.clone();
      };
      tw.onKill(() => {
        if (base) tr.localPosition = base.clone();
      });
      return tw.setTarget(tr);
    },
    punchAnchorPos(rt, punch, d, vibrato = 10, elasticity = 1) {
      let base;
      const tw = new Tween(d, (v, li, raw) => {
        const k = punchCurve(raw, vibrato, elasticity);
        rt.anchoredPosition = { x: base.x + punch.x * k, y: base.y + punch.y * k };
      });
      tw.ease = "Linear";
      tw.init = () => {
        base = { ...rt.anchoredPosition };
      };
      tw.onKill(() => {
        if (base) rt.anchoredPosition = { ...base };
      });
      return tw.setTarget(rt);
    },
    punchRotation(tr, punch, d, vibrato = 10, elasticity = 1) {
      const pz = typeof punch === "number" ? punch : punch.z;
      let base;
      const tw = new Tween(d, (v, li, raw) => {
        tr.localEulerZ = base + pz * punchCurve(raw, vibrato, elasticity);
      });
      tw.ease = "Linear";
      tw.init = () => {
        base = tr.localEulerZ;
      };
      tw.onKill(() => {
        if (base !== void 0) tr.localEulerZ = base;
      });
      return tw.setTarget(tr);
    },
    shakePosition(tr, d, strength = 1, vibrato = 10, randomness = 90, snap = false, fadeOut = true) {
      const st = typeof strength === "number" ? { x: strength, y: strength } : strength;
      let base;
      let ang = Math.random() * 360;
      const tw = new Tween(d, (v, li, raw) => {
        const f = fadeOut ? 1 - raw : 1;
        const step = Math.floor(raw * vibrato * d * 10);
        if (step !== tw._step) {
          tw._step = step;
          ang += 180 + (Math.random() - 0.5) * randomness * 2;
        }
        const r = ang * Math.PI / 180;
        tr.localPosition = new Vec3(base.x + Math.cos(r) * st.x * f, base.y + Math.sin(r) * st.y * f, base.z);
      });
      tw.ease = "Linear";
      tw.init = () => {
        base = tr.localPosition.clone();
      };
      tw.onKill(() => {
        if (base) tr.localPosition = base.clone();
      });
      tw.onComplete(() => {
        if (base) tr.localPosition = base.clone();
      });
      return tw.setTarget(tr);
    },
    shakeAnchorPos(rt, d, strength = 1, vibrato = 10, randomness = 90, snap = false, fadeOut = true) {
      const st = typeof strength === "number" ? { x: strength, y: strength } : strength;
      let base;
      let ang = Math.random() * 360;
      const tw = new Tween(d, (v, li, raw) => {
        const f = fadeOut ? 1 - raw : 1;
        const step = Math.floor(raw * vibrato * d * 10);
        if (step !== tw._step) {
          tw._step = step;
          ang += 180 + (Math.random() - 0.5) * randomness * 2;
        }
        const r = ang * Math.PI / 180;
        rt.anchoredPosition = { x: base.x + Math.cos(r) * st.x * f, y: base.y + Math.sin(r) * st.y * f };
      });
      tw.ease = "Linear";
      tw.init = () => {
        base = { ...rt.anchoredPosition };
      };
      tw.onKill(() => {
        if (base) rt.anchoredPosition = { ...base };
      });
      tw.onComplete(() => {
        if (base) rt.anchoredPosition = { ...base };
      });
      return tw.setTarget(rt);
    },
    shakeRotation(tr, d, strength = 90, vibrato = 10, randomness = 90, fadeOut = true) {
      const sz = typeof strength === "number" ? strength : strength.z;
      let base;
      const tw = new Tween(d, (v, li, raw) => {
        const f = fadeOut ? 1 - raw : 1;
        tr.localEulerZ = base + Math.sin(raw * vibrato * Math.PI * 2) * sz * f;
      });
      tw.ease = "Linear";
      tw.init = () => {
        base = tr.localEulerZ;
      };
      tw.onKill(() => {
        if (base !== void 0) tr.localEulerZ = base;
      });
      return tw.setTarget(tr);
    },
    shakeScale(tr, d, strength = 1, vibrato = 10, randomness = 90, fadeOut = true) {
      const st = typeof strength === "number" ? { x: strength, y: strength } : strength;
      let base;
      const tw = new Tween(d, (v, li, raw) => {
        const f = fadeOut ? 1 - raw : 1;
        const k = Math.sin(raw * vibrato * Math.PI * 2) * f;
        tr.localScale = new Vec3(base.x + st.x * k, base.y + st.y * k, base.z);
      });
      tw.ease = "Linear";
      tw.init = () => {
        base = tr.localScale.clone();
      };
      tw.onKill(() => {
        if (base) tr.localScale = base.clone();
      });
      return tw.setTarget(tr);
    },
    fade(g, to, d) {
      let from;
      const isCG = "alpha" in g && !("color" in g);
      const tw = new Tween(d, (v) => {
        const a = lerp(from, to, v);
        if (isCG) g.alpha = a;
        else g.color = g.color.withAlpha(a);
      });
      tw.init = () => {
        from = isCG ? g.alpha : g.color.a;
      };
      tw.onFrom = (f) => {
        to = isCG ? g.alpha : g.color.a;
        if (isCG) g.alpha = f;
        else g.color = g.color.withAlpha(f);
      };
      return tw.setTarget(g);
    },
    color(g, to, d) {
      let from;
      const tw = new Tween(d, (v) => {
        g.color = Color.lerp(from, to, v);
      });
      tw.init = () => {
        from = g.color.clone();
      };
      return tw.setTarget(g);
    },
    fillAmount(img, to, d) {
      let from;
      const tw = new Tween(d, (v) => {
        img.fillAmount = lerp(from, to, v);
      });
      tw.init = () => {
        from = img.fillAmount;
      };
      return tw.setTarget(img);
    },
    value(slider, to, d) {
      let from;
      const tw = new Tween(d, (v) => {
        slider.value = lerp(from, to, v);
      });
      tw.init = () => {
        from = slider.value;
      };
      return tw.setTarget(slider);
    },
    counter(tmp, from, to, d, fmt2 = (x) => String(Math.round(x))) {
      const tw = new Tween(d, (v) => {
        tmp.text = fmt2(lerp(from, to, v));
      });
      return tw.setTarget(tmp);
    },
    text(tmp, to, d) {
      const tw = new Tween(d, (v) => {
        tmp.text = to.slice(0, Math.round(to.length * v));
      });
      tw.ease = "Linear";
      return tw.setTarget(tmp);
    },
    jump(tr, to, power, jumps, d) {
      let from;
      const tw = new Tween(d, (v, li, raw) => {
        const yJ = Math.sin(raw * Math.PI * jumps);
        tr.position = new Vec3(lerp(from.x, to.x, v), lerp(from.y, to.y, v) + Math.abs(yJ) * power * (1 - 0), from.z);
      });
      tw.ease = "Linear";
      tw.init = () => {
        from = tr.position;
      };
      return tw.setTarget(tr);
    },
    volume(src, to, d) {
      let from;
      const tw = new Tween(d, (v) => {
        src.volume = lerp(from, to, v);
      });
      tw.init = () => {
        from = src.volume;
      };
      return tw.setTarget(src);
    },
    pitch(src, to, d) {
      let from;
      const tw = new Tween(d, (v) => {
        src.pitch = lerp(from, to, v);
      });
      tw.init = () => {
        from = src.pitch;
      };
      return tw.setTarget(src);
    },
    orthoSize(cam, to, d) {
      let from;
      const tw = new Tween(d, (v) => {
        cam.orthographicSize = lerp(from, to, v);
      });
      tw.init = () => {
        from = cam.orthographicSize;
      };
      return tw.setTarget(cam);
    }
  };
  function punchCurve(t, vibrato, elasticity) {
    if (t >= 1) return 0;
    const n = Math.max(1, Math.round(vibrato));
    const seg = 1 / (n + 1);
    const idx = Math.floor(t / seg);
    const local = (t - idx * seg) / seg;
    const amp = /* @__PURE__ */ __name((i) => {
      if (i === 0) return 0;
      if (i > n) return 0;
      const decay = (n + 1 - i) / (n + 1);
      return (i % 2 === 1 ? 1 : -elasticity) * decay;
    }, "amp");
    const a = idx === 0 ? 0 : amp(idx), b = amp(idx + 1) || (idx === 0 ? 1 : 0);
    const aa = idx === 0 ? 0 : a, bb = idx === 0 ? 1 : b;
    const u = local * local * (3 - 2 * local);
    return aa + (bb - aa) * u;
  }
  __name(punchCurve, "punchCurve");

  // web/src/engine/particles.js
  var rand = /* @__PURE__ */ __name((a, b) => a + Math.random() * (b - a), "rand");
  function mmc(c, t = 0, r = Math.random()) {
    if (!c) return 0;
    switch (c.minMaxState) {
      case 1:
        return c.scalar * curveAt(c.maxCurve, t);
      case 2:
        return c.scalar * (curveAt(c.minCurve, t) + (curveAt(c.maxCurve, t) - curveAt(c.minCurve, t)) * r);
      case 3:
        return c.minScalar + (c.scalar - c.minScalar) * r;
      default:
        return c.scalar;
    }
  }
  __name(mmc, "mmc");
  function curveAt(curve, t) {
    return curve?.m_Curve?.length ? evaluateCurve(curve, t) : 1;
  }
  __name(curveAt, "curveAt");
  function gradientAt(g, t) {
    if (!g) return new Color();
    const nc = g.m_NumColorKeys || 1, na = g.m_NumAlphaKeys || 1;
    const keys = /* @__PURE__ */ __name((n, tf) => Array.from({ length: n }, (_, i) => ({ t: (g[tf + i] || 0) / 65535, c: g["key" + i] })), "keys");
    const ck = keys(nc, "ctime"), ak = keys(na, "atime");
    const pick = /* @__PURE__ */ __name((ks, f) => {
      if (t <= ks[0].t) return f(ks[0].c);
      for (let i = 0; i < ks.length - 1; i++) if (t <= ks[i + 1].t) {
        const u = (t - ks[i].t) / Math.max(1e-6, ks[i + 1].t - ks[i].t);
        return f(ks[i].c) + (f(ks[i + 1].c) - f(ks[i].c)) * (g.m_Mode === 1 ? 0 : u);
      }
      return f(ks[ks.length - 1].c);
    }, "pick");
    return new Color(pick(ck, (c) => c.r), pick(ck, (c) => c.g), pick(ck, (c) => c.b), pick(ak, (c) => c.a));
  }
  __name(gradientAt, "gradientAt");
  function mmg(g, t, r = Math.random()) {
    if (!g) return new Color();
    switch (g.minMaxState) {
      case 1:
        return gradientAt(g.maxGradient, t);
      case 2:
        return Color.lerp(Color.from(g.minColor), Color.from(g.maxColor), r);
      case 3:
        return Color.lerp(gradientAt(g.minGradient, t), gradientAt(g.maxGradient, t), r);
      case 4:
        return gradientAt(g.maxGradient, r);
      default:
        return Color.from(g.maxColor);
    }
  }
  __name(mmg, "mmg");
  function rotate(q, v) {
    const m = q.matrix();
    return { x: m[0] * v.x + m[1] * v.y + m[2] * v.z, y: m[3] * v.x + m[4] * v.y + m[5] * v.z, z: m[6] * v.x + m[7] * v.y + m[8] * v.z };
  }
  __name(rotate, "rotate");
  function toWorld3D(tr, v, isDir = false) {
    let p = { ...v };
    for (let t = tr; t; t = t.parent) {
      const sc = t.localScale;
      p = { x: p.x * sc.x, y: p.y * sc.y, z: p.z * (sc.z ?? 1) };
      p = rotate(t.localRotation, p);
      if (!isDir) {
        const lp = t.localPosition;
        p = { x: p.x + lp.x, y: p.y + lp.y, z: p.z + (lp.z || 0) };
      }
    }
    return p;
  }
  __name(toWorld3D, "toWorld3D");
  function worldQuat(tr) {
    let q = tr.localRotation;
    for (let p = tr.parent; p; p = p.parent) q = mulQ(p.localRotation, q);
    return q;
  }
  __name(worldQuat, "worldQuat");
  function mulQ(a, b) {
    return new Quat(a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y, a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x, a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w, a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z);
  }
  __name(mulQ, "mulQ");
  var materials = null;
  var matImgs = /* @__PURE__ */ new Map();
  fetch("gamedata/materials.json").then((r) => r.ok ? r.json() : {}).then((m) => {
    materials = m;
  }).catch(() => {
    materials = {};
  });
  function materialImage(ref) {
    const key = typeof ref === "string" ? ref.split("#").pop() : ref?.key;
    if (!key || !materials?.[key]?.file) return null;
    if (!matImgs.has(key)) {
      const img2 = new Image();
      img2.src = "gamedata/materials/" + materials[key].file;
      matImgs.set(key, img2);
    }
    const img = matImgs.get(key);
    return img.complete && img.naturalWidth ? img : null;
  }
  __name(materialImage, "materialImage");
  var ParticleSystem = class extends Component {
    static {
      __name(this, "ParticleSystem");
    }
    deserialize(f) {
      this.f = f;
      this.main = f.InitialModule || {};
      this.particles = [];
      this.duration = f.lengthInSec ?? 5;
      this.looping = !!f.looping;
      this.playOnAwake = !!f.playOnAwake;
      this.worldSpace = f.moveWithTransform === 1;
      this.simulationSpeed = f.simulationSpeed ?? 1;
      this.useUnscaled = !!f.useUnscaledTime;
      this.isPlaying = false;
      this.isEmitting = false;
      this.time = 0;
      this.emitAcc = 0;
      this.burstsFired = /* @__PURE__ */ new Set();
      this.delayLeft = 0;
    }
    onEnable() {
      if (this.playOnAwake && !this._played) {
        this._played = true;
        this.play();
      }
    }
    get maxParticles() {
      return this.main.maxNumParticles || 1e3;
    }
    play() {
      this.isPlaying = true;
      this.isEmitting = true;
      this.time = 0;
      this.emitAcc = 0;
      this.burstsFired.clear();
      this.delayLeft = mmc(this.f.startDelay);
    }
    Play() {
      this.play();
    }
    stop(withChildren = true, behaviour = 0) {
      this.isEmitting = false;
      if (behaviour === 1) this.particles.length = 0;
    }
    Stop(a, b) {
      this.stop(a, b);
    }
    clear() {
      this.particles.length = 0;
    }
    Clear() {
      this.clear();
    }
    pause() {
      this.isPlaying = false;
    }
    get particleCount() {
      return this.particles.length;
    }
    emit(n) {
      for (let i = 0; i < n && this.particles.length < this.maxParticles; i++) this.spawn();
    }
    Emit(n) {
      this.emit(n);
    }
    shapePoint() {
      const sh = this.f.ShapeModule;
      let pos = { x: 0, y: 0, z: 0 }, dir = { x: 0, y: 0, z: 1 };
      if (sh?.enabled) {
        const r = sh.radius?.value ?? sh.radius ?? 1;
        const thick = sh.radiusThickness ?? 1;
        const rr = r * (1 - thick + thick * Math.sqrt(Math.random()));
        switch (sh.type) {
          case 0:
          case 1:
          case 2: {
            const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, s2 = Math.sqrt(1 - u * u);
            dir = { x: s2 * Math.cos(th), y: s2 * Math.sin(th), z: sh.type === 2 ? Math.abs(u) : u };
            const k = sh.type === 1 ? r : rr;
            pos = { x: dir.x * k, y: dir.y * k, z: dir.z * k };
            break;
          }
          case 4:
          case 8: {
            const th = Math.random() * Math.PI * 2;
            const ang = (sh.angle || 0) * Math.PI / 180;
            pos = { x: Math.cos(th) * rr, y: Math.sin(th) * rr, z: 0 };
            const k = r > 0 ? Math.hypot(pos.x, pos.y) / r : 0;
            const tilt = Math.tan(ang) * k;
            dir = { x: Math.cos(th) * tilt, y: Math.sin(th) * tilt, z: 1 };
            const m = Math.hypot(dir.x, dir.y, dir.z);
            dir = { x: dir.x / m, y: dir.y / m, z: dir.z / m };
            break;
          }
          case 5: {
            const s2 = sh.m_Scale || { x: 1, y: 1, z: 1 };
            pos = { x: rand(-0.5, 0.5) * s2.x, y: rand(-0.5, 0.5) * s2.y, z: rand(-0.5, 0.5) * s2.z };
            dir = { x: 0, y: 0, z: 1 };
            break;
          }
          case 10:
          default: {
            const arc = (sh.arc?.value ?? sh.arc ?? 360) * Math.PI / 180;
            const th = Math.random() * arc;
            dir = { x: Math.cos(th), y: Math.sin(th), z: 0 };
            pos = { x: dir.x * rr, y: dir.y * rr, z: 0 };
            break;
          }
        }
        if (sh.type !== 5 && sh.m_Scale) pos = { x: pos.x * sh.m_Scale.x, y: pos.y * sh.m_Scale.y, z: pos.z * (sh.m_Scale.z ?? 1) };
        if (sh.m_Rotation && (sh.m_Rotation.x || sh.m_Rotation.y || sh.m_Rotation.z)) {
          const q = Quat.euler(sh.m_Rotation.x, sh.m_Rotation.y, sh.m_Rotation.z);
          pos = rotate(q, pos);
          dir = rotate(q, dir);
        }
        if (sh.m_Position) pos = { x: pos.x + sh.m_Position.x, y: pos.y + sh.m_Position.y, z: pos.z + sh.m_Position.z };
        if (sh.randomDirectionAmount) {
          dir.x += rand(-1, 1) * sh.randomDirectionAmount;
          dir.y += rand(-1, 1) * sh.randomDirectionAmount;
        }
      }
      return { pos, dir };
    }
    spawn() {
      const m = this.main;
      const t = this.duration > 0 ? this.time % this.duration / this.duration : 0;
      const { pos, dir } = this.shapePoint();
      const speed = mmc(m.startSpeed, t);
      const life = Math.max(0.01, mmc(m.startLifetime, t));
      let p = { x: pos.x, y: pos.y, z: pos.z, vx: dir.x * speed, vy: dir.y * speed, vz: dir.z * speed, age: 0, life, size: mmc(m.startSize, t), rot: mmc(m.startRotation, t), color: mmg(m.startColor, t), seed: Math.random(), seed2: Math.random() };
      if (this.worldSpace) {
        const wp = toWorld3D(this.transform, pos);
        const wq = worldQuat(this.transform);
        const wd = rotate(wq, dir);
        p.x = wp.x;
        p.y = wp.y;
        p.z = wp.z;
        p.vx = wd.x * speed;
        p.vy = wd.y * speed;
        p.vz = wd.z * speed;
      }
      const uv = this.f.UVModule;
      if (uv?.enabled && uv.sprites?.length) p.frame = Math.floor(Math.min(0.9999, mmc(uv.startFrame, 0)) * uv.sprites.length);
      this.particles.push(p);
    }
    update() {
      const dt = (this.useUnscaled ? Time.unscaledDeltaTime : Time.deltaTime) * this.simulationSpeed;
      if (dt <= 0) return;
      if (this.isPlaying && this.isEmitting) {
        if (this.delayLeft > 0) this.delayLeft -= dt;
        else {
          const em = this.f.EmissionModule;
          const t0 = this.time;
          this.time += dt;
          if (em?.enabled) {
            const nt = this.duration > 0 ? t0 % this.duration / this.duration : 0;
            this.emitAcc += mmc(em.rateOverTime, nt) * dt;
            const n = Math.floor(this.emitAcc);
            this.emitAcc -= n;
            this.emit(n);
            (em.m_Bursts || []).forEach((b, i) => {
              const cycles = b.cycleCount || 1, interval = b.repeatInterval || this.duration;
              for (let c = 0; c < cycles; c++) {
                const bt = (b.time || 0) + c * interval;
                const key = i + ":" + c + ":" + Math.floor(t0 / Math.max(1e-6, this.duration));
                const local = this.looping ? t0 % this.duration : t0;
                if (!this.burstsFired.has(key) && local <= bt && bt <= local + dt + 1e-6) {
                  this.burstsFired.add(key);
                  if (Math.random() <= (b.probability ?? 1)) this.emit(Math.round(mmc(b.countCurve)));
                }
              }
            });
          }
          if (this.time >= this.duration) {
            if (this.looping) {
              this.burstsFired.clear();
            } else this.isEmitting = false;
          }
        }
      }
      const grav = (mmc(this.main.gravityModifier) || 0) * 9.81;
      const gLocal = this.worldSpace ? { x: 0, y: -1, z: 0 } : (() => {
        const q = worldQuat(this.transform);
        const inv = new Quat(-q.x, -q.y, -q.z, q.w);
        return rotate(inv, { x: 0, y: -1, z: 0 });
      })();
      const vel = this.f.VelocityModule, rbs = this.f.RotationBySpeedModule, rot = this.f.RotationModule;
      for (const p of this.particles) {
        p.age += dt;
        const nt = p.age / p.life;
        p.vx += gLocal.x * grav * dt;
        p.vy += gLocal.y * grav * dt;
        p.vz = (p.vz || 0) + gLocal.z * grav * dt;
        let vx = p.vx, vy = p.vy;
        if (vel?.enabled) {
          vx += mmc(vel.x, nt, p.seed);
          vy += mmc(vel.y, nt, p.seed);
        }
        p.x += vx * dt;
        p.y += vy * dt;
        p.z += (p.vz || 0) * dt;
        p.cvx = vx;
        p.cvy = vy;
        if (rot?.enabled) p.rot += mmc(rot.curve, nt, p.seed2) * dt;
        if (rbs?.enabled) {
          const sp = Math.hypot(vx, vy);
          const r = rbs.range || { x: 0, y: 1 };
          const k = Math.min(1, Math.max(0, (sp - r.x) / Math.max(1e-6, r.y - r.x)));
          p.rot += mmc(rbs.curve, k, p.seed2) * dt;
        }
      }
      this.particles = this.particles.filter((p) => p.age < p.life);
      if (!this.isEmitting && !this.particles.length && this.isPlaying) {
        this.isPlaying = false;
        if (this.f.stopAction === 2) this.gameObject.setActive(false);
        else if (this.f.stopAction === 1) this.gameObject.destroy?.();
      }
    }
  };
  register(ParticleSystem, "ParticleSystem");
  var ParticleSystemRenderer = class extends Component {
    static {
      __name(this, "ParticleSystemRenderer");
    }
    deserialize(f) {
      this.sortingOrder = f.m_SortingOrder || 0;
      this.enabled = f.m_Enabled !== false && f.m_Enabled !== 0;
      this.materials = f.m_Materials || [];
      this.renderMode = f.m_RenderMode || 0;
      this.lengthScale = f.m_LengthScale ?? 2;
      this.velocityScale = f.m_VelocityScale ?? 0;
    }
    get ps() {
      return this._ps ||= this.gameObject.getComponent("ParticleSystem");
    }
    render(ctx, alpha) {
      const ps = this.ps;
      if (!ps || !ps.particles.length) return;
      const img = materialImage(this.materials[0]);
      const col = ps.f.ColorModule, size = ps.f.SizeModule, uv = ps.f.UVModule;
      const sprites = uv?.enabled ? (uv.sprites || []).map((s2) => typeof s2.sprite === "string" ? Assets.sprite(s2.sprite.split("#").pop()) : s2.sprite) : null;
      const b = this.baseMatrix;
      if (b) ctx.setTransform(b.a, b.b, b.c, b.d, b.e, b.f);
      const sm = ps.f.scalingMode ?? 1;
      const ls = ps.transform.localScale, lossy = ps.transform.lossyScale;
      const sizeScale = sm === 0 ? (Math.abs(lossy.x) + Math.abs(lossy.y)) / 2 || 1 : sm === 1 ? (Math.abs(ls.x) + Math.abs(ls.y)) / 2 || 1 : 1;
      for (const p of ps.particles) {
        const nt = p.age / p.life;
        let c = p.color;
        if (col?.enabled) c = c.mul(mmg(col.gradient, nt, p.seed));
        const a = c.a * alpha;
        if (a <= 3e-3) continue;
        let s2 = p.size * sizeScale;
        if (size?.enabled) s2 *= mmc(size.curve, nt, p.seed);
        if (s2 <= 0) continue;
        const wp = ps.worldSpace ? p : toWorld3D(ps.transform, p);
        const wv = ps.worldSpace ? { x: p.cvx || p.vx, y: p.cvy || p.vy } : toWorld3D(ps.transform, { x: p.cvx || p.vx, y: p.cvy || p.vy, z: p.vz || 0 }, true);
        ctx.save();
        ctx.translate(wp.x, wp.y);
        ctx.globalAlpha = a;
        if (this.renderMode === 1) {
          const ang = Math.atan2(wv.y, wv.x);
          ctx.rotate(ang);
          const len = s2 * this.lengthScale + Math.hypot(wv.x, wv.y) * this.velocityScale;
          ctx.scale(len, s2);
        } else {
          if (p.rot) ctx.rotate(-p.rot);
          ctx.scale(s2, s2);
        }
        let sp = sprites?.length ? sprites[(p.frame ?? 0) % sprites.length] : null;
        if (sp?.img) {
          ctx.scale(1, -1);
          ctx.drawImage(tintedOr(sp.img, c), -0.5, -0.5, 1, 1);
        } else if (img) {
          ctx.scale(1, -1);
          ctx.drawImage(tintedOr(img, c), -0.5, -0.5, 1, 1);
        } else {
          ctx.fillStyle = `rgb(${c.rgbKey()})`;
          ctx.fillRect(-0.5, -0.5, 1, 1);
        }
        ctx.restore();
      }
    }
  };
  register(ParticleSystemRenderer, "ParticleSystemRenderer");
  var tintCache2 = /* @__PURE__ */ new Map();
  function tintedOr(img, c) {
    if (c.isWhiteRGB()) return img;
    const k = (img.src || img._k || (img._k = Math.random())) + "|" + c.rgbKey();
    let t = tintCache2.get(k);
    if (!t) {
      t = document.createElement("canvas");
      t.width = img.width;
      t.height = img.height;
      const g = t.getContext("2d");
      g.drawImage(img, 0, 0);
      g.globalCompositeOperation = "multiply";
      g.fillStyle = `rgb(${c.rgbKey()})`;
      g.fillRect(0, 0, t.width, t.height);
      g.globalCompositeOperation = "destination-in";
      g.drawImage(img, 0, 0);
      if (tintCache2.size > 500) tintCache2.clear();
      tintCache2.set(k, t);
    }
    return t;
  }
  __name(tintedOr, "tintedOr");

  // web/src/engine/audio.js
  var AudioEngine = {
    ctx: null,
    master: null,
    groups: /* @__PURE__ */ new Map(),
    groupNames: {},
    unlocked: false,
    init() {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.connect(this.ctx.destination);
      onAudioUnlock(() => {
        if (this.ctx.state !== "running") this.ctx.resume();
        this.unlocked = true;
      });
    },
    group(name = "Master") {
      if (!this.groups.has(name)) {
        const g = this.ctx.createGain();
        g.connect(name === "Master" ? this.master : this.group("Master"));
        this.groups.set(name, g);
      }
      return this.groups.get(name);
    },
    // AudioMixer.SetFloat("MusicVolume", dB)
    setVolumeDb(name, db) {
      const g = this.group(name);
      g.gain.value = db <= -79 ? 0 : Math.pow(10, db / 20);
    },
    setVolumeLinear(name, v) {
      this.group(name).gain.value = v;
    }
  };
  var AudioSource = class extends Component {
    static {
      __name(this, "AudioSource");
    }
    constructor(go) {
      super(go);
      this.clip = null;
      this.volume = 1;
      this.pitch = 1;
      this.loop = false;
      this.playOnAwake = false;
      this.mute = false;
      this._nodes = /* @__PURE__ */ new Set();
      this._main = null;
      this.groupName = "SFX";
    }
    deserialize(f) {
      this.clip = f.m_audioClip || f.m_Resource || null;
      if (this.clip && !(this.clip instanceof AudioClipRef)) this.clip = null;
      this.volume = f.m_Volume ?? 1;
      this.pitch = f.m_Pitch ?? 1;
      this.loop = !!f.Loop;
      this.playOnAwake = !!f.m_PlayOnAwake;
      this.mute = !!f.Mute;
      this.enabled = f.m_Enabled !== 0;
      const g = f.OutputAudioMixerGroup;
      this.groupKey = g && g.key;
      this.groupName = AudioEngine.groupNames[this.groupKey] || "SFX";
    }
    onEnable() {
      if (this.playOnAwake && this.clip) this.play();
    }
    onDisable() {
      this.stop();
    }
    onDestroy() {
      this.stop();
    }
    get isPlaying() {
      return !!this._main && !this._main.ended;
    }
    get time() {
      if (!this._main) return 0;
      const t = (AudioEngine.ctx.currentTime - this._main.startAt) * this.pitch;
      return this._main.dur ? this.loop ? t % this._main.dur : Math.min(t, this._main.dur) : t;
    }
    set time(v) {
      if (this._main) {
        const c = this.clip;
        this.stop();
        this._startMain(c, v);
      } else this._pendingTime = v;
    }
    _spawn(clipRef, vol, offset = 0, loop = false, main2 = false, when = 0) {
      if (!clipRef) return null;
      const ctx = AudioEngine.ctx;
      const self = this;
      const rec = { ended: false, startAt: ctx.currentTime - offset / Math.max(0.01, this.pitch), dur: clipRef.length, src: null, gain: null };
      Assets.audioBuffer(ctx, clipRef.key).then((buf) => {
        if (!buf || rec.ended) {
          rec.ended = true;
          return;
        }
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.loop = loop;
        src.playbackRate.value = self.pitch;
        const g = ctx.createGain();
        g.gain.value = self.mute ? 0 : vol;
        src.connect(g);
        g.connect(AudioEngine.group(self.groupName));
        src.onended = () => {
          if (!src.loop) {
            rec.ended = true;
            self._nodes.delete(rec);
          }
        };
        const at = Math.max(ctx.currentTime, when || 0);
        src.start(at, offset % buf.duration);
        rec.src = src;
        rec.gain = g;
        rec.dur = buf.duration;
        rec.startAt = at - offset / Math.max(0.01, self.pitch);
      });
      this._nodes.add(rec);
      return rec;
    }
    _startMain(c, t = 0) {
      this._main = this._spawn(c, this.volume, t, this.loop, true);
      if (this._main) this._main.isMain = true;
    }
    // AudioSource.PlayScheduled(dspTime): dspTime is AudioContext time here
    playScheduled(when) {
      if (this._main) this._kill(this._main);
      this._main = this._spawn(this.clip, this.volume, 0, this.loop, true, when);
      if (this._main) this._main.isMain = true;
    }
    play() {
      if (this._main) this._kill(this._main);
      this._startMain(this.clip, this._pendingTime || 0);
      this._pendingTime = 0;
    }
    playDelayed(d) {
      setTimeout(() => this.play(), d * 1e3);
    }
    playOneShot(clip, volScale = 1) {
      this._spawn(clip, this.volume * volScale);
    }
    stop() {
      for (const r of [...this._nodes]) this._kill(r);
      this._main = null;
    }
    pause() {
      this._pausedAt = this.time;
      this.stop();
      this._paused = true;
    }
    unPause() {
      if (this._paused) {
        this._paused = false;
        this._startMain(this.clip, this._pausedAt || 0);
      }
    }
    _kill(r) {
      r.ended = true;
      try {
        r.src?.stop();
      } catch {
      }
      this._nodes.delete(r);
    }
    update() {
      for (const r of this._nodes) if (r.gain) {
        r.gain.gain.value = this.mute ? 0 : r.isMain ? this.volume : r.gain.gain.value;
        if (r.src) r.src.playbackRate.value = this.pitch;
      }
    }
  };
  register(AudioSource, "AudioSource");
  register(class AudioListener extends Component {
    static {
      __name(this, "AudioListener");
    }
  }, "AudioListener");

  // web/src/engine/misc.js
  var GenericBehaviour = class extends Component {
    static {
      __name(this, "GenericBehaviour");
    }
  };
  register(GenericBehaviour, "GenericBehaviour");
  for (const n of ["UniversalAdditionalCameraData", "Light2D", "HapticSource", "HapticReceiver", "MissingScript"]) register(class extends Component {
  }, n);
  var PREFIX = "scritchy:";
  var PlayerPrefs = {
    getInt(k, d = 0) {
      const v = localStorage.getItem(PREFIX + k);
      return v === null ? d : parseInt(v, 10);
    },
    setInt(k, v) {
      localStorage.setItem(PREFIX + k, String(v | 0));
    },
    getFloat(k, d = 0) {
      const v = localStorage.getItem(PREFIX + k);
      return v === null ? d : parseFloat(v);
    },
    setFloat(k, v) {
      localStorage.setItem(PREFIX + k, String(v));
    },
    getString(k, d = "") {
      const v = localStorage.getItem(PREFIX + k);
      return v === null ? d : v;
    },
    setString(k, v) {
      localStorage.setItem(PREFIX + k, String(v));
    },
    hasKey(k) {
      return localStorage.getItem(PREFIX + k) !== null;
    },
    deleteKey(k) {
      localStorage.removeItem(PREFIX + k);
    },
    deleteAll() {
      for (const k of Object.keys(localStorage)) if (k.startsWith(PREFIX)) localStorage.removeItem(k);
    },
    save() {
    }
  };
  var Application = {
    platform: "WebGLPlayer",
    isMobilePlatform: /Mobi|Android|iPhone|iPad/.test(navigator.userAgent),
    version: "1.1.6",
    targetFrameRate: 60,
    persistentDataPath: "/save",
    isEditor: false,
    systemLanguage: navigator.language,
    openURL(u) {
      window.open(u, "_blank", "noopener");
    },
    quit() {
      location.reload();
    }
  };
  var Localization = {
    code: "en",
    table: {},
    en: {},
    listeners: /* @__PURE__ */ new Set(),
    async init() {
      this.en = await Assets.loadLocale("en");
      const saved = PlayerPrefs.getString("language", "");
      await this.setLocale(saved || "en");
    },
    async setLocale(code) {
      this.table = await Assets.loadLocale(code);
      this.code = code;
      PlayerPrefs.setString("language", code);
      for (const l of [...this.listeners]) l(code);
    },
    get(key) {
      const v = this.table[key];
      if (v && v !== "#N/A") return v;
      const e = this.en[key];
      return e && e !== "#N/A" ? e : null;
    },
    has(key) {
      return !!this.get(key);
    },
    // Smart-string style formatting: {x}, {0}
    format(str, args) {
      if (str == null) return "";
      if (!args) return str;
      return str.replace(/\{([\w.]+)(?::[^}]*)?\}/g, (m, k) => args[k] !== void 0 ? args[k] : m);
    }
  };
  var LocalizedString = class _LocalizedString2 {
    static {
      __name(this, "LocalizedString");
    }
    constructor(data) {
      if (data instanceof _LocalizedString2) {
        this.key = data.key;
        this.keyId = data.keyId;
        this.args = {};
        this.arguments = data.arguments;
        this.changed = /* @__PURE__ */ new Set();
        return;
      }
      const e = data?.m_TableEntryReference || {};
      this.key = e.m_Key || null;
      this.keyId = e.m_KeyId || 0;
      this.args = {};
      this.arguments = null;
      this.changed = /* @__PURE__ */ new Set();
      if (!this.key && this.keyId) this.key = _LocalizedString2.keyById?.(this.keyId) || null;
    }
    get isEmpty() {
      return !this.key;
    }
    getLocalizedString(...args) {
      let s2 = (this.key && Localization.get(this.key)) ?? this.key ?? "";
      if (args.length) {
        const a = {};
        args.forEach((v, i) => {
          a[i] = v;
        });
        if (args.length && typeof args[0] === "object" && !Array.isArray(args[0])) Object.assign(a, args[0]);
        s2 = Localization.format(s2, a);
      } else if (this.arguments) s2 = Localization.format(s2, this.arguments);
      if (Object.keys(this.args).length) s2 = Localization.format(s2, this.args);
      return s2;
    }
    GetLocalizedString(...a) {
      return this.getLocalizedString(...a);
    }
    set(k, v) {
      this.args[k] = v;
      this.refresh();
    }
    refresh() {
      const s2 = this.getLocalizedString();
      for (const fn of this.changed) fn(s2);
    }
    set stringChanged(fn) {
      this.changed.add(fn);
    }
    addStringChanged(fn) {
      this.changed.add(fn);
      fn(this.getLocalizedString());
    }
    removeStringChanged(fn) {
      this.changed.delete(fn);
    }
    setReference(table, key) {
      this.key = key;
      this.refresh();
    }
    get TableEntryReference() {
      return { Key: this.key };
    }
    set TableEntryReference(k) {
      this.key = typeof k === "string" ? k : k?.Key;
      this.refresh();
    }
  };
  var LocalizeStringEvent = class extends Component {
    static {
      __name(this, "LocalizeStringEvent");
    }
    deserialize(f) {
      this.stringReference = new LocalizedString(f.m_StringReference);
      this.onUpdateString = new UnityEvent(f.m_UpdateString);
      this._onLang = () => this.refreshString();
    }
    get StringReference() {
      return this.stringReference;
    }
    set StringReference(v) {
      this.stringReference = v;
      this.refreshString();
    }
    onEnable() {
      Localization.listeners.add(this._onLang);
      this.refreshString();
    }
    onDisable() {
      Localization.listeners.delete(this._onLang);
    }
    refreshString() {
      if (!this.stringReference || this.stringReference.isEmpty) return;
      const s2 = this.stringReference.getLocalizedString();
      if (this.onUpdateString.persistent.length || this.onUpdateString.listeners.length) this.onUpdateString.invoke(s2);
      else {
        const t = this.gameObject.getComponent("TextMeshProUGUI");
        if (t) t.text = s2;
      }
    }
    RefreshString() {
      this.refreshString();
    }
    setEntry(key) {
      this.stringReference.key = key;
      this.refreshString();
    }
    SetEntry(key) {
      this.setEntry(key);
    }
  };
  register(LocalizeStringEvent, "LocalizeStringEvent");
  setSerializationTypes(LocalizedString, UnityEvent);

  // web/src/game/core.js
  var register2 = register;
  var Action = class {
    static {
      __name(this, "Action");
    }
    constructor() {
      this.fns = [];
    }
    add(fn) {
      if (fn) this.fns.push(fn);
      return this;
    }
    remove(fn) {
      const i = this.fns.lastIndexOf(fn);
      if (i >= 0) this.fns.splice(i, 1);
      return this;
    }
    clear() {
      this.fns = [];
    }
    invoke(...a) {
      for (const f of [...this.fns]) {
        try {
          f(...a);
        } catch (e) {
          console.error("Action", e);
        }
      }
    }
    get count() {
      return this.fns.length;
    }
  };
  var MonoBehaviour = class extends Component {
    static {
      __name(this, "MonoBehaviour");
    }
    constructor(go) {
      super(go);
      this.ctor?.();
    }
    static get Current() {
      const c = this._current;
      if (c && !c._destroyed) return c;
      this._current = Game.findObjectOfType(this, true);
      return this._current;
    }
    static set Current(v) {
      this._current = v;
    }
  };
  var Helper = {
    getRandomWeightedIndex(chances) {
      let total = 0;
      for (const c of chances) total += c;
      const r = Random.range(0, total);
      let acc = 0;
      for (let i = 0; i < chances.length; i++) {
        acc += chances[i];
        if (r < acc) return i;
      }
      console.error("This shouldn't happen?");
      return 0;
    },
    getPredictedValueInt(base, mult, level) {
      return Math.trunc(base * Math.pow(mult, level));
    },
    getPredictedValueFloat(base, mult, level) {
      return base * Math.pow(mult, level);
    },
    getPrice(basePrice, priceIncreaseMult, buyCount) {
      return basePrice * Math.pow(priceIncreaseMult, buyCount);
    },
    getMappedIndex(layers, strength, hardness) {
      if ((layers & 1) === 0) {
        console.error("Layers should be an odd number");
        return -1;
      }
      const half = Math.trunc(layers / 2);
      let d = strength - hardness;
      if (d > half) d = half;
      if (d < -half) d = -half;
      return d + half;
    },
    // normalize SymbolChance list so chances sum to 1000; rounding remainder goes to the first entry
    getNormalizedChances(list) {
      const sum = list.reduce((a, s2) => a + s2.chance, 0);
      const out = list.map((s2) => ({ data: s2.data, chance: s2.chance * 1e3 / sum }));
      const rem = 1e3 - out.reduce((a, s2) => a + s2.chance, 0);
      if (out.length) out[0].chance += rem;
      return out;
    },
    formatTime(total) {
      total = Math.trunc(total);
      const h = Math.trunc(total / 3600), m = Math.trunc(total % 3600 / 60), s2 = total % 60;
      const p2 = /* @__PURE__ */ __name((n) => String(n).padStart(2, "0"), "p2");
      if (total < 3600) {
        if (total % 3600 < 60) return `${s2}s`;
        return `${m}m:${p2(s2)}s`;
      }
      return `${h}h:${p2(m)}m:${p2(s2)}s`;
    },
    round(v) {
      if (Math.abs(v) >= 1e16) return v;
      const r = Math.round(Math.abs(v));
      return Math.sign(v) * r;
    },
    pickRandom(list) {
      return list[Random.rangeInt(0, list.length)];
    },
    nullOrEmpty(s2) {
      return s2 == null || s2 === "";
    },
    removeNumbersFromString(s2) {
      return s2 ? s2.replace(/[0-9]/g, "") : s2;
    },
    base64Encode(s2) {
      return btoa(unescape(encodeURIComponent(s2)));
    },
    base64Decode(s2) {
      return decodeURIComponent(escape(atob(s2)));
    },
    async copyToClipboard(t) {
      try {
        await navigator.clipboard.writeText(t);
      } catch {
        window.prompt("Copy this:", t);
      }
    },
    async readFromClipboard() {
      try {
        return await navigator.clipboard.readText();
      } catch {
        return window.prompt("Paste here:") || "";
      }
    },
    getVersion() {
      return "1.1.6";
    }
  };
  var SUFFIX = ["M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];
  var SUFFIX_K = ["K", ...SUFFIX];
  function fmtN0(n) {
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  __name(fmtN0, "fmtN0");
  function numString(num, includeK, spacing) {
    if (!includeK && num < 1e6 || includeK && num < 1e3) return fmtN0(num).replace(/,/g, `<space=${trimNum(spacing * 2)}>`);
    const list = includeK ? SUFFIX_K : SUFFIX;
    let idx = includeK ? -1 : -2;
    let v = num;
    if (num >= 1e3) {
      while (idx !== list.length - 1) {
        v /= 1e3;
        idx++;
        if (v < 1e3) break;
      }
    }
    if (num >= 1e36) {
      let s2 = num.toExponential(2).replace("e+", "e");
      const i = s2.indexOf("e");
      return s2.slice(0, i) + "<space=4>" + s2.slice(i);
    }
    const str = v < 10 ? v.toFixed(2) : v < 100 ? v.toFixed(1) : v.toFixed(0);
    return `${str}<space=${trimNum(spacing * 4)}>${list[idx]}`;
  }
  __name(numString, "numString");
  function trimNum(n) {
    return Number.isInteger(n) ? String(n) : String(+n.toFixed(4));
  }
  __name(trimNum, "trimNum");
  function fmt(num, includeK = false, spacingMult = 1) {
    if (!isFinite(num)) return "Infinity";
    const s2 = numString(Math.abs(num), includeK, spacingMult);
    return num < 0 && s2 !== "0" ? "-" + s2 : s2;
  }
  __name(fmt, "fmt");
  var _singletons = /* @__PURE__ */ new Map();
  function cur(name) {
    const c = _singletons.get(name);
    if (c && !c._destroyed && !c.gameObject._destroyed && c.gameObject.scene?.isLoaded !== false && c.gameObject.scene) return c;
    const f = Game.findObjectOfType(name, true);
    if (f) _singletons.set(name, f);
    else _singletons.delete(name);
    return f;
  }
  __name(cur, "cur");

  // web/src/game/data.js
  var TicketDataUtil = {
    getSharedID(id) {
      return id && id.includes("_") ? id.split("_")[0] : id;
    },
    getDisplayName(d) {
      return d.id.includes("Final Chance") ? "Final Chance" : d.id;
    }
  };
  var StaticData = class extends MonoBehaviour {
    static {
      __name(this, "StaticData");
    }
    static get executionOrder() {
      return -1e3;
    }
    awake() {
      this.ticketData = {};
      this.symbolData = {};
      this.upgradeData = {};
      this.perkData = {};
      this.dialogueData = {};
      this.progressionGoalData = [];
      this.challengeData = {};
      this.achievementData = {};
      this.loanData = {};
      this.cosmeticData = {};
      this.machineTiersData = {};
      const D = Assets.data;
      for (const [k, v] of Object.entries(D.TicketData || {})) this.ticketData[k] = { ...v, symbols: [] };
      for (const [k, v] of Object.entries(D.SymbolData || {})) this.symbolData[k] = { ...v };
      for (const [k, v] of Object.entries(D.UpgradeData || {})) this.upgradeData[k] = { ...v, OnValueModified: new Action() };
      for (const [k, v] of Object.entries(D.PerkData || {})) this.perkData[k] = { ...v };
      this.dialogueData = D.DialogueData || {};
      this.progressionGoalData = Object.values(D.ProgressionGoalData || {});
      if (Array.isArray(D.ProgressionGoalData)) this.progressionGoalData = D.ProgressionGoalData;
      this.challengeData = D.ChallengeData || {};
      this.achievementData = D.AchievementData || {};
      this.loanData = D.LoanData || {};
      this.cosmeticData = D.CosmeticsData || {};
      this.machineTiersData = D.MachineTiersData || {};
      this.spriteDict = /* @__PURE__ */ new Map();
      this.animatorControllerDict = /* @__PURE__ */ new Map();
      for (const p of ["Tickets/Sprites", "Tickets/Symbols", "Upgrades", "Perks", "Challenges", "Achievements/Sprites", "Cosmetics"]) this.loadSprites(p);
      this.loadAnimatorControllers("Cosmetics");
      this.ticketPrefabs = /* @__PURE__ */ new Map();
      for (const node of Assets.loadAllPrefabs("Tickets/Prefabs")) this.ticketPrefabs.set(node.name, new PrefabRef(node, node.id));
      this.groupedSymbols = /* @__PURE__ */ new Map();
      for (const s2 of Object.values(this.symbolData)) {
        if (!this.groupedSymbols.has(s2.ticketID)) this.groupedSymbols.set(s2.ticketID, []);
        this.groupedSymbols.get(s2.ticketID).push(s2);
      }
      for (const t of Object.values(this.ticketData)) t.symbols = this.getSymbols(t.id) || [];
    }
    loadSprites(path) {
      for (const s2 of Assets.loadAllSprites(path)) this.spriteDict.set(s2.name, s2);
    }
    loadAnimatorControllers(path) {
      for (const e of Assets.resourcesUnder(path)) if (e.type === "AnimatorController") {
        const c = Assets.controllers[e.key];
        if (c) this.animatorControllerDict.set(c.name, { key: e.key, ...c });
      }
    }
    getData(dict, id, type) {
      const v = dict instanceof Map ? dict.get(id) : dict[id];
      if (v === void 0) console.error(`Could not find ${type} with ID: ${id}`);
      return v ?? null;
    }
    getSprite(id) {
      const s2 = this.spriteDict.get(String(id).replace("?", ""));
      if (!s2) console.error("Could not find sprite with ID: " + id);
      return s2 || null;
    }
    hasSprite(id) {
      return this.spriteDict.has(id);
    }
    getAnimatorController(id) {
      return this.animatorControllerDict.get(id) || null;
    }
    hasAnimatorController(id) {
      return this.animatorControllerDict.has(id);
    }
    getTicketData(id) {
      return this.getData(this.ticketData, id, "ticket data");
    }
    getSymbols(ticketID) {
      const l = this.groupedSymbols.get(ticketID);
      if (!l) console.error("Could not find symbols for ticket ID: " + ticketID);
      return l || null;
    }
    getSingleSymbol(id) {
      return this.getData(this.symbolData, id, "symbol");
    }
    getUpgradeData(id) {
      return this.getData(this.upgradeData, id, "upgrade data");
    }
    getPerkData(id) {
      return this.perkData[id] || null;
    }
    getDialogueData(id) {
      return this.getData(this.dialogueData, id, "dialogue");
    }
    getChallengeData(id) {
      return this.getData(this.challengeData, id, "challenge");
    }
    getAchievementData(id) {
      return this.getData(this.achievementData, id, "achievement");
    }
    getCosmeticData(id) {
      return this.getData(this.cosmeticData, id, "cosmetic");
    }
    getLoanData(id) {
      return this.getData(this.loanData, id, "loan");
    }
    getTicketPrefab(id) {
      return this.getData(this.ticketPrefabs, id, "ticket prefab");
    }
    getTicketSprite(id) {
      return this.getSprite(TicketDataUtil.getSharedID(id));
    }
    getTableItemSprite(id) {
      return this.getSprite(TicketDataUtil.getSharedID(id) + "_Small");
    }
    getIDType(id) {
      if (this.ticketData[id]) return 0;
      if (this.upgradeData[id]) return 1;
      if (this.perkData[id]) return 2;
      return -1;
    }
  };
  register2(StaticData);
  var CURRENT_SAVE_VERSION = "0.1";
  var STARTING_MONEY = 1;
  function newLayerOne() {
    const sd = StaticData.Current;
    const l = {
      money: STARTING_MONEY,
      timeSpentInThisPrestige: 0,
      ticketProgressionDict: {},
      upgradeDataDict: {},
      tableItems: [],
      tableItemSaves: [],
      jackpotsGotten: [],
      superJackpotsGotten: [],
      lastUnlockedProgressionGoal: 0,
      totalMoneyEarnedThisProgressionGoal: 0,
      claimedCustomTableItems: [],
      firstTicketOpened: false,
      loans: [],
      bankruptcyWarningGiven: false,
      initializedChallenge: false,
      initializedPerks: false,
      machineTier: 0,
      machineFeedCount: 0,
      machineProcessingTimeLeft: 0,
      souls: 0,
      lastTicketUnlocked: null,
      electricFanChargeLeft: 0,
      fanPaused: false,
      eggTimerChargeLeft: 0,
      mundoDead: false,
      trashCanDead: false,
      boughtScratchOff: false
    };
    if (sd) {
      for (const id of Object.keys(sd.ticketData)) l.ticketProgressionDict[id] = { id, xp: 0, level: 0 };
      for (const id of Object.keys(sd.upgradeData)) l.upgradeDataDict[id] = { id, buyCount: 0 };
    }
    return l;
  }
  __name(newLayerOne, "newLayerOne");
  function newSaveData() {
    return {
      saveVersion: CURRENT_SAVE_VERSION,
      gameVersion: Helper.getVersion(),
      timestamp: Date.now(),
      playedTime: 0,
      layerOne: newLayerOne(),
      prestigeCount: 0,
      prestigeCurrency: 0,
      currentAct: 1,
      deathByFinalChanceCount: 0,
      fadeInFromWhite: false,
      diamondsGottenFromTicket: [],
      dialoguesPlayed: [],
      boughtPrestigeUpgrades: {},
      totalPrestigeCurrencySpent: 0,
      activeChallenge: null,
      completedChallenges: [],
      achievementsGotten: [],
      achievementsClaimed: [],
      unlockedCosmetics: [],
      boughtCosmetics: [],
      equippedCosmetics: [],
      completedOnboardingSteps: [],
      dlcUnlocked: [],
      isPrestiging: false,
      deathByFinalChance: false,
      deathCount: 0,
      loanCount: 0,
      tokens: 0
    };
  }
  __name(newSaveData, "newSaveData");
  function fixupSave(s2) {
    const fresh = newSaveData();
    for (const k of Object.keys(fresh)) if (s2[k] === void 0) s2[k] = fresh[k];
    const fl = newLayerOne();
    for (const k of Object.keys(fl)) if (s2.layerOne[k] === void 0) s2.layerOne[k] = fl[k];
    for (const [id, v] of Object.entries(fl.ticketProgressionDict)) if (!s2.layerOne.ticketProgressionDict[id]) s2.layerOne.ticketProgressionDict[id] = v;
    for (const [id, v] of Object.entries(fl.upgradeDataDict)) if (!s2.layerOne.upgradeDataDict[id]) s2.layerOne.upgradeDataDict[id] = v;
    return s2;
  }
  __name(fixupSave, "fixupSave");
  var Save = {
    _current: null,
    get Current() {
      if (!this._current) console.error("Save file is null!");
      return this._current;
    },
    set Current(v) {
      this._current = v;
    },
    get HasSaveFileLoaded() {
      return !!this._current;
    },
    money() {
      return Helper.round(this._current.layerOne.money);
    },
    setMoney(d) {
      this._current.layerOne.money = Helper.round(d);
    },
    addMoney(d) {
      this._current.layerOne.money = Helper.round(this._current.layerOne.money + d);
    },
    getTicketProgressionData(id) {
      const d = this._current?.layerOne?.ticketProgressionDict?.[id];
      if (!d) {
        console.error("Could not find ticket progression data with id: " + id);
        return null;
      }
      return d;
    },
    getUpgradeSaveData(id) {
      const d = this._current?.layerOne?.upgradeDataDict?.[id];
      if (!d) {
        console.error("Could not find upgrade save data with id: " + id);
        return null;
      }
      return d;
    },
    getPrestigeUpgradeBuyCount(id) {
      return this._current?.boughtPrestigeUpgrades?.[id] ?? 0;
    },
    trySubtractPrestigeCurrency(n) {
      const s2 = this._current;
      if (n > s2.prestigeCurrency) return false;
      s2.totalPrestigeCurrencySpent += n;
      s2.prestigeCurrency -= n;
      return true;
    },
    getTokens() {
      return Helper.round(this._current.tokens);
    },
    addTokens(d) {
      this._current.tokens = Helper.round(this._current.tokens + d);
    },
    setTokens(d) {
      this._current.tokens = Helper.round(d);
    },
    trySubtractTokens(d) {
      if (this.getTokens() < d) return false;
      this.addTokens(-d);
      return true;
    },
    totalMoneyEarned() {
      return Helper.round(this._current.layerOne.totalMoneyEarnedThisProgressionGoal);
    },
    addTotalMoneyEarned(d) {
      const l = this._current.layerOne;
      l.totalMoneyEarnedThisProgressionGoal = Helper.round(l.totalMoneyEarnedThisProgressionGoal + d);
    },
    setTotalMoneyEarned(d) {
      this._current.layerOne.totalMoneyEarnedThisProgressionGoal = Helper.round(d);
    }
  };
  var SaveStorage = {
    key(name) {
      return `scritchy:save:${name}`;
    },
    exists(name) {
      return localStorage.getItem(this.key(name)) !== null;
    },
    tryLoad(name) {
      try {
        const t = localStorage.getItem(this.key(name));
        return t ? JSON.parse(t) : null;
      } catch (e) {
        console.error("save load failed", e);
        return null;
      }
    },
    save(name, data) {
      try {
        localStorage.setItem(this.key(name), JSON.stringify(data));
      } catch (e) {
        console.error("save failed", e);
      }
    },
    remove(name) {
      localStorage.removeItem(this.key(name));
    },
    list(prefix) {
      return Object.keys(localStorage).filter((k) => k.startsWith(this.key(prefix))).map((k) => k.slice(this.key("").length));
    },
    getSaveAsJson(name) {
      return localStorage.getItem(this.key(name));
    }
  };
  var SaveManager = class extends MonoBehaviour {
    static {
      __name(this, "SaveManager");
    }
    static get executionOrder() {
      return -900;
    }
    awake() {
      this.saveName = this.saveName || "save";
      this.ConflictingSaveDetected = new Action();
      let data = SaveStorage.tryLoad(this.saveName);
      if (!data) {
        data = newSaveData();
        data.layerOne.money = STARTING_MONEY;
      }
      Save.Current = fixupSave(data);
      this._lastStamp = Date.now();
      this.startCoroutine(this.updateGameWithLoadedData());
    }
    *updateGameWithLoadedData() {
      yield null;
      const player = cur("Player");
      const spawner = cur("ItemSpawner");
      if (Save.Current.isPrestiging) {
        cur("PrestigeManager")?.death(Save.Current.deathByFinalChance, false, true);
        return;
      }
      cur("TicketShop")?.loadData();
      cur("UpgradeShop")?.loadData();
      player?.wallet?.updateMoneyLabel();
      cur("ProgressionManager")?.loadData();
      if (player && spawner) for (const s2 of Save.Current.layerOne.tableItemSaves || []) spawner.spawnTableItemFromSave(s2);
      player?.loadData?.();
      player?.checkBankruptOnLoad();
    }
    save() {
      const s2 = Save.Current;
      if (!s2) return;
      const player = cur("Player");
      if (player?.TableItems) s2.layerOne.tableItemSaves = player.TableItems.filter((t) => t && !t._destroyed).map((t) => t.generateSave());
      const now = Date.now();
      s2.playedTime += now - s2.timestamp;
      s2.timestamp = now;
      SaveStorage.save(this.saveName, s2);
    }
    clearSave() {
      const player = cur("Player");
      if (player?.TableItems) player.TableItems.length = 0;
      Save.Current = newSaveData();
      Save.Current.layerOne.money = STARTING_MONEY;
      this.save();
    }
    resetLayerOne() {
      const player = cur("Player");
      if (player?.TableItems) player.TableItems.length = 0;
      Save.Current.layerOne = newLayerOne();
      this.save();
    }
    export() {
      this.save();
      return Helper.base64Encode(JSON.stringify(Save.Current));
    }
    import(data) {
      Save.Current = fixupSave(data);
      SaveStorage.save(this.saveName, Save.Current);
    }
    onApplicationQuit() {
      this.save();
    }
  };
  register2(SaveManager);
  var AutoSaver = class extends MonoBehaviour {
    static {
      __name(this, "AutoSaver");
    }
    start() {
      this.elapsedTime = 0;
      window.addEventListener("beforeunload", () => this.save());
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) this.save();
      });
    }
    update() {
      this.elapsedTime += Time.unscaledDeltaTime;
      if (this.elapsedTime >= (this.timeBetweenAutoSaves || 30)) {
        this.elapsedTime = 0;
        this.save();
      }
    }
    save() {
      const sm = Game.findObjectOfType(SaveManager);
      if (!sm || !Save.HasSaveFileLoaded) return;
      sm.save();
      const n = Math.max(1, this.autoSaveCount || 3);
      this._slot = (this._slot || 0) % n + 1;
      SaveStorage.save(`autosave_${this._slot}`, Save.Current);
    }
  };
  register2(AutoSaver);

  // web/src/game/stubs.js
  var GlobalEvents = class extends MonoBehaviour {
    static {
      __name(this, "GlobalEvents");
    }
    ctor() {
      for (const n of [
        "OnJackpot",
        "OnTicketCashedOut",
        "OnSymbolSlotRevealed",
        "OnTicketTrashed",
        "OnTableItemTrashed",
        "OnDeathByFinalChance",
        "OnChallengeCompleted",
        "OnScratchedSlot",
        "OnTicketUnlocked",
        "OnCatalogUnlocked",
        "OnGameSceneLoaded",
        "OnTableItemSpawned",
        "OnFinalChanceScratched",
        "OnPrestigeUpgradeBought"
      ]) this[n] = new Action();
    }
    awake() {
      Game.dontDestroyOnLoad(this.gameObject);
    }
    callAfterTime(duration, action) {
      this.startCoroutine(function* () {
        yield new WaitForSeconds(duration);
        action();
      });
    }
    callNextFrame(action) {
      this.startCoroutine(function* () {
        yield null;
        action();
      });
    }
  };
  register2(GlobalEvents);

  // web/src/game/persistent.js
  var AudioManager = class extends MonoBehaviour {
    static {
      __name(this, "AudioManager");
    }
    ctor() {
      this.audioDict = /* @__PURE__ */ new Map();
      this.rewardSoundIndex = 0;
      this.loseSoundIndex = 0;
      this.lastRewardSoundTime = -999;
    }
    start() {
      for (const e of Assets.resourcesUnder("Audio")) {
        if (e.type !== "AudioClip") continue;
        const clip = new AudioClipRef(e.key);
        const id = Helper.removeNumbersFromString(clip.name);
        if (!this.audioDict.has(id)) this.audioDict.set(id, []);
        this.audioDict.get(id).push(clip);
      }
    }
    getAudioFromID(id) {
      const l = this.audioDict.get(id);
      if (!l) {
        console.error("Could not find sound with id: " + id);
        return null;
      }
      return l[Random.rangeInt(0, l.length)];
    }
    playSound(idOrClip, volume = 1) {
      const clip = typeof idOrClip === "string" ? this.getAudioFromID(idOrClip) : idOrClip;
      if (clip) this.sfxSource?.playOneShot(clip, volume);
    }
    playRandomPitchSound(id, minPitch, maxPitch, volume = 1) {
      const src = this.randomPitchSfxSource;
      if (!src) return;
      src.pitch = Random.range(minPitch, maxPitch);
      const clip = this.getAudioFromID(id);
      if (clip) src.playOneShot(clip, volume);
    }
    playRewardSound(jackpot) {
      if (Time.time - this.lastRewardSoundTime < this.rewardSoundCooldown) return;
      this.lastRewardSoundTime = Time.time;
      const list = this.audioDict.get(jackpot ? "rewardJackpot" : "reward");
      if (!list) return;
      this.sfxSource?.playOneShot(list[Math.min(this.rewardSoundIndex, list.length - 1)]);
      this.rewardSoundIndex = this.rewardSoundIndex + 1 <= list.length - 1 ? this.rewardSoundIndex + 1 : 0;
    }
    playLoseSound() {
      if (!cur("Player")?.scratching?.CurrentTicket) return;
      const list = this.audioDict.get("lose");
      if (!list) return;
      this.sfxSource?.playOneShot(list[Math.min(this.loseSoundIndex, list.length - 1)]);
      this.loseSoundIndex = this.loseSoundIndex + 1 <= list.length - 1 ? this.loseSoundIndex + 1 : 0;
    }
    resetRewardSound() {
      this.rewardSoundIndex = 0;
    }
    resetLoseSound() {
      this.loseSoundIndex = 0;
    }
    playSoundDelayed(delay, sound, volume = 1) {
      this.startCoroutine(function* () {
        yield new WaitForSeconds(delay);
        this.playSound(sound, volume);
      });
    }
  };
  register2(AudioManager);
  var BuildModeManager = class extends MonoBehaviour {
    static {
      __name(this, "BuildModeManager");
    }
    get Mode() {
      return this.buildModeSO?.mode ?? 0;
    }
  };
  register2(BuildModeManager);
  var GameManager = class extends MonoBehaviour {
    static {
      __name(this, "GameManager");
    }
    awake() {
      this.IntroPopupShown = false;
      this.IsInMainMenu = Game.activeScene?.name === "Main Menu";
      Game.sceneLoadedHandlers.push((sc) => {
        if (sc.name !== "Persistent") this.IsInMainMenu = sc.name === "Main Menu";
      });
      if (this.versionNumberLabel) this.versionNumberLabel.text = "v" + Helper.getVersion();
    }
  };
  register2(GameManager);
  var CursorManager = class extends MonoBehaviour {
    static {
      __name(this, "CursorManager");
    }
    ctor() {
      this.spriteDict = /* @__PURE__ */ new Map();
      this.isHoveringScratchAreaBacking = false;
      this.UseOverrideCursorIcons = false;
      this.OverrideCursorIcon = null;
      this.OverrideCursorIconPressed = null;
    }
    start() {
      for (const s2 of Assets.loadAllSprites("Cursors")) this.spriteDict.set(s2.name.replace("Cursor_", ""), s2);
      this.refreshSprites();
      Renderer.canvas.style.cursor = "none";
    }
    get IsHoveringScratchArea() {
      return this.isHoveringScratchAreaBacking;
    }
    set IsHoveringScratchArea(v) {
      this.isHoveringScratchAreaBacking = !!v;
      this.refreshSprites();
    }
    updateCursorImage() {
      this.refreshSprites();
    }
    refreshSprites() {
      if (this.UseOverrideCursorIcons) {
        this.unpressedSprite = this.OverrideCursorIcon;
        this.pressedSprite = this.OverrideCursorIconPressed || this.OverrideCursorIcon;
        return;
      }
      this.unpressedSprite = this.defaultSprite;
      this.pressedSprite = this.defaultSpritePressed;
      const player = cur("Player");
      if (!player || !this.isHoveringScratchAreaBacking) return;
      const tool = player.scratching?.scratchTool;
      if (!tool) return;
      let name = tool.currentCoinName ?? tool.coinName ?? null;
      const ticketId = player.scratching?.CurrentTicket?.Data?.id;
      if (ticketId === "Day Job" || ticketId === "Loan") {
        name = ticketId;
        if (ticketId === "Day Job" && cur("PerkManager")?.tryGetActivePerk?.(23)) name = "Day Job Big";
      } else if (name) {
        const sizes = ["S", "M", "L"];
        const i = Math.max(0, Math.min(sizes.length - 1, tool.getCurrentCoinSize?.() ?? 0));
        name = `${name}_${sizes[i]}`;
      }
      const s2 = name && this.spriteDict.get(name);
      if (s2) {
        this.unpressedSprite = s2;
        this.pressedSprite = this.spriteDict.get(name + "_Click") || s2;
      }
    }
    // UpdateCursorSprite(cursorImg, alwaysUseDefault, cursorScreenPos)
    updateCursorSprite(img, alwaysUseDefault, pos) {
      if (!img) return;
      const player = cur("Player");
      const hover = cur("WristProtectionManager")?.Mode === 1;
      const pressed = Input.getMouseButton(0) || hover && !!player?.scratching?.CurrentTicket;
      let sp;
      if (alwaysUseDefault || player?.PanelOverlayActive) sp = Input.getMouseButton(0) ? this.defaultSpritePressed : this.defaultSprite;
      else sp = (pressed ? this.pressedSprite : this.unpressedSprite) || this.defaultSprite;
      if (sp && img.sprite !== sp) img.sprite = sp;
      if (img.sprite?.rw) {
        const rt2 = img.transform;
        rt2.sizeDelta = { x: img.sprite.rw, y: img.sprite.rh };
      }
      const cv = img.canvas?.rootCanvas;
      const k = cv?.scaleFactor || 1;
      const rt = img.transform;
      rt.anchorMin = { x: 0, y: 0 };
      rt.anchorMax = { x: 0, y: 0 };
      rt.anchoredPosition = { x: pos.x / k, y: pos.y / k };
    }
    update() {
      const img = this.cursorImage;
      if (!img) return;
      const mouse = Input.pointerType === "mouse";
      img.gameObject.setActive(mouse);
      const sec = this.secondaryCursorImage;
      const holdMode = cur("WristProtectionManager")?.Mode === 2 && !!cur("Player")?.scratching?.CurrentTicket;
      if (holdMode) {
        this.updateCursorSprite(img, true, Input.mousePosition);
        const show = Input.getMouseButton(0) && mouse;
        sec?.gameObject.setActive(show);
        if (sec) sec.enabled = show;
        if (show && sec) {
          const w = cur("Player").scratching.CurrentScratchScreenPos || Input.mousePosition;
          this.updateCursorSprite(sec, false, w);
        }
      } else {
        this.updateCursorSprite(img, false, Input.mousePosition);
        sec?.gameObject.setActive(false);
      }
    }
  };
  register2(CursorManager);
  for (const name of ["AnalyticsManager", "IAPManager", "SteamManager", "DebugTools", "HapticsManager", "HapticReceiver", "DLCManager", "AppleGameCenterManager", "GooglePlayManager"]) {
    const C = class extends MonoBehaviour {
      static {
        __name(this, "C");
      }
      awake() {
        this.initialized = true;
      }
      isOwned() {
        return false;
      }
      Init() {
      }
      init() {
      }
      sendEvent() {
      }
      trackEvent() {
      }
      hasDLC() {
        return false;
      }
      isDLCOwned() {
        return false;
      }
    };
    Object.defineProperty(C, "name", { value: name });
    register2(C, name);
  }
  var SceneTransitionManager = class extends MonoBehaviour {
    static {
      __name(this, "SceneTransitionManager");
    }
    ctor() {
      this.loadedScene = false;
      this.progress = 0;
      this.invert = 0;
    }
    awake() {
      Game.dontDestroyOnLoad?.(this.gameObject);
    }
    start() {
      const img = this.image;
      if (!img) return;
      this.progress = this.progressMaxValue;
      img.customRender = (ctx, r) => this.renderWipe(ctx, r);
      img.transform.localScale = img.transform.localScale.mul ? img.transform.localScale.mul(this.mobileScale) : img.transform.localScale;
      Game.sceneLoadedHandlers.push(() => this.onSceneLoaded());
      this.startCoroutine(this.doHide(null));
    }
    renderWipe(ctx, r) {
      const P = this.progress / (this.progressMaxValue || 1) * 2.25;
      if (P <= 0) return;
      const cols = 15, cw = r.width / cols, rows = Math.ceil(r.height / cw);
      ctx.fillStyle = this.image.color.css(1);
      if (P >= 2.25) {
        ctx.fillRect(r.x, r.y, r.width, r.height);
        return;
      }
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        let d = (i / (cols - 1) + j / Math.max(1, rows - 1)) / 2;
        if (this.invert) d = 1 - d;
        const k = Math.min(1, Math.max(0, P - d * 1.25));
        if (k <= 0) continue;
        const sz = cw * k * 1.02;
        ctx.fillRect(r.x + (i + 0.5) * cw - sz / 2, r.y + (j + 0.5) * cw - sz / 2, sz, sz);
      }
    }
    show(cb = null) {
      this.startCoroutine(this.doShow(cb));
    }
    *doShow(cb) {
      this.invert = 0;
      let t = 0;
      while (t < this.duration) {
        t += Time.unscaledDeltaTime;
        this.progress = this.progressMaxValue * Math.min(1, t / this.duration);
        yield null;
      }
      this.progress = this.progressMaxValue;
      cb?.();
    }
    hide(cb = null) {
      this.startCoroutine(this.doHide(cb));
    }
    *doHide(cb) {
      this.invert = 1;
      let t = 0;
      while (t < this.duration) {
        t += Math.min(Time.deltaTime, 0.05);
        this.progress = this.progressMaxValue - t / this.duration * this.progressMaxValue;
        yield null;
      }
      this.progress = 0;
      cb?.();
    }
    loadScene(name, mode = 0) {
      if (Game.activeScene?.name !== name) {
        const mm = cur("MusicManager");
        mm?.fadeOut?.(this.duration);
      }
      this.show(() => {
        this.loadedScene = true;
        Game.loadScene(name, mode === 1);
      });
    }
    onSceneLoaded() {
      if (!this.loadedScene) return;
      this.loadedScene = false;
      this.hide(null);
    }
    quitGame() {
      this.show(() => {
        location.reload();
      });
    }
  };
  register2(SceneTransitionManager);

  // web/src/game/perks.js
  var PerkType = {
    Null: -1,
    Recycling: 0,
    HonestWork: 1,
    SoftHands: 2,
    CleanFreak: 3,
    SelfMadeMillionaire: 7,
    StarterKit: 8,
    BeginnersLuck: 12,
    Completionist: 13,
    QuickLearner: 14,
    SmartInvestment: 15,
    BigWinner: 16,
    Stacker: 17,
    Collector: 18,
    HandsOff: 19,
    NightMarket: 20,
    BoosterKit: 21,
    LessIsMore: 22,
    ToolBelt: 23,
    JackpotPower: 24,
    IgnoranceIsBliss: 25,
    Challenges: 26,
    MuscleMemory: 27,
    LearnByDoing: 28,
    LoanShark: 29,
    Experienced: 30,
    Allowance: 31,
    ElectricFan: 32,
    AirCondition: 33,
    PetLover: 34,
    PickyEater: 35,
    FullyAutomated: 36,
    Dishwasher: 37,
    FineDining: 38,
    BuiltDifferent: 40,
    Magic: 41,
    ShoppingSpree: 42,
    Hotkeys: 43,
    Refund: 44,
    SuperLucky: 45,
    TimeTravel: 46,
    PlateMaster5000: 47
  };
  var TypeByName = Object.fromEntries(Object.entries(PerkType).map(([k, v]) => [k, v]));
  function perkValue(p) {
    if (!p) return 0;
    const count = Save.Current?.boughtPrestigeUpgrades?.[p.id] ?? 0;
    const v = p.description && p.description.includes("%") ? p.value / 100 : p.value;
    return v * count;
  }
  __name(perkValue, "perkValue");
  var PerkManager = class extends MonoBehaviour {
    static {
      __name(this, "PerkManager");
    }
    ctor() {
      this.activePerks = /* @__PURE__ */ new Map();
      this.symbols = [];
    }
    awake() {
      const s2 = Save.Current;
      if (!s2) return;
      const challengeActive = !!s2.activeChallenge;
      const sd = cur("StaticData");
      for (const [id, count] of Object.entries(s2.boughtPrestigeUpgrades || {})) {
        if (challengeActive && id !== "Challenges") continue;
        const pd = sd?.getPerkData(id);
        if (pd) this.activatePerk(TypeByName[pd.type] ?? pd.type, count);
      }
    }
    start() {
      const l = Save.Current?.layerOne;
      if (!l || l.initializedPerks) return;
      l.initializedPerks = true;
      if (this.tryGetActivePerk(PerkType.Allowance)) {
        const p = cur("Player");
        const m = Save.money();
        if (100 - m > 0) p?.wallet?.addMoney(100 - m, "Reward");
      }
    }
    tryGetActivePerk(type) {
      const t = this.activePerks.get(type);
      return t ? t.data : null;
    }
    TryGetActivePerk(type) {
      return this.tryGetActivePerk(type);
    }
    _setUpgrade(id, n) {
      const u = Save.getUpgradeSaveData(id);
      if (u && u.buyCount < n) u.buyCount = n;
    }
    activatePerk(type, count) {
      const sd = cur("StaticData");
      const name = Object.keys(PerkType).find((k) => PerkType[k] === type);
      const display = name ? name.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([A-Z])([A-Z][a-z])/g, "$1 $2") : "";
      const data = sd?.getPerkData(display) || Object.values(sd?.perkData || {}).find((p) => TypeByName[p.type] === type);
      this.activePerks.set(type, { data, count });
      const enable = /* @__PURE__ */ __name((cls, upgrade) => {
        const c = Game.findObjectOfType(cls, true);
        if (c) c.gameObject.setActive(true);
        if (upgrade) {
          const u = Save.getUpgradeSaveData(upgrade);
          if (u) u.buyCount = Math.max(1, u.buyCount);
        }
      }, "enable");
      switch (type) {
        case PerkType.StarterKit:
          enable("ScratchBot", "Scratch Bot");
          break;
        case PerkType.BoosterKit: {
          const v = Math.trunc(perkValue(data));
          this._setUpgrade("Scratch Bot Speed", v);
          this._setUpgrade("Scratch Bot Capacity", v);
          this._setUpgrade("Scratch Bot Strength", v);
          break;
        }
        case PerkType.AirCondition:
          enable("Fan", "Fan");
          break;
        case PerkType.PetLover:
          enable("Mundo", "Mundo");
          break;
        case PerkType.FullyAutomated:
          enable("SubscriptionBot", "Subscription Bot");
          break;
        case PerkType.Magic: {
          const u = Save.getUpgradeSaveData("Spell Book");
          if (u && u.buyCount < 1) u.buyCount = 1;
          const sb = cur("SpellBook");
          if (sb) sb.CanUse = true;
          break;
        }
        case PerkType.TimeTravel:
          enable("EggTimer", "Egg Timer");
          break;
        case PerkType.Challenges:
        case PerkType.ShoppingSpree:
          cur("PrestigePanel")?.updatePerkVisibility?.();
          break;
        default:
          break;
      }
    }
    setUpgradeStartingCount(id, count) {
      this._setUpgrade(id, count);
    }
    deactivatePerk(type) {
      this.activePerks.delete(type);
    }
    deactivateAllPerks() {
      this.activePerks.clear();
    }
    // Sum of additive bonuses applied to a ticket's payout (min 1)
    getTicketMult(ticket) {
      let m = 1;
      let p;
      const prog = ticket?.Data ? Save.getTicketProgressionData(ticket.Data.id) : null;
      if ((p = this.tryGetActivePerk(PerkType.BeginnersLuck)) && prog && prog.xp === 0 && prog.level === 0) m += perkValue(p);
      if ((p = this.tryGetActivePerk(PerkType.CleanFreak)) && ticket?.Data?.id === "Day Job" && prog) m += perkValue(p) * prog.level;
      if ((p = this.tryGetActivePerk(PerkType.Completionist)) && ticket?.AllScratched) m += perkValue(p);
      if ((p = this.tryGetActivePerk(PerkType.SmartInvestment)) && prog) m += perkValue(p) * prog.level;
      if ((p = this.tryGetActivePerk(PerkType.BigWinner)) && ticket?.IsJackpot) m += perkValue(p);
      const player = cur("Player");
      if ((p = this.tryGetActivePerk(PerkType.Stacker)) && player) {
        let n = 0;
        for (const t of player.TableItems) if (t !== player.CurrentActiveTableItem && t.Data?.id === ticket.Data.id) n++;
        m += perkValue(p) * Math.trunc(n / 10);
      }
      if ((p = this.tryGetActivePerk(PerkType.Collector)) && player) {
        const set = /* @__PURE__ */ new Set();
        for (const t of player.TableItems) if (t !== player.CurrentActiveTableItem) set.add(t.Data?.id);
        m += perkValue(p) * set.size;
      }
      if ((p = this.tryGetActivePerk(PerkType.HandsOff)) && ticket?.AutoScratched) m += perkValue(p);
      if ((p = this.tryGetActivePerk(PerkType.SelfMadeMillionaire)) && ticket && !ticket.AutoScratched) m += perkValue(p);
      if ((p = this.tryGetActivePerk(PerkType.LessIsMore)) && ticket && !ticket.hasJackpot(false)) m += perkValue(p);
      if ((p = this.tryGetActivePerk(PerkType.IgnoranceIsBliss)) && ticket) {
        for (const s2 of ticket.Symbols) if (s2.ScratchPercentage - s2.StartScratchPercentage < 0.02) m += perkValue(p);
      }
      if (p = this.tryGetActivePerk(PerkType.MuscleMemory)) m += perkValue(p);
      return Math.max(1, m);
    }
    getTicketXP(ticketData, xp, wasTrashed, autoScratched) {
      let p;
      if (p = this.tryGetActivePerk(PerkType.QuickLearner)) xp = Math.trunc(perkValue(p)) * xp;
      if ((p = this.tryGetActivePerk(PerkType.HonestWork)) && ticketData?.id === "Day Job") xp = Math.trunc(perkValue(p)) * xp;
      if ((p = this.tryGetActivePerk(PerkType.Recycling)) && wasTrashed) xp = Math.trunc(perkValue(p)) * xp;
      if ((p = this.tryGetActivePerk(PerkType.LearnByDoing)) && !autoScratched && !wasTrashed) xp = Math.trunc(perkValue(p)) * xp;
      if ((p = this.tryGetActivePerk(PerkType.PlateMaster5000)) && ticketData?.id === "Day Job") xp = Math.trunc(perkValue(p)) * xp;
      return xp;
    }
    onTicketTrashed(ticket) {
      if (!ticket || !this.tryGetActivePerk(PerkType.Recycling)) return;
      const v = ticket.getValue({ includeNonRevealed: true, updateMultLabel: false }).value;
      if (v <= 0) return;
      cur("TicketProgressionManager")?.addXPToTicket(ticket.Data, true, false);
    }
    // Symbol odds for a ticket at the current luck index, with perk adjustments; drops zero-chance symbols.
    getSymbolChances(ticket) {
      const luck = ticket.getLuckIndex();
      this.symbols = (ticket.Data?.symbols || []).map((s2) => ({ data: s2, chance: s2.chances[luck] ?? 0 }));
      const get = /* @__PURE__ */ __name((id) => this.symbols.find((x) => x.data.id === id)?.chance ?? 0, "get");
      const set = /* @__PURE__ */ __name((id, c) => {
        const e = this.symbols.find((x) => x.data.id === id);
        if (e) e.chance = c;
      }, "set");
      if (ticket.Data?.id === "Day Job") {
        if (!this.tryGetActivePerk(PerkType.FineDining)) {
          set("Clean", get("Clean") + get("Gold Ring_DJ"));
          set("Gold Ring_DJ", 0);
        }
        const clean = get("Clean"), broken = get("Broken");
        const prog = Save.getTicketProgressionData("Day Job");
        let moved;
        if (!prog || prog.level < 1) moved = broken;
        else {
          const p = this.tryGetActivePerk(PerkType.SoftHands);
          moved = p ? broken * perkValue(p) : 0;
        }
        set("Clean", clean + moved);
        set("Broken", broken - moved);
      }
      if (this.tryGetActivePerk(PerkType.SuperLucky) && ticket.Data && ticket.Data.id.startsWith("Super_")) {
        for (const e of this.symbols) {
          if (e.data.type === -1) e.chance = this.superLuckyPerkBadSymbolChance;
          else if (e.data.type === 3) e.chance = this.superLuckyPerkGoodSymbolChance;
        }
      }
      for (let i = this.symbols.length - 1; i >= 0; i--) if (this.symbols[i].chance <= 0) this.symbols.splice(i, 1);
      return [...this.symbols];
    }
    // Chance (per mille) of a super-jackpot-chance symbol appearing once a ticket's jackpot has been hit
    tryGetSuperJackpotChanceChance(ticketID, slotCount) {
      const l = Save.Current?.layerOne;
      if (!l || !l.jackpotsGotten.includes(ticketID)) return null;
      const data = { ticketID, id: "SuperJPC_Generic", value: 0, countNeeded: 1, maxCount: 1, chances: [1], type: 3 };
      let c = 5 / slotCount;
      if (this.tryGetActivePerk(PerkType.SuperLucky)) c *= 2;
      return { data, chance: c };
    }
    getChance(id) {
      return this.symbols.find((x) => x.data.id === id)?.chance ?? 0;
    }
    setChance(id, c) {
      const e = this.symbols.find((x) => x.data.id === id);
      if (e) e.chance = c;
    }
    getTicketMaxLevel(ticketID) {
      if (this.tryGetActivePerk(PerkType.PlateMaster5000) && ticketID === "Day Job") return 2147483647;
      const p = this.tryGetActivePerk(PerkType.Experienced);
      const n = Save.Current?.boughtPrestigeUpgrades?.["Experienced"] ?? 0;
      if (!p || !n) return 10;
      return 10 + Math.trunc(perkValue(p) * n);
    }
  };
  register2(PerkManager);

  // web/src/game/ticket.js
  var FINAL_CHANCE_WIN_ID = "Final Chance_Win";
  var SUPER_FINAL_CHANCE_WIN_ID = "Super_Final Chance_Win";
  var isFinalChanceTicket = /* @__PURE__ */ __name((id) => !!id && id.toLowerCase().includes("final chance"), "isFinalChanceTicket");
  var isSuperJackpotTicket = /* @__PURE__ */ __name((id) => !!id && id.startsWith("Super_"), "isSuperJackpotTicket");
  var Ticket = class extends MonoBehaviour {
    static {
      __name(this, "Ticket");
    }
    ctor() {
      this.Data = null;
      this.AutoScratched = false;
      this.AllScratched = false;
      this.IsJackpot = false;
      this.IsFirstTicketOpenedThisPrestige = false;
      this.TriggeredSuperJackpot = false;
      this.OnCashedOut = new Action();
      this.lastTicketMult = 1;
      this.extraSpeed = false;
      this.symbolSlots = [];
    }
    awake() {
      this.symbolSlots = this.symbolsParent ? this.symbolsParent.getComponentsInChildren("SymbolSlot", true) : [];
      for (const s2 of this.symbolSlots) {
        s2.OnScratched.add((x2) => this.onSlotScratched(x2));
        s2.OnScratchPercentageChanged.add((x2) => this.onScratchPercentageChanged(x2));
      }
      if (this.cashOutButton) {
        this.cashOutButton.gameObject.setActive(false);
        this.cashOutButton.onClick.addListener(() => {
          cur("Player")?.cashOutTicket(this, false, true);
        });
      }
      const x = this.infoPanel && this.infoPanel.gameObject.activeSelf ? -0.53 : 0;
      this.transform.position = new Vec3(x, 0, this.transform.position.z);
      this.initialPosition = this.transform.position;
      this.initialBounds = null;
    }
    get Symbols() {
      return this.symbolSlots;
    }
    get IsFinalChance() {
      return isFinalChanceTicket(this.Data?.id);
    }
    get IsSuperJackpot() {
      return isSuperJackpotTicket(this.Data?.id);
    }
    get CanCashOut() {
      return !!this.cashOutButton && this.cashOutButton.gameObject.activeSelf;
    }
    update() {
      if (!this.finalChanceWinChanceLabel) return;
      const em = cur("EndingManager");
      if (!em) return;
      const c = em.getFinalChanceWinChance?.() ?? 0;
      if (c <= 0) {
        this.finalChanceWinChancePanel?.setActive?.(false);
        this.finalChanceWinChancePanel?.gameObject?.setActive(false);
        return;
      }
      const s2 = (this.finalChanceWinChanceString?.getLocalizedString?.() || "{x}%").replace("{x}", String(+(c / 10).toFixed(2)));
      this.finalChanceWinChanceLabel.text = s2;
      (this.finalChanceWinChancePanel?.gameObject || this.finalChanceWinChancePanel)?.setActive?.(true);
    }
    updateData(data) {
      this.Data = data;
      if (!data) return;
      if (this.label) this.label.text = data.description || "";
      this.generate();
      this.infoPanel?.updateData(this);
      const dt = cur("DebugTools");
      if (this.multLabel) this.multLabel.gameObject.setActive(!dt?.HideTicketMultLabel);
    }
    generate() {
      const pm = cur("ProgressionManager");
      const custom = pm?.checkGenerateCustomTicket?.(this);
      if (custom) {
        this.generateCustom(custom);
        return;
      }
      if (!this.Data) {
        console.error("Tried to generate ticket when data is null");
        return;
      }
      const chances = cur("PerkManager").getSymbolChances(this);
      const dict = new Map(chances.map((c) => [c.data, c.chance]));
      this.generateSymbols(dict);
      const sj = cur("PerkManager").tryGetSuperJackpotChanceChance(this.Data.id, this.symbolSlots.length);
      if (sj && Random.value < sj.chance / 1e3) {
        const slot = Helper.pickRandom(this.symbolSlots);
        slot?.updateData(sj.data, this);
      }
    }
    generateSymbols(dict) {
      const counts = /* @__PURE__ */ new Map();
      for (const slot of this.symbolSlots) {
        let list = [...dict.entries()];
        list = list.filter(([d, c]) => c > 0);
        if (!list.length) {
          console.error("No symbols to pick from", this.Data?.id);
          break;
        }
        const idx = Helper.getRandomWeightedIndex(list.map(([d, c]) => c));
        const sym = list[idx][0];
        counts.set(sym, (counts.get(sym) || 0) + 1);
        if (sym.maxCount !== 0 && counts.get(sym) >= sym.maxCount) dict.delete(sym);
        slot.updateData(sym, this);
      }
    }
    generateCustom(symbols) {
      if (symbols.length !== this.symbolSlots.length) console.error("Tried to generate custom ticket with incorrect amount of symbols!");
      for (let i = 0; i < Math.min(symbols.length, this.symbolSlots.length); i++) this.symbolSlots[i].updateData(symbols[i], this);
    }
    scratch() {
      for (const s2 of this.symbolSlots) s2.reveal();
      if (!this.IsFinalChance) this.cashOutButton?.gameObject.setActive(true);
    }
    showCashOutButton(show) {
      this.cashOutButton?.gameObject.setActive(show);
    }
    showCustomCashOutButton(text) {
      this.cashOutButton?.gameObject.setActive(true);
      if (this.cashOutButtonLabel) this.cashOutButtonLabel.text = text;
    }
    getSymbolCountDict(includeNonRevealed = false) {
      const d = /* @__PURE__ */ new Map();
      for (const s2 of this.symbolSlots) {
        if (!includeNonRevealed && !s2.IsScratched) continue;
        d.set(s2.Data, (d.get(s2.Data) || 0) + 1);
      }
      return d;
    }
    // returns {value, hasJackpot}
    getValue({ includeNonRevealed = false, updateMultLabel = true } = {}) {
      let sum = 0, mult = 1, hasJackpot = false;
      for (const [sym, count] of this.getSymbolCountDict(includeNonRevealed)) {
        const slot = this.symbolSlots.find((s2) => s2.Data === sym);
        const v = slot?.UseValueOverride ? slot.ValueOverride : sym.value;
        const sets = sym.countNeeded ? Math.trunc(count / sym.countNeeded) : 0;
        if (sym.type === 4) {
          mult *= Math.max(1, v * sets);
          continue;
        }
        sum += v * sets;
        if (count >= sym.countNeeded && sym.type === 2) hasJackpot = true;
      }
      return { value: sum * mult * this.getMult(updateMultLabel), hasJackpot };
    }
    hasJackpot(includeNonRevealed = false) {
      for (const [sym, count] of this.getSymbolCountDict(includeNonRevealed)) if (count >= sym.countNeeded && sym.type === 2) return true;
      return false;
    }
    hasSuperJackpot() {
      return this.symbolSlots.some((s2) => s2.Data?.id?.startsWith("SuperJPC"));
    }
    onSlotScratched(slot) {
      if (!slot?.Data) return;
      let toHighlight = null;
      if (slot.Data.countNeeded < 2) toHighlight = [slot];
      else {
        const counts = this.getSymbolCountDict(false);
        if ((counts.get(slot.Data) || 0) >= slot.Data.countNeeded) toHighlight = this.symbolSlots.filter((s2) => s2.Data === slot.Data);
      }
      if (toHighlight) this.startCoroutine(this.highlightSlots(toHighlight));
      cur("GlobalEvents")?.OnSymbolSlotRevealed.invoke(slot, this);
      if (this.symbolSlots.some((s2) => !s2.IsScratched)) return this._refreshCashOut(false);
      this.AllScratched = true;
      if (this.IsFinalChance && this.Data.id !== SUPER_FINAL_CHANCE_WIN_ID) {
        const died = this.Data.id !== FINAL_CHANCE_WIN_ID;
        cur("GlobalEvents")?.OnFinalChanceScratched.invoke(died);
        if (died) {
          const m = cur("TheMachine");
          if (!m?.tryConsumeSoul?.()) cur("PrestigeManager")?.death?.(true, true, false, null, false);
        }
      }
      this._refreshCashOut(true);
    }
    _refreshCashOut(all) {
      const v = Helper.round(this.getValue({ includeNonRevealed: false, updateMultLabel: true }).value);
      if (this.cashOutButtonLabel) this.cashOutButtonLabel.text = "$<space=2>" + fmt(v);
      const show = (v !== 0 || all) && !this.IsFinalChance;
      this.cashOutButton?.gameObject.setActive(show);
    }
    *highlightSlots(slots) {
      const player = cur("Player");
      const am = cur("AudioManager");
      const first = slots[0].Data;
      let color = player.symbolMatchColor;
      if (first.type < 2) {
        if (first.type === -1) {
          color = player.symbolBadMatchColor;
          if (this.Data.id === "Day Job" && this.bg) {
            this.bg.sprite = cur("StaticData").getSprite("Day Job Broken");
            am?.playSound("plateBreaking");
          }
          cur("ProgressionManager")?.onBadSymbolScratched?.();
        } else if (first.type === 0) return;
      } else if (first.type === 2) {
        color = player.symbolJackpotMatchColor;
        this.onJackpot(true);
      } else if (first.type === 3) color = player.symbolJackpotMatchColor;
      for (const s2 of slots) {
        if (s2.Data.type === 1 && this.Data.id === "Day Job") continue;
        if (s2.highlight) {
          DOTween.kill(s2.highlight);
          s2.highlight.color = Color.from(color);
          DO.color(s2.highlight, new Color(color.r, color.g, color.b, 0), s2.highlightDuration);
        }
        if (s2.Data.type === -1) {
          am?.playLoseSound();
          yield new WaitForSeconds(player.badSymbolHighlightDelay);
        } else {
          am?.playRewardSound(s2.Data.type === 2 || s2.Data.type === 3);
          yield new WaitForSeconds(player.symbolHighlightDelay);
        }
      }
    }
    onJackpot(showPopup) {
      if (this.IsJackpot) return;
      this.IsJackpot = true;
      const l = Save.Current.layerOne;
      const first = !l.jackpotsGotten.includes(this.Data.id);
      if (first) l.jackpotsGotten.push(this.Data.id);
      cur("GlobalEvents")?.OnJackpot.invoke(this);
      if (first && showPopup && this.Data.id !== FINAL_CHANCE_WIN_ID) cur("Player")?.showJackpotPopup(this);
      const shop = cur("TicketShop");
      shop?.shopPanelDict?.get(this.Data.id)?.updateJackpotIcon();
      cur("PrestigeManager")?.updatePrestigeButtonLabel?.();
    }
    simulate() {
      const v = this.getValue({ includeNonRevealed: true, updateMultLabel: true }).value;
      const w = cur("Player")?.wallet;
      w?.addMoney(v, this.Data.id);
      w?.forceSubtract(this.Data.price);
      this.generate();
      return v;
    }
    onScratchPercentageChanged(slot) {
      if (cur("PerkManager")?.tryGetActivePerk(PerkType.IgnoranceIsBliss)) this.getMult(true);
      cur("GlobalEvents")?.OnScratchedSlot.invoke(slot);
    }
    getMult(updateMultLabel = true) {
      if (!this.Data) return 1;
      const prog = Save.getTicketProgressionData(this.Data.id);
      let levelMult = Helper.getPredictedValueFloat(1, this.Data.valueMultIncrease, prog?.level ?? 0);
      if (this.IsSuperJackpot) {
        const base = this.Data.id.replace("Super_", "");
        const bp = Save.getTicketProgressionData(base);
        const bd = cur("StaticData").getTicketData(base);
        if (bp && bd) levelMult = Helper.getPredictedValueFloat(1, bd.valueMultIncrease, bp.level);
      }
      const pm = cur("PerkManager");
      const perkMult = pm?.getTicketMult(this) ?? 1;
      const loanRed = cur("LoanPanel")?.getTicketMultReduction?.(this) ?? 0;
      const machine = cur("TheMachine")?.IncomeMult ?? 1;
      let loanFactor = 1;
      if (pm?.tryGetActivePerk(PerkType.LoanShark)) loanFactor = Math.max(1, Save.Current.layerOne.loans.length);
      const t = perkMult - loanRed;
      if (updateMultLabel) this.updateMultLabel(t, machine);
      this.lastTicketMult = t;
      return levelMult * t * machine * loanFactor;
    }
    updateMultLabel(ticketMult, machineMult) {
      const lbl = this.multLabel;
      if (!lbl) return;
      lbl.setEnabled(machineMult !== 1 || ticketMult !== 1);
      if (ticketMult === 1) lbl.text = "";
      else {
        const pct = Math.round((ticketMult - 1) * 100);
        lbl.text = `${ticketMult >= 1 ? "+" : ""}${pct}%`;
      }
      if (this.lastTicketMult !== ticketMult) {
        DOTween.kill(lbl.transform);
        DO.punchScale(lbl.transform, 0.2, 0.4, 10, 1);
      }
      if (machineMult !== 1) lbl.text = lbl.text + ` x${+machineMult.toFixed(2)}`;
    }
    getLuckIndex() {
      const layers = this.Data?.symbols?.[0]?.chances?.length ?? 7;
      const luck = cur("Player")?.scratching?.ScratchLuck ?? 0;
      return Helper.getMappedIndex(layers, luck, this.Data.baseLuck);
    }
    setSortingOrder(order) {
      if (this.sortingGroup) this.sortingGroup.sortingOrder = order;
      if (this.canvas) this.canvas.sortingOrder = order + 1;
    }
    hideTicketMultLabel(hide) {
      this.multLabel?.gameObject.setActive(!hide);
    }
    getWorldBounds() {
      if (this.initialBounds) return this.initialBounds;
      let b = this.bg?.bounds;
      if (!b) return null;
      const corners = [];
      for (const rtSrc of [this.infoPanel, this.cashOutButton]) {
        const rt = rtSrc?.transform;
        if (rt?.getWorldCorners) corners.push(...rt.getWorldCorners());
      }
      let x0 = b.min.x, y0 = b.min.y, x1 = b.max.x, y1 = b.max.y;
      for (const c of corners) {
        x0 = Math.min(x0, c.x);
        y0 = Math.min(y0, c.y);
        x1 = Math.max(x1, c.x);
        y1 = Math.max(y1, c.y);
      }
      this.initialBounds = { center: { x: (x0 + x1) / 2, y: (y0 + y1) / 2 }, extents: { x: (x1 - x0) / 2, y: (y1 - y0) / 2 } };
      return this.initialBounds;
    }
    scaleToFitCamera(ortho) {
      let fill = 0.75;
      let offset = { x: 0, y: 0, z: 0 };
      if (this.Data?.id === "Day Job" && this.cashOutButton) {
        const rt = this.cashOutButton.transform;
        rt.localScale = new Vec3(1.5, 1.5, 1.5);
        rt.anchoredPosition = { x: rt.sizeDelta.x * 2.2, y: rt.anchoredPosition.y };
        fill = 0.88;
      }
      const b = this.getWorldBounds();
      const cam = Camera.main;
      if (!b || !cam) return;
      const h = fill * ortho * 2, w = h * cam.aspect;
      const s2 = Math.min(w / (b.extents.x * 2), h / (b.extents.y * 2));
      this.transform.localScale = new Vec3(s2, s2, s2);
      this.transform.position = new Vec3((offset.x + this.initialPosition.x) * s2, (offset.y + this.initialPosition.y) * s2, this.transform.position.z);
    }
  };
  register2(Ticket);
  var brushCache = /* @__PURE__ */ new Map();
  function brushAlpha(tex) {
    if (!tex?.img) return null;
    let b = brushCache.get(tex.key);
    if (b) return b;
    const px = Assets.pixels(tex.img);
    const w = tex.img.width, h = tex.img.height;
    const a = new Float32Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) a[x + w * y] = px.data[((h - 1 - y) * w + x) * 4 + 3] / 255;
    b = { w, h, a };
    brushCache.set(tex.key, b);
    return b;
  }
  __name(brushAlpha, "brushAlpha");
  var SymbolSlot = class extends MonoBehaviour {
    static {
      __name(this, "SymbolSlot");
    }
    ctor() {
      this.IsScratched = false;
      this.Data = null;
      this.Ticket = null;
      this.OnScratched = new Action();
      this.OnScratchPercentageChanged = new Action();
      this.UseValueOverride = false;
      this.ValueOverride = 0;
      this.StartScratchPercentage = -1;
      this.ScratchPercentage = 0;
      this.revealed = false;
      this.lastScratchUV = null;
      this.scratchedPixels = 0;
      this.scratchedParticles = [];
    }
    get SlotType() {
      return this.slotType;
    }
    start() {
      this.initializeMaskFromCoating();
    }
    initializeMaskFromCoating() {
      const sp = this.coating?.sprite;
      if (!sp?.img) return;
      const w = sp.img.width, h = sp.img.height;
      this.W = w;
      this.H = h;
      this.coatCanvas = document.createElement("canvas");
      this.coatCanvas.width = w;
      this.coatCanvas.height = h;
      this.coatCtx = this.coatCanvas.getContext("2d", { willReadFrequently: true });
      this.coatCtx.drawImage(sp.img, 0, 0);
      this.coatData = this.coatCtx.getImageData(0, 0, w, h);
      this.coatingPixels = new Uint8ClampedArray(this.coatData.data);
      this.maskPixels = new Float32Array(w * h);
      this.scratchedPixels = 0;
      const cam = Camera.main;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const a = this.coatData.data[((h - 1 - y) * w + x) * 4 + 3];
        let m = a === 0 ? 1 : 0;
        if (this.clearPixelsOutsideScreen && m === 0 && cam) {
          const p = this.transform.position, s2 = this.transform.lossyScale;
          const sp2 = cam.worldToScreenPoint({ x: p.x + s2.x * (x - w / 2) * 0.01, y: p.y + s2.y * (y - h / 2) * 0.01 });
          if (sp2.x < 0 || sp2.x > Renderer.width || sp2.y < 0 || sp2.y > Renderer.height) m = 1;
        }
        if (m) {
          this.maskPixels[x + w * y] = 1;
          this.scratchedPixels++;
          this._clearPixel(x, y);
        }
      }
      this.coatCtx.putImageData(this.coatData, 0, 0);
      this.coating.overrideImage = this.coatCanvas;
    }
    _clearPixel(x, y) {
      const i = ((this.H - 1 - y) * this.W + x) * 4;
      this.coatData.data[i + 3] = 0;
    }
    get CoatingSize() {
      return { x: this.W || 0, y: this.H || 0 };
    }
    getValue() {
      return this.UseValueOverride ? this.ValueOverride : this.Data?.value ?? 0;
    }
    updateData(data, ticket) {
      this.Data = data;
      this.Ticket = ticket;
      const cm = cur("ChallengeManager");
      const sd = cur("StaticData");
      const hidden = cm?.IsSymbolHiddenUntilScratched;
      if ((hidden || data.id.endsWith("SJP")) && data.ticketID !== "Loan") {
        if (this.icon) this.icon.sprite = cm?.questionMarkSymbol || this.icon.sprite;
      } else if (this.icon) this.icon.sprite = sd.getSprite(data.id.split("_")[0]);
      if (data.ticketID === "Day Job" && (data.type & ~1) === 2) this.icon?.gameObject.setActive(true);
      this.IsScratched = false;
      this.coating?.gameObject.setActive(true);
    }
    onDisable() {
      this.lastScratchUV = null;
    }
    update() {
      if (cur("PauseMenu")?.IsActive) return;
      if (!this.maskPixels) return;
      if (this.scratchedParticles.length) {
        this.spawnParticles(this.scratchedParticles);
        this.scratchedParticles = [];
      }
      if (!this.revealed) {
        const wp = cur("WristProtectionManager");
        const player = cur("Player");
        const pressed = wp?.Mode === 1 || player?.inputHelper?.IsMousePressed || false;
        if (pressed) this.handleScratching();
        else this.lastScratchUV = null;
        if (this._dirty) {
          this.coatCtx.putImageData(this.coatData, 0, 0);
          this._dirty = false;
        }
      }
      this.calculateScratchAmount();
    }
    calculateScratchAmount() {
      if (this.revealed || !this.maskPixels) return;
      const pct = this.scratchedPixels / this.maskPixels.length;
      if (this.StartScratchPercentage === -1) this.StartScratchPercentage = pct;
      if (pct !== this.ScratchPercentage) {
        this.ScratchPercentage = pct;
        this.OnScratchPercentageChanged.invoke(this);
      }
      this.ScratchPercentage = pct;
      const ratio = this.Ticket ? this.Ticket.Data.scratchRatio : this.customScratchRatio;
      if (this.ScratchPercentage < ratio) return;
      this.reveal();
    }
    handleScratching() {
      const sc = cur("Player")?.scratching;
      if (!sc || !this.coating?.sprite) return;
      const wp = sc.CurrentScratchWorldPos;
      if (!wp) return;
      const l = this.coating.transform.inverseTransformPoint(wp.x, wp.y);
      const b = this.coating.localRect();
      const uv = { x: (l.x - b.x) / b.w, y: (l.y - b.y) / b.h };
      if (this.lastScratchUV) this.drawInterpolatedBrushStrokes(this.lastScratchUV, uv);
      else this.scratchAtUV(uv);
      this.lastScratchUV = uv;
    }
    drawInterpolatedBrushStrokes(from, to) {
      const steps = Math.trunc(Math.hypot(from.x - to.x, from.y - to.y) * this.interpolatedBrushSteps);
      if (steps < 0) return;
      if (steps === 0) {
        this.scratchAtUV(from);
        return;
      }
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        this.scratchAtUV({ x: lerp(from.x, to.x, t), y: lerp(from.y, to.y, t) });
      }
    }
    scratchAtUV(uv) {
      const sc = cur("Player")?.scratching;
      const tex = this.useCustomBrush && this.customBrush ? this.customBrush : sc?.getBrushTexture();
      const br = brushAlpha(tex);
      if (!br) return;
      const W = this.W, H = this.H;
      const x0 = Math.trunc(uv.x * W - br.w * 0.5), y0 = Math.trunc(uv.y * H - br.h * 0.5);
      for (let i = 0; i < br.w; i++) {
        const x = x0 + i;
        if (x < 0 || x >= W) continue;
        for (let j = 0; j < br.h; j++) {
          const y = y0 + j;
          if (y < 0 || y >= H) continue;
          const a = br.a[i + br.w * j];
          if (a <= 0) continue;
          const k = x + W * y;
          const old = this.maskPixels[k];
          const nv = old + a;
          if (old <= 0.5 && nv > 0.5) {
            this.scratchedPixels++;
            this.scratchedParticles.push(x, y);
            this._clearPixel(x, y);
            this._dirty = true;
          }
          this.maskPixels[k] = nv;
        }
      }
    }
    spawnParticles(list) {
      const spawner = cur("ItemSpawner");
      if (!spawner) return;
      const b = this.coating.localRect();
      const W = this.W, H = this.H;
      for (let n = 0; n < list.length; n += 2) {
        const x = list[n], y = list[n + 1];
        const i = ((H - 1 - y) * W + x) * 4;
        const c = this.coatingPixels;
        spawner.spawnScratchParticle(new Color(c[i] / 255, c[i + 1] / 255, c[i + 2] / 255, c[i + 3] / 255), this.coating.transform.transformPoint(b.x + (x + 0.5) / W * b.w, b.y + (y + 0.5) / H * b.h));
        n += (this.particleSkipCount || 0) * 2;
      }
    }
    reveal() {
      if (!this.coating) return;
      this.coating.gameObject.setActive(false);
      this.IsScratched = true;
      this.revealed = true;
      const cm = cur("ChallengeManager");
      if ((cm?.IsSymbolHiddenUntilScratched || this.Data?.id?.endsWith("SJP")) && this.icon && this.Data) this.icon.sprite = cur("StaticData").getSprite(this.Data.id.split("_")[0]);
      if (!this.Ticket || !this.Ticket.AutoScratched) {
        cur("AudioManager")?.playRandomPitchSound("bubblePop", 0.8, 1.2, 0.7);
        if (this.highlight) {
          DOTween.kill(this.highlight);
          this.highlight.color = new Color(1, 1, 1, 1);
          DO.color(this.highlight, new Color(1, 1, 1, 0), this.highlightDuration);
        }
      }
      this.OnScratched.invoke(this);
    }
    highlightColor(c) {
      if (!this.highlight) return;
      DOTween.kill(this.highlight);
      this.highlight.color = Color.from(c);
      DO.color(this.highlight, new Color(c.r, c.g, c.b, 0), this.highlightDuration);
    }
    getEstimatedChance(luckIndex, slotCount) {
      const c = this.Data?.chances?.[luckIndex] ?? 0;
      return c / this.Data.countNeeded * slotCount;
    }
  };
  register2(SymbolSlot);
  var TableItem = class extends MonoBehaviour {
    static {
      __name(this, "TableItem");
    }
    ctor() {
      this.Data = null;
      this.AutoScratched = false;
      this.CachedSymbols = [];
      this.currentSpeed = 0;
      this.elapsedMoveTime = 0;
      this.isMoving = false;
    }
    get SortingOrder() {
      return this.sortingGroup?.sortingOrder ?? 0;
    }
    update() {
      if (!this.isMoving || !this.Data) return;
      this.elapsedMoveTime += Time.deltaTime;
      const k = this.Data.velocityCurve ? evaluateCurve(this.Data.velocityCurve, this.elapsedMoveTime / this.Data.curveDuration) : 1;
      this.currentSpeed = this.Data.moveSpeed * k;
      const d = this.currentSpeed * Time.deltaTime;
      const p = this.transform.position;
      this.transform.position = new Vec3(p.x + d * this.Data.moveDirection.x, p.y + d * this.Data.moveDirection.y, p.z);
      if (this.currentSpeed < 0.01 && this.elapsedMoveTime > 0.05) this.isMoving = false;
    }
    updateData(data) {
      this.Data = data;
      if (!data.sprite) {
        console.error("Sprite was null for table item: " + data.id);
        return;
      }
      if (this.spriteRenderer) this.spriteRenderer.sprite = data.sprite;
      if (this.scratchedSpriteRenderer) {
        let s2 = null;
        if (!data.id.startsWith("Super_") && !data.id.toLowerCase().includes("catalog") && data.id !== "Badge Collection")
          s2 = cur("StaticData").spriteDict.get(TicketDataUtil.getSharedID(data.id) + "_Small_Scratched") || null;
        else if (data.id.startsWith("Super_")) s2 = cur("StaticData").spriteDict.get("Super_Small_Scratched") || null;
        this.scratchedSpriteRenderer.sprite = s2;
        this.scratchedSpriteRenderer.gameObject.setActive(this.AutoScratched && !!s2);
      }
      if (this.shadow) this.shadow.sprite = data.sprite;
      if (this.col && data.sprite) this.col.size = { x: data.sprite.rw / data.sprite.ppu, y: data.sprite.rh / data.sprite.ppu };
      if (data.moveSpeed > 0) this.isMoving = true;
    }
    setAutoScratched(v) {
      this.AutoScratched = v;
      if (this.scratchedSpriteRenderer) this.scratchedSpriteRenderer.gameObject.setActive(v && !!this.scratchedSpriteRenderer.sprite);
    }
    wiggle() {
      cur("AudioManager")?.playSound("paperTouchShort");
      const player = cur("Player");
      if (!player || !this.sortingGroup) return;
      const tr = this.sortingGroup.transform;
      let z = tr.localEulerZ;
      if (z > 180) z -= 360;
      const target = z >= 0 ? -player.tableItemWiggleAngle : player.tableItemWiggleAngle;
      DO.rotateZ(tr, target, player.tableItemWiggleDuration).setEase(Ease.OutQuad);
    }
    startHolding(shadowOffset, sortingOrder) {
      if (this.shadow) this.shadow.transform.localPosition = new Vec3(0, -shadowOffset, this.shadow.transform.localPosition.z);
      if (this.sortingGroup) this.sortingGroup.sortingOrder = sortingOrder;
      const player = cur("Player");
      if (player?.overlayTableItemsParent) this.transform.setParent(player.overlayTableItemsParent, true);
    }
    stopHolding() {
      if (this.shadow) this.shadow.transform.localPosition = new Vec3(0, 0, this.shadow.transform.localPosition.z);
      const player = cur("Player");
      if (player?.tableItemsParent) this.transform.setParent(player.tableItemsParent, true);
    }
    yeet(speed, duration, dir) {
      if (!this.Data) return;
      this.Data.moveDirection = dir;
      this.Data.moveSpeed = speed;
      this.Data.curveDuration = duration;
      this.isMoving = true;
      this.elapsedMoveTime = 0;
    }
    setFadeAlpha(a) {
      if (this.spriteRenderer) this.spriteRenderer.color = new Color(1, 1, 1, a);
    }
    generateSave() {
      const p = this.transform.position;
      const mat = cur("StickyMat");
      return { id: this.Data?.id, symbols: this.CachedSymbols.map((s2) => s2.id), posX: p.x, posY: p.y, onStickyMat: !!mat?.boxCollider?.overlapPoint?.(p), autoScratched: this.AutoScratched };
    }
  };
  register2(TableItem);
  var TicketInfoPanel = class extends MonoBehaviour {
    static {
      __name(this, "TicketInfoPanel");
    }
    updateData(ticket) {
      this.ticket = ticket;
      const d = ticket?.Data;
      if (!d) return;
      const shared = TicketDataUtil.getSharedID(d.id);
      this.titleLabelLocalize?.setEntry(shared + "_name");
      this.descriptionLabelLocalize?.setEntry(shared + "_description");
      this.updateHardnessLabel();
      const prog = Save.getTicketProgressionData(d.id);
      const levelMult = Helper.getPredictedValueFloat(1, d.valueMultIncrease, prog?.level ?? 0);
      const pm = cur("PerkManager");
      const list = Helper.getNormalizedChances(pm.getSymbolChances(ticket));
      const sj = pm.tryGetSuperJackpotChanceChance(d.id, ticket.symbolSlots.length);
      if (sj) list.push(sj);
      const sd = cur("StaticData");
      (this.rewardGroups || []).forEach((g, i) => {
        if (i > list.length - 1) {
          g.gameObject.setActive(false);
          return;
        }
        g.gameObject.setActive(true);
        const { data, chance } = list[i];
        let chanceStr = chance >= 10 ? `${Math.round(chance / 10)}<space=2>%` : `${+(chance / 10).toFixed(1)}<space=2>%`;
        if (chance < 1) chanceStr = "<<space=2>0.1<space=2>%";
        const value = data.value * levelMult;
        let valueStr;
        if (data.type === 4) valueStr = "x<space=2>" + data.value;
        else if (data.id.startsWith("SuperJPC")) valueStr = "?";
        else valueStr = "$<space=2>" + fmt(value, Math.abs(value) >= 1e5);
        const icon = sd.hasSprite(data.id + "_alt") ? sd.getSprite(data.id + "_alt") : sd.getSprite(data.id.split("_")[0]);
        g.updateData(icon, chanceStr, valueStr, data.countNeeded, false, (this.ticketsToShowCount || []).includes(d.id));
      });
    }
    updateHardnessLabel() {
      if (!this.hardnessLabel || !this.ticket?.Data) return;
      const s2 = this.hardnessString?.getLocalizedString?.() || "Hardness: {x}";
      this.hardnessLabel.text = s2.replace("{x}", String(this.ticket.Data.hardness));
      this.hardnessLabel.gameObject.setActive(this.ticket.Data.hardness < 1e3);
    }
  };
  register2(TicketInfoPanel);
  var TicketRewardInfoGroup = class extends MonoBehaviour {
    static {
      __name(this, "TicketRewardInfoGroup");
    }
    updateData(icon, chance, value, countNeeded, disabled, showCount) {
      this.disabledOverlay?.gameObject.setActive(disabled);
      this.countNeededLabel?.gameObject.setActive(showCount);
      if (this.countNeededLabel) this.countNeededLabel.text = `${countNeeded}<space=0.8>x`;
      if (this.chanceLabel) this.chanceLabel.text = disabled ? "" : chance;
      if (this.icon) this.icon.sprite = icon;
      if (this.valueLabel) this.valueLabel.text = value;
    }
  };
  register2(TicketRewardInfoGroup);
  var ScratchParticleManager = class extends MonoBehaviour {
    static {
      __name(this, "ScratchParticleManager");
    }
    ctor() {
      this.particles = [];
      this.suctionPower = this.suctionPower ?? 10;
      this.steeringSmoothing = this.steeringSmoothing ?? 5;
      this.particleScale = this.particleScale ?? { x: 0.02, y: 0.02, z: 1 };
    }
    start() {
      const sc = cur("Player")?.scratching;
      this.lifetime = sc?.scratchParticleLifetime ?? 0.5;
      this.gravity = sc?.scratchParticleGravity ?? 9.8;
    }
    // MaxParticles is 258 (one DrawMeshInstanced batch)
    activateParticle(p) {
      if (this.particles.length < 258) this.particles.push(p);
    }
    update() {
      const em = cur("EndingManager");
      const ending = !!em?.IsEnding && !this.disableEndingParticles;
      const life = (this.lifetime ?? 0.5) * (ending ? this.endingParticlesLifetimeMult ?? 1 : 1);
      const sc = cur("Player")?.scratching;
      if (!sc) return;
      const dt = Time.deltaTime;
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        if (life <= p.t + dt) {
          this.particles.splice(i, 1);
          continue;
        }
        p.t += dt;
        if (!ending) {
          p.vy -= dt * this.gravity;
          p.vx = p.startX + (0 - p.startX) * Math.min(1, Math.max(0, p.t / life));
        } else {
          const c = sc.CurrentScratchWorldPos;
          let dx = c.x - p.x, dy = c.y - p.y;
          const m = Math.hypot(dx, dy);
          if (m > 1e-5) {
            dx /= m;
            dy /= m;
          } else {
            dx = 0;
            dy = 0;
          }
          const k = Math.min(1, Math.max(0, p.t / life * this.steeringSmoothing * dt));
          p.vx += (dx * this.suctionPower - p.vx) * k;
          p.vy += (dy * this.suctionPower - p.vy) * k;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.a = 1 - p.t / life;
      }
    }
    get sortingOrder() {
      return 1e3;
    }
    render(ctx) {
      const inv = this.transform.worldMatrix.invert();
      const w = this.particleScale.x, h = this.particleScale.y;
      for (const p of this.particles) {
        const l = inv.apply(p.x, p.y);
        ctx.globalAlpha = Math.max(0, p.a ?? 1);
        ctx.fillStyle = p.c.css(1);
        ctx.fillRect(l.x - w / 2, l.y - h / 2, w, h);
      }
      ctx.globalAlpha = 1;
    }
  };
  register2(ScratchParticleManager);

  // web/src/game/player.js
  var PlayerState = { Idle: 0, HoldingItem: 1, TicketOpen: 2 };
  var PlayerInputHelper = {
    get IsMousePressed() {
      return Input.getMouseButton(0);
    },
    get WasPressedThisFrame() {
      return Input.getMouseButtonDown(0);
    },
    get WasReleasedThisFrame() {
      return Input.getMouseButtonUp(0);
    },
    get pointerScreen() {
      return Input.mousePosition;
    },
    // keyboard shortcuts exist only with the Hotkeys perk
    get HotkeysEnabled() {
      return !!cur("PerkManager")?.tryGetActivePerk(PerkType.Hotkeys);
    },
    get WasClaimButtonPressedThisFrame() {
      return this.HotkeysEnabled && Input.getKeyDown("space");
    },
    get WasTrashButtonPressedThisFrame() {
      return this.HotkeysEnabled && Input.getKeyDown("x");
    },
    get WasSpellButtonPressedThisFrame() {
      return this.HotkeysEnabled && Input.getKeyDown("s");
    }
  };
  register2(class PlayerInputHelperC extends MonoBehaviour {
    static {
      __name(this, "PlayerInputHelperC");
    }
  }, "PlayerInputHelper");
  var Player = class extends MonoBehaviour {
    static {
      __name(this, "Player");
    }
    ctor() {
      this.ticketInstanceDict = /* @__PURE__ */ new Map();
      this.CurrentActiveTableItem = null;
      this.State = PlayerState.Idle;
      this.TableItems = [];
      this.OnTicketOpened = new Action();
      this.OnTicketClosed = new Action();
      this.OnStateChanged = new Action();
      this.MouseWorldPos = { x: 0, y: 0 };
      this.TicketOpenedThisPress = false;
      this.ticketOpenedThisFrame = false;
      this.currentHoveredTableItem = null;
      this.holdStartPos = { x: 0, y: 0 };
      this.holdItemOffset = { x: 0, y: 0 };
      this.mousePressStartPos = { x: 0, y: 0 };
      this.inputHelper = PlayerInputHelper;
    }
    get Scratching() {
      return this.scratching;
    }
    get Wallet() {
      return this.wallet;
    }
    get IsTicketOpen() {
      return !!this.scratching?.CurrentTicket;
    }
    get HasEndingStarted() {
      const t = this.scratching?.CurrentTicket;
      return !!t && t.Data?.id === FINAL_CHANCE_WIN_ID && t.AllScratched;
    }
    get PanelOverlayActive() {
      return !!(cur("PauseMenu")?.IsActive || cur("SettingsMenu")?.IsActive || cur("PrestigePanel")?.panel?.gameObject?.activeSelf);
    }
    get IsScratchInputActive() {
      return PlayerInputHelper.IsMousePressed || cur("WristProtectionManager")?.Mode === 1;
    }
    start() {
      const gm = cur("GameManager");
      if (gm) gm.IsInMainMenu = false;
      cur("GlobalEvents")?.OnGameSceneLoaded?.invoke();
    }
    // Start's bankruptcy check; run by SaveManager once saved table items are back, so a broke player who still has
    // tickets on the table isn't offered a loan (the original's save loads asynchronously, before this matters)
    checkBankruptOnLoad() {
      if (Save.money() <= 0 && !cur("ProgressionManager")?.BoughtFinalChance) this.goneBankrupt();
    }
    setState(s2, trigger = true) {
      this.State = s2;
      if (trigger) this.OnStateChanged.invoke(s2);
    }
    update() {
      if (this.PanelOverlayActive && this.scratching?.scratchSource) {
        DOTween.kill(this.scratching.scratchSource);
        this.scratching.scratchSource.volume = 0;
      }
      const cam = Camera.main;
      if (!cam) return;
      this.MouseWorldPos = cam.screenToWorldPoint(Input.mousePosition);
      if (this.PanelOverlayActive) return;
      if (this.State === PlayerState.TicketOpen) {
        const t = this.scratching?.CurrentTicket;
        if (!alive(t) && !cur("SuperJackpotManager")?.IsActive && !cur("EndingManager")?.IsEnding) {
          this.setState(PlayerState.Idle);
          this.handleHoveringItems();
        } else {
          this.scratching.updateScratching();
          this.updateClosingTicketInput();
        }
      } else if (this.State === PlayerState.HoldingItem) this.handleHoldingItem();
      else this.handleHoveringItems();
      if (this.State !== PlayerState.TicketOpen) {
        const cm = cur("CursorManager");
        if (cm?.IsHoveringScratchArea) cm.IsHoveringScratchArea = false;
      }
      this.ticketOpenedThisFrame = false;
      if (this.TicketOpenedThisPress && !PlayerInputHelper.IsMousePressed) this.TicketOpenedThisPress = false;
    }
    updateCurrentHoveredTableItem() {
      let best = null, bestOrder = -Infinity;
      if (!EventSystem.isPointerOverGameObject()) {
        for (const col of Physics2D.overlapPointAll(this.MouseWorldPos)) {
          const ti = col.gameObject.getComponentInParent("TableItem");
          if (!ti) continue;
          if (ti.SortingOrder > bestOrder) {
            bestOrder = ti.SortingOrder;
            best = ti;
          }
        }
      }
      if (best !== this.currentHoveredTableItem) {
        this.currentHoveredTableItem = best;
        if (best) best.wiggle();
      }
    }
    handleHoveringItems() {
      if (cur("PrestigeManager")?.isDying) return;
      this.updateCurrentHoveredTableItem();
      const item = this.currentHoveredTableItem;
      if (!item) return;
      if (!PlayerInputHelper.WasPressedThisFrame) return;
      if (item.AutoScratched) {
        this.openTicket(item, true);
        const t = this.scratching?.CurrentTicket;
        if (!t) return;
        t.AutoScratched = true;
        for (const s2 of t.Symbols) s2.reveal();
        if (!t.IsFinalChance) t.cashOutButton?.gameObject.setActive(true);
        return;
      }
      this.holdStartPos = { ...this.MouseWorldPos };
      const p = item.transform.position;
      this.holdItemOffset = { x: p.x - this.MouseWorldPos.x, y: p.y - this.MouseWorldPos.y };
      if (item.col) item.col.enabled = false;
      this.setState(PlayerState.HoldingItem);
      const sp = cur("ItemSpawner");
      sp.CurrentSortingOrder++;
      item.startHolding(this.tableItemShadowDist, sp.CurrentSortingOrder);
    }
    handleHoldingItem() {
      const item = this.currentHoveredTableItem;
      if (!alive(item)) {
        this.setState(PlayerState.Idle);
        return;
      }
      if (PlayerInputHelper.WasReleasedThisFrame) {
        if (item.col) item.col.enabled = true;
        const d = Math.hypot(this.MouseWorldPos.x - this.holdStartPos.x, this.MouseWorldPos.y - this.holdStartPos.y);
        if (d <= this.clickToOpenMoveThreshold) this.openTicket(item, true);
        else {
          const bot = cur("ScratchBot");
          if (bot && bot.gameObject.activeInHierarchy && bot.checkHover?.(this.MouseWorldPos)) {
            if (!bot.tryAddTicket(item)) bot.throwTicket?.(item);
          }
          const trash = cur("TrashCan");
          if (trash && trash.gameObject.activeInHierarchy && trash.checkHover?.(this.MouseWorldPos)) trash.dropItem?.(item);
          this.setState(PlayerState.Idle);
        }
        cur("AudioManager")?.playSound("cardPlace");
        if (alive(item)) item.stopHolding();
        return;
      }
      item.transform.position = new Vec3(this.MouseWorldPos.x + this.holdItemOffset.x, this.MouseWorldPos.y + this.holdItemOffset.y, item.transform.position.z);
    }
    isHoldingItem() {
      return this.State === PlayerState.HoldingItem;
    }
    tryGetHeldTableItem() {
      return this.State === PlayerState.HoldingItem ? this.currentHoveredTableItem : null;
    }
    isDoubleClick(last) {
      return Time.time - last < this.doubleClickThreshold;
    }
    get DoubleClickThreshold() {
      return this.doubleClickThreshold;
    }
    openTicket(item, playOpenSound = true) {
      if (cur("PrestigeManager")?.isDying) return;
      const am = cur("AudioManager");
      if (playOpenSound) am?.playSound("cardSlide");
      am?.resetRewardSound?.();
      am?.resetLoseSound?.();
      const pm = cur("ProgressionManager");
      if (pm?.isCustomTableItem?.(item.Data.id)) {
        const r = pm.onCustomTableItemOpened(item.Data.id, true);
        if (r?.remove) this.removeTableItem(item);
        this.setState(PlayerState.Idle);
        return;
      }
      this.setState(PlayerState.TicketOpen);
      if (alive(this.CurrentActiveTableItem)) this.CurrentActiveTableItem.gameObject.setActive(true);
      this.CurrentActiveTableItem = item;
      item.gameObject.setActive(false);
      const t = this.getTicketInstance(item, true);
      this.scratching.CurrentTicket = t;
      t.getMult(true);
      t.infoPanel?.updateData(t);
      t.scratchStrengthTooLowLabel?.gameObject.setActive(false);
      this.ticketOpenedThisFrame = true;
      this.TicketOpenedThisPress = true;
      if (!isSuperJackpotTicket(item.Data.id) || true) this.OnTicketOpened.invoke(t);
    }
    getTicketInstance(item, show) {
      for (const [k, t2] of [...this.ticketInstanceDict]) if (!alive(t2)) this.ticketInstanceDict.delete(k);
      const key = item.Data.id + (item.AutoScratched ? "_Scratched" : "");
      let t = this.ticketInstanceDict.get(key);
      if (!t) {
        t = cur("ItemSpawner").spawnTicket(item.Data.id);
        this.ticketInstanceDict.set(key, t);
        t.gameObject.setActive(show);
      } else if (show) for (const v of this.ticketInstanceDict.values()) v.gameObject.setActive(v === t);
      if (item.CachedSymbols.length) t.generateCustom(item.CachedSymbols);
      else item.CachedSymbols = t.Symbols.map((s2) => s2.Data);
      return t;
    }
    hideTicket() {
      if (this.ticketOpenedThisFrame || this.HasEndingStarted) return;
      const t = this.scratching?.CurrentTicket;
      if (!t) return;
      t.gameObject.setActive(false);
      if (alive(this.CurrentActiveTableItem)) this.CurrentActiveTableItem.gameObject.setActive(true);
      this.CurrentActiveTableItem = null;
      this.scratching.CurrentTicket = null;
      this.scratching.setScratchVolume(0);
      cur("AudioManager")?.playSound("cardPlace");
      this.setState(PlayerState.Idle);
      this.OnTicketClosed.invoke(t);
    }
    updateClosingTicketInput() {
      const t = this.scratching?.CurrentTicket;
      if (!alive(t) || t.Data?.id?.startsWith("Super_")) return;
      if (PlayerInputHelper.WasPressedThisFrame) this.mousePressStartPos = { ...this.MouseWorldPos };
      if (!PlayerInputHelper.WasReleasedThisFrame || this.TicketOpenedThisPress) return;
      const col = t.boundsCol;
      if (!col) return;
      const was = col.enabled;
      col.enabled = true;
      const a = col.overlapPoint(this.MouseWorldPos), b = col.overlapPoint(this.mousePressStartPos);
      col.enabled = was;
      if (!a && !b && !EventSystem.isPointerOverGameObject()) this.hideTicket();
    }
    cashOutTicket(ticket, autoClaimed, isUserAction) {
      if (!ticket?.Data) return;
      let value;
      if (ticket.Data.id !== "Loan") {
        const r = ticket.getValue({ includeNonRevealed: ticket.AutoScratched, updateMultLabel: false });
        value = r.value;
        if (r.hasJackpot) ticket.onJackpot(false);
      } else value = Math.max(0, 5 - Save.money());
      this.wallet.addMoney(value, ticket.Data.id);
      if (ticket.Data.id === "Loan" && Save.money() < 5) this.wallet.addMoney(5 - Save.money(), ticket.Data.id);
      if (!autoClaimed) cur("AudioManager")?.playSound("cashOut");
      cur("TicketProgressionManager")?.addXPToTicket(ticket.Data, false, ticket.AutoScratched);
      cur("GlobalEvents")?.OnTicketCashedOut.invoke(ticket, value, isUserAction);
      const wasAuto = ticket.AutoScratched;
      this.discardTicket(ticket, false, isUserAction);
      if (!autoClaimed && wasAuto && ticket.Data.id !== FINAL_CHANCE_WIN_ID) this.openNextAutoScratchedTicket();
      ticket.OnCashedOut?.invoke();
    }
    discardTicket(ticket, wasTrashed, isUserAction) {
      if (wasTrashed) cur("PerkManager")?.onTicketTrashed(ticket);
      if (!ticket?.Data) return;
      this.ticketInstanceDict.delete(ticket.Data.id + (ticket.AutoScratched ? "_Scratched" : ""));
      Game.destroy(ticket.gameObject);
      if (isUserAction) {
        this.scratching.CurrentTicket = null;
        this.scratching.setScratchVolume(0);
        if (alive(this.CurrentActiveTableItem)) this.removeTableItem(this.CurrentActiveTableItem);
        this.CurrentActiveTableItem = null;
        this.setState(PlayerState.Idle);
      }
      this.checkDefeat();
    }
    dropTableItemInTrash(item, autoTrashed) {
      const key = item.Data.id + (item.AutoScratched ? "_Scratched" : "");
      const inst = this.ticketInstanceDict.get(key);
      if (!inst) {
        cur("PerkManager")?.onTicketTrashed(null);
        cur("GlobalEvents")?.OnTableItemTrashed.invoke(item);
      } else if (inst !== this.scratching?.CurrentTicket) {
        cur("PerkManager")?.onTicketTrashed(inst);
        Game.destroy(inst.gameObject);
        this.ticketInstanceDict.delete(key);
        cur("GlobalEvents")?.OnTicketTrashed.invoke(inst);
      }
      this.removeTableItem(item);
      if (!autoTrashed) this.setState(PlayerState.Idle);
      this.checkDefeat();
      const pm = cur("ProgressionManager");
      if (pm?.isCustomTableItem?.(item.Data.id)) {
        if (item.Data.id === "Badge Collection") {
          const u = Save.getUpgradeSaveData("Badge Collection");
          if (u) u.buyCount = 0;
          const panel = cur("UpgradeShop")?.shopPanelDict?.get("Badge Collection");
          if (panel) {
            panel.calculatePrice();
            panel.setLevelProgress(0, 0, false);
            panel.updateAllBought(false, true);
          }
        } else cur("DialogueManager")?.queueDialogue("trashingStoryItem", false, () => cur("ItemSpawner")?.respawnCustomTableItem?.(item.Data.id));
      }
    }
    removeTableItem(item) {
      if (!item) return;
      const bot = cur("ScratchBot");
      if (bot?.ScratchedTickets) {
        const i2 = bot.ScratchedTickets.indexOf(item);
        if (i2 >= 0) bot.ScratchedTickets.splice(i2, 1);
      }
      const i = this.TableItems.indexOf(item);
      if (i >= 0) this.TableItems.splice(i, 1);
      if (item.gameObject) Game.destroy(item.gameObject);
    }
    openNextAutoScratchedTicket() {
      const bot = cur("ScratchBot");
      const list = bot?.ScratchedTickets;
      if (!list?.length) return;
      const item = list[list.length - 1];
      this.openTicket(item, false);
      const t = this.scratching?.CurrentTicket;
      if (!t) return;
      t.extraSpeed = true;
      t.AutoScratched = true;
      t.scratch();
      t.gameObject.setActive(true);
    }
    canBuyTickets(count) {
      return this.TableItems.length + count <= (cur("SubscriptionBot")?.maxTicketCount ?? 9999);
    }
    checkDefeat() {
      if (Save.money() > 0) return false;
      if (cur("ProgressionManager")?.BoughtFinalChance) return false;
      this.goneBankrupt();
      return true;
    }
    goneBankrupt() {
      const dm = cur("DialogueManager");
      const l = Save.Current.layerOne;
      if (l.loans.length === 2 && !l.bankruptcyWarningGiven) {
        l.bankruptcyWarningGiven = true;
        dm?.queueDialogue("totalBankruptcyWarning", false, null);
      } else if (l.loans.length >= 3) {
        dm?.queueDialogue("totalBankruptcy", false, () => cur("PrestigeManager")?.bankruptcyDeath());
        return;
      }
      if (this.TableItems.length === 0) dm?.queueDialogue("bankrupt", false, () => this.spawnLoan());
      else dm?.queueDialogue("moneyTrouble", true, null);
      if (!dm) {
        if (this.TableItems.length === 0) this.spawnLoan();
      }
    }
    spawnLoan() {
      const sd = cur("StaticData");
      cur("ItemSpawner")?.spawnTableItem("Loan", sd.getTableItemSprite("Loan"), true);
    }
    spawnLoanWithDialogue() {
      cur("DialogueManager")?.queueDialogue("bankrupt", false, () => this.spawnLoan()) ?? this.spawnLoan();
    }
    showJackpotPopup(ticket) {
      const n = cur("PrestigeManager")?.getPrestigeCurrencyAmountForTicket?.(ticket.Data) ?? 0;
      if (this.jackpotPopupJPCountLabel) this.jackpotPopupJPCountLabel.text = "+" + n;
      this.jackpotPopup?.show?.(null, this.jackpotString?.getLocalizedString?.() ?? "Jackpot!");
    }
    showTableFullPopup() {
      const l = this.tableFullLabel;
      if (!l) return;
      l.gameObject.setActive(true);
      DOTween.kill(l);
      l.color = l.color.withAlpha(1);
      DOTween.complete(l.transform);
      DO.punchScale(l.transform, this.tableFullLabelBounceScale, this.tableFullLabelBounceDuration, 10, 1);
      DO.fade(l, 0, this.tableFullLabelFadeDuration).setDelay(this.tableFullLabelFadeDelay).onComplete(() => l.gameObject.setActive(false));
    }
    loadData() {
      this.wallet?.updateMoneyLabel();
    }
    resetGame() {
      for (const t of [...this.TableItems]) this.removeTableItem(t);
      this.ticketInstanceDict.clear();
    }
  };
  register2(Player);
  var PlayerWallet = class extends MonoBehaviour {
    static {
      __name(this, "PlayerWallet");
    }
    ctor() {
      this.OnMoneyUpdated = new Action();
    }
    start() {
      this.updateMoneyLabel();
    }
    get Money() {
      return Save.money();
    }
    _punch() {
      if (!this.moneyGroup) return;
      DOTween.complete(this.moneyGroup.transform);
      DO.punchScale(this.moneyGroup.transform, this.moneyPunchScale, this.moneyPunchScaleDuration, this.moneyPunchScaleVibrato, 1);
    }
    addMoney(amount, source) {
      if (amount === 0) return;
      Save.addMoney(amount);
      this.updateMoneyLabel();
      this._punch();
      if (amount > 0 && source !== "Loan" && source !== "Reward") cur("ProgressionManager")?.onMoneyEarned?.(amount);
      this.OnMoneyUpdated.invoke();
    }
    canAfford(a) {
      return a <= Save.money();
    }
    trySubtract(a) {
      if (a < 0 || Save.money() < a) return false;
      Save.addMoney(-a);
      this.updateMoneyLabel();
      this._punch();
      this.OnMoneyUpdated.invoke();
      return true;
    }
    forceSubtract(a) {
      Save.addMoney(-a);
      this.updateMoneyLabel();
      this._punch();
      this.OnMoneyUpdated.invoke();
    }
    resetMoney() {
      Save.setMoney(0);
      this.updateMoneyLabel();
      this.OnMoneyUpdated.invoke();
    }
    setMoney(m) {
      Save.setMoney(m);
      this.updateMoneyLabel();
      this._punch();
      this.OnMoneyUpdated.invoke();
    }
    updateMoneyLabel() {
      if (this.moneyLabel && Save.HasSaveFileLoaded) this.moneyLabel.text = fmt(Save.money());
    }
  };
  register2(PlayerWallet);
  var PlayerScratchTool = class extends MonoBehaviour {
    static {
      __name(this, "PlayerScratchTool");
    }
    ctor() {
      this.scratchTools = ["Base Coin", "Tin Coin", "Aluminum Coin", "Copper Coin", "Bronze Coin", "Iron Coin", "Steel Coin", "Titanium Coin", "Tungsten Coin"];
      this.Strength = 0;
      this.ScratchToolIndex = 0;
      this.sizeBacking = 0;
      this.SizeReduction = this.SizeReduction || 0;
      this.CurrentTool = "Base Coin";
    }
    start() {
      this.updateStats();
    }
    get Size() {
      return Math.max(0, this.sizeBacking - this.SizeReduction);
    }
    get AllScratchTools() {
      return this.scratchTools;
    }
    updateStats() {
      let tool = "Base Coin";
      for (let i = 1; i < this.scratchTools.length; i++) {
        const u = Save.getUpgradeSaveData(this.scratchTools[i]);
        if (u && u.buyCount > 0) tool = this.scratchTools[i];
      }
      let idx = Math.max(0, this.scratchTools.indexOf(tool));
      this.Strength = Math.max(0, idx * 2);
      this.ScratchToolIndex = idx;
      const pm = cur("PerkManager");
      const tb = pm?.tryGetActivePerk(PerkType.ToolBelt);
      if (tb) {
        const n = Math.max(0, (Save.Current.boughtPrestigeUpgrades?.[tb.id] ?? 0) - 1);
        if (this.ScratchToolIndex < n) {
          tool = this.scratchTools[n];
          this.Strength = n * 2;
          this.ScratchToolIndex = n;
        }
      }
      const su = Save.getUpgradeSaveData("Scratch Size_" + this.scratchTools[this.ScratchToolIndex]);
      this.CurrentTool = tool;
      this.sizeBacking = (su?.buyCount ?? 0) + (tool === "Base Coin" ? 0 : 1);
      cur("CursorManager")?.refreshSprites?.();
    }
    get currentCoinName() {
      return this.CurrentTool;
    }
    getCurrentCoinSize() {
      const u = Save.getUpgradeSaveData("Scratch Size_" + this.scratchTools[this.ScratchToolIndex]);
      return u?.buyCount ?? 0;
    }
    checkModifyPanelVisibility(panel) {
      const id = panel?.Data?.id;
      if (!id) return false;
      const i = this.scratchTools.findIndex((t) => t === id || "Scratch Size_" + t === id);
      if (i < 0) return false;
      const want = id.includes("Scratch Size") ? this.ScratchToolIndex : this.ScratchToolIndex + 1;
      panel.gameObject.setActive(want === i);
      return true;
    }
    isScratchTool(id) {
      return this.scratchTools.includes(id);
    }
    getStrength(id) {
      return Math.max(0, this.scratchTools.indexOf(id) * 2);
    }
  };
  register2(PlayerScratchTool);
  var PlayerScratching = class extends MonoBehaviour {
    static {
      __name(this, "PlayerScratching");
    }
    awake() {
      this.brushTextureDict = /* @__PURE__ */ new Map();
      this.maxBrushSize = 0;
      this._scratchLuck = this._scratchLuck || 0;
      this.LuckReduction = 0;
      this.CurrentScratchWorldPos = { x: 0, y: 0 };
      this.CurrentScratchScreenPos = { x: 0, y: 0 };
      this.CurrentScratchVelocity = { x: 0, y: 0 };
      this.canScratch = true;
      this.lastScratchPos = { x: 0, y: 0 };
      this.CurrentTicket = null;
      for (const t of Assets.loadAllTextures("Brushes")) {
        const key = t.name.split("_")[0];
        if (!this.brushTextureDict.has(key)) this.brushTextureDict.set(key, []);
        this.brushTextureDict.get(key).push(t);
        const n = parseInt(key.replace("Size", ""), 10);
        if (!isNaN(n) && n > this.maxBrushSize) this.maxBrushSize = n;
      }
    }
    get ScratchLuck() {
      return Math.max(-3, this._scratchLuck - this.LuckReduction);
    }
    set ScratchLuck(v) {
      this._scratchLuck = v;
    }
    get Tool() {
      return this.scratchTool;
    }
    getBrushTexture() {
      const t = this.CurrentTicket;
      if (!t) {
        this.setCanScratch(true);
        return this.brushTextureDict.get("Ending")?.[0];
      }
      const tool = this.scratchTool;
      const hard = t.Data.hardness;
      if (tool.Strength - hard > -3) this.setCanScratch(true);
      let key = t.Data.id.startsWith("Super_") ? "Super" : t.Data.id;
      if (key === "Day Job" && cur("PerkManager")?.tryGetActivePerk(PerkType.ToolBelt)) key = "Day Job Big";
      const custom = this.brushTextureDict.get(key);
      if (custom) return custom[0];
      if (tool.Strength - hard > -3) {
        const idx = Helper.getMappedIndex(this.brushTexturesPerType, tool.Strength, hard);
        const size = Math.min(this.maxBrushSize, Math.max(0, tool.sizeBacking - tool.SizeReduction));
        let list = this.brushTextureDict.get("Size" + size);
        if (!list) {
          console.error("Could not find brush texture for id: Size" + size);
          list = this.brushTextureDict.get("Size4");
        }
        return list?.[idx];
      }
      this.setCanScratch(false);
      return this.brushTextureDict.get("Blank")?.[0];
    }
    getDefaultBrushTexture() {
      return this.brushTextureDict.get("Size1")?.[4];
    }
    updateScratching() {
      const t = this.CurrentTicket;
      let hovering = false;
      if (alive(t) && t.boundsCol) {
        const was = t.boundsCol.enabled;
        t.boundsCol.enabled = true;
        hovering = t.boundsCol.overlapPoint(cur("Player").MouseWorldPos);
        t.boundsCol.enabled = was;
      }
      this.updateScratchInput();
      this.updateShortcuts();
      this.updateScratchingSound(hovering);
      const cm = cur("CursorManager");
      if (cm && cm.IsHoveringScratchArea !== hovering) cm.IsHoveringScratchArea = hovering;
    }
    updateScratchInput() {
      const wp = cur("WristProtectionManager");
      if (wp?.Mode === 2 && this.clickAndHoldScratching) {
        const w = this.clickAndHoldScratching.getScratchWorldPos();
        this.CurrentScratchWorldPos = w;
        this.CurrentScratchScreenPos = Camera.main.worldToScreenPoint(w);
      } else {
        this.CurrentScratchScreenPos = { ...Input.mousePosition };
        this.CurrentScratchWorldPos = Camera.main.screenToWorldPoint(Input.mousePosition);
      }
      let v = { x: this.CurrentScratchWorldPos.x - this.lastScratchPos.x, y: this.CurrentScratchWorldPos.y - this.lastScratchPos.y };
      const m = Math.hypot(v.x, v.y);
      if (m > this.mouseVelocityMax) v = m > 1e-5 ? { x: v.x / m * this.mouseVelocityMax, y: v.y / m * this.mouseVelocityMax } : { x: 0, y: 0 };
      this.CurrentScratchVelocity = v;
      this.lastScratchPos = { ...this.CurrentScratchWorldPos };
    }
    updateShortcuts() {
      const t = this.CurrentTicket;
      if (!alive(t)) return;
      if (PlayerInputHelper.WasClaimButtonPressedThisFrame && t.CanCashOut) cur("Player").cashOutTicket(t, false, true);
      const trash = cur("TrashCan");
      if (PlayerInputHelper.WasTrashButtonPressedThisFrame && trash?.IsActive) trash.trashTicket?.(t);
    }
    updateScratchingSound(hovering) {
      const em = cur("EndingManager");
      const active = alive(this.CurrentTicket) && hovering && cur("Player").IsScratchInputActive && !(em?.IsEnding && em?.DisableScratching);
      if (!active) {
        this.setScratchVolume(0);
        return;
      }
      const speed = Math.hypot(this.CurrentScratchVelocity.x, this.CurrentScratchVelocity.y) / Math.max(1e-4, Time.deltaTime);
      const vol = Math.min(1, speed * this.scratchSoundVelocityMult * 0.01);
      if (this.scratchSource) {
        if (!this.scratchSource.isPlaying) {
          this.scratchSource.loop = true;
          this.scratchSource.play();
        }
        this.scratchSource.pitch = this.scratchSoundMinPitch + (this.scratchSoundMaxPitch - this.scratchSoundMinPitch) * vol;
      }
      this.setScratchVolume(vol);
    }
    setScratchVolume(v, instant = false) {
      const s2 = this.scratchSource;
      if (!s2) return;
      DOTween.kill(s2);
      v = Math.max(0, Math.min(1, v));
      if (instant) s2.volume = v;
      else DO.volume(s2, v, this.scratchVolumeFadeDuration);
    }
    setCanScratch(can) {
      const t = this.CurrentTicket;
      if (alive(t)) t.scratchStrengthTooLowLabel?.gameObject.setActive(!can);
      if (this.canScratch === can) return;
      this.canScratch = can;
      this.updateScratchAudio();
    }
    updateScratchAudio() {
      let clip = this.canScratch ? this.defaultScratchSound : this.cantScratchSound;
      if (cur("EndingManager")?.IsEnding) clip = this.filteredScratchSound;
      if (this.scratchSource && clip) {
        this.scratchSource.clip = clip;
        this.scratchSource.loop = true;
        this.scratchSource.play();
      }
    }
  };
  register2(PlayerScratching);
  var PlayerClickAndHoldScratch = class extends MonoBehaviour {
    static {
      __name(this, "PlayerClickAndHoldScratch");
    }
    ctor() {
      this.elapsedTime = 0;
      this.currentSlot = null;
    }
    update() {
      if (PlayerInputHelper.IsMousePressed) this.elapsedTime += Time.deltaTime;
    }
    resetElapsedTime() {
      this.elapsedTime = Math.PI / this.scratchSpeed;
    }
    // nearest unscratched slot of the open ticket (or the ending's world slot); radius from its coating
    tryGetClosestSlot() {
      const player = cur("Player");
      let slot = null;
      const em = cur("EndingManager");
      if (em?.IsEnding) slot = em.currentSlot;
      else {
        const t = player?.scratching?.CurrentTicket;
        if (!alive(t)) return null;
        const m = player.MouseWorldPos;
        let best = Infinity;
        for (const s2 of t.Symbols || []) {
          if (!s2?.gameObject.activeInHierarchy || s2.IsScratched) continue;
          const p2 = s2.transform.position;
          const d = (m.x - p2.x) ** 2 + (m.y - p2.y) ** 2;
          if (d < best) {
            best = d;
            slot = s2;
          }
        }
      }
      if (!slot) return null;
      const c = slot.CoatingSize;
      const lossy = slot.transform.lossyScale;
      let radius = Math.max(c.x, c.y) / 2 / 100 * Math.abs(lossy.x || 1);
      radius *= slot.clickAndHoldModeRadiusMult || 1;
      if (player?.scratching?.CurrentTicket?.Data?.id === "Day Job") radius *= this.dayJobRadiusMult ?? 0.7;
      if (this.currentSlot !== slot) this.elapsedTime = Math.PI / this.scratchSpeed;
      this.currentSlot = slot;
      const p = slot.transform.position;
      return { pos: { x: p.x, y: p.y }, radius };
    }
    getScratchWorldPos() {
      const r = this.tryGetClosestSlot();
      if (!r) return { x: 99999, y: 99999 };
      const h = this.currentSlot?.clickAndHoldModeHorizontalSpeedMult || 1, v = this.currentSlot?.clickAndHoldModeVerticalSpeedMult || 1;
      const s2 = Math.sin(h * this.elapsedTime * this.scratchSpeed);
      const vv = v * this.elapsedTime * this.verticalSpeed;
      const vm = vv - 2 * Math.floor(vv / 2);
      const tri = Math.min(1, Math.max(0, 1 - Math.abs(Math.min(2, vm) - 1)));
      const u = r.radius * s2, w = r.radius - 2 * r.radius * tri;
      return { x: r.pos.x + (u - w) * Math.SQRT1_2, y: r.pos.y + (u + w) * Math.SQRT1_2 };
    }
  };
  register2(PlayerClickAndHoldScratch);

  // web/src/game/shop.js
  var locRef = /* @__PURE__ */ __name((key) => {
    const l = new LocalizedString(null);
    l.key = key;
    return l;
  }, "locRef");
  var ProgressBar = class extends MonoBehaviour {
    static {
      __name(this, "ProgressBar");
    }
    lateUpdate() {
      this.updateFill();
    }
    updateFill() {
      const range = this.Maximum - this.Minimum;
      const t = range ? Math.max(0, Math.min(1, (this.Current - this.Minimum) / range)) : 0;
      if (this.Mask) {
        this.Mask.fillAmount = t;
      }
      if (this.Fill && this.color) this.Fill.color = Color.from(this.color);
    }
    setProgress(t) {
      this.Current = this.Minimum + (this.Maximum - this.Minimum) * t;
      this.updateFill();
    }
  };
  register2(ProgressBar);
  var ShopPanelLevelLabel = class extends MonoBehaviour {
    static {
      __name(this, "ShopPanelLevelLabel");
    }
    init(id) {
      this.ID = id;
      if (isFinalChanceTicket(id)) this.label?.gameObject.setActive(false);
      this.updateLabel();
    }
    get IsTicketLevelMaxed() {
      return cur("TicketProgressionManager")?.isMaxed(this.ID) ?? false;
    }
    isUpgradeMaxed() {
      const d = cur("StaticData").getUpgradeData(this.ID);
      const u = Save.getUpgradeSaveData(this.ID);
      return !!d && !!u && d.upgradeCount > 0 && u.buyCount >= d.upgradeCount;
    }
    updateLabel() {
      const id = this.ID;
      if (!id || !this.label || isFinalChanceTicket(id)) return;
      const sd = cur("StaticData");
      if (sd.ticketData[id]) {
        if (this.IsTicketLevelMaxed) this.label.text = this.maxedStringShort?.getLocalizedString() ?? "Max";
        else {
          const p = Save.getTicketProgressionData(id);
          this.label.text = `${this.ticketLevelShortString?.getLocalizedString() ?? "Lv"} ${p?.level ?? 0}`;
        }
        return;
      }
      if (!sd.upgradeData[id]) return;
      const tool = cur("Player")?.scratching?.scratchTool;
      if (tool?.isScratchTool(id)) {
        this.label.text = (this.strengthString?.getLocalizedString() ?? "Strength {x}").replace("{x}", String(tool.getStrength(id)));
        return;
      }
      const d = sd.getUpgradeData(id);
      if (this.isUpgradeMaxed()) {
        this.label.text = d.upgradeCount === 1 ? this.ownedString?.getLocalizedString() ?? "Owned" : this.maxedString?.getLocalizedString() ?? "Maxed";
        return;
      }
      const parent = this.label.transform.parent?.gameObject;
      parent?.setActive(d.upgradeCount !== 1);
      if (d.upgradeCount !== 1) {
        const u = Save.getUpgradeSaveData(id);
        this.label.text = `${u?.buyCount ?? 0}/${d.upgradeCount}`;
      }
    }
  };
  register2(ShopPanelLevelLabel);
  var ShopPanel = class extends MonoBehaviour {
    static {
      __name(this, "ShopPanel");
    }
    ctor() {
      this.Data = null;
      this.OnBought = new Action();
      this.OnLockedUpdated = new Action();
      this.IsLocked = false;
      this.AllBought = false;
    }
    awake() {
      this.button?.onClick.addListener(() => this.tryBuy(-1));
      this.levelUpLabelStartPos = this.levelUpLabel ? { ...this.levelUpLabel.transform.anchoredPosition } : { x: 0, y: 0 };
    }
    updatePanel(data) {
      this.Data = data;
      this.levelLabel?.init(data.id);
      const fc = isFinalChanceTicket(data.id);
      this.levelLabelBarGroup?.setActive(!fc);
      if (this.icon) this.icon.sprite = data.iconSprite;
      const loc = this.titleLabel?.getComponent("LocalizeStringEvent");
      if (loc) loc.StringReference = data.title;
      else if (this.titleLabel) this.titleLabel.text = data.title.getLocalizedString();
      this.calculatePrice();
      this.updateJackpotIcon();
    }
    get CurrentPrice() {
      return this._priceRaw();
    }
    _priceRaw() {
      const d = this.Data;
      if (!d) return 0;
      const sd = cur("StaticData");
      let price = d.basePrice;
      if (sd.ticketData[d.id]) price = price * (cur("LoanPanel")?.getTicketPriceMult?.() ?? 1) * (cur("MultiBuyPanel")?.multiBuyCount ?? 1);
      else if (sd.upgradeData[d.id]) {
        const u = Save.getUpgradeSaveData(d.id);
        if (d.upgradeCount === 1) price = d.basePrice;
        else {
          const mb = cur("MultiBuyPanel")?.multiBuyCount ?? 1;
          const left = d.upgradeCount - u.buyCount;
          price = 0;
          for (let k = 0; k < Math.min(mb, Math.max(0, left)); k++) price += Helper.getPrice(d.basePrice, d.priceIncrease, u.buyCount + k);
          if (left < 1) price = 0;
        }
      }
      return Helper.round(price);
    }
    calculatePrice() {
      const p = this._priceRaw();
      if (this.priceLabel) this.priceLabel.text = "$<space=2>" + fmt(p);
      const can = cur("Player")?.wallet?.canAfford(p) ?? false;
      if (this.priceLabel) this.priceLabel.color = can ? Color.white : new Color(1, 0.35, 0.35, 1);
      return p;
    }
    updateAllBought(all, reset = false) {
      if (this.AllBought === all && !reset) return;
      this.AllBought = all;
      this.priceLabel?.gameObject.setActive(!all);
      const d = cur("StaticData").upgradeData[this.Data?.id];
      if (this.button) this.button.interactable = !all;
      if (d && d.upgradeCount === 1 && all) this.levelLabel?.label?.transform.parent?.gameObject.setActive(true);
    }
    tryBuy(count = -1) {
      if (this.IsLocked || this.AllBought) return false;
      const sd = cur("StaticData");
      let ok = true;
      if (sd.ticketData[this.Data.id]) {
        const n = count === -1 ? cur("MultiBuyPanel")?.multiBuyCount ?? 1 : count;
        if (!cur("Player").canBuyTickets(n)) {
          cur("Player").showTableFullPopup();
          ok = false;
        }
      }
      if (ok) {
        const price = count === -1 ? this.calculatePrice() : this.Data.basePrice * count;
        if (cur("Player").wallet.trySubtract(price)) {
          if (count === -1 && price > 2e14) cur("AchievementManager")?.triggerAchievement?.("Spend all the worlds money");
          this.buy(count);
          return true;
        }
      }
      cur("AudioManager")?.playSound("error");
      return false;
    }
    buy(count = -1) {
      if (count === -1) cur("AudioManager")?.playSound("buy", 0.7);
      const sd = cur("StaticData");
      const up = sd.upgradeData[this.Data.id];
      let n = 1;
      if (count === -1) {
        const mb = cur("MultiBuyPanel")?.multiBuyCount ?? 1;
        n = mb;
        if (up && up.upgradeCount > 0) n = Math.min(mb, up.upgradeCount - Save.getUpgradeSaveData(this.Data.id).buyCount);
      } else n = count;
      for (let i = 0; i < Math.max(1, n); i++) this.OnBought.invoke(this, this.Data);
      this.calculatePrice();
    }
    setLevelProgress(level, progress, ticketLevelMaxed = false) {
      if (this.AllBought) return;
      if (this.levelBar) {
        this.levelBar.Current = ticketLevelMaxed ? 1 : progress;
        this.levelBar.updateFill?.();
      }
      this.levelLabel?.updateLabel();
    }
    setLocked(locked) {
      this.IsLocked = locked;
      for (const g of this.lockedObjects || []) g?.setActive(locked);
      for (const g of this.nonlockedObjects || []) g?.setActive(!locked);
      this.OnLockedUpdated.invoke(this);
    }
    playLevelUpEffect() {
      cur("AudioManager")?.playSound("levelUp");
      const l = this.levelUpLabel;
      if (!l) return;
      l.transform.anchoredPosition = { ...this.levelUpLabelStartPos };
      DOTween.kill(l.transform);
      DOTween.kill(l);
      l.color = l.color.withAlpha(1);
      l.gameObject.setActive(true);
      DO.anchorPosY(l.transform, this.levelUpLabelStartPos.y + this.levelUpLabelMoveYAmount, this.levelUpLabelMoveDuration);
      DO.fade(l, 0, this.levelUpLabelMoveDuration).onComplete(() => l.gameObject.setActive(false));
    }
    updateJackpotIcon() {
      const l = Save.Current?.layerOne;
      if (!l || !this.Data) return;
      this.jackpotIcon?.gameObject.setActive(l.jackpotsGotten.includes(this.Data.id));
      this.superJackpotIcon?.gameObject.setActive(l.superJackpotsGotten.includes("Super_" + this.Data.id));
    }
  };
  register2(ShopPanel);
  var TicketShop = class extends MonoBehaviour {
    static {
      __name(this, "TicketShop");
    }
    ctor() {
      this.shopPanelDict = /* @__PURE__ */ new Map();
      this.shopPanelList = [];
      this.OnTicketBought = new Action();
    }
    get CatalogCount() {
      return this.catalogs?.length ?? 0;
    }
    get ActiveCatalogs() {
      return (this.catalogs || []).filter((t) => t.gameObject.activeSelf).length;
    }
    start() {
      cur("Player")?.wallet?.OnMoneyUpdated.add(() => this.updatePanelsCanAfford());
      this.populateShop();
      for (const c of this.catalogs || []) c.gameObject.setActive(false);
      for (const c of this.notAvailableCatalogs || []) c.gameObject.setActive(false);
      for (let i = 1; i <= (this.catalogs?.length ?? 0); i++) if (Save.Current.layerOne.claimedCustomTableItems.includes(`Act ${i} Catalog`)) this.showCatalog(i, true);
    }
    populateShop() {
      const sd = cur("StaticData");
      const act = Save.Current.currentAct;
      const maxAct = cur("PrestigeManager")?.MAX_ACT ?? 4;
      for (const d of Object.values(sd.ticketData)) {
        if (d.catalog < 0) continue;
        if (d.id.includes("Final Chance") && d.catalog < maxAct - 1 && d.catalog < act) continue;
        if (d.catalog > act) continue;
        const shared = TicketDataUtil.getSharedID(d.id);
        this.spawnShopPanel({ id: d.id, iconSprite: sd.getSprite(shared), title: locRef(shared + "_name"), basePrice: d.price, priceIncrease: 1, upgradeCount: 0, panelIndex: d.catalog });
      }
    }
    spawnShopPanel(data) {
      let parent = this.shopPanelParent;
      if (data.panelIndex >= 1 && this.catalogs?.length) parent = this.catalogs[Math.min(this.catalogs.length - 1, data.panelIndex - 1)];
      const panel = Game.instantiate(this.shopPanelPrefab, parent);
      if (parent === this.shopPanelParent && this.catalogs?.length) panel.transform.setSiblingIndex(this.catalogs[0].getSiblingIndex());
      panel.updatePanel(data);
      panel.OnBought.add((p, item) => this.onItemBought(p, item));
      this.shopPanelDict.set(data.id, panel);
      this.shopPanelList.push(panel);
      return panel;
    }
    showCatalog(i, loadingIn) {
      const c = this.catalogs?.[i - 1];
      if (c) c.gameObject.setActive(true);
      const na = this.notAvailableCatalogs?.[i - 1];
      if (na) na.gameObject.setActive(false);
      if (!loadingIn) cur("GlobalEvents")?.OnCatalogUnlocked.invoke(i);
    }
    // highest-priced unlocked ticket
    getLastTicketUnlocked() {
      let best = null;
      for (const p of this.shopPanelDict.values()) if (!p.IsLocked && p.Data && (!best || p.Data.price > best.price)) best = p.Data;
      return best;
    }
    updatePanelsCanAfford() {
      for (const p of this.shopPanelDict.values()) p.calculatePrice();
    }
    onItemBought(panel, item) {
      let id = cur("LoanPanel")?.checkModifyBoughtTicketID?.(item.id) ?? item.id;
      if (!id) return;
      if (id.startsWith("Final Chance")) {
        const pm = cur("ProgressionManager");
        if (pm) pm.BoughtFinalChance = true;
        if (cur("EndingManager")?.checkSpawnFinalChanceWin?.()) id = FINAL_CHANCE_WIN_ID;
      }
      const sd = cur("StaticData");
      if (id !== "Day Job") Save.Current.layerOne.boughtScratchOff = true;
      cur("ItemSpawner").spawnTableItem(id, sd.getSprite(TicketDataUtil.getSharedID(id) + "_Small"), true);
      this.OnTicketBought.invoke(id);
    }
    loadData() {
      let idx = 0;
      for (const panel of this.shopPanelDict.values()) panel.setLocked(idx++ !== 0);
      for (const [id, panel] of this.shopPanelDict) {
        const p = Save.getTicketProgressionData(id);
        const d = cur("StaticData").getTicketData(id);
        if (!p || !d) continue;
        const need = cur("TicketProgressionManager")?.xpNeeded(d, p.level) || 1;
        panel.setLevelProgress(p.level, Math.max(0, Math.min(1, p.xp / need)), cur("TicketProgressionManager")?.isMaxed(id));
        panel.calculatePrice();
        panel.updateJackpotIcon();
      }
    }
  };
  register2(TicketShop);
  var STAT_TARGETS = [
    ["Scratch Luck", () => cur("Player")?.scratching, "_scratchLuck", true],
    ["Scratch Bot Speed", () => cur("ScratchBot"), "speedMult"],
    ["Scratch Bot Capacity", () => cur("ScratchBot"), "capacity", true],
    ["Scratch Bot Strength", () => cur("ScratchBot"), "strength", true],
    ["Fan Speed", () => cur("Fan"), "SpeedMult"],
    ["Fan Battery", () => cur("Fan"), "BatteryCapacityMult"],
    ["Mundo Speed", () => cur("Mundo"), "ClaimSpeedMult"],
    ["Buying Speed", () => cur("SubscriptionBot"), "ProcessingSpeedMult"],
    ["Timer Capacity", () => cur("EggTimer"), "BatteryCapacityMult"],
    ["Timer Charge", () => cur("EggTimer"), "BatteryChargeMult"],
    ["Warp Speed", () => cur("EggTimer"), "MultMultiplier"],
    ["Spell Charge Speed", () => cur("SpellBook"), "ChargeSpeedMult"]
  ];
  var UpgradeShop = class extends MonoBehaviour {
    static {
      __name(this, "UpgradeShop");
    }
    ctor() {
      this.shopPanelDict = /* @__PURE__ */ new Map();
    }
    start() {
      this.populateShop();
      cur("Player")?.wallet?.OnMoneyUpdated.add(() => this.onMoneyUpdated());
    }
    populateShop() {
      const sd = cur("StaticData");
      for (const d of Object.values(sd.upgradeData)) {
        const base = d.id.includes("_") ? d.id.split("_")[0] : d.id;
        this.spawnShopPanel({ id: d.id, iconSprite: sd.spriteDict.get(d.id) || sd.spriteDict.get(base) || null, title: locRef(base + "_name"), basePrice: d.basePrice, priceIncrease: d.priceIncrease, upgradeCount: d.upgradeCount, panelIndex: d.panelIndex });
      }
    }
    spawnShopPanel(data) {
      const parent = data.panelIndex === 1 && this.secondaryShopPanelParent ? this.secondaryShopPanelParent : this.shopPanelParent;
      const panel = Game.instantiate(this.shopPanelPrefab, parent);
      panel.updatePanel(data);
      panel.OnBought.add((p, item) => this.onItemBought(p, item));
      panel.OnLockedUpdated.add(() => this.updatePanelOrder());
      this.shopPanelDict.set(data.id, panel);
    }
    updatePanelOrder() {
      let i = 0;
      for (const p of this.shopPanelDict.values()) {
        if (p.Data.panelIndex !== 0) continue;
        if (p.IsLocked) p.transform.setAsLastSibling();
        else p.transform.setSiblingIndex(i++);
      }
    }
    onMoneyUpdated() {
      for (const p of this.shopPanelDict.values()) p.calculatePrice();
    }
    onItemBought(panel, item) {
      const u = Save.getUpgradeSaveData(item.id);
      if (!u) return;
      u.buyCount++;
      this.applyUpgrade(item.id);
      cur("Player")?.scratching?.scratchTool?.updateStats();
      this.updatePanelsVisibility();
      if (cur("Player")?.checkDefeat()) {
        cur("AchievementManager")?.triggerAchievement?.("Spend Last Money On Upgrade");
        return;
      }
      panel.levelLabel?.updateLabel();
      if (item.id === "Warp Speed" && u.buyCount >= item.upgradeCount) cur("AchievementManager")?.triggerAchievement?.("Time machine");
    }
    checkModifyValue(upgradeID, target, field, isInt, data) {
      if (!target || data.id !== upgradeID) return false;
      let v = target[field] ?? 0;
      if (data.valueIncreaseOperator === 2) v = isInt ? v + Math.trunc(data.valueIncrease) : v + data.valueIncrease;
      else if (data.valueIncreaseOperator === 1) v = isInt ? Math.trunc(v * data.valueIncrease) : v * data.valueIncrease;
      target[field] = v;
      data.OnValueModified?.invoke();
      return true;
    }
    applyUpgrade(id) {
      const sd = cur("StaticData");
      const data = sd.getUpgradeData(id);
      if (!data) return;
      const gadget = { "Trash Can": "TrashCan", "Scratch Bot": "ScratchBot", Fan: "Fan", "Sticky Mat": "StickyMat", Mundo: "Mundo", "Subscription Bot": "SubscriptionBot", "Egg Timer": "EggTimer", "The Machine": "TheMachine" }[id];
      if (gadget) {
        const g = cur(gadget);
        g?.gameObject.setActive(true);
        g?.onUpgraded?.();
      }
      if (id === "Spell Book") {
        const sb = cur("SpellBook");
        if (sb) {
          sb.CanUse = true;
          sb.gameObject.setActive(true);
        }
      }
      if (id === "Badge Collection" && !this._loading) cur("ItemSpawner")?.spawnTableItem("Badge Collection", sd.getSprite("Badge Collection_Small"), true);
      for (const [uid, getT, field, isInt] of STAT_TARGETS) this.checkModifyValue(uid, getT(), field, !!isInt, data);
    }
    updatePanelsVisibility() {
      const tool = cur("Player")?.scratching?.scratchTool;
      for (const p of this.shopPanelDict.values()) {
        const u = Save.getUpgradeSaveData(p.Data.id);
        p.updateAllBought(p.Data.upgradeCount !== 0 && u.buyCount >= p.Data.upgradeCount);
        tool?.checkModifyPanelVisibility(p);
        p.levelLabel?.updateLabel();
      }
      this.updatePanelOrder();
    }
    loadData() {
      this._loading = true;
      for (const [id, u] of Object.entries(Save.Current.layerOne.upgradeDataDict)) for (let i = 0; i < u.buyCount; i++) this.applyUpgrade(id);
      this._loading = false;
      for (const p of this.shopPanelDict.values()) {
        p.updateAllBought(false, true);
        p.calculatePrice();
        p.levelLabel?.updateLabel();
      }
      for (const p of this.shopPanelDict.values()) p.setLocked(p.Data.panelIndex === 0);
      this.updatePanelsVisibility();
    }
  };
  register2(UpgradeShop);
  var MultiBuyPanel = class extends MonoBehaviour {
    static {
      __name(this, "MultiBuyPanel");
    }
    awake() {
      this.multiBuyCount = this.multiBuyCount || 1;
    }
    start() {
      for (const b of this.buttons || []) b.OnButtonClicked.add((btn) => this.select(btn));
      this.refresh();
    }
    update() {
      if (!this.panel?.activeSelf || !cur("PerkManager")?.tryGetActivePerk(PerkType.Hotkeys)) return;
      for (let i = 0; i < 4; i++) if (Input.getKeyDown(String(i + 1)) && this.buttons?.[i]) this.select(this.buttons[i]);
    }
    select(btn) {
      this.multiBuyCount = btn.buyCount;
      this.refresh();
      cur("TicketShop")?.updatePanelsCanAfford();
      cur("UpgradeShop")?.onMoneyUpdated();
    }
    refresh() {
      for (const b of this.buttons || []) b.setSelected(b.buyCount === this.multiBuyCount);
      this.panel?.setActive(!!cur("PerkManager")?.tryGetActivePerk(PerkType.ShoppingSpree));
    }
  };
  register2(MultiBuyPanel);
  var MultiBuyButton = class extends MonoBehaviour {
    static {
      __name(this, "MultiBuyButton");
    }
    ctor() {
      this.OnButtonClicked = new Action();
    }
    awake() {
      this.button?.onClick.addListener(() => this.OnButtonClicked.invoke(this));
    }
    setSelected(s2) {
      if (this.bgImage) this.bgImage.color = Color.from(s2 ? this.selectedColor : this.notSelectedColor);
    }
  };
  register2(MultiBuyButton);
  var ShopTabs = class extends MonoBehaviour {
    static {
      __name(this, "ShopTabs");
    }
    start() {
      (this.buttons || []).forEach((b, i) => b.onClick.addListener(() => this.select(i)));
      this.select(0);
    }
    select(index) {
      (this.panels || []).forEach((p, i) => p?.setActive(i === index));
      (this.buttons || []).forEach((b, i) => {
        const img = b.targetGraphic || b.getComponent("Image");
        if (img) img.color = Color.from(i === index ? this.selectedColor : this.unselectedColor);
      });
      this.multiBuyPanel?.setActive?.(true);
      cur("AudioManager")?.playSound?.("buttonClick");
    }
  };
  register2(ShopTabs);
  var TicketProgressionManager = class extends MonoBehaviour {
    static {
      __name(this, "TicketProgressionManager");
    }
    xpNeeded(d, level) {
      let need = Helper.getPredictedValueInt(d.xpNeeded, d.xpIncreaseMult, level);
      const p = cur("PerkManager")?.tryGetActivePerk(PerkType.BuiltDifferent);
      if (p) need = Math.trunc((1 - perkValue(p)) * need);
      return need;
    }
    addXPToTicket(d, wasTrashed, autoScratched, instantLevelUp = false) {
      if (!d || d.id === "Loan" || d.id.startsWith("Super_") || this.isMaxed(d.id)) return;
      const prog = Save.getTicketProgressionData(d.id);
      if (!prog) return;
      const gain = cur("PerkManager").getTicketXP(d, 1, wasTrashed, autoScratched);
      let need = this.xpNeeded(d, prog.level);
      prog.xp += instantLevelUp ? need - prog.xp : gain;
      const panel = this.ticketShop?.shopPanelDict?.get(d.id);
      if (!panel) console.error("Could not find shop panel for ticket ID: " + d.id);
      if (need <= prog.xp) {
        prog.xp -= need;
        prog.level++;
        need = Helper.getPredictedValueInt(d.xpNeeded, d.xpIncreaseMult, prog.level);
        panel?.playLevelUpEffect();
        if (cur("PerkManager").getTicketMaxLevel(d.id) <= prog.level) cur("CosmeticManager")?.checkCosmeticsUnlocked?.();
      }
      panel?.setLevelProgress(prog.level, Math.max(0, Math.min(1, prog.xp / need)), this.isMaxed(d.id));
    }
    isMaxed(id) {
      const p = Save.getTicketProgressionData(id);
      return !!p && cur("PerkManager").getTicketMaxLevel(id) <= p.level;
    }
  };
  register2(TicketProgressionManager);
  var ItemSpawner = class extends MonoBehaviour {
    static {
      __name(this, "ItemSpawner");
    }
    ctor() {
      this.CurrentSortingOrder = 0;
      this.LastSpawnedTableItem = null;
    }
    start() {
      this.startingCamOrthoSize = Camera.main?.orthographicSize ?? 1.8;
    }
    spawnTableItemFromSave(save) {
      const sd = cur("StaticData");
      const sprite = save.id.startsWith("Super_") ? sd.spriteDict.get("Super_Small") : sd.spriteDict.get(TicketDataUtil.getSharedID(save.id) + "_Small") || sd.spriteDict.get(save.id + "_Small");
      this.spawnTableItem(save.id, sprite, false);
      const ti = this.LastSpawnedTableItem;
      if (!ti) return;
      for (const sid of save.symbols || []) {
        const s2 = sd.symbolData[sid];
        if (s2) ti.CachedSymbols.push(s2);
      }
      ti.transform.position = new Vec3(save.posX, save.posY, ti.transform.position.z);
      if (save.autoScratched) {
        ti.setAutoScratched(true);
        cur("ScratchBot")?.ScratchedTickets?.push(ti);
      }
    }
    spawnTableItem(id, sprite, flyDownFromTop = true) {
      const pm = cur("ProgressionManager");
      if (pm?.isCustomTableItem?.(id) && cur("Player").TableItems.some((t) => t.Data?.id === id)) return;
      const x = Random.range(-this.spawnRangeWidth, this.spawnRangeWidth);
      const y = this.startingCamOrthoSize + this.screenSpawnOffsetY;
      const ti = Game.instantiate(this.tableItemPrefab, this.tableItemParent);
      ti.transform.position = new Vec3(x, y, 0);
      if (ti.sortingGroup) ti.sortingGroup.transform.localRotation = Quat.euler(0, 0, Random.range(-this.randomRotationAngle, this.randomRotationAngle));
      this.CurrentSortingOrder++;
      if (ti.sortingGroup) ti.sortingGroup.sortingOrder = this.CurrentSortingOrder;
      let dir = { x: 0, y: 0 }, speed = 0;
      if (flyDownFromTop) {
        const a = (Random.range(-this.coneAngle * 0.5, this.coneAngle * 0.5) - 90) * Math.PI / 180;
        dir = { x: Math.cos(a), y: Math.sin(a) };
        speed = Random.range(this.initialSpeedMin, this.initialSpeedMax);
      } else ti.transform.position = new Vec3(0, 0, 0);
      ti.updateData({ id, sprite, moveDirection: dir, moveSpeed: speed, velocityCurve: this.velocityCurve, curveDuration: this.curveDuration });
      cur("Player").TableItems.push(ti);
      this.LastSpawnedTableItem = ti;
      cur("GlobalEvents")?.OnTableItemSpawned.invoke(ti);
      return ti;
    }
    respawnCustomTableItem(id) {
      const sd = cur("StaticData");
      this.spawnTableItem(id, sd.spriteDict.get(id + "_Small") || sd.spriteDict.get(id), true);
    }
    spawnTicket(id) {
      let prefabId = id;
      if (id === "Super_Final Chance_Win") prefabId = "Super Final Chance";
      else if (id.startsWith("Super_")) prefabId = "Super Jackpot Chance";
      else if (id.startsWith("Final Chance") && id !== FINAL_CHANCE_WIN_ID) prefabId = "Final Chance";
      const sd = cur("StaticData");
      const t = Game.instantiate(sd.getTicketPrefab(prefabId))?.getComponent("Ticket");
      t.updateData(sd.getTicketData(id));
      if (id === "Loan") {
        const s2 = t.Symbols[0];
        if (s2) {
          s2.UseValueOverride = true;
          s2.ValueOverride = Math.max(0, 5 - Save.money());
        }
      }
      if (id !== "Day Job" && !Save.Current.layerOne.firstTicketOpened) {
        Save.Current.layerOne.firstTicketOpened = true;
        t.IsFirstTicketOpenedThisPrestige = true;
      }
      return t;
    }
    // ScratchParticle(color, pos): launched along the scratch velocity, rotated by a random angle within the spread
    spawnScratchParticle(color, pos) {
      const m = cur("ScratchParticleManager");
      const sc = cur("Player")?.scratching;
      if (!m || !sc) return;
      const v = sc.CurrentScratchVelocity || { x: 0, y: 0 };
      const sp = sc.scratchParticleSpeed ?? 1;
      const a = Random.range(sc.scratchParticleAngleSpread * -0.5, sc.scratchParticleAngleSpread * 0.5) * 0.017453292;
      const x = v.x * sp, y = v.y * sp;
      const c = Math.cos(a), s2 = Math.sin(a);
      const vx = x * c - y * s2, vy = x * s2 + y * c;
      m.activateParticle({ x: pos.x, y: pos.y, vx, vy, startX: vx, c: color, t: 0, a: 1 });
    }
  };
  register2(ItemSpawner);
  var ObjectPooler = class extends MonoBehaviour {
    static {
      __name(this, "ObjectPooler");
    }
  };
  register2(ObjectPooler);

  // web/src/game/progression.js
  var ProgressionManager = class extends MonoBehaviour {
    static {
      __name(this, "ProgressionManager");
    }
    ctor() {
      this.allGoals = [];
      this.currentGoal = null;
      this.BoughtFinalChance = false;
      this.customTableItems = ["Upgrade Catalog", "Badge Collection"];
    }
    get CurrentGoal() {
      return this.currentGoal;
    }
    start() {
      this._onLang = () => this.updateProgressionBar();
      Localization.listeners.add(this._onLang);
    }
    onDestroy() {
      Localization.listeners.delete(this._onLang);
    }
    isCustomTableItem(id) {
      if (!id) return false;
      if (id.startsWith("Act") && id.endsWith("Catalog")) return true;
      return (this.customTableItems || []).includes(id);
    }
    loadData() {
      this.allGoals = [...cur("StaticData").progressionGoalData].sort((a, b) => a.moneyNeeded - b.moneyNeeded);
      const last = Save.Current.layerOne.lastUnlockedProgressionGoal;
      for (const g of this.allGoals) {
        if (g.moneyNeeded <= last || this.canInstantClaim(g)) this.claimGoalRewards(g, true);
      }
      this.updateCurrentGoal();
      this.updateProgressionBar();
    }
    updateCurrentGoal() {
      const last = Save.Current.layerOne.lastUnlockedProgressionGoal;
      const bought = Save.Current.boughtPrestigeUpgrades || {};
      this.currentGoal = null;
      for (const g of this.allGoals) {
        const any = g.rewards.some((r) => this.rewardConditionMet(r.condition));
        if (!any) continue;
        const ic = g.rewards[0]?.instantClaim;
        if (ic && bought[ic] !== void 0) continue;
        if (last < g.moneyNeeded) {
          this.currentGoal = g;
          break;
        }
      }
    }
    onMoneyEarned(amount) {
      if (!this.currentGoal) return;
      Save.addTotalMoneyEarned(amount);
      const total = Save.totalMoneyEarned();
      if (total >= this.currentGoal.moneyNeeded) {
        const g = this.currentGoal;
        Save.Current.layerOne.lastUnlockedProgressionGoal = g.moneyNeeded;
        Save.setTotalMoneyEarned(0);
        this.claimGoalRewards(g, false);
        this.updateCurrentGoal();
      }
      this.updateProgressionBar();
    }
    claimGoalRewards(goal, loadingFromSave) {
      if (!goal?.rewards?.length) return;
      goal.rewards.forEach((reward, i) => {
        if (!this.rewardConditionMet(reward.condition)) return;
        const showPopup = i === 0 ? !loadingFromSave : false;
        const action = /* @__PURE__ */ __name(() => this.applyReward(reward, showPopup, loadingFromSave), "action");
        if (reward.dialogue && !loadingFromSave) cur("DialogueManager")?.queueDialogue(reward.dialogue, true, action);
        else action();
      });
    }
    applyReward(r, showPopup, loading) {
      switch (r.type) {
        case "Ticket": {
          const p = cur("TicketShop")?.shopPanelDict.get(r.id);
          if (p) this.unlockShopPanel(p, showPopup, "_Small");
          break;
        }
        case "Gadget": {
          const p = cur("UpgradeShop")?.shopPanelDict.get(r.id);
          if (p) this.unlockShopPanel(p, showPopup, "");
          break;
        }
        case "Dialogue":
          if (!loading) cur("DialogueManager")?.queueDialogue(r.id, true, null);
          break;
        case "Custom Table Item":
          this.spawnCustomTableItem(r.id);
          break;
        case "Mechanic":
          this.unlockMechanic(r.id);
          break;
        default:
          console.error("Invalid progression reward type: " + r.type);
      }
    }
    spawnCustomTableItem(id) {
      if (Save.Current.layerOne.claimedCustomTableItems.includes(id)) {
        this.onCustomTableItemOpened(id, false);
        return;
      }
      const sd = cur("StaticData");
      const spriteId = id === "Badge Collection" ? id + "_Small" : id;
      cur("ItemSpawner")?.spawnTableItem(id, sd.getSprite(spriteId), true);
    }
    unlockShopPanel(panel, showPopup, suffix = "") {
      panel.setLocked(false);
      if (showPopup && suffix === "_Small" && panel.Data) cur("GlobalEvents")?.OnTicketUnlocked.invoke(panel.Data.id);
      if (!showPopup || !panel.Data) return;
      let id = panel.Data.id;
      if (suffix === "_Small") id = TicketDataUtil.getSharedID(id);
      const sprite = cur("StaticData").getSprite(id + suffix);
      const text = `${this.unlockedItemString?.getLocalizedString() ?? "Unlocked"}
${panel.Data.title?.getLocalizedString?.() ?? id}`;
      cur("Player")?.itemUnlockPopup?.show(sprite, text);
    }
    unlockMechanic(id) {
      if (id === "Prestige Button") {
        const pm = cur("PrestigeManager");
        pm?.updatePrestigeButtonLabel?.();
        pm?.prestigeButton?.gameObject?.setActive(true);
      }
    }
    rewardConditionMet(cond) {
      if (!cond) return true;
      if (!cond.includes("Act")) return (Save.Current.boughtPrestigeUpgrades?.[cond] ?? 0) > 0;
      let s2 = cond.replace("Act", "").trim();
      const plus = s2.includes("+");
      if (plus) s2 = s2.replace("+", "");
      const n = parseInt(s2, 10);
      const act = Save.Current.currentAct;
      return act === n || plus && n < act;
    }
    canInstantClaim(goal) {
      const ic = goal.rewards?.[0]?.instantClaim;
      return !!ic && Save.Current.boughtPrestigeUpgrades?.[ic] !== void 0;
    }
    updateProgressionBar() {
      const lbl = this.progressionBarLabel;
      if (!this.currentGoal) {
        if (lbl) lbl.text = this.maxedOutString?.getLocalizedString() ?? "Maxed out";
        if (this.progressionBar) this.progressionBar.Current = 1;
        return;
      }
      const total = Save.totalMoneyEarned();
      const sp = this.textSpacing ?? 2;
      if (lbl) lbl.text = `${fmt(total)}<space=${sp}>/<space=${sp}>${fmt(this.currentGoal.moneyNeeded)}`;
      if (this.progressionBar) this.progressionBar.Current = Math.min(1, total / this.currentGoal.moneyNeeded);
    }
    onCustomTableItemOpened(id, showPopup) {
      let remove = true;
      const l = Save.Current.layerOne;
      if (id !== "Badge Collection" && !l.claimedCustomTableItems.includes(id)) l.claimedCustomTableItems.push(id);
      const sd = cur("StaticData");
      const popup = cur("Player")?.itemUnlockPopup;
      const unlocked = this.unlockedItemString?.getLocalizedString() ?? "Unlocked";
      if (id.startsWith("Act") && id.endsWith("Catalog")) {
        const n = parseInt(id.replace("Act", "").replace("Catalog", "").trim(), 10);
        if (showPopup) popup?.show(sd.getSprite(`Act ${n} Catalog`), `${unlocked}
${(this.catalogNumLabel?.getLocalizedString() ?? "Catalog #{x}").replace("{x}", String(n))}`);
        cur("TicketShop")?.showCatalog(n, !showPopup);
      } else if (id === "Upgrade Catalog") {
        this.upgradeShop?.setActive(true);
        if (showPopup) popup?.show(sd.getSprite("Upgrade Catalog"), `${unlocked}
${this.upgradesString?.getLocalizedString() ?? "Upgrades"}`);
      } else if (id === "Badge Collection") {
        remove = false;
        cur("BadgeCollection")?.show?.();
      }
      return { remove };
    }
    // The very first Day Job (level 0) always comes out clean.
    checkGenerateCustomTicket(ticket) {
      if (ticket?.Data?.id !== "Day Job") return null;
      const p = Save.getTicketProgressionData("Day Job");
      if (!p || p.level > 0) return null;
      const clean = ticket.Data.symbols.find((s2) => s2.type === 1);
      return clean ? [clean] : null;
    }
    onBadSymbolScratched() {
      if (Save.Current.dialoguesPlayed.includes("trashCanTutorial")) return;
      const id = cur("Player")?.scratching?.CurrentTicket?.Data?.id;
      if (!id || id.startsWith("Super_")) return;
      cur("DialogueManager")?.queueDialogue("trashCanTutorial", true, null);
    }
  };
  register2(ProgressionManager);

  // web/src/game/ui_game.js
  var ease = /* @__PURE__ */ __name((e) => typeof e === "number" ? EaseByIndex[e] === "Unset" ? "OutQuad" : EaseByIndex[e] : e || "OutQuad", "ease");
  var ItemUnlockPopup = class extends MonoBehaviour {
    static {
      __name(this, "ItemUnlockPopup");
    }
    ctor() {
      this.isPlaying = false;
      this.elapsedTime = 0;
      this.currentCallback = null;
      this.queue = [];
    }
    start() {
      if (this.panel) this.panel.alpha = 0;
    }
    show(sprite, text, startDelay = 0, callback = null) {
      this.currentCallback = callback;
      this.startCoroutine(this.doShow(sprite, text, startDelay));
    }
    Show(...a) {
      return this.show(...a);
    }
    *doShow(sprite, text, startDelay = 0) {
      if (startDelay > 0) yield new WaitForSeconds(startDelay);
      const am = cur("AudioManager");
      if (this.customSound) am?.playSound(this.customSound, this.customSoundVolume || 1);
      else am?.playSound(this.jackpot ? "jackpot" : "rewardBig");
      if (this.icon && sprite) this.icon.sprite = sprite;
      if (this.shadow && sprite) this.shadow.sprite = sprite;
      if (this.label) this.label.text = text ?? "";
      this.isPlaying = true;
      this.elapsedTime = 0;
      this.particles?.play?.();
    }
    update() {
      if (!this.isPlaying) return;
      this.elapsedTime += Time.deltaTime;
      const t = this.elapsedTime / (this.animationDuration || 1);
      const s2 = this.animationCurve ? evaluateCurve(this.animationCurve, t) : 1;
      if (this.panel) {
        this.panel.transform.localScale = new Vec3(s2, s2, s2);
        this.panel.alpha = this.alphaCurve ? evaluateCurve(this.alphaCurve, t) : 1 - t;
      }
      if (t >= 1) {
        this.isPlaying = false;
        if (this.panel) this.panel.alpha = 0;
        const cb = this.currentCallback;
        this.currentCallback = null;
        cb?.();
      }
    }
  };
  register2(ItemUnlockPopup);
  var Popup = class extends MonoBehaviour {
    static {
      __name(this, "Popup");
    }
    ctor() {
      this.callback = null;
    }
    awake() {
      this.startingScale = this.panel ? this.panel.transform.localScale.clone() : new Vec3(1, 1, 1);
      this.button?.onClick.addListener(() => this.hide());
      this.continueButton?.onClick.addListener(() => this.hide());
      this.panel?.setActive(false);
    }
    get IsActive() {
      return !!this.panel?.activeSelf;
    }
    show(title, description, buttonText, callback = null) {
      if (typeof title === "function" || title === null && arguments.length === 1) {
        callback = title;
        title = description = buttonText = null;
      }
      this.callback = callback;
      if (this.titleLabel && title != null) this.titleLabel.text = title;
      if (this.descriptionLabel && description != null) this.descriptionLabel.text = description;
      if (this.buttonLabel && buttonText != null) this.buttonLabel.text = buttonText;
      const p = this.panel;
      if (!p) return;
      p.setActive(true);
      p.transform.localScale = new Vec3(0, 0, 0);
      DO.scale(p.transform, this.startingScale, this.scaleInDuration || 0.25).setEase(ease(this.scaleInEase)).setUpdate(true);
    }
    hide() {
      const p = this.panel;
      if (!p) return;
      DO.scale(p.transform, 0, this.scaleOutDuration || 0.2).setEase(ease(this.scaleOutEase)).setUpdate(true).onComplete(() => {
        p.setActive(false);
        const cb = this.callback;
        this.callback = null;
        cb?.();
      });
    }
  };
  register2(Popup);
  var AnimatedUIPanel = class extends MonoBehaviour {
    static {
      __name(this, "AnimatedUIPanel");
    }
    ctor() {
      this.IsShown = false;
    }
    start() {
      if (this.blackBG) {
        this.blackBGStartAlpha = this.blackBG.color.a;
        this.blackBG.color = this.blackBG.color.withAlpha(0);
        this.blackBG.gameObject.setActive(true);
        this.blackBG.raycastTarget = false;
      }
      this.startingScale = this.panel ? this.panel.transform.localScale.clone() : new Vec3(1, 1, 1);
      if (this.panelTransform) this.startPos = { ...this.panelTransform.anchoredPosition };
    }
    show() {
      if (this.IsShown) return;
      this.IsShown = true;
      const p = this.panel;
      if (!p) return;
      p.setActive(true);
      if (this.outsideScreenPos && this.panelTransform) {
        DOTween.kill(this.panelTransform);
        this.panelTransform.anchoredPosition = { ...this.outsideScreenPos.anchoredPosition };
        DO.anchorPos(this.panelTransform, this.startPos, this.scaleInDuration).setEase(ease(this.scaleInEase)).setUpdate(true);
      } else {
        DOTween.kill(p.transform);
        p.transform.localScale = new Vec3(0, 0, 0);
        DO.scale(p.transform, this.startingScale, this.scaleInDuration).setEase(ease(this.scaleInEase)).setUpdate(true);
      }
      if (this.blackBG) {
        this.blackBG.raycastTarget = true;
        DOTween.kill(this.blackBG);
        DO.fade(this.blackBG, this.blackBGStartAlpha, this.blackBGFadeDuration).setUpdate(true);
      }
    }
    hide(instant = false) {
      if (!this.IsShown && !instant) return;
      this.IsShown = false;
      const p = this.panel;
      if (!p) return;
      const done = /* @__PURE__ */ __name(() => p.setActive(false), "done");
      if (instant) {
        done();
        if (this.blackBG) this.blackBG.color = this.blackBG.color.withAlpha(0);
        return;
      }
      if (this.outsideScreenPos && this.panelTransform) DO.anchorPos(this.panelTransform, { ...this.outsideScreenPos.anchoredPosition }, this.scaleOutDuration).setEase(ease(this.scaleOutEase)).setUpdate(true).onComplete(done);
      else DO.scale(p.transform, 0, this.scaleOutDuration).setEase(ease(this.scaleOutEase)).setUpdate(true).onComplete(done);
      if (this.blackBG) {
        this.blackBG.raycastTarget = false;
        DOTween.kill(this.blackBG);
        DO.fade(this.blackBG, 0, this.blackBGFadeDuration).setUpdate(true);
      }
    }
    toggle() {
      if (this.IsShown) this.hide();
      else this.show();
    }
  };
  register2(AnimatedUIPanel);
  var ButtonAudio = class extends MonoBehaviour {
    static {
      __name(this, "ButtonAudio");
    }
    start() {
      this.button?.onClick.addListener(() => {
        const am = cur("AudioManager");
        const c = am?.getAudioFromID("buttonClick");
        if (c) am.sfxSource?.playOneShot(c, this.volume ?? 1);
      });
    }
  };
  register2(ButtonAudio);
  var UITabButton = class extends MonoBehaviour {
    static {
      __name(this, "UITabButton");
    }
    setSelected(sel) {
      this.selected = sel;
      this.panel?.setActive(sel);
      if (this.image) this.image.color = Color.from(sel ? this.selectedColor : this.defaultColor);
    }
    setLocked(locked) {
      if (this.button) this.button.interactable = !locked;
      if (this.image) this.image.color = Color.from(locked ? this.lockedColor : this.selected ? this.selectedColor : this.defaultColor);
    }
  };
  register2(UITabButton);
  var UITabs = class extends MonoBehaviour {
    static {
      __name(this, "UITabs");
    }
    awake() {
      (this.tabButtons || []).forEach((b, i) => b?.button?.onClick.addListener(() => this.select(i)));
    }
    show() {
      const i = (this.tabButtons || []).findIndex((b) => b.panel === this.defaultPanel);
      this.select(Math.max(0, i));
    }
    select(i) {
      this.currentPanelIndex = i;
      (this.tabButtons || []).forEach((b, k) => b?.setSelected(k === i));
    }
  };
  register2(UITabs);
  var LocalizedStringWithValue = class extends MonoBehaviour {
    static {
      __name(this, "LocalizedStringWithValue");
    }
    awake() {
      this._f = () => this.updateLabelText();
      Localization.listeners.add(this._f);
    }
    start() {
      this.updateLabelText();
    }
    onDestroy() {
      Localization.listeners.delete(this._f);
    }
    setValue(v) {
      this.value = String(v);
      this.updateLabelText();
    }
    updateLabelText() {
      if (this.label && this.localizedString) this.label.text = this.localizedString.getLocalizedString().replace("{x}", this.value ?? "");
    }
  };
  register2(LocalizedStringWithValue);
  var LocalizedFont = class extends MonoBehaviour {
    static {
      __name(this, "LocalizedFont");
    }
    awake() {
      const l = this.label;
      if (!l) return;
      this.originalFont = l.font;
      this.originalFontSize = l.fontSize;
      this.originalFontSizeMin = l.fontSizeMin;
      this.originalFontSizeMax = l.fontSizeMax;
      this.originalMargin = { ...l.margin };
      this._f = () => this.updateLabelFont();
      Localization.listeners.add(this._f);
    }
    start() {
      this.updateLabelFont();
    }
    onDestroy() {
      Localization.listeners.delete(this._f);
    }
    updateLabelFont() {
      const l = this.label;
      if (!l) return;
      const lm = cur("LocalizationManager");
      const entry = lm?.getFontForLocale?.(Localization.code, this.useBold);
      if (!entry || Localization.code === "en") {
        l.font = this.originalFont;
        l.fontSize = this.originalFontSize;
        l.fontSizeMin = this.originalFontSizeMin;
        l.fontSizeMax = this.originalFontSizeMax;
        l.margin = { ...this.originalMargin };
      } else {
        l.font = entry.font || this.originalFont;
        const k = entry.sizeMult || 1;
        l.fontSize = this.overrideSize > 0 ? this.overrideSize : this.originalFontSize * k;
        l.fontSizeMin = this.originalFontSizeMin * k;
        l.fontSizeMax = this.originalFontSizeMax * k;
        if (this.useTopMarginOverride) l.margin = { ...this.originalMargin, y: this.overrideTopMargin };
      }
      l.forceMeshUpdate?.();
    }
  };
  register2(LocalizedFont);
  var SafeAreaFitter = class extends MonoBehaviour {
    static {
      __name(this, "SafeAreaFitter");
    }
    update() {
      const rt = this.safeAreaTransform || this.transform;
      if (!rt?.isRect) return;
      rt.anchorMin = { x: 0, y: 0 };
      rt.anchorMax = { x: 1, y: 1 };
    }
  };
  register2(SafeAreaFitter);
  var MobileCanvasScaler = class extends MonoBehaviour {
    static {
      __name(this, "MobileCanvasScaler");
    }
    awake() {
      if (!globalThis.matchMedia?.("(pointer: coarse)").matches) return;
      const sc = this.getComponent("CanvasScaler");
      if (!sc) return;
      sc.referenceResolution = { x: sc.referenceResolution.x * 0.8333333, y: sc.referenceResolution.y * 0.8333333 };
    }
  };
  register2(MobileCanvasScaler);

  // web/src/game/gadgets.js
  var mouseWorld = /* @__PURE__ */ __name(() => cur("Player")?.MouseWorldPos || { x: 0, y: 0 }, "mouseWorld");
  function overlap(col, p = mouseWorld()) {
    if (!col) return false;
    const was = col.enabled;
    col.enabled = true;
    const r = col.overlapPoint(p);
    col.enabled = was;
    return r;
  }
  __name(overlap, "overlap");
  var eggMult = /* @__PURE__ */ __name(() => cur("EggTimer")?.Multiplier ?? 1, "eggMult");
  var ease2 = /* @__PURE__ */ __name((e) => typeof e === "number" ? EaseByIndex[e] === "Unset" ? "OutQuad" : EaseByIndex[e] : e || "OutQuad", "ease");
  var TrashCan = class extends MonoBehaviour {
    static {
      __name(this, "TrashCan");
    }
    get IsDead() {
      return !!Save.Current?.layerOne?.trashCanDead;
    }
    get IsActive() {
      return this.gameObject.activeSelf && !this.IsDead;
    }
    get CenterPos() {
      const p = (this.trashCenter || this.transform).position;
      return { x: p.x, y: p.y };
    }
    start() {
      this.gameObject.setActive(false);
      if (this.IsDead) this.die(true);
      this.trashButton?.gameObject.setActive(false);
      this.trashButton?.onClick.addListener(() => {
        const t = cur("Player")?.scratching?.CurrentTicket;
        if (t) this.trashTicket(t);
      });
      cur("Player")?.OnTicketOpened.add(() => this.showTrashButton(true));
      cur("Player")?.OnTicketClosed.add(() => this.showTrashButton(false));
      cur("Player")?.OnStateChanged.add((s2) => {
        if (s2 !== 2) this.showTrashButton(false);
      });
    }
    checkHover(p) {
      return overlap(this.boxCollider, p);
    }
    update() {
      if (cur("SuperJackpotManager")?.IsActive || this.IsDead) return;
      const player = cur("Player");
      if (!player) return;
      const hover = overlap(this.boxCollider);
      if (!hover) {
        this.cantTrashOverlay?.setActive(false);
        if (!this.isPlayingTrashingAnimation) this.setClosed(true);
        return;
      }
      const cant = cur("ChallengeManager")?.CantUseTrashCan || player.HasEndingStarted;
      const held = player.tryGetHeldTableItem();
      if (cant) {
        this.cantTrashOverlay?.setActive(!!held);
        return;
      }
      if (player.scratching?.CurrentTicket) return;
      if (!held) {
        this.setClosed(true);
        return;
      }
      this.setClosed(false);
      if (Input.getMouseButtonUp(0)) {
        cur("AudioManager")?.playSound("trash", 0.7);
        player.dropTableItemInTrash(held, false);
        if (cur("StaticData").ticketData[held.Data.id]) this.checkRefund(held.Data.id);
        this.setClosed(true);
        if (held.Data.id.toLowerCase().includes("final chance")) this.die(false);
      }
    }
    dropItem() {
    }
    trashTicket(ticket) {
      if (this.IsDead || cur("SuperJackpotManager")?.IsActive || !alive(ticket)) return;
      cur("AudioManager")?.playSound("trash", 0.7);
      cur("GlobalEvents")?.OnTicketTrashed.invoke(ticket);
      this.checkRefund(ticket.Data.id);
      const wasAuto = ticket.AutoScratched;
      const fc = ticket.IsFinalChance;
      cur("Player").discardTicket(ticket, true, true);
      this.doZoomOut(ticket);
      if (fc) {
        this.die(false);
        return;
      }
      if (wasAuto) cur("Player").openNextAutoScratchedTicket();
    }
    doZoomOut() {
      this.setClosed(false);
      this.startCoroutine(function* () {
        yield new WaitForSeconds(0.3);
        this.setClosed(true);
      });
    }
    checkRefund(id) {
      const p = cur("PerkManager")?.tryGetActivePerk(PerkType.Refund);
      if (!p || !id) return;
      if (Random.value < perkValue(p)) {
        const sd = cur("StaticData");
        cur("ItemSpawner")?.spawnTableItem(id, sd.getSprite(TicketDataUtil.getSharedID(id) + "_Small"), true);
      }
    }
    setClosed(closed) {
      this.closedSR?.gameObject.setActive(closed);
      this.openSR?.gameObject.setActive(!closed);
    }
    trashMundoTicket(item, startDelay, duration) {
      if (!alive(item)) return;
      const c = this.CenterPos;
      item.col && (item.col.enabled = false);
      DO.move(item.transform, { x: c.x, y: c.y, z: item.transform.position.z }, duration).setDelay(startDelay);
      this.playTrashingAnimation(startDelay, duration, () => {
        if (alive(item)) cur("Player").dropTableItemInTrash(item, true);
      });
    }
    playTrashingAnimation(startDelay, duration, callback) {
      if (this.IsDead) {
        callback?.();
        return;
      }
      const ge = cur("GlobalEvents");
      ge.callAfterTime(startDelay, () => {
        this.isPlayingTrashingAnimation = true;
        this.setClosed(false);
      });
      ge.callAfterTime(startDelay + duration, () => {
        this.isPlayingTrashingAnimation = false;
        this.setClosed(true);
        cur("AudioManager")?.playSound("trash", 0.7);
        callback?.();
      });
    }
    die(loadingIn = false) {
      if (!loadingIn) {
        cur("AudioManager")?.playSound("trashCanDeath", 0.8);
        Save.Current.layerOne.trashCanDead = true;
      }
      if (this.closedSR) {
        this.closedSR.sprite = this.deadSprite;
        this.closedSR.gameObject.setActive(true);
      }
      this.openSR?.gameObject.setActive(false);
      if (!loadingIn && this.closedSR) {
        DO.fade(this.closedSR, 0, this.dieDuration);
        const p = this.closedSR.transform.position;
        DO.move(this.closedSR.transform, { x: p.x, y: p.y + this.dieMoveDistance, z: p.z }, this.dieDuration);
      } else if (this.closedSR) this.closedSR.color = this.closedSR.color.withAlpha(0);
      this.showTrashButton(false);
    }
    showTrashButton(show) {
      this.trashButton?.gameObject.setActive(show && this.IsActive);
    }
  };
  register2(TrashCan);
  var ScratchBot = class extends MonoBehaviour {
    static {
      __name(this, "ScratchBot");
    }
    ctor() {
      this.ticketQueue = [];
      this.ScratchedTickets = [];
      this.tweeningTickets = [];
      this.elapsedProcessingTime = 0;
      this.currentTicket = null;
      this.currentScratchEfficiencyMult = 1;
      this.extraSpeed = 0;
      this.extraCapacity = 0;
      this.extraStrength = 0;
      this.particlesPlaying = false;
    }
    get Capacity() {
      return Math.trunc(Math.max(1, this.extraCapacity) * this.capacity);
    }
    get Strength() {
      return this.extraStrength + this.strength;
    }
    get SpeedMult() {
      return this.speedMult * Math.max(1, this.extraSpeed) * (cur("LoanPanel")?.getSpeedReductionMult?.() ?? 1) * eggMult();
    }
    start() {
      this.gameObject.setActive(false);
      if (this.ticketTooHardWarningLabel) this.ticketTooHardWarningLabel.color = this.ticketTooHardWarningLabel.color.withAlpha(0);
      for (const a of this.animators || []) a.speed = 0;
      this.updateCapacityLabel();
    }
    onUpgraded() {
      this.updateCapacityLabel();
    }
    getCurrentTicketCount() {
      return this.ticketQueue.length + (alive(this.currentTicket) ? 1 : 0);
    }
    checkHover(p) {
      return overlap(this.boxCollider, p);
    }
    getTicketHardness(id) {
      const d = cur("StaticData").getTicketData(id);
      if (!d) return 0;
      if (id === "Day Job" && cur("PerkManager")?.tryGetActivePerk(PerkType.Dishwasher)) return 0;
      return d.hardness;
    }
    getEfficiencyMult(hard) {
      const d = this.Strength - hard;
      if (d < -2) return 0;
      return { "-2": 0.25, "-1": 0.5, 0: 1, 1: 1.5 }[d] ?? 2;
    }
    updateScratchEfficiencySpeed() {
      if (this.currentTicket?.Data) this.currentScratchEfficiencyMult = this.getEfficiencyMult(this.getTicketHardness(this.currentTicket.Data.id));
    }
    tryAddTicket(item) {
      if (!item?.Data || item.Data.id === "Loan" || cur("ProgressionManager")?.isCustomTableItem(item.Data.id)) return false;
      if (this.Capacity <= this.ticketQueue.length + (alive(this.currentTicket) ? 1 : 0) + this.tweeningTickets.length) return false;
      if (this.Strength - this.getTicketHardness(item.Data.id) < -2) {
        const l = this.ticketTooHardWarningLabel;
        if (l) {
          DOTween.kill(l.transform);
          DO.punchScale(l.transform, 0.1, 0.4, 10, 1);
          DOTween.kill(l);
          l.color = l.color.withAlpha(1);
          DO.fade(l, 0, this.ticketTooHardWarningLabelFadeDuration).setDelay(this.ticketTooHardWarningLabelFadeDelay);
        }
        return false;
      }
      if (item.col) item.col.enabled = false;
      this.tweeningTickets.push(item);
      this.tryCacheSymbols(item);
      const s2 = this.startPos.position;
      DO.move(item.transform, { x: s2.x, y: s2.y, z: item.transform.position.z }, this.snappingDuration).setEase(ease2(this.snappingEase)).onComplete(() => {
        const i = this.tweeningTickets.indexOf(item);
        if (i >= 0) this.tweeningTickets.splice(i, 1);
        if (alive(item)) {
          this.ticketQueue.push(item);
          if (item.transform && this.ticketsGettingScratchedParent) item.transform.setParent(this.ticketsGettingScratchedParent, true);
        }
        this.updateCapacityLabel();
      });
      this.updateCapacityLabel();
      return true;
    }
    tryCacheSymbols(item) {
      const player = cur("Player");
      const inst = player?.ticketInstanceDict.get(item.Data.id);
      if (!inst || inst === player.scratching?.CurrentTicket) return;
      item.CachedSymbols = inst.Symbols.map((s2) => s2.Data);
      player.discardTicket(inst, false, false);
    }
    throwTicket(item) {
      cur("AudioManager")?.playSound("error");
      const b = this.boxCollider;
      if (!b || !alive(item)) return;
      const c = this.transform.position;
      const p = item.transform.position;
      let dx = p.x - (c.x + b.offset.x), dy = p.y - (c.y + b.offset.y + b.size.y * 0.5);
      const m = Math.hypot(dx, dy) || 1;
      item.yeet(this.ticketYeetSpeed, this.ticketYeetDuration, { x: dx / m, y: dy / m });
    }
    updateCapacityLabel() {
      if (this.capacityLabel) this.capacityLabel.text = `${this.getCurrentTicketCount()}<space=9>/<space=9>${this.Capacity}`;
    }
    update() {
      const cur0 = this.currentTicket;
      if (!alive(cur0)) {
        this.currentTicket = null;
        if (!this.ticketQueue.length) return;
        this.elapsedProcessingTime = 0;
        this.currentTicket = this.ticketQueue.shift();
        if (!alive(this.currentTicket)) {
          this.currentTicket = null;
          return;
        }
        this.updateScratchEfficiencySpeed();
        this.updateCapacityLabel();
        this.ticketStartPos = this.currentTicket.transform.position;
        for (const a2 of this.animators || []) a2.speed = this.SpeedMult;
        return;
      }
      this.elapsedProcessingTime += Time.deltaTime * this.SpeedMult * this.currentScratchEfficiencyMult;
      const t = Math.max(0, Math.min(1, this.elapsedProcessingTime / this.processingDuration));
      const e = this.endPos.position, s0 = this.ticketStartPos;
      cur0.transform.position = new Vec3(s0.x, s0.y + (e.y - s0.y) * t, s0.z);
      if (!this.particlesPlaying && this.particlesStartRatio < t) {
        this.particlesPlaying = true;
        for (const p of this.particles || []) p?.play?.();
      }
      if (this.particlesPlaying && this.particlesStopRatio < t) {
        this.particlesPlaying = false;
        for (const p of this.particles || []) p?.stop?.();
      }
      const k = (t - this.changeSpriteToScratchedRatioStart) / (this.changeSpriteToScratchedRatioStop - this.changeSpriteToScratchedRatioStart);
      const a = k <= 1 ? Math.max(0, 1 - k) : 0;
      if (cur0.spriteRenderer) cur0.spriteRenderer.color = new Color(1, 1, 1, a);
      if (cur0.scratchedSpriteRenderer?.sprite) {
        cur0.scratchedSpriteRenderer.gameObject.setActive(true);
        cur0.scratchedSpriteRenderer.color = new Color(1, 1, 1, 1);
      }
      if (this.elapsedProcessingTime < this.processingDuration) return;
      this.elapsedProcessingTime = 0;
      this.ScratchedTickets.push(cur0);
      if (this.ScratchedTickets.length > 99) cur("AchievementManager")?.triggerAchievement?.("Clicker minigame");
      if (cur0.col) cur0.col.enabled = true;
      cur0.setAutoScratched(true);
      if (cur0.spriteRenderer) cur0.spriteRenderer.color = new Color(1, 1, 1, 1);
      const player = cur("Player");
      if (player?.tableItemsParent) cur0.transform.setParent(player.tableItemsParent, true);
      this.currentTicket = null;
      for (const an of this.animators || []) an.speed = 0;
      this.updateCapacityLabel();
    }
  };
  register2(ScratchBot);
  var Fan = class extends MonoBehaviour {
    static {
      __name(this, "Fan");
    }
    start() {
      this.sqrPickupDist = this.pickupDist * this.pickupDist;
      this.gameObject.setActive(false);
      this.stopButton?.onClick.addListener(() => this.stopFan());
      this.setFanMode(!!cur("PerkManager")?.tryGetActivePerk(PerkType.ElectricFan));
      this.previousAnimatorSpeed = 0;
    }
    setFanMode(electric) {
      this.electricFanMode = electric;
      const [normal, elec] = [this.animators?.[0], this.animators?.[1]];
      normal?.gameObject.setActive(!electric);
      elec?.gameObject.setActive(electric);
    }
    set AnimatorSpeed(v) {
      for (const a of this.animators || []) a.speed = v;
    }
    get AnimatorSpeed() {
      return this.animators?.[0]?.speed ?? 0;
    }
    isMouseOverlapping() {
      if (EventSystem.isPointerOverGameObject()) return false;
      return overlap(this.boxCollider2D);
    }
    update() {
      if (cur("PauseMenu")?.IsActive) return;
      if (this.electricFanMode) this.updateElectricFan();
      else this.updateNormalFan();
      const sp = this.AnimatorSpeed;
      if (sp > 0 && this.previousAnimatorSpeed === 0) cur("AudioManager")?.playSound("fanStart");
      else if (sp === 0 && this.previousAnimatorSpeed > 0) cur("AudioManager")?.playSound("fanStop");
      this.previousAnimatorSpeed = sp;
    }
    updateNormalFan() {
      if (Input.getMouseButton(0) && this.isMouseOverlapping()) {
        this.AnimatorSpeed = this.animationSpeed * this.SpeedMult;
        this.blowItems();
      } else this.AnimatorSpeed = 0;
    }
    updateElectricFan() {
      const l = Save.Current.layerOne;
      const cap = this.startingBatteryCapacity * this.BatteryCapacityMult;
      if (Input.getMouseButtonDown(0) && this.isMouseOverlapping()) {
        l.electricFanChargeLeft = cap;
        l.fanPaused = false;
        this.AnimatorSpeed = this.animationSpeed;
        cur("AudioManager")?.playSound(this.chargeUpSound || "fanStart");
      }
      if (!l.fanPaused) {
        l.electricFanChargeLeft = Math.max(0, l.electricFanChargeLeft - Time.deltaTime);
        if (this.batteryBar) this.batteryBar.Current = l.electricFanChargeLeft / cap;
        if (l.electricFanChargeLeft > 0) {
          this.AnimatorSpeed = this.animationSpeed * this.SpeedMult;
          this.blowItems();
        } else this.AnimatorSpeed = 0;
      }
      this.stopButton?.gameObject.setActive(l.electricFanChargeLeft > 0 && !l.fanPaused);
    }
    canBlow(item) {
      if (!alive(item) || !item.gameObject.activeSelf || !item.Data) return false;
      if (item.Data.id === "Day Job" && !cur("PerkManager")?.tryGetActivePerk(PerkType.Dishwasher)) return false;
      if (item.Data.id === "Loan" || item.AutoScratched || item.col && !item.col.enabled) return false;
      if (cur("ProgressionManager")?.isCustomTableItem(item.Data.id)) return false;
      if (cur("StickyMat")?.containsTicket?.(item.transform.position)) return false;
      return !item.Data.id.startsWith("Super_");
    }
    blowItems() {
      const bot = this.autoScratcher;
      if (!bot) return;
      const target = bot.startPos.position;
      for (const item of [...cur("Player").TableItems]) {
        if (!this.canBlow(item)) continue;
        const p = item.transform.position;
        let dx = target.x - p.x, dy = target.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (this.sqrPickupDist <= d2) {
          const d = Math.sqrt(d2) || 1;
          const s2 = this.blowSpeed * this.SpeedMult * Time.deltaTime;
          item.transform.position = new Vec3(p.x + dx / d * s2, p.y + dy / d * s2, p.z);
        } else if (bot.gameObject.activeSelf) bot.tryAddTicket(item);
      }
    }
    stopFan() {
      Save.Current.layerOne.fanPaused = true;
      this.AnimatorSpeed = 0;
    }
  };
  register2(Fan);
  var Mundo = class extends MonoBehaviour {
    static {
      __name(this, "Mundo");
    }
    ctor() {
      this.paused = false;
    }
    get CanClaim() {
      return (cur("ScratchBot")?.ScratchedTickets?.length ?? 0) > 0 && !Save.Current?.layerOne?.mundoDead;
    }
    start() {
      this.gameObject.setActive(false);
      if (Save.Current.layerOne.mundoDead) this.die(true);
    }
    update() {
      if (Save.Current.layerOne.mundoDead) return;
      if (this.animator) this.animator.speed = this.CanClaim && !this.paused ? this.claimSpeed * this.ClaimSpeedMult * eggMult() : 0;
      if (Input.getMouseButtonDown(0) && !EventSystem.isPointerOverGameObject() && overlap(this.boxCollider)) this.setPaused(!this.paused);
    }
    setPaused(p) {
      this.paused = p;
      if (this.animator) this.animator.speed = p ? 0 : this.claimSpeed * this.ClaimSpeedMult * eggMult();
      if (p) this.sleepOverlay?.play?.("Sleep Start");
      this.sleepOverlay?.gameObject.setActive(p);
    }
    // animation event
    onMundoArmDown() {
      if (!this.CanClaim) return;
      const bot = cur("ScratchBot");
      const player = cur("Player");
      const item = bot.ScratchedTickets[bot.ScratchedTickets.length - 1];
      const ticket = player.getTicketInstance(item, false);
      if (ticket === player.scratching?.CurrentTicket) return;
      if (ticket.IsFinalChance) {
        this.die(false);
        return;
      }
      ticket.AutoScratched = true;
      const r = ticket.getValue({ includeNonRevealed: true, updateMultLabel: false });
      if (cur("PerkManager")?.tryGetActivePerk(PerkType.PickyEater) && r.value <= 0 && cur("TrashCan")?.IsActive) {
        const i = bot.ScratchedTickets.indexOf(item);
        if (i >= 0) bot.ScratchedTickets.splice(i, 1);
        player.discardTicket(ticket, true, false);
        cur("TrashCan").trashMundoTicket(item, 0, this.flyToTrashCanDuration);
        return;
      }
      if (ticket.hasSuperJackpot(true)) {
        const sid = "Super_" + ticket.Data.id;
        cur("ItemSpawner").spawnTableItem(sid, cur("StaticData").spriteDict.get("Super_Small") || null, true);
      }
      const color = r.hasJackpot ? this.popupTextJackpotColor : r.value > 0 ? this.popupTextWinColor : r.value === 0 ? this.popupTextDudColor : this.popupTextLossColor;
      this.spawnPopupText("$" + fmt(r.value), color, r.hasJackpot);
      if (r.value < 0 && player.wallet.Money < 1) player.checkDefeat();
      player.cashOutTicket(ticket, true, false);
      player.removeTableItem(item);
    }
    onMundoArmUp() {
      if (!this.CanClaim && this.animator) this.animator.speed = 0;
    }
    spawnPopupText(text, color, bounce) {
      if (!this.popupTextPrefab) return;
      const pt = Game.instantiate(this.popupTextPrefab, this.popupTextPos || this.transform);
      pt?.init?.(text, color, bounce);
    }
    die(loadingIn = false) {
      if (!loadingIn) {
        cur("AudioManager")?.playSound("mundoDeath", 0.8);
        Save.Current.layerOne.mundoDead = true;
      }
      if (this.animator) this.animator.setEnabled(false);
      if (this.spriteRenderer) {
        this.spriteRenderer.sprite = this.deadSprite;
        if (!loadingIn) {
          DO.fade(this.spriteRenderer, 0, this.dieDuration);
          const p = this.spriteRenderer.transform.position;
          DO.move(this.spriteRenderer.transform, { x: p.x, y: p.y + this.dieMoveDistance, z: p.z }, this.dieDuration);
        } else this.spriteRenderer.color = this.spriteRenderer.color.withAlpha(0);
      }
    }
  };
  register2(Mundo);
  var PopupText = class extends MonoBehaviour {
    static {
      __name(this, "PopupText");
    }
    init(text, color, bounce) {
      const l = this.label;
      if (!l) return;
      l.text = text;
      l.color = Color.from(color);
      DO.fade(l, 0, this.fadeDuration).setDelay(this.fadeStartDelay).onComplete(() => Game.destroy(this.gameObject));
      if (bounce) DO.punchScale(l.transform, this.bounceScale, this.bounceDuration, 10, 1);
      this.initialized = true;
    }
    update() {
      if (!this.initialized) return;
      const p = this.transform.position;
      this.transform.position = new Vec3(p.x, p.y + Time.deltaTime * this.speed, p.z);
    }
  };
  register2(PopupText);
  var StickyMat = class extends MonoBehaviour {
    static {
      __name(this, "StickyMat");
    }
    start() {
      this.gameObject.setActive(false);
    }
    containsTicket(p) {
      return this.gameObject.activeInHierarchy && overlap(this.boxCollider, p);
    }
  };
  register2(StickyMat);
  var SubscriptionBot = class extends MonoBehaviour {
    static {
      __name(this, "SubscriptionBot");
    }
    ctor() {
      this.paused = false;
      this.elapsedTime = 0;
      this.CurrentTicket = null;
    }
    start() {
      this.gameObject.setActive(false);
      this.setCurrentTicket(null);
    }
    update() {
      this.handleInput();
      this.updatePaused();
      if (this.animator) this.animator.speed = this.CurrentTicket && !this.paused ? this.ProcessingSpeedMult * eggMult() : 0;
    }
    updatePaused() {
    }
    handleInput() {
      if (cur("Player")?.IsTicketOpen || !Input.getMouseButtonDown(0) || EventSystem.isPointerOverGameObject()) return;
      if (!overlap(this.boxCollider, Camera.main.screenToWorldPoint(Input.mousePosition))) return;
      cur("AudioManager")?.playSound("buttonClick");
      const ui = cur("AutoBuyerUI");
      ui?.refresh?.();
      ui?.animatedPanel?.show?.() ?? ui?.show?.();
    }
    onAnimationBuyEvent() {
      if (!this.paused) this.tryBuyTicket();
    }
    tryBuyTicket() {
      if (!this.CurrentTicket) return false;
      const panel = cur("TicketShop")?.shopPanelDict.get(this.CurrentTicket.id);
      if (!panel || panel.IsLocked) return false;
      return panel.tryBuy(1);
    }
    setCurrentTicket(t) {
      this.CurrentTicket = t || null;
      if (this.ticketImage) this.ticketImage.sprite = t ? cur("StaticData").getSprite(TicketDataUtil.getSharedID(t.id) + "_Small") : this.noTicketSprite;
    }
    setPaused(p) {
      this.paused = p;
    }
  };
  register2(SubscriptionBot);
  var EggTimer = class extends MonoBehaviour {
    static {
      __name(this, "EggTimer");
    }
    get Multiplier() {
      if (!this.gameObject.activeInHierarchy) return 1;
      return (Save.Current?.layerOne?.eggTimerChargeLeft ?? 0) > 0 ? this.multiplier * this.MultMultiplier : 1;
    }
    start() {
      this.startPos = { x: this.transform.localPosition.x, y: this.transform.localPosition.y };
      this.gameObject.setActive(false);
      this.previousChargeLeft = 0;
    }
    isMouseOverlapping() {
      return !EventSystem.isPointerOverGameObject() && overlap(this.boxCollider2D);
    }
    update() {
      const l = Save.Current.layerOne;
      const cap = this.startingBatteryCapacity * this.BatteryCapacityMult;
      if (Input.getMouseButtonDown(0) && this.isMouseOverlapping()) {
        l.eggTimerChargeLeft = Math.min(cap, l.eggTimerChargeLeft + this.startingBatteryChargePerClick * this.BatteryChargeMult);
        cur("AudioManager")?.playSound("eggTimerWind");
        DO.punchRotation(this.transform, this.shakeAngle, this.shakeDuration, 10, 1);
      }
      if (l.eggTimerChargeLeft > 0) l.eggTimerChargeLeft = Math.max(0, l.eggTimerChargeLeft - Time.unscaledDeltaTime);
      if (this.batteryBar) this.batteryBar.Current = l.eggTimerChargeLeft / cap;
      if (this.previousChargeLeft > 0 && l.eggTimerChargeLeft <= 0) this.playRingAnimation();
      this.previousChargeLeft = l.eggTimerChargeLeft;
    }
    playRingAnimation() {
      cur("AudioManager")?.playSound("eggTimerRing");
      const tr = this.transform;
      const s2 = this.startPos;
      const seq = DOTween.sequence();
      seq.append(DO.localMoveY(tr, s2.y + this.liftHeight, this.liftUpTime));
      seq.join(DO.shakeRotation(tr, this.ringDuration, this.shakeAngle, 20, 90, false));
      seq.append(DO.localMoveY(tr, s2.y, this.fallDownTime).setEase("InQuad"));
      seq.setDelay(this.ringStartDelay || 0);
    }
  };
  register2(EggTimer);
  var SpellBook = class extends MonoBehaviour {
    static {
      __name(this, "SpellBook");
    }
    ctor() {
      this.CanUse = false;
      this.RechargeSpeedMult = 1;
      this.ChargeSpeedMult = 1;
    }
    start() {
      this.spells = this.getComponentsInChildren("Spell", true);
      this.gameObject.setActive(this.CanUse || (Save.getUpgradeSaveData("Spell Book")?.buyCount ?? 0) > 0);
    }
    update() {
      for (const s2 of this.spells || []) s2.tickCooldown?.();
      if (PlayerInputHelper.WasSpellButtonPressedThisFrame) this.spells?.[0]?.tryUse();
    }
    show() {
      this.animatedPanel?.show();
    }
    hide() {
      this.animatedPanel?.hide();
    }
    onPointerClick() {
      if (this.animatedPanel?.IsShown) this.hide();
      else this.show();
    }
  };
  register2(SpellBook);
  var Spell = class extends MonoBehaviour {
    static {
      __name(this, "Spell");
    }
    start() {
      this.currentCooldownTime = 0;
      this.button?.onClick.addListener(() => this.tryUse());
    }
    tickCooldown() {
      const sb = cur("SpellBook");
      const speed = (sb?.ChargeSpeedMult ?? 1) * (sb?.RechargeSpeedMult ?? 1) * eggMult();
      this.currentCooldownTime = Math.max(0, this.currentCooldownTime - Time.deltaTime * speed);
      if (this.cooldownBar) this.cooldownBar.Current = 1 - this.currentCooldownTime / this.cooldownDuration;
      if (this.button) this.button.interactable = this.currentCooldownTime <= 0;
    }
    tryUse() {
      if (this.currentCooldownTime > 0) return;
      if (this.tryCast()) {
        this.currentCooldownTime = this.cooldownDuration;
        cur("SpellBook")?.hide();
      } else cur("AudioManager")?.playSound("error");
    }
    tryCast() {
      const player = cur("Player");
      const t = player?.scratching?.CurrentTicket;
      if (!alive(t) || !t.gameObject.activeSelf || t.AllScratched) return false;
      t.scratch();
      if (this.effectParticles) {
        this.effectParticles.transform.position = t.transform.position;
        this.effectParticles.play?.();
      }
      cur("AchievementManager")?.triggerAchievement?.("Wizard");
      return true;
    }
    showHighlight() {
    }
  };
  register2(Spell);
  var TheMachine = class extends MonoBehaviour {
    static {
      __name(this, "TheMachine");
    }
    static get UNLOCKED_IN_ACT() {
      return 5;
    }
    ctor() {
      this.IsPoweringDown = false;
    }
    awake() {
      this.tiers = Object.values(cur("StaticData")?.machineTiersData || {});
      this.feedButton?.button?.onClick.addListener(() => this.tryFeed());
      this.updateDisplayLabels(false, false);
      this.gameObject.setActive(false);
    }
    start() {
      this.updateButton();
      this.updateProgressBar();
      this.updateDisplayLabels(false, false);
      cur("GlobalEvents")?.OnTicketCashedOut.add((t, v, u) => this.onTicketCashedOut(t, v, u));
    }
    get CurrentTierData() {
      const t = Save.Current.layerOne.machineTier;
      return this.tiers[Math.max(0, Math.min(this.tiers.length - 1, t))];
    }
    get Maxed() {
      return this.tiers.length <= Save.Current.layerOne.machineTier;
    }
    get IncomeMult() {
      const t = Save.Current?.layerOne?.machineTier ?? 0;
      if (!t || !this.gameObject.activeInHierarchy) return 1;
      return this.tiers[Math.max(0, Math.min(this.tiers.length - 1, t - 1))]?.bonusIncome ?? 1;
    }
    update() {
      const l = Save.Current.layerOne;
      if (l.machineProcessingTimeLeft > 0) {
        l.machineProcessingTimeLeft -= Time.deltaTime;
        if (l.machineProcessingTimeLeft <= 0) {
          l.machineProcessingTimeLeft = 0;
          this.startCoroutine(this.onFinishedProcessing());
        }
      }
      this.updateProgressBar();
    }
    tryFeed() {
      const l = Save.Current.layerOne;
      if (this.Maxed || l.machineProcessingTimeLeft > 0) return;
      const tier = this.CurrentTierData;
      if (!cur("Player").wallet.trySubtract(tier.price)) {
        const am = cur("AudioManager");
        const c = am?.getAudioFromID("error");
        if (c) am.sfxSource?.playOneShot(c);
        return;
      }
      cur("AudioManager")?.playSound(this.feedSound, 1);
      l.machineFeedCount++;
      if (tier.paymentCount <= l.machineFeedCount) {
        cur("AudioManager")?.playSound(this.machinePoweringUpSound, 1);
        l.machineProcessingTimeLeft = this.processingDuration;
      }
      this.updateProgressBar();
      this.updateButton();
    }
    *onFinishedProcessing() {
      cur("AudioManager")?.playSound(this.machinePoweringDownSound, 1);
      this.IsPoweringDown = true;
      yield new WaitForSeconds(this.machinePoweringDownSound?.length ?? 1);
      this.IsPoweringDown = false;
      cur("AudioManager")?.playSound(this.levelUpSound, 1);
      const l = Save.Current.layerOne;
      l.souls += this.CurrentTierData?.souls ?? 0;
      l.machineTier++;
      l.machineFeedCount = 0;
      this.updateDisplayLabels(true, true);
      this.updateButton();
      cur("AchievementManager")?.triggerAchievement?.("Soul Siphon");
    }
    updateProgressBar() {
      if (!this.progressBar) return;
      const l = Save.Current.layerOne;
      if (l.machineProcessingTimeLeft > 0) this.progressBar.Current = 1 - l.machineProcessingTimeLeft / this.processingDuration;
      else if (!this.IsPoweringDown) this.progressBar.Current = this.Maxed ? 1 : l.machineFeedCount / (this.CurrentTierData?.paymentCount || 1);
    }
    updateButton() {
      const l = Save.Current.layerOne;
      const busy = l.machineProcessingTimeLeft > 0 || this.IsPoweringDown;
      let label;
      if (this.Maxed) label = this.maxedString?.getLocalizedString() || "Maxed";
      else {
        const f = this.feedString?.getLocalizedString() || "Feed";
        label = f.includes("{x}") ? f.replace("{x}", fmt(this.CurrentTierData.price)) : `${f}<space=3>$${fmt(this.CurrentTierData.price)}`;
      }
      if (this.feedButtonLabel) this.feedButtonLabel.text = label;
      else this.feedButton?.setText?.(label);
      this.feedButton?.setButtonDisabled?.(this.Maxed || busy, Color.from(this.buttonDisabledColor || new Color(0.5, 0.5, 0.5, 1)));
    }
    updateDisplayLabels(bounceSouls, bounceMult) {
      const l = Save.Current?.layerOne;
      if (!l) return;
      if (this.soulsLabel) {
        this.soulsLabel.text = String(l.souls);
        if (bounceSouls) {
          DOTween.kill(this.soulsLabel.transform, true);
          DO.punchScale(this.soulsLabel.transform, this.labelBounceScale, this.labelBounceDuration, 10, 1);
        }
      }
      if (this.moneyMultLabel) {
        this.moneyMultLabel.text = `x${+this.IncomeMult.toFixed(2)}`;
        if (bounceMult) {
          DOTween.kill(this.moneyMultLabel.transform, true);
          DO.punchScale(this.moneyMultLabel.transform, this.labelBounceScale, this.labelBounceDuration, 10, 1);
        }
      }
    }
    addSouls(n) {
      Save.Current.layerOne.souls += n;
      this.updateDisplayLabels(true, false);
    }
    isCurrentTicketSuperFinalChanceAndWin() {
      const t = cur("Player")?.scratching?.CurrentTicket;
      return !!t && t.Data?.id === "Super_Final Chance_Win" && t.Symbols.every((x) => x.Data?.type === 3);
    }
    // a stored soul is spent instead of dying: the ticket gets a "-1" (soul) claim button
    tryConsumeSoul() {
      const l = Save.Current.layerOne;
      if (!this.gameObject.activeSelf || l.souls < 1) return false;
      l.souls--;
      this.updateDisplayLabels(true, false);
      cur("GlobalEvents")?.callNextFrame(() => {
        if (this.isCurrentTicketSuperFinalChanceAndWin()) return;
        const t = cur("Player")?.scratching?.CurrentTicket;
        if (!t?.cashOutButton) return;
        t.cashOutButton.gameObject.setActive(true);
        if (t.cashOutButtonLabel) t.cashOutButtonLabel.text = "-<space=3>1";
      });
      return true;
    }
    onTicketCashedOut(ticket) {
      if (!ticket?.Data) return;
      const winFC = ticket.IsFinalChance && ticket.Data.id !== "Final Chance_Win";
      if (!winFC && ticket.Data.id !== "Super_Final Chance_Win") return;
      this.updateDisplayLabels(false, false);
    }
  };
  register2(TheMachine);
  var LunchboxButton = class extends MonoBehaviour {
    static {
      __name(this, "LunchboxButton");
    }
    awake() {
      this.disabled = false;
      if (this.buttonText && this.label) this.setText(this.buttonText);
    }
    onPointerDown() {
      if (this.disabled) return;
      this.setPressedVisuals(true);
      if (this.pressSound) cur("AudioManager")?.playSound(this.pressSound, this.buttonSoundVolume || 1);
    }
    onPointerUp() {
      this.setPressedVisuals(false);
      if (this.releaseSound && !this.disabled) cur("AudioManager")?.playSound(this.releaseSound, this.buttonSoundVolume || 1);
    }
    onPointerEnter() {
      if (this.highlightImage) this.highlightImage.gameObject.setActive(true);
    }
    onPointerExit() {
      if (this.highlightImage) this.highlightImage.gameObject.setActive(false);
      this.setPressedVisuals(false);
    }
    setPressedVisuals(p) {
      if (this.image) this.image.sprite = p ? this.pressedSprite || this.image.sprite : this.defaultSprite || this.image.sprite;
      if (this.content) this.content.anchoredPosition = { x: this.content.anchoredPosition.x, y: p ? -(this.pixelMoveAmountOnPressed || 2) : 0 };
    }
    setText(t) {
      if (this.label) this.label.text = t;
      if (this.labelUnderlay) this.labelUnderlay.text = t;
    }
    setTextColor(c) {
      if (this.label) this.label.color = c;
    }
    setButtonDisabled(d, color) {
      this.disabled = d;
      if (this.button) this.button.interactable = !d;
      if (this.image) this.image.color = d ? color : Color.from(this.buttonDefaultColor || new Color(1, 1, 1, 1));
    }
  };
  register2(LunchboxButton);

  // web/src/game/persistent_ui.js
  var ButtonProgressBar = class extends MonoBehaviour {
    static {
      __name(this, "ButtonProgressBar");
    }
    ctor() {
      this.isPressed = false;
      this.elapsedPressTime = 0;
      this.OnAction = new Action();
      this.OnClick = this.OnAction;
    }
    start() {
      if (this.progressBar) this.progressBar.Current = 0;
    }
    update() {
      if (this.button?.interactable && this.isPressed) {
        this.elapsedPressTime += Time.unscaledDeltaTime;
        if (this.progressBar) this.progressBar.Current = this.elapsedPressTime / this.duration;
        if (this.elapsedPressTime <= this.duration) return;
        this.audioSource?.stop();
        cur("AudioManager")?.playSound(this.onActionSound, 1);
        this.OnAction.invoke();
        this.elapsedPressTime = 0;
        this.isPressed = false;
      }
      if (this.progressBar) this.progressBar.Current = 0;
    }
    onPointerDown() {
      if (!this.button?.interactable) return;
      this.isPressed = true;
      this.audioSource?.play();
    }
    onPointerUp() {
      this.isPressed = false;
      if (this.progressBar) this.progressBar.Current = 0;
      this.elapsedPressTime = 0;
      this.audioSource?.stop();
    }
    setProgress(t) {
      if (this.progressBar) this.progressBar.Current = t;
    }
  };
  register2(ButtonProgressBar);
  var WarningPopup = class extends MonoBehaviour {
    static {
      __name(this, "WarningPopup");
    }
    ctor() {
      this.currentProceedCallback = null;
    }
    awake() {
      this.panel?.setActive(false);
      this.proceedButton?.OnAction.add(() => {
        const cb = this.currentProceedCallback;
        this.hide();
        cb?.();
      });
      this.cancelButton?.onClick.addListener(() => this.hide());
    }
    get IsActive() {
      return !!this.panel?.activeSelf;
    }
    show(cb) {
      this.currentProceedCallback = cb;
      this.panel?.setActive(true);
    }
    hide() {
      this.currentProceedCallback = null;
      this.panel?.setActive(false);
    }
  };
  register2(WarningPopup);
  var SettingsMenu = class extends MonoBehaviour {
    static {
      __name(this, "SettingsMenu");
    }
    get IsActive() {
      return !!this.panel?.activeSelf;
    }
    start() {
      this.panel?.setActive(false);
      if (this.analyticsConsentToggle) {
        this.analyticsConsentToggle.isOn = PlayerPrefs.getInt("AnalyticsConsent", 1) === 1;
        this.analyticsConsentToggle.onValueChanged?.addListener((v) => PlayerPrefs.setInt("AnalyticsConsent", v ? 1 : 0));
      }
      this.backButton?.onClick.addListener(() => this.hide());
      this.graphicsPanel?.setActive(false);
      this.savePanel?.setActive(false);
      this.restorePurchasesButton?.gameObject.setActive(false);
      this.reportBugButton?.gameObject.setActive(false);
    }
    restorePurchases() {
    }
    show() {
      this.panel?.setActive(true);
      Time.timeScale = 0;
      this.restoreLoading?.setActive(false);
      this.restoreSuccecssLabel?.setActive(false);
    }
    hide() {
      this.panel?.setActive(false);
      Time.timeScale = 1;
      const pm = cur("PauseMenu");
      if (pm?.OpenedSettings) {
        pm.OpenedSettings = false;
        pm.show();
      }
    }
  };
  register2(SettingsMenu);
  var PauseMenu = class extends MonoBehaviour {
    static {
      __name(this, "PauseMenu");
    }
    ctor() {
      this.isLoadingNextScene = false;
      this.OpenedSettings = false;
    }
    get IsActive() {
      return !!this.panel?.activeSelf;
    }
    start() {
      this.panel?.setActive(false);
      this.pauseButton?.onClick.addListener(() => this.show());
      this.returnButton?.onClick.addListener(() => this.hide());
      this.abandonRunButton?.gameObject.setActive((Save.Current?.prestigeCount ?? 0) > 0);
      this.abandonRunButton?.OnAction.add(() => {
        this.hide();
        cur("PrestigeManager")?.death?.(false, false, false, null, false, null);
      });
      this.resetProgressButton?.OnAction.add(() => {
        this.panel?.setActive(false);
        this.warningPopup?.show(() => {
          this.panel?.setActive(false);
          Time.timeScale = 1;
          cur("SaveManager")?.clearSave();
          Game.loadScene(Game.activeScene.name);
        });
      });
      this.settingsButton?.onClick.addListener(() => {
        this.panel?.setActive(false);
        Time.timeScale = 1;
        this.OpenedSettings = true;
        cur("SettingsMenu")?.show();
      });
      this.mainMenuButton?.onClick.addListener(() => {
        if (this.isLoadingNextScene) return;
        this.isLoadingNextScene = true;
        cur("SaveManager")?.save();
        Time.timeScale = 1;
        this.panel?.setActive(false);
        cur("SceneTransitionManager")?.loadScene("Main Menu", 0);
      });
      this.cheatsButton?.gameObject.setActive(false);
    }
    update() {
      if (!Input.getKeyDown("escape")) return;
      const sm = cur("SettingsMenu");
      if (sm?.IsActive) {
        sm.hide();
        return;
      }
      if (this.panel?.activeSelf) {
        this.panel.setActive(false);
        Time.timeScale = 1;
        return;
      }
      this.show();
    }
    show() {
      if (!Game.activeScene || Game.activeScene.name === "Main Menu") return;
      if (cur("Player")?.HasEndingStarted) return;
      this.isLoadingNextScene = false;
      this.panel?.setActive(true);
      Time.timeScale = 0;
    }
    hide() {
      this.panel?.setActive(false);
      Time.timeScale = 1;
    }
  };
  register2(PauseMenu);
  var toDb = /* @__PURE__ */ __name((v) => {
    v = Math.min(1, Math.max(0, v));
    return v <= 0 ? -80 : Math.max(-80, Math.min(0, Math.log10(v) * 20));
  }, "toDb");
  var AudioSettings = class extends MonoBehaviour {
    static {
      __name(this, "AudioSettings");
    }
    ctor() {
      this.masterVolume = 1;
      this.musicVolume = 0.5;
      this.sfxVolume = 1;
      this.ambienceVolume = 1;
      this.lastSoundPlayed = 0;
    }
    start() {
      const rows = [
        ["masterVolume", "MasterVolume", "Master", this.masterAudioSlider],
        ["musicVolume", "MusicVolume", "Music", this.musicAudioSlider],
        ["sfxVolume", "SFXVolume", "SFX", this.sfxAudioSlider],
        ["ambienceVolume", "AmbienceVolume", "Ambience", this.ambienceAudioSlider]
      ];
      for (const [f, key, group, slider] of rows) {
        this[f] = PlayerPrefs.getFloat(key, this[f]);
        AudioEngine.setVolumeDb(group, toDb(this[f]));
        if (slider) {
          slider.value = this[f];
          slider.onValueChanged.addListener(() => this.setLevel(f, key, group, slider));
        }
      }
    }
    setLevel(f, key, group, slider) {
      this[f] = slider.value;
      AudioEngine.setVolumeDb(group, toDb(this[f]));
      PlayerPrefs.setFloat(key, this[f]);
      if (f === "sfxVolume" && performance.now() - this.lastSoundPlayed > 50) {
        const am = cur("AudioManager");
        const c = am?.getAudioFromID("buttonClick");
        if (c) am.sfxSource?.playOneShot(c, 1);
        this.lastSoundPlayed = performance.now();
      }
    }
    getDecibel(v) {
      return toDb(v);
    }
  };
  register2(AudioSettings);
  var NewGraphicsSettings = class extends MonoBehaviour {
    static {
      __name(this, "NewGraphicsSettings");
    }
    ctor() {
      this.fpsOptions = [30, 60, 120, 144, 240, -1];
    }
    awake() {
      this.appliedFpsIndex = PlayerPrefs.getInt("Settings_FPSIndex", 1);
      this.appliedVsync = PlayerPrefs.getInt("Settings_Vsync", 1) === 1;
      this.previewFpsIndex = this.appliedFpsIndex;
      this.previewVsync = this.appliedVsync;
      this.fpsCapLeftButton?.onClick.addListener(() => this.changeFpsSelection(-1));
      this.fpsCapRightButton?.onClick.addListener(() => this.changeFpsSelection(1));
      this.vsyncToggle?.onValueChanged?.addListener((v) => {
        this.previewVsync = v;
        this.updateUI();
      });
      this.applyButton?.onClick.addListener(() => this.applySettings());
      this.cancelButton?.onClick.addListener(() => {
        this.previewFpsIndex = this.appliedFpsIndex;
        this.previewVsync = this.appliedVsync;
        this.updateUI();
      });
      this.updateUI();
    }
    changeFpsSelection(d) {
      const n = this.fpsOptions.length;
      this.previewFpsIndex = (this.previewFpsIndex + d + n) % n;
      this.updateUI();
    }
    updateUI() {
      const fps = this.fpsOptions[this.previewFpsIndex];
      if (this.fpsCapLabel) this.fpsCapLabel.text = fps < 0 ? this.fpsUncappedString?.getLocalizedString() ?? "Uncapped" : (this.fpsCapString?.getLocalizedString() ?? "{x} FPS").replace("{x}", fps).replace("{0}", fps);
      if (this.vsyncToggle) this.vsyncToggle.isOn = this.previewVsync;
    }
    applySettings() {
      this.appliedFpsIndex = this.previewFpsIndex;
      this.appliedVsync = this.previewVsync;
      PlayerPrefs.setInt("Settings_FPSIndex", this.appliedFpsIndex);
      PlayerPrefs.setInt("Settings_Vsync", this.appliedVsync ? 1 : 0);
      Game.targetFrameRate = this.appliedVsync ? -1 : this.fpsOptions[this.appliedFpsIndex];
    }
  };
  register2(NewGraphicsSettings);
  var GraphicsSettings = class extends MonoBehaviour {
    static {
      __name(this, "GraphicsSettings");
    }
  };
  register2(GraphicsSettings);
  var VibrationSettings = class extends MonoBehaviour {
    static {
      __name(this, "VibrationSettings");
    }
    awake() {
      this.VibrationIntensity = PlayerPrefs.getFloat("Settings_VibrationStrength", 1);
      if (this.vibrationSlider) {
        this.vibrationSlider.value = this.VibrationIntensity;
        this.vibrationSlider.onValueChanged.addListener((v) => this.updateIntensity(v));
      }
    }
    updateIntensity(v) {
      this.VibrationIntensity = v;
      PlayerPrefs.setFloat("Settings_VibrationStrength", v);
    }
  };
  register2(VibrationSettings);
  var LOCALES = ["en", "de", "es", "fr", "ja", "ko", "pl", "pt-br", "ru", "tr", "zh-hans"];
  function nativeName(code) {
    const tag = { "pt-br": "pt-BR", "zh-hans": "zh-Hans" }[code] || code;
    let n = code;
    try {
      n = new Intl.DisplayNames([tag], { type: "language" }).of(tag) || code;
    } catch {
    }
    return n.charAt(0).toUpperCase() + n.slice(1);
  }
  __name(nativeName, "nativeName");
  var LanguageSettings = class extends MonoBehaviour {
    static {
      __name(this, "LanguageSettings");
    }
    ctor() {
      this.isChanging = false;
    }
    start() {
      this.leftButton?.onClick.addListener(() => this.startCoroutine(this.cycleLanguage(-1)));
      this.rightButton?.onClick.addListener(() => this.startCoroutine(this.cycleLanguage(1)));
      this.updateLanguageText();
    }
    *cycleLanguage(dir) {
      if (this.isChanging) return;
      this.isChanging = true;
      const i = Math.max(0, LOCALES.indexOf(Localization.code));
      const n = LOCALES.length;
      let done = false;
      Localization.setLocale(LOCALES[(i + dir + n) % n]).then(() => {
        done = true;
      });
      while (!done) yield null;
      this.updateLanguageText();
      this.isChanging = false;
    }
    updateLanguageText() {
      if (this.languageLabel) this.languageLabel.text = nativeName(Localization.code);
      const flag = (this.flagSprites || []).find((s2) => s2?.name === Localization.code);
      if (flag && this.flagIcon) this.flagIcon.sprite = flag;
    }
  };
  register2(LanguageSettings);
  var WristProtectionManager = class extends MonoBehaviour {
    static {
      __name(this, "WristProtectionManager");
    }
    ctor() {
      this.Mode = 0;
      this.totalModes = 3;
    }
    start() {
      this.cycleLeftButton?.onClick.addListener(() => this.cycleMode(false));
      this.cycleRightButton?.onClick.addListener(() => this.cycleMode(true));
      this.totalModes = Math.max(1, this.modeStrings?.length || 3);
      this.Mode = PlayerPrefs.getInt("WristProtectionMode", 0) % this.totalModes;
      this.updateUI();
    }
    update() {
      if (Input.getKeyDown("q") && !cur("Player")?.IsTicketOpen) this.cycleMode(true);
    }
    cycleMode(next) {
      this.setMode((this.Mode + (next ? 1 : -1) + this.totalModes) % this.totalModes);
    }
    setMode(m) {
      this.Mode = m;
      PlayerPrefs.setInt("WristProtectionMode", m);
      this.updateUI();
    }
    updateUI() {
      const ls = this.modeStrings?.[this.Mode];
      if (!ls) return;
      if (this.modeLabelLocalized) {
        this.modeLabelLocalized.stringReference = ls;
        this.modeLabelLocalized.refreshString?.();
      } else if (this.modeLabel) this.modeLabel.text = ls.getLocalizedString();
    }
  };
  register2(WristProtectionManager);
  var SaveDataPanel = class extends MonoBehaviour {
    static {
      __name(this, "SaveDataPanel");
    }
    start() {
      this.exportButton?.onClick.addListener(() => this.export());
      this.importButton?.OnAction.add(() => this.import());
      this.labelDefaultColor = this.label ? this.label.color : new Color();
    }
    export() {
      const data = cur("SaveManager")?.export();
      if (!data) return;
      navigator.clipboard?.writeText(data).catch(() => {
      });
      this.setLabelTextTmp(this.dataCopiedHint, new Color(0.4, 0.9, 0.4, 1), 2);
    }
    async import() {
      let text = "";
      try {
        text = await navigator.clipboard.readText();
      } catch {
      }
      if (!text) {
        this.setLabelTextTmp(this.clipboardEmptyHint, new Color(0.9, 0.4, 0.4, 1), 2);
        return;
      }
      let data;
      try {
        data = JSON.parse(decodeURIComponent(escape(atob(text.trim()))));
      } catch {
        this.setLabelTextTmp(this.clipboardDataInvalidHint, new Color(0.9, 0.4, 0.4, 1), 2);
        return;
      }
      try {
        cur("SaveManager").import(data);
        Game.loadScene(Game.activeScene.name);
      } catch (e) {
        this.setLabelTextTmp(this.saveImportFailedHint, new Color(0.9, 0.4, 0.4, 1), 2, String(e));
      }
    }
    setLabelTextTmp(ls, color, duration, extra = "") {
      if (!this.label) return;
      this.label.text = (ls?.getLocalizedString() ?? "") + (extra ? `
${extra}` : "");
      this.label.color = color;
      this.stopAllCoroutines();
      this.startCoroutine(this.revertLabelToDefault(duration));
    }
    *revertLabelToDefault(d) {
      yield new WaitForSecondsRealtime(d);
      if (this.label) {
        this.label.text = this.defaultHint?.getLocalizedString() ?? "";
        this.label.color = this.labelDefaultColor;
      }
    }
  };
  register2(SaveDataPanel);
  var MusicType = { DayJob: 0, FinalChance: 2, Ending: 3, MainMenu: 4, Catalog1: 5, Catalog2: 6, Catalog3: 7, Catalog4: 8, Prestige: 9 };
  var MusicPlayer = class extends MonoBehaviour {
    static {
      __name(this, "MusicPlayer");
    }
    ctor() {
      this.IsFading = false;
      this.currentMusic = null;
      this.lastMusic = null;
    }
    awake() {
      this.musicDict = new Map((this.tracks || []).map((t) => [t.type, t]));
    }
    getMusic(type) {
      return this.musicDict.get(type) || null;
    }
    startMusic(type) {
      const track = this.getMusic(type);
      if (!track || track === this.currentMusic) return;
      this.lastMusic = this.currentMusic;
      this.currentMusic = track;
      this.stopAllCoroutines();
      this.startCoroutine(this.doStartMusic(track));
    }
    *fade(fadeIn, duration = 1) {
      this.IsFading = true;
      for (const s2 of [this.introSource, this.musicSource]) if (s2) {
        DOTween.kill(s2);
        DO.volume(s2, fadeIn ? 1 : 0, duration).setUpdate(true);
      }
      yield new WaitForSecondsRealtime(duration);
      this.IsFading = false;
    }
    *doStartMusic(track) {
      const playing = this.introSource?.isPlaying || this.musicSource?.isPlaying;
      if (playing) yield* this.fade(false, this.transitionFadeOutDuration);
      while (this.IsFading) yield null;
      const ctx = AudioEngine.ctx;
      const t0 = ctx.currentTime + 0.1;
      for (const s2 of [this.introSource, this.musicSource]) if (s2) {
        s2.stop();
        DOTween.kill(s2);
        s2.volume = 1;
      }
      let loopAt = t0;
      if (track.intro && this.introSource) {
        this.introSource.clip = track.intro;
        this.introSource.loop = false;
        this.introSource.playScheduled(t0);
        loopAt = t0 + (track.intro.length || 0);
      }
      if (track.loop && this.musicSource) {
        this.musicSource.clip = track.loop;
        this.musicSource.loop = true;
        this.musicSource.playScheduled(loopAt);
      }
    }
  };
  register2(MusicPlayer);
  var MusicManager = class extends MonoBehaviour {
    static {
      __name(this, "MusicManager");
    }
    start() {
      const ge = cur("GlobalEvents");
      ge?.OnGameSceneLoaded.add(() => this.onGameSceneLoaded());
      ge?.OnCatalogUnlocked.add((c) => this.onCatalogUnlocked(c));
      ge?.OnTicketUnlocked.add((id) => this.onTicketUnlocked(id));
    }
    startMusic(type, startDelay = 0) {
      if (startDelay <= 0) {
        this.musicPlayer?.startMusic(type);
        return;
      }
      this.startCoroutine(function* () {
        yield new WaitForSeconds(startDelay);
        this.musicPlayer?.startMusic(type);
      }.call(this));
    }
    fadeInMusic(d = 1) {
      if (this.musicPlayer) this.startCoroutine(this.musicPlayer.fade(true, d));
    }
    fadeOutMusic(d = 1) {
      if (this.musicPlayer) this.startCoroutine(this.musicPlayer.fade(false, d));
    }
    fadeOut(d) {
      this.fadeOutMusic(d);
    }
    onGameSceneLoaded() {
      if (Save.Current?.isPrestiging) return;
      this.startCoroutine(function* () {
        yield null;
        const last = cur("TicketShop")?.getLastTicketUnlocked?.();
        if (last) this.onTicketUnlocked(last.id ?? last);
        else this.startMusic(MusicType.DayJob);
      }.call(this));
    }
    onCatalogUnlocked(c) {
      if (Save.Current?.isPrestiging || c - 1 > 3 || c < 1) return;
      this.musicPlayer?.startMusic(c + 4);
    }
    onTicketUnlocked(id) {
      if (!id) return;
      if (id.toLowerCase().includes("final chance")) this.musicPlayer?.startMusic(MusicType.FinalChance);
      else if (id === "Day Job") this.musicPlayer?.startMusic(MusicType.DayJob);
    }
  };
  register2(MusicManager);
  var ChallengeManager = class extends MonoBehaviour {
    static {
      __name(this, "ChallengeManager");
    }
    get IsSymbolHiddenUntilScratched() {
      const c = this.tryGetActiveChallenge();
      return !!c && (c.id === "Zero waste" || c.id === "Hard mode");
    }
    get CantUseTrashCan() {
      const c = this.tryGetActiveChallenge();
      return !!c && (c.id === "Zero waste" || c.id === "Hard mode");
    }
    start() {
      const c = this.tryGetActiveChallenge();
      this.activeChallengePanel?.setActive(!!c);
      this.updateChallengePanelChallengeLabel();
      this.abandonChallengeButton?.OnAction.add(() => {
        Save.Current.activeChallenge = null;
        cur("PrestigeManager")?.death?.(false, false, false, null, false, null);
      });
      if (c && !Save.Current.layerOne.initializedChallenge) {
        Save.Current.layerOne.initializedChallenge = true;
        if (c.id === "Hard mode") {
          const w = cur("Player")?.wallet;
          const m = Save.money?.() ?? 0;
          if (100 - m > 0) w?.addMoney(100 - m, "Reward");
          const lp = cur("LoanPanel");
          for (const id of ["Income reduction", "Ticket price increase", "Wrong delivery"]) lp?.activateLoan?.(id, 3, 99999e10);
        }
      }
      this._f = () => this.updateChallengePanelChallengeLabel();
      Localization.listeners.add(this._f);
    }
    onDestroy() {
      Localization.listeners.delete(this._f);
    }
    updateChallengePanelChallengeLabel() {
      const c = this.tryGetActiveChallenge();
      if (!c || !this.activeChallengePanelChallengeLabel) return;
      this.activeChallengePanelChallengeLabel.text = Localization.get(`${c.id}_Name`) ?? c.id;
    }
    checkChallengeCompleted() {
      const c = this.tryGetActiveChallenge();
      if (!c?.goal) return;
      if (String(c.goal).includes("Act")) {
        const n = parseInt(String(c.goal).replace("Act", ""), 10);
        if (!isNaN(n) && Save.Current.currentAct >= n) this.completeChallenge(c);
      }
    }
    tryGetActiveChallenge() {
      const id = Save.Current?.activeChallenge;
      if (!id) return null;
      return cur("StaticData")?.getChallengeData(id) || null;
    }
    isCurrentChallenge(id) {
      return this.tryGetActiveChallenge()?.id === id;
    }
    completeChallenge(c) {
      if (!Save.Current.completedChallenges.includes(c.id)) Save.Current.completedChallenges.push(c.id);
      Save.Current.activeChallenge = null;
      cur("GlobalEvents")?.OnChallengeCompleted.invoke(c);
    }
    isChallengeUnlocked(id) {
      const c = cur("StaticData")?.getChallengeData(id);
      if (!c) return false;
      const req = String(c.unlockRequirements || "").split(",").map((s2) => s2.trim()).filter(Boolean);
      return req.every((r) => r === "FullGame" || Save.Current.completedChallenges.includes(r));
    }
  };
  register2(ChallengeManager);
  var BugReporter = class extends MonoBehaviour {
    static {
      __name(this, "BugReporter");
    }
    start() {
      this.label?.gameObject.setActive(false);
    }
    reportBug() {
    }
  };
  register2(BugReporter);
  var PersistentInitializer = class extends MonoBehaviour {
    static {
      __name(this, "PersistentInitializer");
    }
    awake() {
      if (!cur("GameManager")) Game.loadScene("Persistent", true);
    }
  };
  register2(PersistentInitializer);

  // web/src/game/story.js
  var ease3 = /* @__PURE__ */ __name((e) => typeof e === "number" ? EaseByIndex[e] === "Unset" ? "OutQuad" : EaseByIndex[e] : e || "OutQuad", "ease");
  var LINE_FIELD = { en: "english", "zh-hans": "chineseSimplified", de: "german", ru: "russian", "pt-br": "brazilianPortuguese", ja: "japanese", fr: "french", ko: "korean", es: "spanish", pl: "polish", tr: "turkish", it: "italian" };
  function getLine(line, code = Localization.code) {
    const v = line[LINE_FIELD[code] || "english"];
    return v || line.english || "";
  }
  __name(getLine, "getLine");
  var TypewriterCore = class extends MonoBehaviour {
    static {
      __name(this, "TypewriterCore");
    }
    ctor() {
      this.isShowingText = false;
      this._t = 0;
      this._shown = 0;
      this._lastText = null;
    }
    get label() {
      return this._label ||= this.getComponent("TextMeshProUGUI") || this.getComponent("TextMeshPro");
    }
    showText(text) {
      if (!this.label) return;
      this.label.text = text;
      this._lastText = text;
      if (!this.useTypeWriter) {
        this.label.maxVisibleCharacters = 99999;
        return;
      }
      this._plain = text.replace(/<[^>]*>/g, "");
      this._shown = 0;
      this._t = 0;
      this.label.maxVisibleCharacters = 0;
      this.isShowingText = true;
    }
    skipTypewriter() {
      if (!this.isShowingText) return;
      this.isShowingText = false;
      if (this.label) this.label.maxVisibleCharacters = 99999;
    }
    waitFor(ch) {
      if (".!?".includes(ch)) return this.waitLong ?? 0.6;
      if (",;:".includes(ch)) return this.waitMiddle ?? 0.2;
      if (ch === "\n") return this.waitForNewLines ? this.waitMiddle ?? 0.2 : 0;
      return this.waitForNormalChars ?? 0.03;
    }
    update() {
      if (!this.isShowingText || !this.label) return;
      this._t -= Time.deltaTime;
      while (this._t <= 0 && this._shown < this._plain.length) {
        const ch = this._plain[this._shown++];
        this.label.maxVisibleCharacters = this._shown;
        const next = this._plain[this._shown];
        this._t += next === void 0 || next && ".!?,;:".includes(next) && ".!?,;:".includes(ch) ? this.waitForNormalChars ?? 0.03 : this.waitFor(ch);
      }
      if (this._shown >= this._plain.length) {
        this.isShowingText = false;
        this.label.maxVisibleCharacters = 99999;
      }
    }
  };
  register2(TypewriterCore);
  var TypewriterByCharacter = class extends TypewriterCore {
    static {
      __name(this, "TypewriterByCharacter");
    }
  };
  register2(TypewriterByCharacter);
  var DialogueManager = class extends MonoBehaviour {
    static {
      __name(this, "DialogueManager");
    }
    ctor() {
      this.dialogueQueue = [];
      this.currentDialogue = null;
      this.currentCallback = null;
      this.lineIndex = -1;
      this.nextLineCooldown = 0;
      this.lastDialogueTime = 0;
    }
    get IsActive() {
      return !!this.panel?.gameObject.activeSelf;
    }
    start() {
      this.lastDialogueTime = -this.sequentialDialogueDelay;
      if (this.panel) {
        this.startPos = { ...this.panel.anchoredPosition };
        if (this.outsideScreenPos) this.panel.anchoredPosition = { ...this.outsideScreenPos.anchoredPosition };
        this.panel.gameObject.setActive(false);
      }
      if (this.typewriter && !this.typewriter.showText) this.typewriter = this.dialogueLabel?.getComponent("TypewriterByCharacter");
    }
    update() {
      if (!this.currentDialogue) {
        if (this.dialogueQueue.length && this.sequentialDialogueDelay <= Time.time - this.lastDialogueTime) this.playDialogue(this.dialogueQueue.shift());
      } else if (this.currentDialogue.id === "totalBankruptcy" && (Save.money?.() ?? 0) > 0) this.cancelCurrentPhoneCall();
      if (this.panel?.gameObject.activeSelf) {
        if (Input.getMouseButtonDown(0) || Input.getKeyDown("space")) this.showNextLine();
        if (this.nextLineCooldown > 0) this.nextLineCooldown -= Time.deltaTime;
      }
    }
    queueDialogue(id, playOnce = true, callback = null, autoPickupPhone = false) {
      if (this.dialogueQueue.some((d) => d.id === id) || this.currentDialogue?.id === id) return false;
      this.dialogueQueue.push({ id, playOnce, callback, autoPickupPhone });
      return true;
    }
    playDialogue(info) {
      if (info.playOnce && Save.Current.dialoguesPlayed.includes(info.id)) {
        info.callback?.();
        return;
      }
      const data = cur("StaticData")?.getDialogueData(info.id);
      if (!data) {
        info.callback?.();
        return;
      }
      this.currentDialogue = data;
      this.currentCallback = info.callback;
      this.lineIndex = -1;
      const onPickup = /* @__PURE__ */ __name(() => {
        this.showNextLine();
        this.show();
      }, "onPickup");
      if (info.autoPickupPhone || !this.phone) onPickup();
      else this.phone.startCall(onPickup);
    }
    show() {
      const p = this.panel;
      if (!p) return;
      p.gameObject.setActive(true);
      DOTween.kill(p);
      DO.anchorPos(p, this.startPos, this.flyInDuration).setEase(ease3(this.flyInEase));
      if (this.bgImage) {
        this.bgImage.raycastTarget = true;
        DOTween.kill(this.bgImage);
        DO.fade(this.bgImage, this.startAlpha, this.flyOutDuration);
      }
    }
    hide() {
      this.dialogueAudioSource?.stop();
      const p = this.panel;
      if (p && this.outsideScreenPos) {
        DOTween.kill(p);
        DO.anchorPos(p, { ...this.outsideScreenPos.anchoredPosition }, this.flyOutDuration).setEase(ease3(this.flyOutEase)).onComplete(() => p.gameObject.setActive(false));
      }
      if (this.bgImage) {
        this.bgImage.raycastTarget = false;
        DOTween.kill(this.bgImage);
        DO.fade(this.bgImage, 0, this.flyOutDuration);
      }
      this.currentDialogue = null;
      const cb = this.currentCallback;
      this.currentCallback = null;
      this.lastDialogueTime = this.dialogueQueue.length ? Time.time : -this.sequentialDialogueDelay;
      cb?.();
    }
    showNextLine() {
      if (!this.currentDialogue || this.nextLineCooldown > 0) return;
      this.nextLineCooldown = this.showNextLineCooldownDuration;
      const tw = this.typewriter;
      if (tw?.isShowingText) {
        tw.skipTypewriter();
        return;
      }
      this.lineIndex++;
      const lines = this.currentDialogue.lines;
      if (this.lineIndex > lines.length - 1) {
        this.phone?.putPhoneBack();
        const played = Save.Current.dialoguesPlayed;
        if (!played.includes(this.currentDialogue.id)) played.push(this.currentDialogue.id);
        this.hide();
        return;
      }
      const line = lines[this.lineIndex];
      this.playDialogueSound(line.voice);
      const text = getLine(line);
      if (tw?.showText) tw.showText(text);
      else if (this.dialogueLabel) this.dialogueLabel.text = text;
    }
    playDialogueSound(voice) {
      const blue = voice === "blue";
      if (this.speechBubble) this.speechBubble.sprite = blue ? this.blueBG : this.redBG;
      const src = this.dialogueAudioSource;
      const list = blue ? this.blueVoices : this.redVoices;
      if (this.dialogueLabel) this.dialogueLabel.color = Color.from(blue ? this.blueVoiceColor : this.redVoiceColor);
      if (src && list?.length) {
        src.clip = list[Math.floor(Random.value * list.length)];
        src.play();
      }
    }
    resetDialogueCooldown() {
      this.lastDialogueTime = -this.sequentialDialogueDelay;
    }
    cancelCurrentPhoneCall() {
      this.currentCallback = null;
      this.currentDialogue = null;
      this.phone?.forceStopRinging();
      this.phone?.phone?.gameObject.setActive(true);
    }
    clearQueue(clearCallback = false) {
      if (clearCallback) this.currentCallback = null;
      this.phone?.forceStopRinging();
      this.phone?.phone?.gameObject.setActive(true);
      if (this.currentDialogue) this.hide();
      this.dialogueQueue.length = 0;
    }
  };
  register2(DialogueManager);
  var Phone = class extends MonoBehaviour {
    static {
      __name(this, "Phone");
    }
    ctor() {
      this.isRinging = false;
      this.currentCallback = null;
      this.ringLoop = null;
    }
    awake() {
      this.startPos = this.phone ? this.phone.localPosition.clone() : new Vec3();
      this.startVolume = this.ringingSoundSource?.volume ?? 1;
    }
    update() {
      if (cur("PrestigeManager")?.isDying) return;
      if (!this.isRinging) {
        this.updateIdleClick();
        return;
      }
      const player = cur("Player");
      if (!player?.PanelOverlayActive && !player?.scratching?.CurrentTicket && Input.getKeyDown("space")) {
        this.pickupCall();
        return;
      }
      if (Input.getMouseButtonDown(0) && this.boxCollider2D?.overlapPoint(player?.MouseWorldPos || { x: 0, y: 0 })) this.pickupCall();
    }
    // clicking the idle phone while broke asks for a loan
    updateIdleClick() {
      const player = cur("Player");
      if (!player || !Input.getMouseButtonDown(0) || !this.boxCollider2D) return;
      const c = this.boxCollider2D;
      const was = c.enabled;
      c.enabled = true;
      const hit = c.overlapPoint(player.MouseWorldPos);
      c.enabled = was;
      if (!hit) return;
      if (cur("DialogueManager")?.IsActive || player.HasEndingStarted) return;
      if (!Save.Current.dialoguesPlayed.includes("moneyTrouble") || Save.money() > 0) return;
      if (player.TableItems.some((t) => t?.Data?.id === "Loan")) cur("DialogueManager")?.queueDialogue("tooManyLoans", false, null, true);
      else player.spawnLoanWithDialogue();
    }
    startCall(cb) {
      this.currentCallback = cb;
      this.startRinging();
    }
    startRinging() {
      if (this.isRinging) return;
      this.isRinging = true;
      const tr = this.phone;
      if (!tr) return;
      tr.gameObject.setActive(true);
      if (this.ringingSoundSource) {
        DOTween.kill(this.ringingSoundSource);
        this.ringingSoundSource.volume = this.startVolume;
      }
      const y = this.startPos.y;
      const inner = DOTween.sequence().appendCallback(() => {
        this.ringingSoundSource?.play();
        tr.localEulerZ = -this.shakeAngle;
        DO.rotateZ(tr, this.shakeAngle, this.shakeDuration, 1).setLoops(-1, 1).setEase("InOutSine").setId("shake");
      }).append(DO.localMoveY(tr, y + this.liftHeight, this.liftUpTime).setEase("OutQuad")).appendInterval(this.ringDuration).append(DO.localMoveY(tr, y, this.fallDownTime).setEase("InQuad")).appendCallback(() => {
        DOTween.kill("shake");
        tr.localEulerZ = 0;
      }).appendInterval(this.pauseDuration);
      this.ringLoop = inner.setLoops(-1);
    }
    pickupCall() {
      if (!this.isRinging) return;
      cur("AudioManager")?.playSound("phonePickup", 1);
      this.forceStopRinging();
      this.phone?.gameObject.setActive(false);
      const cb = this.currentCallback;
      this.currentCallback = null;
      cb?.();
    }
    putPhoneBack() {
      cur("AudioManager")?.playSound("phonePutDown", 1);
      this.phone?.gameObject.setActive(true);
    }
    forceStopRinging() {
      if (!this.isRinging) return;
      const src = this.ringingSoundSource;
      if (src) DO.volume(src, 0, this.volumeFadeDuration).onComplete(() => src.stop());
      this.ringLoop?.kill();
      this.ringLoop = null;
      DOTween.kill("shake");
      if (this.phone) {
        this.phone.localPosition = this.startPos.clone();
        this.phone.localEulerZ = 0;
      }
      this.isRinging = false;
    }
  };
  register2(Phone);

  // web/src/game/mainmenu.js
  var ease4 = /* @__PURE__ */ __name((e) => typeof e === "number" ? EaseByIndex[e] === "Unset" ? "OutQuad" : EaseByIndex[e] : e || "OutQuad", "ease");
  var openURL = /* @__PURE__ */ __name((u) => {
    try {
      window.open(u, "_blank", "noopener");
    } catch {
    }
  }, "openURL");
  var MainMenuManager = class extends MonoBehaviour {
    static {
      __name(this, "MainMenuManager");
    }
    ctor() {
      this.isLoadingNextScene = false;
    }
    start() {
      Time.timeScale = 1;
      this.wishlistButton?.gameObject.setActive(false);
      this.buySupporterButton?.gameObject.setActive(false);
      this.playButton?.onClick.addListener(() => this.play());
      this.settingsButton?.onClick.addListener(() => this.showSettings());
      this.quitButton?.onClick.addListener(() => this.quitGame());
      const demo = cur("BuildModeManager")?.Mode === 1;
      this.wishlistButton?.gameObject.setActive(demo);
      this.wishlistButton?.onClick.addListener(() => openURL("https://store.steampowered.com/app/3948120/Scritchy_Scratchy/"));
      this.discordButton?.onClick.addListener(() => openURL("https://discord.com/invite/sr6BvqUkCF"));
      this.creditsButton?.onClick.addListener(() => this.credits?.showCreditsPanel());
      this.buySupporterButton?.onClick.addListener(() => this.buySupporterPack());
      if (this.dataCollectionConsentToggle) {
        this.dataCollectionConsentToggle.isOn = PlayerPrefs.getInt("AnalyticsConsent", 1) === 1;
        this.dataCollectionConsentToggle.onValueChanged?.addListener((v) => PlayerPrefs.setInt("AnalyticsConsent", v ? 1 : 0));
      }
      this.lunchMoneyButton?.onClick.addListener(() => openURL("https://store.steampowered.com/developer/lunchmoneygames"));
      this.fundayButton?.onClick.addListener(() => openURL("https://store.steampowered.com/developer/FundayGames"));
      cur("MusicManager")?.startMusic(MusicType.MainMenu);
      if (this.buttonsPanel) {
        this.buttonsStartPos = { ...this.buttonsPanel.anchoredPosition };
        this.buttonsPanel.gameObject.setActive(false);
      }
      const gm = cur("GameManager");
      if (demo && gm && !gm.IntroPopupShown) {
        gm.IntroPopupShown = true;
        this.startCoroutine(this.showIntroPopup());
      } else if (PlayerPrefs.getInt("dataCollectionConsentPopupShown", 0) === 0) {
        PlayerPrefs.setInt("dataCollectionConsentPopupShown", 1);
        this.startCoroutine(this.showDataCollectionConsentPopup());
      } else this.startCoroutine(this.showButtons());
      this.lunchMoneyButton?.gameObject.setActive(false);
      this.fundayButton?.gameObject.setActive(false);
    }
    *showIntroPopup() {
      yield new WaitForSeconds(0.5);
      this.introPopup?.show(() => this.startCoroutine(this.showDataCollectionConsentPopup()));
    }
    *showDataCollectionConsentPopup() {
      yield new WaitForSeconds(0.5);
      if (this.dataConsentPopup) this.dataConsentPopup.show(() => this.startCoroutine(this.showButtons()));
      else this.startCoroutine(this.showButtons());
    }
    *showButtons() {
      yield new WaitForSeconds(0.3);
      const p = this.buttonsPanel;
      if (!p) return;
      if (this.buttonsOutsideScreen) p.anchoredPosition = { ...this.buttonsOutsideScreen.anchoredPosition };
      p.gameObject.setActive(true);
      DO.anchorPos(p, this.buttonsStartPos, this.flyInDuration).setEase(ease4(this.flyInEase));
    }
    play() {
      if (this.isLoadingNextScene) return;
      this.isLoadingNextScene = true;
      cur("SceneTransitionManager")?.loadScene("Game", 0);
    }
    showSettings() {
      if (this.isLoadingNextScene) return;
      cur("SettingsMenu")?.show();
    }
    quitGame() {
      if (this.isLoadingNextScene) return;
      cur("SceneTransitionManager")?.quitGame();
    }
    buySupporterPack() {
      this.supporterPackPopup?.show();
    }
    update() {
      this.buySupporterButton?.gameObject.setActive(!cur("IAPManager")?.didPurchaseSupporterPack?.());
    }
  };
  register2(MainMenuManager);
  var CreditsMenu = class extends MonoBehaviour {
    static {
      __name(this, "CreditsMenu");
    }
    awake() {
      this.creditsPanel?.setActive(false);
      this.backButton?.onClick.addListener(() => this.closeCreditsPanel());
    }
    update() {
      if (this.creditsPanel?.activeSelf && !this.finalCredits && Input.getKeyDown("escape")) this.closeCreditsPanel();
    }
    showCreditsPanel() {
      for (const o of this.objectsToDisable || []) o?.setActive(false);
      this.creditsPanel?.setActive(true);
      this.creditsPanel?.getComponentInChildren?.("CreditsScroller")?.startScrolling?.();
    }
    closeCreditsPanel() {
      for (const o of this.objectsToDisable || []) o?.setActive(true);
      this.creditsPanel?.setActive(false);
    }
  };
  register2(CreditsMenu);
  var CreditsScroller = class extends MonoBehaviour {
    static {
      __name(this, "CreditsScroller");
    }
    ctor() {
      this.isScrolling = false;
      this.OnCreditsFinished = null;
    }
    startScrolling() {
      const sr = this.scrollRect;
      if (!sr) return;
      sr.verticalNormalizedPosition = 1;
      this.isScrolling = true;
    }
    update() {
      const sr = this.scrollRect;
      if (!this.isScrolling || !sr?.content || !sr.viewRect) return;
      const ch = sr.content.rect.height, vh = sr.viewRect.rect.height;
      if (ch <= vh) {
        this.onFinished();
        return;
      }
      const fast = Input.getMouseButton(0) || Input.getKey("space");
      const step = this.scrollSpeed * (fast ? this.fastForwardMultiplier : 1) * Time.deltaTime;
      sr.verticalNormalizedPosition = Math.max(0, sr.verticalNormalizedPosition - step / (ch - vh));
      if (sr.verticalNormalizedPosition <= 0) this.onFinished();
    }
    onFinished() {
      this.isScrolling = false;
      const cb = this.OnCreditsFinished;
      cb?.();
    }
  };
  register2(CreditsScroller);
  var SupporterPackPopup = class extends MonoBehaviour {
    static {
      __name(this, "SupporterPackPopup");
    }
    ctor() {
      this.purchaseInProgress = false;
    }
    start() {
      this.startingScale = this.panel ? this.panel.transform.localScale.clone() : new Vec3(1, 1, 1);
      this.panel?.setActive(false);
      this.buyButton?.onClick.addListener(() => this.onBuyPress());
      this.backButton?.onClick.addListener(() => this.hide());
      if (this.buyButtonPriceLabel) this.buyButtonPriceLabel.text = "\u2014";
    }
    onBuyPress() {
      if (this.purchaseInProgress) return;
      this.purchaseInProgress = true;
      this.purchaseCallback(false);
    }
    purchaseCallback(success) {
      this.purchaseInProgress = false;
      if (!success) this.purchaseFailedPopup?.show(null);
    }
    show() {
      const p = this.panel;
      if (!p) return;
      p.setActive(true);
      p.transform.localScale = new Vec3(0, 0, 0);
      DO.scale(p.transform, this.startingScale, this.scaleInDuration).setEase(ease4(this.scaleInEase)).setUpdate(true);
    }
    hide() {
      const p = this.panel;
      if (!p) return;
      DO.scale(p.transform, 0, this.scaleOutDuration).setEase(ease4(this.scaleOutEase)).setUpdate(true).onComplete(() => p.setActive(false));
    }
  };
  register2(SupporterPackPopup);

  // web/src/game/onboarding.js
  var ease5 = /* @__PURE__ */ __name((e) => typeof e === "number" ? EaseByIndex[e] === "Unset" ? "OutQuad" : EaseByIndex[e] : e || "OutQuad", "ease");
  var OnboardingHint = class extends MonoBehaviour {
    static {
      __name(this, "OnboardingHint");
    }
    start() {
      if (this.cursorIcon) this.cursorIcon.color = this.cursorIcon.color.withAlpha(0);
    }
    getTargetPos() {
      const t = this.targetTransform;
      if (!t || t._destroyed) return { x: 0, y: 0 };
      let p;
      if (t.isRect) p = t.position;
      else {
        const cam = Camera.main;
        p = cam ? cam.worldToScreenPoint(t.position) : t.position;
      }
      return { x: p.x + this.targetOffset.x, y: p.y + this.targetOffset.y };
    }
    show(target) {
      this.targetTransform = target;
      this.stopAllCoroutines();
      this.startCoroutine(this.doAnimation());
    }
    hide() {
      const ic = this.cursorIcon;
      if (!ic) return;
      DOTween.kill(ic);
      DO.fade(ic, 0, this.fadeDuration).onComplete(() => this.stopAllCoroutines());
    }
    *doAnimation() {
      const ic = this.cursorIcon;
      if (!ic) return;
      DOTween.kill(ic);
      ic.color = ic.color.withAlpha(0);
      yield new WaitForSeconds(this.startDelay);
      for (; ; ) {
        const end = this.getTargetPos();
        const start = { x: end.x + this.targetStartOffset.x, y: end.y + this.targetStartOffset.y };
        ic.sprite = this.cursorSprite;
        ic.transform.position = { x: start.x, y: start.y, z: 0 };
        DO.fade(ic, 1, this.fadeDuration);
        if (this.holdMouseWhileMoving) {
          yield new WaitForSeconds(this.fadeDuration);
          ic.sprite = this.cursorSpritePressed;
          yield new WaitForSeconds(this.clickDuration * 2);
        }
        for (let i = 0; i < this.moveCount; i++) {
          const to = i & 1 ? start : end;
          DO.move(ic.transform, { x: to.x, y: to.y, z: 0 }, this.moveDuration).setEase(ease5(this.moveEase));
          yield new WaitForSeconds(this.moveDuration);
        }
        for (let j = 0; j < this.clickCount; j++) {
          ic.sprite = this.cursorSpritePressed;
          yield new WaitForSeconds(this.clickDuration);
          ic.sprite = this.cursorSprite;
          yield new WaitForSeconds(this.clickDelay);
        }
        DO.fade(ic, 0, this.fadeDuration);
        yield new WaitForSeconds(this.fadeDuration + this.loopDelay);
      }
    }
  };
  register2(OnboardingHint);
  var OnboardingManager = class extends MonoBehaviour {
    static {
      __name(this, "OnboardingManager");
    }
    ctor() {
      this.currentHint = null;
      this.subscribed = false;
    }
    *start() {
      const p = Save.Current?.layerOne?.ticketProgressionDict?.["Day Job"];
      if (p && (p.level > 0 || p.xp > 0)) return;
      if (this.onboardingStepCompleted("ScratchTicket")) return;
      const ts = cur("TicketShop"), player = cur("Player"), ge = cur("GlobalEvents");
      this._bought = () => this.refresh();
      this._opened = () => this.refresh();
      this._closed = () => this.refresh();
      this._scratched = () => this.hideCurrentHint();
      this._revealed = () => this.onSymbolSlotRevealed();
      ts?.OnTicketBought?.add(this._bought);
      player?.OnTicketOpened.add(this._opened);
      player?.OnTicketClosed.add(this._closed);
      ge?.OnScratchedSlot.add(this._scratched);
      ge?.OnSymbolSlotRevealed.add(this._revealed);
      this.subscribed = true;
      yield null;
      if (cur("PrestigeManager")?.isDying) return;
      this.refresh();
    }
    onDestroy() {
      this.unsubscribe();
    }
    unsubscribe() {
      if (!this.subscribed) return;
      this.subscribed = false;
      cur("TicketShop")?.OnTicketBought?.remove(this._bought);
      const pl = cur("Player");
      pl?.OnTicketOpened.remove(this._opened);
      pl?.OnTicketClosed.remove(this._closed);
      const ge = cur("GlobalEvents");
      ge?.OnScratchedSlot.remove(this._scratched);
      ge?.OnSymbolSlotRevealed.remove(this._revealed);
    }
    refresh() {
      if (this.updateState()) this.unsubscribe();
    }
    onSymbolSlotRevealed() {
      this.completeOnboardingStep("ScratchTicket");
      this.hideCurrentHint();
      this.unsubscribe();
    }
    // returns allCompleted
    updateState() {
      if (this.onboardingStepCompleted("ScratchTicket")) return true;
      const player = cur("Player");
      const item = player?.TableItems.find((t) => t?.Data?.id === "Day Job");
      const open = player?.scratching?.CurrentTicket;
      if (open) this.showHint(this.scratchTicketHint, open.transform);
      else if (item) this.showHint(this.openTicketHint, item.transform);
      else {
        const panel = cur("TicketShop")?.shopPanelDict.get("Day Job");
        if (panel) this.showHint(this.buyTicketHint, panel.transform);
      }
      return false;
    }
    showHint(hint, target) {
      if (!hint || hint === this.currentHint) {
        if (hint) hint.targetTransform = target;
        return;
      }
      this.currentHint?.hide();
      this.currentHint = hint;
      hint.show(target);
    }
    hideCurrentHint() {
      this.currentHint?.hide();
    }
    onboardingStepCompleted(id) {
      return (Save.Current?.completedOnboardingSteps || []).includes(id);
    }
    completeOnboardingStep(id) {
      if (this.onboardingStepCompleted(id)) return;
      (Save.Current.completedOnboardingSteps ||= []).push(id);
    }
  };
  register2(OnboardingManager);

  // web/src/game/camera.js
  var CameraZoomToFit = class extends MonoBehaviour {
    static {
      __name(this, "CameraZoomToFit");
    }
    start() {
      this.mainCamera = this.getComponent("Camera");
      if (!this.uiRoot) return;
      this.baseAnchoredPosition = { ...this.uiRoot.anchoredPosition };
      const p = cur("Player");
      p?.OnTicketOpened.add((t) => this.onTicketOpened(t));
      p?.OnTicketClosed.add(() => this.resetZoom());
      this._cashed = () => this.resetZoom();
      cur("GlobalEvents")?.OnTicketCashedOut.add(this._cashed);
      this.updateBaseZoom();
    }
    onDestroy() {
      cur("GlobalEvents")?.OnTicketCashedOut.remove(this._cashed);
    }
    updateBaseZoom() {
      const W = Renderer.width, H = Renderer.height;
      this.defaultOrthosize = this.tableWorldWidth / (W / H * (this.percentOfSafeArea * 2));
      const cam = this.mainCamera;
      if (!cam) return;
      const z = cam.transform.position.z;
      this.cameraOffset = new Vec3(0, 0, z);
      cam.transform.position = this.cameraOffset.clone();
      this.transform.position = this.cameraOffset.clone();
      this.targetPosition = this.cameraOffset.clone();
      this.aspectRatio = W / H;
      const t = Math.min(1, Math.max(0, (this.aspectRatio - 1) / 0.7777778));
      cam.orthographicSize = t * (this.defaultOrthosize - 2.75) + 2.75;
      this.baseOrthoSize = this.targetOrthoSize = cam.orthographicSize;
      this.fitBackground();
    }
    fitBackground() {
      const cam = this.mainCamera;
      if (!cam || !this.backgrounds) return;
      const h = this.targetOrthoSize * 2;
      this.backgrounds.localScale = new Vec3(h * cam.aspect / 6.4, h / 3.6, 1);
    }
    onTicketOpened(ticket) {
      this.targetOrthoSize = this.baseOrthoSize * 0.5;
      this.targetPosition = new Vec3(0, 0, this.cameraOffset.z);
      ticket?.scaleToFitCamera?.(this.targetOrthoSize);
      cur("TrashCan")?.showTrashButton?.(true);
    }
    resetZoom() {
      this.targetOrthoSize = this.baseOrthoSize;
      this.targetPosition = this.cameraOffset.clone();
      cur("TrashCan")?.showTrashButton?.(false);
    }
    update() {
      if (Renderer.width / Renderer.height !== this.aspectRatio) this.updateBaseZoom();
      const cam = this.mainCamera;
      if (!cam || !this.uiRoot) return;
      cam.orthographicSize += (this.targetOrthoSize - cam.orthographicSize) * 0.1;
      const cp = cam.transform.position, tp = this.targetPosition;
      cam.transform.position = new Vec3(cp.x + (tp.x - cp.x) * 0.1, cp.y + (tp.y - cp.y) * 0.1, cp.z + (tp.z - cp.z) * 0.1);
      const k = this.baseOrthoSize / cam.orthographicSize;
      this.uiRoot.localScale = new Vec3(k, k, k);
      const canvasRt = this.uiRoot.getComponentInParent?.("Canvas")?.transform;
      const r = canvasRt?.rect;
      if (r) {
        const p = cam.transform.position, o = cam.orthographicSize, a = cam.aspect;
        this.uiRoot.anchoredPosition = { x: this.baseAnchoredPosition.x - (p.x - this.cameraOffset.x) / (2 * o * a) * r.width * k, y: this.baseAnchoredPosition.y - (p.y - this.cameraOffset.y) / (2 * o) * r.height * k };
      }
      for (const rt of this.uiKeepScreenSizeDuringZoom || []) if (rt) rt.localScale = new Vec3(0.8 / k, 0.8 / k, 0.8 / k);
    }
  };
  register2(CameraZoomToFit);

  // web/src/game/loan.js
  var ease6 = /* @__PURE__ */ __name((e) => typeof e === "number" ? EaseByIndex[e] === "Unset" ? "OutQuad" : EaseByIndex[e] : e || "OutQuad", "ease");
  var loans = /* @__PURE__ */ __name(() => Save.Current?.layerOne?.loans || [], "loans");
  var LoanGroup = class extends MonoBehaviour {
    static {
      __name(this, "LoanGroup");
    }
    ctor() {
      this.Data = null;
      this.SaveData = null;
      this.OnPayOff = new Action();
    }
    start() {
      this.payOffButton?.OnAction.add(() => this.OnPayOff.invoke(this));
      this._f = () => this.updateLabels();
      Localization.listeners.add(this._f);
    }
    onDestroy() {
      Localization.listeners.delete(this._f);
    }
    updateData(save) {
      this.SaveData = save;
      this.gameObject.setActive(!!save);
      if (!save) {
        this.Data = null;
        return;
      }
      this.Data = cur("StaticData").loanData[save.id] || null;
      this.updateLabels();
      this.updateCanAfford();
    }
    updateLabels() {
      const s2 = this.SaveData;
      if (!s2) return;
      if (this.loanNumLabel) this.loanNumLabel.text = (this.loanNumString?.getLocalizedString() ?? "Loan #{x}").replace("{x}", String(s2.loanNum));
      if (this.amountLabel) this.amountLabel.text = fmt(s2.amount);
      if (this.descriptionLabel && this.Data) this.descriptionLabel.text = (Localization.get(this.Data.id + "_description") ?? this.Data.description).replace("{x}", String(this.getValue()));
    }
    getValue() {
      const d = this.Data;
      if (!d || !this.SaveData) return 0;
      return [0, d.lowValue, d.mediumValue, d.highValue][this.SaveData.severity] ?? 0;
    }
    updateCanAfford() {
      const s2 = this.SaveData;
      const w = cur("Player")?.wallet;
      if (!s2 || !w) return;
      const ok = w.canAfford(s2.amount);
      if (this.payOffButton?.button) this.payOffButton.button.interactable = ok;
      if (this.amountLabel) this.amountLabel.color = ok ? this.amountLabel.color.constructor.from({ r: 1, g: 1, b: 1, a: 1 }) : cur("LoanPanel").cantAffordTextColor;
    }
  };
  register2(LoanGroup);
  var LoanPanel = class extends MonoBehaviour {
    static {
      __name(this, "LoanPanel");
    }
    get IsActive() {
      return !!this.panel?.gameObject.activeSelf;
    }
    awake() {
      for (const g of this.loanGroups || []) g?.gameObject.setActive(false);
      for (const s2 of loans()) this.activateLoanSave(s2, false);
    }
    start() {
      if (this.panel) {
        this.startPos = { ...this.panel.anchoredPosition };
        if (this.outsideScreenPos) this.panel.anchoredPosition = { ...this.outsideScreenPos.anchoredPosition };
        this.panel.gameObject.setActive(false);
      }
      this.loanPanelButton?.onClick.addListener(() => this.show());
      this.backButton?.onClick.addListener(() => this.hide());
      this._cashed = (t, v, u) => this.onTicketCashedOut(t, v, u);
      cur("GlobalEvents")?.OnTicketCashedOut.add(this._cashed);
      for (const g of this.loanGroups || []) g?.OnPayOff.add((grp) => this.onPayOff(grp));
      if (this.blackscreen) {
        this.blackscreen.color = this.blackscreen.color.withAlpha(0);
        this.blackscreen.raycastTarget = false;
      }
      if (this.wrongDeliveryIcon) this.wrongDeliveryIcon.gameObject.setActive(false);
      this.updateLoanPanelButton();
      cur("Player")?.wallet?.OnMoneyUpdated.add(() => {
        if (this.IsActive) for (const g of this.loanGroups || []) g.updateCanAfford();
      });
    }
    onDestroy() {
      cur("GlobalEvents")?.OnTicketCashedOut.remove(this._cashed);
    }
    show() {
      const p = this.panel;
      if (!p) return;
      p.gameObject.setActive(true);
      DOTween.kill(p);
      DO.anchorPos(p, this.startPos, this.flyInDuration).setEase(ease6(this.flyInEase));
      if (this.blackscreen) {
        this.blackscreen.raycastTarget = true;
        DO.fade(this.blackscreen, this.blackscreenAlpha, this.flyOutDuration);
      }
      for (const g of this.loanGroups || []) g.updateCanAfford();
    }
    hide() {
      if (this.blackscreen) {
        this.blackscreen.raycastTarget = false;
        DO.fade(this.blackscreen, 0, this.flyOutDuration);
      }
      const p = this.panel;
      if (!p || !this.outsideScreenPos) return;
      DOTween.kill(p);
      DO.anchorPos(p, { ...this.outsideScreenPos.anchoredPosition }, this.flyOutDuration).setEase(ease6(this.flyOutEase)).onComplete(() => p.gameObject.setActive(false));
    }
    activateLoan(id, severity, amount) {
      Save.Current.loanCount = (Save.Current.loanCount || 0) + 1;
      const s2 = { id, index: loans().length, loanNum: Save.Current.loanCount, severity, amount };
      this.activateLoanSave(s2, true);
    }
    activateLoanSave(s2, save) {
      const g = this.loanGroups?.[s2.index];
      if (!g) return;
      g.updateData(s2);
      if (save) {
        loans().push(s2);
        cur("SaveManager")?.save();
        this.updateLoanPanelButton();
      }
      if (s2.id === "Ticket price increase") for (const p of cur("TicketShop")?.shopPanelDict.values() || []) p.calculatePrice?.();
      if (s2.id === "Smaller scratch size") {
        const t = cur("Player")?.scratching?.scratchTool;
        if (t) t.SizeReduction += Math.trunc(g.getValue());
      }
    }
    deactivateLoan(g) {
      const s2 = g.SaveData;
      if (!s2) return;
      const l = loans();
      const i = l.findIndex((x) => x.index === s2.index);
      if (i >= 0) l.splice(i, 1);
      if (s2.id === "Ticket price increase") for (const p of cur("TicketShop")?.shopPanelDict.values() || []) p.calculatePrice?.();
      if (s2.id === "Smaller scratch size") {
        const t = cur("Player")?.scratching?.scratchTool;
        if (t) t.SizeReduction = Math.max(0, t.SizeReduction - Math.trunc(g.getValue()));
      }
    }
    updateLoanPanelButton() {
      this.loanPanelButton?.gameObject.setActive(loans().length > 0);
    }
    onTicketCashedOut(ticket, amount) {
      if (ticket?.Data?.id !== "Loan" || amount <= 0 || loans().length > 2) return;
      if (this.loanPanelButton) {
        DOTween.kill(this.loanPanelButton.transform, true);
        DO.punchScale(this.loanPanelButton.transform, this.buttonBounceScale, this.buttonBounceDuration, 10, 1);
      }
      const all = Object.values(cur("StaticData").loanData);
      const d = all[Math.floor(Random.value * all.length)];
      const base = Math.max(5, Save.Current.layerOne.lastUnlockedProgressionGoal);
      let sev = 1;
      if (amount > 10 && amount / base > 0.2) sev = amount / base >= 1 ? 3 : 2;
      this.activateLoan(d.id, sev, amount * 60);
      cur("DialogueManager")?.queueDialogue("firstLoan", true, null);
    }
    onPayOff(g) {
      const s2 = g.SaveData;
      const w = cur("Player")?.wallet;
      if (!s2 || !w) return;
      if (!w.trySubtract(s2.amount)) return;
      this.deactivateLoan(g);
      cur("AudioManager")?.playSound("moneyLost", 1);
      const rest = (this.loanGroups || []).map((x) => x.SaveData).filter((x) => x && x !== s2);
      for (const x of this.loanGroups || []) x.updateData(null);
      rest.forEach((x, i) => {
        x.index = i;
        this.loanGroups[i]?.updateData(x);
      });
      Save.Current.layerOne.loans = rest;
      this.updateLoanPanelButton();
      cur("SaveManager")?.save();
      if (!rest.length) this.hide();
    }
    sumBy(id, f) {
      let v = 0;
      for (const s2 of loans()) if (s2.id === id) {
        const g = this.loanGroups?.[s2.index];
        if (g) v += f(g.getValue());
      }
      return v;
    }
    getTicketMultReduction() {
      return this.sumBy("Income reduction", (v) => v / 100);
    }
    getTicketPriceMult() {
      return 1 + this.sumBy("Ticket price increase", (v) => v / 100);
    }
    getSpeedReductionMult() {
      return Math.max(0.1, 1 - this.sumBy("Scratch bot slowed", (v) => v / 100));
    }
    checkModifyBoughtTicketID(id) {
      const chance = Math.min(0.6, this.sumBy("Wrong delivery", (v) => 1 / v));
      if (!chance || Random.value >= chance) return id;
      this.bounceIcon(this.wrongDeliveryIcon);
      const list = Object.values(cur("StaticData").ticketData).filter((t) => t.id !== "Loan" && !t.id.toLowerCase().includes("final chance"));
      const i = list.findIndex((t) => t.id === id);
      const j = Math.floor(Random.value * Math.max(0, i - 1));
      return list[j]?.id ?? id;
    }
    bounceIcon(icon) {
      if (!icon) return;
      icon.gameObject.setActive(true);
      DOTween.kill(icon);
      icon.color = icon.color.withAlpha(1);
      DOTween.complete(icon.transform);
      DO.punchScale(icon.transform, this.iconBounceScale, this.iconBounceDuration, 10, 1);
      DO.fade(icon, 0, this.iconFadeDuration).setDelay(this.iconFadeDelay).onComplete(() => icon.gameObject.setActive(false));
    }
  };
  register2(LoanPanel);

  // web/src/game/prestige.js
  var ease7 = /* @__PURE__ */ __name((e) => typeof e === "number" ? EaseByIndex[e] === "Unset" ? "OutQuad" : EaseByIndex[e] : e || "OutQuad", "ease");
  var perkName = /* @__PURE__ */ __name((type) => Object.keys(PerkType).find((k) => PerkType[k] === type), "perkName");
  var MAX_ACT = /* @__PURE__ */ __name(() => cur("BuildModeManager")?.Mode ? 1 : 5, "MAX_ACT");
  var Vignette = class extends MonoBehaviour {
    static {
      __name(this, "Vignette");
    }
    start() {
      this.panel?.setActive(false);
    }
    fadeToBlack(cb, instant = false) {
      this.startCoroutine(this.doFade(cb, instant ? 0 : this.fadeDuration));
    }
    *doFade(cb, duration) {
      const p = this.panel;
      if (!p) {
        cb?.();
        return;
      }
      p.transform.localScale = new Vec3(this.startingScale, this.startingScale, this.startingScale);
      p.setActive(true);
      if (this.canvasGroup) {
        this.canvasGroup.blocksRaycasts = true;
        this.canvasGroup.interactable = true;
      }
      let t = 0;
      while (t < duration) {
        t += Time.deltaTime;
        const s2 = this.scaleCurve ? evaluateCurve(this.scaleCurve, t / duration) : 1 - t / duration;
        p.transform.localScale = new Vec3(s2, s2, s2);
        const f = this.fadeCurve ? evaluateCurve(this.fadeCurve, t / duration) : 0;
        if (this.blackscreenImage) this.blackscreenImage.color = new Color(0, 0, 0, 1 - f);
        yield null;
      }
      if (this.blackscreenImage) this.blackscreenImage.color = new Color(0, 0, 0, 1);
      cb?.();
    }
    hide() {
      this.panel?.setActive(false);
      if (this.canvasGroup) {
        this.canvasGroup.blocksRaycasts = false;
        this.canvasGroup.interactable = false;
      }
    }
  };
  register2(Vignette);
  var PrestigeManager = class extends MonoBehaviour {
    static {
      __name(this, "PrestigeManager");
    }
    ctor() {
      this.isDying = false;
      this.isPrestiging = false;
    }
    get IsDying() {
      return this.isDying;
    }
    get MAX_ACT() {
      return MAX_ACT();
    }
    awake() {
      const s2 = Save.Current;
      if (s2?.fadeInFromWhite && this.whiteScreen) {
        this.whiteScreen.color = this.whiteScreen.color.withAlpha(1);
        cur("GlobalEvents")?.callAfterTime(0.01, () => DO.fade(this.whiteScreen, 0, this.whiteScreenFadeDuration));
        s2.fadeInFromWhite = false;
        cur("SaveManager")?.save();
      } else if (this.whiteScreen) this.whiteScreen.color = this.whiteScreen.color.withAlpha(0);
      if (this.whiteScreen) this.whiteScreen.raycastTarget = false;
      this.prestigePanelButton?.setActive((s2?.prestigeCount ?? 0) > 0);
      this.prestigeButton?.OnAction.add(() => this.death(false, true, false, null, false));
    }
    start() {
      this._f = () => this.updatePrestigeButtonLabel();
      Localization.listeners.add(this._f);
      this.updatePrestigeButtonLabel();
    }
    onDestroy() {
      Localization.listeners.delete(this._f);
    }
    update() {
      const l = Save.Current?.layerOne;
      if (l) l.timeSpentInThisPrestige = (l.timeSpentInThisPrestige || 0) + Time.deltaTime;
    }
    // Death(deathByFinalChance, giveJP, loadingIn, afterFadeCallback, disableDeathSound)
    death(byFinalChance = false, giveJP = false, loadingIn = false, afterFade = null, disableDeathSound = false) {
      if (this.isDying) return;
      this.isDying = true;
      const s2 = Save.Current;
      s2.deathByFinalChance = !!byFinalChance;
      if (byFinalChance) s2.deathByFinalChanceCount = Math.min(s2.currentAct, (s2.deathByFinalChanceCount || 0) + 1);
      cur("DialogueManager")?.clearQueue(false);
      if (byFinalChance) {
        if (!loadingIn && !disableDeathSound) cur("AudioManager")?.playSoundDelayed?.(this.deathSoundDelay, "death", 1) ?? cur("GlobalEvents")?.callAfterTime(this.deathSoundDelay, () => cur("AudioManager")?.playSound("death", 1));
        cur("ChallengeManager")?.checkChallengeCompleted();
        cur("GlobalEvents")?.OnDeathByFinalChance.invoke();
      }
      const mm = cur("MusicManager");
      mm?.fadeOutMusic(byFinalChance ? 0.5 : 2);
      mm?.startMusic(MusicType.Prestige, loadingIn ? 0 : this.prestigeMusicDelayOnDeath);
      const after = /* @__PURE__ */ __name(() => this.afterFadeToBlack(byFinalChance, giveJP, loadingIn, afterFade), "after");
      if (this.vignette) this.vignette.fadeToBlack(after, loadingIn);
      else after();
    }
    afterFadeToBlack(byFinalChance, giveJP, instant, afterFade) {
      afterFade?.();
      const s2 = Save.Current;
      if (giveJP) s2.prestigeCurrency += this.getPrestigeCurrencyAmountToGain();
      s2.layerOne.jackpotsGotten.length = 0;
      s2.isPrestiging = true;
      cur("SaveManager")?.save();
      const player = cur("Player");
      const open = player?.scratching?.CurrentTicket;
      if (open) player.discardTicket(open, false, true);
      if (byFinalChance && !instant) this.startCoroutine(this.phoneCall());
      else cur("PrestigePanel")?.show(true, instant);
    }
    *phoneCall() {
      yield new WaitForSeconds(this.phoneRingingDelay);
      const act = Save.Current.currentAct;
      const dm = cur("DialogueManager");
      const open = /* @__PURE__ */ __name(() => cur("PrestigePanel")?.show(true, false), "open");
      if (act >= 1 && act <= MAX_ACT() && dm) {
        dm.clearQueue(false);
        dm.queueDialogue("death" + act, false, open, false);
        yield new WaitForSeconds(this.pickupPhoneDelay);
        cur("Phone")?.pickupCall();
      } else open();
    }
    // first-ever bankruptcy restarts the run; afterwards it counts as a death
    bankruptcyDeath() {
      if ((Save.Current.prestigeCount || 0) >= 1) {
        this.death(false, false, false, null, false);
        return;
      }
      this.isDying = true;
      cur("DialogueManager")?.clearQueue(true);
      cur("AudioManager")?.playSound("death", 1);
      const go = /* @__PURE__ */ __name(() => cur("GlobalEvents")?.callAfterTime(1.5, () => {
        if (!this.whiteScreen) {
          this.restartRun();
          return;
        }
        this.whiteScreen.raycastTarget = true;
        DO.fade(this.whiteScreen, 1, this.whiteScreenFadeDuration).onComplete(() => this.restartRun());
      }), "go");
      if (this.vignette) this.vignette.fadeToBlack(go, false);
      else go();
    }
    restartRun() {
      cur("SaveManager")?.resetLayerOne();
      Save.Current.fadeInFromWhite = true;
      cur("SaveManager")?.save();
      Game.loadScene("Game");
    }
    prestigeAfterEnding() {
      cur("ChallengeManager")?.checkChallengeCompleted();
      const s2 = Save.Current;
      s2.prestigeCurrency += this.getPrestigeCurrencyAmountToGain();
      s2.layerOne.jackpotsGotten.length = 0;
      s2.isPrestiging = true;
      cur("SaveManager")?.save();
    }
    prestige() {
      if (this.isPrestiging) return;
      this.isPrestiging = true;
      const s2 = Save.Current;
      if (s2.deathByFinalChance && s2.currentAct < MAX_ACT()) s2.currentAct++;
      s2.prestigeCount++;
      cur("SaveManager")?.resetLayerOne();
      s2.isPrestiging = false;
      cur("SaveManager")?.save();
      cur("MusicManager")?.fadeOutMusic(1);
      cur("AudioManager")?.playSound("prestigeWoup", 1);
      const done = /* @__PURE__ */ __name(() => {
        this.vignette?.hide();
        s2.fadeInFromWhite = true;
        cur("SaveManager")?.save();
        cur("GlobalEvents")?.callNextFrame(() => Game.loadScene("Game"));
      }, "done");
      if (this.whiteScreen) {
        this.whiteScreen.raycastTarget = true;
        DO.fade(this.whiteScreen, 1, this.whiteScreenFadeDuration).onComplete(done);
      } else done();
    }
    updatePrestigeButtonLabel() {
      if (!this.prestigeButtonLabel) return;
      this.prestigeButtonLabel.text = `${this.prestigeButtonString?.getLocalizedString() ?? "Prestige"} (${this.getPrestigeCurrencyAmountToGain()})`;
    }
    getPrestigeCurrencyAmountToGain() {
      const sd = cur("StaticData");
      const l = Save.Current?.layerOne;
      if (!l || !sd) return 0;
      let n = 0;
      for (const id of l.jackpotsGotten || []) {
        const d = sd.getTicketData(id);
        if (d) n += this.getPrestigeCurrencyAmountForTicket(d, false);
      }
      for (const id of l.superJackpotsGotten || []) {
        const d = sd.getTicketData(id);
        if (d) n += this.getPrestigeCurrencyAmountForTicket(d, true);
      }
      return n;
    }
    getPrestigeCurrencyAmountForTicket(d, superJackpot = false) {
      let n = Math.trunc(Math.max(1, Math.pow(this.prestigeCurrencyMult || 5, (d.catalog || 1) - 1)));
      if (superJackpot) n <<= 1;
      const p = cur("PerkManager")?.tryGetActivePerk(PerkType.JackpotPower);
      if (p) n += Math.trunc(perkValue(p));
      return n;
    }
  };
  register2(PrestigeManager);
  var PrestigeUpgradePanel = class extends MonoBehaviour {
    static {
      __name(this, "PrestigeUpgradePanel");
    }
    ctor() {
      this.CurrentPrice = 0;
      this.Data = null;
      this.OnBought = new Action();
      this.OnCouldNotAfford = new Action();
      this.OnPressed = new Action();
    }
    start() {
      this._f = () => this.updateCount();
      Localization.listeners.add(this._f);
      this.button?.onClick.addListener(() => this.OnPressed.invoke(this));
    }
    onDestroy() {
      Localization.listeners.delete(this._f);
    }
    get BoughtCount() {
      return this.Data ? Save.Current.boughtPrestigeUpgrades?.[this.Data.id] ?? 0 : 0;
    }
    get IsMaxed() {
      return !!this.Data && this.Data.count <= this.BoughtCount;
    }
    get IsUnlocked() {
      return !this.questionMarkIcon?.gameObject.activeSelf;
    }
    updateData(d) {
      this.Data = d;
      if (d && this.icon) this.icon.sprite = cur("StaticData").getSprite(d.id);
      this.updateCount();
      this.updatePrice();
    }
    updatePrice() {
      if (this.Data) this.CurrentPrice = Helper.getPredictedValueInt(this.Data.price, this.Data.priceIncrease, this.BoughtCount);
    }
    updateCount() {
      if (!this.Data || !this.countLabel) return;
      const n = this.BoughtCount, max = this.Data.count;
      if (n < max) {
        this.countLabel.text = `${n}/${max}`;
        this.goldOutline?.gameObject.setActive(false);
      } else {
        this.countLabel.text = this.maxStringShort?.getLocalizedString() ?? "MAX";
        this.goldOutline?.gameObject.setActive(true);
      }
    }
    setLocked(l) {
      this.lockImage?.gameObject.setActive(l);
    }
    setHidden(hidden, locked = false) {
      const lockOn = !!this.lockImage?.gameObject.activeSelf || locked;
      this.lockImage?.gameObject.setActive(lockOn);
      this.questionMarkIcon?.gameObject.setActive(hidden && !lockOn);
      this.icon?.gameObject.setActive(!hidden);
      this.countLabel?.gameObject.setActive(!hidden && this.deathPrestigeNum === 0);
      if (this.bg) this.bg.color = Color.from(hidden ? this.bgLockedColor : this.bgDefaultColor);
    }
    setSelected(sel) {
      this.outline?.gameObject.setActive(sel);
    }
    updateState() {
      if (!this.Data) {
        const lock = !!this.lockImage?.gameObject.activeSelf;
        this.questionMarkIcon?.gameObject.setActive(!lock);
        this.icon?.gameObject.setActive(false);
        this.countLabel?.gameObject.setActive(false);
        if (this.bg) this.bg.color = Color.from(this.bgLockedColor);
        return;
      }
      this.updateCount();
      this.updatePrice();
      let visible = !this.unlockedAfter?.length || this.unlockedAfter.some((p) => p.BoughtCount > 0);
      if (this.deathPrestigeNum > 0) visible = this.deathPrestigeNum <= (Save.Current.deathByFinalChanceCount || 0);
      this.setHidden(!visible, false);
    }
    buy() {
      if (!cur("PrestigePanel")?.IsPrestige || !this.Data || this.IsMaxed) return false;
      const s2 = Save.Current;
      const n = this.BoughtCount;
      if (this.Data.id === "Night Market") {
        if (Helper.round(s2.tokens || 0) < this.CurrentPrice) {
          cur("AudioManager")?.playSound("error", 1);
          this.OnCouldNotAfford.invoke();
          return false;
        }
        s2.tokens = Helper.round((s2.tokens || 0) - this.CurrentPrice);
      } else {
        if (s2.prestigeCurrency < this.CurrentPrice) {
          cur("AudioManager")?.playSound("error", 1);
          this.OnCouldNotAfford.invoke();
          return false;
        }
        s2.totalPrestigeCurrencySpent += this.CurrentPrice;
        s2.prestigeCurrency -= this.CurrentPrice;
      }
      s2.boughtPrestigeUpgrades[this.Data.id] = n + 1;
      cur("AudioManager")?.playSound("buy", 0.7);
      cur("PerkManager")?.activatePerk(this.perk, n + 1);
      this.updatePrice();
      this.updateCount();
      this.OnBought.invoke(this);
      cur("GlobalEvents")?.OnPrestigeUpgradeBought.invoke(this);
      return true;
    }
  };
  register2(PrestigeUpgradePanel);
  var PrestigeUpgradeInfoPanel = class extends MonoBehaviour {
    static {
      __name(this, "PrestigeUpgradeInfoPanel");
    }
    updateInfo(perk, price, count, iconSprite, unlocked) {
      const show = !!perk && unlocked;
      this.titleLabel?.gameObject.setActive(show);
      this.effectIncreaseLabel?.gameObject.setActive(show);
      this.button?.gameObject.setActive(show);
      this.descriptionLabel?.gameObject.setActive(!perk || unlocked);
      if (this.icon) this.icon.sprite = unlocked ? iconSprite : this.questionMarkSprite;
      if (!perk) {
        if (this.descriptionLabel) this.descriptionLabel.text = this.notAvailableInDemoString?.getLocalizedString() ?? "";
        this.priceGroup?.setActive(false);
        return;
      }
      if (!unlocked) {
        if (this.descriptionLabel) this.descriptionLabel.text = "???";
        this.priceGroup?.setActive(false);
        return;
      }
      if (this.titleLabel) this.titleLabel.text = Localization.get(perk.id + "_name") ?? perk.id;
      this.updateDescriptionLabel(perk);
      this.effectIncreaseLabel?.gameObject.setActive(perk.count > 1 && perk.type !== "ToolBelt");
      if (perk.count > 1 && this.effectIncreaseLabel) {
        const pct = perk.description.includes("%") ? "%" : "";
        const neg = perk.description.includes("-") ? "-" : "";
        const v = /* @__PURE__ */ __name((k) => `${neg}${+(perk.value * k).toFixed(2)}${pct}`, "v");
        const isPrestige2 = cur("PrestigePanel")?.IsPrestige;
        this.effectIncreaseLabel.text = !isPrestige2 || count >= perk.count ? (this.currentValueString?.getLocalizedString() ?? "Current: {x}").replace("{x}", v(count)) : `${v(count)} \u2192 ${v(count + 1)}`;
      }
      const maxed = count >= perk.count;
      this.priceGroup?.setActive(!maxed);
      if (this.priceLabel) {
        if (maxed) this.priceLabel.text = this.upgradeMaxedString?.getLocalizedString() ?? "Maxed";
        else {
          this.priceLabel.text = String(price);
          const have = perk.id === "Night Market" ? Save.Current.tokens || 0 : Save.Current.prestigeCurrency;
          this.priceLabel.color = have < price ? Color.from(this.cantAffordColor) : new Color(1, 1, 1, 1);
        }
      }
      const isPrestige = cur("PrestigePanel")?.IsPrestige;
      this.button?.gameObject.setActive(!!isPrestige && !maxed);
      if (maxed && this.priceGroup) this.priceGroup.setActive(true);
    }
    updateDescriptionLabel(perk) {
      if (!this.descriptionLabel) return;
      let t = (Localization.get(perk.id + "_description") ?? perk.description ?? "").replace("{x}", String(+perk.value.toFixed(2)));
      if (perk.type === "Hotkeys") t = t.replace("{claimButton}", "Space").replace("{trashButton}", "X").replace("{multiBuyButtons}", "1-4").replace("{spellButton}", "S");
      if (perk.type === "ToolBelt") {
        const n = Save.Current.boughtPrestigeUpgrades?.[perk.id] ?? 0;
        const i = n === perk.count ? n - 1 : n;
        const tools = cur("Player")?.scratching?.scratchTool?.AllScratchTools || [];
        const id = i === 0 ? "Big Sponge" : tools[i] ?? "";
        t = t.replace("{tool}", Localization.get(id + "_name") ?? id);
      }
      this.descriptionLabel.text = t;
    }
    setButtonEnabled(e) {
      this.button?.gameObject.setActive(e);
    }
    bouncePriceLabel() {
      const g = this.priceGroup;
      if (!g) return;
      DOTween.complete(g.transform);
      DO.punchScale(g.transform, this.priceBounceScale, this.priceBounceDuration, 10, 1);
    }
  };
  register2(PrestigeUpgradeInfoPanel);
  var PrestigePanel = class extends MonoBehaviour {
    static {
      __name(this, "PrestigePanel");
    }
    ctor() {
      this.IsPrestige = false;
      this.upgradePanels = [];
      this.selectedPanel = null;
      this.lastPanelPress = -1;
    }
    get IsActive() {
      return !!this.panel?.gameObject.activeSelf;
    }
    get UpgradePanels() {
      return this.upgradePanels;
    }
    start() {
      if (this.panel) {
        this.startPos = { ...this.panel.anchoredPosition };
        if (this.outsideScreenPos) this.panel.anchoredPosition = { ...this.outsideScreenPos.anchoredPosition };
        this.panel.gameObject.setActive(false);
      }
      this.prestigeButton?.onClick.addListener(() => this.prestige());
      this.resetButton?.OnAction.add(() => this.resetUpgrades());
      this.prestigeConfirmPopupBackButton?.onClick.addListener(() => this.prestigeConfirmPopup?.hide());
      this.upgradePanels = this.branchesParent ? this.branchesParent.getComponentsInChildren("PrestigeUpgradePanel", true) : [];
      const sd = cur("StaticData");
      for (const p of this.upgradePanels) {
        const name = perkName(p.perk);
        const data = p.perk !== -1 && name ? Object.values(sd.perkData).find((d) => d.type === name) || null : null;
        if (!data) {
          p.perk = -1;
          p.setHidden(true, true);
          p.updateData(null);
        } else p.updateData(data);
        p.OnBought.add((x) => this.onUpgradeBought(x));
        p.OnCouldNotAfford.add(() => this.infoPanel?.bouncePriceLabel());
        p.OnPressed.add((x) => this.onPanelPressed(x));
      }
      this.prestigePanelButton?.onClick.addListener(() => this.show(false));
      this.backButton?.onClick.addListener(() => this.hide());
      this.infoPanel?.button?.onClick.addListener(() => this.infoPanelButtonPressed());
      if (this.blackscreen) {
        this.blackscreen.color = this.blackscreen.color.withAlpha(0);
        this.blackscreen.raycastTarget = false;
      }
      this.challengesTabButton?.gameObject.setActive((Save.Current.boughtPrestigeUpgrades?.Challenges ?? 0) > 0);
      this.updatePanelStates();
      this.updatePrestigeCurrencyLabel(false);
      if (this.upgradePanels.length) this.selectPanel(this.upgradePanels.find((p) => p.Data && p.IsUnlocked) || null);
    }
    initSettingsButton() {
      this.settingsButton?.gameObject.setActive(true);
      this.settingsButton?.onClick.addListener(() => cur("SettingsMenu")?.show());
    }
    show(isPrestige, instant = false) {
      this.IsPrestige = isPrestige;
      this.prestigeButton?.gameObject.setActive(isPrestige);
      this.resetButton?.gameObject.setActive(isPrestige);
      this.backButton?.gameObject.setActive(!isPrestige);
      const p = this.panel;
      if (!p) return;
      p.gameObject.setActive(true);
      DOTween.kill(p);
      if (instant) p.anchoredPosition = { ...this.startPos };
      else DO.anchorPos(p, this.startPos, this.flyInDuration).setEase(ease7(this.flyInEase));
      if (!isPrestige && this.blackscreen) {
        this.blackscreen.raycastTarget = true;
        DO.fade(this.blackscreen, this.blackscreenAlpha, this.flyOutDuration);
      }
      this.updatePanelStates();
      this.updatePrestigeCurrencyLabel(false);
      if (isPrestige) {
        this.initSettingsButton();
        cur("ChallengesPanel")?.init?.();
      }
      this.tabs?.show?.();
      if (this.selectedPanel) this.selectPanel(this.selectedPanel);
    }
    isUnlockedDeathPerk(p) {
      return !!p && p.deathPrestigeNum <= (Save.Current.deathByFinalChanceCount || 0);
    }
    hide() {
      if (this.blackscreen) {
        this.blackscreen.raycastTarget = false;
        DO.fade(this.blackscreen, 0, this.flyOutDuration);
      }
      const p = this.panel;
      if (!p || !this.outsideScreenPos) return;
      DOTween.kill(p);
      DO.anchorPos(p, { ...this.outsideScreenPos.anchoredPosition }, this.flyOutDuration).setEase(ease7(this.flyOutEase)).onComplete(() => p.gameObject.setActive(false));
    }
    prestige() {
      const pop = this.prestigeConfirmPopup;
      if (pop) pop.show(() => cur("PrestigeManager")?.prestige());
      else cur("PrestigeManager")?.prestige();
    }
    resetUpgrades() {
      const s2 = Save.Current;
      const ids = Object.keys(s2.boughtPrestigeUpgrades || {});
      cur("PerkManager")?.deactivateAllPerks();
      s2.boughtPrestigeUpgrades = {};
      s2.prestigeCurrency += s2.totalPrestigeCurrencySpent || 0;
      s2.totalPrestigeCurrencySpent = 0;
      this.updatePrestigeCurrencyLabel(true);
      for (const id of ids) {
        const p = this.upgradePanels.find((x) => x.Data?.id === id);
        if (!p) continue;
        if (p.deathPrestigeNum && this.isUnlockedDeathPerk(p) || id === "Night Market") {
          cur("PerkManager")?.activatePerk(p.perk, 1);
          s2.boughtPrestigeUpgrades[id] = 1;
        }
      }
      cur("SaveManager")?.save();
      this.updatePanelStates();
      if (this.selectedPanel) this.selectPanel(this.selectedPanel);
    }
    updatePanelStates() {
      for (const p of this.upgradePanels) {
        if (p.Data && p.deathPrestigeNum && this.isUnlockedDeathPerk(p) && Save.Current.boughtPrestigeUpgrades[p.Data.id] === void 0) {
          cur("PerkManager")?.activatePerk(p.perk, 1);
          Save.Current.boughtPrestigeUpgrades[p.Data.id] = 1;
        }
        p.updateState();
      }
      this.challengesTabButton?.gameObject.setActive((Save.Current.boughtPrestigeUpgrades?.Challenges ?? 0) > 0);
    }
    updatePrestigeCurrencyLabel(bounce) {
      const tokens2 = this.selectedPanel?.Data?.id === "Night Market";
      if (this.prestigeCurrencyLabel) this.prestigeCurrencyLabel.text = fmt(tokens2 ? Helper.round(Save.Current.tokens || 0) : Save.Current.prestigeCurrency);
      if (this.prestigeCurrencyIcon) this.prestigeCurrencyIcon.sprite = tokens2 ? this.tokenSprite : this.prestigeCurrencySprite;
      if (this.infoPanel?.currencyIcon) this.infoPanel.currencyIcon.sprite = tokens2 ? this.tokenSprite : this.prestigeCurrencySprite;
      if (bounce && this.prestigeCurrencyGroup) {
        DOTween.complete(this.prestigeCurrencyGroup);
        DO.punchScale(this.prestigeCurrencyGroup, this.prestigeCurrencyBounceScale, this.prestigeCurrencyBounceDuration, 10, 1);
      }
    }
    selectPanel(p) {
      this.selectedPanel?.setSelected(false);
      this.selectedPanel = p;
      if (!p) return;
      p.setSelected(true);
      this.infoPanel?.updateInfo(p.Data, p.CurrentPrice, p.BoughtCount, p.icon?.sprite, p.IsUnlocked);
      this.updatePrestigeCurrencyLabel(false);
    }
    onPanelPressed(p) {
      const now = Time.realtimeSinceStartup;
      if (p === this.selectedPanel && now - this.lastPanelPress < 0.4) this.infoPanelButtonPressed();
      else {
        cur("AudioManager")?.playSound("buttonClick", 1);
        this.selectPanel(p);
      }
      this.lastPanelPress = now;
    }
    infoPanelButtonPressed() {
      const p = this.selectedPanel;
      if (!p) return;
      p.buy();
      p.updateState();
      this.selectPanel(p);
    }
    onUpgradeBought(p) {
      this.updatePrestigeCurrencyLabel(true);
      this.updatePanelStates();
      if (p.Data?.id === "Challenges") this.challengesTabButton?.gameObject.setActive(true);
      cur("SaveManager")?.save();
    }
  };
  register2(PrestigePanel);
  var ChallengesPanel = class extends MonoBehaviour {
    static {
      __name(this, "ChallengesPanel");
    }
    init() {
    }
  };
  register2(ChallengesPanel);
  var ChallengePanel = class extends MonoBehaviour {
    static {
      __name(this, "ChallengePanel");
    }
  };
  register2(ChallengePanel);
  var ChallengeInfoPanel = class extends MonoBehaviour {
    static {
      __name(this, "ChallengeInfoPanel");
    }
  };
  register2(ChallengeInfoPanel);

  // web/src/game/ending.js
  var ease8 = /* @__PURE__ */ __name((e) => typeof e === "number" ? EaseByIndex[e] === "Unset" ? "OutQuad" : EaseByIndex[e] : e || "OutQuad", "ease");
  var isSJPChance = /* @__PURE__ */ __name((d) => !!d?.id?.startsWith("SuperJPC"), "isSJPChance");
  var isSJP = /* @__PURE__ */ __name((d) => !!d?.id && (d.id.includes("SJP") || d.id.startsWith("SuperJPC")), "isSJP");
  function perlin1(x) {
    const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
    const h = /* @__PURE__ */ __name((n) => {
      const s2 = Math.sin(n * 127.1) * 43758.5453;
      return s2 - Math.floor(s2);
    }, "h");
    return h(i) * (1 - u) + h(i + 1) * u;
  }
  __name(perlin1, "perlin1");
  var SmoothShake = class extends MonoBehaviour {
    static {
      __name(this, "SmoothShake");
    }
    ctor() {
      this._currentStrength = 0;
      this.targetStrength = this.targetStrength || 0;
    }
    start() {
      this._initialPosition = this.transform.isRect ? { ...this.transform.anchoredPosition } : this.transform.localPosition.clone();
      this._randomOffset = Random.value * 100;
    }
    update() {
      const k = Math.min(1, Math.max(0, Time.deltaTime * this.smoothness));
      this._currentStrength += (this.targetStrength - this._currentStrength) * k;
      if (this._currentStrength <= 0.01) {
        this.applyPos(0, 0);
        if (this.audioSource) this.audioSource.volume = 0;
        return;
      }
      this.applyShake();
      const a = this.audioSource;
      if (a) {
        if (!a.isPlaying) a.play();
        a.volume = Math.min(1, this._currentStrength / (this.audioSourceMaxReference || 1));
      }
    }
    applyShake() {
      const t = Time.time * this.speed + this._randomOffset;
      const s2 = this._currentStrength * this.strengthMult;
      this.applyPos((perlin1(t) - 0.5) * 2 * s2, (perlin1(t + 31.7) - 0.5) * 2 * s2);
    }
    applyPos(dx, dy) {
      const p = this._initialPosition;
      if (!p) return;
      if (this.transform.isRect) this.transform.anchoredPosition = { x: p.x + dx, y: p.y + dy };
      else this.transform.localPosition = new Vec3(p.x + dx, p.y + dy, p.z);
    }
  };
  register2(SmoothShake);
  var SuperFinalChance = class extends MonoBehaviour {
    static {
      __name(this, "SuperFinalChance");
    }
    start() {
      this.eyeOpeningAnimation?.gameObject.setActive(false);
      this.slot?.gameObject.setActive(false);
      cur("GlobalEvents")?.callAfterTime(this.eyeOpeningAnimationDelay, () => {
        const a = this.eyeOpeningAnimation;
        if (!a) {
          this.onEyeOpen();
          return;
        }
        a.gameObject.setActive(true);
        a.speed = this.eyeOpeningAnimationSpeed || 1;
        if (this.eyeOpeningSound) cur("AudioManager")?.playSound(this.eyeOpeningSound, 1);
      });
    }
    // animation event at the end of the eye animation
    onEyeOpen() {
      this.eyeOpeningAnimation?.gameObject.setActive(false);
      this.slot?.gameObject.setActive(true);
      this.overlayBG?.setActive(false);
    }
    setCashOutButtonWin(win) {
      this.claimLabel?.setActive(win);
      this.minusOneLabel?.setActive(!win);
      this.soulIconLabel?.setActive(!win);
    }
    claim() {
      if (cur("TheMachine")?.tryConsumeSoul?.()) return;
      cur("PrestigeManager")?.death(true, true, false, null, false);
    }
  };
  register2(SuperFinalChance);
  var SuperJackpotManager = class extends MonoBehaviour {
    static {
      __name(this, "SuperJackpotManager");
    }
    ctor() {
      this.IsActive = false;
      this.superTicket = null;
      this.originalTicket = null;
    }
    start() {
      this._rev = (slot, t) => this.onSymbolSlotRevealed(slot, t);
      cur("GlobalEvents")?.OnSymbolSlotRevealed.add(this._rev);
      if (this.superJackpotBG) {
        this.startAlpha = this.superJackpotBG.color.a;
        this.superJackpotBG.gameObject.setActive(false);
      }
      this.cameraStartZoom = Camera.main?.orthographicSize ?? 5;
      this.drumRollAudioSource?.stop();
    }
    onDestroy() {
      cur("GlobalEvents")?.OnSymbolSlotRevealed.remove(this._rev);
    }
    musicFade(fadeIn) {
      const mp = cur("MusicManager");
      if (fadeIn) mp?.fadeInMusic(1);
      else mp?.fadeOutMusic(1);
    }
    onSymbolSlotRevealed(slot, ticket) {
      const d = slot?.Data;
      if (!d || !ticket) return;
      if (isSJPChance(d) && !ticket.TriggeredSuperJackpot) {
        ticket.TriggeredSuperJackpot = true;
        this.triggerSuperJackpot(ticket.Data.id);
      }
      const st = this.superTicket;
      if (!isSJP(d) || !alive(st) || ticket !== st || !st.AllScratched) return;
      this.drumRollAudioSource?.stop();
      cur("AudioManager")?.playSound("drumRollHit", 1);
      const all = st.Symbols.every((s2) => s2.Data?.type === 3);
      const fc = this.originalTicketID === FINAL_CHANCE_WIN_ID;
      const sfc = st.getComponentInChildren?.("SuperFinalChance");
      if (!all) {
        if (fc) {
          st.showCashOutButton(false);
          this.onTicketCashedOut(false, true);
          sfc?.claim();
        } else sfc?.setCashOutButtonWin(false);
        return;
      }
      if (fc) {
        sfc?.setCashOutButtonWin(true);
        st.showCashOutButton(false);
        cur("EndingManager")?.startEndingDialogue(st);
        return;
      }
      const l = Save.Current.layerOne;
      if (!l.superJackpotsGotten.includes(this.originalTicketID)) {
        l.superJackpotsGotten.push(this.originalTicketID);
        const pm = cur("PrestigeManager");
        pm?.updatePrestigeButtonLabel();
        const td = cur("StaticData").getTicketData(this.originalTicketID);
        const n = td && pm ? pm.getPrestigeCurrencyAmountForTicket(td, true) : 0;
        if (this.superJackpotPopupCountLabel) {
          this.superJackpotPopupCountLabel.text = "+" + n;
          this.superJackpotPopupCountLabel.gameObject.setActive(true);
        }
        this.superJackpotPopupJPIcon?.gameObject.setActive(true);
      } else {
        this.superJackpotPopupCountLabel?.gameObject.setActive(false);
        this.superJackpotPopupJPIcon?.gameObject.setActive(false);
      }
      cur("TicketShop")?.shopPanelDict.get(this.originalTicketID)?.updateJackpotIcon?.();
      this.superJackpotPopup?.show(cur("StaticData").getSprite("Super_Small") || null, this.superJackpotString?.getLocalizedString() ?? "SUPER JACKPOT!");
      cur("AchievementManager")?.triggerAchievement?.("Super Jackpot");
    }
    beginShow() {
      this.IsActive = true;
      this.musicFade(false);
      const a = this.drumRollAudioSource;
      if (a) {
        a.volume = 0;
        a.clip = this.originalTicketID === FINAL_CHANCE_WIN_ID ? this.deepDrumRoll : this.defaultDrumRoll;
        a.play();
        DO.volume(a, 1, 0.5);
      }
      if (this.mainCanvasGroup) DO.fade(this.mainCanvasGroup, 0, this.bgFadeDuration * 0.5);
      const bg = this.superJackpotBG;
      if (bg) {
        bg.color = new Color(0, 0, 0, 0);
        bg.gameObject.setActive(true);
        DO.fade(bg, this.startAlpha, this.bgFadeDuration);
      }
    }
    triggerSuperJackpot(id) {
      if (cur("PrestigeManager")?.isDying) return;
      const player = cur("Player");
      this.originalTableItem = player?.CurrentActiveTableItem;
      this.originalTicket = player?.scratching?.CurrentTicket;
      if (!this.originalTicket) return;
      this.originalTicketID = this.originalTicket.Data.id;
      this.beginShow();
      const ot = this.originalTicket.transform;
      this.originalTicketStartPos = ot.position.clone();
      DO.move(ot, { x: this.originalTicketStartPos.x, y: -this.ticketSpawnPosY, z: this.originalTicketStartPos.z }, this.ticketMoveDuration).setEase(ease8(this.ticketMoveOutEase));
      const st = cur("ItemSpawner").spawnTicket("Super_" + id);
      if (!st) return;
      this.superTicket = st;
      player.scratching.CurrentTicket = st;
      st.getMult(true);
      st.setSortingOrder(51);
      const cam = Camera.main;
      const cp = cam.transform.position;
      const target = st.transform.position.clone();
      st.transform.position = new Vec3(cp.x, -this.ticketSpawnPosY, target.z);
      DO.move(st.transform, { x: cp.x, y: cp.y, z: target.z }, this.ticketMoveDuration).setEase(ease8(this.ticketMoveInEase));
      st.OnCashedOut?.add(() => this.restore(true));
      DOTween.kill(cam);
      DOTween.to(() => cam.orthographicSize, (v) => {
        cam.orthographicSize = v;
      }, this.cameraZoomSize, this.ticketMoveDuration * 2).setEase("InOutSine").setTarget(cam);
    }
    triggerSuperJackpotFromSuperTicket() {
      if (cur("PrestigeManager")?.isDying) return;
      const st = cur("Player")?.scratching?.CurrentTicket;
      if (!st) return;
      this.superTicket = st;
      this.originalTicketID = st.Data.id.replace("Super_", "");
      this.originalTicket = null;
      this.beginShow();
      st.getMult(true);
      st.setSortingOrder(51);
      st.OnCashedOut?.add(() => this.restore(false));
      const cam = Camera.main;
      DOTween.kill(cam);
      DOTween.to(() => cam.orthographicSize, (v) => {
        cam.orthographicSize = v;
      }, this.cameraZoomSize, this.ticketMoveDuration * 2).setEase("InOutSine").setTarget(cam);
    }
    restore(withOriginal) {
      this.musicFade(true);
      this.drumRollAudioSource?.stop();
      const cam = Camera.main;
      DOTween.kill(cam);
      DOTween.to(() => cam.orthographicSize, (v) => {
        cam.orthographicSize = v;
      }, this.cameraStartZoom, this.ticketMoveDuration).setEase("InOutSine").setTarget(cam);
      if (this.superJackpotBG) DO.fade(this.superJackpotBG, 0, this.bgFadeDuration).onComplete(() => this.superJackpotBG.gameObject.setActive(false));
      if (this.mainCanvasGroup) DO.fade(this.mainCanvasGroup, 1, this.bgFadeDuration * 0.5).setDelay(this.bgFadeDuration * 0.5);
      const player = cur("Player");
      const ot = this.originalTicket;
      if (withOriginal && alive(ot) && this.originalTicketID !== FINAL_CHANCE_WIN_ID) {
        DO.move(ot.transform, this.originalTicketStartPos, this.ticketMoveDuration).setEase(ease8(this.ticketMoveInEase));
        if (alive(this.originalTableItem)) player.openTicket(this.originalTableItem, false);
        else player.discardTicket(ot, false, false);
      }
      this.superTicket = null;
      this.IsActive = false;
    }
    // cash-out of a super ticket (or the Super Final Chance failing)
    onTicketCashedOut(wasFromSuperTicket, wasFromSuperFinalChance = false) {
      if (!wasFromSuperFinalChance) this.musicFade(true);
      this.restore(!wasFromSuperTicket);
    }
  };
  register2(SuperJackpotManager);
  var EndingManager = class extends MonoBehaviour {
    static {
      __name(this, "EndingManager");
    }
    ctor() {
      this.IsEnding = false;
      this.DisableScratching = false;
      this.currentSlot = null;
      this.currentSlotIndex = 0;
      this.isWaitingForPhoneGuy = false;
      this.elapsedWaitingForPhoneGuyTime = 0;
    }
    get CurrentSlot() {
      return this.currentSlot;
    }
    *start() {
      if (this.finalTimeLabel) this.finalTimeLabelDefaultColor = this.finalTimeLabel.color;
      for (const s2 of this.scratchingSlots || []) if (s2) s2.enabled = false;
      this.finalChanceBaked?.setActive(false);
      this.finalCredits?.gameObject.setActive(false);
      this.finalCanvasGroup?.gameObject.setActive(false);
      this.prestigeButton?.OnAction.add(() => cur("PrestigeManager")?.death(false, true, false, () => {
        for (const o of this.objectsToDisable || []) o?.setActive(true);
      }, false));
      this.mainMenuButton?.onClick.addListener(() => {
        cur("PrestigeManager")?.prestigeAfterEnding();
        cur("SceneTransitionManager")?.loadScene("Main Menu", 0);
      });
      yield null;
      yield null;
      if (Save.Current.currentAct !== 5) return;
      const unlock = /* @__PURE__ */ __name(() => {
        const p = cur("UpgradeShop")?.shopPanelDict.get("The Machine");
        if (p) cur("ProgressionManager")?.unlockShopPanel(p, false, "");
      }, "unlock");
      if (!Save.Current.dialoguesPlayed.includes("theMachine")) cur("DialogueManager")?.queueDialogue("theMachine", false, () => {
        const p = cur("UpgradeShop")?.shopPanelDict.get("The Machine");
        if (p) cur("ProgressionManager")?.unlockShopPanel(p, true, "");
      });
      else unlock();
    }
    onDestroy() {
      cur("GlobalEvents")?.OnTicketCashedOut.remove(this._cashed);
    }
    update() {
      this.updateSecondEnding();
      if (!this.IsEnding || !this.currentSlot || this.DisableScratching) return;
      const player = cur("Player");
      player?.setState(2, false);
      const slots = this.scratchingSlots;
      const last = slots[slots.length - 1];
      const scratching = Input.getMouseButton(0);
      if (this.currentSlot === last && this.horizon) {
        const r0 = this.horizonFadeStartScratchRatio;
        const k = r0 === 1 ? 0 : Math.min(1, Math.max(0, ((this.currentSlot.ScratchPercentage ?? 0) - r0) / (1 - r0)));
        this.horizon.color = new Color(1, 1, 1, (this.horizonMinAlphaBeforeFullyScratched - 1) * k + 1);
      }
      const v = scratching ? Math.hypot(Input.mouseDelta?.x ?? 0, Input.mouseDelta?.y ?? 0) : 0;
      for (const s2 of this.shakingObjects || []) if (s2) s2.targetStrength = v;
      const ps = this.scratchParticles;
      if (ps?.gameObject.activeSelf) {
        if (scratching && !ps.isPlaying) ps.play?.();
        else if (!scratching && ps.isPlaying) ps.stop?.();
        if (scratching) ps.transform.position = new Vec3(player.MouseWorldPos.x, player.MouseWorldPos.y, ps.transform.position.z);
      }
    }
    updateSecondEnding() {
      if (!this.isWaitingForPhoneGuy) return;
      this.elapsedWaitingForPhoneGuyTime += Time.deltaTime;
      if (this.secondEndingWaitDurationSeconds <= this.elapsedWaitingForPhoneGuyTime) {
        this.isWaitingForPhoneGuy = false;
        this.startCoroutine(this.startSecondEnding());
      }
    }
    startEndingDialogue(superTicket) {
      this.superTicket = superTicket;
      cur("DialogueManager")?.queueDialogue("ending", false, () => {
        this._cashed = (t, v) => this.onTicketCashedOut(t, v);
        cur("GlobalEvents")?.OnTicketCashedOut.add(this._cashed);
        this.superTicket?.showCashOutButton(true);
        this.isWaitingForPhoneGuy = true;
      }, true);
    }
    onTicketCashedOut(ticket, amount) {
      if (ticket?.Data?.id !== "Super_" + FINAL_CHANCE_WIN_ID || amount < 0) return;
      this.isWaitingForPhoneGuy = false;
      cur("MusicManager")?.startMusic(MusicType.Prestige, 0);
      this.doShockwave();
      cur("GlobalEvents")?.OnTicketCashedOut.remove(this._cashed);
      this.startEnding();
    }
    startEnding() {
      this.IsEnding = true;
      cur("Player")?.scratching?.updateScratchAudio?.(false);
      this.finalChanceBaked?.setActive(true);
      for (const o of this.objectsToDisable || []) o?.setActive(false);
      this.currentSlotIndex = 0;
      if (this.scratchingSlots?.length) {
        this.updateSlot(this.scratchingSlots[0]);
        this.updateCursor();
      }
    }
    *startSecondEnding() {
      if (this.cityDestructionSound) cur("AudioManager")?.sfxSource?.playOneShot(this.cityDestructionSound, 1);
      yield new WaitForSeconds(this.cityDestructionSound?.length ?? 1);
      if (this.doorOpenSound) cur("AudioManager")?.sfxSource?.playOneShot(this.doorOpenSound, 1);
      const door = this.doorLightOverlay;
      if (door) {
        door.gameObject.setActive(true);
        door.fillAmount = 0;
        DOTween.to(() => door.fillAmount, (v) => {
          door.fillAmount = Math.min(1, Math.max(0, v));
        }, 1, this.doorOpenDuration);
      }
      yield new WaitForSeconds(this.doorOpenDuration + this.postDoorOpenDelay);
      if (this.knockOutSound) cur("AudioManager")?.sfxSource?.playOneShot(this.knockOutSound, 1);
      yield new WaitForSeconds(this.blackscreenDelay);
      if (this.blackscreen) {
        this.blackscreen.gameObject.setActive(true);
        this.blackscreen.color = this.blackscreen.color.withAlpha(1);
      }
      for (const o of this.objectsToDisable || []) o?.setActive(false);
      yield new WaitForSeconds((this.knockOutSound?.length ?? 0) + this.postKnockoutDelay);
      cur("PrestigeManager")?.death(true, true, false, () => {
        if (this.blackscreen) this.blackscreen.color = this.blackscreen.color.withAlpha(0);
        for (const o of this.objectsToDisable || []) o?.setActive(true);
      }, true);
      cur("AchievementManager")?.triggerAchievement?.("Faithful Servant");
    }
    updateSlot(slot) {
      this.currentSlot = slot;
      if (!slot) return;
      slot._endingHandler = (s2) => this.onSlotScratched(s2);
      slot.OnScratched.add(slot._endingHandler);
      slot.enabled = true;
    }
    onSlotScratched(slot) {
      slot.OnScratched.remove(slot._endingHandler);
      if (this.currentSlotIndex < this.scratchingSlots.length - 1) {
        this.doShockwave();
        this.currentSlotIndex++;
        this.updateCursor();
        this.startCoroutine(this.initNextSlot());
        return;
      }
      if (this.horizon) DO.fade(this.horizon, 0, this.horizonFinalFadeDuration);
      cur("MusicManager")?.fadeOutMusic(0);
      const am = cur("AudioManager");
      const c = am?.getAudioFromID("bubblePop");
      if (c) am.sfxSource?.playOneShot(c, 1);
      this.resetCursorAndScratching();
      this.currentSlot = null;
      this.startCoroutine(this.doStartCredits());
    }
    *doStartCredits() {
      yield new WaitForSeconds(this.startCreditsDelay);
      cur("MusicManager")?.startMusic(MusicType.Ending, 0);
      this.finalCredits?.gameObject.setActive(true);
      this.finalCredits?.showCreditsPanel();
      if (this.creditsScroller) {
        this.creditsScroller.OnCreditsFinished = () => this.onCreditsFinished();
        this.creditsScroller.startScrolling();
      }
    }
    *initNextSlot() {
      yield new WaitForSeconds(this.enableNextSlotDelay);
      this.updateSlot(this.scratchingSlots[this.currentSlotIndex]);
    }
    onCreditsFinished() {
      const l = Save.Current.layerOne;
      const t = Helper.formatTime ? Helper.formatTime(Math.trunc(l.timeSpentInThisPrestige)) : `${Math.floor(l.timeSpentInThisPrestige / 60)}m`;
      const s2 = (this.youveEarnedString?.getLocalizedString() ?? "You've earned {x} in {y}").replace("{x}", fmt(Save.money())).replace("{y}", t);
      if (this.finalTimeLabel) {
        this.finalTimeLabel.text = s2;
        this.finalTimeLabel.color = Color.from(this.gotAllJackpots(true) ? this.finalTimeLabelAllSuperJackpotsColor : this.gotAllJackpots(false) ? this.finalTimeLabelAllJackpotsColor : this.finalTimeLabelDefaultColor);
      }
      const cg = this.finalCanvasGroup;
      if (cg) {
        cg.alpha = 0;
        cg.gameObject.setActive(true);
        DO.fade(cg, 1, 2);
      }
      const am = cur("AchievementManager");
      if (l.timeSpentInThisPrestige <= 1800) am?.triggerAchievement?.("Speedrunner");
      if (this.gotAllJackpots(false)) am?.triggerAchievement?.("Completionist");
      if (this.gotAllJackpots(true)) am?.triggerAchievement?.("Super Completionist");
    }
    gotAllJackpots(superJackpots) {
      const l = Save.Current.layerOne;
      const tickets = Object.values(cur("StaticData").ticketData).filter((d) => d.catalog > -1 && !d.id.toLowerCase().includes("final chance") && !d.id.startsWith("Super_") && d.id !== "Loan" && d.id !== "Day Job");
      return tickets.every((d) => (superJackpots ? l.superJackpotsGotten : l.jackpotsGotten).includes(d.id));
    }
    resetCursorAndScratching() {
      const p = cur("Player");
      p?.setState(0, true);
      p?.scratching?.setScratchVolume?.(0, false);
      this.DisableScratching = true;
      const cm = cur("CursorManager");
      if (cm) {
        cm.UseOverrideCursorIcons = false;
        cm.refreshSprites();
      }
      for (const s2 of this.shakingObjects || []) if (s2) s2.targetStrength = 0;
    }
    updateCursor() {
      const cm = cur("CursorManager");
      if (!cm) return;
      cm.UseOverrideCursorIcons = true;
      cm.OverrideCursorIcon = this.cursorIcons?.[this.currentSlotIndex] ?? null;
      cm.OverrideCursorIconPressed = this.cursorIconsPressed?.[this.currentSlotIndex] ?? cm.OverrideCursorIcon;
      cm.refreshSprites();
    }
    doShockwave() {
      const sw = this.shockwaveParticles;
      const p = cur("Player")?.MouseWorldPos;
      if (sw && p) {
        sw.transform.position = new Vec3(p.x, p.y, sw.transform.position.z);
        sw.play?.();
      }
      const am = cur("AudioManager");
      const c = am?.getAudioFromID("shockwave");
      if (c) am.sfxSource?.playOneShot(c, 1);
    }
    getFinalChanceWinChance() {
      const d = cur("StaticData").getTicketData(FINAL_CHANCE_WIN_ID);
      const list = this.finalChanceWinChances;
      if (!d || !list?.length) return 0;
      const luck = cur("Player")?.scratching?.ScratchLuck ?? 0;
      const i = Helper.getMappedIndex ? Helper.getMappedIndex(list.length, luck, d.baseLuck) : Math.max(0, Math.min(list.length - 1, luck - d.baseLuck));
      return list[i] ?? 0;
    }
    checkSpawnFinalChanceWin() {
      const c = this.getFinalChanceWinChance();
      return Random.value * 1e3 < c;
    }
  };
  register2(EndingManager);

  // web/src/game/meta.js
  var ease9 = /* @__PURE__ */ __name((e) => typeof e === "number" ? EaseByIndex[e] === "Unset" ? "OutQuad" : EaseByIndex[e] : e || "OutQuad", "ease");
  var tokens = /* @__PURE__ */ __name(() => Save.Current?.tokens || 0, "tokens");
  var addTokens = /* @__PURE__ */ __name((n) => {
    Save.Current.tokens = Helper.round((Save.Current.tokens || 0) + n);
  }, "addTokens");
  var lname = /* @__PURE__ */ __name((id) => Localization.get(id + "_name") ?? id, "lname");
  var ldesc = /* @__PURE__ */ __name((id, fallback) => Localization.get(id + "_description") ?? fallback ?? "", "ldesc");
  var isDoubleClick = /* @__PURE__ */ __name((last) => Time.realtimeSinceStartup - last < (cur("Player")?.doubleClickThreshold ?? 0.3), "isDoubleClick");
  var FlyPanel = class extends MonoBehaviour {
    static {
      __name(this, "FlyPanel");
    }
    get IsActive() {
      return !!this.panel?.gameObject.activeSelf;
    }
    initPanel() {
      const p = this.panel;
      if (!p) return;
      this.startPos = { ...p.anchoredPosition };
      if (this.outsideScreenPos) p.anchoredPosition = { ...this.outsideScreenPos.anchoredPosition };
      p.gameObject.setActive(false);
      if (this.blackscreen) {
        this.blackscreen.color = this.blackscreen.color.withAlpha(0);
        this.blackscreen.raycastTarget = false;
      }
      this.backButton?.onClick.addListener(() => this.hide());
    }
    flyIn() {
      const p = this.panel;
      if (!p) return;
      p.gameObject.setActive(true);
      DOTween.kill(p);
      DO.anchorPos(p, this.startPos, this.flyInDuration).setEase(ease9(this.flyInEase));
      if (this.blackscreen) {
        this.blackscreen.raycastTarget = true;
        DO.fade(this.blackscreen, this.blackscreenAlpha, this.flyOutDuration);
      }
    }
    hide() {
      if (this.blackscreen) {
        this.blackscreen.raycastTarget = false;
        DO.fade(this.blackscreen, 0, this.flyOutDuration);
      }
      const p = this.panel;
      if (!p || !this.outsideScreenPos) return;
      DOTween.kill(p);
      DO.anchorPos(p, { ...this.outsideScreenPos.anchoredPosition }, this.flyOutDuration).setEase(ease9(this.flyOutEase)).onComplete(() => p.gameObject.setActive(false));
    }
    updateTokensLabel(bounce) {
      if (this.tokensLabel) this.tokensLabel.text = fmt(tokens());
      if (bounce && this.tokensGroup) {
        DOTween.complete(this.tokensGroup);
        DO.punchScale(this.tokensGroup, this.tokensBounceScale, this.tokensBounceDuration, 10, 1);
      }
    }
  };
  var AchievementManager = class extends MonoBehaviour {
    static {
      __name(this, "AchievementManager");
    }
    ctor() {
      this.popupQueue = [];
      this.isShowingPopup = false;
      this.idleTime = 0;
      this.moneyBeforeIdle = 0;
      this.consecutiveBrokenPlates = 0;
    }
    start() {
      const ge = cur("GlobalEvents");
      if (!ge) return;
      ge.OnJackpot.add((t) => this.onJackpot(t));
      ge.OnTicketCashedOut.add((t, v) => this.onTicketCashedOut(t, v));
      ge.OnSymbolSlotRevealed.add((s2, t) => this.onSymbolSlotRevealed(s2, t));
      ge.OnTicketTrashed.add((t) => this.onTicketTrashed(t));
      ge.OnTableItemTrashed.add((i) => this.onTableItemTrashed(i));
      ge.OnDeathByFinalChance.add(() => this.onDeathByFinalChance());
      ge.OnTableItemSpawned.add((i) => this.onTableItemSpawned(i));
      ge.OnFinalChanceScratched.add((died) => this.onFinalChanceScratched(died));
      ge.OnGameSceneLoaded.add(() => this.onGameSceneLoaded());
      ge.OnPrestigeUpgradeBought.add(() => this.onPrestigeUpgradeBought());
    }
    achievementGotten(id) {
      return Save.HasSaveFileLoaded && Save.Current.achievementsGotten.includes(id);
    }
    triggerAchievement(id) {
      const sd = cur("StaticData");
      if (!Save.Current || !sd?.achievementData || !this.getData(id)) return;
      if (Save.Current.achievementsGotten.includes(id)) return;
      Save.Current.achievementsGotten.push(id);
      this.popupQueue.push(id);
      this.checkIfAllAchievementsGotten();
    }
    getData(id) {
      const d = cur("StaticData").achievementData;
      return d[id] || Object.values(d).find((x) => x.id === id) || null;
    }
    checkIfAllAchievementsGotten() {
      if (this.achievementGotten("Achievement Hunter")) return;
      const all = Object.values(cur("StaticData").achievementData).map((x) => x.id).filter((x) => x !== "Achievement Hunter");
      if (all.every((x) => this.achievementGotten(x))) this.triggerAchievement("Achievement Hunter");
    }
    update() {
      if (!this.isShowingPopup && this.popupQueue.length) {
        this.isShowingPopup = true;
        this.showAchievementPopup(this.popupQueue.shift());
      }
      if (this.achievementGotten("Nap time") || cur("GameManager")?.IsInMainMenu || !cur("Player")) return;
      this.idleTime += Time.unscaledDeltaTime;
      const { Input: Input2 } = window.__engine || {};
      if (Input2 && (Input2.getMouseButtonDown(0) || Input2.anyKeyDown)) {
        this.idleTime = 0;
        this.moneyBeforeIdle = Save.money();
      }
      if (this.napTimeDuration < this.idleTime && Save.money() - this.moneyBeforeIdle >= 1e21) {
        this.triggerAchievement("Nap time");
        this.idleTime = 0;
      }
    }
    showAchievementPopup(id) {
      const d = this.getData(id);
      if (!d) {
        this.isShowingPopup = false;
        return;
      }
      const popup = d.smallPopup ? this.smallAchievementPopup : this.achievementPopup;
      if (popup?.descriptionLabel) popup.descriptionLabel.text = ldesc(d.id, d.description);
      if (!popup) {
        this.isShowingPopup = false;
        return;
      }
      popup.show(cur("StaticData").getSprite(d.id), lname(d.id), 0, () => this.finishedShowingPopup());
    }
    finishedShowingPopup() {
      this.isShowingPopup = false;
    }
    get HasAllTicketsAvailable() {
      if ((cur("TicketShop")?.ActiveCatalogs ?? 0) !== 4) return false;
      const g = cur("ProgressionManager")?.currentGoal;
      if (!g) return true;
      return !g.rewards.some((r) => r.type === "Ticket");
    }
    onJackpot(t) {
      if (!t?.Data) return;
      if (t.IsFirstTicketOpenedThisPrestige) this.triggerAchievement("Jackpot on First Ticket");
      if (t.Data.id === "Day Job") this.triggerAchievement("Win your job");
      if (this.HasAllTicketsAvailable && !this.achievementGotten("Winning streak") && cur("EndingManager")?.gotAllJackpots(false)) this.triggerAchievement("Winning streak");
    }
    onTicketCashedOut(t, amount) {
      if (!t?.Data) return;
      if (t.Data.id === "Loan") this.triggerAchievement("Take Loan");
      const price = t.Data.price;
      if (price > 0) {
        if (price * 1e3 < amount) this.triggerAchievement("Lucky ticket");
        if (price * 1e4 < amount) this.triggerAchievement("Big win");
        if (price * 1e5 < amount) this.triggerAchievement("High level gambling");
      }
      const m = Save.money();
      const honest = !Save.Current.layerOne.boughtScratchOff;
      if (m > 2e3 && honest) this.triggerAchievement("Honest work");
      if (m > 2e7 && honest) this.triggerAchievement("Workaholic");
    }
    onSymbolSlotRevealed(slot, t) {
      if (t?.Data?.id !== "Day Job" || !slot?.Data) return;
      if ((slot.Data.name ?? slot.Data.displayName ?? slot.Data.id) !== "Broken" && !slot.Data.id.startsWith("Broken")) {
        this.consecutiveBrokenPlates = 0;
        return;
      }
      if (++this.consecutiveBrokenPlates === 2) this.triggerAchievement("Broken Plates");
    }
    onTicketTrashed(t) {
      if (t?.Data && t.Data.id !== "Day Job" && t.getValue({ includeNonRevealed: true, updateMultLabel: false }).hasJackpot) this.triggerAchievement("Trash Jackpot");
    }
    onTableItemTrashed(item) {
      const id = item?.Data?.id?.toLowerCase();
      if (!id) return;
      if (id.includes("catalog")) this.triggerAchievement("Trash Catalog");
      else if (item.Data.id === "Loan") this.triggerAchievement("Trash Loan");
    }
    onDeathByFinalChance() {
      const s2 = Save.Current;
      s2.deathCount = (s2.deathCount || 0) + 1;
      const n = s2.deathCount;
      if (n >= 1) this.triggerAchievement("Death_1");
      if (n >= 2) this.triggerAchievement("Death_2");
      if (n >= 3) this.triggerAchievement("Death_3");
      if (n >= 4) this.triggerAchievement("Death_4");
    }
    onTableItemSpawned() {
      if (this.achievementGotten("One of each please")) return;
      const onTable = new Set(cur("Player")?.TableItems.map((t) => t.Data?.id));
      const all = Object.values(cur("StaticData").ticketData).filter((d) => d.catalog > 0 && !isFinalChanceTicket(d.id) && !d.id.startsWith("Super_") && d.id !== "Loan");
      if (all.length && all.every((d) => onTable.has(d.id))) this.triggerAchievement("One of each please");
    }
    onFinalChanceScratched(died) {
      if (!died) this.triggerAchievement("Scratch Final Chance Without Dying");
      if (cur("Player")?.TableItems.some((t) => /act \d catalog/i.test(t.Data?.id || ""))) this.triggerAchievement("Skip a catalogue");
    }
    onGameSceneLoaded() {
      const pm = cur("PerkManager");
      if (!pm) return;
      if ([8, 33, 34, 36, 46].every((t) => pm.tryGetActivePerk(t))) this.triggerAchievement("Idle game");
    }
    onPrestigeUpgradeBought() {
      const panels = cur("PrestigePanel")?.UpgradePanels || [];
      if (panels.length && panels.filter((p) => p.Data).every((p) => p.IsMaxed)) this.triggerAchievement("Max out skill tree");
    }
  };
  register2(AchievementManager);
  var BadgePanel = class extends MonoBehaviour {
    static {
      __name(this, "BadgePanel");
    }
    ctor() {
      this.Data = null;
      this.NotAvailable = false;
      this.OnPressed = new Action();
    }
    start() {
      this.button?.onClick.addListener(() => this.OnPressed.invoke(this));
    }
    updateData(d) {
      this.Data = d;
      const sd = cur("StaticData");
      if (this.NotAvailable) {
        this.achievedIcon = this.unachievedIcon = sd.getSprite("notAvailableAchievementIcon");
      } else {
        this.achievedIcon = sd.getSprite(d.id);
        this.unachievedIcon = sd.hasSprite(d.id + "_unachieved") ? sd.getSprite(d.id + "_unachieved") : this.achievedIcon;
      }
      this.updateState();
    }
    get Gotten() {
      return !!this.Data && Save.Current.achievementsGotten.includes(this.Data.id);
    }
    get Claimed() {
      return !!this.Data && Save.Current.achievementsClaimed.includes(this.Data.id);
    }
    updateState() {
      if (this.icon) this.icon.sprite = this.Gotten && !this.NotAvailable ? this.achievedIcon : this.unachievedIcon;
      this.notificationIcon?.gameObject.setActive(this.Gotten && !this.NotAvailable && !this.Claimed);
    }
    setSelected(s2) {
      this.outline?.gameObject.setActive(s2);
    }
  };
  register2(BadgePanel);
  var BadgeInfoPanel = class extends MonoBehaviour {
    static {
      __name(this, "BadgeInfoPanel");
    }
    updateInfo(d, notAvailable, iconSprite) {
      const show = !notAvailable;
      this.titleLabel?.gameObject.setActive(show);
      this.rewardLabel?.gameObject.setActive(show);
      if (this.icon) this.icon.sprite = iconSprite;
      if (notAvailable) {
        if (this.descriptionLabel) this.descriptionLabel.text = this.notAvailableInDemoString?.getLocalizedString() ?? "";
        this.button?.gameObject.setActive(false);
        this.claimedLabel?.gameObject.setActive(false);
        return;
      }
      if (this.titleLabel) this.titleLabel.text = lname(d.id);
      if (this.descriptionLabel) this.descriptionLabel.text = ldesc(d.id, d.description);
      if (this.rewardLabel) this.rewardLabel.text = `${this.rewardString?.getLocalizedString() ?? "Reward:"} ${fmt(d.tokens)}`;
      const got = Save.Current.achievementsGotten.includes(d.id), claimed = Save.Current.achievementsClaimed.includes(d.id);
      this.button?.gameObject.setActive(got && !claimed);
      this.claimedLabel?.gameObject.setActive(claimed);
    }
  };
  register2(BadgeInfoPanel);
  var BadgeCollection = class extends FlyPanel {
    static {
      __name(this, "BadgeCollection");
    }
    ctor() {
      this.badgePanels = [];
      this.selectedPanel = null;
      this.lastPanelPress = -1;
    }
    start() {
      this.initPanel();
      const list = Object.values(cur("StaticData").achievementData);
      for (const d of list) this.spawnBadgePanel(d, false);
      if (cur("BuildModeManager")?.Mode === 1) for (let i = 0; i < (this.notAvailableInDemoPanelCount || 0); i++) this.spawnBadgePanel(list[0], true);
      this.infoPanel?.button?.onClick.addListener(() => this.claimReward());
      this.infoPanel?.gameObject.setActive(false);
    }
    spawnBadgePanel(d, notAvailable) {
      const p = Game.instantiate(this.badgePanelPrefab, this.badgePanelParent);
      if (!p) return;
      p.NotAvailable = notAvailable;
      p.updateData(d);
      p.OnPressed.add((x) => this.onPanelPressed(x));
      this.badgePanels.push(p);
    }
    show() {
      this.flyIn();
      for (const p of this.badgePanels) {
        p.updateState();
        p.setSelected(false);
      }
      this.selectedPanel = null;
      this.infoPanel?.gameObject.setActive(false);
      this.updateTokensLabel(false);
    }
    onPanelPressed(p) {
      if (p === this.selectedPanel && isDoubleClick(this.lastPanelPress) && this.infoPanel?.button?.gameObject.activeSelf) {
        this.claimReward();
        this.lastPanelPress = Time.realtimeSinceStartup;
        return;
      }
      for (const x of this.badgePanels) x.setSelected(x === p);
      this.selectedPanel = p;
      this.lastPanelPress = Time.realtimeSinceStartup;
      this.infoPanel?.gameObject.setActive(true);
      this.infoPanel?.updateInfo(p.Data, p.NotAvailable, p.icon?.sprite);
    }
    claimReward() {
      const p = this.selectedPanel;
      if (!p?.Data) return;
      if (!Save.Current.achievementsClaimed.includes(p.Data.id)) Save.Current.achievementsClaimed.push(p.Data.id);
      this.lastPanelPress = -1;
      this.onPanelPressed(p);
      const am = cur("AudioManager");
      const c = am?.getAudioFromID("cashOut");
      if (c) am.sfxSource?.playOneShot(c, 1);
      p.updateState();
      if (p.Data.tokens > 0) addTokens(p.Data.tokens);
      this.updateTokensLabel(true);
      if (this.infoPanel?.button) {
        DOTween.complete(this.infoPanel.button.transform);
        DO.punchScale(this.infoPanel.button.transform, this.buttonBounceScale, this.buttonBounceDuration, 10, 1);
      }
      cur("SaveManager")?.save();
    }
  };
  register2(BadgeCollection);
  var cosmeticType = /* @__PURE__ */ __name((c) => (c?.id?.split("_")[1] || "").toLowerCase(), "cosmeticType");
  var cosmeticSkin = /* @__PURE__ */ __name((c) => c?.id?.split("_")[0] || "", "cosmeticSkin");
  var dlcUnlocked = /* @__PURE__ */ __name((c) => !c?.dlc || !!cur("DLCManager")?.isDLCUnlocked?.(c.dlc), "dlcUnlocked");
  var getCosmetic = /* @__PURE__ */ __name((id) => {
    const d = cur("StaticData").cosmeticData;
    return d[id] || Object.values(d).find((x) => x.id === id) || null;
  }, "getCosmetic");
  var equippedOfType = /* @__PURE__ */ __name((type) => (Save.Current?.equippedCosmetics || []).map(getCosmetic).find((c) => c && cosmeticType(c) === type.toLowerCase()) || null, "equippedOfType");
  var CosmeticManager = class extends MonoBehaviour {
    static {
      __name(this, "CosmeticManager");
    }
    ctor() {
      this.OnCosmeticsUpdated = new Action();
    }
    start() {
      for (const id of [...Save.Current?.equippedCosmetics || []]) {
        const c = getCosmetic(id);
        if (c && !dlcUnlocked(c)) this.unequipCosmetic(c);
      }
      this.checkCosmeticsUnlocked();
    }
    equipCosmetic(c) {
      const eq = Save.Current.equippedCosmetics;
      if (!c || eq.includes(c.id)) return;
      for (const id of [...eq]) {
        const o = getCosmetic(id);
        if (o && cosmeticType(o) === cosmeticType(c)) this.unequipCosmetic(o);
      }
      eq.push(c.id);
      cur("NightMarket")?.updatePanelsState();
      this.OnCosmeticsUpdated.invoke();
    }
    unequipCosmetic(c) {
      const eq = Save.Current.equippedCosmetics;
      const i = eq.indexOf(c?.id);
      if (i < 0) return;
      eq.splice(i, 1);
      this.OnCosmeticsUpdated.invoke();
    }
    checkCosmeticsUnlocked() {
      for (const c of Object.values(cur("StaticData").cosmeticData)) {
        const cond = c.unlockCondition;
        if (!cond) continue;
        if (cur("StaticData").ticketData[cond]) {
          const p = Save.Current.layerOne.ticketProgressionDict?.[cond];
          if (p && p.level >= (cur("PerkManager")?.getTicketMaxLevel?.(cond) ?? Infinity)) this.unlockCosmetic(c);
        } else if (Save.Current.completedChallenges.includes(cond)) this.unlockCosmetic(c);
      }
    }
    unlockCosmetic(c) {
      const u = Save.Current.unlockedCosmetics;
      if (!u.includes(c.id)) u.push(c.id);
    }
    resetAll() {
      Save.Current.equippedCosmetics.length = 0;
      this.OnCosmeticsUpdated.invoke();
    }
  };
  register2(CosmeticManager);
  var CosmeticSpriteUpdater = class extends MonoBehaviour {
    static {
      __name(this, "CosmeticSpriteUpdater");
    }
    awake() {
      this.defaultSprite = this.getSpriteNow();
    }
    start() {
      this._f = () => this.onCosmeticsUpdated();
      cur("CosmeticManager")?.OnCosmeticsUpdated.add(this._f);
      this.onCosmeticsUpdated();
    }
    onDestroy() {
      cur("CosmeticManager")?.OnCosmeticsUpdated.remove(this._f);
    }
    getSpriteNow() {
      return this.spriteRenderer ? this.spriteRenderer.sprite : this.image?.sprite;
    }
    updateData(customID) {
      this.customID = customID;
      this.defaultSprite = this.getSpriteNow();
      this.onCosmeticsUpdated();
    }
    tryGetSkinSprite(c) {
      const key = this.customID ? `${cosmeticSkin(c)}_${this.customID}` : `${c.id}_${this.spriteID}`;
      const sd = cur("StaticData");
      return sd.hasSprite(key) ? sd.getSprite(key) : null;
    }
    onCosmeticsUpdated() {
      const c = equippedOfType(this.cosmeticType || "");
      this.setSprite(c && this.tryGetSkinSprite(c) || this.defaultSprite);
    }
    setSprite(s2) {
      if (this.spriteRenderer) this.spriteRenderer.sprite = s2;
      if (this.image) this.image.sprite = s2;
    }
  };
  register2(CosmeticSpriteUpdater);
  var CosmeticAnimationUpdater = class extends MonoBehaviour {
    static {
      __name(this, "CosmeticAnimationUpdater");
    }
    awake() {
      this.defaultController = this.animator?.runtimeAnimatorController;
    }
    start() {
      this._f = () => this.onCosmeticsUpdated();
      cur("CosmeticManager")?.OnCosmeticsUpdated.add(this._f);
      this.onCosmeticsUpdated();
    }
    onDestroy() {
      cur("CosmeticManager")?.OnCosmeticsUpdated.remove(this._f);
    }
    updateData(customID) {
      this.customID = customID;
      this.defaultController = this.animator?.runtimeAnimatorController;
      this.onCosmeticsUpdated();
    }
    onCosmeticsUpdated() {
      if (!this.animator) return;
      const c = equippedOfType(this.cosmeticType || "");
      let ctrl = null;
      if (c) {
        let key = `${c.id}_${this.animationID}`;
        if (this.customID) key += "_" + this.customID;
        ctrl = cur("StaticData").getAnimatorController(key);
      }
      const want = ctrl || this.defaultController;
      if (want && this.animator.runtimeAnimatorController !== want) {
        const sp = this.animator.speed;
        this.animator.runtimeAnimatorController = want;
        this.animator.speed = sp;
      }
    }
  };
  register2(CosmeticAnimationUpdater);
  var NightMarketPanel = class extends MonoBehaviour {
    static {
      __name(this, "NightMarketPanel");
    }
    ctor() {
      this.Data = null;
      this.NotAvailable = false;
      this.OnPressed = new Action();
    }
    start() {
      this.button?.onClick.addListener(() => this.OnPressed.invoke(this));
    }
    get Bought() {
      return !!this.Data && Save.Current.boughtCosmetics.includes(this.Data.id);
    }
    get Equipped() {
      return !!this.Data && Save.Current.equippedCosmetics.includes(this.Data.id);
    }
    get Unlocked() {
      const c = this.Data;
      return !!c && (!c.unlockCondition || Save.Current.unlockedCosmetics.includes(c.id)) && dlcUnlocked(c);
    }
    updateData(d) {
      this.Data = d;
      this.updateState();
    }
    updateState() {
      const unlocked = !this.NotAvailable && this.Unlocked;
      if (this.icon) this.icon.sprite = unlocked ? cur("StaticData").getSprite(this.Data.id) : this.lockSprite;
      if (this.bg) this.bg.color = unlocked ? new Color(1, 1, 1, 1) : Color.from(this.notUnlockedColor);
      this.equippedIcon?.gameObject.setActive(this.Bought);
      if (this.equippedIcon) this.equippedIcon.sprite = this.Equipped ? this.equippedSprite : this.unequippedSprite;
      this.notificationIcon?.gameObject.setActive(false);
    }
    setSelected(s2) {
      this.outline?.gameObject.setActive(s2);
    }
  };
  register2(NightMarketPanel);
  var NightMarketInfoPanel = class extends MonoBehaviour {
    static {
      __name(this, "NightMarketInfoPanel");
    }
    updateInfo(c, notAvailable, iconSprite) {
      this.currentData = c;
      const unlocked = !notAvailable && (!c.unlockCondition || Save.Current.unlockedCosmetics.includes(c.id)) && dlcUnlocked(c);
      this.titleLabel?.gameObject.setActive(!notAvailable);
      this.priceLabel?.gameObject.setActive(unlocked && !Save.Current.boughtCosmetics.includes(c.id));
      this.button?.gameObject.setActive(unlocked);
      if (this.icon) this.icon.sprite = iconSprite;
      if (notAvailable) {
        if (this.descriptionLabel) this.descriptionLabel.text = this.notAvailableInDemoString?.getLocalizedString() ?? "";
        return;
      }
      if (this.titleLabel) this.titleLabel.text = lname(c.id) === c.id ? c.displayName : lname(c.id);
      if (this.descriptionLabel) this.descriptionLabel.text = unlocked ? "" : Localization.get(c.id + "_unlockDescription") ?? c.unlockDescription ?? (c.dlc ? "DLC" : "");
      if (this.priceLabel) {
        const p = (this.priceString?.getLocalizedString() ?? "{x}").replace("{x}", fmt(c.price));
        this.priceLabel.text = tokens() < c.price ? `<color=#FF3948>${p}</color>` : p;
      }
      this.updateButtonLabel();
    }
    updateButtonLabel() {
      const c = this.currentData;
      if (!c || !this.buttonLabel) return;
      const s2 = Save.Current;
      this.buttonLabel.text = !s2.boughtCosmetics.includes(c.id) ? this.buyButtonString?.getLocalizedString() ?? "Buy" : s2.equippedCosmetics.includes(c.id) ? this.unequipButtonString?.getLocalizedString() ?? "Unequip" : this.equipButtonString?.getLocalizedString() ?? "Equip";
    }
  };
  register2(NightMarketInfoPanel);
  var NightMarket = class extends FlyPanel {
    static {
      __name(this, "NightMarket");
    }
    ctor() {
      this.nightMarketPanels = [];
      this.SelectedPanel = null;
      this.lastPanelPress = -1;
    }
    start() {
      this.initPanel();
      const list = Object.values(cur("StaticData").cosmeticData);
      for (const c of list) this.spawnNightMarketPanel(c, false);
      if (cur("BuildModeManager")?.Mode === 1) for (let i = 0; i < (this.notAvailableInDemoPanelCount || 0); i++) this.spawnNightMarketPanel(list[0], true);
      this.openPanelButton?.onClick.addListener(() => this.show());
      this.respecTokensButton?.OnAction.add(() => this.respecTokens());
      this.infoPanel?.button?.onClick.addListener(() => this.onInfoPanelButtonClicked());
      this.infoPanel?.gameObject.setActive(false);
      this.updateOpenPanelButton();
      cur("PerkManager") && cur("GlobalEvents")?.OnPrestigeUpgradeBought.add(() => this.updateOpenPanelButton());
    }
    spawnNightMarketPanel(c, notAvailable) {
      const p = Game.instantiate(this.NightMarketPanelPrefab, this.NightMarketPanelParent);
      if (!p) return;
      p.NotAvailable = notAvailable;
      p.updateData(c);
      p.OnPressed.add((x) => this.onPanelPressed(x));
      this.nightMarketPanels.push(p);
    }
    show() {
      this.flyIn();
      for (const p of this.nightMarketPanels) {
        p.gameObject.setActive(!p.Data?.dlc || dlcUnlocked(p.Data));
        p.updateState();
        p.setSelected(false);
      }
      this.SelectedPanel = null;
      this.infoPanel?.gameObject.setActive(false);
      this.updateTokensLabel(false);
      this.checkIfAllCosmeticsBought();
    }
    onPanelPressed(p) {
      if (p === this.SelectedPanel && isDoubleClick(this.lastPanelPress) && this.infoPanel?.button?.gameObject.activeSelf) {
        this.onInfoPanelButtonClicked();
        this.lastPanelPress = Time.realtimeSinceStartup;
        return;
      }
      for (const x of this.nightMarketPanels) x.setSelected(x === p);
      this.SelectedPanel = p;
      this.lastPanelPress = Time.realtimeSinceStartup;
      this.infoPanel?.gameObject.setActive(true);
      this.infoPanel?.updateInfo(p.Data, p.NotAvailable, p.icon?.sprite);
    }
    onInfoPanelButtonClicked() {
      const p = this.SelectedPanel;
      const c = p?.Data;
      if (!c) return;
      const s2 = Save.Current;
      const am = cur("AudioManager");
      const cm = cur("CosmeticManager");
      if (!s2.boughtCosmetics.includes(c.id)) {
        if (tokens() < c.price) {
          am?.playSound("error", 1);
          this.updateTokensLabel(true);
          return;
        }
        s2.tokens = Helper.round(tokens() - c.price);
        s2.boughtCosmetics.push(c.id);
        am?.playSound("buy", 0.7);
        this.updateTokensLabel(true);
        cm?.equipCosmetic(c);
        cur("AchievementManager")?.triggerAchievement("Visit the Night Market");
        this.checkIfAllCosmeticsBought();
      } else {
        am?.playSound("buttonClick", 0.7);
        if (s2.equippedCosmetics.includes(c.id)) cm?.unequipCosmetic(c);
        else cm?.equipCosmetic(c);
      }
      this.updatePanelsState();
      this.infoPanel?.updateInfo(c, p.NotAvailable, p.icon?.sprite);
      cur("SaveManager")?.save();
    }
    checkIfAllCosmeticsBought() {
      const buyable = this.nightMarketPanels.filter((p) => !p.NotAvailable && p.Data && !p.Data.dlc);
      if (buyable.length && buyable.every((p) => p.Bought)) cur("AchievementManager")?.triggerAchievement("Walk-in-closet");
    }
    updateOpenPanelButton() {
      const perk = (Save.Current?.boughtPrestigeUpgrades?.["Night Market"] ?? 0) > 0;
      this.openPanelButton?.gameObject.setActive(perk);
    }
    updatePanelsState() {
      for (const p of this.nightMarketPanels) p.updateState();
    }
    respecTokens() {
      const s2 = Save.Current;
      const refund = s2.boughtCosmetics.reduce((a, id) => a + (getCosmetic(id)?.price || 0), 0);
      cur("CosmeticManager")?.resetAll();
      s2.boughtCosmetics.length = 0;
      s2.tokens = Helper.round(tokens() + refund);
      cur("SaveManager")?.save();
      this.updatePanelsState();
      this.updateTokensLabel(true);
      if (this.SelectedPanel) this.infoPanel?.updateInfo(this.SelectedPanel.Data, this.SelectedPanel.NotAvailable, this.SelectedPanel.icon?.sprite);
    }
  };
  register2(NightMarket);

  // web/src/game/misc_ui.js
  var AutoBuyerSubPanel = class extends MonoBehaviour {
    static {
      __name(this, "AutoBuyerSubPanel");
    }
    ctor() {
      this.TicketData = null;
      this.OnClicked = new Action();
    }
    awake() {
      this.button?.onClick.addListener(() => this.OnClicked.invoke(this));
    }
    updateData(td) {
      this.TicketData = td || null;
      const sd = cur("StaticData");
      let s2 = null;
      if (!td) s2 = cur("SubscriptionBot")?.noTicketSprite;
      else {
        const id = TicketDataUtil.getSharedID(td.id);
        s2 = sd.hasSprite(id + "_Small") ? sd.getSprite(id + "_Small") : sd.getSprite(id);
      }
      if (this.ticketImage) this.ticketImage.sprite = s2;
    }
  };
  register2(AutoBuyerSubPanel);
  var AutoBuyerUI = class extends MonoBehaviour {
    static {
      __name(this, "AutoBuyerUI");
    }
    ctor() {
      this.subPanels = [];
      this.firstPanel = null;
    }
    get IsActive() {
      return !!this.panel?.activeSelf;
    }
    start() {
      this.initUI();
    }
    initUI() {
      this.firstPanel = this.spawnSubPanel(null, true);
      const ts = cur("TicketShop");
      for (const p of ts?.shopPanelList || []) {
        const td = p.Data ? cur("StaticData").getTicketData(p.Data.id) : null;
        if (td) this.spawnSubPanel(td, !p.IsLocked);
      }
    }
    spawnSubPanel(td, show) {
      const p = Game.instantiate(this.subPanelPrefab, this.subPanelParent);
      if (!p) return null;
      p.updateData(td);
      p.gameObject.setActive(show);
      p.OnClicked.add((x) => this.onSubPanelClicked(x));
      this.subPanels.push(p);
      return p;
    }
    refresh() {
      const ts = cur("TicketShop");
      for (const p of this.subPanels) {
        if (p === this.firstPanel) continue;
        const sp = p.TicketData ? ts?.shopPanelDict.get(p.TicketData.id) : null;
        p.gameObject.setActive(!!sp && !sp.IsLocked && !p.TicketData.id.toLowerCase().includes("final chance"));
      }
    }
    show() {
      this.refresh();
      this.animatedPanel?.show();
    }
    hide() {
      this.animatedPanel?.hide();
    }
    onSubPanelClicked(p) {
      cur("SubscriptionBot")?.setCurrentTicket(p.TicketData);
      this.hide();
    }
  };
  register2(AutoBuyerUI);
  var WristProtectionPopup = class extends MonoBehaviour {
    static {
      __name(this, "WristProtectionPopup");
    }
    ctor() {
      this.PopupActive = false;
    }
    start() {
      this.classicButton?.onClick.addListener(() => this.setMode(0));
      this.hoverButton?.onClick.addListener(() => this.setMode(1));
      this.clickAndHoldButton?.onClick.addListener(() => this.setMode(2));
    }
    show() {
      this.PopupActive = true;
      this.popup?.show(null);
      PlayerPrefs.setInt("WristProtectionPopupShown", 1);
    }
    setMode(m) {
      cur("WristProtectionManager")?.setMode(m);
      this.popup?.hide();
      this.PopupActive = false;
      cur("OnboardingManager")?.updateState();
    }
  };
  register2(WristProtectionPopup);
  var RatePopup = class extends MonoBehaviour {
    static {
      __name(this, "RatePopup");
    }
    awake() {
      this.panel?.setActive(false);
      this.continueButton?.onClick.addListener(() => this.hide());
      this.rateButton?.onClick.addListener(() => this.hide());
    }
    hide() {
      this.panel?.setActive(false);
    }
  };
  register2(RatePopup);
  var SaveConflictPopup = class extends MonoBehaviour {
    static {
      __name(this, "SaveConflictPopup");
    }
    awake() {
      this.panel?.setActive(false);
      this.inputblocker?.setActive(false);
    }
  };
  register2(SaveConflictPopup);
  var Catalog = class extends MonoBehaviour {
    static {
      __name(this, "Catalog");
    }
    containsFinalChance(act) {
      return Save.Current.currentAct === act || (cur("PrestigeManager")?.MAX_ACT ?? 5) - 1 <= act;
    }
    start() {
      const full = this.containsFinalChance(this.act);
      if (!this.bgImage) return;
      this.bgImage.sprite = full ? this.defaultSprite : this.shortSprite;
      const rt = this.bgImage.transform;
      rt.sizeDelta = { x: rt.sizeDelta.x, y: full ? this.height : this.shortHeight };
    }
  };
  register2(Catalog);
  var GodRay = class extends MonoBehaviour {
    static {
      __name(this, "GodRay");
    }
    awake() {
      this.endScale = this.transform.localScale.clone();
    }
    update() {
      const k = (this.speedMultiplier ?? 1) * Time.deltaTime;
      (this.layers || []).forEach((l, i) => {
        if (l) l.transform.localEulerZ += (this.layerSpeeds?.[i] ?? 0) * k;
      });
      (this.imageLayers || []).forEach((l, i) => {
        if (l) l.transform.localEulerZ += (this.layerSpeeds?.[i] ?? 0) * Time.unscaledDeltaTime * (this.speedMultiplier ?? 1);
      });
    }
  };
  register2(GodRay);
  var AnimationEvent = class extends MonoBehaviour {
    static {
      __name(this, "AnimationEvent");
    }
    onAnimationEvent() {
      this.onEvent?.invoke();
    }
  };
  register2(AnimationEvent);
  var AutoScrolling = class extends MonoBehaviour {
    static {
      __name(this, "AutoScrolling");
    }
    ctor() {
      this.ScrollSpeedMultiplier = 1;
      this.OnFinishedScrolling = null;
      this.stopScrolling = true;
      this.currentScrollSpeed = 0;
      this.endOfScroll = false;
    }
    start() {
      this.setDefaultScrollValue();
    }
    onEnable() {
      this.setDefaultScrollValue();
      this.startScrolling();
    }
    setDefaultScrollValue() {
      if (this.scroll) this.scroll.verticalNormalizedPosition = this.verticalMoveDirection < 0 ? 1 : 0;
      this.endOfScroll = false;
    }
    startScrolling() {
      this.stopScrolling = false;
      this.targetScrollSpeed = this.scrollSpeed;
    }
    stopScrollingNow() {
      this.stopScrolling = true;
    }
    update() {
      const sr = this.scroll;
      if (!sr?.content) return;
      if (Input.mouseScrollDelta.y && !this.finalCutscene) {
        this.stopScrolling = true;
        this._resume = Time.time + (this.timeBeforeGoingToAutoScrolling || 3);
      }
      if (this.stopScrolling && this._resume && Time.time > this._resume) {
        this._resume = 0;
        this.startScrolling();
      }
      if (this.stopScrolling || this.endOfScroll) return;
      const fast = Input.getMouseButton(0) || Input.getKey("space");
      const target = this.scrollSpeed * this.ScrollSpeedMultiplier * (fast ? this.fastScrollSpeedMult || 1 : 1);
      this.currentScrollSpeed += (target - this.currentScrollSpeed) * Math.min(1, Time.deltaTime / Math.max(1e-3, this.accelerationTime || 1e-3));
      const h = Math.max(1, sr.content.rect.height - sr.viewRect.rect.height);
      const dir = this.verticalMoveDirection || -1;
      const v = Math.min(1, Math.max(0, sr.verticalNormalizedPosition + dir * this.currentScrollSpeed * Time.deltaTime / h));
      sr.verticalNormalizedPosition = v;
      if (dir < 0 && v <= 0 || dir > 0 && v >= 1) {
        this.endOfScroll = true;
        this.OnFinishedScrolling?.();
      }
    }
  };
  register2(AutoScrolling);
  var UIFoldout = class extends MonoBehaviour {
    static {
      __name(this, "UIFoldout");
    }
  };
  register2(UIFoldout);
  var LocalizeSpriteEvent = class extends MonoBehaviour {
    static {
      __name(this, "LocalizeSpriteEvent");
    }
    awake() {
      this.target = this.getComponent("Image") || this.getComponent("SpriteRenderer");
      this.defaultSprite = this.target?.sprite;
      this._f = () => this.refresh();
      Localization.listeners.add(this._f);
      this.refresh();
    }
    onDestroy() {
      Localization.listeners.delete(this._f);
    }
    refresh() {
      if (!this.target) return;
      const sc = Localization.code === "zh-hans" ? Assets.spriteByName.get("SCRITCHY_logo_SC") : null;
      this.target.sprite = sc || this.defaultSprite;
    }
  };
  register2(LocalizeSpriteEvent);
  var CJK = /* @__PURE__ */ new Set(["ja", "ko", "zh-hans", "ru"]);
  var LocalizationManager = class extends MonoBehaviour {
    static {
      __name(this, "LocalizationManager");
    }
    ctor() {
      this.OnLocaleChanged = new Action();
    }
    start() {
      this._f = () => this.OnLocaleChanged.invoke();
      Localization.listeners.add(this._f);
    }
    onDestroy() {
      Localization.listeners.delete(this._f);
    }
    get LanguageCode() {
      return Localization.code || "en";
    }
    setLocale(code) {
      Localization.setLocale(code);
    }
    getString(entry) {
      return Localization.get(entry) ?? entry;
    }
    getName(id) {
      return Localization.get(id + "_name") ?? id;
    }
    getDescription(id) {
      return Localization.get(id + "_description") ?? "";
    }
    getUnlockDescription(id) {
      return Localization.get(id + "_unlockDescription") ?? "";
    }
    getRewardDescription(id) {
      return Localization.get(id + "_rewardDescription") ?? "";
    }
    // the pixel fonts only cover Latin; other scripts switch to Noto with a size/margin correction
    getFontForLocale(code, useBold, originalFont) {
      if (!CJK.has(code)) return null;
      const m = (this.fontMappings || []).find((e) => !originalFont || e.original === originalFont) || this.fontMappings?.[0];
      if (!m) return null;
      return { font: m.fallback, sizeMult: m.sizeScaling || 1, topMargin: m.topMargin };
    }
  };
  register2(LocalizationManager);
  for (const n of ["HapticSource", "HapticsFromAudioSource"]) {
    const C = class extends MonoBehaviour {
      static {
        __name(this, "C");
      }
    };
    Object.defineProperty(C, "name", { value: n });
    register2(C, n);
  }

  // web/src/game/index.js
  async function boot() {
    const params = new URLSearchParams(location.search);
    const scene = params.get("scene");
    Game.loadScene("Persistent", true);
    Game.loadScene(scene || "Main Menu", true);
    window.Game = Game;
    window.Save = Save;
  }
  __name(boot, "boot");

  // web/src/main.js
  window.__engine = { Input, EventSystem, Renderer, DOTween, Time, Camera };
  var canvas = document.getElementById("game");
  var bar = document.getElementById("bar");
  var status = document.getElementById("status");
  async function main() {
    Renderer.init(canvas);
    Input.init(canvas);
    AudioEngine.init();
    Game.init();
    try {
      await Assets.init((p) => {
        bar.style.width = `${Math.round(p * 100)}%`;
      });
    } catch (e) {
      status.textContent = "Could not load game data. Run tools/build_all.sh first (see README).";
      console.error(e);
      return;
    }
    const keyids = await Assets.json("loc/keyids.json");
    const keyByRounded = new Map(Object.entries(keyids).map(([k, v]) => [String(Number(k)), v]));
    LocalizedString.keyById = (id) => keyids[String(id)] || keyByRounded.get(String(Number(id))) || null;
    await Localization.init();
    await loadScriptables();
    document.getElementById("loader").remove();
    await boot();
    let last = performance.now();
    const frame = /* @__PURE__ */ __name((now) => {
      const dt = (now - last) / 1e3;
      last = now;
      requestAnimationFrame(frame);
      try {
        Input.beginFrame();
        Game.frameHooks.preUpdate.length || Game.frameHooks.preUpdate.push(() => {
          try {
            EventSystem.update();
          } catch (e) {
            console.error("EventSystem", e);
          }
        });
        Game.step(dt);
        try {
          DOTween.tick();
        } catch (e) {
          console.error("DOTween", e);
        }
        Renderer.render();
      } catch (e) {
        console.error("frame", e);
      }
      Input.endFrame();
    }, "frame");
    requestAnimationFrame(frame);
  }
  __name(main, "main");
  main();
})();
