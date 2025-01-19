const form = document.querySelector(".login-form");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirm-password");
const errorMessage = document.querySelector(".error-message");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  password.classList.remove("error");
  confirmPassword.classList.remove("error");
  errorMessage.hidden = true; // Skrytí chybové zprávy před odesláním

  if (password.value !== confirmPassword.value) {
    console.log("Hesla se neshodují");
    password.classList.add("error");
    confirmPassword.classList.add("error");
    password.value = "";
    confirmPassword.value = "";
    document.querySelector(".error-message").textContent =
      "Hesla se neshodují!";
    errorMessage.hidden = false;
    return;
  }

  const response = await fetch(
    "https://jirka-production.up.railway.app/register",
    {
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
  console.log(response);
  if (response.status === 400) {
    const data = await response.json();
    console.log(data.message);
    username.classList.add("error");
    errorMessage.textContent = data.message;
    errorMessage.hidden = false;
  } else if (response.status === 200) {
    alert("Úspěšně registrováno!");
    window.location.href = "http://localhost:8080/sites/login";
  }
});
