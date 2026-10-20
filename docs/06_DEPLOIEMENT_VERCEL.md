# Déployer gratuitement avec Vercel et Render

Configuration préparée pour la version du 20 octobre 2026. Le déploiement sur vos comptes reste à effectuer.

## Pourquoi deux services ?

Le jeu utilise un serveur Node.js unique : les parties, les jetons et les horloges sont conservés dans sa mémoire. Les instances Vercel peuvent être multiples et mises en pause ; Vercel recommande un stockage externe pour les états partagés. Déployer ce moteur tel quel dans des fonctions Vercel ne garantit donc pas que deux joueurs retrouvent la même partie. [Fonctionnement des services Vercel](https://vercel.com/kb/guide/vercel-services-fluid-compute).

La configuration fournie place **l’interface sur Vercel** et **le serveur de jeu sur un service Web Render Free**. Les appels `/api/*` et le dessin des châteaux passent par le domaine Vercel vers Render. Les joueurs utilisent un seul lien HTTPS. Le PC et ngrok ne sont plus nécessaires pour cette version hébergée.

Vercel Hobby est gratuit pour un usage personnel non commercial, dans ses quotas. Render propose des services Web Free avec des limites de calcul, de trafic et de construction. Choisissez ces offres gratuites, sans activer de formule payante. [Vercel Hobby](https://vercel.com/docs/plans/hobby), [Render Free](https://render.com/docs/free).

## 1. Créer le serveur sur Render

1. Connectez-vous à [Render](https://dashboard.render.com/) avec GitHub.
2. Choisissez **New → Web Service** et sélectionnez `loictlmd/LesDeuxBastions`.
3. Renseignez les paramètres suivants :

| Réglage | Valeur |
|---|---|
| Branch | `main` |
| Language / Runtime | `Node` |
| Root Directory | Laisser vide, à la racine du dépôt |
| Build Command | `node --version` |
| Start Command | `npm start` |
| Instance Type | **Free** |
| Variable d’environnement `NODE_VERSION` | `22` |

4. Lancez **Deploy Web Service**. Aucun authtoken ngrok ni base de données n’est nécessaire.
5. Quand le service est actif, ouvrez son adresse HTTPS `…onrender.com` et vérifiez que l’accueil apparaît. Copiez cette adresse : c’est celle du serveur, pas encore le lien final à partager.

Le serveur écoute le port fourni par Render automatiquement. Conservez un seul service et une seule instance, puisque les parties sont en mémoire.

## 2. Créer l’interface sur Vercel

1. Connectez-vous à [Vercel](https://vercel.com/) et choisissez **Add New → Project**.
2. Importez le même dépôt GitHub, branche `main`, avec l’offre **Hobby**.
3. Choisissez **Framework Preset : Other** et conservez la racine du dépôt comme Root Directory.
4. Le fichier `vercel.json` définit déjà **Build Command : `npm run build:vercel`**. Laissez **Output Directory** sans override : le script produit directement `.vercel/output` au format Build Output API.
5. Ajoutez la variable **`GAME_SERVER_URL`** avec l’adresse HTTPS exacte du serveur Render, par exemple `https://votre-service.onrender.com`. Aucun chemin `/api`, identifiant ou paramètre ne doit être ajouté. Activez-la pour Production ; Preview peut utiliser le même serveur seulement si vous autorisez ensuite explicitement son domaine côté Render.
6. Cliquez sur **Deploy**. Le script copie les fichiers publics et configure les routes vers Render, y compris le SVG des châteaux pour conserver leurs couleurs.
7. Copiez le **domaine de production stable** du projet, par exemple `https://votre-projet.vercel.app`. Utilisez ce domaine plutôt que l’adresse temporaire propre à chaque déploiement.

Le build s’arrête avec un message clair si `GAME_SERVER_URL` manque ou est incorrecte. Le code utilise le [Build Output API](https://vercel.com/docs/build-output-api/configuration) et les [routes externes Vercel](https://vercel.com/docs/routing/rewrites). Les réponses de partie ne sont pas mises en cache.

## 3. Autoriser le domaine Vercel sur Render

1. Dans le service Render, ouvrez **Environment**.
2. Ajoutez **`ALLOWED_ORIGINS`** avec l’origine Vercel exacte, par exemple `https://votre-projet.vercel.app`, **sans barre oblique finale**.
3. Enregistrez et laissez Render redémarrer le service.
4. Ouvrez le domaine Vercel et créez une partie. Rejoignez-la sur un autre appareil, puis essayez le mode spectateur.

Si vous ajoutez un domaine personnalisé, ajoutez également son origine HTTPS dans `ALLOWED_ORIGINS`, séparée par une virgule. Les domaines inconnus restent refusés ; il n’y a pas de joker autorisant toutes les origines. Les prévisualisations Vercel ne sont pas autorisées automatiquement.

## 4. Vérifier et remplacer le QR

Vérifiez depuis le lien Vercel : création et connexion, passage FR/EN, lancement, question commune, couleurs des châteaux et accès spectateur. Le choix de langue appartient à chaque navigateur : une équipe française et une équipe anglaise reçoivent la même question et les mêmes choix aux mêmes positions.

Le QR apparaît **uniquement dans le camp**. Il pointe encore vers l’ancienne adresse ngrok, en attendant votre nouvelle adresse. Transmettez le domaine public final pour remplacer `public/assets/home-qr.svg` et la constante `HOME_URL` dans `public/app.js`. Le QR définitif ouvrira l’accueil, sans code de partie ; le code reste affiché à côté pour rejoindre ou regarder.

## Comportement de l’offre gratuite

Render met un service Free en veille après 15 minutes sans trafic entrant ; son réveil prend environ une minute. Ouvrez le lien Render avant une séance et attendez l’accueil, puis partagez le lien Vercel. Les joueurs actifs interrogent le serveur régulièrement. Render alloue 750 heures gratuites par mois et par espace de travail, avec des quotas de trafic et de construction. [Limites officielles Render Free](https://render.com/docs/free).

Les parties disparaissent lors d’un arrêt, d’une mise en veille ou d’un redéploiement du serveur, comme lors de l’arrêt de Node.js sur votre PC. Évitez de redéployer pendant une partie. Une conservation après redémarrage ou un hébergement intégral du moteur sur Vercel demanderait un stockage partagé et une adaptation supplémentaire.

Vous pouvez aussi utiliser directement l’adresse Render pour jouer : elle sert déjà l’interface et le serveur. Vercel est la façade préparée si vous souhaitez utiliser son domaine.

## Dépannage

| Symptôme | Vérification |
|---|---|
| Build Vercel : `GAME_SERVER_URL` manquante | Ajoutez la variable au projet Vercel, puis redéployez. |
| `Origine non autorisée` à la création | Vérifiez `ALLOWED_ORIGINS` sur Render, avec le domaine affiché dans le navigateur, sans `/` final. |
| Connexion lente après une longue absence | Ouvrez d’abord l’adresse Render pour réveiller le service. |
| Accueil visible mais création impossible | Vérifiez que Render est actif et que `GAME_SERVER_URL` cible son service Web. |
| Couleurs des châteaux incorrectes | Conservez la route dynamique `/assets/arena.svg` générée par le build. |
| QR vers ngrok | Le QR doit encore être remplacé avec votre domaine définitif. |
| Partie introuvable après une mise à jour | Le serveur a redémarré ; créez une nouvelle partie. |

## Vérification technique effectuée

Le build est testé dans un dossier temporaire : fichiers publics, validation du domaine serveur, routes API et SVG, absence de la banque de solutions dans les fichiers publics. Les tests HTTP vérifient l’origine Vercel explicitement autorisée, le refus des autres origines et l’obligation de jeton pour les commandes des équipes. Aucun déploiement réel sur vos comptes Vercel ou Render n’a été réalisé depuis cette session.
