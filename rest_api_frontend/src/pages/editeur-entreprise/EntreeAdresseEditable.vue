<template>
    <div class="boxed">
        <!-- Permet la navigation vers un entreprise individuel (avec son nom) -->
        <router-link :to="'/entreprises/' + entrepriseKey">{{ nom }}</router-link>
        <div>Nom: <input id="nom" v-model="nomEditable" /></div>
        <div>Numero rue: <input id="numrue" v-model="numrueEditable" /></div>
        <div>Rue: <input id="rue" v-model="rueEditable" /></div>
        <div>CP: <input id="cp" v-model="cpEditable" /></div>
        <div>Téléphone: <input id="telephone" v-model="telephoneEditable" /></div>
        <!--  ajout -->
        <MapContainerDraggable :longitude="longitude" :latitude="latitude" :draggable="true"  @update:latitude="updateMarkerLatitude" @update:longitude="updateMarkerLongitude" />
        <button @click="enregistrer">Enregistrer</button>
        <button @click="supprimer">Supprimer</button>
    </div>
</template>

<script>

import MapContainerDraggable from '../../components/MapContainerDraggable.vue';

export default {
    ////ajout
    components: {
        MapContainerDraggable,
    },

    props: {
        entrepriseKey: Number,
        nom: String,
        numrue: String,
        rue: String,
        cp: String,
        telephone: String,
        latitude:Number,
        longitude:Number,
    },
    inject: ['rafraichirEntreprises'],
    data: function () {
        return {
            nomEditable: this.nom,
            numrueEditable: this.numrue,
            rueEditable: this.rue,
            cpEditable: this.cp,
            telephoneEditable: this.telephone,
            latitudeEditable: this.latitude,
            longitudeEditable: this.longitude,
        };
    },
    methods: {
        //maj des coord du marker
        updateMarkerLatitude(newLatitude) {
        this.latitudeEditable = newLatitude; // Mettez à jour la latitude du marqueur
        },
        updateMarkerLongitude(newLongitude) {
        this.longitudeEditable = newLongitude; // Mettez à jour la longitude du marqueur
        },

        supprimer() {
            fetch("/api/entreprises/" + this.entrepriseKey, {
                // Méthode HTTP:
                method: "DELETE"
                // Le DELETE n'a pas de corps de requête, donc pas besoin des autres propriétés

            }).then((response) => {
                // response.ok sera vrai si la requête HTTP a abouti sans erreur (statut entre 200 et 299)
                if (response.ok) {
                    // On peut ainsi prendre l'action en cas de succès ... ici on lance le rafraîchissement
                    // de la liste de entreprises depuis le back-end, en appelant la méthode injectée.
                    this.rafraichirEntreprises();
                    //puis on redirige vers la page d'accueil
                    window.location.href = '/entreprises';
                } else {
                    // Gestion d'erreur ; ici le statut HTTP sera dans la série 4xx (erreur client) ou 5xx (erreur serveur).
                    // On peut donc gérer l'erreur comme on veut.

                    // On vérifie si on a une réponse en format JSON, si oui, elle peut contenir des informations utiles
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes("application/json")) {
                        response.json().then((body) => {
                            // Si le back-end nous retourne un objet JSON valide, la propriété message de l'objet indiquera
                            // un message d'erreur détaillé qu'on peut afficher. Cela est propre au REST API qu'on utilise
                            // dans cet exemple, ce ne sont pas tous les API qui retournent un objet JSON avec un champ message
                            // en cas d'erreur.
                            alert("Erreur: " + body.message);
                        });
                    } else {
                        // Si on n'a pas de corps de réponse en format JSON avec l'erreur, on va simplement relancer une exception
                        // avec le code de statut, celle-ci sera traitée par l'appel à catch(...) chaîné plus loin.
                        throw new Error(`Erreur ${response.status}`);
                    }
                }
            }).catch((error) => {
                // Sera appelé en cas d'erreur de connexion ou d'une erreur lancée depuis le premier .then(...)
                // si le statut HTTP indique un problème
                console.log("Erreur", error);
            });
        },
        async enregistrer() {
            // Cet exemple utilise une fonction async plutôt que les méthodes then(...) et catch(...) des promesses.
            // La logique est très semblable à ce qui est fait dans supprimer() plus haut.

            const entreprise = {
                key: this.entrepriseKey,
                nom: this.nomEditable,
                numrue: this.numrueEditable,
                rue: this.rueEditable,
                cp: this.cpEditable,
                telephone: this.telephoneEditable,
                latitude: this.latitudeEditable,
                longitude: this.longitudeEditable,
            };
            try {
                const response = await fetch("/api/entreprises/" + this.entrepriseKey, {
                    // Méthode HTTP:
                    method: "PUT",
                    // Spécifie que le corps de la requête sera en format JSON:
                    headers: {
                        "Content-Type": "application/json"
                    },
                    // Transforme l'objet entreprise en chaîne de caractères de format JSON:
                    body: JSON.stringify(entreprise)
                });
                

                if (response.ok) {
                    this.rafraichirEntreprises();
                    //puis on redirige vers la page d'accueil
                    window.location.href = '/entreprises';
                } else {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes("application/json")) {
                        // response.json() retourne une promesse, donc on doit utiliser le mot-clé await puisqu'on est
                        // dans une fonction asynchrone:
                        const body = await response.json();
                      //  alert("Erreur: " + body.message);
                    } else {
                        throw new Error(`Erreur ${response.status}`);
                    }
                }
            } catch (error) {
                console.log("Erreur", error);
            }
        }
    }
}
</script>
