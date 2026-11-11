# OG Game Challenge — contexte, besoins et organisation

Statut : première version de travail, rédigée le 7 novembre 2026. Les illustrations et la pagination définitive seront ajoutées lors de la mise en page.

## 1. Introduction

OG Game Challenge est une application web full-stack permettant à des utilisateurs de créer un compte, de jouer à plusieurs jeux directement depuis leur navigateur, d'enregistrer leurs scores et de consulter des classements.

Le projet a été réalisé dans le cadre du projet de fin de formation du programme Foundations de Holberton School. Cette formation de neuf mois propose un parcours progressif allant des langages de bas niveau jusqu'au développement web. Pour ce projet final, le thème était libre à condition de concevoir et de réaliser une application web fonctionnelle.

J'ai proposé le concept d'OG Game Challenge et assuré le rôle de chef de projet pendant la phase de développement en équipe. Mon objectif était de dépasser la réalisation d'un site vitrine en construisant une application complète réunissant une interface utilisateur, une API REST, une base de données relationnelle, une authentification et plusieurs jeux JavaScript.

Le projet devait également constituer une démonstration concrète de nos compétences auprès des autres étudiants et des recruteurs. Le choix d'une plateforme de jeux permettait de rendre cette démonstration interactive : au lieu de présenter uniquement du code ou des pages statiques, un utilisateur pouvait suivre un parcours complet, depuis son inscription jusqu'à l'apparition de son score dans un classement.

La première version a été développée en équipe du 20 avril au 6 juillet 2026. Après cette période, j'ai repris le projet pour réunir le frontend et le backend, consolider leur fonctionnement et poursuivre les améliorations du portfolio. J'ai ensuite conçu et développé Space Runner afin de compléter le catalogue avec un jeu plus personnel et plus ambitieux sur le plan technique.

### 1.1 Compétences mobilisées

Le projet permet de présenter les compétences suivantes du titre Développeur web et web mobile :

- maquetter des interfaces utilisateur web ou web mobile ;
- réaliser des interfaces utilisateur statiques web ou web mobile ;
- développer la partie dynamique des interfaces utilisateur ;
- mettre en place une base de données relationnelle ;
- développer des composants d'accès aux données ;
- développer des composants métier côté serveur.

Il permet également d'expliquer l'installation de l'environnement de travail et la documentation du lancement d'une application dynamique.

## 2. Expression des besoins

### 2.1 Idée initiale

L'idée d'OG Game Challenge est née de la volonté de créer un projet de fin de formation à la fois technique, ludique et facilement démontrable. Une plateforme de jeux permettait de réunir plusieurs domaines abordés pendant la formation : développement d'interfaces, programmation JavaScript, communication HTTP, logique métier, persistance des données et sécurité.

Le projet ne répondait pas à la commande d'une entreprise réelle. J'ai donc formulé le besoin et défini le périmètre fonctionnel avec l'équipe. Le produit devait rester réalisable dans le temps disponible tout en couvrant un parcours utilisateur complet.

### 2.2 Public visé

La plateforme visait principalement deux catégories d'utilisateurs :

- les autres étudiants, qui pouvaient découvrir les jeux, comparer leurs scores et participer à un défi commun ;
- les recruteurs, pour lesquels l'application servait de support concret afin d'observer les compétences techniques mobilisées dans un projet full-stack.

Ce double public a influencé les choix du projet. L'application devait être simple à comprendre et immédiatement utilisable, mais son architecture devait également être suffisamment structurée pour être expliquée lors d'une présentation technique.

### 2.3 Besoins fonctionnels

Le parcours principal devait permettre à un utilisateur de :

1. accéder à la page d'accueil ;
2. créer un compte avec un nom d'utilisateur, une adresse électronique et un mot de passe ;
3. se connecter et conserver une session ;
4. consulter le catalogue des jeux disponibles ;
5. lancer un jeu dans le navigateur ;
6. obtenir un score à la fin d'une partie ;
7. transmettre ce score au serveur ;
8. consulter le classement correspondant au jeu.

L'application devait donc proposer au minimum :

- une gestion des utilisateurs ;
- une authentification ;
- un catalogue de jeux ;
- plusieurs jeux JavaScript jouables dans le navigateur ;
- une sauvegarde persistante des scores ;
- un classement par jeu ;
- une navigation cohérente entre les différentes pages.

### 2.4 Besoins techniques

Pour répondre à ces fonctionnalités, l'application devait être séparée en plusieurs composants :

- un frontend en HTML, CSS et JavaScript pour l'affichage et les interactions ;
- une API REST chargée de recevoir les requêtes du navigateur ;
- une couche métier chargée de valider les opérations ;
- une base relationnelle pour conserver les utilisateurs, les jeux et les scores ;
- des jeux indépendants capables de transmettre leur résultat à l'application.

Cette séparation devait permettre aux membres de l'équipe de travailler en parallèle, puis de connecter leurs productions lors de la phase d'intégration.

### 2.5 Contraintes

La contrainte principale était le délai : la première version devait être développée entre le 20 avril et le 6 juillet 2026. Le projet devait donc privilégier un produit minimum viable cohérent plutôt qu'une accumulation de fonctionnalités.

Le thème était libre, mais le résultat attendu devait rester une application web. Nous avons également choisi de travailler sans framework frontend afin de mettre en pratique directement HTML, CSS et JavaScript. Le backend devait exposer des routes clairement documentées afin de faciliter la connexion avec le frontend et les jeux.

Le travail en équipe imposait une autre contrainte : les trois parties principales devaient pouvoir évoluer séparément sans empêcher leur intégration. Il était nécessaire de définir les responsabilités de chacun et les données échangées entre les composants.

### 2.6 Périmètre du MVP

Pour respecter le délai, les fonctionnalités ont été classées selon leur importance.

Les éléments indispensables étaient :

- l'inscription et l'authentification ;
- l'API REST ;
- la base de données ;
- le frontend ;
- les jeux jouables ;
- la transmission et l'affichage des scores.

Le responsive, la documentation Swagger et l'amélioration du classement constituaient des objectifs importants, mais secondaires par rapport au fonctionnement du parcours principal.

Certaines évolutions ont volontairement été exclues de la première version :

- le multijoueur en temps réel ;
- les succès et récompenses ;
- plusieurs modes de jeu ;
- le déploiement public complet ;
- une infrastructure cloud ;
- l'adaptation tactile complète des jeux.

Ces limites ont permis de concentrer le développement sur l'intégration entre le frontend, l'API, la base de données et les jeux.

### 2.7 Critères de réussite

Le MVP pouvait être considéré comme fonctionnel si un utilisateur était capable de créer un compte, de s'authentifier, de jouer, d'envoyer un score et de retrouver ce résultat dans le classement sans intervention manuelle dans la base de données.

La réussite technique dépendait également de la séparation des responsabilités : le frontend ne devait pas accéder directement à la base et les jeux ne devaient pas contenir la logique d'authentification ou de persistance.

## 3. Organisation et conduite du projet

### 3.1 Rôle de chef de projet

J'ai créé l'idée d'OG Game Challenge et organisé le travail de l'équipe. Mon rôle consistait à transformer l'idée générale en blocs réalisables, à répartir les responsabilités et à préciser les résultats attendus pour chaque partie.

La répartition initiale était la suivante :

| Membre | Responsabilité principale |
|---|---|
| Hedy | Direction du projet, backend, API, base de données, authentification et logique métier |
| Nael | Développement des premiers jeux JavaScript |
| Geoffray | Développement de l'interface frontend |

Cette répartition permettait un développement parallèle. Mon rôle ne se limitait toutefois pas à produire le backend : je devais également veiller à ce que les interfaces entre les trois blocs soient suffisamment précises pour permettre leur assemblage.

### 3.2 Découpage en deux phases

Le travail a été organisé en deux grandes phases.

La première phase était consacrée au développement indépendant :

- création de l'API, des modèles et de l'authentification ;
- création des pages et de l'identité graphique ;
- développement des jeux JavaScript ;
- définition du format des données échangées.

La seconde phase était consacrée à l'intégration :

- connexion des formulaires à l'API ;
- gestion de la session utilisateur ;
- intégration des jeux dans le portfolio ;
- transmission des scores ;
- récupération des classements ;
- correction des incompatibilités entre les composants.

Cette organisation réduisait les conflits au début du projet, mais rendait la phase d'intégration particulièrement importante. Un composant pouvait fonctionner isolément tout en rencontrant des difficultés une fois connecté aux autres.

### 3.3 Communication

L'équipe communiquait principalement de deux façons : en présentiel lorsque cela était possible et à distance sur Discord. Les échanges permettaient de préciser les tâches, de signaler les difficultés et de coordonner la réunion des différentes parties.

Le code était centralisé avec Git et GitHub. La séparation des responsabilités limitait initialement les modifications simultanées des mêmes fichiers. Lors de l'intégration, il a toutefois fallu harmoniser les arborescences, les routes et les données attendues par chaque composant.

### 3.4 Adaptation à une contrainte humaine

Pendant le projet, l'un des membres ne pouvait pas participer en présentiel. Cette situation risquait de créer un décalage entre son travail et les besoins des autres composants.

Pour maintenir sa participation, je lui ai proposé un plan de charge réalisable entièrement à distance. J'ai précisé les tâches à accomplir ainsi que les éléments attendus au moment de la livraison. Discord permettait de conserver un canal d'échange malgré l'absence physique.

Cette adaptation a permis de préserver la répartition du travail sans bloquer l'avancement général. Elle m'a également appris qu'une consigne technique ne doit pas seulement indiquer une fonctionnalité : elle doit préciser le résultat attendu, son périmètre et la manière dont il devra s'intégrer au reste du projet.

### 3.5 Intégration et poursuite individuelle

Après la période initiale en équipe, j'ai repris seul la fusion du backend et du frontend. Cette étape consistait à rendre cohérents des composants initialement développés séparément, puis à vérifier le parcours complet de l'utilisateur.

J'ai notamment travaillé sur :

- la connexion entre les formulaires et l'API ;
- l'utilisation du JWT dans le navigateur ;
- la transmission des scores ;
- l'affichage des classements ;
- l'intégration des jeux dans l'application ;
- l'harmonisation de l'arborescence et des routes.

J'ai ensuite développé seul Space Runner. Ce jeu représente la réalisation dont je suis le plus satisfait. Sa conception m'a permis d'approfondir la programmation orientée jeu vidéo, domaine vers lequel je souhaite désormais orienter mon parcours. Il a également enrichi le projet en apportant une réalisation plus ambitieuse tout en conservant l'intégration existante avec l'API de scores.

### 3.6 Premier bilan organisationnel

Cette organisation m'a surtout appris à préciser les contrats entre les composants et les résultats attendus avant de répartir le travail. La reprise individuelle m'a ensuite donné une vision complète du système et a préparé le développement de Space Runner.
