const pool = require('./DBPool');


const getAllSecteurs = async () => {
    const result = await pool.query(
        `SELECT *
         FROM secteur`
    );

    // Transforme le résultat de la requête pour avoir des objets de entreprises
    // tel que spécifié pour le REST API :
    return result.rows.map(row => {
        return {
            key: row.id_secteur,
            nom: row.nom_secteur,
        };
    });
};
exports.getAllSecteurs = getAllSecteurs;

//Renoyer tous les sous-secteurs d'un secteur passé en paramètre
const getSousSecteurByKey = async (secteurKey) => {
    try {

        const result = await pool.query(
            `SELECT *
        FROM sous_secteur
        WHERE ref_secteur = $1`,
            [secteurKey]
        );
        //La méthode map() crée un nouveau tableau avec les résultats 
        //de l'appel d'une fonction anonyme appelée sur chaque élément row du tableau appelant.
        return result.rows.map(row => {
            return {
                key: row.id_sous_secteur,
                nomss: row.nom_sous_secteur
            };
        });
    }
    catch (err) {
        console.error(err);
        return [];
    }

};
/**
 * Renvoie la liste des secteurs et de leurs sous-secteurs
 *  Promise.all permet de profiter de la parallélisation 
 * pour optimiser l'exécution des appels à getSousSecteurByKey.
 *  Cela peut être particulièrement efficace lorsque vous avez un 
 * grand nombre de secteurs et que chaque appel à getSousSecteurByKey peut prendre du temps.
 * @returns 
 */
const getAllSousSecteurs = async () => {
    const secteurs = await getAllSecteurs();

    //comme on fait appel pour chaque secteur à une fonction asynchrone, il faut utiliser Promise.all
    const secteursAvecSousSecteurs = await Promise.all(
        //on commence par parcourir les résultats des secteurs
        secteurs.map(async secteur => {
            //pour chaque secteur, on récupère ses sous secteurs
            const sousSecteurs = await getSousSecteurByKey(secteur.key);

            // Ajoutez le tableau de sous-secteurs au secteur actuel
            secteur.sousSecteurs = sousSecteurs;
            return secteur;
        }));

    return secteursAvecSousSecteurs;
};
/**
 * version2
 * On utilise ici des boucles for, et on attend la fin de l'exécution de getSousSecteurByKey(secteur.key) à chaque tour de boucle
 */
const getAllSousSecteurs1 = async () => {
    const secteurs = await getAllSecteurs();
    const secteursAvecSousSecteurs = [];

    for (const secteur of secteurs) {
        const sousSecteurs = await getSousSecteurByKey(secteur.key);
        // Ajoutez le tableau de sous-secteurs au secteur actuel
        secteur.sousSecteurs = sousSecteurs;
        secteursAvecSousSecteurs.push(secteur);
    }

    return secteursAvecSousSecteurs;
};

/**
 * 
 * @returns Version avec des then plutôt que des await
 */
const getAllSousSecteurs2 = async () => {
    const secteurs = getAllSecteurs()
        .then(secteurs => {
            const sousSecteursPromises = secteurs.map(secteur => {
                return getSousSecteurByKey(secteur.key)
                    .then(sousSecteurs => {
                        secteur.sousSecteurs = sousSecteurs;
                        return secteur;
                    });
            });

            return Promise.all(sousSecteursPromises);
        })
        .catch(error => {
            console.error("The Promise is rejected!", error);
            return [];
        });
    return secteurs;
};
exports.getAllSousSecteurs = getAllSousSecteurs;
