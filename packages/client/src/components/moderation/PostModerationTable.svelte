<script lang="ts">
    import * as messages from "$lib/paraglide/messages";

</script>

<table>
    <thead>
        <tr>
            <th scope="col">Post ID</th>
            <th scope="col">Post text content</th>
            <th scope="col">Post photo content</th>
            <th scope="col">Post author</th>
            <th scope="col">Post reporter</th>
            <th scope="col">Report Reason</th>
            <th scope="col">Report comment</th>
            <th scope="col">Actions</th>
        </tr>
    </thead>

    <tbody>
        <tr>
            <th scope="row">1562358</th>
            <td>Coucou coucou</td>
            <td></td>
            <td>Jean Neymar</td>
            <td>Jean Bon</td>
            <td>Spam</td>
            <td>On dit pas coucou deux fois !</td>
            <td>To do</td>
        </tr>

        <tr>
            <th scope="row">1562359</th>
            <td>Bonjour tout le monde</td>
            <td></td>
            <td>Marie Dupont</td>
            <td>Lucas Martin</td>
            <td>Harcèlement</td>
            <td>Message déplacé</td>
            <td>To do</td>
        </tr>

        <tr>
            <th scope="row">1562360</th>
            <td>Regardez mon chien</td>
            <td>photo.jpg</td>
            <td>Paul Bernard</td>
            <td>Sophie Leroy</td>
            <td>Contenu inapproprié</td>
            <td>Photo choquante</td>
            <td>To do</td>
        </tr>

        <tr>
            <th scope="row">1562361</th>
            <td>Promo incroyable</td>
            <td></td>
            <td>Kevin Roux</td>
            <td>Emma Petit</td>
            <td>Spam</td>
            <td>Publicité répétée</td>
            <td>To do</td>
        </tr>

        <tr>
            <th scope="row">1562362</th>
            <td>Qui est là ce soir ?</td>
            <td></td>
            <td>Laura Moreau</td>
            <td>Nicolas Durand</td>
            <td>Autre</td>
            <td>Hors sujet</td>
            <td>To do</td>
        </tr>

        <tr>
            <th scope="row">1562363</th>
            <td>😂😂😂</td>
            <td></td>
            <td>Thomas Garcia</td>
            <td>Julie Faure</td>
            <td>Spam</td>
            <td>Message sans contenu</td>
            <td>To do</td>
        </tr>

        <tr>
            <th scope="row">1562364</th>
            <td>Mon avis sur ce sujet</td>
            <td></td>
            <td>Antoine Blanc</td>
            <td>Camille Henry</td>
            <td>Discours haineux</td>
            <td>Propos offensants</td>
            <td>To do</td>
        </tr>

        <tr>
            <th scope="row">1562365</th>
            <td>Cliquez ici</td>
            <td>link.png</td>
            <td>Julien Perez</td>
            <td>Manon Lopez</td>
            <td>Spam</td>
            <td>Lien suspect</td>
            <td>To do</td>
        </tr>

        <tr>
            <th scope="row">1562366</th>
            <td>Nouvelle photo de vacances</td>
            <td>vacances.jpg</td>
            <td>Chloé Simon</td>
            <td>Alexandre Dubois</td>
            <td>Contenu inapproprié</td>
            <td>Image non conforme</td>
            <td>To do</td>
        </tr>

        <tr>
            <th scope="row">1562367</th>
            <td>Vous êtes nuls</td>
            <td></td>
            <td>Maxime Girard</td>
            <td>Sarah Noel</td>
            <td>Harcèlement</td>
            <td>Insulte directe</td>
            <td>To do</td>
        </tr>

        <tr>
            <th scope="row">1562368</th>
            <td>Bonne journée à tous</td>
            <td></td>
            <td>Olivier Meunier</td>
            <td>Claire Roche</td>
            <td>Autre</td>
            <td>Signalement abusif</td>
            <td>To do</td>
        </tr>
    </tbody>
</table>

<style lang="scss">
    table {
        border-collapse: collapse;
        font-size: 0.8rem;
    }

    th, td {
        border: 1px solid var(--main-highlight-color);
        padding: 0.3rem;
    }

    tbody > tr:nth-of-type(even) {
        background-color: color-mix(in srgb, var(--second-highlight-color) 20%, transparent);
    }
</style>