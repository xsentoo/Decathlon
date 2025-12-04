-- ============================================================
-- 1. CRÉATION DE LA BASE DE DONNÉES (Le point de départ)
-- ============================================================
CREATE DATABASE IF NOT EXISTS decathlon_db;
USE decathlon_db;

-- ============================================================
-- 2. NETTOYAGE (Pour éviter les conflits si tu relances)
-- ============================================================
-- On désactive temporairement la vérification des clés étrangères pour pouvoir tout supprimer
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS solves;
DROP TABLE IF EXISTS exercise;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 3. TABLE UTILISATEURS (Auth + Profilage + Gamification)
-- ============================================================
CREATE TABLE users (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,

    -- AUTHENTIFICATION (Sécurité)
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL, -- Sera stocké haché (BCrypt : $2a$10$...)
                       pseudo VARCHAR(50),

    -- NIVEAU 1 : PROFILAGE SPORTIF (Critères Decathlon)
                       sport_focus VARCHAR(50),  -- Ex: 'Running', 'Yoga'
                       pain_area VARCHAR(50),    -- Ex: 'Dos', 'Genoux'

    -- NIVEAU 3 : GAMIFICATION (Logique HackZone)
                       point INT DEFAULT 0,            -- Score total
                       level VARCHAR(20) DEFAULT 'deb',-- 'deb', 'int', 'avan'
                       badge VARCHAR(50) DEFAULT 'Novice'
);

-- ============================================================
-- 4. TABLE EXERCICES (Contenu + Business + Récompense)
-- ============================================================
CREATE TABLE exercise (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,

    -- NIVEAU 2 : INSTRUCTIONS PÉDAGOGIQUES
                          title VARCHAR(255) NOT NULL,
                          instructions TEXT,          -- Le texte du coach

    -- FILTRES (Pour savoir à qui proposer cet exo)
                          target_sport VARCHAR(50),   -- Ex: 'Running'
                          difficulty VARCHAR(20),     -- Ex: 'Debutant'

    -- GAMIFICATION
                          points_reward INT DEFAULT 50, -- Points à gagner

    -- NIVEAU 3 : VISUEL
                          gif_url VARCHAR(500),       -- Animation du mouvement

    -- NIVEAU 4 : LIEN BUSINESS DECATHLON (Le Bonus)
                          product_name VARCHAR(255),
                          product_url VARCHAR(500),   -- Lien d'achat
                          product_image VARCHAR(500)  -- Image du produit
);

-- ============================================================
-- 5. TABLE HISTORIQUE (Anti-Triche)
-- ============================================================
CREATE TABLE solves (
                        user_id BIGINT,
                        exercise_id BIGINT,
                        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- CLÉ UNIQUE : Un utilisateur ne peut valider un exo qu'une seule fois !
                        PRIMARY KEY (user_id, exercise_id),

                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                        FOREIGN KEY (exercise_id) REFERENCES exercise(id) ON DELETE CASCADE
);

-- ============================================================
-- 6. DONNÉES DE DÉMO (Vrais produits Decathlon)
-- ============================================================

INSERT INTO exercise
(title, instructions, target_sport, difficulty, points_reward, gif_url, product_name, product_url, product_image)
VALUES

-- EXO 1 : YOGA (Dos)
(
    'La Posture de l\'Enfant',
    'Idéal pour le dos. Mettez-vous à genoux, fesses sur les talons, et étendez les bras loin devant. Respirez profondément pendant 30 secondes.',
    'Yoga', 'Debutant', 50,
    'https://media.giphy.com/media/3o7qDYXe0QuLCme1Fu/giphy.gif',
    'Tapis de Yoga Confort 8mm',
    'https://www.decathlon.fr/p/tapis-de-yoga-confort-8-mm/_/R-p-324419',
    'https://contents.mediadecathlon.com/p1858972/k$f1270273760430005273752760604300/sq/tapis-de-yoga-confort-8-mm.jpg'
),

-- EXO 2 : RUNNING (Genoux)
(
    'Renforcement Quadriceps',
    'Fentes avant : Gardez le buste droit. Faites un grand pas en avant et fléchissez jusqu\'à 90 degrés. Le genou ne doit pas dépasser la pointe du pied.',
    'Running', 'Intermediaire', 100,
    'https://media.giphy.com/media/l3vRb68BwbZq73h28/giphy.gif',
    'Genouillère de Maintien Prevent 500',
    'https://www.decathlon.fr/p/genouillere-de-maintien-prevent-500/_/R-p-169460',
    'https://contents.mediadecathlon.com/p1999905/k$d6d84715875225375382346617056636/sq/genouillere-de-maintien-prevent-500.jpg'
),

-- EXO 3 : SURF (Équilibre & Gainage)
(
    'Le Pop-Up (Redressement)',
    'Simulez le mouvement de redressement sur la planche. Poussez fort sur les bras et ramenez les jambes en un éclair sous le corps.',
    'Surf', 'Expert', 200,
    'https://media.giphy.com/media/xT9IgyT60kC7r68x2g/giphy.gif',
    'Planche de Surf Mousse 900',
    'https://www.decathlon.fr/p/planche-de-surf-mousse-900-7/_/R-p-309949',
    'https://contents.mediadecathlon.com/p1773666/k$0b8c6275816965582376662993883733/sq/planche-de-surf-mousse-900.jpg'
);