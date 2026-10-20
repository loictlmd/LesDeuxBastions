# Tests et équilibrage

## État de vérification au 20 octobre 2026

**38 tests automatisés** passent dans l’environnement Linux de développement : 34 tests du moteur et du contenu, un parcours HTTP réel et trois tests du lanceur avec un faux exécutable ngrok. Commande : `npm test`. Les trois tests de processus utilisant un exécutable Unix simulé sont ignorés sous Windows ; le double-clic réel du `.bat` reste à vérifier sur le PC.

Les contrôles couvrent :

- Les 144 questions distinctes, leurs quatre propositions et les huit thèmes de 18 questions.
- L’authentification, la limite de deux équipes, la confidentialité des clés et des solutions avant réponse.
- Le récapitulatif commun, les bonnes/mauvaises réponses, le bonus calculé avec l’heure du serveur, les délais et le ravitaillement versé une seule fois.
- Les gains réduits : 5 pièces de 0 à moins de 6 s ; 4 de 6 à moins de 12 s ; 3 de 12 à moins de 18 s ; 2 de 18 à moins de 25 s. Réponse erronée ou expirée : 0.
- Les recherches d’attaques, constructions, dépenses, impacts, boucliers, miroirs, réparations et recharges.
- Les tirs de plus en plus chers par type et par équipe : 8/16/24 pour les flèches, 18/31/44 pour les catapultes, 14/24/34 pour les éclairs et 10/18/26 pour le sabotage. Un achat refusé n’augmente jamais le prix ; les défenses gardent un prix fixe.
- Les cadres et libellés rouge/verrouillé, orange/construction, vert/débloqué.
- La pause demandée par l’un ou l’autre camp : tous les délais de jeu, les résultats, constructions, projectiles, protections, actions du bot, phases et forfaits restent gelés. La reprise attend les deux équipes connectées ; en démo, le bot confirme automatiquement. Les pauses successives se cumulent correctement et le rechargement conserve l’état.
- Les couleurs validées et réservées par équipe, visibles chez l’adversaire, ainsi que la recoloration réelle du SVG par HTTP.
- Les 300 PV initiaux, le siège à 8 min, les réparations fermées à 9 min et la première frappe de tempête à 9 min 10 s. La fin à 10 minutes de jeu effectif compare les PV restants ; une destruction simultanée reste une égalité. Les impacts exactement à la limite sont résolus avant le classement, sans créer de nouvelle question à 10 min.
- La reconnexion, l’abandon et les revanches : couleurs conservées, constructions et prix réinitialisés.
- Le lanceur ngrok : bon port, lien public, arrêt des processus, erreur ngrok et port occupé.

**Parcours navigateur vérifié :** deux sessions Chromium indépendantes, une mobile de 390 × 844 et une ordinateur de 1440 × 1000. Choix de couleurs dans le camp, couleur adverse indisponible, SVG synchronisé, récapitulatif, construction, vérification des bordures rouge/vert, pause pendant construction puis en vol, boutons désactivés pendant la pause, reprise à deux, changement de couleur et rechargement pendant une pause, prix du prochain tir, impact absorbé par un bouclier, fin à 10 minutes actives puis revanche. Aucun débordement horizontal ni erreur JavaScript constaté. Les captures ont été inspectées.

**Limites :** pas de recette physique iPhone/Android, d’essai sur le Wi-Fi du cours, ni d’ouverture d’un vrai tunnel avec le compte ngrok du groupe depuis cet environnement. Les contrôles du lanceur ne valident pas le double-clic Windows, les quotas ou les autorisations ngrok. La fin à dix minutes du parcours navigateur a été accélérée avec l’horloge de test ; elle ne constitue pas une partie humaine de dix minutes.

## Choix d’équilibrage

Les gains passent de 8–20 à 2–5 pièces, avec une pièce de ravitaillement par nouvelle manche. Le bonus de rapidité reste présent. Le prix progressif décourage la répétition d’une seule attaque et pousse à varier les constructions. Les châteaux passent de 120 à 300 PV. Une limite explicite de dix minutes assure une conclusion, en excluant le temps passé en pause.

L’atelier coûte désormais 20 pièces, restaure 8 PV et se recharge en 30 secondes. Dans un premier essai, l’ancienne réparation donnait 94 victoires sur 100 à la politique défensive contre la politique mixte ; après ajustement, ce scénario donne 44 victoires défensives, 51 adverses et 5 égalités. Cette modification évite que l’objectif de conserver des PV à la limite favorise excessivement la réparation répétée.

## Simulations reproductibles

Commande : `npm run simulate`. Graine des décisions : 20261019. Neuf scénarios de 100 matchs, **900 au total**, avec des réponses après 2, 10 ou 20 secondes. Les agents décident toutes les 500 ms et alternent leur ordre d’action ; ils paient les constructions et les prix progressifs. Ils utilisent la solution connue pour simuler une probabilité de réussite. La politique variée compare le rendement courant des différentes attaques ; la politique flèches répète uniquement les flèches.

| Stratégies A / B | Réussite A / B | Réponse après | Victoires A / B / égalités | Min. | Médiane | Max. |
|---|---|---|---|---|---|---|
| Mixte / Mixte | 65 % / 65 % | 10 s | 34 / 37 / 29 | 10:00 | 10:00 | 10:00 |
| Flèches / Mixte | 65 % / 65 % | 10 s | 0 / 100 / 0 | 10:00 | 10:00 | 10:00 |
| Défensive / Mixte | 65 % / 65 % | 10 s | 44 / 51 / 5 | 10:00 | 10:00 | 10:00 |
| Mixte / Mixte | 80 % / 40 % | 10 s | 94 / 6 / 0 | 10:00 | 10:00 | 10:00 |
| Mixte / Mixte | 0 % / 0 % | 10 s | 0 / 0 / 100 | 10:00 | 10:00 | 10:00 |
| Variée / Variée | 65 % / 65 % | 10 s | 30 / 40 / 30 | 10:00 | 10:00 | 10:00 |
| Variée / Mixte | 65 % / 65 % | 10 s | 46 / 54 / 0 | 10:00 | 10:00 | 10:00 |
| Variée / Variée | 100 % / 100 % | 2 s | 0 / 0 / 100 | 9:03 | 9:03 | 9:03 |
| Variée / Variée | 65 % / 65 % | 20 s | 22 / 25 / 53 | 10:00 | 10:00 | 10:00 |

Les 900 matchs se terminent entre **9 min 03 s et 10 min**. Les huit scénarios à réponses de 10 ou 20 secondes arrivent à dix minutes ; le scénario symétrique parfait à deux secondes se termine par une destruction simultanée à 9 min 03 s. Cette plage décrit ces simulations, pas une garantie de durée minimale pour toutes les stratégies humaines. Une destruction, un abandon ou un forfait peut terminer une partie plus tôt ; les pauses prolongent le temps réel de la séance.

La politique « flèches uniquement » est dominée par la politique mixte : la hausse du prix pénalise volontairement cette répétition. Les politiques variée et mixte obtiennent des résultats proches dans leur confrontation (46 / 54). Les égalités fréquentes dans les scénarios symétriques viennent notamment du timing identique des agents et de la faible variété de leurs décisions. Le classement aux PV favorise aussi la conservation des ressources et le bon timing défensif : l’équilibrage doit encore être confronté aux joueurs.

Ces mesures remplacent celles des règles précédentes. Elles ne reproduisent ni les discussions humaines, ni la latence du Wi-Fi ou d’un tunnel.

## Recette à réaliser par le groupe

À remplir pendant les essais, sans reprendre les résultats automatisés comme des observations humaines.

| ID | Scénario sur le matériel réel | Résultat attendu | Résultat observé / preuve | Statut |
|---|---|---|---|---|
| R01 | Lancer le jeu à partir du guide | Un membre y parvient seul | | Non testé |
| R02 | Relier les deux téléphones au serveur | La page s’ouvre sur les deux | | Non testé |
| R03 | Créer, rejoindre, se déclarer prêt | Les noms et la manche correspondent | | Non testé |
| R04 | Répondre juste rapidement, puis plus tard ; essayer une erreur | Gain de 2 à 5 selon la rapidité ; 0 après erreur ; animation | | Non testé |
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
| R20 | Jouer trois parties chronométrées | Durée proche de 10 min hors pauses ; résultat expliqué par les PV | | Non testé |
| R16 | Double-cliquer sur le lanceur Windows avec ngrok configuré | Jeu et tunnel actifs, lien public accessible en 4G/5G | | Non testé |

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
