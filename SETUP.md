# Fisch Radar

Mobile-first catch identifier for outdoor pretend play.

## Local Development

```powershell
npm install
npm run dev
```

Open the Vite URL on your phone while both devices are on the same network.

## Build

```powershell
npm run build
```

The static build is generated into `dist/`.

## Design Notes

- The app is intentionally simple: one big `Identify Catch` button.
- Rarity affects catch probability.
- Fish silhouettes are generated with CSS instead of copied game artwork.
- There is no inventory, leveling, or browsing loop, so the phone stays a quick play prop.
