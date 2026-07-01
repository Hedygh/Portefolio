# Technical Manual Review
## Part 1 – Project Overview & Global Architecture

---

# Introduction

Ce document est une fiche de révision technique destinée à préparer la Manual Review du projet **OG Game Challenge**.

L'objectif n'est pas uniquement de décrire le projet, mais surtout d'être capable d'expliquer les choix techniques, l'architecture, le fonctionnement de l'application et les interactions entre chaque composant.

Le projet est un MVP (Minimum Viable Product) développé en équipe, composé de trois parties principales :

- Backend
- Frontend
- Jeux JavaScript

Chaque partie a été développée indépendamment avant d'être intégrée dans une seule application web.

---

# 1. Présentation du projet

## Qu'est-ce que OG Game Challenge ?

OG Game Challenge est une plateforme web permettant à un utilisateur de :

- créer un compte ;
- se connecter de manière sécurisée ;
- jouer à plusieurs jeux directement dans son navigateur ;
- enregistrer automatiquement son score ;
- consulter un classement général (Leaderboard).

Le projet a été conçu pour démontrer la maîtrise d'un développement Full Stack moderne en utilisant une architecture modulaire.

---

## Les objectifs du projet

Le projet devait démontrer plusieurs compétences :

### Backend

- création d'une API REST
- authentification JWT
- gestion des utilisateurs
- logique métier
- communication avec une base de données

### Frontend

- interface responsive
- communication avec l'API
- gestion des sessions
- affichage dynamique

### Jeux

- développement JavaScript
- Canvas
- boucle de jeu
- calcul des scores

---

# 2. Répartition de l'équipe

Le développement a été volontairement séparé en trois blocs.

| Membre | Rôle |
|---------|------|
| Hedy | Backend, API, Base de données, Authentification |
| Nael | Développement des jeux JavaScript |
| Geoffray | Développement Frontend |

Cette organisation permettait à chacun de travailler en parallèle tout en limitant les conflits Git.

L'intégration finale consistait ensuite à faire communiquer ces trois blocs.

---

# 3. Vision globale de l'application

Le projet est composé de plusieurs couches.

```
                UTILISATEUR
                      │
                      ▼
        Frontend (HTML / CSS / JS)
                      │
                      ▼
                api.js (fetch)
                      │
             Requêtes HTTP REST
                      │
                      ▼
              Flask REST API
                      │
                Business Logic
                 (Facade Layer)
                      │
                      ▼
                 SQLAlchemy ORM
                      │
                      ▼
                SQLite Database
```

Le frontend ne communique jamais directement avec la base de données.

Toutes les requêtes passent obligatoirement par l'API.

C'est le backend qui applique toutes les règles métier avant d'autoriser une opération.

---

# 4. Workflow général d'une requête

Voici le parcours complet lorsqu'un utilisateur réalise une action.

```
Utilisateur

↓

Clique sur un bouton

↓

JavaScript détecte l'action

↓

api.js prépare la requête

↓

fetch()

↓

Flask reçoit la requête

↓

La route API est exécutée

↓

La Facade applique la logique métier

↓

SQLAlchemy interroge la base

↓

SQLite répond

↓

JSON retourné au frontend

↓

JavaScript met à jour l'écran
```

Il est important de retenir que :

Le Frontend ne décide jamais.

Le Backend valide toujours les données.

---

# 5. Pourquoi cette architecture ?

Une question très classique du MR est :

> Pourquoi avoir séparé Backend, Frontend et Jeux ?

Réponse :

Cette séparation permet :

- une meilleure organisation du code ;
- un développement en parallèle ;
- une maintenance plus simple ;
- une évolution plus facile du projet.

Par exemple, il est possible de modifier totalement le frontend sans toucher au backend.

Inversement, on peut changer la base de données sans modifier les jeux.

Chaque partie possède une responsabilité bien définie.

---

# 6. Architecture modulaire

Le projet repose sur le principe de séparation des responsabilités (Separation of Concerns).

Chaque module possède un rôle précis.

| Module | Responsabilité |
|----------|----------------|
| Frontend | Interface utilisateur |
| Backend | Logique métier |
| Database | Stockage permanent |
| Games | Gameplay |
| API | Communication |
| Authentication | Sécurisation |
| Leaderboard | Classement des scores |

Cette architecture est dite **modulaire** car chaque composant peut évoluer indépendamment.

---

# 7. Cycle complet d'un score

Le fonctionnement d'un score est un bon exemple de communication entre tous les composants.

```
Le joueur lance un jeu

↓

Le score augmente

↓

Game Over

↓

score-adapter.js

↓

api.js

↓

POST /scores

↓

Flask

↓

Business Logic

↓

SQLAlchemy

↓

SQLite

↓

Score enregistré

↓

Leaderboard mis à jour

↓

Frontend récupère les nouvelles données

↓

Classement affiché
```

Aucun jeu ne communique directement avec la base de données.

Le jeu ne connaît que le score obtenu.

Toute la communication est prise en charge par les fichiers d'intégration.

---

# 8. Ce qu'il faut retenir

À connaître pour l'oral :

✓ Le frontend ne communique jamais directement avec la base de données.

✓ Toutes les communications passent par l'API REST.

✓ Le backend contient toute la logique métier.

✓ SQLAlchemy est le seul composant qui dialogue avec SQLite.

✓ Les jeux sont indépendants du backend.

✓ L'intégration est assurée grâce à des fichiers intermédiaires (`api.js`, `session.js` et `score-adapter.js`).

✓ Cette architecture facilite les évolutions futures du projet.

---

# Questions fréquentes

## Explique rapidement ton projet.

> OG Game Challenge est une application web Full Stack composée d'un backend Flask, d'un frontend développé en HTML/CSS/JavaScript et de plusieurs jeux JavaScript utilisant Canvas. Les trois parties ont été développées séparément puis intégrées grâce à une couche de communication composée de `api.js`, `session.js` et `score-adapter.js`. Le backend gère toute la logique métier, l'authentification et la base de données, tandis que le frontend fournit l'interface utilisateur et que les jeux restent indépendants de l'API.

---

## Pourquoi avoir séparé le projet en plusieurs modules ?

Pour faciliter le développement en équipe, améliorer la maintenance du code et permettre à chaque composant d'évoluer indépendamment.

---

## Pourquoi le frontend ne communique-t-il jamais directement avec la base de données ?

Pour des raisons de sécurité et d'architecture.

Le backend contrôle toutes les opérations, applique les règles métier, vérifie les autorisations et protège les données avant toute interaction avec la base de données.

---

## Que représente l'API dans votre projet ?

L'API est l'intermédiaire entre le frontend et le backend.

Elle reçoit les requêtes HTTP, appelle la logique métier puis renvoie une réponse JSON au frontend.

---

# Résumé

Cette première partie permet de comprendre l'organisation générale du projet.

Avant de maîtriser les technologies (Flask, SQLAlchemy, JWT, JavaScript...), il est essentiel de comprendre comment les différents composants collaborent pour former une seule application cohérente.

# Part 2A – Backend Architecture

---

# Introduction

Le backend constitue le cœur de l'application.

Son rôle est de recevoir les requêtes provenant du frontend, vérifier qu'elles sont valides, appliquer les règles métier puis communiquer avec la base de données avant de renvoyer une réponse.

Dans OG Game Challenge, le backend est développé avec **Flask** et suit une architecture en plusieurs couches afin de séparer les responsabilités.

---

# 1. Pourquoi Flask ?

## Qu'est-ce que Flask ?

Flask est un micro-framework Python destiné au développement d'applications web.

Contrairement à des frameworks plus lourds comme Django, Flask fournit uniquement les briques essentielles.

Cela laisse au développeur le contrôle de l'architecture.

---

## Pourquoi avons-nous choisi Flask ?

Pour plusieurs raisons :

- léger
- simple à comprendre
- très utilisé pour les API REST
- facilement extensible
- idéal pour un projet de taille moyenne

Le backend est ainsi resté clair tout en étant facilement évolutif.

---

# 2. L'architecture du backend

Notre backend est organisé en plusieurs couches.

```
HTTP Request

↓

Route Flask

↓

Facade

↓

Business Logic

↓

Model

↓

SQLAlchemy

↓

SQLite

↓

JSON Response
```

Chaque couche possède une responsabilité bien définie.

Cette séparation rend le code beaucoup plus lisible.

---

# 3. create_app()

L'application Flask est créée grâce à une **Application Factory**.

Au lieu de créer directement une application globale, on utilise une fonction :

```python
create_app()
```

Cette fonction :

- crée l'application Flask
- charge la configuration
- initialise SQLAlchemy
- initialise JWT
- initialise Bcrypt
- enregistre les routes
- initialise Swagger

Cette approche facilite :

- les tests
- la maintenance
- les futures configurations (développement, production...)

---

## Pourquoi utiliser create_app() ?

Parce que cela évite d'avoir une application globale difficile à modifier.

L'Application Factory est aujourd'hui une bonne pratique Flask.

---

# 4. Les Routes REST

Le frontend ne communique jamais directement avec les modèles.

Toutes les actions passent par une route API.

Exemple :

```
POST /register

↓

Création utilisateur
```

```
POST /login

↓

Connexion
```

```
GET /leaderboard

↓

Liste des scores
```

Chaque route représente une action métier.

---

## Pourquoi utiliser une API REST ?

REST est aujourd'hui le standard pour faire communiquer un frontend et un backend.

Chaque ressource possède une URL.

Chaque action utilise un verbe HTTP.

---

Les principaux verbes sont :

GET

→ récupérer des données

POST

→ créer une ressource

PUT

→ modifier une ressource

DELETE

→ supprimer une ressource

---

# Question MR

Pourquoi utiliser POST pour le login ?

Parce que le login envoie des informations sensibles (email, mot de passe).

Les données sont envoyées dans le corps de la requête.

Un GET exposerait ces informations dans l'URL.

---

# 5. Flask-RESTx

Nous avons utilisé Flask-RESTx afin de simplifier la création de notre API.

Il apporte notamment :

- organisation des routes
- validation des paramètres
- documentation automatique
- interface Swagger

Chaque groupe de routes est organisé dans un Namespace.

Par exemple :

```
/users

/login

/games

/leaderboard
```

Chaque partie de l'API reste indépendante.

---

# 6. Swagger

Swagger a été utilisé tout au long du développement du backend.

Son rôle était de tester chaque endpoint avant même que le frontend existe.

Grâce à Swagger nous avons pu vérifier :

- création des utilisateurs
- authentification
- récupération des données
- validation des erreurs
- réponses JSON

Une fois ces tests validés, le frontend pouvait consommer une API déjà fonctionnelle.

---

Pourquoi est-ce important ?

Parce qu'il est beaucoup plus simple de corriger un backend avant de commencer l'intégration.

---

# 7. Le parcours d'une requête

Prenons un exemple simple.

L'utilisateur clique sur :

Connexion

↓

Le frontend appelle

```
API.login()
```

↓

api.js effectue

```
fetch(...)
```

↓

Flask reçoit la requête

↓

La bonne route est appelée

↓

La route ne fait presque aucun traitement.

Son rôle est uniquement :

- récupérer les données
- appeler la logique métier
- retourner une réponse

C'est une très bonne pratique.

---

# 8. La Facade

La Facade est probablement l'un des éléments les plus importants du backend.

Beaucoup d'étudiants mettent directement toute leur logique dans les routes.

Nous avons choisi une architecture différente.

```
Route

↓

Facade

↓

Models
```

La route reste très simple.

Toute la logique métier est centralisée dans la Facade.

---

Exemple.

Au lieu de faire :

```
Route

↓

Créer utilisateur

↓

Vérifier email

↓

Créer mot de passe

↓

Enregistrer

↓

Retour JSON
```

La route fait uniquement :

```
Route

↓

Facade.create_user()

↓

Réponse JSON
```

La Facade s'occupe du reste.

---

Pourquoi est-ce mieux ?

Parce que :

- le code est plus propre
- les routes sont courtes
- la logique est réutilisable
- la maintenance est facilitée

---

# Question MR

Pourquoi utiliser une Facade ?

Pour centraliser toute la logique métier.

Les routes ne doivent pas contenir de logique complexe.

Elles doivent seulement recevoir la requête puis appeler le bon service.

---

# 9. Les Models

Les modèles représentent les objets principaux de l'application.

Dans notre projet :

```
User

games

Score
```

Chaque modèle décrit :

- ses attributs
- ses relations
- ses validations

Les modèles représentent la structure des données manipulées par l'application.

---

# 10. Business Logic

La logique métier correspond aux règles de fonctionnement du projet.

Exemples :

Un utilisateur ne peut pas se connecter avec un mauvais mot de passe.

Un score doit appartenir à un utilisateur.

Le leaderboard doit être trié.

Un email doit être unique.

Toutes ces règles appartiennent au backend.

Jamais au frontend.

---

# Ce qu'il faut retenir

✓ Flask reçoit les requêtes HTTP.

✓ Les routes restent très courtes.

✓ Toute la logique métier est dans la Facade.

✓ Les modèles représentent les objets du projet.

✓ Swagger permet de tester l'API indépendamment du frontend.

✓ Le backend contrôle toujours les données avant d'autoriser une opération.

---

# Questions fréquentes

### Pourquoi Flask plutôt que Django ?

Flask est plus léger, plus flexible et parfaitement adapté à une API REST.

---

### Pourquoi utiliser REST ?

Parce que REST est aujourd'hui le standard de communication entre un frontend et un backend.

---

### Pourquoi tester avec Swagger ?

Pour valider chaque endpoint indépendamment du frontend et faciliter le débogage.

---

### Pourquoi mettre la logique métier dans la Facade ?

Pour séparer les responsabilités.

Les routes reçoivent les requêtes.

La Facade applique les règles métier.

Les modèles représentent les données.

Chaque couche possède un rôle unique.

---

### Quelle est la responsabilité principale du backend ?

Recevoir les requêtes, appliquer les règles métier, communiquer avec la base de données et renvoyer une réponse JSON sécurisée au frontend.

# Part 2B – Database, Authentication & Security

---

# 11. SQLAlchemy

## Qu'est-ce que SQLAlchemy ?

SQLAlchemy est un ORM (Object Relational Mapper).

Un ORM permet de manipuler une base de données en utilisant des objets Python plutôt qu'en écrivant directement des requêtes SQL.

Au lieu d'écrire :

```sql
SELECT * FROM users;
```

Nous pouvons simplement manipuler un objet :

```python
User.query.all()
```

L'ORM se charge ensuite de traduire cette instruction en SQL.

---

## Pourquoi utiliser un ORM ?

Les avantages sont nombreux :

- moins de code SQL à écrire ;
- meilleure lisibilité ;
- compatibilité avec plusieurs moteurs de base de données ;
- maintenance plus simple ;
- protection contre certaines erreurs SQL.

---

## Pourquoi SQLAlchemy dans notre projet ?

SQLAlchemy s'intègre parfaitement avec Flask.

Il permet de représenter chaque table sous forme de classe Python.

Par exemple :

```
User

↓

Classe Python

↓

Table SQL
```

Le développeur travaille principalement avec des objets.

SQLAlchemy se charge de communiquer avec SQLite.

---

# 12. SQLite

## Pourquoi SQLite ?

SQLite est une base de données relationnelle légère.

Elle ne nécessite aucun serveur supplémentaire.

Toutes les données sont stockées dans un simple fichier.

Elle est idéale pour :

- les projets étudiants ;
- les prototypes ;
- les MVP.

---

## Pourquoi ne pas utiliser MySQL ou PostgreSQL ?

Le projet devait rester simple à installer.

SQLite offre :

- une installation rapide ;
- aucune configuration serveur ;
- une excellente intégration avec Flask.

Pour une application plus importante, PostgreSQL serait un meilleur choix.

---

# 13. Relations entre les modèles

La base de données contient plusieurs entités reliées entre elles.

Exemple simplifié :

```
User
 │
 ├──────── owns ───────► Score <--Games
```

Les principales relations sont :

- Un utilisateur possède plusieurs scores.
- Un utilisateur peut créer plusieurs lieux.
- Un lieu peut recevoir plusieurs avis.
- Un avis appartient toujours à un utilisateur et à un lieu.

---

## Pourquoi utiliser des relations ?

Les relations évitent de dupliquer les données.

Par exemple :

Au lieu d'écrire le nom de l'utilisateur dans chaque score, on stocke simplement son identifiant.

Cela garantit la cohérence des données.

---

# 14. Authentification avec JWT

## Qu'est-ce qu'un JWT ?

JWT signifie **JSON Web Token**.

C'est un jeton sécurisé permettant d'identifier un utilisateur après sa connexion.

Une fois connecté :

```
Utilisateur

↓

Login

↓

JWT

↓

Stocké côté client

↓

Envoyé dans chaque requête protégée
```

Le serveur vérifie ensuite ce jeton avant d'autoriser l'accès.

---

## Pourquoi utiliser JWT ?

Les avantages :

- aucune session stockée sur le serveur ;
- API REST plus simple ;
- authentification rapide ;
- facilement utilisable par plusieurs clients.

---

## Comment fonctionne notre login ?

Le workflow est le suivant :

```
Email + Password

↓

POST /login

↓

Flask

↓

Recherche utilisateur

↓

bcrypt vérifie le mot de passe

↓

JWT créé

↓

Token envoyé

↓

Frontend stocke le token

↓

Toutes les futures requêtes utilisent :

Authorization: Bearer <token>
```

---

# 15. Pourquoi bcrypt ?

Une question presque systématique en Manual Review.

---

## Le mot de passe est-il stocké ?

NON.

Jamais.

Nous stockons uniquement son hash.

Exemple :

```
Mot de passe

↓

bcrypt

↓

Hash

↓

Base de données
```

Même si la base est volée, le mot de passe original n'est jamais visible.

---

## Hash ou chiffrement ?

Attention.

Ce sont deux choses différentes.

Hash :

- irréversible ;
- utilisé pour les mots de passe.

Chiffrement :

- réversible ;
- utilisé pour protéger des données devant être relues.

Un mot de passe doit toujours être hashé.

Jamais chiffré.

---

## Pourquoi bcrypt ?

Parce qu'il est spécialement conçu pour protéger les mots de passe.

Il ralentit volontairement les calculs afin de rendre les attaques par force brute beaucoup plus difficiles.

---

# 16. Les réponses HTTP

Une API répond toujours avec un code HTTP.

Les principaux utilisés dans notre projet sont :

| Code | Signification |
|------|---------------|
| 200 | Requête réussie |
| 201 | Ressource créée |
| 400 | Mauvaise requête |
| 401 | Non authentifié |
| 403 | Accès interdit |
| 404 | Ressource introuvable |
| 500 | Erreur serveur |

---

## Exemple

Création d'un utilisateur :

```
POST /users

↓

Utilisateur créé

↓

201 Created
```

---

Connexion incorrecte :

```
POST /login

↓

Mot de passe faux

↓

401 Unauthorized
```

---

# 17. Validation des données

Le backend ne fait jamais confiance au frontend.

Chaque donnée reçue est vérifiée.

Exemples :

- email valide ;
- mot de passe présent ;
- score numérique ;
- champs obligatoires ;
- utilisateur existant.

Même si le frontend effectue déjà des vérifications, le backend les répète systématiquement.

---

# Pourquoi ?

Parce qu'un utilisateur malveillant peut envoyer une requête directement à l'API sans utiliser le frontend.

Le backend doit donc toujours protéger les données.

---

# 18. Workflow complet d'une inscription

```
Utilisateur

↓

Remplit le formulaire

↓

Frontend

↓

api.js

↓

POST /register

↓

Flask

↓

Validation

↓

bcrypt

↓

Création du User

↓

SQLAlchemy

↓

SQLite

↓

201 Created

↓

JSON

↓

Frontend

↓

Confirmation affichée
```

---

# 19. Workflow complet d'une connexion

```
Utilisateur

↓

Login

↓

POST /login

↓

Recherche utilisateur

↓

bcrypt.check_password()

↓

JWT généré

↓

Token envoyé

↓

session.js

↓

localStorage

↓

Utilisateur connecté
```

---

# Ce qu'il faut retenir

✓ SQLAlchemy est un ORM.

✓ SQLite est la base de données.

✓ Les modèles représentent les tables.

✓ Les relations évitent les duplications.

✓ Les mots de passe ne sont jamais stockés.

✓ bcrypt produit un hash.

✓ JWT identifie l'utilisateur.

✓ Le backend valide toujours les données.

✓ Les réponses HTTP indiquent le résultat de chaque requête.

---

# Questions fréquentes

## Pourquoi utiliser SQLAlchemy ?

Pour manipuler la base de données avec des objets Python plutôt qu'avec du SQL brut.

---

## Pourquoi SQLite ?

Parce qu'il est léger, rapide à mettre en place et parfaitement adapté à un MVP.

---

## Pourquoi utiliser JWT ?

Pour authentifier les utilisateurs de manière sécurisée sans maintenir de session côté serveur.

---

## Pourquoi utiliser bcrypt ?

Pour protéger les mots de passe en stockant uniquement leur hash.

---

## Pourquoi le backend vérifie-t-il encore les données si le frontend le fait déjà ?

Parce que le frontend peut être contourné.

La sécurité doit toujours être assurée par le backend.

---

## Pourquoi utiliser une base de données relationnelle ?

Parce que les données possèdent des relations naturelles (utilisateurs, scores, avis, lieux...).

Une base relationnelle garantit la cohérence de ces relations.

---

## Quelle est la différence entre un hash et un chiffrement ?

Un hash est irréversible et sert à vérifier un mot de passe.

Un chiffrement est réversible grâce à une clé et sert à protéger des données qui devront être relues.

---

## Pourquoi utiliser un ORM plutôt que du SQL directement ?

L'ORM rend le code plus lisible, plus maintenable et plus facilement portable vers un autre moteur de base de données.

---

# Résumé

Le backend est responsable de la sécurité et de l'intégrité de l'application.

Il applique les règles métier, protège les données sensibles, gère les utilisateurs, communique avec la base de données et garantit que chaque requête est traitée de manière fiable avant de renvoyer une réponse au frontend.

# Part 3 – Frontend

---

# Introduction

Le frontend représente la partie visible de l'application.

C'est l'interface avec laquelle l'utilisateur interagit.

Son objectif est de récupérer les actions de l'utilisateur, les transmettre au backend puis afficher les résultats reçus.

Contrairement au backend, le frontend ne contient quasiment aucune logique métier.

Il se concentre principalement sur :

- l'affichage ;
- l'expérience utilisateur (UX) ;
- la navigation ;
- la communication avec l'API.

---

# 1. Les trois technologies du Frontend

Le frontend repose sur trois langages complémentaires.

```
HTML

↓

Structure

CSS

↓

Présentation

JavaScript

↓

Comportement
```

Les trois sont indispensables.

---

# 2. HTML

## Quel est son rôle ?

HTML (HyperText Markup Language) construit la structure de la page.

Il décrit les différents éléments visibles :

- titres ;
- paragraphes ;
- boutons ;
- formulaires ;
- images ;
- canvas.

Sans HTML, il n'existe aucun contenu à afficher.

---

## Exemple

Un bouton :

```html
<button>Login</button>
```

Ce bouton existe.

Mais il ne possède :

- aucun style ;
- aucune action.

Ces éléments seront ajoutés par CSS et JavaScript.

---

# 3. CSS

Le CSS (Cascading Style Sheets) est responsable de l'apparence graphique.

Il permet de modifier :

- couleurs ;
- polices ;
- tailles ;
- espacements ;
- animations ;
- responsive design.

---

## Pourquoi est-il séparé du HTML ?

Pour respecter la séparation des responsabilités.

HTML décrit.

CSS décore.

JavaScript anime.

---

## Dans notre projet

Le style choisi est volontairement moderne.

Il contraste avec les jeux volontairement rétro.

L'objectif était de créer une identité visuelle forte tout en gardant des jeux très simples.

---

# 4. JavaScript

JavaScript est le langage qui rend la page interactive.

Il peut :

- détecter un clic ;
- envoyer une requête ;
- modifier le contenu d'une page ;
- afficher des informations reçues du backend.

---

## Exemple

Lorsque l'utilisateur clique sur Login :

```
Click

↓

JavaScript

↓

API.login()

↓

Backend

↓

Réponse

↓

Affichage
```

Sans JavaScript, la page resterait statique.

---

# 5. Le DOM

DOM signifie Document Object Model.

Il représente tous les éléments HTML sous forme d'objets manipulables.

Grâce au DOM, JavaScript peut :

- modifier un texte ;
- cacher un élément ;
- afficher une erreur ;
- ajouter des lignes dans le leaderboard.

---

Exemple :

```
Leaderboard vide

↓

Réponse API

↓

JavaScript

↓

Création des lignes

↓

Affichage
```

Le HTML n'est donc pas recréé.

Il est simplement modifié.

---

# 6. Les événements

Le frontend fonctionne principalement grâce aux événements.

Par exemple :

- clic
- saisie clavier
- soumission formulaire
- chargement de page

Chaque événement déclenche une fonction JavaScript.

---

Exemple

```
Utilisateur clique

↓

Event Listener

↓

Fonction JavaScript

↓

API

↓

Réponse

↓

Mise à jour de la page
```

---

# 7. Communication avec le backend

Le frontend ne communique jamais directement avec SQLite.

Toutes les requêtes passent par l'API.

```
Frontend

↓

api.js

↓

fetch()

↓

Flask

↓

JSON

↓

Frontend
```

Le format utilisé est le JSON.

---

Pourquoi JSON ?

Parce qu'il est :

- léger ;
- lisible ;
- compatible avec JavaScript ;
- standard pour les API REST.

---

# 8. Les formulaires

Les formulaires permettent de récupérer les informations de l'utilisateur.

Par exemple :

- inscription ;
- connexion.

Le processus est toujours similaire.

```
Utilisateur

↓

Formulaire

↓

JavaScript

↓

Validation

↓

api.js

↓

Backend

↓

Réponse

↓

Message affiché
```

---

# 9. Responsive Design

Le site a été conçu pour fonctionner sur plusieurs tailles d'écran.

Le CSS adapte automatiquement :

- les colonnes ;
- les tailles ;
- les espacements.

L'objectif est d'assurer une expérience utilisateur cohérente.

---

# 10. Navigation

Le frontend organise les différentes pages de l'application.

Par exemple :

Accueil

↓

Connexion

↓

Menu

↓

Jeux

↓

Leaderboard

Chaque page possède un rôle spécifique.

Les données sont récupérées uniquement lorsque cela est nécessaire.

---

# Ce qu'il faut retenir

✓ HTML construit la structure.

✓ CSS gère l'apparence.

✓ JavaScript gère les interactions.

✓ Le DOM permet de modifier la page sans la recharger.

✓ Les événements déclenchent les actions.

✓ Le frontend communique uniquement avec l'API.

✓ Toutes les données sont échangées en JSON.

---

# Questions fréquentes

## Pourquoi utiliser HTML, CSS et JavaScript séparément ?

Parce que chaque technologie possède une responsabilité différente.

HTML construit.

CSS présente.

JavaScript rend interactif.

---

## Pourquoi utiliser JavaScript ?

Parce qu'il permet de rendre une page dynamique sans rechargement complet.

---

## Pourquoi utiliser le DOM ?

Pour modifier les éléments de la page en temps réel après une réponse du backend.

---

## Pourquoi utiliser JSON ?

Parce que c'est le format standard pour échanger des données entre un frontend et un backend.

---

## Pourquoi le frontend ne communique-t-il jamais avec la base de données ?

Pour des raisons de sécurité.

Le backend est le seul composant autorisé à accéder à la base de données.

---

## Quelle est la responsabilité principale du frontend ?

Afficher les informations, récupérer les actions de l'utilisateur et communiquer avec l'API.

---

# Résumé

Le frontend est responsable de l'expérience utilisateur.

Il ne prend aucune décision métier et n'accède jamais directement aux données.

Son rôle consiste à afficher les informations reçues du backend, à capturer les actions de l'utilisateur et à assurer une navigation fluide dans l'application.

# Part 4A – How a JavaScript Game Works

---

# Introduction

Même si les jeux développés pour OG Game Challenge possèdent des mécaniques différentes, ils reposent tous sur les mêmes principes fondamentaux.

Comprendre ces principes permet d'expliquer facilement le fonctionnement d'un jeu lors de la Manual Review, même sans connaître chaque ligne du code.

Un jeu vidéo n'est finalement qu'une succession d'opérations répétées très rapidement.

À chaque instant, le jeu :

- récupère les actions du joueur ;
- met à jour les positions des objets ;
- vérifie les collisions ;
- calcule le score ;
- redessine l'écran.

Cette opération est répétée plusieurs dizaines de fois par seconde.

---

# 1. Pourquoi utiliser JavaScript ?

Les jeux sont exécutés directement dans le navigateur.

JavaScript est donc le langage idéal car il permet :

- d'accéder au clavier ;
- d'afficher des animations ;
- de dessiner dans un Canvas ;
- de communiquer avec le backend grâce à l'API.

Aucune installation n'est nécessaire.

Le joueur ouvre simplement la page web et le jeu démarre.

---

# 2. Le Canvas

Le Canvas est une zone de dessin.

On peut l'imaginer comme une feuille blanche.

```
+--------------------------------------+
|                                      |
|                                      |
|             Canvas                   |
|                                      |
|                                      |
+--------------------------------------+
```

JavaScript dessine ensuite tous les éléments du jeu à l'intérieur.

Par exemple :

- le joueur ;
- les obstacles ;
- les ennemis ;
- le score ;
- les effets visuels.

Contrairement au HTML, le Canvas ne contient aucun élément individuel.

À chaque image, tout est redessiné.

---

# Pourquoi ne pas utiliser du HTML ?

On pourrait créer un personnage avec une `<div>`.

Mais cela deviendrait très lent dès que plusieurs dizaines d'objets devraient bouger simultanément.

Le Canvas est beaucoup plus performant pour les jeux.

---

# 3. Les coordonnées

Tous les objets du jeu possèdent une position.

Cette position est généralement définie par deux coordonnées.

```
(x , y)
```

Exemple :

```
(100, 200)
```

Cela signifie :

- 100 pixels depuis la gauche.
- 200 pixels depuis le haut.

Chaque objet connaît donc sa position.

---

# 4. Les objets du jeu

Dans un jeu, presque tout est représenté par un objet JavaScript.

Exemple :

```
Player

↓

x

y

width

height

speed

lives
```

Un obstacle fonctionne exactement de la même manière.

```
Obstacle

↓

x

y

width

height

speed
```

Chaque objet possède ses propres informations.

---

# 5. Les variables

Le jeu utilise plusieurs variables importantes.

Par exemple :

```
score
```

Stocke le score actuel.

---

```
gameRunning
```

Indique si la partie continue.

```
true

↓

Le jeu tourne
```

```
false

↓

Game Over
```

---

```
player
```

Représente le personnage.

---

```
obstacles[]
```

Tableau contenant tous les obstacles présents à l'écran.

---

Pourquoi utiliser un tableau ?

Parce qu'il peut contenir un nombre variable d'obstacles.

```
Obstacle 1

Obstacle 2

Obstacle 3

Obstacle 4

...
```

Le jeu peut facilement en ajouter ou en supprimer.

---

# 6. Les entrées clavier (Inputs)

Le joueur contrôle le personnage grâce au clavier.

JavaScript écoute les événements clavier.

Par exemple :

```
KeyDown

↓

La touche est enfoncée
```

ou

```
KeyUp

↓

La touche est relâchée
```

Le jeu adapte ensuite le comportement du personnage.

Exemple :

```
Flèche droite

↓

player.x += speed
```

Le joueur avance.

---

# 7. La Game Loop

C'est le cœur de tous les jeux.

La boucle est exécutée continuellement.

```
Start

↓

Lire les inputs

↓

Calculer

↓

Dessiner

↓

Recommencer
```

Cette boucle tourne généralement 60 fois par seconde.

Sans cette boucle, le jeu resterait figé.

---

# Pourquoi une boucle ?

Parce que tout change en permanence.

À chaque instant :

- le joueur avance ;
- les ennemis bougent ;
- les obstacles apparaissent ;
- le score augmente.

Le jeu doit donc constamment mettre à jour son état.

---

# 8. Les Frames

Chaque passage dans la boucle correspond à une image.

On appelle cela une **Frame**.

```
Frame 1

↓

Frame 2

↓

Frame 3

↓

Frame 4

...
```

Plus il y a de frames par seconde, plus l'animation paraît fluide.

La plupart des jeux fonctionnent autour de **60 FPS** (Frames Per Second).

---

# 9. requestAnimationFrame()

Les jeux JavaScript utilisent généralement :

```
requestAnimationFrame()
```

Cette fonction demande au navigateur :

> "Appelle à nouveau ma boucle au moment idéal pour dessiner la prochaine image."

Le navigateur synchronise automatiquement les animations avec l'écran.

---

## Pourquoi ne pas utiliser setInterval() ?

`setInterval()` exécute une fonction à intervalle fixe.

Cela peut provoquer :

- des saccades ;
- des pertes de performances ;
- des animations moins fluides.

`requestAnimationFrame()` est spécialement conçu pour les animations.

Il est donc recommandé pour les jeux.

---

# 10. La logique générale d'un jeu

Tous les jeux suivent pratiquement le même fonctionnement.

```
Initialisation

↓

Création des variables

↓

Création du joueur

↓

Création des obstacles

↓

Début de la boucle

↓

Lecture du clavier

↓

Déplacement

↓

Collision

↓

Score

↓

Affichage

↓

Nouvelle Frame

↓

Game Over

↓

Fin de partie
```

Les différences entre deux jeux concernent uniquement les règles.

La structure générale reste pratiquement toujours identique.

---

# Ce qu'il faut retenir

✓ Un jeu JavaScript fonctionne dans le navigateur.

✓ Le Canvas est une surface de dessin.

✓ Tous les objets possèdent une position.

✓ Les variables mémorisent l'état du jeu.

✓ Les événements clavier contrôlent le joueur.

✓ La Game Loop met constamment le jeu à jour.

✓ Chaque passage dans la boucle correspond à une Frame.

✓ `requestAnimationFrame()` permet d'obtenir une animation fluide.

---

# Questions fréquentes

## Pourquoi utiliser un Canvas ?

Parce qu'il est beaucoup plus performant que le HTML pour dessiner et animer de nombreux objets.

---

## Pourquoi une boucle de jeu ?

Parce que le jeu doit constamment mettre à jour les positions, les collisions et l'affichage.

---

## Pourquoi utiliser des objets JavaScript ?

Parce qu'ils permettent de regrouper toutes les informations d'un élément du jeu (position, taille, vitesse, etc.).

---

## Pourquoi stocker les obstacles dans un tableau ?

Parce que leur nombre change pendant la partie. Un tableau permet de les ajouter, de les supprimer et de les parcourir facilement.

---

## Pourquoi utiliser requestAnimationFrame() ?

Parce que cette fonction est optimisée pour les animations et offre un affichage plus fluide que `setInterval()`.

---

# Résumé

Quel que soit le type de jeu développé, la logique reste pratiquement toujours la même : le navigateur exécute une boucle qui lit les actions du joueur, met à jour les données du jeu puis redessine entièrement le Canvas plusieurs dizaines de fois par seconde. Cette boucle constitue le moteur principal du jeu.

# Part 4B – Understanding the Game Code

---

# Introduction

Lorsque l'on ouvre le fichier JavaScript d'un jeu pour la première fois, il peut sembler difficile à comprendre.

Pourtant, la majorité des jeux suivent exactement la même organisation.

Ils sont généralement composés de plusieurs blocs de code ayant chacun une responsabilité précise.

Une fois cette organisation comprise, il devient beaucoup plus facile de lire ou modifier un jeu.

---

# Structure générale d'un jeu

La plupart des jeux suivent cette organisation.

```
Variables globales

↓

Canvas

↓

Initialisation

↓

Gestion du clavier

↓

Update()

↓

Collision()

↓

Draw()

↓

Game Loop

↓

Game Over

↓

Restart()
```

Toutes ces parties travaillent ensemble.

---

# 1. Les variables globales

La première partie du fichier contient généralement toutes les variables importantes.

Exemple :

```javascript
let score = 0;
```

Cette variable mémorise le score pendant toute la partie.

Elle est déclarée en dehors des fonctions car plusieurs fonctions doivent pouvoir la modifier.

Par exemple :

- update()
- draw()
- gameOver()

Toutes utilisent cette même variable.

---

Autre exemple :

```javascript
let gameRunning = true;
```

Cette variable indique si la partie est encore en cours.

```
true

↓

Le jeu continue
```

```
false

↓

La boucle s'arrête
```

Une simple variable permet donc de contrôler tout le fonctionnement du jeu.

---

# 2. Le joueur

Le joueur est généralement représenté par un objet.

Par exemple :

```javascript
const player = {

x,

y,

width,

height,

speed

}
```

Pourquoi utiliser un objet ?

Parce que toutes les informations du joueur sont regroupées au même endroit.

Lorsque le joueur se déplace :

```
player.x += player.speed;
```

On modifie simplement ses coordonnées.

---

# 3. Les obstacles

Les obstacles sont souvent stockés dans un tableau.

```javascript
let obstacles = [];
```

Pourquoi ?

Parce que leur nombre change constamment.

Au début :

```
[]
```

Puis :

```
Obstacle 1
```

Puis :

```
Obstacle 1

Obstacle 2
```

Puis :

```
Obstacle 1

Obstacle 2

Obstacle 3
```

Le tableau permet :

- d'ajouter un obstacle ;
- de supprimer un obstacle ;
- de parcourir facilement tous les obstacles.

---

# 4. Les ennemis

Les ennemis fonctionnent exactement comme les obstacles.

Chaque ennemi possède :

- une position ;
- une vitesse ;
- une taille.

Ils sont souvent stockés dans un tableau pour les mêmes raisons.

---

# 5. Update()

C'est probablement la fonction la plus importante.

Elle ne dessine rien.

Son seul objectif est de calculer le nouvel état du jeu.

Par exemple :

```
Le joueur avance

↓

Les ennemis avancent

↓

Les obstacles tombent

↓

Le score augmente

↓

Les collisions sont testées
```

Update modifie uniquement les données.

Jamais l'affichage.

---

Pourquoi ?

Parce qu'il est plus propre de séparer :

Calcul

et

Affichage.

---

# 6. Draw()

La fonction Draw fait exactement l'inverse.

Elle ne calcule rien.

Elle affiche simplement ce que Update a préparé.

Exemple :

```
Effacer le Canvas

↓

Dessiner le joueur

↓

Dessiner les obstacles

↓

Dessiner le score

↓

Dessiner les ennemis
```

Le Canvas est donc entièrement redessiné à chaque frame.

---

Pourquoi redessiner tout ?

Parce que c'est beaucoup plus simple que d'essayer de modifier uniquement quelques pixels.

Le navigateur est suffisamment rapide pour le faire plusieurs dizaines de fois par seconde.

---

# 7. Les collisions

Une collision signifie que deux objets se touchent.

Exemple :

```
Player

███

Obstacle

███
```

Le jeu compare généralement :

```
x

y

width

height
```

des deux objets.

Si leurs zones se chevauchent :

```
Collision = true
```

Le jeu peut alors :

- retirer une vie ;
- arrêter la partie ;
- jouer un son ;
- déclencher une animation.

---

# 8. Le score

Le score est simplement une variable.

Elle augmente selon les règles du jeu.

Par exemple :

```
Temps écoulé

↓

score++
```

ou

```
Obstacle évité

↓

score += 10
```

Le score est ensuite affiché dans Draw().

---

# 9. Le Game Over

Lorsque certaines conditions sont remplies :

```
Collision

↓

Plus de vies

↓

Temps écoulé
```

Le jeu passe en mode :

```
gameRunning = false
```

La boucle principale s'arrête.

Le joueur ne peut plus agir.

Le score final est conservé.

---

# 10. Restart()

Cette fonction prépare une nouvelle partie.

Elle remet toutes les variables à zéro.

Par exemple :

```
score = 0

player.x = départ

obstacles = []

gameRunning = true
```

Puis la boucle recommence.

---

# 11. Pourquoi séparer toutes ces fonctions ?

Chaque fonction possède une seule responsabilité.

| Fonction | Rôle |
|----------|------|
| update() | Calculer le jeu |
| draw() | Dessiner |
| collision() | Tester les contacts |
| restart() | Réinitialiser |
| gameLoop() | Coordonner l'ensemble |

Cette séparation facilite énormément la maintenance.

---

# 12. Le rôle de gameLoop()

La boucle principale orchestre tout.

Elle appelle toujours les mêmes fonctions.

```
Lire clavier

↓

Update()

↓

Collision()

↓

Draw()

↓

requestAnimationFrame()

↓

Nouvelle Frame
```

Le jeu tourne ainsi jusqu'au Game Over.

---

# Ce qu'il faut retenir

✓ Les variables globales mémorisent l'état du jeu.

✓ Le joueur est généralement un objet JavaScript.

✓ Les obstacles sont souvent stockés dans un tableau.

✓ update() calcule.

✓ draw() affiche.

✓ collision() détecte les contacts.

✓ restart() prépare une nouvelle partie.

✓ gameLoop() coordonne l'ensemble.

---

# Questions fréquentes

## Pourquoi séparer update() et draw() ?

Pour distinguer les calculs de l'affichage.

Le code devient plus clair et plus facile à maintenir.

---

## Pourquoi les obstacles sont-ils stockés dans un tableau ?

Parce que leur nombre varie constamment pendant la partie.

---

## Pourquoi tout redessiner à chaque frame ?

Parce que c'est plus simple et suffisamment performant avec Canvas.

---

## Pourquoi utiliser des objets pour le joueur ?

Parce qu'ils regroupent toutes les informations liées au personnage dans une seule structure.

---

## Pourquoi gameRunning est-il un booléen ?

Parce qu'une simple valeur true/false permet de savoir immédiatement si la boucle du jeu doit continuer.

---

## Quelle est la fonction la plus importante ?

La Game Loop.

Sans elle, aucune mise à jour du jeu ne serait effectuée.

---

# Résumé

Un jeu JavaScript est composé de plusieurs fonctions spécialisées qui collaborent entre elles. Les variables mémorisent l'état du jeu, `update()` calcule les nouvelles positions, `draw()` affiche le résultat, `collision()` détecte les contacts et la Game Loop répète ces opérations jusqu'à la fin de la partie. Cette organisation est utilisée dans la majorité des jeux 2D développés avec Canvas.


# Part 4C – Game Integration into OG Game Challenge

---

# Introduction

Au départ, les jeux étaient des applications JavaScript totalement indépendantes.

Ils fonctionnaient uniquement dans leur propre page HTML et n'avaient aucune connaissance :

- des utilisateurs ;
- de l'authentification ;
- de la base de données ;
- du leaderboard ;
- de l'API.

Notre objectif a été de transformer ces jeux autonomes en véritables fonctionnalités de la plateforme OG Game Challenge.

Cette étape a constitué l'une des phases les plus importantes du projet.

---

# 1. Avant l'intégration

Initialement, l'architecture ressemblait à ceci :

```
Frontend

↓

Pages HTML
```

```
Backend

↓

API REST
```

```
Jeux

↓

Canvas

↓

Score local uniquement
```

Les trois parties fonctionnaient correctement mais ne communiquaient pas entre elles.

Par exemple :

- un jeu pouvait calculer un score ;
- mais il était incapable de l'enregistrer.

Inversement :

- le backend pouvait enregistrer un score ;
- mais aucun jeu ne savait lui envoyer.

---

# 2. L'objectif

Le but était que le joueur puisse suivre un workflow complet.

```
Connexion

↓

Choix du jeu

↓

Partie

↓

Game Over

↓

Envoi du score

↓

Base de données

↓

Leaderboard mis à jour
```

Pour y parvenir, plusieurs fichiers intermédiaires ont été créés.

---

# 3. api.js

api.js est probablement le fichier le plus important de l'intégration.

Son rôle est de centraliser toutes les communications avec le backend.

Sans lui, chaque page aurait dû écrire ses propres appels :

```javascript
fetch(...)
```

Cela aurait entraîné :

- beaucoup de duplication ;
- une maintenance difficile ;
- davantage de risques d'erreurs.

Grâce à api.js, toutes les requêtes passent par des fonctions dédiées.

Exemple :

```
API.login()

API.register()

API.submitScore()

API.getLeaderboard()
```

Le reste du projet ne connaît jamais directement les routes HTTP.

---

## Pourquoi est-ce une bonne pratique ?

Parce que si une route change :

```
/scores
```

↓

```
/api/scores
```

Une seule modification est nécessaire dans api.js.

Tout le reste du projet continue de fonctionner.

---

# 4. session.js

Une fois connecté, l'utilisateur reçoit un JWT.

Il faut ensuite :

- le conserver ;
- vérifier qu'il existe ;
- le transmettre automatiquement dans chaque requête protégée ;
- permettre la déconnexion.

Toutes ces responsabilités sont regroupées dans session.js.

Le frontend n'a donc pas besoin de gérer directement le token.

---

## Workflow

```
Login

↓

JWT reçu

↓

session.js

↓

localStorage

↓

Utilisateur connecté

↓

Toutes les requêtes utilisent automatiquement le token
```

---

# Pourquoi utiliser localStorage ?

Parce que les données restent disponibles même après un rechargement de la page.

L'utilisateur ne doit pas se reconnecter à chaque changement de page.

---

# 5. score-adapter.js

Ce fichier a joué un rôle essentiel pendant l'intégration.

Le principe est simple.

Le jeu ne connaît qu'une seule information :

```
Le score final.
```

Il ne devrait jamais connaître :

- Flask ;
- SQLite ;
- JWT ;
- les routes REST.

Son rôle est uniquement de produire un score.

Le score-adapter sert donc d'intermédiaire.

---

## Workflow

```
Game

↓

Score

↓

score-adapter.js

↓

api.js

↓

Backend

↓

Database
```

Le jeu reste totalement indépendant.

---

## Pourquoi est-ce intéressant ?

Si demain un nouveau jeu est ajouté :

```
Space Invaders

Snake

Pac-Man

Tetris
```

Il suffira simplement de transmettre le score au score-adapter.

Aucune modification du backend ne sera nécessaire.

---

# 6. Pourquoi cette architecture ?

Nous avons volontairement évité que les jeux communiquent directement avec le backend.

Pourquoi ?

Parce que cela aurait créé un fort couplage.

Exemple à éviter :

```
Game

↓

fetch()

↓

Flask
```

Dans cette architecture, chaque jeu devrait connaître :

- les routes ;
- le JWT ;
- le format JSON ;
- les erreurs HTTP.

Ce serait très difficile à maintenir.

---

Notre architecture est beaucoup plus modulaire.

```
Game

↓

score-adapter.js

↓

api.js

↓

Backend
```

Chaque composant possède une seule responsabilité.

---

# 7. Communication entre tous les composants

Voici le parcours complet d'un score.

```
Le joueur joue

↓

Le jeu calcule le score

↓

Game Over

↓

score-adapter.js

↓

api.js

↓

POST /scores

↓

Flask

↓

Business Logic

↓

SQLAlchemy

↓

SQLite

↓

Score enregistré

↓

Réponse JSON

↓

Frontend

↓

Leaderboard actualisé
```

Chaque composant intervient uniquement au bon moment.

---

# 8. Les bénéfices obtenus

Cette architecture apporte plusieurs avantages.

## Modularité

Chaque jeu reste indépendant.

---

## Maintenance

Les appels API sont regroupés dans un seul fichier.

---

## Évolutivité

De nouveaux jeux peuvent être ajoutés facilement.

---

## Lisibilité

Chaque fichier possède un rôle clair.

---

## Réutilisabilité

Les mêmes fonctions API peuvent être utilisées partout dans le projet.

---

# Ce qu'il faut retenir

✓ Les jeux ont été développés indépendamment.

✓ api.js centralise tous les appels HTTP.

✓ session.js gère l'authentification.

✓ score-adapter.js fait le lien entre les jeux et le backend.

✓ Les jeux ne connaissent jamais directement Flask ou SQLite.

✓ Cette architecture limite fortement le couplage entre les composants.

✓ Ajouter un nouveau jeu nécessite très peu de modifications.

---

# Questions fréquentes

## Pourquoi avoir créé api.js ?

Pour éviter de répéter des appels fetch() dans tout le projet et centraliser la communication avec l'API.

---

## Pourquoi avoir créé session.js ?

Pour gérer le JWT, l'état de connexion et simplifier l'authentification sur toutes les pages.

---

## Pourquoi avoir créé score-adapter.js ?

Pour découpler complètement les jeux du backend.

Les jeux produisent uniquement un score, sans connaître le fonctionnement de l'API.

---

## Pourquoi les jeux ne communiquent-ils pas directement avec Flask ?

Parce que cela les rendrait dépendants de l'architecture du backend.

Grâce au score-adapter, ils restent réutilisables et plus faciles à maintenir.

---

## Quelle a été la principale difficulté de l'intégration ?

Faire communiquer trois composants développés séparément (frontend, backend et jeux) tout en conservant une architecture propre, modulaire et facilement évolutive.

---

# Résumé

L'intégration a transformé trois projets indépendants en une seule application cohérente.

L'ajout de `api.js`, `session.js` et `score-adapter.js` a permis de standardiser les échanges entre les composants, de simplifier la maintenance du code et de rendre l'architecture suffisamment flexible pour accueillir de nouveaux jeux ou de nouvelles fonctionnalités sans remettre en cause le fonctionnement général de l'application.


# Part 5A – Manual Review Questions & Answers

---

# Project Presentation

## Q: Present your project.

OG Game Challenge est une plateforme web Full Stack permettant à un utilisateur de créer un compte, se connecter, jouer à plusieurs jeux JavaScript et enregistrer automatiquement ses scores dans un leaderboard. Le projet est composé d'un backend Flask, d'un frontend HTML/CSS/JavaScript et de jeux développés avec Canvas.

---

## Q: What was the objective of the project?

Développer un MVP fonctionnel démontrant la maîtrise du développement Full Stack, de l'architecture logicielle, de l'authentification et de l'intégration entre plusieurs composants développés en équipe.

---

## Q: Why was the project divided into three parts?

Pour permettre à chaque membre de travailler indépendamment sur son domaine de compétence tout en facilitant l'intégration finale.

---

# Architecture

## Q: Describe your architecture.

Notre application est composée de trois couches principales :

- Frontend
- Backend
- Database

Les jeux communiquent avec le backend grâce à des fichiers intermédiaires (`api.js`, `session.js` et `score-adapter.js`).

---

## Q: Why use a modular architecture?

Parce qu'elle améliore la maintenance, facilite le développement en équipe et permet de remplacer ou modifier un composant sans impacter les autres.

---

## Q: Why use an API?

L'API est l'intermédiaire entre le frontend et le backend. Elle applique les règles métier et protège l'accès aux données.

---

## Q: Why REST?

REST est un standard largement utilisé pour faire communiquer un frontend et un backend via HTTP.

---

# Backend

## Q: Why Flask?

Parce que Flask est léger, flexible et parfaitement adapté au développement d'une API REST.

---

## Q: Why Flask-RESTx?

Pour organiser les routes avec des namespaces, générer automatiquement Swagger et simplifier le développement de l'API.

---

## Q: Why use a Facade?

Pour centraliser la logique métier et garder les routes simples.

---

## Q: What is Business Logic?

Ce sont toutes les règles de fonctionnement de l'application : validation des données, authentification, création des utilisateurs, gestion des scores, etc.

---

## Q: Why use Models?

Les modèles représentent les principales entités de l'application (User, Place, Review, Score...) et définissent leur structure.

---

# Database

## Q: Why SQLAlchemy?

Parce qu'il permet de manipuler la base de données avec des objets Python plutôt qu'avec du SQL brut.

---

## Q: Why SQLite?

Parce qu'il est léger, simple à installer et parfaitement adapté à un MVP.

---

## Q: What is an ORM?

Un ORM (Object Relational Mapper) convertit automatiquement les objets Python en requêtes SQL.

---

## Q: Why use relationships?

Pour éviter la duplication des données et assurer leur cohérence.

---

# Authentication & Security

## Q: Why JWT?

Pour identifier un utilisateur après sa connexion sans stocker de session côté serveur.

---

## Q: Why bcrypt?

Pour protéger les mots de passe grâce au hachage.

---

## Q: Why hash instead of encrypt?

Un mot de passe ne doit jamais être récupéré. Il doit seulement être vérifié. Le hachage est donc plus adapté que le chiffrement.

---

## Q: Why doesn't the frontend access the database directly?

Pour des raisons de sécurité. Toutes les opérations passent obligatoirement par le backend.

---

# Frontend

## Q: Why HTML, CSS and JavaScript?

Chaque technologie possède une responsabilité :

- HTML : structure
- CSS : présentation
- JavaScript : interactions

---

## Q: Why Vanilla JavaScript?

Parce qu'il était largement suffisant pour les besoins du projet et ne nécessitait aucun framework supplémentaire.

---

## Q: Why use fetch()?

Pour envoyer des requêtes HTTP vers l'API.

---

## Q: Why JSON?

Parce qu'il s'agit du format standard utilisé par les API REST pour échanger des données.

---

# Games

## Q: Why Canvas?

Parce qu'il est optimisé pour dessiner et animer de nombreux objets dans le navigateur.

---

## Q: What is a Game Loop?

Une boucle qui met continuellement à jour le jeu et redessine l'écran jusqu'au Game Over.

---

## Q: Why requestAnimationFrame()?

Parce qu'il est optimisé pour les animations et synchronisé avec le rafraîchissement de l'écran.

---

## Q: Why separate update() and draw()?

Pour distinguer les calculs du jeu de son affichage.

---

## Q: Why store obstacles in an array?

Parce que leur nombre varie pendant la partie.

---

# Integration

## Q: Why create api.js?

Pour centraliser tous les appels HTTP et éviter de répéter du code dans plusieurs fichiers.

---

## Q: Why create session.js?

Pour gérer le JWT, l'état de connexion et simplifier l'authentification.

---

## Q: Why create score-adapter.js?

Pour découpler totalement les jeux du backend.

Les jeux produisent uniquement un score sans connaître l'API.

---

## Q: Why don't the games communicate directly with Flask?

Pour limiter le couplage entre les composants et rendre les jeux réutilisables.

---

## Q: What was the most important integration challenge?

Faire communiquer correctement le frontend, le backend et les jeux tout en conservant une architecture propre et facilement évolutive.

---

# Testing

## Q: How did you test the backend?

Principalement avec Swagger en testant chaque endpoint indépendamment.

---

## Q: How did you test the frontend?

Par des tests manuels directement sur le site après connexion au backend.

---

## Q: How did you test the games?

Par des parties complètes afin de vérifier le gameplay, le score, le Game Over et l'envoi des scores.

---

## Q: How did you validate the final MVP?

En réalisant des tests end-to-end sur l'ensemble du workflow :

Inscription → Connexion → Jeu → Score → Leaderboard.

---

# Git & Teamwork

## Q: How did the team collaborate?

Chaque membre développait sa partie sur des branches dédiées avant l'intégration finale dans le projet commun.

---

## Q: Why use Git?

Pour suivre les modifications, faciliter le travail collaboratif et conserver un historique du projet.

---

# Future Improvements

## Q: What would you improve?

- Moderniser davantage l'interface.
- Ajouter de nouveaux jeux.
- Enrichir le leaderboard.
- Déployer l'application sur le cloud.

---

# Final Question

## Q: What are you the most proud of?

La réussite de l'intégration entre trois composants développés indépendamment.

L'ajout de `api.js`, `session.js` et `score-adapter.js` a permis de connecter proprement le frontend, le backend et les jeux tout en conservant une architecture modulaire et facilement maintenable.


# Part 5B – Last Minute Cheat Sheet

---

# 1. The Project in 30 Seconds

**OG Game Challenge** est une plateforme web Full Stack composée :

- d'un backend Flask
- d'un frontend HTML/CSS/JavaScript
- de plusieurs jeux JavaScript utilisant Canvas

Les jeux communiquent avec le backend grâce à une couche d'intégration composée de `api.js`, `session.js` et `score-adapter.js`.

L'utilisateur peut :

- créer un compte
- se connecter
- jouer
- enregistrer son score
- consulter le leaderboard.

---

# 2. Architecture

```
Utilisateur

↓

Frontend

↓

api.js

↓

REST API

↓

Flask

↓

Facade

↓

Models

↓

SQLAlchemy

↓

SQLite
```

Toujours retenir :

Le frontend n'accède jamais directement à la base.

---

# 3. Workflow Login

```
Login

↓

POST /login

↓

Backend

↓

bcrypt vérifie le mot de passe

↓

JWT créé

↓

session.js

↓

localStorage

↓

Utilisateur connecté
```

---

# 4. Workflow Score

```
Le joueur joue

↓

Game Over

↓

score-adapter.js

↓

api.js

↓

POST /scores

↓

Backend

↓

Database

↓

Leaderboard
```

---

# 5. Les responsabilités

| Composant | Rôle |
|------------|------------------------------|
| HTML | Structure |
| CSS | Apparence |
| JavaScript | Interactivité |
| Flask | API REST |
| Facade | Logique métier |
| SQLAlchemy | ORM |
| SQLite | Base de données |
| JWT | Authentification |
| bcrypt | Hachage des mots de passe |
| Canvas | Dessin des jeux |
| api.js | Communication API |
| session.js | Gestion de session |
| score-adapter.js | Communication Jeux → API |

---

# 6. Les fichiers d'intégration

## api.js

Centralise toutes les requêtes HTTP.

Une seule modification suffit si une route change.

---

## session.js

Gère :

- JWT
- connexion
- déconnexion
- localStorage

---

## score-adapter.js

Transforme un simple score JavaScript en requête API.

Le jeu ne connaît jamais Flask.

---

# 7. Les codes HTTP

| Code | Signification |
|------|---------------|
| 200 | Succès |
| 201 | Ressource créée |
| 400 | Mauvaise requête |
| 401 | Non authentifié |
| 403 | Interdit |
| 404 | Introuvable |
| 500 | Erreur serveur |

---

# 8. Les 20 notions à connaître

REST API

Communication HTTP entre frontend et backend.

---

JSON

Format standard d'échange de données.

---

Flask

Framework Python utilisé pour créer l'API.

---

Flask-RESTx

Organisation des routes + Swagger.

---

Swagger

Test manuel des endpoints.

---

Facade

Centralise la logique métier.

---

Business Logic

Toutes les règles de fonctionnement de l'application.

---

Model

Représentation d'une entité métier.

---

ORM

Traduit les objets Python en SQL.

---

SQLAlchemy

ORM utilisé dans le projet.

---

SQLite

Base de données relationnelle légère.

---

JWT

Jeton d'authentification.

---

bcrypt

Hash sécurisé des mots de passe.

---

Canvas

Zone de dessin des jeux.

---

Game Loop

Boucle principale du jeu.

---

requestAnimationFrame()

Met à jour le jeu à chaque frame.

---

DOM

Représentation manipulable du HTML.

---

fetch()

Envoie une requête HTTP.

---

localStorage

Conserve le JWT côté navigateur.

---

Modularité

Chaque composant possède une responsabilité unique.

---

# 9. Les réponses courtes

Pourquoi REST ?

→ Standard de communication.

---

Pourquoi Flask ?

→ Léger et flexible.

---

Pourquoi SQLAlchemy ?

→ Manipuler la base avec des objets Python.

---

Pourquoi SQLite ?

→ Léger et parfait pour un MVP.

---

Pourquoi JWT ?

→ Authentification sans session serveur.

---

Pourquoi bcrypt ?

→ Les mots de passe ne sont jamais stockés en clair.

---

Pourquoi Canvas ?

→ Dessiner rapidement les jeux.

---

Pourquoi Game Loop ?

→ Mettre le jeu à jour en continu.

---

Pourquoi api.js ?

→ Éviter de répéter les fetch().

---

Pourquoi session.js ?

→ Centraliser la gestion du JWT.

---

Pourquoi score-adapter.js ?

→ Découpler les jeux du backend.

---

Pourquoi une Facade ?

→ Séparer les routes de la logique métier.

---

Pourquoi le frontend n'accède jamais à la base ?

→ Pour des raisons de sécurité.

---

Pourquoi utiliser JSON ?

→ Standard universel des API REST.

---

# 10. Les messages clés pour l'oral

Le backend contient toute la logique métier.

Le frontend affiche les données mais ne décide jamais.

Les jeux sont totalement indépendants du backend.

L'intégration repose sur `api.js`, `session.js` et `score-adapter.js`.

L'architecture est modulaire, évolutive et facilement maintenable.

Chaque composant possède une responsabilité unique.

---

# En une phrase

Notre projet consiste à faire communiquer proprement trois composants développés indépendamment (Frontend, Backend et Jeux JavaScript) grâce à une architecture modulaire où chaque couche possède une responsabilité clairement définie

