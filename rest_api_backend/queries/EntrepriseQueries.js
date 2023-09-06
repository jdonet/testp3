const pool = require('./DBPool');


const getAllEntreprises = async () => {
    const result = await pool.query(
        `SELECT *
        FROM public.secteur 
        inner JOIN sous_secteur on ref_secteur=id_secteur 
        INNER JOIN entreprise ON ref_sous_secteur = id_sous_secteur;`
    );

    // Transforme le résultat de la requête pour avoir des objets de entreprises
    // tel que spécifié pour le REST API :
    return result.rows.map(row => {
        return {
            key: Number(row.id_entreprise),
            nom: row.nom_entreprise,
            numrue: row.num_rue_entreprise,
            rue: row.rue_entreprise,
            cp:row.code_postal_entreprise,
            telephone: row.telephone_entreprise,
            longitude: row.longitude_entreprise,
            latitude: row.latitude_entreprise,
            secteur:row.id_secteur
        };
    });
};
exports.getAllEntreprises = getAllEntreprises;


const getEntrepriseByKey = async (entrepriseKey) => {
    const result = await pool.query(
        `SELECT *
        FROM entreprise
        INNER JOIN quartier
        ON ref_quartier=id_quartier
        INNER JOIN usage3
        ON ref_usage3 = id_usage3
        INNER JOIN usage2
        ON ref_usage2 = id_usage2
        INNER JOIN usage1
        ON ref_usage1 = id_usage
        INNER JOIN sous_secteur
        ON ref_sous_secteur = id_sous_secteur
        INNER JOIN secteur
        ON ref_secteur = id_secteur
        WHERE id_entreprise = $1`,
        [entrepriseKey]
    );
    const row = result.rows[0];
    if (row) {
        return {
            key: Number(row.id_entreprise),
            nom: row.nom_entreprise,
            numrue: row.num_rue_entreprise,
            rue: row.rue_entreprise,
            cp: row.code_postal_entreprise,
            telephone: row.telephone_entreprise,
            longitude: row.longitude_entreprise,
            latitude: row.latitude_entreprise,
            quartier:{
                key: row.id_quartier,
                nom: row.nom_quartier,
            },
            sousSecteur:{
                key: row.id_sous_secteur,
                nom: row.nom_sous_secteur,
                secteur:{
                    key: row.id_secteur,
                    nom: row.nom_secteur,
                },
            },
            usage3:{
                key: row.id_usage3,
                nom: row.nom_usage3,
                usage2:{
                    key: row.id_usage2,
                    nom: row.nom_usage2,
                    usage:{
                        key: row.id_usage,
                        nom: row.nom_usage,
                    },
                },
            },
        };
    }
    return undefined;
};
exports.getEntrepriseByKey = getEntrepriseByKey;


const insertEntreprise = async (entreprise) => {
    const result = await pool.query(
        `INSERT INTO public.entreprise(
            nom_entreprise, num_rue_entreprise, rue_entreprise, code_postal_entreprise, telephone_entreprise, longitude_entreprise, latitude_entreprise, ref_usage3, ref_sous_secteur, ref_quartier)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id_entreprise`,
        [entreprise.nom, entreprise.numrue, entreprise.rue, entreprise.cp, entreprise.telephone, 0, 0, 1, 1, 1]
    );

    const entrepriseKey = result.rows[0].entreprise_key;

    return getEntrepriseByKey(entrepriseKey);
};
exports.insertEntreprise = insertEntreprise;


const updateEntreprise = async (entreprise) => {
    console.log("ERREUR DE REQ UPDATE")
    const result = await pool.query(
      /*  `UPDATE entreprise
	    SET nom_entreprise=$2, num_rue_entreprise=$3, rue_entreprise=$4, code_postal_entreprise=$5, telephone_entreprise=$6
        WHERE id_entreprise = $1`,*/
        `UPDATE entreprise
	    SET nom_entreprise=$2, num_rue_entreprise=$3, rue_entreprise=$4, code_postal_entreprise=$5, telephone_entreprise=$6, latitude_entreprise=$7, longitude_entreprise=$8
        WHERE id_entreprise = $1`,
        [entreprise.key, entreprise.nom, entreprise.numrue, entreprise.rue, entreprise.cp, entreprise.telephone, entreprise.latitude, entreprise.longitude]
    );

    if (result.rowCount === 0) {
        // Aucune rangée modifiée, veut dire que la clé n'existe pas
        
        return undefined;
    }

    return getEntrepriseByKey(entreprise.key);
};
exports.updateEntreprise = updateEntreprise;


const deleteEntreprise = async (entrepriseKey) => {
    const result = await pool.query(
        `DELETE FROM entreprise WHERE id_entreprise = $1`,
        [entrepriseKey]
    );

    if (result.rowCount === 0) {
        // Aucune rangée modifiée, veut dire que la clé n'existe pas
        return undefined;
    }

    return {};
};
exports.deleteEntreprise = deleteEntreprise;
