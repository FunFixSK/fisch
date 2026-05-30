# Fisch Radar

Mobile-first catch identifier for outdoor pretend play.

Live app:

```text
https://funfixsk.github.io/fisch/
```

## What It Does

Fisch Radar is a quick play prop. Children play outside, decide they caught something, tap `Identify Catch`, and the app reveals a fish name, rarity, weight, and price.

The design goal is to support imagination without turning the phone into the main game.

Gameplay details are documented in [GAMEPLAY.md](./GAMEPLAY.md).

## Local Development

Install dependencies:

```powershell
npm install
```

Start the local dev server:

```powershell
npm run dev
```

Open the Vite URL in a browser. To test on a phone, use the LAN URL printed by Vite while both devices are on the same network.

## Build

Build the app locally:

```powershell
npm run build
```

The local production build is generated into:

```text
dist/
```

## GitHub Pages

This project is set up so both source code and the static site can be committed to GitHub.

Build the GitHub Pages output:

```powershell
npm run build:pages
```

This creates the static site in:

```text
docs/
```

Commit both the source files and `docs/`.

In GitHub repository settings:

```text
Settings -> Pages -> Build and deployment
Source: Deploy from a branch
Branch: main
Folder: /docs
```

After deploy, the app should be available at:

```text
https://funfixsk.github.io/fisch/
```

## Project Structure

```text
src/          application source
docs/         GitHub Pages static build
dist/         local build output
GAMEPLAY.md   gameplay and design notes
README.md     project setup and deployment
```
