# GlassBox Frontend

GlassBox is a React 18, TypeScript, and Vite frontend with a Node.js static server.

## Requirements

- Node.js 18 or newer
- npm

## Install

From the workspace root:

```powershell
cd Frontend
npm install
```

## Development

Start the Vite development server:

```powershell
npm run dev
```

Open the URL shown in the terminal, usually `http://localhost:5173`.

## Production Build

Create an optimized production build:

```powershell
npm run build
```

The output is generated in `Frontend/dist`.

## Run the Production Server

Build first, then start the Node.js server:

```powershell
npm run build
npm start
```

Open `http://localhost:3000` in a browser.

## Other Commands

```powershell
npm run preview
```

This previews the Vite production build locally.

## Project Structure

```text
Frontend/
├── public/legacy/   Preserved GlassBox UI, styles, scripts, and video assets
├── src/              React and TypeScript application shell
├── index.html        Vite entry document
├── server.js         Node.js production static server
├── package.json      Scripts and dependencies
└── vite.config.ts    Vite configuration
```