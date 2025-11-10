if (window.sessionStorage.getItem("userDetails") != null) {
    window.location.assign("dashboard.html")
}
const firebaseConfig = {
    apiKey: "AIzaSyA_LoUMKptzcasWT2uSL5U-xilkR0gJApU",
    authDomain: "professorpi-7504d.firebaseapp.com",
    projectId: "professorpi-7504d",
    storageBucket: "professorpi-7504d.firebasestorage.app",
    messagingSenderId: "141479419715",
    appId: "1:141479419715:web:b38295501c21f28a88d9f6",
    measurementId: "G-9DW7TJG1CB"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

//Utilities

document.getElementById("passwordV").addEventListener('click', () => {
    if (document.getElementById("passwordV").innerText == "visibility_off") {
        document.getElementById("password").type = "text";
        document.getElementById("passwordV").innerText = "visibility"
    } else {
        document.getElementById("password").type = "password";
        document.getElementById("passwordV").innerText = "visibility_off"
    }

})

//Validate User Info
let Email
let Password
let userDetails
let check = {
    Email: true,
    Password: true,
}



function throwError(name, element) {
    let errorBox = document.getElementById("errors")
    if (document.getElementById(name) == undefined) {
        let error = document.createElement('p')
        error.classList.add("error")
        error.innerHTML = `<span class="material-icons" style="background-color: transparent; padding: 0; font-size: 1rem;" onclick="document.getElementById('${element}').focus(); document.getElementById('${element}').style.border = 'solid 1px #DD3333' "> error</span>${name}`
        error.id = name
        errorBox.appendChild(error)
    }
    document.getElementById(element).style.border = 'solid 1px #DD3333'

}

function removeError(name, element) {
    let errorBox = document.getElementById("errors")
    if (document.getElementById(name) != undefined) {
        if (!name.includes("Password")) {
            document.getElementById(element).style.border = 'solid 1px black'
        } else {
            document.getElementById(element).style.border = 'none'
        }
        errorBox.removeChild(document.getElementById(name))
    }
}

function validateEmail() {

    if (Email.trim().length == 0) {
        removeError("User does not exist", "email")
        removeError("Invalid Email", "email")
        throwError("Email cannot be empty", "email")
        check.Email = false
    } else if (!Email.includes("@") || !Email.includes(".")) {
        removeError("User does not exist", "email")
        throwError("Invalid Email", "email")
        removeError("Email cannot be empty", "email")
        check.Email = false
    } else {
        removeError("Invalid Email", "email")
        removeError("Email cannot be empty", "email")
        var docRef = db.collection("users").doc(Email);

        docRef.get().then((doc) => {
            removeError("Unable to connect to database, Try again!", "email")
            if (!doc.exists) {
                throwError("User does not exist", "email")
                check.Email = false
            } else {
                check.Email = true
                userDetails = doc.data()
                removeError("User does not exist", "email")
                removeError("Invalid Email", "email")
                removeError("Email cannot be empty", "email")
                removeError("Unable to connect to database, Try again!", "email")
            }
        }).catch(() => {
            removeError("User does not exist", "email")
            throwError("Unable to connect to database, Try again!", "email")
            check.Email = false
        });
    }

}
function validatePassword() {
    if (Password.trim().length == 0) {
        removeError(`Username and password do not match`, "password")
        throwError(`Invalid password`, "password")
        check.Password = false
    } else if (Password != userDetails.Password) {
        removeError(`Invalid password`, "password")
        throwError(`Username and password do not match`, "password")
        check.Password = false
    } else {
        check.Password = true
        removeError(`Username and password do not match`, "password")
        removeError(`Invalid password`, "password")
    }

}


document.getElementById('login').addEventListener('click', () => {


    Email = document.getElementById("email").value
    validateEmail()
    Password = document.getElementById("password").value
    validatePassword()


    document.getElementById("email").addEventListener('input', () => {
        Email = document.getElementById("email").value
        validateEmail()
    })
    document.getElementById("password").addEventListener('input', () => {
        Password = document.getElementById("password").value
        validatePassword()
    })
    if (check.Email == true && check.Password == true) {
        // Add a new document in collection "cities"
        window.location.assign('dashboard.html')
        if (document.getElementById("Staysign").checked) {
            window.sessionStorage.setItem("userDetails", JSON.stringify({
                Name: userDetails.Name,
                Email: Email
            }))
        }
    }
})