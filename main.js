/**
 * Cette fonction s'exécute quand toute la page HTML est chargée
 * (DOM prêt à être manipulé)
 */
document.addEventListener("DOMContentLoaded", () => {

    /* ==============================
       FILTRE DES FORMATIONS
    ============================== */

    // Récupérer tous les boutons de filtre
    const buttons = document.querySelectorAll(".filter-btn");

    // Ajouter un événement clic à chaque bouton
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {

            // Supprimer la classe "active" de tous les boutons
            buttons.forEach(b => b.classList.remove("active"));

            // Ajouter la classe "active" au bouton cliqué
            btn.classList.add("active");

            // Récupérer le domaine sélectionné (data-domain)
            const domaine = btn.dataset.domain;

            // Si "Tous" est sélectionné → afficher toutes les formations
            if (domaine === "all") {
                afficherFormations(window.formationsGlobal);
            } else {
                // Sinon filtrer les formations selon le domaine
                const filtre = window.formationsGlobal.filter(f => f.domaine === domaine);
                afficherFormations(filtre);
            }
        });
    });


    /* ==============================
       GESTION MODAL ENSEIGNANT
    ============================== */

    // Récupérer la modal et le bouton de fermeture
    const modal = document.getElementById("enseignant-modal");
    const closeBtn = document.querySelector(".modal-close");

    // Si le bouton existe → fermer la modal au clic
    if (closeBtn) {
        closeBtn.onclick = () => modal.style.display = "none";
    }

    // Fermer la modal si on clique en dehors
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = "none";
    };


    /* ==============================
       VALIDATION FORMULAIRE CONTACT
    ============================== */

    // Récupérer le formulaire
    const form = document.getElementById("contact-form");

    // Vérifier si on est sur la page contact
    if (form) {

        // Événement lors de la soumission
        form.addEventListener("submit", function(e) {

            e.preventDefault(); // empêcher l'envoi du formulaire

            let valid = true; // variable de validation

            // Récupération des champs
            const nom = document.getElementById("nom");
            const email = document.getElementById("email");
            const sujet = document.getElementById("sujet");
            const message = document.getElementById("message");

            // Vérification du nom
            if (nom.value === "") {
                document.getElementById("nom-error").classList.add("show");
                valid = false;
            }

            // Vérification de l'email (simple)
            if (!email.value.includes("@")) {
                document.getElementById("email-error").classList.add("show");
                valid = false;
            }

            // Vérification du sujet
            if (sujet.value === "") {
                document.getElementById("sujet-error").classList.add("show");
                valid = false;
            }

            // Vérification du message (minimum 10 caractères)
            if (message.value.length < 10) {
                document.getElementById("message-error").classList.add("show");
                valid = false;
            }

            // Si tout est valide
            if (valid) {
                // Afficher message de succès
                document.getElementById("success-message").classList.add("show");

                // Réinitialiser le formulaire
                form.reset();
            }
        });
    }

});