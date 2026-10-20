# 🏰 Les Deux Bastions

### 🧠 Des idées. 🤝 Des alliés. 🛡️ Un bastion.

**Un jeu de quiz et de stratégie pour faire équipe !** Deux équipes s’affrontent depuis leurs téléphones : répondez ensemble à des questions de culture générale, gagnez des pièces et choisissez comment attaquer le village adverse ou protéger le vôtre.

![Les deux villages, Sauge et Corail, face à face](public/assets/arena.svg)

## 🎯 Le but du jeu

**Détruire le bastion adverse, ou conserver plus de points de vie que lui après quinze minutes de jeu effectif.**

Chaque équipe commence avec **300 points de vie ❤️** et **12 pièces 🪙**. Un **récapitulatif des règles** s’ouvre au lancement et à chaque revanche : le chronomètre attend l’accord des deux équipes. Elles reçoivent ensuite la même question aléatoire et disposent de **25 secondes** pour discuter et valider une seule réponse. Quand les deux ont répondu, le résultat reste affiché **3 secondes**, puis la question suivante commence. Sinon, la manche dure 30 secondes.

- ✅ Bonne réponse : **+3 à +6 pièces selon la rapidité** : 6 au départ, puis une pièce de moins toutes les 6 secondes, jusqu’à 3. Une animation indique le gain, y compris 0 après une erreur ou une absence de réponse.
- ❌ Mauvaise réponse ou absence de réponse : aucun gain, aucune pénalité.
- 📦 Nouvelle manche : **+1 pièce** de ravitaillement.
- ⚔️ Payez une fois le **déblocage** d’une attaque, attendez sa construction, puis payez chaque tir, de plus en plus cher à chaque utilisation. Les constructions et les attaques débloquées sont visibles sous les deux bastions. Les défenses sont disponibles dès le départ.
- 🏆 Un bastion détruit perd immédiatement. À **15 minutes de jeu effectif**, le bastion avec le plus de PV gagne ; une égalité de PV ou une destruction simultanée donne une égalité.

Les projectiles mettent **4 à 7 secondes** à arriver : surveillez les attaques et défendez-vous à temps. Les achats restent possibles pendant le quiz.

## 🤝 Un jeu pensé pour le team building

- 👥 **Deux équipes**, avec **un téléphone par équipe**.
- 💬 Les joueurs discutent des réponses et prennent leurs décisions ensemble.
- 🔄 Changez de porte-parole toutes les deux questions pour faire participer chacun.
- ⏳ Prévoyez jusqu’à **15 minutes de jeu effectif**, puis un court débrief.
- 💡 Après la partie : « Quelle idée d’un coéquipier a changé notre stratégie ? »

Le projet est réalisé dans le cadre d’un **cours utilisant la méthode Agile avec Scrum**. Les documents de démarrage et de suivi sont disponibles dans le dossier [`docs/`](docs/README.md).

## ✨ Ce que contient le jeu

- 🏕️ Création d’une partie et invitation par code de six caractères.
- 📚 **144 nouvelles questions** de niveau intermédiaire à difficile dans huit thèmes : géographie, histoire, physique/chimie, mathématiques/logique, littérature/langues, arts/musique, informatique/techniques, nature/astronomie.
- ⚔️ **Quatre attaques** et 🛡️ **trois défenses**.
- 🎨 Villages illustrés, projectiles animés, boucliers et journal de bataille.
- 📱 Interface adaptée aux téléphones et aux ordinateurs ; sur PC, les châteaux sont à gauche, le quiz à droite et l’arsenal dessous.
- 🌍 Bouton **FR / EN** dans le header : interface, règles, questions et messages traduits ; choix mémorisé sur chaque navigateur.
- 👀 Mode spectateur accessible par code ou lien, sans occuper une équipe.
- 📷 QR code dans le camp, à côté du code de partie.
- 🔁 Reconnexion après rechargement et revanche avec l’accord des deux équipes.
- 🤖 Mode **« Jouer contre l’IA »** contre une équipe automatique.
- 🎨 Six couleurs de château au choix par équipe, visibles sur les deux écrans.
- ⏸️ Pause disponible aux deux camps ; reprise après accord des deux équipes.
- 🔊 Sons facultatifs, activables dans l’interface.

## 🌐 Déployer gratuitement

Le dépôt est préparé pour **Vercel (interface) + Render Free (serveur de jeu)**. Suivez [le guide pas à pas](docs/06_DEPLOIEMENT_VERCEL.md) : serveur Render, variable `GAME_SERVER_URL` sur Vercel, puis origine Vercel dans `ALLOWED_ORIGINS` sur Render. Les parties restent en mémoire sur un serveur unique ; le guide détaille le réveil du service gratuit et les redémarrages. Le QR du camp sera remplacé lorsque le domaine final sera connu.

## 💻 Avant de commencer

Il vous faut :

- Un ordinateur **Windows, macOS ou Linux** pour héberger la partie.
- **[Node.js](https://nodejs.org/) version 20 ou supérieure**, installé sur cet ordinateur. Vérifiez avec `node --version`.
- Deux téléphones avec un navigateur.
- En local : l’ordinateur et les téléphones sur le **même réseau Wi-Fi**, autorisant les échanges entre appareils. Sur Internet : un tunnel ngrok sur l’ordinateur ; les téléphones peuvent utiliser d’autres réseaux.

📦 Le projet n’utilise **aucune dépendance npm à installer** : pas besoin de `npm install`.

🌐 Une fois Node.js et le projet téléchargés, le jeu fonctionne sur le réseau local sans accès Internet. Aucun compte joueur n’est nécessaire.

## 🚀 Installer et lancer le jeu

### 1️⃣ Récupérer le projet

**Avec Git :**

```bash
git clone https://github.com/loictlmd/LesDeuxBastions.git
cd LesDeuxBastions
```

**Sans Git :** cliquez sur **Code → Download ZIP** sur GitHub, décompressez l’archive, puis ouvrez un terminal dans le dossier extrait contenant `package.json`.

### 2️⃣ Démarrer le serveur

Sur **Windows, macOS et Linux**, lancez :

```bash
npm start
```

Ou directement :

```bash
node server.mjs
```

Vous verrez des adresses de ce type dans le terminal :

```text
LES DEUX BASTIONS
Sur cet ordinateur : http://localhost:3000
Sur les téléphones (même Wi-Fi) : http://192.168.1.42:3000
```

⚠️ L’adresse `192.168.1.42` est un **exemple**. Utilisez celle réellement affichée sur votre ordinateur.

### 🍎 Raccourci sur Mac

Depuis le dossier du projet :

```bash
zsh "Lancer le jeu.command"
```

Le lanceur ouvre le navigateur automatiquement. Pour pouvoir ensuite le lancer par un double-clic dans le Finder, rendez-le exécutable une première fois :

```bash
chmod +x "Lancer le jeu.command"
```

### 🪟 Raccourci sur Windows

Double-cliquez sur **`Lancer le jeu.bat`** après avoir installé Node.js et configuré ngrok. Il lance **le jeu et le tunnel ensemble**, affiche le lien HTTPS et l’ouvre dans le navigateur. Il retrouve notamment le ngrok téléchargé dans `%TEMP%\bastions-ngrok`. Pour une installation durable, placez `ngrok.exe` dans `tools`.

La configuration initiale de l’authtoken et le dépannage sont décrits dans [Jouer sur Internet avec ngrok](docs/05_TUNNEL_INTERNET.md). Fermez l’ancien serveur avant de lancer le `.bat`. Sans ngrok disponible, le jeu reste accessible localement. Pour un lancement local seul, utilisez `npm start`.

### 🐧 Sur Linux

Utilisez `npm start`, puis ouvrez [http://localhost:3000](http://localhost:3000) sur l’ordinateur.

## 📱 Connecter les deux équipes

**Avec ngrok :** ouvrez le lien HTTPS affiché sur les deux appareils, puis suivez les étapes 3 à 7 ci-dessous.

**En réseau local :**

1. 📶 Connectez les deux téléphones au **même Wi-Fi que l’ordinateur**.
2. 🌐 Ouvrez sur chaque téléphone l’adresse **« Sur les téléphones »** affichée dans le terminal.
3. 🏕️ **Équipe A** : saisissez votre nom et choisissez **Créer une partie**.
4. 🔑 **Équipe B** : choisissez **Rejoindre** et entrez le code partagé par l’équipe A. Le lien d’invitation fonctionne aussi.
5. ✅ Chaque équipe appuie sur **Nous sommes prêts**.
6. 🚩 L’équipe qui a créé le camp appuie sur **Lancer la bataille**.
7. 📋 Chaque équipe valide le petit récapitulatif, puis la bataille démarre. Jouez jusqu’au résultat et proposez une revanche !

> 💡 Sur un téléphone, n’utilisez pas `localhost` : cela désigne le téléphone lui-même, pas l’ordinateur qui héberge la partie.

> 🔌 Gardez l’ordinateur allumé, sans veille, et la fenêtre du serveur ouverte. Gardez aussi les téléphones déverrouillés. Pour arrêter le serveur, appuyez sur **Ctrl+C**. L’arrêt efface les parties en cours, conservées en mémoire.

### 👀 Regarder une partie et partager le QR code

Sur l’accueil, choisissez **Regarder**, saisissez le code de partie puis validez. Vous pouvez aussi partager le **Lien spectateur** depuis la bataille : il ouvre directement la vue spectateur, y compris si la partie a déjà commencé. Les spectateurs suivent les deux bastions, les questions et le journal, sans pouvoir répondre, acheter, mettre en pause ou lancer une revanche. Les pièces des équipes restent privées ; la solution apparaît après les deux réponses ou la fermeture du temps de réponse. Le rechargement et les revanches conservent le mode spectateur.

Le QR code affiché dans le camp mène à **https://mocker-hamper-prodigy.ngrok-free.dev/**. Après l’avoir scanné, saisissez le code affiché pour rejoindre ou regarder. Il s’agit d’une adresse fixe : si le domaine ngrok change, le QR code devra être remplacé.

### 🤖 Découvrir le jeu seul

Ouvrez [http://localhost:3000](http://localhost:3000), puis cliquez sur **Jouer contre l’IA**. Confirmez que votre équipe est prête, lancez la bataille puis validez le récapitulatif. Les Veilleurs, une équipe automatique, débloquent aussi leurs attaques.

Pour essayer le mode deux équipes sur un seul ordinateur, ouvrez le jeu dans deux nouveaux onglets distincts. Chaque onglet conserve sa propre équipe.

## ⚔️ Attaques et défenses

| Équipement | Déblocage unique / construction | Prix par utilisation | Effet normal | Impact / recharge |
|---|---|---|---|---|
| 🏹 Volée de flèches | 6 pièces / 5 s | 8, 16, 24… (+8 par tir) | 12 dégâts | 4 s / 4 s |
| 🪨 Catapulte | 18 pièces / 12 s | 18, 31, 44… (+13 par tir) | 32 dégâts | 7 s / 7 s |
| ⚡ Éclair perçant | 14 pièces / 10 s | 14, 24, 34… (+10 par tir) | 18 dégâts ignorant le bouclier | 6 s / 6 s |
| 🧨 Sabotage | 10 pièces / 8 s | 10, 18, 26… (+8 par tir) | Retire jusqu’à 24 de bouclier, puis inflige 6 dégâts | 5 s / 5 s |
| 🛡️ Dôme protecteur | Disponible dès le départ | 10 | +18 de bouclier, maximum 36 ; dure 45 s | Immédiat / 8 s |
| 🔧 Atelier de réparation | Disponible dès le départ | 20 | +8 PV, maximum 300 | Immédiat / 30 s |
| 🪞 Miroir de riposte | Disponible dès le départ | 12 | Bloque et renvoie 40 % de la prochaine attaque ; expire après 12 s | Immédiat / 20 s |

Le prix augmente seulement après un tir réussi à l’achat, indépendamment pour chaque attaque et chaque équipe. Un clic refusé ne change pas le prix. Chaque carte affiche son état : **rouge / verrouillée**, **orange / en construction**, **vert / débloquée**, avec un texte en complément de la couleur.

Les cartes affichent des descriptions courtes : dégâts et délai d’impact pour les attaques. Le bouton affiche le prix actuel et l’état de disponibilité.

Les déblocages restent acquis jusqu’à la fin de la partie, y compris après rechargement. Une revanche remet les constructions et les prix à zéro, tout en conservant la couleur choisie.

⏱️ Deux achats, déblocages compris, doivent être espacés d’au moins **2 secondes**. Chaque équipement a également sa propre recharge.

🪞 Le renvoi du miroir est arrondi à l’entier le plus proche. Il peut être absorbé par le bouclier adverse et ne déclenche pas de deuxième miroir. Un sabotage retire le bouclier avant la réduction des dégâts par le miroir.

🛡️ Un second dôme ajoute des points jusqu’au plafond de 36 et renouvelle la protection pour 45 secondes.

### ⏸️ Pause et couleurs

Choisissez votre couleur dans le camp, ou ouvrez **Couleurs du château** pendant la bataille. Les toits, drapeaux et barres de vie changent pour les deux joueurs. Une couleur occupée par l’adversaire ne peut pas être choisie.

Chaque équipe peut demander **Pause**, y compris depuis le raccourci mobile. Questions, récompenses, constructions, projectiles, protections, recharges, siège et tempête cessent d’avancer. Les deux équipes doivent cliquer sur **Reprendre** ; en démo, l’adversaire automatique est déjà d’accord. Une pause se conserve après rechargement. Les achats et réponses sont refusés pendant la pause.

### 🌩️ Une partie de quinze minutes au maximum

Le chronomètre de partie exclut les pauses et commence après le récapitulatif.

- À **8 minutes**, le siège commence : les nouvelles attaques infligent **50 % de dégâts supplémentaires**.
- À **9 minutes**, les réparations ferment.
- Dès **9 min 10 s**, puis toutes les 10 secondes, chaque village perd **8 PV**, à travers les boucliers.
- À **15 minutes**, la partie s’arrête : l’équipe avec le plus de PV gagne, ou égalité si les PV sont égaux. Les impacts exactement à la limite sont résolus avant le classement.
- Une destruction, un abandon ou un forfait peut terminer la partie plus tôt.

Les simulations des règles actuelles durent entre **7 min 49 s et 14 min 10 s**. Il reste à confirmer le ressenti et les stratégies avec de vrais joueurs.

## 🛠️ Un problème de connexion ?

| Problème | Solution |
|---|---|
| Le téléphone n’ouvre pas le jeu | Vérifiez le Wi-Fi commun et utilisez l’adresse IP affichée, avec son port. |
| Le réseau de l’école ou de l’entreprise bloque la connexion | Certains réseaux isolent les appareils. Testez avant le cours et utilisez un réseau autorisant les échanges locaux. |
| Le système demande une autorisation réseau | Autorisez Node.js à recevoir les connexions sur votre réseau local. |
| Le port 3000 est déjà utilisé | Fermez l’ancienne instance ou choisissez un autre port ci-dessous. |
| La page a été rechargée | Le même onglet retrouve son équipe. Les ressources restent gérées par le serveur. |
| Le Wi-Fi a brièvement coupé | Le jeu essaie de se reconnecter automatiquement. Le chronomètre continue. |
| Une équipe disparaît | Après 90 secondes d’absence, l’équipe encore connectée peut gagner par forfait. |
| Le serveur a été arrêté | Relancez-le et créez une nouvelle partie. Les anciennes parties ne sont pas sauvegardées. |

Pour utiliser le port 3001 :

**macOS / Linux :**

```bash
PORT=3001 node server.mjs
```

**Windows PowerShell :**

```powershell
$env:PORT = "3001"
node server.mjs
```

Utilisez alors l’adresse avec `:3001` sur les téléphones.

## 🧪 Tests et équilibrage

```bash
npm test
npm run simulate
```

- ✅ **43 tests ciblés** ont été vérifiés pour cette version : moteur, HTTP, traduction et préparation Vercel. Les trois tests du lanceur ngrok, validés précédemment, n’ont pas été relancés pour ces changements d’interface.
- 📱 Le nouveau parcours Chromium couvre deux équipes et un spectateur, les vues PC/mobile, les retraits de contenu, le bandeau arrondi, FR/EN avant et pendant la partie, les formulaires conservés, les questions communes, les réponses et la pause après rechargement. Aucun débordement horizontal ni erreur JavaScript constaté. Les 144 versions anglaises sont vérifiées pour leur correspondance et la confidentialité des explications.
- 🎲 **900 matchs simulés** ont été utilisés pour étudier les stratégies et vérifier que les parties se terminent.
- 👥 L’équilibrage est une première base : il reste à l’affiner avec les joueurs et à tester sur les vrais téléphones et le Wi-Fi du cours.

Le détail des vérifications et le protocole de recette sont dans [Tests et équilibrage](docs/04_TESTS_ET_EQUILIBRAGE.md).

## 📂 Organisation du projet

```text
LesDeuxBastions/
├── server.mjs                  # Serveur HTTP et API multijoueur
├── src/
│   ├── game.mjs                # Moteur de partie et règles
│   ├── catalog.mjs             # Équipements, prix et délais
│   └── questions.mjs           # Questions et solutions côté serveur
├── public/
│   ├── index.html             # Interface du jeu
│   ├── app.js                 # Interactions et synchronisation
│   ├── style.css              # Affichage ordinateur et mobile
│   └── assets/                # Illustrations SVG originales
├── test/                      # Tests automatisés
├── scripts/
│   ├── simulate.mjs            # Simulations d’équilibrage
│   └── launch.mjs              # Démarrage du serveur et du tunnel ngrok
├── docs/                      # Documents Scrum et recette
├── Lancer le jeu.command      # Lanceur macOS
├── Lancer le jeu.bat          # Lanceur Windows
└── package.json
```

## 📋 Le projet Agile / Scrum

- 🚩 [Fiche de démarrage](docs/01_DEMARRAGE.md)
- 📝 [Product Backlog et critères d’acceptation](docs/02_BACKLOG.md)
- 🏃 [Fiches de sprint, suivi, review et rétrospective](docs/03_SPRINTS.md)
- 🧪 [Tests, équilibrage et recette](docs/04_TESTS_ET_EQUILIBRAGE.md)

Les noms, dates et décisions du groupe sont à compléter avec vos informations réelles. Le prototype disponible n’est pas présenté comme un sprint déjà réalisé par le groupe.

## 🌐 Hébergement

Cette version tourne **sur l’ordinateur de l’animateur**, avec un seul serveur Node.js. Les équipes interrogent ce serveur toutes les 800 ms, les spectateurs toutes les 2 secondes ; il contrôle les réponses, les pièces et les dégâts.

**GitHub héberge le code, pas la partie.** GitHub Pages seul ne peut pas exécuter ce serveur Node.js. Pour jouer depuis des réseaux différents, le lanceur Windows peut ouvrir un tunnel ngrok vers ce serveur local. Le PC doit rester allumé. Le guide [Vercel + Render](docs/06_DEPLOIEMENT_VERCEL.md) permet de déplacer le serveur sur un hébergement gratuit ; le compte utilisateur et le déploiement restent à configurer.

---

**🏰 Culture commune. 🤝 Esprit d’équipe.**
