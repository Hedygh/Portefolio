# Dossier professionnel Développeur web et web mobile

## Identité

- Nom de naissance : OUAHES
- Nom d'usage : néant
- Prénoms : Hédy Erwan
- Adresse : 6 allée Emmanuel Frémiet, 78430 Louveciennes
- Titre professionnel visé : RNCP 37674 Développeur web et web mobile
- Modalité d'accès : parcours de formation

---

# Activité type 1

## Développer la partie front-end d'une application web ou web mobile en intégrant les recommandations de sécurité

## Exemple 1 OG Game Challenge et Space Runner

### 1. Décrivez les tâches ou opérations que vous avez effectuées, et dans quelles conditions

OG Game Challenge est le projet de fin de ma formation Foundations à Holberton School. Nous devions réaliser une application web sur un thème libre. J'ai proposé l'idée d'une plateforme regroupant plusieurs jeux accessibles depuis un navigateur, avec une inscription, une connexion et un classement pour chaque jeu.

Pendant la première phase, du 20 avril au 6 juillet 2026, j'ai participé à la conception du parcours utilisateur et au design de la page d'accueil. J'ai aussi défini avec l'équipe les informations que le front-end devait obtenir de l'API : les jeux disponibles, l'utilisateur connecté et les classements.

Après la phase collective, j'ai repris le projet en septembre et octobre 2026 afin de réunir le frontend et le backend et de consolider le fonctionnement d'ensemble. J'ai relié les formulaires d'inscription et de connexion à l'API, géré la session de l'utilisateur et rendu le catalogue ainsi que les classements dynamiques. J'ai également adapté l'interface aux écrans mobiles et rendu l'adresse de l'API compatible avec un accès depuis un téléphone connecté au même réseau local.

J'ai ensuite conçu et développé Space Runner en JavaScript avec l'API Canvas. J'ai programmé le déplacement du vaisseau, les tirs, les ennemis, les météorites, les collisions, le score, les portails, les changements de phase et le boss. J'ai aussi travaillé sur les performances, l'équilibrage de la difficulté et l'intégration de l'audio. Le score final est envoyé à l'API pour apparaître dans le classement.

J'ai pris en compte la sécurité côté client en ne faisant pas confiance à un identifiant utilisateur transmis par le navigateur pour enregistrer un score. Le frontend transmet le jeton JWT et le backend retrouve l'identité de l'utilisateur à partir de ce jeton. Les erreurs d'authentification et les réponses de l'API sont également traitées dans l'interface.

### 2. Précisez les moyens utilisés

J'ai utilisé HTML5 et CSS3 pour la structure et le style, JavaScript pour les interactions et les appels HTTP, l'API Fetch pour communiquer avec le backend et Canvas pour Space Runner. Le navigateur et ses outils de développement m'ont servi à contrôler l'affichage, les requêtes réseau, le stockage de la session et les erreurs JavaScript.

Le projet a été versionné avec Git et GitHub. J'ai utilisé les routes documentées dans Swagger pour vérifier les données attendues avant leur intégration dans l'interface. J'ai aussi testé le rendu sur ordinateur et sur smartphone par l'intermédiaire du réseau local.

### 3. Avec qui avez-vous travaillé

La première version a été réalisée avec Geoffray et Nael. J'ai assuré la coordination du projet, la répartition des tâches et le suivi de l'avancement. Geoffray a principalement travaillé sur le frontend et l'identité visuelle. Nael a développé Dodge Runner et Platformer Escape à partir des types de jeux que je lui avais proposés. Nous communiquions en présentiel et sur Discord.

La reprise de l'intégration, l'adaptation mobile et le développement de Space Runner ont ensuite été réalisés personnellement.

### 4. Contexte

- Organisme : Holberton School
- Projet : projet de fin de formation Foundations
- Période d'exercice en équipe : du 20 avril 2026 au 6 juillet 2026
- Période de reprise et de développement de Space Runner : septembre et octobre 2026

---

## Exemple 2 HBnB interface web

### 1. Décrivez les tâches ou opérations que vous avez effectuées, et dans quelles conditions

HBnB est un projet pédagogique inspiré du fonctionnement d'une plateforme de location. Le projet était organisé en plusieurs étapes afin de passer de la conception UML à une application full-stack. Pour la partie front-end, une maquette minimale et un cadre fonctionnel étaient fournis. Mon objectif était de rendre cette interface fonctionnelle en la reliant à l'API, sans chercher à ajouter un design plus complexe que celui demandé.

J'ai travaillé sur le formulaire de connexion, l'affichage de la liste des lieux, le filtrage par prix, la page de détail d'un lieu et l'affichage ou l'ajout des avis. Les données étaient obtenues par des requêtes HTTP puis injectées dans les pages avec JavaScript.

J'ai mis en place l'utilisation du JWT côté navigateur. Après la connexion, le jeton était conservé dans un cookie puis ajouté aux requêtes nécessitant une authentification. L'interface s'adaptait à l'état de connexion, notamment pour autoriser l'ajout d'un avis. J'ai également traité les erreurs renvoyées par l'API afin de ne pas présenter une action comme réussie lorsqu'elle avait été refusée.

La principale difficulté au début du projet était de comprendre le rôle de l'API et la circulation des données entre le navigateur et le serveur. Le travail progressif sur les routes et les réponses JSON m'a permis de mieux comprendre cette séparation et de rendre l'interface dynamique.

### 2. Précisez les moyens utilisés

J'ai utilisé HTML5, CSS3 et JavaScript. Les appels au backend reposaient sur l'API Fetch et les pages étaient actualisées par manipulation du DOM. Le JWT était stocké dans un cookie. Les outils de développement du navigateur m'ont permis de vérifier les requêtes, les réponses, les erreurs et le contenu du stockage côté client.

Git et GitHub ont été utilisés pour le versionnement. Swagger et les tests de l'API ont servi à comprendre les routes disponibles et à contrôler leur comportement avant l'intégration côté interface.

### 3. Avec qui avez-vous travaillé

J'ai travaillé avec Geoffray. Nous avons choisi de ne pas séparer strictement le frontend et le backend entre nous. Nous avons travaillé sur les mêmes types de tâches et coordonné nos modifications afin que chacun comprenne le fonctionnement global du projet. Cette organisation nous a aidés à relier plus facilement les pages aux routes de l'API.

### 4. Contexte

- Organisme : Holberton School
- Projet : HBnB
- Période d'exercice : du 2 février 2026 au 3 avril 2026
- Résultat : projet rendu avec succès et évalué avec une excellente note

---

# Activité type 2

## Développer la partie back-end d'une application web ou web mobile en intégrant les recommandations de sécurité

## Exemple 1 API et base de données de OG Game Challenge

### 1. Décrivez les tâches ou opérations que vous avez effectuées, et dans quelles conditions

Pour OG Game Challenge, j'ai pris en charge la partie back-end, la base de données et l'authentification. J'ai organisé l'application Flask en couches afin de séparer les routes de l'API, la logique métier et l'accès aux données. Cette organisation venait de l'expérience acquise pendant HBnB et devait rendre le code plus lisible et plus facile à faire évoluer.

J'ai créé les modèles SQLAlchemy correspondant aux utilisateurs, aux jeux et aux scores. Les relations permettent d'associer chaque score à un utilisateur et à un jeu. J'ai développé les routes REST nécessaires à l'inscription, à la connexion, à la consultation des jeux, à l'enregistrement d'un score et à l'affichage des classements.

La règle métier la plus particulière concernait les scores. Pour un même utilisateur et un même jeu, l'application devait conserver son meilleur résultat. Lorsqu'un nouveau score arrive, le backend recherche donc le score existant, compare les deux valeurs et ne remplace l'ancienne valeur que si la nouvelle est supérieure.

J'ai sécurisé les mots de passe avec un hachage et protégé les routes privées avec des JWT. Pour l'enregistrement des scores, l'identité n'est pas choisie par le navigateur : elle est extraite du jeton de l'utilisateur authentifié. Pendant la préparation RNCP, une revue a aussi montré que le champ technique `password_hash` pouvait apparaître dans une réponse utilisateur. J'ai corrigé la sérialisation afin de supprimer ce champ et ajouté un test pour éviter sa réapparition.

J'ai enfin créé une suite de tests d'intégration couvrant l'inscription, la connexion, l'accès au profil, le refus d'accès au profil d'un autre utilisateur, la protection JWT des scores, la disponibilité des jeux et la conservation du meilleur score. Les sept tests s'exécutent avec succès.

### 2. Précisez les moyens utilisés

J'ai utilisé Python, Flask, Flask-RESTX, SQLAlchemy et SQLite. Flask-Bcrypt assure le hachage des mots de passe et Flask-JWT-Extended la création et la vérification des jetons. La documentation et les essais manuels des routes ont été réalisés avec Swagger.

Le code a été versionné avec Git et GitHub. Les secrets de configuration ont été sortis du code source et placés dans un fichier d'environnement exclu du dépôt. Les tests automatisés utilisent le module `unittest` et une base isolée afin de ne pas modifier les données de l'application utilisée en démonstration.

### 3. Avec qui avez-vous travaillé

J'ai réalisé le backend et la base de données pendant la phase collective du projet, tout en coordonnant les besoins avec Geoffray pour le frontend et avec Nael pour l'intégration des jeux. Les routes et les formats de réponse devaient fournir les données attendues par leurs parties.

J'ai ensuite repris personnellement la fusion du backend et du frontend, la correction de l'identification des scores par JWT, la sécurisation des réponses utilisateur et la mise en place des tests automatisés.

### 4. Contexte

- Organisme : Holberton School
- Projet : projet de fin de formation Foundations
- Période d'exercice en équipe : du 20 avril 2026 au 6 juillet 2026
- Période de reprise et de consolidation : septembre à novembre 2026

---

## Exemple 2 API persistance et authentification de HBnB

### 1. Décrivez les tâches ou opérations que vous avez effectuées, et dans quelles conditions

Le projet HBnB a été construit progressivement. Nous avons commencé par représenter l'architecture, les classes métier et les échanges entre les couches avec des diagrammes UML. Nous avons ensuite développé les entités User, Place, Review et Amenity, puis les routes de l'API permettant de les créer, les consulter et les modifier.

J'ai participé à l'ensemble de la partie back-end avec Geoffray. Nous avons mis en place une architecture en couches comprenant la présentation REST, la logique métier, une façade et la persistance. Les premières étapes utilisaient un dépôt en mémoire. Nous avons ensuite remplacé ce stockage par SQLAlchemy et SQLite afin de rendre les données persistantes.

J'ai travaillé sur les relations entre les utilisateurs, les lieux, les avis et les équipements. Il fallait notamment représenter les relations un-à-plusieurs et plusieurs-à-plusieurs, assurer l'unicité de certaines données et contrôler la validité des valeurs reçues par l'API.

Nous avons ajouté une authentification JWT et distingué les droits d'un utilisateur normal de ceux d'un administrateur. Certaines actions n'étaient accessibles qu'après authentification et les routes devaient vérifier que l'utilisateur avait le droit de modifier la ressource demandée.

En fin de projet, nous avons également écrit des fichiers SQL destinés à l'apprentissage de MySQL. Ils décrivent le schéma, les données initiales et des requêtes de contrôle. La base utilisée pour le fonctionnement courant du projet restait SQLite avec SQLAlchemy.

La principale difficulté a été la compréhension initiale des API et de la séparation entre les routes, la logique métier et la persistance. Le découpage progressif du projet, les essais de chaque route et le travail sur les diagrammes m'ont permis de comprendre le trajet complet d'une requête.

### 2. Précisez les moyens utilisés

J'ai utilisé Python, Flask, Flask-RESTX, SQLAlchemy, SQLite et JWT. Des scripts SQL MySQL ont été produits pour comprendre la création du schéma et les requêtes sans passer uniquement par l'ORM.

La documentation interactive Swagger, cURL et les outils du navigateur ont servi aux essais manuels. Le dépôt contient également des tests automatisés pour les utilisateurs, les lieux, les avis, les équipements et les relations. Git et GitHub ont assuré le versionnement et la coordination. Des outils de dessin de diagrammes ont été utilisés pour l'architecture, les classes et les séquences.

### 3. Avec qui avez-vous travaillé

J'ai travaillé avec Geoffray. Nous avons avancé en coordination sur les mêmes parties du projet plutôt que d'isoler complètement le frontend, le backend ou la base de données. Cette organisation nous a permis d'avoir tous les deux une compréhension globale de l'architecture et de faciliter la liaison entre les différentes couches.

### 4. Contexte

- Organisme : Holberton School
- Projet : HBnB
- Période d'exercice : du 2 février 2026 au 3 avril 2026
- Résultat : projet rendu avec succès et évalué avec une excellente note

---

# Déclaration sur l'honneur

Je soussigné OUAHES Hédy Erwan, déclare sur l'honneur que les renseignements fournis dans ce dossier sont exacts et que je suis l'auteur des réalisations présentées.

Fait à Louveciennes, le ................................................

Signature :

