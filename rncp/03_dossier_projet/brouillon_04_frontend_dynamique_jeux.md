# 6. Frontend dynamique et intégration des jeux

Statut : première version de travail, rédigée le 8 novembre 2026.

## 6.1 Une interface reliée à l'API

Les pages HTML donnent une structure à l'application, mais une grande partie de leur contenu dépend du backend. Le catalogue, la session et les classements ne sont pas écrits directement dans les pages : JavaScript les construit à partir des réponses de l'API.

J'ai centralisé cette communication dans `api.js`. Ce fichier définit l'adresse de l'API, ajoute les en-têtes nécessaires, exécute les requêtes avec `fetch()` et transforme les erreurs HTTP en erreurs utilisables par l'interface.

L'adresse n'est plus limitée à `127.0.0.1`. Elle reprend le protocole et le nom d'hôte utilisés pour ouvrir le frontend, puis ajoute le port 5001. Cette adaptation permet au même code de fonctionner depuis l'ordinateur et depuis un téléphone connecté au réseau local.

Les autres fichiers n'ont pas besoin de reconstruire une requête complète. Ils utilisent des fonctions comme `register()`, `login()`, `getGames()`, `submitScore()` ou `getLeaderboard()`. Cette centralisation évite de répéter l'adresse de l'API et le traitement des réponses dans chaque page.

## 6.2 Gestion de la session

Après une inscription ou une connexion réussie, le frontend conserve le JWT et les informations publiques de l'utilisateur dans le stockage local du navigateur.

Le fichier `session.js` utilise ces données pour adapter la navigation. Un visiteur voit les actions d'inscription et de connexion. Un utilisateur connecté voit son nom et un bouton de déconnexion. La page d'accueil masque également l'appel à l'inscription lorsqu'une session existe déjà.

Le JWT est ajouté automatiquement dans l'en-tête `Authorization` des requêtes suivantes :

```text
Authorization: Bearer <token>
```

Le frontend sait donc transmettre la preuve d'authentification, mais il ne décide pas si l'action est autorisée. Cette décision reste prise par le backend.

Le stockage local est simple et adapté à ce MVP, mais il présente une limite : un script injecté dans la page pourrait tenter d'y lire le token. Une version de production demanderait une réflexion plus poussée sur la protection contre les attaques XSS et sur l'utilisation éventuelle de cookies sécurisés.

## 6.3 Catalogue dynamique

La page du catalogue contient une grille vide au chargement. Le fichier `games.js` appelle `GET /games/`, puis crée une carte pour chaque jeu renvoyé par l'API.

Les informations métier, comme le nom et la description, viennent de la base. Les éléments propres à l'interface, comme la vidéo de prévisualisation, l'image et la page à ouvrir, restent définis dans le frontend.

Cette séparation évite de placer des chemins de fichiers dans la base de données. Elle permet aussi d'afficher automatiquement les jeux enregistrés tout en gardant le contrôle sur leur présentation.

Si l'API n'est pas disponible, la page affiche un message compréhensible au lieu de rester vide. Les prévisualisations vidéo se lancent au survol et reviennent au début lorsque le pointeur quitte la carte.

## 6.4 Classement dynamique

La page de classement récupère d'abord la liste des jeux pour construire les onglets. Lorsqu'un onglet est sélectionné, elle appelle la route de classement correspondante.

Le backend renvoie les scores déjà triés et attribue un rang. Le frontend se limite à afficher les dix premières entrées et à rechercher la position de l'utilisateur connecté.

Cette répartition est volontaire. Le classement constitue une règle liée aux données et doit rester cohérent quel que soit le client. Le navigateur ne recalcule donc pas l'ordre à partir d'une liste non triée : il utilise le résultat préparé par l'API.

## 6.5 Adaptateur commun pour les scores

Les trois jeux possèdent des mécaniques différentes, mais leur fin de partie doit produire le même résultat pour le portfolio. Le fichier `score-adapter.js` sert d'intermédiaire commun.

Lorsqu'une partie se termine, l'adaptateur :

1. vérifie qu'un utilisateur est connecté ;
2. identifie le jeu grâce à l'URL ;
3. récupère son identifiant dans l'API ;
4. transmet le score ;
5. reçoit le meilleur score conservé par le backend ;
6. affiche un écran de fin adapté.

Le jeu ne connaît donc pas la structure de la base ni la logique de classement. Il transmet seulement son résultat. Cette séparation a facilité l'ajout de Space Runner, car il a pu utiliser le même contrat que les jeux existants.

## 6.6 Space Runner

Space Runner est un shoot'em up spatial développé en JavaScript avec Canvas 2D, sans moteur de jeu externe. Le joueur traverse plusieurs phases, affronte différents ennemis, récupère des améliorations et termine sa progression par trois boss.

Le jeu repose sur une boucle avec `requestAnimationFrame()`. À chaque image, une phase met à jour les déplacements, les collisions, les projectiles et les états. Une seconde phase dessine le résultat dans le Canvas.

J'ai séparé le jeu en modules pour éviter un seul fichier de plusieurs milliers de lignes. Le joueur, les ennemis, les météores, les bonus, les collisions, les boss, les projectiles et l'audio possèdent chacun leur propre responsabilité.

Cette organisation a été nécessaire au fur et à mesure que le jeu grandissait. Les boss disposent de comportements différents, et le dragon final utilise plusieurs phases. Un découpage modulaire permettait de corriger une mécanique sans risquer de modifier toutes les autres.

## 6.7 Performances, audio et équilibrage

Les performances ont représenté l'une des difficultés principales. Le jeu peut afficher simultanément des ennemis, des projectiles, des météores, des effets et un boss. Il fallait nettoyer les objets devenus inutiles et stabiliser la boucle pour éviter une dégradation progressive.

L'audio a été ajouté tardivement. Ce choix a demandé plus de travail que prévu, car les sons dépendent de nombreux événements et doivent être arrêtés, repris ou remplacés au bon moment. Si je recommençais cette partie, je définirais le fonctionnement audio plus tôt.

L'équilibrage ne pouvait pas être résolu par une formule unique. J'ai dû ajuster la fréquence des ennemis, les dégâts, les bonus et les attaques des boss pour construire une progression exigeante sans la rendre injuste.

## 6.8 Limites actuelles

Le frontend dynamique remplit les objectifs du MVP, mais plusieurs limites restent connues :

- le token est conservé dans `localStorage` ;
- les jeux sont principalement conçus pour le clavier ;
- le site dépend d'une API lancée localement ;
- le frontend associe encore les jeux à leurs ressources à partir de leur nom ;
- aucun test automatisé du navigateur n'est encore présent.

Ces limites ne remettent pas en cause le parcours démontré. Elles permettent surtout de distinguer un MVP fonctionnel d'une version destinée à une mise en production publique.
