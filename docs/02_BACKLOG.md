# Product Backlog initial

Ordre proposé à confirmer par le Product Owner. « Implémenté » signifie présent et vérifié techniquement ; « À valider en recette » ne signifie pas « Done » selon la définition de votre groupe. Les estimations ci-dessous sont indicatives, en points relatifs, à refaire ensemble ; elles ne représentent ni des heures ni du travail déjà planifié.

| Ordre / ID | User story | Points proposés | État au 20/10/2026 |
|---|---|---:|---|
| 1 · US01 | En tant qu’équipe, je veux créer ou rejoindre une partie par code pour affronter la bonne équipe. | 3 | Implémenté, à valider en recette |
| 2 · US02 | En tant qu’équipe, je veux confirmer ma présence avant un démarrage commun pour commencer à égalité. | 2 | Implémenté, à valider en recette |
| 3 · US03 | En tant qu’équipe, je veux une question commune et une récompense selon la rapidité pour gagner des ressources équitablement. | 5 | Implémenté, à valider en recette |
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
| 14 · US14 | En tant qu’animateur, je veux faire jouer des équipes sur des réseaux différents. | À estimer | Tunnel ngrok intégré au lanceur ; connexion réelle à valider, hébergement permanent non réalisé |
| 15 · US15 | En tant que spectateur, je veux regarder une partie par code ou lien sans occuper une équipe. | 3 | Implémenté, à valider sur vrais mobiles |
| 16 · US16 | En tant que participant, je veux scanner un QR code pour ouvrir l’accueil et saisir le code de partie. | 2 | Implémenté, destination décodée et vérifiée |

## Critères d’acceptation

### US01 — Accès à une partie

- Étant donné un nom d’équipe valide, créer un camp fournit un code de six caractères.
- Un second téléphone utilisant ce code rejoint le même camp et voit les deux noms.
- Une troisième équipe est refusée avec un message compréhensible.
- Un code inconnu ne crée pas de partie involontairement.

### US02 — Démarrage commun

- Seule l’équipe créatrice peut lancer ; deux équipes connectées et prêtes sont nécessaires.
- Les deux villages commencent avec 300 PV et 12 pièces. Un pop-up récapitulatif attend la validation des deux équipes avant de démarrer le chronomètre.
- Les horloges sont fondées sur le serveur, sans dépendre de l’heure des téléphones.

### US03 — Quiz et ressources

- Les deux équipes voient la même question et les mêmes propositions dans chaque manche.
- Répondre est possible pendant 25 secondes. Après deux réponses, le résultat dure 3 secondes puis la question suivante arrive ; sinon la manche dure 30 secondes.
- Une bonne réponse donne entre 3 et 6 pièces selon le temps serveur, une seule fois, avec une animation du gain ; une mauvaise réponse n’en donne aucune.
- Une réponse en retard, répétée ou destinée à l’ancienne manche est refusée.
- Le ravitaillement de 1 pièce arrive une seule fois par nouvelle manche.

### US04 / US05 — Équipements

- Chaque achat déduit exactement son prix et respecte le solde et les délais. Chaque attaque nécessite un déblocage payé une seule fois, suivi de sa construction ; la progression et le déblocage sont visibles sur les deux bastions.
- Une attaque n’applique ses dégâts qu’au moment de son impact. Chaque achat de tir augmente son prix pour cette équipe et cette attaque uniquement ; un achat refusé ne fait pas monter le prix. Un cadre rouge, orange ou vert et un libellé indiquent le déblocage.
- L’éclair traverse les boucliers ; le sabotage les réduit ; le miroir ne déclenche pas une boucle de renvois.
- Le bouclier ne dépasse pas 36 points et expire ; la réparation ne dépasse pas 300 PV et ferme pendant la tempête.

### US06 / US12 — Lisibilité

- Pas de défilement horizontal à 390 px de large ; noms et propositions restent lisibles avec les textes agrandis.
- Les descriptions d’attaque indiquent les dégâts et le délai d’impact ; le prix actuel reste sur le bouton, avec l’état verrouillé, en construction ou débloqué.
- Le solde, le compte à rebours et les attaques entrantes restent accessibles pendant les achats.
- La bonne réponse et les états d’attente utilisent aussi un texte ou un symbole, pas uniquement une couleur.
- Les commandes principales fonctionnent au clavier et au toucher ; tests physiques à consigner.

### US07 / US08 — Fin et reprise

- Un village à zéro PV termine la partie ; une destruction simultanée affiche une égalité.
- Aucun achat après la fin ; la revanche requiert les deux accords, remet les compteurs et les déblocages et les prix à zéro, conserve les couleurs, puis réaffiche le récapitulatif.
- Le même onglet retrouve son équipe après rechargement, avec ses ressources et son historique conservés.
- Une absence prolongée de 90 secondes donne une victoire par forfait à l’équipe restée connectée.

### US09 / US10 / US11 — Mise en situation

- Un membre du groupe autre que l’auteur lance le jeu en suivant seulement le guide.
- Trois parties sont observées sur les appareils choisis ; les difficultés et durées sont notées.
- Les résultats sont présentés en review et au moins une amélioration est priorisée dans le backlog.
- Chaque partie comprend une rotation de porte-parole et un court débrief.

## Compléments — pause, couleurs et durée

- Chaque équipe choisit parmi six couleurs dans le camp ou en cours de bataille ; le choix recolore le château sur les deux écrans. Une couleur déjà prise reste réservée à son équipe.
- Les deux camps disposent du bouton Pause. Tous les délais de jeu et le forfait pour absence sont gelés pendant la pause. La reprise nécessite l’accord des deux camps connectés ; le bot confirme automatiquement.
- Un rechargement conserve la pause, les couleurs, les prix et les ressources. Aucune réponse ni dépense pendant la pause.
- Les bastions commencent avec 300 PV. Le siège commence à 8 min, les réparations ferment à 9 min, la tempête frappe à partir de 9 min 10 s.
- La limite est fixée à 15 minutes de jeu effectif, hors pauses. Un bastion détruit perd avant cette limite ; sinon le plus grand nombre de PV détermine le gagnant. PV égaux : égalité.
- L’atelier coûte 20 pièces et restaure 8 PV, avec une recharge de 30 s, afin de limiter la domination d’une stratégie reposant uniquement sur les réparations.

## Spectateurs et QR code

- L’onglet Regarder accepte un code valide, sans nom d’équipe. Un lien `/?watch=CODE` ouvre directement la vue spectateur, dans le camp ou pendant la partie.
- Les spectateurs voient les bastions, les constructions, les projectiles, les questions, le journal et les résultats. Ils ne prennent aucune place dans les deux camps et ne peuvent ni répondre, ni acheter, ni mettre en pause, ni changer de couleur ou décider d’une revanche.
- L’API publique de consultation ne transmet ni jeton, ni portefeuille, ni prix privés. La solution reste cachée jusqu’à la fermeture des réponses ou la fin du délai. Les consultations n’entretiennent pas la présence des joueurs et ne retardent pas leur forfait.
- Le même onglet conserve le mode spectateur après rechargement et suit les revanches. Un code inconnu affiche une erreur compréhensible.
- Un QR code est visible dans le camp à côté du code. Il encode `https://mocker-hamper-prodigy.ngrok-free.dev/`, l’accueil du site ; le participant saisit ensuite le code pour rejoindre ou regarder.

## Interface et langue

- À partir de 1001 px de large, le visuel et le quiz sont côte à côte, visuel à gauche ; l’arsenal occupe la rangée suivante. Le bandeau de manche est arrondi et utilise les couleurs du site.
- Le header propose FR / EN sur toutes les vues. Le choix persiste après rechargement ; les champs déjà saisis, l’équipe, la réponse et la pause sont conservés.
- Les 144 questions ont des traductions anglaises ; l’ordre des propositions reste identique entre les langues. Les explications ne sont révélées qu’aux moments prévus par les règles. Les noms personnalisés des équipes restent tels que saisis.
- L’accueil propose « Jouer contre l’IA », sans QR, bloc de connexion ni note de durée. Le camp conserve son code, son QR et le bouton de copie d’invitation ; les liens visibles et les commandes de partage spectateur y sont supprimés.
- Le QR pointe encore vers l’adresse ngrok fournie, jusqu’à communication du nouveau domaine public.
