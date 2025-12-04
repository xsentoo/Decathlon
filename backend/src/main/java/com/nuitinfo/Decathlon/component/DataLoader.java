package com.nuitinfo.Decathlon.component;

import com.nuitinfo.Decathlon.model.Exercise;
import com.nuitinfo.Decathlon.model.User;
import com.nuitinfo.Decathlon.repository.ExerciseRepository;
import com.nuitinfo.Decathlon.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;

    public DataLoader(ExerciseRepository exerciseRepository, UserRepository userRepository) {
        this.exerciseRepository = exerciseRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. CHARGEMENT DES EXERCICES INTELLIGENTS
        if (exerciseRepository.count() == 0) {
            System.out.println("🌱 Chargement du catalogue Decathlon...");

            // EXO 1 : YOGA (Cible le Dos)
            Exercise yoga = new Exercise();
            yoga.setTitle("Posture de l'Enfant");
            yoga.setInstructions("Mettez-vous à genoux, fesses sur les talons, et étendez les bras loin devant. Respirez profondément pendant 30 secondes.");
            yoga.setTargetSport("Yoga");
            yoga.setTargetPainArea("Dos"); // 👈 CIBLE LE DOS
            yoga.setDifficulty("Debutant");
            yoga.setPointsReward(50);
            yoga.setGifUrl("https://media.giphy.com/media/3o7qDYXe0QuLCme1Fu/giphy.gif");
            yoga.setProductName("Tapis de Yoga Confort 8mm");
            yoga.setProductUrl("https://www.decathlon.fr/p/tapis-de-yoga-confort-8-mm/_/R-p-324419");
            yoga.setProductImage("https://contents.mediadecathlon.com/p1858972/k$f1270273760430005273752760604300/sq/tapis-de-yoga-confort-8-mm.jpg");
            exerciseRepository.save(yoga);

            // EXO 2 : RUNNING (Cible les Genoux)
            Exercise run = new Exercise();
            run.setTitle("Fentes Dynamiques");
            run.setInstructions("Un grand pas en avant, fléchissez le genou à 90 degrés. Gardez le dos droit.");
            run.setTargetSport("Running");
            run.setTargetPainArea("Genoux"); // 👈 CIBLE LES GENOUX
            run.setDifficulty("Intermediaire");
            run.setPointsReward(100);
            run.setGifUrl("https://media.giphy.com/media/l3vRb68BwbZq73h28/giphy.gif");
            run.setProductName("Genouillère de Maintien");
            run.setProductUrl("https://www.decathlon.fr/p/genouillere-de-maintien-prevent-500/_/R-p-169460");
            run.setProductImage("https://contents.mediadecathlon.com/p1999905/k$d6d84715875225375382346617056636/sq/genouillere-de-maintien-prevent-500.jpg");
            exerciseRepository.save(run);

            // EXO 3 : SURF (Cible le Dos aussi)
            Exercise surf = new Exercise();
            surf.setTitle("Le Pop-Up (Redressement)");
            surf.setInstructions("Poussez fort sur les bras et ramenez les jambes sous le corps.");
            surf.setTargetSport("Surf");
            surf.setTargetPainArea("Dos"); // 👈 CIBLE AUSSI LE DOS
            surf.setDifficulty("Expert");
            surf.setPointsReward(200);
            surf.setGifUrl("https://media.giphy.com/media/xT9IgyT60kC7r68x2g/giphy.gif");
            surf.setProductName("Planche de Surf Mousse");
            surf.setProductUrl("https://www.decathlon.fr/p/planche-de-surf-mousse-900-7/_/R-p-309949");
            surf.setProductImage("https://contents.mediadecathlon.com/p1773666/k$0b8c6275816965582376662993883733/sq/planche-de-surf-mousse-900.jpg");
            exerciseRepository.save(surf);
        }

        // 2. CRÉATION DES ROBOTS
        if (userRepository.count() == 0) {
            System.out.println("🤖 Création des concurrents virtuels...");
            createBot("CyberRunner", "bot1@decathlon.com", 1250, "Intermediaire", "Sportif Confirmé");
            createBot("YogaMaster", "bot2@decathlon.com", 2500, "Expert", "Master Athlete");
            createBot("NewbieJoe", "bot3@decathlon.com", 50, "Debutant", "Novice");
            createBot("IronMan", "bot4@decathlon.com", 800, "Intermediaire", "Sportif Confirmé");
            createBot("SurferPro", "bot5@decathlon.com", 3000, "Expert", "Master Athlete");
        }

        System.out.println("✅ Données chargées !");
    }

    private void createBot(String pseudo, String email, int points, String level, String badge) {
        User u = new User();
        u.setPseudo(pseudo);
        u.setEmail(email);
        u.setPassword("$2a$10$FakeHashForDemoOnly.......................");
        u.setPoint(points);
        u.setLevel(level);
        u.setBadge(badge);
        u.setSportFocus("Running");
        u.setPainArea("Aucune");
        userRepository.save(u);
    }
}