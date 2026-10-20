# Les Deux Bastions — V1

Un jeu de quiz et de stratégie à jouer en équipe, depuis un ordinateur ou un téléphone. Deux équipes défendent leur château, répondent aux mêmes questions et utilisent leurs pièces pour attaquer ou se protéger.

## Fonctionnement

- Créez une partie, donnez un nom à votre équipe et partagez le lien ou le code à six caractères.
- La seconde équipe rejoint le camp. Chacune choisit sa couleur et confirme qu’elle est prête.
- L’hôte lance la partie, puis les deux équipes valident le rappel des règles.
- Une bonne réponse rapporte de 3 à 6 pièces : répondre rapidement rapporte davantage. Lorsque les deux équipes ont répondu, la question suivante arrive après l’affichage du résultat.
- Débloquez vos attaques, attendez leur construction, puis lancez-les. Le prix des tirs augmente à chaque achat. Les défenses permettent de protéger ou réparer votre château.
- Chaque équipe peut mettre la partie en pause. Les deux doivent accepter de reprendre.
- Une partie dure au maximum 15 minutes de jeu effectif. Une destruction ou un forfait peut la terminer plus tôt. À la limite de temps, le château avec le plus de points de vie gagne.
- Le mode « Jouer contre l’IA » permet de jouer seul. Les spectateurs rejoignent avec le code et regardent sans intervenir.
- L’interface et les questions sont disponibles en français et en anglais.

## Hébergement Vercel + Neon

Vercel héberge les pages et l’API. Neon stocke temporairement les parties dans PostgreSQL. Votre ordinateur peut rester éteint une fois le site déployé. Aucun tunnel ngrok ni serveur Render n’est nécessaire pour cette version en ligne.

Les transactions en base protègent les réponses et les achats simultanés. Le moteur calcule les échéances à partir de l’heure serveur à chaque requête, sans processus permanent. Les joueurs et spectateurs reçoivent les mises à jour par interrogation régulière de l’API.

Il n’y a pas d’historique de parties dans l’application. Une partie terminée reste accessible 30 minutes pour consulter le résultat ou demander une revanche. Une partie sans activité des joueurs expire après deux heures. Les spectateurs ne prolongent pas ces délais. Les données expirées deviennent immédiatement inaccessibles ; leur suppression physique a lieu à la création d’une partie ou lors du nettoyage quotidien. Le cron doit être actif pour nettoyer aussi un site sans visiteurs. Les éventuelles sauvegardes techniques suivent la politique de rétention de Neon.

### 1. Préparer Neon

1. Créez un compte sur [Neon](https://neon.com/) et un projet `les-deux-bastions` avec l’offre Free.
2. Choisissez une région proche de Francfort, la région configurée pour les fonctions Vercel (`fra1`).
3. Dans **SQL Editor**, sélectionnez votre base et exécutez le contenu de [`sql/schema.sql`](sql/schema.sql). Cela crée la table et son index ; le script peut être relancé sans effacer les parties.
4. Cliquez sur **Connect**, activez **Connection pooling**, puis copiez la chaîne PostgreSQL complète. Conservez les paramètres SSL fournis par Neon. Le nom d’hôte contient normalement `-pooler`.
5. Gardez cette chaîne privée : elle sera la variable `DATABASE_URL` dans Vercel. Ne la mettez ni dans GitHub ni dans un fichier public.

### 2. Importer le dépôt dans Vercel

1. Connectez-vous à [Vercel](https://vercel.com/) avec GitHub.
2. Choisissez **Add New → Project**, puis importez `loictlmd/LesDeuxBastions`, branche `main`.
3. Laissez **Root Directory** à la racine du dépôt (`./`).
4. Choisissez **Framework Preset : Other**. Le fichier `vercel.json` définit les réglages :

   | Réglage | Valeur |
   | --- | --- |
   | Node.js | 22.x |
   | Install Command | `npm ci` |
   | Build Command | `npm run build` |
   | Output Directory | `public` |
   | Région des fonctions | Francfort (`fra1`) |

5. Si un ancien projet Vercel existe déjà, retirez les anciens réglages de build et la variable `GAME_SERVER_URL`. `ALLOWED_ORIGINS` n’est pas nécessaire : les pages et l’API utilisent la même adresse.

### 3. Ajouter les variables privées

Avant de cliquer sur **Deploy**, ajoutez ces variables pour l’environnement **Production** :

| Variable | Valeur |
| --- | --- |
| `DATABASE_URL` | La chaîne de connexion avec pooling copiée depuis Neon. |
| `CRON_SECRET` | Une valeur aléatoire privée d’au moins 32 caractères. Elle protège le nettoyage automatique. |
| `PUBLIC_URL` | Facultatif : l’adresse HTTPS principale du site, une fois connue. Sans cette variable, le QR utilise l’adresse du site visité. |

Pour générer `CRON_SECRET` dans un terminal avec Node.js :

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

N’ajoutez pas la base de production à **Preview** si vous ne souhaitez pas que les versions de prévisualisation partagent les mêmes parties. Pour utiliser les previews, créez une branche Neon séparée, exécutez le schéma dessus et configurez sa propre `DATABASE_URL` pour Preview.

### 4. Déployer et ouvrir le jeu

1. Cliquez sur **Deploy**. Vercel installe les dépendances et publie les pages ainsi que l’API.
2. Ouvrez l’adresse de production en `https://…vercel.app`.
3. Créez une partie et rejoignez-la dans un autre navigateur ou sur un téléphone. Vérifiez également le mode spectateur et le bouton de langue.
4. Dans Vercel, vérifiez que **Cron Jobs** contient `/api/cleanup`, programmé une fois par jour, et consultez **Logs** après son exécution. Vercel transmet automatiquement le secret au cron.
5. Le QR du camp est généré automatiquement et mène à l’accueil du site. Il n’est plus nécessaire de remplacer une image après un changement de domaine.
6. Les prochains commits sur `main` déclencheront les mises à jour Vercel. Après une modification des variables d’environnement, effectuez un **Redeploy**.

Les offres gratuites ont des quotas : le trafic et les appels réguliers du jeu consomment des ressources Vercel et Neon. Vercel Hobby est destiné à un usage personnel non commercial. La disponibilité du site ne dépend plus de votre ordinateur, mais reste soumise aux limites et incidents des hébergeurs. Le premier accès après une période d’inactivité peut attendre le réveil de Neon.

Références : [Vercel Hobby](https://vercel.com/docs/plans/hobby), [cron quotidien sur Hobby](https://vercel.com/docs/cron-jobs/usage-and-pricing), [connexion Neon](https://neon.com/docs/connect/connect-from-any-app).

### En cas de problème

- **Page visible, mais création impossible :** vérifier `DATABASE_URL`, le schéma SQL et les logs de la fonction Vercel.
- **Erreur « relation bastion_rooms does not exist » :** exécuter `sql/schema.sql` sur la même branche et la même base que celles de `DATABASE_URL`.
- **Cron refusé :** vérifier `CRON_SECRET` dans Production, puis redéployer.
- **QR vers une ancienne adresse :** corriger ou supprimer `PUBLIC_URL`, puis redéployer.
- **Ancien build demandant `GAME_SERVER_URL` :** vérifier que Vercel utilise la dernière version de `main` et la commande `npm run build`.

## Utilisation locale

Installez Node.js 22, puis ouvrez un terminal dans le dossier du projet :

```sh
npm ci
npm start
```

Ouvrez `http://localhost:3000`. En local, les parties sont conservées en mémoire et disparaissent à l’arrêt du serveur. Aucune base Neon n’est nécessaire pour ce mode.

Les lanceurs Windows et macOS sont conservés. Sur Windows, `Lancer le jeu.bat` lance également ngrok s’il est installé et configuré. Pour un accès temporaire depuis Internet, installez ngrok, configurez votre jeton avec `ngrok config add-authtoken VOTRE_JETON`, puis utilisez `npm run share`. Votre ordinateur doit rester allumé pour ce mode local.

## Organisation

- `public/` : interface, traductions et illustrations.
- `src/` : moteur de jeu, questions et stockage PostgreSQL.
- `api/` : point d’entrée Vercel.
- `sql/schema.sql` : création de la table temporaire des parties.
- `server.mjs` : traitement HTTP commun et serveur local.
- `vercel.json` : routes, région, sécurité et nettoyage quotidien.
- `.env.example` : noms des variables à configurer, sans identifiants réels.
