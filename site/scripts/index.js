document.addEventListener("DOMContentLoaded", function () {
  async function fetchRandomMovies() {
    try {
      const response = await fetch(`https://jirka-production.up.railway.app/`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Chyba při načítání dat z API");
      }

      const data = await response.json();
      const movies = data.results;

      // Najdi všechny články
      const articles = document.querySelectorAll(".clanek .content");

      articles.forEach((article, index) => {
        // Vyber film podle indexu článku, použij modulo, pokud je filmů méně než článků
        const randomMovie = movies[index % movies.length];

        // Najdi prvky v rámci článku
        const titleElement = article.querySelector(".movie-title");
        const descriptionElement = article.querySelector(".movie-description");
        const posterElement = article.querySelector(".movie-poster");
        const ratingElement = article.querySelector(".movie-rating");
        const dateElement = article.querySelector(".date");
        const rating = randomMovie.vote_average;
        const liked = randomMovie.liked;
        const likeButton = article.querySelector(".like-button");
        console.log("hahahah", liked);
        if (liked) {
          likeButton.textContent = "Odebrat z oblíbených";
          likeButton.classList.add("liked");
        } else {
          likeButton.textContent = "Přidat do oblíbených";
        }

        // Zobraz informace o filmu
        titleElement.textContent = randomMovie.title;
        descriptionElement.textContent = randomMovie.overview;
        posterElement.src = `https://image.tmdb.org/t/p/w500${randomMovie.poster_path}`;
        ratingElement.textContent =
          "Průměrné hodnocení: " + parseFloat(rating.toFixed(1)) + "/10";
        dateElement.textContent = "Datum vydání: " + randomMovie.release_date;

        likeButton.addEventListener("click", async () => {
          try {
            const response = await fetch(
              `https://jirka-production.up.railway.app/list/${randomMovie.id}`,
              { method: "POST", credentials: "include" }
            );
            console.log(response);
          } catch (error) {
            likeButton.classList.replace("unlike-movie", "like-movie");
          }
        });
      });
    } catch (error) {
      console.error(error);

      // Pokud dojde k chybě, nastav zprávu pro všechny články
      const articles = document.querySelectorAll(".clanek .content");
      articles.forEach((article) => {
        const titleElement = article.querySelector(".movie-title");
        const descriptionElement = article.querySelector(".movie-description");
        const posterElement = article.querySelector(".movie-poster");
        const ratingElement = article.querySelector(".movie-rating");
        const dateElement = article.querySelector(".date");

        titleElement.textContent = "Nepodařilo se načíst film.";
        descriptionElement.textContent = "Zkuste to prosím později.";
        posterElement.style.display = "none";
        ratingElement.textContent = "none";
        dateElement.textContent = "none";
      });
    }
  }
  async function getMovieById(wantedId) {
    const response = await fetch(
      `https://jirka-production.up.railway.app/movie/${wantedId}`
    );
    if (!response.ok) {
      throw new Error("Chyba při načítání dat z API");
    }
  }
  fetchRandomMovies();

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
          `https://jirka-production.up.railway.app/movie/search/${movieName}`,
          { credentials: "include" }
        );
        const data = await response.json();
        console.log(data);

        // Uložení dat do localStorage
        localStorage.setItem("movieData", JSON.stringify(data));

        // Přesměrování na stránku s filmem
        window.location.href =
          "https://filmy.merinsky.eu/sites/found-movie.html";
      } catch (error) {
        console.error("Chyba při hledání filmu:", error);
      }
    });

  async function user() {
    try {
      const response = await fetch(
        "https://jirka-production.up.railway.app/user-info",
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log(data);
      if (data) {
        const navBarWithoutLogin = document.querySelector(".without-login");
        const navBarLogin = document.querySelector(".with-login");
        const userElement = document.querySelector(".user-name");
        const likeButton = document.querySelector(".like-button");
        console.log(userElement);
        navBarWithoutLogin.style.display = "none";
        navBarLogin.style.display = "flex";
        userElement.textContent = "Uživatel: " + data.name;
        console.log(data.user_name);
        const likesButtons = document.querySelectorAll(".like-button");

        likesButtons.forEach((button) => {
          button.style.display = "flex";
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  user();
});

document
  .getElementById("logout-link")
  .addEventListener("click", async (event) => {
    event.preventDefault(); // Zabraň přesměrování
    try {
      const response = await fetch(
        "https://jirka-production.up.railway.app/logout",
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
const input = document.getElementById("movie-name");
const button = document.getElementById("find-movie");

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    button.click();
  }
});
const likeButtons = document.querySelectorAll(".like-button");

likeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("liked");
    if (button.classList.contains("liked")) {
      button.textContent = "Odebrat z oblíbených";
    } else {
      button.textContent = "Přidat do oblíbených";
    }
  });
});
