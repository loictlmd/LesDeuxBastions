# Product Backlog initial

Ordre proposé à confirmer par le Product Owner. « Implémenté » signifie présent et vérifié techniquement ; « À valider en recette » ne signifie pas « Done » selon la définition de votre groupe. Les estimations ci-dessous sont indicatives, en points relatifs, à refaire ensemble ; elles ne représentent ni des heures ni du travail déjà planifié.

| Ordre / ID | User story | Points proposés | État au 19/10/2026 |
|---|---|---:|---|
| 1 · US01 | En tant qu’équipe, je veux créer ou rejoindre une partie par code pour affronter la bonne équipe. | 3 | Implémenté, à valider en recette |
| 2 · US02 | En tant qu’équipe, je veux confirmer ma présence avant un démarrage commun pour commencer à égalité. | 2 | Implémenté, à valider en recette |
| 3 · US03 | En tant qu’équipe, je veux une question commune toutes les 30 secondes et une récompense contrôlée pour gagner des ressources équitablement. | 5 | Implémenté, à valider en recette |
| 4 · US04 | En tant qu’équipe, je veux choisir entre plusieurs attaques pour adapter ma stratégie à la défense adverse. | 5 | Implémenté, à valider en recette |
| 5 · US05 | En tant qu’équipe, je veux protéger ou réparer mon village pour réagir aux attaques. | 5 | Implémenté, à valider en recette |
| 6 · US06 | En tant que joueur, je veux voir les points de vie et les attaques en approche pour comprendre la situation. | 3 | Implémenté, à valider sur vrais mobiles |
| 7 · US07 | En tant qu’équipe, je veux une fin de partie claire et une revanche pour poursuivre l’animation. | 3 | Implémenté, à valider en recette |
| 8 · US08 | En tant que joueur, je veux retrouver mon équipe après un rechargement pour ne pas perdre la partie sur une erreur de manipulation. | 3 | Implémenté, à valider sur le réseau du cours |
| 9 · US09 | En tant qu’animateur, je veux un démarrage local documenté pour installer le jeu sans compte externe. | 2 | Fourni, essai de lancement à faire par le groupe |
| 10 · US10 | En tant que participant, je veux un temps de discussion et un débrief pour apprendre de la coopération. | 3 | Consignes présentes ; bénéfice collectif à évaluer |
| 11 · US11 | En tant que groupe projet, je veux observer des joueurs pour prioriser les prochaines améliorations. | 3 | À faire : 3 parties observées |
| 12 · US12 | En tant que joueur, je veux des textes et commandes lisibles sur mon téléphone pour agir facilement. | 3 | Interface adaptée ; recette iOS/Android à faire |
| 13 · US13 | En tant qu’animateur, je veux choisir la difficulté ou les thèmes pour adapter le jeu au public. | À estimer | Évolution non implémentée |
| 14 · US14 | En tant qu’animateur, je veux faire jouer des équipes sur des réseaux différents. | À estimer | Hébergement Internet non réalisé |

## Critères d’acceptation

### US01 — Accès à une partie

- Étant donné un nom d’équipe valide, créer un camp fournit un code de six caractères.
- Un second téléphone utilisant ce code rejoint le même camp et voit les deux noms.
- Une troisième équipe est refusée avec un message compréhensible.
- Un code inconnu ne crée pas de partie involontairement.

### US02 — Démarrage commun

- Seule l’équipe créatrice peut lancer ; deux équipes connectées et prêtes sont nécessaires.
- Les deux villages commencent avec 120 PV et 12 pièces.
- Les horloges sont fondées sur le serveur, sans dépendre de l’heure des téléphones.

### US03 — Quiz et ressources

- Les deux équipes voient la même question et les mêmes propositions dans chaque manche.
- Une nouvelle question commence toutes les 30 secondes ; répondre est possible pendant 25 secondes.
- Une bonne réponse donne 12 pièces une seule fois ; une mauvaise réponse n’en donne aucune.
- Une réponse en retard, répétée ou destinée à l’ancienne manche est refusée.
- Le ravitaillement de 3 pièces arrive une seule fois par nouvelle manche.

### US04 / US05 — Équipements

- Chaque achat déduit exactement son prix et respecte le solde et les délais.
- Une attaque n’applique ses dégâts qu’au moment de son impact.
- L’éclair traverse les boucliers ; le sabotage les réduit ; le miroir ne déclenche pas une boucle de renvois.
- Le bouclier ne dépasse pas 36 points et expire ; la réparation ne dépasse pas 120 PV et ferme pendant la tempête.

### US06 / US12 — Lisibilité

- Pas de défilement horizontal à 390 px de large ; noms et propositions restent lisibles.
- Le solde, le compte à rebours et les attaques entrantes restent accessibles pendant les achats.
- La bonne réponse et les états d’attente utilisent aussi un texte ou un symbole, pas uniquement une couleur.
- Les commandes principales fonctionnent au clavier et au toucher ; tests physiques à consigner.

### US07 / US08 — Fin et reprise

- Un village à zéro PV termine la partie ; une destruction simultanée affiche une égalité.
- Aucun achat après la fin ; la revanche requiert les deux accords et remet les compteurs à zéro.
- Le même onglet retrouve son équipe après rechargement, avec ses ressources et son historique conservés.
- Une absence prolongée de 90 secondes donne une victoire par forfait à l’équipe restée connectée.

### US09 / US10 / US11 — Mise en situation

- Un membre du groupe autre que l’auteur lance le jeu en suivant seulement le guide.
- Trois parties sont observées sur les appareils choisis ; les difficultés et durées sont notées.
- Les résultats sont présentés en review et au moins une amélioration est priorisée dans le backlog.
- Chaque partie comprend une rotation de porte-parole et un court débrief.
