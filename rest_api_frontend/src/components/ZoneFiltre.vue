<template>
    <form>
        <p>Filtrer les entreprises</p>
        <div>
            <label for="id">Secteur:</label>
            <select v-on:change="actualiser" v-model="secteur">
                <option value="all">Tous
                </option>
                <option v-for="secteur in secteurs" :key="secteur.key" :value="secteur.key" v-on:change="console.log(this)">
                    {{ secteur.nom }}
                </option>
            </select>
            <h3>{{ nbEntreprises }} entreprises trouvées pour ces sélections</h3>
        </div>
    </form>
</template>

<script>

export default {
    inject: ['secteurs','selectedSecteur','updateSelectedSecteur','nbEntreprises'],
    methods:{
        actualiser(){
            this.updateSelectedSecteur(this.secteur)
        }
    },
    data(){
        return {
            secteur:"all"
        }
    }
        
   
}
</script>
