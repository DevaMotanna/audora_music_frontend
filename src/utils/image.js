// Lorem Picsum (the seed data's placeholder image host) occasionally fails
// or times out for specific seed values, which shows up as a broken image
// icon in the UI. This fallback is a self-contained inline SVG data URI, so
// it never depends on the network and can never itself fail to load.
export const FALLBACK_COVER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#22c55e"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#g)"/>
  <text x="50%" y="54%" font-size="140" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" opacity="0.85" font-family="sans-serif">&#9835;</text>
</svg>`.trim());

// Attach as an <img onError={handleImgError}>. Swaps to the local fallback
// once, then removes itself so it can't loop if the fallback somehow errors.
export const handleImgError = (e) => {
  if (e.target.src !== FALLBACK_COVER) {
    e.target.onerror = null;
    e.target.src = FALLBACK_COVER;
  }
};
