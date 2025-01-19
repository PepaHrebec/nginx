const form = document.querySelector(".login-form");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const errorMessage = document.querySelector(".error-message");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  password.classList.remove("error");
  //   confirmPassword.classList.remove("error");
  //   errorMessage.hidden = true; // Skrytí chybové zprávy před odesláním

  // Kontrola, zda uživatelské jméno již není zabráno
  try {
    const response = await fetch(
      "https://jirka-production.up.railway.app/login",
      {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.value,
          password: password.value,
        }),
      }
    );
    if (response.status == 200) {
      window.location.href = "https://site-production-70c0.up.railway.app/";
    } else {
      // Zde napiš kód pro případ, kdy přihlášení neproběhne úspěšně
      errorMessage.hidden = false;
      password.classList.add("error");
      username.classList.add("error");
    }
  } catch (error) {}
});
