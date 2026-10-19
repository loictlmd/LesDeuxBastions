# Tests et équilibrage

## État de vérification au 19 octobre 2026

**17 tests automatisés passent** avec `node --test`, dont un parcours HTTP réel. Ils contrôlent :

- Le contenu des 72 questions et la sélection sans répétition dans un paquet.
- L’accès avec une clé de session, la limite de deux équipes, l’absence des solutions avant réponse et l’absence des clés dans les états partagés.
- Les prérequis au démarrage et les mêmes conditions initiales.
- Le gain unique, les mauvaises réponses, la clôture à 25 secondes et le passage de manche.
- Le coût, la recharge, l’impact différé et la possibilité de défendre pendant le vol.
- L’éclair, le sabotage, le miroir, les plafonds de PV/bouclier et leur expiration.
- Le siège, la tempête, les destructions simultanées et la revanche.
- Le rechargement de l’état, le forfait après absence et le transfert de l’organisation du camp si l’équipe créatrice part avant le début.
- Les réponses simultanées, le refus d’une origine HTTP étrangère et les messages d’erreur pour une requête invalide.

**Parcours navigateur vérifié :** deux sessions Chromium indépendantes, affichages mobiles de 390 × 844 et 393 × 852, affichage ordinateur de 1440 × 1050. Création, invitation, deux équipes prêtes, démarrage, question identique, récompenses, flèches absorbées par un bouclier, éclair traversant la protection, rechargement, victoire par abandon et démo automatique. Aucune erreur JavaScript ni débordement horizontal relevé pendant ce parcours. Les captures ont été inspectées et une erreur de style sur les contours des boutons a été corrigée.

**Limites :** aucune recette physique iPhone/Android ni essai sur le Wi-Fi du cours à ce stade. Les tests ne constituent ni une validation pédagogique du groupe ni une mesure de satisfaction des participants.

## Intention d’équilibrage

| Choix | Effet recherché |
|---|---|
| Ressources, règles et questions communes | Éviter un avantage structurel d’une équipe |
| +12 pièces pour une bonne réponse | Récompenser nettement les connaissances et la discussion |
| +3 pièces par nouvelle manche | Permettre de continuer à agir malgré quelques erreurs |
| Flèches peu chères, catapulte plus rentable et plus lente | Donner le choix entre fréquence et économie de ressources |
| Éclair plus cher par dégât mais perforant | Contrer les réserves de bouclier |
| Sabotage spécialisé contre les boucliers | Inciter à regarder l’état adverse avant d’acheter |
| Défenses temporaires, réparations moins efficaces | Récompenser le bon timing sans rendre l’immobilisme optimal |
| Siège puis tempête sans réparation | Assurer une conclusion dans la fenêtre de l’animation |

La défense seule ne peut pas gagner : il faut aussi faire tomber le village adverse. La stratégie doit rester un choix de groupe ; le prochain sprint doit vérifier si un équipement est trop rarement utile ou difficile à comprendre.

## Simulations reproductibles

Commande : `node scripts/simulate.mjs`. Graine des décisions : 20261019. 100 matchs par scénario, 500 au total. Les agents prennent des décisions toutes les 500 ms, répondent après 10 secondes et alternent leur ordre d’action. Ils ne simulent ni la discussion humaine ni la latence du Wi-Fi. Les questions sont brassées par le moteur ; les agents utilisent la solution connue pour simuler une probabilité de réussite.

| A contre B | Réussite A / B | Victoires A / B / égalités | Médiane | Maximum observé |
|---|---|---|---|---|
| Mixte / Mixte | 65 % / 65 % | 42 / 35 / 23 | 3 min 17 s | 5 min 47 s |
| Flèches / Mixte | 65 % / 65 % | 37 / 63 / 0 | 2 min 44 s | 3 min 48 s |
| Défensive / Mixte | 65 % / 65 % | 6 / 91 / 3 | 5 min 37 s | 7 min 17 s |
| Mixte / Mixte | 80 % / 40 % | 92 / 2 / 6 | 3 min 17 s | 5 min 47 s |
| Mixte / Mixte | 0 % / 0 % | 0 / 0 / 100 | 6 min 50 s | 6 min 50 s |

Les 500 matchs se terminent. Les fortes proportions d’égalité dans les cas symétriques viennent notamment du timing identique des agents. La stratégie « Défensive » privilégie les réparations et le bouclier avant d’économiser pour une catapulte : son faible taux de victoire montre que cette politique précise ne suffit pas, sans démontrer que toutes les façons de se défendre sont mauvaises. Ces résultats justifient une base d’essai, pas l’affirmation d’un équilibrage définitif.

## Recette à réaliser par le groupe

À remplir pendant les essais, sans reprendre les résultats automatisés comme des observations humaines.

| ID | Scénario sur le matériel réel | Résultat attendu | Résultat observé / preuve | Statut |
|---|---|---|---|---|
| R01 | Lancer le jeu à partir du guide | Un membre y parvient seul | | Non testé |
| R02 | Relier les deux téléphones au serveur | La page s’ouvre sur les deux | | Non testé |
| R03 | Créer, rejoindre, se déclarer prêt | Les noms et la manche correspondent | | Non testé |
| R04 | Choisir une bonne et une mauvaise réponse | +12 pièces pour la bonne seulement | | Non testé |
| R05 | Lancer une attaque et défendre avant l’impact | La protection change les dégâts | | Non testé |
| R06 | Acheter avec trop peu de pièces | Bouton indisponible et solde inchangé | | Non testé |
| R07 | Recharger le même onglet | Reprise de la même équipe | | Non testé |
| R08 | Couper brièvement le Wi-Fi puis revenir | Message de coupure puis reprise ; horloge continue | | Non testé |
| R09 | Finir puis accepter une revanche | Résultat clair, nouvelle partie remise à zéro | | Non testé |
| R10 | Jouer une partie avec rotation du porte-parole | Chaque participant peut proposer une décision | | Non testé |
| R11 | Lire les commandes sur petit écran | Aucun texte essentiel tronqué | | Non testé |
| R12 | Jouer trois parties observées | Durées, compréhension et retours consignés | | Non testé |

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
