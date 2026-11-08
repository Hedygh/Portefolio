# 4. Environnement technique et architecture

Statut : première version de travail, rédigée le 8 novembre 2026. Les diagrammes et extraits définitifs seront ajoutés lors de la mise en page.

## 4.1 Des choix techniques déjà maîtrisés

J'ai choisi Python et Flask pour le backend. Ce choix n'était pas imposé par Holberton : il venait de mon expérience sur le projet HBnB, réalisé auparavant pendant la formation.

HBnB m'avait permis d'assimiler une architecture backend composée de plusieurs couches, avec une API, une façade, des repositories et des modèles. J'avais également déjà travaillé avec Flask, Flask-RESTX, SQLAlchemy et JWT. Pour OG Game Challenge, j'ai préféré réutiliser et adapter cette base plutôt que de consacrer le temps limité du projet à l'apprentissage d'un nouveau framework.

Ce choix avait deux avantages. Le premier était de réduire le risque technique : je connaissais déjà le rôle des outils et la manière dont ils pouvaient fonctionner ensemble. Le second était de pouvoir me concentrer sur les besoins propres au projet, notamment la gestion des scores, le classement et l'intégration des jeux.

Il ne s'agissait pas de recopier HBnB, mais de reprendre une organisation que je comprenais pour l'appliquer à un autre domaine. HBnB gérait des objets liés à une plateforme de location, tandis qu'OG Game Challenge devait gérer des utilisateurs, des jeux et leurs scores.

## 4.2 Technologies utilisées

### Frontend

Le frontend repose sur HTML, CSS et JavaScript sans framework. HTML structure les pages, CSS porte l'identité visuelle et le responsive, tandis que JavaScript gère les formulaires, la session, les appels API, le catalogue, les classements et les jeux.

Cette solution reste légère et adaptée à la taille du projet. Elle permet également de montrer directement les mécanismes du navigateur sans les masquer derrière une bibliothèque supplémentaire.

### Backend

Flask constitue le cœur de l'application serveur. Il initialise l'application, charge la configuration et reçoit les requêtes HTTP.

Flask-RESTX permet d'organiser l'API en espaces de noms et génère l'interface Swagger. Cette interface a été particulièrement utile pendant le développement, car elle permettait de tester chaque route avant même que le frontend soit connecté.

Les routes sont regroupées sous le préfixe `/api/v1`. Elles couvrent l'authentification, les utilisateurs, les jeux, les scores, les classements et le contrôle de santé de l'API.

### Base de données

SQLAlchemy joue le rôle d'ORM, c'est-à-dire d'intermédiaire entre les objets Python et les tables relationnelles. Les modèles Python décrivent les utilisateurs, les jeux et les scores. SQLAlchemy génère ensuite les requêtes nécessaires pour dialoguer avec SQLite.

SQLite a été retenu pour le développement local. Il ne demande pas l'installation d'un serveur de base de données et reste suffisant pour un MVP exécuté sur un seul ordinateur. Ce choix simplifiait donc la mise en route du projet sans empêcher la démonstration des relations, des clés étrangères et des requêtes métier.

### Authentification

L'authentification utilise des jetons JWT. Après une inscription ou une connexion valide, l'API renvoie un jeton au navigateur. Ce jeton accompagne ensuite les requêtes protégées.

Les mots de passe ne sont jamais enregistrés directement. Bcrypt produit une empreinte qui est conservée dans la base et utilisée lors de la vérification du mot de passe.

## 4.3 Architecture en couches

Le backend est organisé en quatre niveaux principaux :

```text
Routes de l'API
        ↓
Façade métier
        ↓
Repositories SQLAlchemy
        ↓
Modèles et base SQLite
```

Cette architecture est inspirée de celle étudiée dans HBnB. Je l'ai conservée parce qu'elle évite de mélanger toutes les responsabilités dans les routes.

Les routes reçoivent les données HTTP et construisent la réponse. Elles ne doivent pas contenir toute la logique du projet.

La façade applique les règles métier. Elle vérifie par exemple qu'un utilisateur n'existe pas déjà, authentifie un compte ou décide si un nouveau score doit remplacer l'ancien.

Les repositories regroupent les opérations génériques de persistance, comme l'ajout, la lecture ou la suppression d'un objet.

Les modèles décrivent enfin les données stockées et leurs relations.

Cette séparation rend le chemin d'une requête un peu plus long, mais elle facilite la lecture et les tests. Lorsqu'un problème apparaît, il est possible de déterminer s'il vient de la route, de la règle métier ou de la persistance.

## 4.4 Architecture générale de l'application

Le navigateur ne communique jamais directement avec SQLite. Toutes les opérations passent par l'API.

Lorsqu'un utilisateur réalise une action, le parcours général est le suivant :

1. l'utilisateur agit sur une page ou dans un jeu ;
2. JavaScript prépare une requête avec `api.js` ;
3. Flask reçoit la requête sur une route de l'API ;
4. la façade vérifie les données et applique la règle métier ;
5. SQLAlchemy lit ou modifie la base SQLite ;
6. l'API renvoie une réponse JSON ;
7. JavaScript met l'interface à jour.

Les jeux restent eux aussi séparés de la base. Ils calculent un résultat, puis utilisent une couche d'intégration pour le transmettre à l'API. Cette organisation permet de modifier la logique d'un jeu sans devoir réécrire le backend.

## 4.5 Le cas particulier des scores

La fusion du frontend et du backend n'a pas provoqué de blocage majeur. Les différentes parties avaient été pensées pour communiquer par l'API, ce qui a rendu leur connexion assez naturelle.

La partie la plus subtile concernait les scores. Il ne suffisait pas d'ajouter chaque résultat dans la base : l'objectif du classement était de conserver le meilleur score d'un utilisateur pour un jeu donné.

La façade commence donc par rechercher un score correspondant au même utilisateur et au même jeu. Si aucun score n'existe, elle crée une nouvelle entrée. Si un résultat existe déjà, elle compare les deux valeurs. Le score enregistré n'est remplacé que lorsque la nouvelle valeur est supérieure.

Le principe paraît simple, mais il est important pour la cohérence du classement. Sans cette comparaison, un joueur pourrait perdre sa meilleure performance en réalisant ensuite une partie moins bonne. À l'inverse, enregistrer toutes les tentatives multiplierait les lignes et pourrait faire apparaître plusieurs fois le même joueur dans le classement.

Le tri décroissant est ensuite appliqué lors de la récupération du classement afin d'afficher en premier les valeurs les plus élevées.

## 4.6 Organisation des dossiers

Le dépôt sépare les trois grandes parties du projet :

```text
og-game-challenge/
├── backend/
│   ├── app/api/
│   ├── app/models/
│   ├── app/repositories/
│   ├── app/services/
│   └── tests/
├── frontend/
│   ├── assets/
│   ├── css/
│   ├── html/
│   └── js/
└── docs/
```

Cette arborescence correspond à la séparation choisie pendant le développement. Le frontend contient ce qui est exécuté ou affiché dans le navigateur. Le backend contient l'API, les règles métier, les modèles et les tests. Le dossier de documentation conserve les rapports et les diagrammes techniques.

Space Runner possède lui-même une organisation modulaire. Le jeu ayant pris plus d'ampleur que les premiers prototypes, séparer ses responsabilités est devenu nécessaire pour éviter un fichier JavaScript unique difficile à maintenir.

## 4.7 Recul sur les choix techniques

Avec du recul, je ne changerais pas profondément les technologies choisies. Elles correspondaient à ce que je maîtrisais et au délai disponible. Utiliser Flask, SQLAlchemy et SQLite m'a permis d'obtenir une application complète sans ajouter une infrastructure disproportionnée.

Si j'avais disposé de davantage de temps libre, j'aurais surtout consacré plus d'énergie à Space Runner. C'est la partie dans laquelle j'ai le plus progressé et celle qui correspond le mieux à mon orientation actuelle vers le jeu vidéo.

Je modifierais toutefois la manière de planifier certaines fonctionnalités du jeu. L'audio a été ajouté tardivement alors qu'il affecte de nombreux événements : lancement, tirs, ennemis, boss, transitions et écran final. L'intégrer dès la conception aurait évité plusieurs ajustements en fin de développement.

Les deux autres difficultés importantes de Space Runner ont été les performances et l'équilibrage. Il fallait conserver suffisamment d'éléments à l'écran pour donner du rythme sans rendre la boucle de jeu instable. Il fallait également augmenter progressivement la difficulté sans rendre les premières minutes trop faciles ou les dernières phases injustes.

Ces difficultés m'ont montré qu'un jeu ne se résume pas à faire fonctionner ses mécaniques. Les performances, le son et l'équilibrage influencent directement l'expérience du joueur et doivent être prévus assez tôt dans le développement.

---

## Illustrations et extraits à intégrer ultérieurement

- schéma général navigateur → API → façade → repository → SQLite ;
- arborescence simplifiée du projet ;
- capture de Swagger à l'adresse `/api/v1/` ;
- extrait court de la méthode de conservation du meilleur score ;
- diagramme de séquence d'enregistrement d'un score ;
- capture de Space Runner.
