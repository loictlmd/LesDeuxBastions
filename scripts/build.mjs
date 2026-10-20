import { access } from 'node:fs/promises';
// The frontend is native HTML/CSS/JS: no compilation or generated copy required.
for (const file of ['public/index.html', 'public/app.js', 'public/style.css', 'public/assets/arena.svg', 'api/index.js']) await access(new URL(`../${file}`, import.meta.url));
console.log('Les Deux Bastions : fichiers prêts pour Vercel.');
