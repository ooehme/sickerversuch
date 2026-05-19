# Sickerversuch Formular

React/Vite-NPM-Projekt für ein A4-formatiertes Formular zur Dokumentation eines Sickerversuches.

## Voraussetzungen

- Node.js 18 oder neuer
- npm

Prüfen:

```bash
node -v
npm -v
```

## Installation

```bash
npm install
```

## Entwicklung starten

```bash
npm run dev
```

Danach die im Terminal angezeigte lokale Adresse öffnen, normalerweise:

```text
http://localhost:5173
```

## Produktionsbuild erstellen

```bash
npm run build
```

Der fertige Build liegt danach im Ordner:

```text
dist/
```

## Build lokal prüfen

```bash
npm run preview
```

## Drucken / PDF

Im Browser `Strg + P` oder `Cmd + P` verwenden.

Empfohlene Druckeinstellungen:

- Papierformat: A4
- Ausrichtung: Hochformat
- Ränder: keine oder minimal
- Hintergrundgrafiken aktivieren

## Projektstruktur

```text
sickerversuch-formular/
├─ index.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
├─ vite.config.js
└─ src/
   ├─ App.jsx
   ├─ index.css
   └─ main.jsx
```

## Hinweise zur Berechnung

- Dezimalwerte können mit Komma eingegeben werden, z. B. `1,05`.
- `kf` wird je Versuch berechnet.
- Der ausgegebene `kf`-Wert ist der Mittelwert der positiven Einzelwerte.
- Versuche ohne messbare Absenkung werden beim Mittelwert nicht berücksichtigt.
- Die Zeit `t` ist fest mit `3600 s` hinterlegt.
