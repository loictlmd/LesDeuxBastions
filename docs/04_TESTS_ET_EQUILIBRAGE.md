# Tests et équilibrage

## État de vérification au 20 octobre 2026

**41 tests automatisés** passent dans l’environnement Linux de développement : 37 tests du moteur et du contenu, un parcours HTTP réel et trois tests du lanceur avec un faux exécutable ngrok. Commande : `npm test`. Les trois tests de processus utilisant un exécutable Unix simulé sont ignorés sous Windows ; le double-clic réel du `.bat` reste à vérifier sur le PC.

Les contrôles couvrent :

- Les 144 questions distinctes, leurs quatre propositions et les huit thèmes de 18 questions.
- L’authentification, la limite de deux équipes, la confidentialité des clés et des solutions avant réponse.
- Le récapitulatif commun, les bonnes/mauvaises réponses, le bonus calculé avec l’heure du serveur, les délais et le ravitaillement versé une seule fois.
- Les gains : 6 pièces de 0 à moins de 6 s ; 5 de 6 à moins de 12 s ; 4 de 12 à moins de 18 s ; 3 de 18 à moins de 25 s. Réponse erronée ou expirée : 0.
- Les recherches d’attaques, constructions, dépenses, impacts, boucliers, miroirs, réparations et recharges.
- Les tirs de plus en plus chers par type et par équipe : 8/16/24 pour les flèches, 18/31/44 pour les catapultes, 14/24/34 pour les éclairs et 10/18/26 pour le sabotage. Un achat refusé n’augmente jamais le prix ; les défenses gardent un prix fixe.
- Les cadres et libellés rouge/verrouillé, orange/construction, vert/débloqué.
- La pause demandée par l’un ou l’autre camp : tous les délais de jeu, les résultats, constructions, projectiles, protections, actions du bot, phases et forfaits restent gelés. La reprise attend les deux équipes connectées ; en démo, le bot confirme automatiquement. Les pauses successives se cumulent correctement et le rechargement conserve l’état.
- Les couleurs validées et réservées par équipe, visibles chez l’adversaire, ainsi que la recoloration réelle du SVG par HTTP.
- Les 300 PV initiaux, le siège à 8 min, les réparations fermées à 9 min et la première frappe de tempête à 9 min 10 s. La fin à 15 minutes de jeu effectif compare les PV restants ; une destruction simultanée reste une égalité. Les impacts exactement à la limite sont résolus avant le classement, sans créer de nouvelle question à 15 min.
- La reconnexion, l’abandon et les revanches : couleurs conservées, constructions et prix réinitialisés.
- La consultation spectateur : aucun jeton ni portefeuille, solution différée, aucune place occupée et aucune prolongation de présence des équipes ; suivi des pauses, fin de partie et revanche. Les mutations sans jeton restent refusées.
- Le service HTTP du QR en SVG et les erreurs de code de partie.
- Le lanceur ngrok : bon port, lien public, arrêt des processus, erreur ngrok et port occupé.

**Parcours navigateur vérifié :** quatre sessions Chromium indépendantes, deux équipes et deux spectateurs, aux formats mobile 390 × 844 et ordinateur 1440 × 1000. QR sur l’accueil et dans le camp avec le code, accès spectateur par code et par lien, absence de commandes et de ressources privées, solution cachée après une seule réponse, affichage après les deux réponses, construction et tir, pause puis rechargement et reprise à deux, textes agrandis et descriptions d’attaque simplifiées, fin à quinze minutes puis revanche suivie automatiquement. Quitter la vue spectateur ne provoque pas de forfait. Un code inconnu affiche une erreur. Aucun débordement horizontal ni erreur JavaScript constaté. Les captures ont été inspectées.

**Destination du QR vérifiée :** le SVG et une capture du QR rendu dans Chromium ont été décodés avec un lecteur indépendant. Tous deux donnent exactement `https://mocker-hamper-prodigy.ngrok-free.dev/`. Le QR est généré à partir de l’adresse fournie, sans dépendance ajoutée au jeu.

**Limites :** pas de recette physique iPhone/Android, d’essai sur le Wi-Fi du cours, ni d’ouverture d’un vrai tunnel avec le compte ngrok du groupe depuis cet environnement. Les contrôles du lanceur ne valident pas le double-clic Windows, les quotas ou les autorisations ngrok. La fin à quinze minutes du parcours navigateur a été accélérée avec l’horloge de test ; elle ne constitue pas une partie humaine de quinze minutes.

## Choix d’équilibrage

Une bonne réponse rapporte de 3 à 6 pièces selon la rapidité, avec une pièce de ravitaillement par nouvelle manche. Cela ajoute une pièce à chaque bonne réponse par rapport au barème 2–5 précédent. Le prix progressif décourage la répétition d’une seule attaque et pousse à varier les constructions. Les châteaux ont 300 PV. La limite est de quinze minutes de jeu effectif, hors pauses ; une destruction ou un forfait peut conclure plus tôt.

L’atelier coûte 20 pièces, restaure 8 PV et se recharge en 30 secondes. Le siège à huit minutes et la tempête à neuf minutes continuent d’accélérer la fin de partie. La politique défensive gagne 60 matchs contre 27, avec 13 égalités, face à la politique mixte dans les simulations actuelles ; ce résultat demande une validation avec des joueurs avant de conclure à l’équilibre des stratégies.

## Simulations reproductibles

Commande : `npm run simulate`. Graine des décisions : 20261019. Neuf scénarios de 100 matchs, **900 au total**, avec des réponses après 2, 10 ou 20 secondes. Les agents décident toutes les 500 ms et alternent leur ordre d’action ; ils paient les constructions et les prix progressifs. Ils utilisent la solution connue pour simuler une probabilité de réussite. La politique variée compare le rendement courant des différentes attaques ; la politique flèches répète uniquement les flèches.

| Stratégies A / B | Réussite A / B | Réponse après | Victoires A / B / égalités | Min. | Médiane | Max. |
|---|---|---|---|---|---|---|
| Mixte / Mixte | 65 % / 65 % | 10 s | 45 / 35 / 20 | 12:15 | 13:10 | 13:50 |
| Flèches / Mixte | 65 % / 65 % | 10 s | 0 / 100 / 0 | 11:20 | 11:40 | 12:25 |
| Défensive / Mixte | 65 % / 65 % | 10 s | 60 / 27 / 13 | 12:30 | 13:30 | 14:10 |
| Mixte / Mixte | 80 % / 40 % | 10 s | 96 / 0 / 4 | 12:00 | 13:04 | 13:30 |
| Mixte / Mixte | 0 % / 0 % | 10 s | 0 / 0 / 100 | 13:40 | 13:40 | 13:40 |
| Variée / Variée | 65 % / 65 % | 10 s | 36 / 34 / 30 | 11:10 | 11:40 | 12:12 |
| Variée / Mixte | 65 % / 65 % | 10 s | 24 / 55 / 21 | 11:20 | 12:10 | 12:38 |
| Variée / Variée | 100 % / 100 % | 2 s | 0 / 0 / 100 | 7:49 | 7:49 | 7:49 |
| Variée / Variée | 65 % / 65 % | 20 s | 43 / 41 / 16 | 13:00 | 13:10 | 14:10 |

Les 900 matchs se terminent entre **7 min 49 s et 14 min 10 s**, avant la limite de quinze minutes. Les scénarios à réponses de 10 ou 20 secondes durent de 11 min 10 s à 14 min 10 s ; le scénario symétrique parfait à deux secondes se termine par une destruction simultanée à 7 min 49 s. Cette plage décrit ces simulations, pas une garantie de durée minimale pour toutes les stratégies humaines. Une destruction, un abandon ou un forfait peut terminer une partie plus tôt ; les pauses prolongent le temps réel de la séance.

La politique « flèches uniquement » est dominée par la politique mixte : la hausse du prix pénalise volontairement cette répétition. La politique mixte gagne davantage que la politique variée dans leur confrontation (55 contre 24, avec 21 égalités). Les égalités fréquentes dans les scénarios symétriques viennent notamment du timing identique des agents et de la faible variété de leurs décisions. La conservation des PV et le timing défensif restent à confronter aux joueurs.

Ces mesures remplacent celles des règles précédentes. Elles ne reproduisent ni les discussions humaines, ni la latence du Wi-Fi ou d’un tunnel.

## Recette à réaliser par le groupe

À remplir pendant les essais, sans reprendre les résultats automatisés comme des observations humaines.

| ID | Scénario sur le matériel réel | Résultat attendu | Résultat observé / preuve | Statut |
|---|---|---|---|---|
| R01 | Lancer le jeu à partir du guide | Un membre y parvient seul | | Non testé |
| R02 | Relier les deux téléphones au serveur | La page s’ouvre sur les deux | | Non testé |
| R03 | Créer, rejoindre, se déclarer prêt | Les noms et la manche correspondent | | Non testé |
| R04 | Répondre juste rapidement, puis plus tard ; essayer une erreur | Gain de 3 à 6 selon la rapidité ; 0 après erreur ; animation | | Non testé |
| R05 | Lancer une attaque et défendre avant l’impact | La protection change les dégâts | | Non testé |
| R06 | Acheter avec trop peu de pièces | Bouton indisponible et solde inchangé | | Non testé |
| R07 | Recharger le même onglet | Reprise de la même équipe | | Non testé |
| R08 | Couper brièvement le Wi-Fi puis revenir | Message de coupure puis reprise ; horloge continue | | Non testé |
| R09 | Finir puis accepter une revanche | Résultat clair, nouvelle partie remise à zéro | | Non testé |
| R10 | Jouer une partie avec rotation du porte-parole | Chaque participant peut proposer une décision | | Non testé |
| R11 | Lire les commandes sur petit écran | Aucun texte essentiel tronqué | | Non testé |
| R12 | Jouer trois parties observées | Durées, compréhension et retours consignés | | Non testé |
| R13 | Lire le récapitulatif sur deux appareils | Le chronomètre attend les deux confirmations | | Non testé |
| R14 | Débloquer une attaque et regarder l’autre écran | Prix débité une fois ; construction puis déblocage visibles ; tir impossible trop tôt | | Non testé |
| R15 | Répondre avec les deux équipes avant 25 s | Résultat pendant 3 s, puis nouvelle question commune | | Non testé |
| R17 | Acheter plusieurs fois une même attaque puis essayer sans fonds | Prix affiché et débité progressif ; refus sans hausse de prix | | Non testé |
| R18 | Changer de couleur dans le camp et pendant la partie | Toits et drapeaux changent sur les deux écrans ; couleur adverse réservée | | Non testé |
| R19 | Mettre en pause avec chaque camp, recharger puis reprendre à deux | Tous les délais et états conservés ; reprise après deux accords | | Non testé |
| R20 | Jouer trois parties chronométrées | Au plus 15 min hors pauses ; destruction ou résultat expliqué par les PV | | Non testé |
| R16 | Double-cliquer sur le lanceur Windows avec ngrok configuré | Jeu et tunnel actifs, lien public accessible en 4G/5G | | Non testé |
| R21 | Scanner le QR de l’accueil et du camp sur téléphone | Accueil public ouvert ; code visible pour rejoindre ou regarder | | Non testé |
| R22 | Regarder par code et par lien sur deux appareils, puis recharger | Partie suivie sans commande ni portefeuille ; pause et revanche conservées | | Non testé |

## Fiche d’observation d’une partie

- Date et numéro :
- Animateur / observateur :
- Appareils, navigateurs et réseau :
- Nombre de participants par équipe :
- Temps de connexion :
- Durée de la partie :
- Bonnes réponses par équipe :
- Stratégies et équipements utilisés :
- Points d’incompréhension :
- Participation de chaque membre, sans classement individuel :
- Réponse à « L’activité vous a-t-elle fait coopérer ? » de 1 à 5 :
- Amélioration demandée par les joueurs :
- Décision de backlog après analyse :

## Modèle de défaut à reporter

**Titre :** __________ **Priorité :** bloquant / important / mineur

**Appareil et navigateur :** __________ **Étapes pour reproduire :** __________

**Attendu :** __________ **Observé :** __________ **Capture ou preuve :** __________

**Correction prévue :** __________ **Vérification après correction :** __________
