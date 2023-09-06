const express = require('express');
const router = express.Router();

const entrepriseQueries = require("../queries/EntrepriseQueries");


router.get('/', (req, res, next) => {
    entrepriseQueries.getAllEntreprises().then(entreprises => {
        res.json(entreprises);
    }).catch(err => {
        return next(err);
    });
});

router.get('/:key', (req, res, next) => {
    const key = req.params.key;

    entrepriseQueries.getEntrepriseByKey(key).then(entreprise => {
        if (entreprise) {
            res.json(entreprise);
        } else {
            return next({ status: 404, message: `Entreprise ${key} introuvable` });
        }
    }).catch(err => {
        return next(err);
    });
});

router.post('/', (req, res, next) => {
    const nom = req.body.nom;
    if (!nom || nom === '') {
        return next({ status: 400, message: 'Le champ nom est requis' });
    }

    const newEntreprise = {
        nom: "" + nom,
        numrue: "" + req.body.numrue,
        rue: "" + req.body.rue,
        cp: "" + req.body.cp,
        telephone: "" + req.body.telephone,
        longitude: "" + req.body.longitude,
        latitude: "" + req.body.latitude
    };
    
    entrepriseQueries.insertEntreprise(newEntreprise).then(entreprise => {
        res.json(entreprise);
    }).catch(err => {
        return next(err);
    });
});

router.put('/:key', (req, res, next) => {
    const key = +req.params.key;
    if (!key || key === '') {
        return next({ status: 400, message: 'Le paramètre key est requis' });
    }

    if (key !== req.body.key) {
        return next({ status: 400, message: `Le paramètre spécifie le key ${key} alors que l'entreprise fournie a le key ${req.body.key}` });
    }

    const entreprise = {
        key: key,
        nom: "" + req.body.nom,
        numrue: "" + req.body.numrue,
        rue: "" + req.body.rue,
        cp: "" + req.body.cp,
        telephone: "" + req.body.telephone,
        latitude: "" + req.body.latitude,
        longitude: "" + req.body.longitude
    };

    entrepriseQueries.updateEntreprise(entreprise).then(entreprise => {
        res.json(entreprise);
    }).catch(err => {
        return next(err);
    });
});

router.delete('/:key', (req, res, next) => {
    const key = req.params.key;
    if (!key || key === '') {
        return next({ status: 400, message: 'Le paramètre key est requis' });
    }

    entrepriseQueries.deleteEntreprise(key).then(result => {
        if (!result) {
            return next({ status: 404, message: `Entreprise ${key} introuvable` });
        }
        res.json({});
    })
});

module.exports = router;
