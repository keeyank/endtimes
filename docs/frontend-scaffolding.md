# Frontend scaffolding essentials

What the seven files in this repo do and why. Stack: Vite + React + TypeScript.

## The stack, one line each

- **React** — describe what the UI should look like for a given state
  (`state → UI`); React updates the real DOM when state changes. Solves
  "manual DOM updates drift out of sync as apps grow."
- **TypeScript** — a type checker on top of JavaScript. Types are erased at
  build time; the browser only ever runs plain JS. Solves "JS lets typos and
  wrong assumptions become runtime bugs."
- **Vite** — dev server + build pipeline. Solves "bundlers made the dev
  feedback loop slow." In dev it transforms files on demand; for production
  it bundles (via Rolldown, a transitive dependency you won't see in
  `package.json`).

## How the app boots

The browser loads one HTML file with an empty div and a module script —
see [index.html, lines 9–10](../index.html#L9):

```html
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

[src/main.tsx](../src/main.tsx#L4) runs once and hands the div to React. The
null check exists because `getElementById` returns `HTMLElement | null`, and
strict TypeScript won't let us ignore the null case (control-flow narrowing
makes the last line legal):

```ts
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("index.html is missing the #root element");
}

createRoot(rootElement).render(<App />);
```

[src/App.tsx](../src/App.tsx#L1) is the root component — a function returning
JSX, which compiles to JS function calls that build the page at runtime, in
the browser:

```tsx
export function App() {
  return <h1>this is the end... my sweetest friend</h1>;
}
```

Consequence: with JavaScript disabled, a user sees a blank page.

## Dev vs production

- **Dev** (`npm run dev`): Vite serves each source file individually,
  transformed on request (TS/JSX → JS). Fine on localhost where round trips
  are free.
- **Prod** (`npm run build` → `dist/`): everything is bundled into one JS
  file — fewer round trips, minified, tree-shaken. React's code is copied
  into the bundle; the browser never installs npm packages.
- View the prod build with `npm run preview` (a static file server for
  `dist/`). You can't double-click `dist/index.html`: module scripts don't
  run from `file://` URLs.

## Two tools, two jobs

Vite transforms but does not type-check. `tsc` type-checks but emits nothing
(`"noEmit": true` in [tsconfig.json](../tsconfig.json#L9)). The build runs
both — see [package.json, line 8](../package.json#L8):

```json
"build": "tsc && vite build",
```

The `&&` means type errors fail the build — the IDE only checks open files,
`tsc` checks everything.

Vite needs one plugin to understand JSX — see
[vite.config.ts](../vite.config.ts#L4):

```ts
export default defineConfig({
  plugins: [react()],
});
```

## package.json notes

- [`dependencies`](../package.json#L11) (react, react-dom) = code that ends
  up in the shipped app. [`devDependencies`](../package.json#L15) (vite,
  typescript, @types/*) = tools that only run on a dev machine. The browser
  can't tell the difference; the split is intent metadata, and matters once
  a server installs with `--omit=dev`.
- `package-lock.json` records exact versions of every package including
  transitive ones — don't edit it. `node_modules/` and `dist/` are
  git-ignored because both are regenerable.
