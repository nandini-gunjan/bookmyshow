/* =========================================
   BOOKITBRO RIGHT SIDEBAR
========================================= */

(function () {

    const SIDEBAR_HTML =
        "components/sidebar.html";

    const SIDEBAR_CSS =
        "css/sidebar.css";


    /* =========================================
       LOAD CSS
    ========================================= */

    function loadSidebarCSS() {

        if (
            document.querySelector(
                'link[data-bookitbro-sidebar]'
            )
        ) {

            return;
        }


        const link =
            document.createElement("link");


        link.rel = "stylesheet";

        link.href = SIDEBAR_CSS;

        link.dataset.bookitbroSidebar = "true";


        document.head.appendChild(link);

    }



    /* =========================================
       LOAD SIDEBAR HTML
    ========================================= */

    async function loadSidebar() {

        loadSidebarCSS();


        try {

            const response =
                await fetch(SIDEBAR_HTML);


            if (!response.ok) {

                throw new Error(
                    "Sidebar HTML could not be loaded."
                );

            }


            const html =
                await response.text();


            const container =
                document.createElement("div");


            container.id =
                "bookitbro-sidebar-root";


            container.innerHTML =
                html;


            document.body.appendChild(
                container
            );


            initializeSidebar();


        } catch (error) {

            console.error(
                "BookItBro Sidebar Error:",
                error
            );

        }

    }



    /* =========================================
       INITIALIZE
    ========================================= */

    function initializeSidebar() {

        const sidebar =
            document.getElementById(
                "bmsSidebar"
            );


        const overlay =
            document.getElementById(
                "bmsSidebarOverlay"
            );


        const closeButton =
            document.getElementById(
                "bmsSidebarClose"
            );


        const accountButton =
            document.getElementById(
                "bmsSidebarAccount"
            );


        if (
            !sidebar ||
            !overlay ||
            !closeButton
        ) {

            console.error(
                "Sidebar elements missing."
            );

            return;

        }



        /* =========================================
           OPEN
        ========================================= */

        function openSidebar() {

            sidebar.classList.add(
                "is-open"
            );


            overlay.classList.add(
                "is-open"
            );


            sidebar.setAttribute(
                "aria-hidden",
                "false"
            );


            document.body.classList.add(
                "bms-sidebar-lock"
            );

        }



        /* =========================================
           CLOSE
        ========================================= */

        function closeSidebar() {

            sidebar.classList.remove(
                "is-open"
            );


            overlay.classList.remove(
                "is-open"
            );


            sidebar.setAttribute(
                "aria-hidden",
                "true"
            );


            document.body.classList.remove(
                "bms-sidebar-lock"
            );

        }



        /* =========================================
           FIND EXISTING MENU BUTTON
        ========================================= */

        function connectMenuButton() {

            const menuButton =
                document.querySelector(
                    ".menu-btn"
                );


            if (!menuButton) {

                return false;

            }


            if (
                menuButton.dataset
                    .sidebarConnected === "true"
            ) {

                return true;

            }


            menuButton.dataset
                .sidebarConnected = "true";


            menuButton.addEventListener(
                "click",
                openSidebar
            );


            return true;

        }



        /* =========================================
           CONNECT BUTTON
        ========================================= */

        if (!connectMenuButton()) {

            const observer =
                new MutationObserver(
                    function () {

                        if (
                            connectMenuButton()
                        ) {

                            observer.disconnect();

                        }

                    }
                );


            observer.observe(
                document.body,
                {
                    childList: true,
                    subtree: true
                }
            );

        }



        /* =========================================
           CLOSE BUTTON
        ========================================= */

        closeButton.addEventListener(
            "click",
            closeSidebar
        );



        /* =========================================
           OVERLAY CLICK
        ========================================= */

        overlay.addEventListener(
            "click",
            closeSidebar
        );



        /* =========================================
           ESC KEY
        ========================================= */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape" &&
                    sidebar.classList.contains(
                        "is-open"
                    )
                ) {

                    closeSidebar();

                }

            }
        );



        /* =========================================
           ACCOUNT
        ========================================= */

        if (accountButton) {

            accountButton.addEventListener(
                "click",
                function () {

                    closeSidebar();


                    /*
                     * Connect this to your existing
                     * sign-in button.
                     */

                    const signInButton =
                        document.querySelector(
                            ".sign-in-btn"
                        );


                    if (signInButton) {

                        signInButton.click();

                    }

                }
            );

        }



        /* =========================================
           SIDEBAR ITEMS
        ========================================= */

        const items =
            document.querySelectorAll(
                ".bms-sidebar-item"
            );


        items.forEach(
            function (item) {

                item.addEventListener(
                    "click",
                    function () {

                        const action =
                            item.dataset.action;


                        closeSidebar();


                        /*
                         * For now we log the action.
                         *
                         * Later we will connect:
                         *
                         * movies    → Movies page
                         * events    → Events page
                         * plays     → Plays page
                         * sports    → Sports page
                         * activities → Activities page
                         * orders    → My Orders
                         * offers    → Offers
                         */

                        console.log(
                            "Sidebar:",
                            action
                        );


                        document.dispatchEvent(
                            new CustomEvent(
                                "bookitbro:sidebar-action",
                                {
                                    detail: {
                                        action: action
                                    }
                                }
                            )
                        );

                    }
                );

            }
        );

    }



    /* =========================================
       START
    ========================================= */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            loadSidebar
        );

    } else {

        loadSidebar();

    }

})();