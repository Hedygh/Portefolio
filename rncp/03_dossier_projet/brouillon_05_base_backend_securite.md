# 7. Base de données, composants backend et sécurité

Statut : première version de travail, rédigée le 8 novembre 2026.

## 7.1 Modèle relationnel

La base repose sur trois entités principales : l'utilisateur, le jeu et le score.

Un utilisateur peut obtenir plusieurs scores, mais chaque score appartient à un seul utilisateur. Un jeu peut recevoir plusieurs scores, mais chaque score concerne un seul jeu. La table `scores` relie donc `users` et `games` grâce à deux clés étrangères.

Les trois tables héritent d'un modèle de base qui ajoute un identifiant UUID, une date de création et une date de modification. Les UUID sont stockés sous forme de chaînes de 36 caractères.

La table `users` contient un email unique, un nom d'utilisateur unique et une empreinte Bcrypt du mot de passe. La table `games` contient un nom et une description. La table `scores` contient la valeur obtenue et les références vers l'utilisateur et le jeu.

Le MCD présente cette logique indépendamment de SQL. Le MLD la traduit ensuite en tables, clés primaires, clés étrangères, types et contraintes.

## 7.2 Choix de SQLite et SQLAlchemy

SQLite correspond au contexte local du projet. La base tient dans un fichier, ne demande pas de serveur supplémentaire et suffit pour tester les relations et les requêtes du MVP.

SQLAlchemy évite d'écrire toutes les requêtes SQL à la main. Les modèles Python sont associés aux tables et l'ORM construit les opérations nécessaires. Cela réduit aussi le risque d'injection SQL lorsque les filtres et paramètres sont utilisés correctement.

Ce choix ne signifie pas que la base est indépendante de toute réflexion relationnelle. Il reste nécessaire de définir les clés, les relations, les contraintes et les règles qui appartiennent au code métier.

## 7.3 Initialisation

Au lancement, SQLAlchemy crée les tables manquantes avec `db.create_all()`. Une fonction ajoute ensuite les trois jeux par défaut si la table est vide.

Cette solution est pratique pour une démonstration locale, car une nouvelle base peut être préparée automatiquement. Elle reste toutefois plus limitée qu'un système de migrations versionnées. Dans un projet en production, un outil comme Flask-Migrate permettrait de conserver l'historique des évolutions du schéma.

## 7.4 Repository générique

Le repository SQLAlchemy regroupe les opérations simples communes aux modèles : ajouter, lire par identifiant, lire la liste complète et supprimer.

Il reçoit la classe du modèle lors de sa création. La façade peut donc utiliser la même structure pour les utilisateurs, les jeux et les scores.

J'ai conservé cette couche parce qu'elle sépare la persistance de la logique métier. Une route n'a pas besoin de connaître `db.session`, et une règle métier n'a pas besoin de répéter les mêmes opérations de base.

Les requêtes plus spécifiques restent dans la façade lorsqu'elles expriment directement un besoin du projet, comme rechercher un utilisateur par email ou trier les scores d'un jeu.

## 7.5 Façade métier

La façade constitue le point central du backend. Elle utilise les repositories et les modèles, mais présente des méthodes correspondant aux actions de l'application.

Lors d'une inscription, elle vérifie d'abord que l'email et le nom d'utilisateur ne sont pas déjà utilisés. Elle crée ensuite l'utilisateur, dont le modèle hache le mot de passe avant l'enregistrement.

Lors d'une connexion, elle recherche l'utilisateur par son nom puis compare le mot de passe fourni à l'empreinte enregistrée.

Pour un score, elle vérifie l'existence de l'utilisateur et du jeu. Elle recherche ensuite un résultat existant pour ce couple. Si la nouvelle valeur est supérieure, elle remplace l'ancienne. Dans le cas contraire, elle conserve le meilleur résultat déjà enregistré.

Enfin, le classement filtre les scores par jeu et applique un tri décroissant sur leur valeur.

## 7.6 Une règle métier non remplacée par le frontend

La conservation du meilleur score doit rester côté serveur. Si la comparaison était réalisée uniquement dans JavaScript, un utilisateur pourrait contourner cette logique en appelant directement l'API.

Le frontend peut afficher le meilleur résultat reçu, mais il ne décide pas de la valeur conservée. Cette décision appartient à la façade, qui constitue la source de vérité.

La règle est actuellement garantie par le code métier. La base ne possède pas encore de contrainte unique composée sur `user_id` et `game_id`. Une telle contrainte renforcerait la cohérence en cas d'accès concurrents, mais elle demanderait aussi une migration du schéma.

## 7.7 Authentification et autorisation

Après une inscription ou une connexion valide, Flask-JWT-Extended crée un JWT dont l'identité correspond à l'UUID de l'utilisateur.

Les routes sensibles utilisent `@jwt_required()`. Pour la consultation d'un profil, le backend compare l'identité du token avec l'identifiant demandé. Un utilisateur ne peut donc pas lire le profil d'un autre compte en changeant simplement l'URL.

Pour l'enregistrement d'un score, l'API ignore toute identité éventuellement envoyée dans le corps de la requête. Elle utilise uniquement `get_jwt_identity()`. Cette correction est importante : sans elle, un utilisateur pourrait attribuer un score à un autre compte.

## 7.8 Protection des mots de passe et des secrets

Les mots de passe sont hachés avec Bcrypt. Le backend ne peut pas retrouver le mot de passe d'origine : il vérifie seulement si une valeur proposée correspond à l'empreinte.

Les clés Flask et JWT ne sont plus écrites dans le code. Elles sont chargées depuis un fichier `.env` ignoré par Git. Le fichier `.env.example` indique uniquement les noms des variables attendues.

Lors de la préparation du dossier, une capture Swagger a montré une faiblesse : la méthode générique de sérialisation renvoyait aussi `password_hash` dans la réponse utilisateur. Une empreinte n'est pas le mot de passe, mais elle ne doit jamais être exposée au client.

J'ai corrigé ce point en redéfinissant `User.to_dict()` pour retirer systématiquement `password_hash`. J'ai ensuite ajouté des assertions dans les tests d'inscription et de lecture du profil. Cette démarche a permis de transformer une observation de documentation en amélioration concrète de la sécurité.

## 7.9 Validation des données

Les modèles vérifient plusieurs règles avant l'enregistrement :

- l'email doit être une chaîne non vide contenant `@` ;
- le nom d'utilisateur ne peut pas être vide ;
- le mot de passe ne peut pas être vide ;
- un score doit être un entier positif ou nul ;
- le jeu et l'utilisateur associés au score doivent exister.

Le frontend effectue aussi des contrôles pour améliorer l'expérience, comme la présence des champs et une longueur minimale du mot de passe. Les contrôles du navigateur ne remplacent toutefois jamais ceux du serveur.

## 7.10 Limites de sécurité connues

Le projet présente plusieurs limites que je préfère identifier clairement :

- CORS accepte actuellement toutes les origines ;
- le mode de développement utilise le serveur Flask intégré ;
- l'application locale n'utilise pas HTTPS ;
- le JWT est stocké dans `localStorage` ;
- la politique de mot de passe reste simple ;
- aucune limitation de fréquence n'est appliquée aux tentatives de connexion ;
- la base utilise `create_all()` plutôt que des migrations.

Ces éléments sont acceptables pour un MVP local, mais ils devraient être traités avant une ouverture publique. Le dossier distingue donc les protections réellement mises en œuvre des recommandations de production.

---

## Illustrations et extraits à intégrer

- MCD et MLD ;
- extrait du modèle `Score` ;
- extrait du repository ;
- extrait de `submit_score()` ;
- extrait de la route protégée ;
- capture Swagger anonymisée de l'inscription ;
- extrait du test vérifiant l'absence de `password_hash`.
