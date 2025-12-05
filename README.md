Compte Rendu Decathlon Santé Posturale


Dans le cadre du défi “Devenez le CTO de votre Santé Posturale” proposé par Decathlon durant la Nuit de l’Info, notre équipe a conçu et développé une plateforme technologique complète visant à aider les utilisateurs à effectuer correctement des mouvements sportifs de base afin d’éviter les blessures.
Cette plateforme combine une API moderne, un système d’authentification sécurisé, une interface utilisateur dynamique, ainsi qu’un ensemble d’outils intelligents permettant de guider chaque sportif selon son niveau, son profil et ses besoins.
L’objectif était non seulement de répondre aux exigences du défi (profilage sportif, instructions personnalisées, visualisation et recommandation de produits Decathlon), mais également de proposer une solution robuste, scalable et digne d’un vrai environnement industriel tel qu’on le retrouve dans la filière IT de Decathlon.

1. Vue d'Ensemble & Architecture
Notre solution est une plateforme Full-Stack, sécurisée et gamifiée qui s'aligne sur les ambitions Digitales de Decathlon (Scalabilité et Expérience Utilisateur).

Stack Technologique
Backend (API) : Java 21, Spring Boot , Spring Security , Spring Data JPA. : Répond à l'exigence de la filière IT de Decathlon (mentionnée dans le sujet) d'utiliser Java/Spring pour les systèmes critiques. Assure robustesse et performance.

Frontend (UI) : React, Vite. : Répond à l'exigence de modernité et d'expérience utilisateur (UI/UX) pour une Single Page Application.
Base de Données : MySQL 8 (Dockerisé). : Assure un environnement de production standard et facilite le déploiement "One-Click" (Rendu Rendu Facile).
Sécurité : JWT Bearer Token, BCrypt.
Structure et Données
L'architecture suit un modèle Monolithe propre : les dossiers backend/ et frontend/ sont séparés logiquement, mais résident dans le même dépôt Git.
Les données de catalogue et de démo (exercices, produits, robots) sont injectées automatiquement via DataLoader.java (CommandLineRunner), garantissant un environnement de test propre et fonctionnel pour la démo.


Profilage (QCM) : Flux séparé : L'utilisateur est redirigé vers /profiling après login pour capturer sportFocus et painArea.

Instructions Personnalisées: Moteur de recommandation intelligent (/filter ou /recommend) qui filtre par Sport OU Douleur (targetPainArea).

Illustration & Gamification: Points, Niveaux, Badges et Anti-Triche. Chaque exercice est lié à un GIF animé.

2. Architecture Backend (Sécurité & Robustesse)
   
A. Le Cœur Sécuritaire (Logique HackZone)

Nous avons opté pour une architecture Stateless pour la performance.

Authentification : JWT (JSON Web Tokens) pour la gestion des sessions utilisateur. Le filtre JwtFilter.java intercepte et valide le token dans le Header Authorization: Bearer <token>.

Hachage : BCryptPasswordEncoder est utilisé pour hacher les mots de passe lors de l'inscription (/register), garantissant la sécurité des données utilisateurs (conforme aux normes de sécurité).

CORS (Solution Finale) : Le blocage CORS persistant a été résolu par l'implémentation d'un filtre CORS global dans SecurityConfig.java, autorisant explicitement les méthodes PUT et OPTIONS depuis le Frontend (http://localhost:5173) avant qu'elles n'atteignent le contrôleur.


B. Moteur de Données Avancé

Recommandation Croisée : Le ExerciseController utilise une requête JPA complexe pour filtrer les exercices en fonction du profil d'un utilisateur, garantissant que les instructions sont toujours pertinentes à sa douleur ou son sport.

Anti-Triche : La relation @ManyToMany vers la table solves empêche un utilisateur de valider plusieurs fois le même exercice pour gagner des points.

Initialisation : Le DataLoader.java injecte automatiquement toutes les données de démo (exercices, produits, faux utilisateurs/bots pour le classement) au démarrage de l'application, assurant une base de données fonctionnelle pour le jury (Code First approach).





3. Instructions de Lancement

Prérequis
Docker Desktop (Lancé), Java 17+,npm

Démarrer l'Infrastructure (MySQL) : (À la racine du projet) : docker-compose up -d 


Lancer le Backend (API) :

Ouvrir le dossier backend/ dans IntelliJ.

Lancer DecathlonApplication.java (Bouton Play).

Lancer le Frontend (Interface) :

Bash

cd frontend
npm install
npm run dev


Scénario de Démo

Tester la Sécurité : Tentez d'accéder à /home (doit rediriger vers /auth).

Inscription : Créer un compte sur /auth.

Profilage (Niveau 1) : Le site redirige vers /profiling. Renseignez les champs (ex: Sport Yoga, Douleur Dos) et validez.

Résultats (/home) : Le dashboard charge le profil, le classement, et une liste d'exercices ciblés (Yoga/Dos).

Gamification/Validation : Cliquer sur un exercice mène à la page détaillée où le compteur et le bouton de validation testent le système de points et d'anti-triche.

















