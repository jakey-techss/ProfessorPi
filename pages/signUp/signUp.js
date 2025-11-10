if(window.sessionStorage.getItem("userDetails") != null){
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
document.getElementById("CpasswordV").addEventListener('click', () => {
    if (document.getElementById("CpasswordV").innerText == "visibility_off") {
        document.getElementById("cPassword").type = "text";
        document.getElementById("CpasswordV").innerText = "visibility"
    } else {
        document.getElementById("cPassword").type = "password";
        document.getElementById("CpasswordV").innerText = "visibility_off"
    }

})

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
let fullName
let Email
let Password
let passwordLength = Math.round(Math.random() * 6) + 6
let Cpassword
let checked
let check = {
    FullName: true,
    Email: true,
    Password: true,
    Cpassword: true,
    Agree: true,
}

let specials = ['$', '@', "#", "&", "*", "-", "+", "_", ".", ":"]
let randomSpecial = specials[Math.round(Math.random() * 10)]


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

function validateName() {
    if (fullName.trim().length == 0) {
        removeError("Invalid Name", "fullName")
        throwError("Name cannot be empty", "fullName")
        check.FullName = false
    } else if (!fullName.trim().includes(" ") || fullName.length < 3) {
        removeError("Name cannot be empty", "fullName")
        throwError("Invalid Name", "fullName")
        check.FullName = false
    } else {
        check.FullName = true
        removeError("Invalid Name", "fullName")
        removeError("Name cannot be empty", "fullName")
    }

}
function validateEmail() {

    if (Email.trim().length == 0) {
        removeError("User already exists, log in instead", "email")
        removeError("Invalid Email", "email")
        throwError("Email cannot be empty", "email")
        check.Email = false
    } else if (!Email.includes("@") || !Email.includes(".")) {
        removeError("User already exists, log in instead", "email")
        throwError("Invalid Email", "email")
        removeError("Email cannot be empty", "email")
        check.Email = false
    } else {
        removeError("Invalid Email", "email")
        removeError("Email cannot be empty", "email")
        var docRef = db.collection("users").doc(Email);

        docRef.get().then((doc) => {
            removeError("Unable to connect to database, Try again!", "email")
            if (doc.exists) {
                throwError("User already exists, log in instead", "email")
                check.Email = false
            } else {
                check.Email = true
                removeError("User already exists, log in instead", "email")
                removeError("Invalid Email", "email")
                removeError("Email cannot be empty", "email")
                removeError("Unable to connect to database, Try again!", "email")
            }
        }).catch(() => {
            removeError("User already exists, log in instead", "email")
            throwError("Unable to connect to database, Try again!", "email")
            check.Email = false
        });
    }

}
function validatePassword() {
    if (Password.trim().length == 0 || Password.trim().length < passwordLength) {
        removeError(`Password must include '${randomSpecial}'`, "password")
        throwError(`Password must be greater than ${passwordLength - 1} characters`, "password")
        check.Password = false
    } else if (!Password.includes(randomSpecial)) {
        removeError(`Password must be greater than ${passwordLength - 1} characters`, "password")
        throwError(`Password must include '${randomSpecial}'`, "password")
        check.Password = false
    } else {
        check.Password = true
        removeError(`Password must be greater than ${passwordLength - 1} characters`, "password")
        removeError(`Password must include '${randomSpecial}'`, "password")
    }

}
function validateCpassword() {
    if (Cpassword.trim().length == 0 && Password.trim().length == 0) {
        removeError(`Password does not match`, "cPassword")
        throwError(`Password must be greater than ${passwordLength - 1} characters`, "cPassword")
        check.Cpassword = false
    } else if (Cpassword != Password) {
        removeError(`Password must be greater than ${passwordLength - 1} characters`, "cPassword")
        throwError(`Password does not match`, "cPassword")
        check.Cpassword = false
    } else {
        check.Cpassword = true
        removeError(`Password must be greater than ${passwordLength - 1} characters`, "cPassword")
        removeError(`Password does not match`, "cPassword")
    }

}
function validateTerms() {
    if (!checked) {
        throwError(`Please agree to terms and conditions`, "t&c")
        check.Agree = false
    } else {
        removeError(`Please agree to terms and conditions`, "t&c")
        check.Agree = true
    }
}
document.getElementById('signUp').addEventListener('click', () => {

    fullName = document.getElementById("fullName").value
    validateName()
    Email = document.getElementById("email").value
    validateEmail()
    Password = document.getElementById("password").value
    validatePassword()
    Cpassword = document.getElementById("cPassword").value
    validateCpassword()
    checked = document.getElementById("t&c").checked
    validateTerms()
    document.getElementById("t&c").addEventListener('click', () => {
        checked = document.getElementById("t&c").checked
        validateTerms()
    })
    document.getElementById("fullName").addEventListener('input', () => {
        fullName = document.getElementById("fullName").value
        validateName()
    })
    document.getElementById("email").addEventListener('input', () => {
        Email = document.getElementById("email").value
        validateEmail()
    })
    document.getElementById("password").addEventListener('input', () => {
        Password = document.getElementById("password").value
        validatePassword()
        validateCpassword()
    })
    document.getElementById("cPassword").addEventListener('input', () => {
        Cpassword = document.getElementById("cPassword").value
        validateCpassword()
    })
    if (check.FullName == true && check.Email == true && check.Password == true && check.Cpassword == true && check.Agree == true) {
        // Add a new document in collection "cities"
        db.collection("users").doc(Email).set({
            Name: fullName,
            Password: Password,
        }).then(()=>{
            window.location.assign('dashboard.html')
            if(document.getElementById("Staysign").checked){
                window.sessionStorage.setItem("userDetails",JSON.stringify({
                    Name: fullName,
                    Email: Email
                }))
            }
        })
    }
})