function handleFormSend() {
    const email = document.querySelector("#email").value;
    const complain = document.querySelector("#complain").value;

    console.log(email);

    alert("Witaj " + email + "\nOto twoja wiadomość:\n" + complain);
}