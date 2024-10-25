const sendToMail = document.getElementById('form-style').addEventListener('submit', function (event) {
    event.preventDefault();

    const inputName = document.getElementById("name").value;
    const inputEmail = document.getElementById("email").value;
    const inputPhone = document.getElementById("phone").value;
    const inputSubject = document.getElementById("subject").value;
    const inputMessage = document.getElementById("message").value;

    console.log(inputName);
    console.log(inputEmail);
    console.log(inputPhone);
    console.log(inputSubject);
    console.log(inputMessage);

    const a = document.createElement('a');
    a.href = `mailto:${inputEmail}?subject=${inputSubject}&body=${inputMessage}`

    a.click();
});