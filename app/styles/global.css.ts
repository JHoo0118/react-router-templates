import { globalStyle, layer } from "@vanilla-extract/css";

export const reset = layer("reset");
export const components = layer("components");

globalStyle(`${reset}, *, *::before, *::after`, {
  boxSizing: "border-box",
});

globalStyle(
  `${reset}, body, h1, h2, h3, h4, h5, h6, p, figure, blockquote, dl, dd`,
  {
    margin: "0",
  }
);

globalStyle(`${reset}, ul[role="list"], ol[role="list"]`, {
  listStyle: "none",
});

globalStyle(`${reset}, html`, {
  lineHeight: "1.5",
  WebkitFontSmoothing: "antialiased",
});

globalStyle(`${reset}, body`, {
  minHeight: "100vh",
  fontFamily: "system-ui, sans-serif",
  backgroundColor: "var(--background)",
  color: "var(--foreground)",
});

globalStyle(`${reset}, img, picture, video, canvas, svg`, {
  display: "block",
  maxWidth: "100%",
});

globalStyle(`${reset}, input, button, textarea, select`, {
  font: "inherit",
});

globalStyle(`${reset}, a`, {
  textDecoration: "none",
  color: "inherit",
});

globalStyle(`${reset}, button`, {
  background: "none",
  border: "none",
  padding: "0",
  cursor: "pointer",
});
