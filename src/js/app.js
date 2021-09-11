document.addEventListener('DOMContentLoaded', () => {

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {

        // Add a click event on each of them
        $navbarBurgers.forEach(el => {
            el.addEventListener('click', () => {

                // Get the target from the "data-target" attribute
                const target = el.dataset.target;
                const $target = document.getElementById(target);

                // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');

            });
        });
    }

});

// if (window.location.pathname == "/contact/session/") {
//     console.log("/contact/session/");
//     let fin = dte();
//     let weekInput = document.getElementById("week");
//     weekInput.setAttribute("min", `${fin.minyear}-W${fin.week}`);
//     weekInput.setAttribute("max", `${fin.maxyear}-W${fin.week}`);

//     function dte() {
//         const d = new Date();
//         const date = new Date(d.getTime());
//         date.setHours(0, 0, 0, 0);
//         date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
//         const week1 = new Date(date.getFullYear(), 0, 4);
//         return {
//             minyear: d.getFullYear(),
//             maxyear: (d.getFullYear() + 1),
//             week: 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)
//         };
//     }
// }

// if (window.location.pathname == "/resources/") {
//     console.log("/resources/");

//     const array = document.getElementsByClassName("download");

//     for (let index = 0; index < array.length; index++) {
//         array[index].addEventListener("click", downloadSend);

//     }

//     async function downloadSend(event) {
//         const date = new Date();
//         const id = event.target.getAttribute("key");
//         const raw = JSON.stringify({
//             "fields": {
//                 "date": date.toISOString(),
//                 "resource": [
//                     id,
//                 ]
//             }
//         });
//         const data = {
//             method: 'POST',
//             mode: 'cors',
//             cache: 'no-cache',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: raw
//         }
//         const response = await fetch("https://sex2.tjsheppard.dev/api/downloads", data);
//     }
// }