<template>
    <ZoneFiltre />
    <EntreeAdresse v-for="entreprise in entreprises" :key=entreprise.key :entrepriseKey=entreprise.key :nom="entreprise.nom"
        :numrue="entreprise.numrue" :rue="entreprise.rue" :cp="entreprise.cp" :telephone="entreprise.telephone"/>
</template>

<script>
import EntreeAdresse from '../components/EntreeAdresse.vue';
import ZoneFiltre from '../components/ZoneFiltre.vue';

export default {
    components: {
    EntreeAdresse: EntreeAdresse,
    ZoneFiltre,
},
    inject: ['entreprises']
}
</script>
