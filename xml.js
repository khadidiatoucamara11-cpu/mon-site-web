/* =========================================
   FICHIER : xml.js
   Rôle : Charger les fichiers XML et afficher les données
   ========================================= */


/**
 * Fonction qui charge un fichier XML
 * Utilise XMLHttpRequest et retourne une Promise
 */
function chargerXML(url) {
    return new Promise((resolve, reject) => {

        // Création de la requête HTTP
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);

        // Si la requête réussit
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.responseXML); // On retourne le XML
            } else {
                reject("Erreur chargement XML");
            }
        };

        // Si erreur réseau
        xhr.onerror = () => reject("Erreur réseau");

        // Envoi de la requête
        xhr.send();
    });
}


/**
 * Fonction qui extrait les formations depuis le XML
 * Convertit le XML en tableau d’objets JavaScript
 */
function extraireFormations(xml) {

    const liste = []; // tableau final
    const formations = xml.getElementsByTagName("formation");

    // Parcours de chaque formation
    for (let i = 0; i < formations.length; i++) {

        const f = formations[i];

        // Création d’un objet JS pour chaque formation
        liste.push({
            id: f.getAttribute("id"),
            intitule: f.getElementsByTagName("intitule")[0].textContent,
            domaine: f.getElementsByTagName("domaine")[0].textContent,
            niveau: f.getElementsByTagName("niveau")[0].textContent,
            duree: f.getElementsByTagName("duree")[0].textContent,
            description: f.getElementsByTagName("description")[0].textContent,
            debouches: f.getElementsByTagName("debouches")[0].textContent
        });
    }

    return liste; // on retourne le tableau
}


/**
 * Fonction qui affiche les formations dans le HTML
 */
function afficherFormations(liste) {

    const container = document.getElementById("formations-container");

    // Si on n'est pas sur la page formations → on stop
    if (!container) return;

    container.innerHTML = ""; // vider le contenu

    // Parcours de la liste
    liste.forEach(f => {

        // Création d'une carte
        const card = document.createElement("div");
        card.className = "formation-card";

        // Contenu HTML de la carte
        card.innerHTML = `
            <h3 class="formation-title">${f.intitule}</h3>

            <div class="formation-meta">
                <span class="formation-domain">${f.domaine}</span>
                <span class="formation-level">${f.niveau}</span>
            </div>

            <p><strong>Durée :</strong> ${f.duree}</p>
            <p>${f.description}</p>
            <p><strong>Débouchés :</strong> ${f.debouches}</p>
        `;

        // Ajout dans la page
        container.appendChild(card);
    });
}


/**
 * Fonction qui extrait les enseignants depuis le XML
 */
function extraireEnseignants(xml) {

    const liste = [];
    const enseignants = xml.getElementsByTagName("enseignant");

    // Parcours des enseignants
    for (let i = 0; i < enseignants.length; i++) {

        const e = enseignants[i];

        liste.push({
            id: e.getAttribute("id"),
            nom: e.getElementsByTagName("nom")[0].textContent,
            prenom: e.getElementsByTagName("prenom")[0].textContent,
            grade: e.getElementsByTagName("grade")[0].textContent,
            specialite: e.getElementsByTagName("specialite")[0].textContent,
            email: e.getElementsByTagName("email")[0].textContent,
            photo: e.getElementsByTagName("photo")[0].textContent,
            formation_id: e.getElementsByTagName("formation_id")[0].textContent
        });
    }

    return liste;
}


/**
 * Fonction qui affiche les enseignants sous forme de cartes
 */
function afficherEnseignants(liste) {

    const container = document.getElementById("enseignants-container");

    // Si on n'est pas sur la page enseignants → stop
    if (!container) return;

    container.innerHTML = "";

    liste.forEach(e => {

        const card = document.createElement("div");
        card.className = "enseignant-card card";

        card.innerHTML = `
            <img src="${e.photo}" class="enseignant-photo" alt="photo">
            <h3 class="enseignant-name">${e.prenom} ${e.nom}</h3>
            <p class="enseignant-grade">${e.grade}</p>
            <p class="enseignant-specialite">${e.specialite}</p>
        `;

        // Ajouter un clic pour afficher les détails
        card.addEventListener("click", () => {
            afficherFicheEnseignant(e.id);
        });

        container.appendChild(card);
    });
}


/**
 * Fonction qui affiche la fiche détaillée d’un enseignant
 * Utilise une modal
 */
function afficherFicheEnseignant(id) {

    // Recherche de l'enseignant
    const enseignant = window.enseignantsGlobal.find(e => e.id === id);

    const modal = document.getElementById("enseignant-modal");
    const body = document.getElementById("modal-body");

    // Injection du contenu dans la modal
    body.innerHTML = `
        <h3>${enseignant.prenom} ${enseignant.nom}</h3>
        <p><strong>Grade :</strong> ${enseignant.grade}</p>
        <p><strong>Spécialité :</strong> ${enseignant.specialite}</p>
        <p><strong>Email :</strong> ${enseignant.email}</p>
    `;

    // Affichage de la modal
    modal.style.display = "flex";
}


/**
 * Chargement automatique au démarrage du site
 */
document.addEventListener("DOMContentLoaded", () => {

    // Chargement des formations
    chargerXML("xml/formations.xml")
        .then(xml => {
            const data = extraireFormations(xml);
            window.formationsGlobal = data; // stock global
            afficherFormations(data);
        })
        .catch(err => console.error(err));

    // Chargement des enseignants
    chargerXML("xml/enseignants.xml")
        .then(xml => {
            const data = extraireEnseignants(xml);
            window.enseignantsGlobal = data;
            afficherEnseignants(data);
        })
        .catch(err => console.error(err));

});