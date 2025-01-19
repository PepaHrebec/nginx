document.addEventListener("DOMContentLoaded", async function () {
  // Funkce pro ověření uživatele
  async function user() {
    try {
      console.log("Zkouším ověřit login");

      const response = await fetch(
        "http://jirka-production.up.railway.app/user-info",
        {
          credentials: "include",
        }
      );

      const data = await response.json();
      console.log(data);

      if (data) {
        const navBarLogin = document.querySelector(".with-login");
        const userElement = document.querySelector(".user-name");
        console.log(userElement);
        navBarLogin.style.display = "flex";
        userElement.textContent = "Uživatel: " + data.name;
        console.log(data.user_name);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("Chyba při ověřování uživatele:", error);
      return false;
    }
  }

  const isUserAuthenticated = await user();

  if (isUserAuthenticated) {
    console.log("Uživatel je přihlášen, načítám filmy...");

    const container = document.querySelector("#liked-movies");

    if (!container) {
      console.error("Kontejner pro články nebyl nalezen.");
      return;
    }
    try {
      const response = await fetch(
        `http://jirka-production.up.railway.app/search/liked`,
        {
          credentials: "include",
        }
      );
      const movieData = await response.json();
      console.log(movieData);
      if (movieData) {
        try {
          if (movieData.length > 0) {
            console.log(`Nalezeno ${movieData.length} filmů.`);
            movieData.forEach((movie) => {
              console.log(movie);
              const title = movie.title || "Neznámý název";
              const overview = movie.overview || "Popis není dostupný.";
              const rating =
                movie.vote_average !== undefined
                  ? "Průměrné hodnocení: " +
                    parseFloat(movie.vote_average.toFixed(1)) +
                    "/10"
                  : "N/A";
              const releaseDate =
                "Datum vydání: " + movie.release_date || "Neznámé datum";
              const posterPath = movie.poster_path
                ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                : "https://via.placeholder.com/300x450?text=Plakát+není+dostupný";
              console.log(movie.liked);
              const buttonText = movie.liked
                ? "Odebrat z oblíbených"
                : "Přidat do oblíbených";
              const likeClass = movie.liked ? "liked" : "";
              const clanek = document.createElement("div");
              clanek.className = "clanek";
              clanek.innerHTML = `
              <article class="content">
                <div class="columns-container">
                  <div class="left-col">
                    <img
                      class="movie-poster"
                      src="${posterPath}"
                      alt="${title}"
                      style="max-width: 300px"
                    />
                  </div>
                  <div class="divider"></div>
                  <div class="right-col">
                    <div class="text-area" id="n${movie.id}">
                      <h2 class="movie-title">${title}</h2>
                      <p class="movie-description">${overview}</p>
                      <p class="movie-rating b">${rating}</p>
                      <p class="date b">${releaseDate}</p>
                      <button class="like-button ${likeClass} n${movie.id}" data-movie-id="n${movie.id}">${buttonText}</button>
                    </div>
                  </div>
                </div>
              </article>
            `;
              container.appendChild(clanek);
              const likeButton = document.querySelector(`.n${movie.id}`);
              likeButton.addEventListener("click", async () => {
                try {
                  const response = await fetch(
                    `http://jirka-production.up.railway.app/list/${movie.id}`,
                    { method: "POST", credentials: "include" }
                  );
                  // console.log(response);
                  location.reload();
                } catch (error) {}
              });
              // container.addEventListener("click", async (event) => {
              //   // Kontrola, zda byl kliknutý prvek tlačítko s třídou "like-button"
              //   if (event.target.classList.contains("like-button")) {
              //     const movieId = event.target.getAttribute("data-movie-id"); // Získání ID filmu z atributu
              //     try {
              //       const response = await fetch(
              //         `http://localhost:3000/list/${movieId}`,
              //         { method: "POST", credentials: "include" }
              //       );
              //       location.reload();
              //     } catch (error) {
              //       console.error("Chyba při odesílání požadavku:", error);
              //     }
              //   }
              // });
            });
          } else {
            console.warn("Žádné výsledky pro filmy nebyly nalezeny.");
          }
        } catch (error) {
          console.error("Chyba při zpracování dat z localStorage:", error);
        }
      } else {
        console.warn("Žádná data nebyla nalezena v localStorage.");
      }
    } catch {}

    document
      .getElementById("logout-link")
      .addEventListener("click", async (event) => {
        event.preventDefault(); // Zabraň přesměrování
        try {
          const response = await fetch(
            "http://jirka-production.up.railway.app/logout",
            {
              method: "POST",
              credentials: "include", // Důležité pro odeslání cookies (relace)
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            alert("Úspěšně odhlášeno!");
            window.location.href = "/"; // Přesměruj na úvodní stránku
          } else {
            const data = await response.json();
            alert(`Chyba při odhlášení: ${data.message}`);
          }
        } catch (error) {
          console.error("Chyba při odhlášení:", error);
          alert("Došlo k chybě při odhlášení.");
        }
      });
  } else {
    console.log("Uživatel není přihlášen, zobrazuji jiný obsah...");
    window.location.href = "/";
  }
  document
    .querySelector("#find-movie")
    .addEventListener("click", async (event) => {
      event.preventDefault(); // Zabraň přesměrování

      const movieName = document.querySelector("#movie-name").value;
      if (!movieName) {
        alert("Zadejte jméno filmu!");
        return;
      }

      try {
        const response = await fetch(
          `http://jirka-production.up.railway.app/movie/search/${movieName}`,
          { credentials: "include" }
        );
        const data = await response.json();
        console.log(data);

        localStorage.setItem("movieData", JSON.stringify(data));

        window.location.href = "http://localhost:8080/sites/found-movie.html";
      } catch (error) {
        console.error("Chyba při hledání filmu:", error);
      }
    });
});
const input = document.getElementById("movie-name");
const button = document.getElementById("find-movie");
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    button.click();
  }
});
