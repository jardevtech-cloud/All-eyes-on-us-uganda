(function () {
    const currentPage = (
        window.location.pathname.split("/").pop() || "index.html"
    ).toLowerCase();

    const links = [
        ["index.html", "Home"],
        ["people.html", "About Us"],
        ["program.html", "Our Programs"],
        ["impact.html", "Our Impact"],
        ["gallery.html", "Gallery"],
        ["partners.html", "Partner With Us"],
        ["donation.html", "Donate"],
        ["contact.html", "Contact"]
    ];

    const navigation = links.map(function (item) {
        const page = item[0];
        const label = item[1];

        const active = currentPage === page ? "active" : "";
        const donate = page === "donation.html" ? "donate-link" : "";

        return `
            <a href="${page}" class="${active} ${donate}">
                ${label}
            </a>
        `;
    }).join("");

    const header = `
        <header class="site-header">
            <div class="site-nav-wrap">

                <a href="index.html" class="site-brand">
                    <img
                        src="assets/logo.png"
                        alt="All Eyes on Us Uganda Logo"
                    >

                    <span>
                        <strong>ALL EYES ON US</strong>
                        <b>UGANDA</b>
                        <small>Turning Talent Into Opportunity</small>
                    </span>
                </a>

                <button
                    class="site-menu-toggle"
                    id="siteMenuToggle"
                    aria-label="Open navigation"
                    aria-expanded="false"
                >
                    ☰
                </button>

                <nav class="site-main-nav" id="siteMainNav">
                    ${navigation}
                </nav>

            </div>
        </header>
    `;

    function installHeader() {
        const placeholder = document.getElementById("site-header");

        if (placeholder) {
            placeholder.innerHTML = header;
        }

        const toggle = document.getElementById("siteMenuToggle");
        const nav = document.getElementById("siteMainNav");

        if (!toggle || !nav) return;

        toggle.addEventListener("click", function () {
            const opened = nav.classList.toggle("open");

            toggle.textContent = opened ? "×" : "☰";
            toggle.setAttribute("aria-expanded", String(opened));
        });

        nav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                nav.classList.remove("open");
                toggle.textContent = "☰";
                toggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", installHeader);
    } else {
        installHeader();
    }
})();