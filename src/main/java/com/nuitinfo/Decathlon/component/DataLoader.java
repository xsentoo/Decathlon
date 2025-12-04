package com.nuitinfo.Decathlon.component;

import com.nuitinfo.Decathlon.model.Exercise;
import com.nuitinfo.Decathlon.repository.ExerciseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final ExerciseRepository exerciseRepository;

    public DataLoader(ExerciseRepository exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // On vérifie si la base est vide pour ne pas créer de doublons
        if (exerciseRepository.count() == 0) {
            System.out.println("🌱 Base vide : Chargement des exercices Decathlon...");

            // EXO 1 : YOGA
            Exercise yoga = new Exercise();
            yoga.setTitle("Posture de l'Enfant");
            yoga.setInstructions("Mettez-vous à genoux, fesses sur les talons, et étendez les bras loin devant.");
            yoga.setTargetSport("Yoga");
            yoga.setDifficulty("Debutant");
            yoga.setPointsReward(50);
            yoga.setGifUrl("https://media.giphy.com/media/3o7qDYXe0QuLCme1Fu/giphy.gif");
            // Bonus Business Decathlon
            yoga.setProductName("Tapis de Yoga Confort 8mm");
            yoga.setProductUrl("https://www.decathlon.fr/p/tapis-de-yoga-confort-8-mm/_/R-p-324419");
            yoga.setProductImage("https://contents.mediadecathlon.com/p1858972/k$f1270273760430005273752760604300/sq/tapis-de-yoga-confort-8-mm.jpg");
            exerciseRepository.save(yoga);

            // EXO 2 : RUNNING
            Exercise run = new Exercise();
            run.setTitle("Fentes Dynamiques");
            run.setInstructions("Un grand pas en avant, fléchissez le genou à 90 degrés. Gardez le dos droit.");
            run.setTargetSport("Running");
            run.setDifficulty("Intermediaire");
            run.setPointsReward(100);
            run.setGifUrl("https://media.giphy.com/media/l3vRb68BwbZq73h28/giphy.gif");
            // Bonus Business Decathlon
            run.setProductName("Genouillère de Maintien");
            run.setProductUrl("https://www.decathlon.fr/p/genouillere-de-maintien-prevent-500/_/R-p-169460");
            run.setProductImage("https://contents.mediadecathlon.com/p1999905/k$d6d84715875225375382346617056636/sq/genouillere-de-maintien-prevent-500.jpg");
            exerciseRepository.save(run);

            System.out.println("✅ Données Decathlon chargées avec succès !");
        }
    }
}