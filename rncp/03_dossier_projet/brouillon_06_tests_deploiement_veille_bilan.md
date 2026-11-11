# 8. Tests, déploiement, veille et bilan

Statut : première version de travail, rédigée le 8 novembre 2026.

## 8.1 Stratégie de test

Pendant le développement initial, les tests étaient principalement manuels. J'ai utilisé Swagger pour appeler les routes une par une avant de connecter le frontend. Cette méthode permettait de vérifier les données envoyées, les codes HTTP et les réponses JSON.

Une fois les composants réunis, j'ai testé le parcours complet dans le navigateur : inscription, connexion, consultation du catalogue, lancement d'un jeu, envoi d'un score et apparition dans le classement.

Les jeux ont également été vérifiés séparément. Les contrôles portaient sur le lancement, les commandes, le calcul du score, la fin de partie, le redémarrage et la transmission du résultat.

Cette stratégie manuelle était adaptée à la première livraison, mais elle dépendait de manipulations répétées. Des tests automatisés ont donc été ajoutés pendant la consolidation du projet.

## 8.2 Tests automatisés

Le backend contient aujourd'hui sept tests d'intégration exécutés avec `unittest`. Chaque test démarre l'application avec une configuration dédiée et utilise une base SQLite temporaire.

Cette isolation évite de modifier la base utilisée pour la démonstration. Après chaque test, la session est fermée, les tables sont supprimées et le dossier temporaire est nettoyé.

Les tests couvrent :

1. le contrôle de santé et la liste des trois jeux ;
2. l'inscription, la connexion et la lecture de son propre profil ;
3. l'absence de l'ancienne route de création d'utilisateur ;
4. le refus d'une inscription dupliquée et d'un mot de passe incorrect ;
5. l'interdiction de consulter le profil d'un autre utilisateur ;
6. l'obligation d'utiliser un JWT et l'identité du token pour un score ;
7. la conservation du meilleur score lorsqu'une nouvelle valeur est inférieure.

Le 8 novembre 2026, les sept tests ont été exécutés après la correction de la sérialisation utilisateur. Ils ont tous réussi.

## 8.3 Jeu d'essai représentatif

La fonctionnalité choisie pour le jeu d'essai est la conservation du meilleur score. Elle traverse la route API, l'authentification, la façade, SQLAlchemy et la base de données.

| Étape | Donnée en entrée | Résultat attendu | Résultat obtenu |
|---|---|---|---|
| Création du joueur | compte Alice | réponse 201 et JWT | conforme |
| Premier score | 200 points | création du score à 200 | conforme |
| Deuxième score | 50 points | conservation de 200 | conforme |
| Lecture du classement | identifiant du jeu | Alice classée avec 200 | conforme |

Le test vérifie explicitement que la seconde réponse contient toujours la valeur 200 et que le premier élément du classement possède également cette valeur.

Il n'y a donc pas d'écart entre le résultat attendu et le résultat obtenu. Ce cas démontre que la règle est appliquée par le backend et pas seulement par l'affichage du navigateur.

## 8.4 Tests de sécurité

Plusieurs tests vérifient des refus plutôt que des cas de réussite :

- une requête de profil sans JWT reçoit `401` ;
- un utilisateur authentifié demandant le profil d'un autre reçoit `403` ;
- un score sans JWT reçoit `401` ;
- un identifiant utilisateur ajouté au JSON ne remplace pas l'identité du JWT ;
- une inscription dupliquée reçoit `400` ;
- une connexion avec un mauvais mot de passe reçoit `401`.

Après la découverte de l'exposition de `password_hash`, deux assertions supplémentaires vérifient que ce champ n'apparaît ni dans la réponse d'inscription ni dans celle du profil.

Ces contrôles permettent de conserver une preuve reproductible des corrections de sécurité.

## 8.5 Limites des tests

La suite actuelle se concentre sur l'intégration backend. Elle ne couvre pas encore automatiquement :

- les interactions réelles dans le navigateur ;
- le responsive ;
- les parties complètes des jeux ;
- les performances de Space Runner ;
- l'accessibilité ;
- les erreurs réseau entre le frontend et l'API.

Ces éléments ont été vérifiés manuellement. Si le projet continuait, des tests frontend et des scénarios de navigateur automatisés compléteraient la suite.

# 9. Installation et déploiement

## 9.1 Lancement local

L'application utilise deux serveurs locaux. Le backend Flask écoute sur le port 5001 et le serveur statique du frontend sur le port 8000.

Le lancement suit cet ordre :

1. créer le fichier `.env` à partir de `.env.example` ;
2. générer les deux secrets ;
3. installer les dépendances Python ;
4. lancer `python3 run.py` dans le backend ;
5. lancer `python3 -m http.server 8000 --bind 0.0.0.0` dans le frontend ;
6. ouvrir la page d'accueil dans le navigateur.

Swagger est disponible à l'adresse locale `/api/v1/`. La route de santé permet de vérifier rapidement que l'API répond.

## 9.2 Accès depuis un téléphone

Le backend et le frontend écoutent sur `0.0.0.0`. Un téléphone connecté au même Wi-Fi peut donc utiliser l'adresse privée de l'ordinateur.

Le JavaScript construit l'adresse de l'API à partir du nom d'hôte utilisé dans le navigateur. Si le site est ouvert avec `192.168.1.55`, les appels sont automatiquement envoyés vers `192.168.1.55:5001`.

Cette méthode a permis de vérifier réellement l'accueil, l'inscription, le catalogue et le classement sur téléphone. Elle ne transforme pas l'ordinateur en hébergement public : les deux serveurs doivent rester actifs et les appareils doivent partager le réseau local.

## 9.3 État réel du déploiement

Le portfolio complet n'est pas déployé sur un serveur public. GitHub Pages peut héberger des fichiers statiques, mais pas l'API Flask ni la base SQLite côté serveur.

Je préfère présenter clairement cette limite plutôt que de qualifier le lancement local de mise en production. La procédure actuelle constitue un déploiement local reproductible et une démonstration sur réseau privé.

## 9.4 Recommandations pour une production

Une mise en ligne demanderait au minimum :

- un serveur WSGI au lieu du serveur de développement Flask ;
- HTTPS ;
- des secrets propres à l'environnement de production ;
- une origine CORS limitée au domaine du frontend ;
- une base sauvegardée et, selon la charge, un serveur PostgreSQL ;
- des migrations versionnées ;
- des journaux et une surveillance du service ;
- une politique de mot de passe et une limitation des tentatives ;
- une stratégie de renouvellement ou d'expiration des sessions.

Il n'est pas nécessaire d'ajouter Docker ou Kubernetes pour démontrer cette compétence. La priorité est de savoir expliquer l'environnement actuel et les changements indispensables avant une ouverture publique.

# 10. Veille sur les vulnérabilités

## 10.1 Démarche

La veille présentée ici a été formalisée pendant la consolidation du projet pour le RNCP. Je ne la présente pas comme un document produit pendant la phase initiale de juin.

Je me suis appuyé sur l'OWASP Top 10 et sur les documentations des bibliothèques utilisées afin de comparer les risques courants aux choix réels du projet.

L'OWASP Top 10 2025 place notamment en avant le contrôle d'accès défaillant, les mauvaises configurations, les défaillances cryptographiques, les injections et les échecs d'authentification. Ces catégories correspondent directement à plusieurs points d'OG Game Challenge.

## 10.2 Contrôle d'accès

Le risque concernait principalement les profils et les scores. Une route ne doit pas se contenter de recevoir un identifiant fourni par le navigateur.

La lecture d'un profil compare maintenant l'identité JWT à l'identifiant demandé. La création d'un score utilise uniquement l'identité extraite du token. Les tests vérifient le refus des accès non authentifiés et des consultations d'un autre profil.

## 10.3 Données sensibles et cryptographie

Bcrypt protège les mots de passe enregistrés et les secrets sont sortis du code source. La revue a également permis de repérer l'exposition de `password_hash` dans une réponse JSON. Le champ a été supprimé des représentations publiques et un test empêche sa réapparition.

Le transport local reste en HTTP. Cette situation est acceptable sur la machine de développement, mais pas pour une authentification publique. Une production devrait obligatoirement utiliser HTTPS.

## 10.4 Injection et validation

Le backend utilise les filtres et requêtes paramétrées de SQLAlchemy au lieu de construire des chaînes SQL avec les valeurs reçues. Les modèles valident également le type et le contenu de plusieurs champs.

Cette protection ne dispense pas de vérifier toutes les entrées. Elle évite surtout la construction manuelle de requêtes contenant directement des données non fiables.

## 10.5 Mauvaise configuration

La configuration CORS actuelle accepte toutes les origines. Ce réglage facilite le développement local et l'accès depuis le téléphone, mais il est trop large pour une production.

Flask-CORS permet de limiter explicitement les origines autorisées. Une version publique devrait n'accepter que le domaine réel du frontend et séparer clairement les configurations de développement, de test et de production.

## 10.6 Résultat de la veille

Cette veille a conduit ou contribué à plusieurs actions concrètes :

- utilisation obligatoire du JWT sur les routes sensibles ;
- identité des scores prise dans le token ;
- protection du profil d'un autre utilisateur ;
- secrets chargés depuis `.env` ;
- suppression de `password_hash` des réponses publiques ;
- tests automatisés des refus d'accès ;
- identification de CORS, HTTPS et du stockage du token comme limites restantes.

## 10.7 Sources retenues

- OWASP Top 10 2025 : `https://top10.owasp.org/2025/0x00_2025-Introduction/` ;
- OWASP Developer Guide : `https://devguide.owasp.org/en/02-foundations/05-top-ten/` ;
- documentation Flask-CORS : `https://flask-cors.readthedocs.io/en/latest/configuration.html` ;
- documentation SQLAlchemy sur les paramètres liés : `https://docs.sqlalchemy.org/en/13/faq/sqlexpressions.html`.

# 11. Bilan personnel et conclusion

## 11.1 Résultat obtenu

OG Game Challenge remplit aujourd'hui le parcours principal imaginé au départ : un utilisateur peut créer un compte, se connecter, consulter trois jeux, jouer, enregistrer son meilleur score et consulter un classement. Le projet réunit un frontend, une API, une base relationnelle et une authentification, avec une interface utilisable sur ordinateur et consultable sur téléphone.

## 11.2 Ce que le projet m'a apporté

Au début, ma responsabilité principale concernait le backend. La reprise individuelle m'a obligé à comprendre l'ensemble du parcours, depuis le clic dans le navigateur jusqu'à la base de données.

Le rôle de chef de projet m'a aussi appris à répartir un besoin, préciser un résultat attendu et m'adapter à la disponibilité d'un membre. La difficulté n'était pas seulement d'écrire du code, mais de faire en sorte que plusieurs productions puissent fonctionner ensemble.

## 11.3 Space Runner et mon orientation

Space Runner reste la partie dont je suis le plus satisfait. Le développer entièrement m'a permis de travailler sur une boucle temps réel, les collisions, les états, les boss, l'audio, les performances et l'équilibrage.

Cette expérience a renforcé mon envie de m'orienter vers le jeu vidéo. Elle m'a montré que j'appréciais autant la construction des mécaniques et du ressenti que l'architecture générale d'une application.

## 11.4 Recul sur le projet

Avec davantage de temps, je prioriserais l'audio, les mesures de performance et les essais d'équilibrage de Space Runner. Sur la partie web, je renforcerais la configuration de production, les migrations, les tests frontend et la protection de la session.

## 11.5 Conclusion

Passé d'un travail d'équipe à une reprise individuelle, OG Game Challenge reflète ma progression du backend vers l'intégration full-stack et la programmation de jeux. Ses limites sont identifiées, mais l'ensemble reste cohérent, fonctionnel et représentatif des compétences que j'ai réellement mises en œuvre.
