export default {
  async fetch(request) {
    if (request.method !== "GET" && request.method !== "HEAD") return new Response("Method not allowed", {status:405});
    const url = new URL(request.url);
    let path = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
    const allowed = new Set([
      "/index.html", "/styles.css", "/app.js",
      "/assets/avatar-1.png",
      "/assets/destination-bali.png",
      "/assets/destination-mykines.png",
      "/assets/destination-swiss.png",
      "/assets/destination-uludag.png",
      "/assets/fun-photo.png",
      "/assets/hero-base.png",
      "/assets/hero-mid.png",
      "/assets/hero-top.png",
      "/assets/journey-milan.png",
      "/assets/journey-rome.png",
      "/assets/journey-tiga-warna.png"
    ]);
    if (!allowed.has(path)) return new Response("Not found", {status:404});
    const upstreamUrl = "https://raw.githubusercontent.com/aviyansah-kly/Portfolio/go-travel-html-demo/go-travel-demo" + path;
    const upstream = await fetch(upstreamUrl, {cf:{cacheTtl:120,cacheEverything:true}});
    if (!upstream.ok) return new Response("Static asset unavailable", {status:upstream.status});
    const ext = path.split(".").pop();
    const types = {html:"text/html; charset=utf-8",css:"text/css; charset=utf-8",js:"text/javascript; charset=utf-8",png:"image/png"};
    // Never forward GitHub Raw's 'sandbox' CSP or content-disposition headers:
    // they prevent HTML served on this Worker from loading its own assets.
    const headers = new Headers({
      "content-type": types[ext] || "application/octet-stream",
      "cache-control": ext === "html" ? "public, max-age=30" : "public, max-age=120",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "x-frame-options": "SAMEORIGIN",
      "content-security-policy": "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'"
    });
    return new Response(request.method === "HEAD" ? null : upstream.body,{status:upstream.status,headers});
  }
};