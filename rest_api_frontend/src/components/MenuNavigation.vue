<template>
    <header>
        <nav>
            <div>
                Navigation: 
                <!-- Permet de naviguer à une page gérée par le routeur sans recharger toute la page: -->
                <span><router-link to="/ajouter">Ajout d'une entreprise</router-link></span>
                &nbsp;|&nbsp;
                <span><router-link to="/entreprises">Liste d'entreprises (lecture seule)</router-link></span>
            </div>
        </nav>
    </header>
</template>

<script>
export default {

}
</script>
