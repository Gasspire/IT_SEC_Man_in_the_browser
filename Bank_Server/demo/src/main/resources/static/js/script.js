document.addEventListener("DOMContentLoaded", function () {
    const observer = new MutationObserver((mutations) => {
        alert("Osservate modifiche al DOM");
    });

    const target = document.body;
    if (target) {
        observer.observe(target, { childList: true, subtree: true });
    } else {
        console.warn("document.body non disponibile!");
    }
});
