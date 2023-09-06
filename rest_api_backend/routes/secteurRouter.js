const express = require('express');
const router = express.Router();

const secteursQueries = require("../queries/SecteurQueries");


router.get('/', (req, res, next) => {
    secteursQueries.getAllSecteurs().then(secteurs => {
        res.json(secteurs);
    }).catch(err => {
        return next(err);
    });
});

//route bonus sous secteurs
router.get('/sousSecteurs', (req, res, next) => {
    secteursQueries.getAllSousSecteurs().then(secteurs => {
        res.json(secteurs);
    }).catch(err => {
        return next(err);
    });
});

module.exports = router;
