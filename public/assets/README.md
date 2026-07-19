# assets

## alignly-bg.png

The page backdrop, referenced by `src/App.tsx`. Export it from Figma into this
folder with exactly that filename.

Export settings:
- PNG, 2x
- Around 2880px on the long edge is plenty — it is a soft blurred gradient, so
  detail is not the point and a larger file just costs load time.

If the file is missing the page falls back to the flat cream `#FFF4EB`, which
looks intentional rather than broken, but is not the design.
