<template>
    <!-- .prevent empêche la soumission du formulaire (pour éviter de recharger la page) -->
    <form class="boxed" @submit.prevent="ajouter">
        <p>Entrer une nouvelle adresse</p>
        <div>
            <label for="id">Nom:</label>
            <input id="nom" v-model="nom" placeholder="Joe Blau" />
        </div>
        <div>
            <label for="numrue">Numero rue:</label>
            <input id="numrue" v-model="numrue" placeholder="123" />
        </div>
        <div>
            <label for="rue">Rue:</label>
            <input id="rue" v-model="rue" placeholder="rue Principale" />
        </div>
        <div>
            <label for="cp">CP:</label>
            <input id="cp" v-model="cp" placeholder="J0T0B3" />
        </div>
        <div>
            <label for="telephone">Telephone:</label>
            <input id="telephone" v-model="telephone" placeholder="555-555-1212" />
        </div>
        <button>Ajouter</button>
    </form>
</template>

<script>
export default {
    inject: ['rafraichirEntreprises'],
    data: function () {
        return {
            nom: '',
            numrue: '',
            rue: '',
            cp: '',
            telephone: '',
        }
    },
    methods: {
        ajouter() {
            const entreprise = {
                nom: this.nom,
                numrue: this.numrue,
                rue: this.rue,
                cp: this.cp,
                telephone: this.telephone,
            };

            if (!entreprise.nom || entreprise.nom === '') {
                console.error("nom manquant", entreprise);
                return;
            }

            fetch("/api/entreprises", {
                // Méthode HTTP:
                method: "POST",
                // Spécifie que le corps de la requête sera en format JSON:
                headers: {
                    "Content-Type": "application/json"
                },
                // Transforme l'objet entreprise en chaîne de caractères de format JSON:
                body: JSON.stringify(entreprise)
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
        }
    }
}
</script>
