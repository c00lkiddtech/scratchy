// Serves fetch('gamedata/...') and <img src="gamedata/..."> from data/*.js so the game runs from file://
(() => {
  const got = new Map(), waiting = new Map();
  window.__sd = (p, v) => { got.set(p, v); const w = waiting.get(p); if (w) { waiting.delete(p); for (const f of w) f.res(v); } };
  const load = (p) => {
    if (got.has(p)) return Promise.resolve(got.get(p));
    return new Promise((res, rej) => {
      if (waiting.has(p)) { waiting.get(p).push({ res, rej }); return; }
      waiting.set(p, [{ res, rej }]);
      const s = document.createElement('script');
      s.src = 'data/' + p.slice('gamedata/'.length).split('/').map(encodeURIComponent).join('/') + '.js';
      s.onload = () => s.remove();
      s.onerror = () => { s.remove(); const w = waiting.get(p) || []; waiting.delete(p); for (const f of w) f.rej(new Error('missing ' + p)); };
      document.head.appendChild(s);
    });
  };
  // binary payloads are data: URIs; drop them once used (images and decoded audio are cached by the game)
  const take = (p, v) => { if (typeof v === 'string' && v.startsWith('data:')) got.delete(p); return v; };
  const realFetch = window.fetch.bind(window);
  window.fetch = (url, opts) => {
    const p = typeof url === 'string' ? url : url?.url;
    if (!p || !p.startsWith('gamedata/')) return realFetch(url, opts);
    return load(p).then((v) => {
      v = take(p, v);
      if (v.startsWith('data:')) {
        const bin = atob(v.slice(v.indexOf(',') + 1)); const b = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i);
        return new Response(b.buffer, { status: 200 });
      }
      return new Response(v, { status: 200, headers: { 'Content-Type': 'application/json' } });
    }, () => new Response('', { status: 404 }));
  };
  const src = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
  Object.defineProperty(HTMLImageElement.prototype, 'src', {
    get() { return src.get.call(this); },
    set(v) {
      if (typeof v !== 'string' || !v.startsWith('gamedata/')) return src.set.call(this, v);
      load(v).then((d) => src.set.call(this, take(v, d)), () => this.dispatchEvent(new Event('error')));
    },
  });
})();
