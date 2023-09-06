<template>
    <div class="boxed">
        <h2>Mes entreprises</h2>
        <EntreeAdresseEditable :key="key" :entrepriseKey="key" :nom="nom"
            :numrue="numrue" :rue="rue" :cp="cp" :telephone="telephone" :latitude="latitude" :longitude="longitude"/>
    </div>
</template>

<script>
import EntreeAdresseEditable from './EntreeAdresseEditable.vue';

export default {
    components: {
        EntreeAdresseEditable,
    },
    inject: ['entrepriseAEditer'],
    props: {
        // La prop "entrepriseKey" est passée par le routeur
        entrepriseKey: Number
    },
    data() {
        return {
            entrepriseExiste: false,
            key: '',
            nom: '',
            numrue: '',
            rue: '',
            cp: '',
            telephone: '',
            longitude : '',
            latitude : '',
                };
    },
    methods: {
        chargerEntreprise(entrepriseKey) {
            // Charge un entreprise individuel selon son nom:
            fetch("/api/entreprises/" + entrepriseKey)
                .then((response) => {
                    //console.log(response)

                    if (response.ok) {
                        // response.json() retourne une promesse, on pourra
                        // la traiter dans le prochain then(...)
                        return response.json();
                    } else {
                        // On sera ici si la réponse contient un statut d'erreur (entre 400 et 599)
                        // Le cas 404 veut dire introuvable, on le gère avec un message particulier
                        if (response.status === 404) {
                            throw new Error("Entreprise introuvable");
                        }

                        // Pour tous les autres codes de statut:
                        throw new Error("Erreur HTTP " + response.status);
                    }
                })
                .then((respEntreprise) => {
                   // console.log(respEntreprise)
                    // En cas de succès, respEntreprise contiendra l'objet construit depuis le contenu JSON
                    // dans la réponse. On met alors à jour les données du composant.
                    this.key = respEntreprise.key;
                    this.nom = respEntreprise.nom;
                    this.numrue = respEntreprise.numrue;
                    this.rue = respEntreprise.rue;
                    this.cp = respEntreprise.cp;
                    this.telephone = respEntreprise.telephone;
                    this.longitude = respEntreprise.longitude;
                    this.latitude = respEntreprise.latitude;
                    this.entrepriseExiste = true;
                }).catch((error) => {
                    // Sera appelé en cas d'erreur de connexion ou d'une erreur lancée depuis le premier .then(...)
                    // si le statut HTTP indique un problème
                    console.log("Erreur", error);
                    this.entrepriseExiste = false;
                });
        }
    },
    mounted() {
        this.chargerEntreprise(this.entrepriseKey);
    },
    watch: {
        entrepriseKey(nouvEntrepriseKey) {
            this.chargerEntreprise(nouvEntrepriseKey);
        }
    }
}
</script>
