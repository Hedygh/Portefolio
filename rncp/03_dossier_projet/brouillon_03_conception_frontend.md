# 5. Conception de l'interface et réalisation du frontend

Statut : première version de travail, rédigée le 8 novembre 2026. Les maquettes, captures et extraits de code seront intégrés lors de la mise en page.

## 5.1 Une identité liée au jeu vidéo

OG Game Challenge devait être identifiable dès la page d'accueil. L'objectif n'était pas de créer une interface neutre, mais de faire comprendre immédiatement que l'utilisateur entrait dans un univers de jeux et de compétition.

J'ai proposé l'idée générale du projet ainsi que son orientation. L'identité visuelle a ensuite été définie en commun avec Geoffray, responsable principal du frontend. Le résultat associe un univers arcade à une esthétique cyberpunk : fond sombre, violet lumineux, touches dorées, typographies géométriques et éléments qui rappellent un affichage de jeu.

J'ai particulièrement participé au design de la page d'accueil. Cette page devait rester assez simple pour ne pas perdre l'utilisateur : le nom du projet occupe l'espace principal, la navigation reste visible et un bouton invite directement à rejoindre la plateforme.

Le frontend a ensuite conservé cette même identité sur les pages d'inscription, de connexion, de catalogue et de classement. Cette cohérence était importante, car les jeux possèdent chacun leur propre style. L'interface du portfolio devait donc servir de cadre commun entre des expériences différentes.

## 5.2 Une interface rédigée en anglais

Les textes de l'interface sont principalement en anglais. Ce choix vient d'abord de mon habitude de développement : je considère l'anglais comme la langue commune du domaine informatique. Les noms de routes, les variables, les messages techniques et une grande partie des ressources utilisées pendant le développement sont déjà en anglais.

Dans le contexte du projet, cette langue correspondait également bien à l'identité arcade. Des termes comme « Challenge », « Play » ou « Leaderboard » sont courts, reconnaissables et cohérents avec les références du jeu vidéo.

Le dossier et la présentation restent rédigés en français afin d'expliquer clairement les choix techniques. L'anglais est donc un choix d'interface, pas une difficulté à traduire le fonctionnement du projet.

## 5.3 Parcours utilisateur

Le parcours principal est volontairement direct :

```text
Accueil
   ↓
Inscription ou connexion
   ↓
Catalogue des jeux
   ↓
Partie
   ↓
Enregistrement du score
   ↓
Classement
```

La barre de navigation donne accès à l'accueil, aux défis et au classement. L'état de la session modifie la zone d'authentification afin d'afficher les actions adaptées à un visiteur ou à un utilisateur connecté.

Le catalogue présente chaque jeu dans une carte avec deux actions principales : lancer le jeu ou consulter son classement. L'utilisateur n'a donc pas besoin de parcourir plusieurs écrans avant de comprendre ce qu'il peut faire.

## 5.4 Maquettes reconstituées

Aucune maquette source réalisée avant le développement n'a été conservée. Pour documenter la démarche sans prétendre le contraire, deux maquettes filaires ont été reconstituées à partir du résultat final.

Le catalogue a été retenu comme écran représentatif, car il réunit la navigation, le titre, la liste des jeux et les actions principales. Une version desktop présente les cartes sur plusieurs colonnes. Une version mobile place les cartes les unes sous les autres et réorganise la navigation.

Ces documents ne sont pas présentés comme des archives du début du projet. Ils servent à formaliser les choix d'organisation et à montrer comment une même interface s'adapte à deux tailles d'écran. Les captures du site réel constituent une preuve séparée du résultat obtenu.

## 5.5 Structure du frontend

Le frontend utilise HTML, CSS et JavaScript sans framework. Les fichiers sont répartis par responsabilité :

```text
frontend/
├── html/       pages du site et jeux intégrés
├── css/        styles globaux, styles des pages et responsive
├── js/         session, appels API, interfaces dynamiques et jeux
└── assets/     images, sons, vidéos et ressources des jeux
```

Chaque page HTML charge une feuille globale, une feuille correspondant à son interface et la couche responsive commune. Cette organisation permet de partager la navigation, les couleurs et les typographies tout en conservant des règles spécifiques pour l'accueil, les formulaires, le catalogue ou le classement.

Les variables CSS définissent les couleurs principales et les polices. Cela évite de répéter partout les mêmes valeurs et facilite une modification globale de l'identité visuelle.

## 5.6 Pages statiques

Les interfaces sont structurées avec des éléments HTML simples : navigation, contenu principal, formulaires, cartes, boutons et tableau de classement.

La page d'accueil joue le rôle d'entrée dans le projet. Les pages d'inscription et de connexion utilisent des formulaires lisibles avec des messages de retour. Le catalogue réserve une grille dans laquelle les jeux sont ajoutés par JavaScript. Le classement contient des onglets et une zone destinée aux scores récupérés depuis l'API.

Même lorsque leur contenu devient dynamique, ces pages reposent d'abord sur une structure statique claire. JavaScript complète ensuite les zones prévues sans reconstruire toute la page.

## 5.7 Adaptation mobile récente

Le responsive faisait partie de l'intention générale du projet, mais l'adaptation mobile visible aujourd'hui a surtout été renforcée récemment. Il est important de conserver cette chronologie dans le dossier.

Une feuille `responsive.css` commune a été ajoutée après les styles propres à chaque page. Elle adapte notamment :

- la navigation, qui peut passer sur deux lignes ;
- la taille des titres ;
- les marges latérales ;
- les cartes de jeux, affichées sur une colonne ;
- les boutons, qui utilisent davantage la largeur disponible ;
- les colonnes du classement ;
- la taille des zones Canvas.

Cette couche commune évite de répéter les mêmes media queries dans chaque feuille de style. Elle permet aujourd'hui de consulter l'accueil, les formulaires, le catalogue et le classement depuis un téléphone connecté au même réseau local que l'ordinateur.

Les quatre captures réalisées sur téléphone montrent que ces interfaces restent lisibles et utilisables. Les jeux, en revanche, n'ont pas encore tous de commandes tactiles. Le responsive du site et la jouabilité tactile sont deux sujets différents : le premier est pris en charge, tandis que le second reste une évolution possible.

## 5.8 Répartition du travail sur le frontend et les jeux

Geoffray a assuré la réalisation principale du frontend. L'identité générale a été décidée en commun, et j'ai participé plus directement au design de la page d'accueil. Mon rôle de chef de projet consistait également à vérifier que les interfaces prévues permettaient d'accéder aux fonctions nécessaires : inscription, connexion, catalogue, jeux et classement.

Pour les deux premiers jeux, j'ai défini le type de jeu attendu. Nael a ensuite conçu et développé lui-même Dodge Runner et Platformer Escape. Cette répartition lui laissait une autonomie sur les mécaniques et leur réalisation tout en maintenant une direction commune pour la plateforme.

Space Runner a été conçu et développé entièrement par moi après la phase initiale. Il reprend le même principe d'intégration : le jeu reste autonome pour son gameplay, mais transmet son résultat à l'API du portfolio.

Cette distinction est importante pour présenter le projet au jury. Le dossier rend compte de l'application dans son ensemble, mais je dois être capable d'identifier précisément ma contribution et celle de chaque membre.

## 5.9 Premiers éléments d'accessibilité

Le projet ne prétend pas atteindre une conformité complète à un référentiel d'accessibilité. Plusieurs choix améliorent néanmoins l'utilisation :

- contraste important entre le fond sombre et les textes ;
- états visuels sur les liens actifs et les boutons ;
- adaptation de la taille des éléments sur petit écran ;
- indication des commandes de Space Runner ;
- compatibilité AZERTY et QWERTY pour ce jeu ;
- limitation possible de certains effets lorsque l'utilisateur réduit les animations.

Ces éléments restent des améliorations ciblées. Une vérification complète au clavier, avec lecteur d'écran et outils spécialisés constituerait une étape supplémentaire.

## 5.10 Bilan de la conception frontend

L'interface remplit son objectif principal : créer un cadre cohérent autour de plusieurs jeux et rendre visible le parcours complet de l'utilisateur.

La participation de plusieurs personnes a apporté des idées différentes, mais elle a aussi demandé de préciser les responsabilités. J'ai défini le concept général et les types de jeux, participé à l'accueil et piloté les fonctionnalités attendues. Geoffray a réalisé le frontend principal et Nael a transformé les deux premiers types de jeux en réalisations jouables.

L'amélioration mobile récente montre aussi que le projet a continué d'évoluer après sa première livraison. Elle ne change pas le besoin initial, mais rend aujourd'hui la démonstration plus accessible sur différents écrans.

---

## Illustrations et extraits à intégrer ultérieurement

- maquette desktop du catalogue ;
- maquette mobile du catalogue ;
- schéma du parcours utilisateur ;
- capture desktop de l'accueil ;
- captures mobiles déjà disponibles ;
- extrait HTML d'une interface ;
- extrait des variables CSS ;
- extrait court de `responsive.css`.
