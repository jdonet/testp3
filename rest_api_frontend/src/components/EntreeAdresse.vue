<template>
    <div class="boxed">
        <!-- Permet la navigation vers un contact individuel (avec son nom) -->
        <div>Nom: <router-link :to="'/entreprises/' + entrepriseKey">{{ nom }}</router-link></div>
        <div><router-link :to="'/entreprises/editer/' + entrepriseKey">Editer</router-link></div>
        <div>Adresse: <a v-bind:href="'https://www.google.ca/maps/place/' + numrue+' '+ rue+' '+ cp"  target="_blank">{{ numrue }} {{ rue }} {{ cp }}</a></div>
        <div>Téléphone: {{ telephone }}</div>
    </div>
</template>

<script>

export default {
    props: {
        entrepriseKey: Number,
        nom: String,
        numrue: String,
        rue: String,
        cp: String,
        telephone: String,
    }
}
</script>
