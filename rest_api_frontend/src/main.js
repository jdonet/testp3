import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import AjoutEntreprise from './pages/editeur-entreprise/AjoutEntreprise.vue';
import EditeurEntreprise from './pages/editeur-entreprise/EditeurEntreprise.vue';
import EntrepriseIndividuel from './pages/EntrepriseIndividuel.vue';
import ListeEntreprises from './pages/ListeEntreprises.vue';

const app = createApp(App);

// Requis pour l'injection réactive
app.config.unwrapInjectedRef = true;

// Déclaration de Vue Router
const router = createRouter({
    history: createWebHistory(),
    routes: [
        // http://.../editer => éditeur de contacts
        { path: '/ajouter', component: AjoutEntreprise },
        { path: '/entreprises/editer/:entrepriseKey', component: EditeurEntreprise, props: true },
        // http://.../entreprises => liste de entreprises (en lecture seule)
        { path: '/entreprises', component: ListeEntreprises },
        // http://.../entreprises/:nomentreprise => alternative pour le passage d'un paramètre d'URL via les props
        { path: '/entreprises/:entrepriseKey', component: EntrepriseIndividuel, props: true },
        // Redirection vers /entreprises
        { path: '/', redirect: '/entreprises' }
    ]
});

// Ajout de Vue Router à l'application
app.use(router);

app.mount('#app');
