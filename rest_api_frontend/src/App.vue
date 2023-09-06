<template>
    <div>
        <MenuNavigation />
        
        <!-- Le composant router-view fera l'affichage du bon composant selon le chemin d'URL,
            en fonction des routes qui ont été définies dans la déclaration du routeur dans main.js -->
        <router-view></router-view>
    </div>
</template>

<script>
import { computed } from 'vue';
import MenuNavigation from './components/MenuNavigation.vue';

export default {
    components: {
        MenuNavigation,
    },
    data() {
        return {
            entreprises: [],
            secteurs:[],
            selectedSecteur:'all',
            nbEntreprises:0,
            entrepriseAEditer:4
        };
    },
    watch: {
        // observation des propriétés de haut niveau
        selectedSecteur(val, oldVal) {
            this.rafraichirEntreprises();
           // console.log(`new secteur: ${val}, old secteur: ${oldVal}`)
        },
    },
    methods: {
        rafraichirEntreprises() {
            // Récupère toutes les entreprises:
            fetch("/api/entreprises")
                .then((response) => {
                    if (response.ok) {
                        // response.json() retourne une promesse, on pourra
                        // la traiter dans le prochain then(...)
                        return response.json();
                    } else {
                        // On sera ici si la réponse contient un statut d'erreur (entre 400 et 599)
                        throw new Error("Erreur HTTP " + response.status);
                    }
                })
                .then((respEntreprises) => {
                    // En cas de succès, respEntreprises contiendra l'objet construit depuis le contenu JSON
                    // dans la réponse. On met alors à jour les données du composant.

                    // La création d'un tableau nouvEntreprises ainsi que la boucle qui y ajoute les entreprises
                    // élément par élément en créant des nouveaux objets est facultative, car
                    // l'objet JSON retourné par le REST API a déjà la même structure (un tableau avec des
                    // objets qui ont trois champs: nom, adresse et telephone). Néanmoins, il peut être utile
                    // de traiter ainsi l'objet de la réponse de l'API pour valider que le contenu est tel
                    // qu'attendu, et loguer une erreur s'il y a quelque chose qui cloche.

                    // Vous pouvez choisir d'opter pour cette approche ou non selon le degré de tolérance
                    // aux erreurs pour votre site web ... si vous ne contrôlez pas le back-end, faire un tel
                    // traitement et validation des objets de réponse pourrait vous sauver bien des maux de tête!
                    const nouvEntreprises = [];
                    
                    respEntreprises.forEach((respEntreprise) => {
                        if (this.selectedSecteur=="all" || this.selectedSecteur==respEntreprise.secteur){
                            
                        
                        const nouvEntreprise = {
                            key: respEntreprise.key,
                            nom: respEntreprise.nom,
                            numrue: respEntreprise.numrue,
                            rue: respEntreprise.rue,
                            cp: respEntreprise.cp,
                            telephone: respEntreprise.telephone,
                            secteur: respEntreprise.secteur
                        };
                        nouvEntreprises.push(nouvEntreprise);
                        }
                    });

                    this.entreprises = nouvEntreprises;
                    this.nbEntreprises= nouvEntreprises.length;
                
                }).catch((error) => {
                    // Sera appelé en cas d'erreur de connexion ou d'une erreur lancée depuis le premier .then(...)
                    // si le statut HTTP indique un problème
                    console.error("Erreur", error);
                });
        },
        rafraichirSecteurs() {
            // Récupère tous les secteurs:
            fetch("/api/secteurs")
                .then((response) => {
                    if (response.ok) {
                        // response.json() retourne une promesse, on pourra
                        // la traiter dans le prochain then(...)
                        return response.json();
                    } else {
                        // On sera ici si la réponse contient un statut d'erreur (entre 400 et 599)
                        throw new Error("Erreur HTTP " + response.status);
                    }
                })
                .then((respSecteurs) => {
                    // En cas de succès, respEntreprises contiendra l'objet construit depuis le contenu JSON
                    // dans la réponse. On met alors à jour les données du composant.

                    // La création d'un tableau nouvEntreprises ainsi que la boucle qui y ajoute les entreprises
                    // élément par élément en créant des nouveaux objets est facultative, car
                    // l'objet JSON retourné par le REST API a déjà la même structure (un tableau avec des
                    // objets qui ont trois champs: nom, adresse et telephone). Néanmoins, il peut être utile
                    // de traiter ainsi l'objet de la réponse de l'API pour valider que le contenu est tel
                    // qu'attendu, et loguer une erreur s'il y a quelque chose qui cloche.

                    // Vous pouvez choisir d'opter pour cette approche ou non selon le degré de tolérance
                    // aux erreurs pour votre site web ... si vous ne contrôlez pas le back-end, faire un tel
                    // traitement et validation des objets de réponse pourrait vous sauver bien des maux de tête!
                    const nouvSecteurs = [];
                    respSecteurs.forEach((respSecteurs) => {
                        const nouvSecteur = {
                            key: respSecteurs.key,
                            nom: respSecteurs.nom,
                            
                        };
                        nouvSecteurs.push(nouvSecteur);
                    });

                    this.secteurs = nouvSecteurs;
                }).catch((error) => {
                    // Sera appelé en cas d'erreur de connexion ou d'une erreur lancée depuis le premier .then(...)
                    // si le statut HTTP indique un problème
                    console.error("Erreur", error);
                });
        },
        updateSelectedSecteur(nouveauSecteur) {
         this.selectedSecteur = nouveauSecteur   
         this.rafraichirEntreprises()
        }
    },
    provide() {
        return {
            // L'appel de computed(...) est requis pour rendre l'injection réactive,
            // aussi il faut ajouter le paramètre "app.config.unwrapInjectedRef = true"
            // à l'app (voir main.js) pour que ça fonctionne dans Vue 3.2.
            // Voir documentation : https://vuejs.org/guide/components/provide-inject.html#working-with-reactivity
            entreprises: computed(() => this.entreprises),
            secteurs: computed(() => this.secteurs),
            selectedSecteur: computed(() => this.selectedSecteur) ,
            nbEntreprises: computed(() => this.nbEntreprises) ,
            entrepriseAEditer: computed(() => this.entrepriseAEditer) ,
            updateSelectedSecteur: this.updateSelectedSecteur ,
            
            rafraichirEntreprises: this.rafraichirEntreprises
        };
    },
    mounted() {
        this.rafraichirSecteurs();
        this.rafraichirEntreprises();
        
    }
}
</script>
