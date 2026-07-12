# Space Runner

## Présentation

**Space Runner** est le troisième mini-jeu du projet **OG Game Challenge**.

Il s'agit d'un shoot'em up spatial développé entièrement en **JavaScript Vanilla** à l'aide de l'API **Canvas 2D**, sans moteur de jeu externe.

Le joueur pilote un vaisseau spatial dans une progression composée de plusieurs niveaux, affronte différents types d'ennemis, récupère des améliorations permanentes et termine son aventure en combattant trois boss possédant chacun leurs propres mécaniques.

Contrairement à un shoot'em up infini classique, Space Runner possède une véritable progression, une montée en difficulté contrôlée ainsi qu'une fin scénarisée.

Le projet a également servi d'exercice complet autour de la programmation orientée objet, de la conception d'une boucle de jeu, de la gestion d'états et de l'architecture modulaire.

---

# Objectifs du projet

Le développement de Space Runner poursuivait plusieurs objectifs :

- apprendre à construire un jeu sans framework ;
- comprendre le fonctionnement d'une boucle de jeu temps réel ;
- appliquer les principes de la programmation orientée objet en JavaScript ;
- produire un code facilement maintenable ;
- intégrer le jeu dans le site OG Game Challenge ;
- transmettre automatiquement le score final au leaderboard.

Le projet devait également rester suffisamment modulaire afin de permettre l'ajout progressif de nouvelles mécaniques sans devoir réécrire l'ensemble du code.

---

# Philosophie du gameplay

Le jeu ne cherche volontairement pas à reproduire un Bullet Hell moderne.

L'objectif est de proposer un gameplay :

- arcade ;
- rétro ;
- lisible ;
- progressif ;
- exigeant sans devenir injuste.

La difficulté n'augmente pas uniquement grâce à une hausse des points de vie ou de la vitesse des ennemis.

Chaque nouvel ennemi apporte une mécanique différente que le joueur doit apprendre à maîtriser.

Cette philosophie permet de renouveler constamment le gameplay.

Par exemple :

| Ennemi | Rôle principal |
|---------|----------------|
| Ennemi rouge | Pression verticale permanente |
| Ennemi bleu | Contrôle horizontal de l'écran |
| Météore | Obstacle destructible |
| Steel Eye | Charge ciblée |
| Eye Boss | Premier combat scénarisé |
| Giant Worm | Combat centré sur l'esquive |
| Dragon | Combat final en trois phases |

Le joueur apprend progressivement chaque mécanique avant de devoir les combiner.

---

# Objectif du joueur

Le joueur doit survivre jusqu'au boss final.

Pendant la partie, il peut :

- détruire les ennemis ;
- esquiver les projectiles ;
- éviter les collisions ;
- récupérer des bonus ;
- améliorer définitivement son armement ;
- battre les trois boss.

Le score augmente grâce :

- au temps de survie ;
- aux ennemis détruits ;
- aux météores détruits ;
- aux boss vaincus.

La partie se termine lorsque :

- le joueur meurt ;
- ou le boss final est vaincu.

Le score final est ensuite transmis au système de leaderboard du site.

---

# Technologies utilisées

Le projet repose uniquement sur des technologies natives.

## Frontend

- HTML5
- CSS3
- JavaScript ES6
- Canvas 2D

## Backend

- Flask
- API REST
- SQLite

## Outils

- Git
- GitHub
- Visual Studio Code

Aucun moteur de jeu externe n'a été utilisé.

Toute la logique repose uniquement sur :

- les modules ES6 ;
- les classes JavaScript ;
- requestAnimationFrame();
- les transformations Canvas ;
- les collisions ;
- les machines à états.

---

# Architecture générale

L'architecture a volontairement été découpée en nombreux fichiers afin que chaque classe possède une responsabilité précise.

```text
frontend/
└── js/
    └── games/
        └── space_runner/
            ├── main.js
            ├── game.js
            ├── config.js
            ├── input.js
            ├── player.js
            ├── background.js
            ├── finalBossBackground.js
            ├── bullets.js
            ├── enemies.js
            ├── sideEnemies.js
            ├── steelEyeEnemy.js
            ├── meteors.js
            ├── bonuses.js
            ├── collision.js
            ├── bosses.js
            ├── bossProjectiles.js
            ├── dragonFireballs.js
            ├── dragonBeams.js
            ├── dragonLasers.js
            ├── victoryPortal.js
            └── ...
```

L'objectif était d'éviter un unique fichier JavaScript contenant plusieurs milliers de lignes.

Chaque classe encapsule sa propre logique.

---

# Architecture des Boss

Les boss ont été conçus indépendamment les uns des autres.

Chaque boss possède :

- son propre comportement ;
- ses propres attaques ;
- ses propres règles ;
- ses propres collisions.

Cette séparation permet de modifier un boss sans impacter les autres.

## Boss 1 — Eye Boss

Combat basé sur :

- les projectiles ;
- le placement ;
- une cadence de tir évolutive.

---

## Boss 2 — Giant Worm

Combat basé sur :

- les déplacements ;
- l'anticipation ;
- les collisions avec le corps du ver.

Le danger provient principalement du mouvement du boss.

---

## Boss 3 — Dragon

Combat entièrement découpé en trois phases.

Chaque phase possède :

- des attaques différentes ;
- une stratégie différente ;
- un rythme différent.

Cette architecture rend le boss final beaucoup plus riche qu'un simple ennemi possédant davantage de points de vie.

---

# Fonctionnement général du jeu

Le moteur du jeu repose sur deux méthodes exécutées à chaque image.

```text
update()

↓

draw()
```

## update()

Cette méthode met à jour l'ensemble du jeu.

Elle gère notamment :

- les déplacements ;
- les collisions ;
- les timers ;
- les niveaux ;
- les spawns ;
- les attaques ;
- les boss ;
- les bonus ;
- les projectiles ;
- les explosions.

Aucun dessin n'est effectué ici.

---

## draw()

Une fois tous les calculs réalisés, le jeu redessine entièrement le Canvas.

L'ordre de dessin est important.

Par exemple :

- fond ;
- effets spéciaux ;
- ennemis ;
- boss ;
- projectiles ;
- joueur ;
- interface.

Cette séparation rend le code plus lisible et facilite énormément le débogage.

---

# La boucle principale

Le jeu repose sur :

```js
requestAnimationFrame()
```

Cette fonction demande au navigateur de rappeler automatiquement la boucle de jeu avant chaque rafraîchissement de l'écran.

Chaque image suit toujours le même cycle :

```text
Calcul

↓

Déplacements

↓

Collisions

↓

Nettoyage

↓

Affichage
```

Cette architecture garantit que le jeu reste fluide tout en conservant une logique parfaitement déterministe.

---

# Classe Game

La classe `Game` constitue le cœur du projet.

Elle orchestre l'ensemble des autres classes.

Ses responsabilités sont nombreuses :

- démarrer une partie ;
- réinitialiser le jeu ;
- lancer la boucle principale ;
- gérer le score ;
- gérer les niveaux ;
- créer les ennemis ;
- créer les boss ;
- gérer les bonus ;
- gérer toutes les collisions ;
- gérer les explosions ;
- gérer le Game Over ;
- gérer la victoire finale.

Toutes les mécaniques du jeu passent par cette classe.

En revanche, les comportements spécialisés restent délégués à leurs propres classes afin de limiter les dépendances.

---

# Responsabilités des principales classes

## main.js

Point d'entrée du jeu.

Il récupère les éléments HTML :

- le canvas ;
- le score ;
- le niveau ;
- le bouton Start ;
- les messages.

Il crée ensuite une instance de `Game`.

---

## player.js

Cette classe représente le joueur.

Elle gère :

- les déplacements ;
- le dessin du vaisseau ;
- la hitbox ;
- le bouclier ;
- les améliorations de tir ;
- les animations.

---

## input.js

Centralise toutes les entrées clavier.

Les événements `keydown` et `keyup` ne modifient qu'un objet partagé.

Le joueur ne lit ensuite que cet état.

Cette approche évite de mélanger la logique clavier avec la logique du joueur.

---

## background.js

Dessine le fond étoilé animé.

Le fond est indépendant du reste du jeu.

Il continue donc à fonctionner quelles que soient les autres mécaniques.

---

## finalBossBackground.js

Utilisé uniquement pendant le niveau 15.

Il ajoute des flammes colorées derrière le gameplay afin de modifier complètement l'ambiance du combat final.

Une attention particulière a été portée aux performances afin d'éviter les ralentissements.

---

## collision.js

Contient la fonction générique de collision AABB.

```js
export function isColliding(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}
```

Cette méthode est utilisée dans la majorité des collisions du jeu.

Certaines attaques particulières utilisent cependant un autre système.

Par exemple :

- DragonBeam
- DragonLaser

Ces deux attaques utilisent une collision basée sur la distance entre le joueur et une ligne, ce qui est beaucoup plus adapté qu'une simple hitbox rectangulaire.

---

# Développement par sprints

Le projet n'a jamais été développé d'un seul bloc.

Chaque fonctionnalité importante a été découpée en petits objectifs.

Chaque sprint suivait toujours la même méthode :

1. conception ;
2. implémentation ;
3. tests ;
4. corrections ;
5. validation ;
6. commit Git.

Cette méthode a permis :

- d'éviter les grosses régressions ;
- de tester chaque mécanique indépendamment ;
- de conserver un historique Git clair ;
- de construire progressivement une architecture solide.

La seconde partie du README détaillera l'ensemble des sprints ayant conduit à la version finale du jeu.

# Développement du projet

Le développement de Space Runner a été réalisé progressivement.

Plutôt que de construire toutes les mécaniques en une seule fois, le jeu a été développé par petits sprints.

Chaque sprint introduisait une nouvelle fonctionnalité, immédiatement testée avant de passer à la suivante.

Cette approche a permis de :

- conserver un code stable ;
- limiter les régressions ;
- faciliter le débogage ;
- construire progressivement une architecture modulaire.

---

# Sprint 1 — Mise en place du moteur

La première version du jeu était volontairement très simple.

Elle contenait uniquement :

- un canvas ;
- un fond noir ;
- quelques étoiles ;
- un vaisseau triangulaire ;
- un bouton Start.

L'objectif n'était pas encore de créer un gameplay.

Ce premier sprint servait uniquement à vérifier :

- le fonctionnement de Canvas ;
- le chargement des modules JavaScript ;
- la boucle principale ;
- le système de rendu.

Une fois ces bases validées, toutes les autres fonctionnalités ont pu être ajoutées progressivement.

---

# Sprint 2 — Déplacements du joueur

Le joueur peut désormais déplacer son vaisseau.

Les premiers déplacements étaient uniquement horizontaux.

Puis le jeu a évolué vers un déplacement complet :

- gauche ;
- droite ;
- haut ;
- bas ;
- diagonales.

## Normalisation du déplacement

Un problème classique apparaît lorsqu'un joueur peut se déplacer en diagonale.

Sans correction, la vitesse devient plus importante.

Pour éviter cela, le vecteur est normalisé.

```js
if (dx !== 0 && dy !== 0) {
    dx *= 0.707;
    dy *= 0.707;
}
```

Cette valeur correspond à :

```text
1 / √2
```

Le joueur conserve ainsi exactement la même vitesse dans toutes les directions.

---

# Sprint 3 — Premier système de tir

Le joueur peut désormais tirer.

Chaque projectile :

- apparaît au niveau du vaisseau ;
- monte verticalement ;
- disparaît hors du canvas.

Afin d'éviter une création infinie de projectiles, un système de cooldown est utilisé.

```js
if (this.shootCooldown > 0) {
    this.shootCooldown--;
}
```

Lorsque le cooldown atteint zéro, un nouveau tir peut être créé.

Cette mécanique sera ensuite réutilisée pour tous les ennemis ainsi que pour les boss.

---

# Sprint 4 — Premiers ennemis

Le premier ennemi introduit est l'ennemi rouge.

Son comportement reste volontairement simple.

Il apparaît aléatoirement en haut de l'écran puis descend verticalement.

Il permet de valider :

- le système de spawn ;
- la mise à jour simultanée de plusieurs objets ;
- les collisions ;
- le score.

Le joueur découvre ainsi la mécanique principale du jeu.

---

# Sprint 5 — Collisions et score

Une fois les ennemis présents, les collisions ont été ajoutées.

Le système repose principalement sur une collision AABB.

Lorsqu'un projectile touche un ennemi :

- le projectile devient inactif ;
- l'ennemi devient inactif ;
- une explosion apparaît ;
- le score augmente.

Les objets inactifs sont ensuite supprimés automatiquement.

```js
this.enemies = this.enemies.filter(
    enemy => enemy.active
);
```

Cette technique évite d'accumuler inutilement des objets en mémoire.

---

# Sprint 6 — Système d'explosions

Chaque destruction génère une petite explosion.

Les explosions sont entièrement dessinées en Canvas.

Elles reposent simplement sur :

- un rayon qui augmente ;
- une durée de vie ;
- une opacité décroissante.

Aucune image n'est utilisée.

Ce choix permet de conserver un style graphique homogène avec le reste du jeu.

---

# Sprint 7 — Progression du niveau

La difficulté augmente automatiquement avec le temps.

Le niveau est calculé grâce au nombre de frames écoulées.

```js
this.level = Math.floor(this.frameCount / 1200) + 1;
```

À chaque montée de niveau :

- les ennemis apparaissent plus rapidement ;
- certains deviennent plus fréquents ;
- de nouveaux ennemis sont débloqués ;
- les boss apparaissent à des niveaux précis.

Pendant un combat de boss, cette progression est volontairement suspendue.

Le niveau reste figé jusqu'à la victoire.

---

# Sprint 8 — Les météores

Les météores introduisent une nouvelle forme de danger.

Contrairement aux ennemis :

- ils ne tirent pas ;
- ils servent d'obstacles.

Chaque météore possède :

- une taille variable ;
- une vitesse différente ;
- une rotation ;
- plusieurs points de vie pour les plus gros.

Ils sont entièrement dessinés en Canvas avec :

- une silhouette irrégulière ;
- plusieurs cratères ;
- des nuances de gris.

Le joueur peut choisir :

- de les éviter ;
- ou de les détruire.

---

# Sprint 9 — Bonus permanents

Deux améliorations de tir ont été ajoutées.

## Double Shot

Le joueur tire deux projectiles simultanément.

Ce bonus devient disponible uniquement après le premier boss.

Probabilité :

```text
8 %
```

---

## Triple Shot

Le joueur tire trois projectiles.

Ce bonus devient disponible uniquement après le deuxième boss.

Probabilité :

```text
2 %
```

Les bonus sont permanents.

Ils restent actifs jusqu'à la fin de la partie.

Cette progression donne au joueur une véritable sensation d'évolution.

---

# Sprint 10 — Ennemis bleus

Les ennemis bleus apportent une nouvelle mécanique.

Contrairement aux ennemis rouges, ils ne descendent pas directement.

Ils utilisent une petite machine à états.

```text
Entrée

↓

Pause

↓

Attaque

↓

Sortie
```

Concrètement :

1. apparition sur un côté de l'écran ;
2. déplacement lent ;
3. arrêt entre 5 % et 30 % de leur côté ;
4. tir de trois lasers horizontaux ;
5. sortie de l'écran.

Le joueur doit désormais surveiller les côtés du canvas.

---

# Boss 1 — Eye Boss

Le premier boss apparaît au niveau 5.

## Design

Le boss représente un immense œil alien.

Il possède :

- une sphère rouge ;
- un iris lumineux ;
- une pupille noire ;
- un halo violet.

L'intégralité du dessin est réalisée en Canvas.

Aucune image n'est utilisée.

---

## Combat

Pendant le combat :

- le niveau reste bloqué ;
- les ennemis disparaissent ;
- les météores disparaissent ;
- le score de survie est suspendu.

Le boss se déplace lentement de gauche à droite.

Il lance des salves de projectiles violets en éventail.

Sa cadence dépend de ses points de vie.

```text
> 66 %

↓

tir lent

33 % → 66 %

↓

tir moyen

< 33 %

↓

tir rapide
```

Le joueur ne connaît jamais les points de vie exacts du boss.

Aucune barre de vie n'est affichée.

---

## Récompense

À sa mort :

- +1000 points ;
- passage au niveau 6 ;
- obtention d'un Shield.

---

# Le Shield

Le Shield protège le joueur contre un seul impact.

Visuellement, il apparaît sous la forme d'une sphère bleue autour du vaisseau.

Toutes les collisions dangereuses utilisent une méthode unique :

```js
damagePlayer()
```

Cette méthode centralise toute la logique.

Elle est utilisée contre :

- les ennemis ;
- les météores ;
- les tirs ennemis ;
- les projectiles de boss ;
- les collisions avec le Giant Worm ;
- les rayons du Dragon.

Cette centralisation simplifie énormément la maintenance du code.

---

# Boss 2 — Giant Worm

Le deuxième boss apparaît au niveau 10.

L'objectif était de proposer un combat totalement différent.

## Design

Le Giant Worm est inspiré des vers géants de science-fiction.

Il possède :

- un très long corps gris ;
- des taches orange et violettes ;
- une bouche remplie de dents ;
- trois piques blanches à la queue.

Son corps est constitué de nombreux segments.

---

## Déplacement

Contrairement au premier boss, le Giant Worm ne suit jamais une ligne droite.

Deux méthodes pilotent son déplacement.

### chooseNewTarget()

Cette méthode choisit régulièrement une nouvelle destination aléatoire dans le canvas.

Le boss ne suit donc jamais exactement le même chemin.

Chaque combat est légèrement différent.

---

### getPathPosition()

Cette méthode calcule une interpolation entre deux positions.

Plutôt que de rejoindre brutalement sa nouvelle cible, le ver suit une trajectoire courbe.

Le mouvement paraît ainsi beaucoup plus naturel.

Cette interpolation permet également d'éviter les changements de direction trop brusques.

---

## Difficulté

La vitesse du Giant Worm augmente avec la perte de ses points de vie.

Comme pour le Eye Boss, trois niveaux de difficulté sont utilisés.

```text
> 66 %

↓

lent

33 % → 66 %

↓

moyen

< 33 %

↓

rapide
```

Le joueur doit donc s'adapter à un boss de plus en plus agressif.

---

## Gameplay

Contrairement au Eye Boss, le Giant Worm ne repose presque pas sur des projectiles.

Le danger provient directement de son immense corps.

Le joueur doit :

- anticiper sa trajectoire ;
- éviter les collisions ;
- profiter des rares moments où le boss passe à proximité pour tirer.

Le combat devient donc principalement un exercice de déplacement.

---

## Récompense

À la mort du Giant Worm :

- +1000 points ;
- le niveau passe automatiquement à 11 ;
- un Shield est attribué si le joueur n'en possède pas déjà.

Le Giant Worm marque ainsi la transition vers la dernière partie du jeu.

Les niveaux suivants introduisent de nouveaux ennemis ainsi que le combat final.

# Niveaux 11 à 14

Après la victoire contre le Giant Worm, le rythme du jeu évolue une nouvelle fois.

L'objectif était d'éviter une simple augmentation artificielle de la difficulté.

Au lieu d'ajouter toujours plus d'ennemis, un nouveau type d'adversaire est introduit.

---

# Steel Eye

Le Steel Eye apparaît uniquement à partir du niveau 11.

Il possède beaucoup plus de points de vie qu'un ennemi classique.

Visuellement, il est constitué :

- d'une sphère noire ;
- d'un contour métallique gris acier ;
- d'un œil rouge lumineux ;
- de sept piques métalliques qui apparaissent avant son attaque.

---

## Machine à états

Son comportement repose sur plusieurs états successifs.

```text
Spawn

↓

Descente

↓

Pause

↓

Ouverture de l'œil

↓

Déploiement des piques

↓

Charge

↓

Sortie
```

Chaque état est indépendant.

Cette architecture facilite énormément l'ajout de nouvelles animations.

---

## Fonctionnement

Lorsqu'il apparaît :

- il descend légèrement ;
- il s'immobilise environ une seconde ;
- son œil rouge s'ouvre ;
- les piques apparaissent progressivement ;
- il mémorise la position actuelle du joueur ;
- il effectue ensuite une charge extrêmement rapide.

Le joueur peut éviter cette attaque en continuant de se déplacer.

Même si le joueur change de direction après le départ de la charge, le Steel Eye continue vers la position mémorisée.

Une fois sa trajectoire terminée, il quitte l'écran.

---

# Rééquilibrage des niveaux

Les niveaux 11 à 14 servent de transition vers le boss final.

Plusieurs ajustements ont été réalisés.

## Ennemis rouges

Leur fréquence d'apparition diminue fortement.

Ils servent uniquement à maintenir une légère pression verticale.

---

## Ennemis bleus

Leur fréquence est également réduite.

Ils apparaissent uniquement de manière ponctuelle.

---

## Météores

Les météores disparaissent totalement à partir du niveau 11.

Le gameplay est désormais centré sur :

- le Steel Eye ;
- les boss.

Cette décision améliore la lisibilité du jeu avant le combat final.

---

# Niveau 15

Le niveau 15 est entièrement réservé au boss final.

Aucun autre ennemi ne peut apparaître.

Le joueur se concentre uniquement sur le Dragon.

---

# Fond spécial du boss final

Afin de distinguer immédiatement le combat final, un second fond animé a été créé.

En plus du fond étoilé classique, plusieurs flammes apparaissent derrière le gameplay.

Les couleurs utilisées sont volontairement limitées :

- violet ;
- rouge ;
- vert.

Les flammes restent entièrement décoratives.

Elles renforcent uniquement l'ambiance du combat.

---

## Optimisation

Les premiers essais provoquaient une baisse importante des performances.

Deux optimisations simples ont permis de retrouver une animation fluide.

- réduction du nombre maximal de flammes ;
- diminution du flou (blur).

Le rendu reste visuellement riche tout en conservant un bon framerate.

---

# Boss final — Dragon

Le Dragon constitue le combat final du jeu.

Il s'agit du boss le plus complexe du projet.

Contrairement aux deux premiers boss, son comportement repose sur une véritable machine à états.

```text
Phase 1

↓

50 % PV

↓

Phase 2

↓

40 % PV

↓

Deuxième rayon

↓

25 % PV

↓

Phase 3

↓

Mort

↓

Séquence de victoire
```

Chaque phase introduit de nouvelles mécaniques.

Le joueur doit constamment adapter sa stratégie.

---

# Design

Le Dragon est entièrement dessiné en Canvas.

Aucune image n'est utilisée.

Il est représenté de face.

Ses principaux éléments sont :

- tête triangulaire ;
- deux cornes ;
- deux yeux rouges lumineux ;
- bouche animée ;
- deux grandes ailes ;
- deux pattes griffues.

Les ailes battent lentement.

Les yeux clignotent légèrement.

La bouche s'ouvre au moment des attaques.

Le dessin a été retravaillé plusieurs fois afin d'obtenir une silhouette lisible tout en restant relativement simple à maintenir.

---

# Phase 1

La première phase reste volontairement accessible.

Le Dragon vole lentement de gauche à droite dans la partie supérieure du canvas.

Pendant ce temps, il lance des boules de feu.

---

## DragonFireball

Les boules de feu sont gérées dans une classe indépendante.

```text
DragonFireball
```

Chaque boule :

- mémorise la position du joueur ;
- se dirige vers cette position ;
- s'arrête exactement à cet endroit ;
- continue de brûler plusieurs secondes.

Le joueur ne doit donc pas uniquement éviter le projectile.

Il doit également contourner les zones de feu persistantes.

---

## États

Chaque boule possède deux états.

```text
Flying

↓

Burning
```

Le comportement est ainsi beaucoup plus simple à maintenir.

---

# Phase 2

À 50 % des points de vie :

- les boules de feu cessent immédiatement ;
- les flammes restantes disparaissent ;
- le Dragon rejoint lentement le centre du canvas ;
- il devient immobile.

Le joueur comprend immédiatement qu'un nouveau combat commence.

---

## DragonBeam

Une nouvelle classe est utilisée.

```text
DragonBeam
```

Le rayon :

- part directement de la gueule ;
- traverse tout le canvas ;
- tourne continuellement autour du Dragon.

Le joueur doit tourner autour du boss afin d'éviter le rayon.

---

## Deuxième rayon

À 40 % des points de vie :

un second rayon apparaît.

Celui-ci est toujours positionné à :

```text
90°
```

du premier.

Les deux rayons tournent simultanément.

Ils créent une croix tournante qui réduit progressivement les zones sûres.

---

## Collision

Contrairement aux autres ennemis, les rayons ne reposent pas sur une hitbox rectangulaire.

La collision est calculée grâce à la distance entre le joueur et la ligne représentant le rayon.

Cette approche offre un comportement beaucoup plus précis.

---

# Phase 3

À 25 % des points de vie :

les rayons disparaissent.

Le Dragon entre alors dans sa dernière phase.

---

## Transformation

Le Dragon change progressivement de couleur.

Son corps passe :

```text
Bleu

↓

Orange
```

Cette transformation permet au joueur de comprendre immédiatement que le combat devient plus dangereux.

---

## Retour en haut

Le Dragon remonte automatiquement en haut du canvas.

Il reste centré.

Le joueur retrouve alors davantage d'espace pour esquiver.

---

## Retour des boules de feu

Les DragonFireballs reviennent.

Leur cadence est plus élevée que durant la première phase.

Le terrain devient rapidement encombré de zones de feu.

---

## DragonLaser

Une troisième classe a été créée.

```text
DragonLaser
```

Chaque laser suit plusieurs états.

```text
Warning

↓

Active

↓

Fade

↓

Suppression
```

Le joueur dispose ainsi d'un court délai avant que le laser ne devienne réellement dangereux.

---

## Orientation

Les lasers partent de la gueule du Dragon.

Leur direction est choisie aléatoirement entre :

- 3 heures ;
- 9 heures.

Ils couvrent ainsi toute la moitié inférieure du canvas.

Chaque laser possède :

- une ligne d'avertissement ;
- une phase active ;
- une disparition progressive.

Le joueur doit gérer simultanément :

- les zones de feu ;
- les lasers.

Cette combinaison constitue la difficulté maximale du jeu.

---

# Gestion des phases

Le Dragon ne repose pas sur trois boss différents.

Il s'agit d'un seul objet.

Une simple variable pilote son comportement.

```js
this.phase
```

Les valeurs possibles sont :

```text
1

2

3
```

Chaque méthode vérifie simplement la phase actuelle avant d'exécuter sa logique.

Cette architecture évite les duplications de code et facilite les évolutions futures.

---

# Séquence de victoire

Après la mort du Dragon, le gameplay ne s'interrompt pas immédiatement.

Une véritable cinématique est jouée.

Toutes les attaques disparaissent.

Les ennemis sont supprimés.

Le joueur perd le contrôle de son vaisseau.

---

## VictoryPortal

Une nouvelle classe gère cette animation.

```text
VictoryPortal
```

Le portail apparaît progressivement.

Il possède :

- une ouverture animée ;
- une rotation continue ;
- plusieurs cercles lumineux.

Le vaisseau rejoint automatiquement son centre.

Sa vitesse est volontairement réduite afin de donner un aspect plus cinématographique.

Une fois arrivé :

- il rétrécit progressivement ;
- disparaît dans le portail.

Après cette animation, un immense titre :

```text
SPACE
RUNNER
```

apparaît au centre du canvas.

Le texte utilise :

- un fort dégradé ;
- un contour lumineux ;
- une légère inclinaison inspirée des génériques de science-fiction.

La partie se termine ensuite définitivement avant l'envoi du score au leaderboard.

Cette séquence conclut le jeu de manière plus immersive qu'un simple écran de victoire.

# Optimisations

Tout au long du développement, plusieurs optimisations ont été réalisées afin de conserver un jeu fluide malgré le nombre croissant d'objets affichés.

L'objectif n'était pas uniquement d'ajouter des fonctionnalités, mais également de maintenir un bon niveau de performances.

---

## Nettoyage automatique des objets

Tous les objets temporaires sont supprimés dès qu'ils ne sont plus utiles.

Par exemple :

- projectiles ;
- explosions ;
- bonus ;
- ennemis détruits ;
- lasers ;
- flammes ;
- rayons.

Le nettoyage est généralement réalisé avec :

```js
this.enemies = this.enemies.filter(
    enemy => enemy.active
);
```

Cette approche évite d'accumuler des objets inutiles en mémoire.

---

## Réduction du nombre d'ennemis

Le jeu n'augmente pas indéfiniment le nombre d'ennemis.

Au contraire.

À partir du niveau 11 :

- moins d'ennemis rouges ;
- moins d'ennemis bleus ;
- suppression des météores.

La difficulté provient alors principalement des nouvelles mécaniques de jeu.

Cette décision améliore considérablement la lisibilité.

---

## Fond du boss final

Les premières versions du fond animé du niveau 15 utilisaient :

- trop de particules ;
- un flou important.

Le rendu était esthétique mais provoquait une baisse importante du nombre d'images par seconde.

Deux optimisations simples ont été appliquées :

- réduction du nombre maximal de flammes ;
- diminution du blur.

Le rendu reste visuellement riche tout en conservant une excellente fluidité.

---

## Architecture modulaire

Toutes les nouvelles attaques ont été développées dans des classes indépendantes.

Par exemple :

```text
DragonFireball

DragonBeam

DragonLaser

VictoryPortal
```

Cette architecture présente plusieurs avantages.

Une attaque peut être :

- modifiée ;
- remplacée ;
- supprimée.

Sans modifier le reste du jeu.

Cette séparation limite fortement les dépendances entre les différentes mécaniques.

---

# DEV MODE

Afin d'accélérer les tests, plusieurs outils de développement ont été ajoutés.

Toutes les options sont regroupées dans :

```text
config.js
```

Le mode développement permet notamment :

- de commencer directement au niveau souhaité ;
- d'accéder rapidement aux boss ;
- de démarrer avec un Triple Shot ;
- de tester les mécaniques sans devoir rejouer toute la progression.

Par exemple :

```js
export const DEV_MODE = true;
```

Puis :

```js
this.weaponLevel = DEV_MODE ? 3 : 1;
```

Cette fonctionnalité a considérablement réduit le temps nécessaire pour tester les différents boss.

---

# Intégration avec OG Game Challenge

Space Runner est entièrement intégré au projet principal.

Lorsqu'une partie se termine :

- le score final est récupéré ;
- il est envoyé à l'API Flask ;
- la base de données met éventuellement à jour le meilleur score du joueur ;
- le leaderboard est automatiquement rafraîchi.

Le fonctionnement est identique aux deux autres mini-jeux du projet.

L'intégration est réalisée grâce au système partagé :

```text
score-adapter.js
```

Le jeu reste ainsi totalement indépendant de l'API.

Il ne connaît que la fonction chargée d'envoyer le score.

Cette séparation simplifie énormément la maintenance.

---

# Difficultés rencontrées

Le développement du projet a permis de résoudre de nombreux problèmes techniques.

Parmi les principaux :

## Gestion de plusieurs centaines d'objets

Au fil de la progression, le nombre d'objets affichés simultanément devient important :

- ennemis ;
- bonus ;
- météores ;
- projectiles ;
- explosions ;
- boss ;
- flammes ;
- rayons.

Une attention particulière a donc été portée au nettoyage automatique des objets inactifs.

---

## Organisation du code

Le projet aurait rapidement pu devenir difficile à maintenir.

Pour éviter cela :

- chaque nouvelle mécanique possède sa propre classe ;
- les responsabilités sont clairement séparées ;
- les méthodes restent courtes autant que possible.

Cette architecture facilite les évolutions futures.

---

## Équilibrage

Créer un jeu agréable ne consiste pas uniquement à augmenter la difficulté.

De nombreux ajustements ont été réalisés sur :

- les vitesses ;
- les points de vie ;
- les probabilités de bonus ;
- les cadences de tir ;
- les fréquences d'apparition.

Chaque boss a également été testé indépendamment grâce au DEV MODE.

---

# Ce que ce projet m'a appris

Le développement de Space Runner m'a permis de mettre en pratique plusieurs notions importantes.

## Programmation orientée objet

Chaque entité du jeu est représentée par une classe possédant ses propres responsabilités.

Cela m'a permis de mieux comprendre :

- l'encapsulation ;
- l'héritage (lorsqu'il est pertinent) ;
- la séparation des responsabilités ;
- la modularité.

---

## Canvas 2D

Le projet m'a permis d'approfondir :

- les transformations ;
- les rotations ;
- les dégradés ;
- les animations ;
- les effets lumineux ;
- les interpolations ;
- les courbes.

L'ensemble des éléments graphiques du jeu est dessiné dynamiquement.

---

## Architecture

L'un des principaux objectifs était de construire un projet facilement maintenable.

Plutôt que d'ajouter toutes les fonctionnalités dans une seule classe, chaque mécanique importante possède son propre module.

Cette organisation facilite :

- les corrections ;
- les évolutions ;
- les tests.

---

## Gestion d'états

Plusieurs systèmes reposent sur des machines à états.

Par exemple :

- Steel Eye ;
- Giant Worm ;
- Dragon ;
- DragonFireball ;
- DragonLaser ;
- VictoryPortal.

Cette approche rend les comportements complexes beaucoup plus simples à comprendre.

---

# Perspectives d'amélioration

Même si le jeu est entièrement jouable, plusieurs améliorations pourraient être envisagées.

Par exemple :

- ajout d'effets sonores ;
- ajout de musiques adaptatives selon les boss ;
- ajout de particules plus avancées ;
- ajout d'animations de destruction plus détaillées ;
- ajout d'un système de succès ;
- ajout de nouveaux bonus temporaires ;
- ajout de nouveaux boss.

Grâce à l'architecture actuelle, ces évolutions pourraient être intégrées sans modifier profondément le moteur du jeu.

---

# Conclusion

Space Runner constitue le mini-jeu le plus ambitieux développé pour **OG Game Challenge**.

Au-delà de l'aspect ludique, ce projet a servi de support pour appliquer de nombreuses notions de développement logiciel :

- programmation orientée objet ;
- architecture modulaire ;
- gestion d'une boucle de jeu ;
- animations en temps réel ;
- collisions ;
- gestion d'états ;
- optimisation ;
- intégration avec une API REST.

Le développement a été réalisé progressivement, par petits sprints, en privilégiant un code clair et évolutif plutôt que des solutions rapides.

Chaque nouvel ennemi, chaque boss et chaque mécanique ont été pensés comme des composants indépendants, facilitant ainsi les tests, la maintenance et les évolutions futures.

Le résultat est un shoot'em up rétro possédant une véritable progression, trois combats de boss aux mécaniques distinctes et une fin scénarisée, tout en restant entièrement développé avec les technologies natives du Web.
