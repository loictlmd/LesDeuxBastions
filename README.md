# 🏰 Les Deux Bastions — V1

**Deux équipes, deux châteaux, une bataille d’idées.** Les Deux Bastions est un jeu de quiz et de stratégie multijoueur, accessible depuis un ordinateur ou un téléphone. La culture générale rapporte des pièces ; les décisions collectives permettent de défendre son château et d’attaquer celui de l’adversaire.

## 💡 Pourquoi ce projet ?

Ce projet a été créé en **une journée** pour développer nos compétences **AGILE avec SCRUM**, en appliquant ces méthodes à un jeu concret et jouable.

Le principe : définir un objectif commun, découper le travail en petites fonctionnalités, les prioriser dans un backlog et avancer par courtes étapes. Des échanges réguliers permettent de partager l’avancement, de repérer les blocages et d’ajuster les priorités. À la fin d’une étape, on regarde ce qui fonctionne et ce qui mérite d’être amélioré.

Le jeu met lui-même la collaboration au centre : discuter d’une réponse, choisir une stratégie et prendre une décision ensemble comptent autant que les connaissances individuelles.

## 🎮 Préparer une partie

1. **Créez votre camp** et choisissez un nom d’équipe.
2. **Invitez l’autre équipe** avec le lien, le QR code ou le code à six caractères.
3. Chaque équipe choisit la **couleur de son château**, puis indique qu’elle est prête.
4. L’équipe qui a créé le camp lance la partie. Les deux équipes valident le rappel des règles avant que le chronomètre démarre.

Un téléphone ou un ordinateur par équipe suffit : une personne sélectionne les réponses et les actions pendant que les autres conseillent. Vous pouvez changer de porte-parole au fil des questions.

## ⚔️ Comment jouer ?

### Répondre pour gagner des pièces

Les deux équipes reçoivent la même question parmi une banque de **500 questions**, réparties en huit thèmes : géographie, histoire, physique et chimie, mathématiques et logique, littérature et langues, arts et musique, informatique et techniques, nature et astronomie.

Chaque question propose quatre réponses. Vous disposez de **25 secondes** pour choisir. Une bonne réponse rapporte **3 à 6 pièces** : plus vous répondez vite, plus vous gagnez. Une mauvaise réponse ne rapporte rien. Les gains et l’explication apparaissent après votre réponse.

Lorsque les deux équipes ont répondu, le jeu laisse un court temps pour lire le résultat, puis passe à la question suivante. Les questions sont mélangées et ne se répètent pas avant l’épuisement de la banque. Chaque nouvelle manche apporte aussi une pièce de ravitaillement.

### Construire sa stratégie

Chaque château commence avec **300 points de vie** et chaque équipe avec **12 pièces**.

- **Attaques :** débloquez une arme, attendez sa construction, puis achetez vos tirs. Flèches, catapulte, éclair et sabotage ont des effets différents. Le prix d’une attaque augmente à chaque nouvelle utilisation achetée par votre équipe.
- **Défenses :** protégez-vous avec un bouclier, réparez votre château ou utilisez un miroir pour renvoyer une partie des dégâts.
- **Observation :** les constructions adverses sont visibles. Les cadres rouges indiquent les attaques verrouillées, orange celles en construction et verts celles débloquées.
- **Timing :** les tirs ont un temps de trajet et les équipements un délai avant réutilisation. Gardez quelques pièces pour réagir aux décisions adverses.

Au bout de huit minutes, le siège renforce les nouvelles attaques. Après neuf minutes, la tempête empêche les réparations et commence à endommager les deux châteaux : attendre indéfiniment devient risqué !

### Pause, victoire et revanche

Les deux équipes disposent d’un bouton **Pause**. Le temps de jeu et les effets en cours sont suspendus ; les deux camps doivent accepter de reprendre.

La partie dure **15 minutes de jeu effectif au maximum**, pauses exclues. Détruire le château adverse permet de gagner plus tôt. À la limite de temps, le château avec le plus de points de vie remporte la partie ; une égalité reste possible. Un départ ou une déconnexion prolongée peut entraîner un forfait.

Après le résultat, les deux équipes peuvent demander une revanche. Les ressources sont réinitialisées et les couleurs sont conservées.

## 🤖 IA, spectateurs et langues

- **Jouer contre l’IA :** créez votre équipe depuis l’accueil et choisissez ce mode pour affronter une équipe automatique. Le camp conserve son code pour accueillir des spectateurs, sans afficher le bloc d’invitation d’une seconde équipe.
- **Regarder une partie :** choisissez le mode spectateur depuis l’accueil et saisissez le code. Vous suivez les châteaux, les attaques et les questions sans pouvoir intervenir. Les réponses correctes restent cachées jusqu’à la clôture de la question.
- **Français / English :** le bouton du header change la langue de l’interface, des questions, des choix et des explications. Chaque personne peut choisir sa langue tout en jouant la même partie.

## 💻 Jouer en local

### Installation

Installez **Node.js 22** depuis [nodejs.org](https://nodejs.org/), puis récupérez le projet. Dans PowerShell, placez-vous dans son dossier :

```powershell
cd "C:\Users\lotou\Desktop\Projet Dev\LesDeuxBastions"
npm ci
npm start
```

`npm ci` installe les dépendances du projet. Cette commande est nécessaire à la première installation et après une mise à jour qui modifie les dépendances.

Ouvrez ensuite **http://localhost:3000** dans votre navigateur. Gardez le terminal ouvert pendant la partie ; **Ctrl+C** arrête le serveur. En local, aucune base de données n’est nécessaire : les parties restent en mémoire et disparaissent à l’arrêt du serveur.

### Jouer à plusieurs

Pour jouer sur le même ordinateur, ouvrez le jeu dans deux navigateurs différents ou dans une fenêtre privée pour créer deux sessions indépendantes.

Sur plusieurs appareils, connectez-les au même réseau local. Le terminal affiche les adresses disponibles, par exemple `http://192.168.1.20:3000`. Les autres appareils ouvrent cette adresse, puis rejoignent avec le code de la partie. `localhost` désigne toujours l’appareil sur lequel le navigateur est ouvert : utilisez donc l’adresse de l’ordinateur qui héberge le jeu.

Le réseau doit autoriser les communications entre appareils. Certains réseaux invités ou scolaires les bloquent. Si Windows demande une autorisation pour Node.js, autorisez l’accès sur votre réseau privé.

### Lanceurs et lien Internet temporaire

- **Windows :** double-cliquez sur `Lancer le jeu.bat`. Le lanceur démarre le jeu et tente d’ouvrir un tunnel ngrok s’il est installé et configuré. Si ngrok n’est pas disponible, le jeu reste accessible en local.
- **macOS :** utilisez `Lancer le jeu.command`, ou lancez `npm start` depuis le terminal.
- **Terminal :** `npm start` démarre uniquement le serveur local ; `npm run share` démarre le serveur et le tunnel ngrok.

Pour utiliser ngrok, installez-le depuis [ngrok.com](https://ngrok.com/), configurez votre jeton personnel, puis démarrez le partage :

```sh
ngrok config add-authtoken VOTRE_JETON
npm run share
```

Partagez l’adresse HTTPS affichée par le lanceur. Votre ordinateur et le terminal doivent rester allumés ; le QR du camp utilise l’adresse publique détectée. Gardez votre jeton privé.

Si le port 3000 est déjà occupé, fermez l’autre serveur ou choisissez un autre port dans PowerShell :

```powershell
$env:PORT = "3001"
npm start
```

Ouvrez alors `http://localhost:3001`.

## 🛠️ Structure du projet

Le jeu utilise JavaScript, HTML et CSS, avec un serveur Node.js. Son interface s’adapte aux ordinateurs et aux téléphones.

- `public/` : interface, traductions et illustrations.
- `src/` : moteur de jeu, questions bilingues et stockage des parties.
- `server.mjs` : serveur local et traitement des requêtes.
- `scripts/` : lancement et préparation des fichiers.
- `api/` et `sql/` : accès serveur et stockage pour la version en ligne.

L’application ne propose pas d’historique permanent : les parties en ligne terminées restent accessibles temporairement pour afficher le résultat et permettre une revanche.
