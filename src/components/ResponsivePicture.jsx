const BASE = import.meta.env.BASE_URL;

// AVIF first (smallest, keeps skin/texture detail), WebP fallback for the
// few browsers without AVIF. `name` is the file stem under
// public/assets/img/photos, generated at the listed widths.
export default function ResponsivePicture({ name, widths, sizes, alt, width, height, loading = "lazy" }) {
  const path = (w, ext) => `${BASE}assets/img/photos/${name}-${w}.${ext}`;
  const srcSet = (ext) => widths.map((w) => `${path(w, ext)} ${w}w`).join(", ");
  const largest = widths[widths.length - 1];

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
      <img
        src={path(largest, "webp")}
        srcSet={srcSet("webp")}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
      />
    </picture>
  );
}
