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

