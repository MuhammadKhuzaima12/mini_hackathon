const signin_link = document.getElementById("signin_link");
const signup_link = document.getElementById("signup_link");
const signin = document.getElementById("sign_in_id");
const signup = document.getElementById("sign_up_id");

function sweet_alert(title,icon) {
  Swal.fire({
    title: `${title}`,
    icon: `${icon}`,
    showClass: {
      popup: `
      animate__animated
      animate__fadeInDown
      animate__faster
    `,
    },
    hideClass: {
      popup: `
      animate__animated
      animate__fadeOutUp
      animate__faster
    `,
    },
  });
}

// Navigator Function
function change_sign(event) {
  const targeted_id = event.currentTarget.id;
  if (targeted_id == "signin_link") {
    signin.style.display = "flex";
    signup.style.display = "none";
  } else {
    signin.style.display = "none";
    signup.style.display = "flex";
  }
}

// Show/Hide Password
function show_pass(event) {
  // console.log(event.currentTarget)
  const show_icon = event.currentTarget;
  const show_icon_parent = show_icon.parentElement;
  const parent_nextSibling = show_icon_parent.nextElementSibling;
  console.log(show_icon);
  console.log(show_icon.classList.contains("bx-show"));
  if (show_icon.classList.contains("bx-show")) {
    show_icon.classList.remove("bx-show");
    show_icon.classList.add("bx-hide");
    parent_nextSibling.type = "text";
  } else {
    show_icon.classList.add("bx-show");
    show_icon.classList.remove("bx-hide");
    parent_nextSibling.type = "password";
  }
}

// Validation Functions
function valid_email(email) {
  const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // return email;
  return email_regex.test(email);
}

function valid_password(password) {
  const password_regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]{8,}$/;
  // return password;
  return password_regex.test(password);
}

function on_signup(event) {
  event.preventDefault();

  // Input Values
  const username_value = document.getElementById("user_name").value.trim();
  const useremail_value = document.getElementById("user_email").value.trim();
  const userpassword_value = document.getElementById("user_password").value;

  // console.log(username_value);
  // console.log(useremail_value);
  // console.log(userpassword_value);
  // console.log(userphone_value);

  // Inputs to focus
  const useremail = document.getElementById("user_email");
  const userpassword = document.getElementById("user_password");

  // Get Users (if exist)
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  // console.log(users);
  if (users.length > 0) {
    for (let i = 0; i < users.length; i++) {
      console.log(users[i].userEmail);
      if (useremail_value === users[i].userEmail) {
        sweet_alert( "Email already registered","error")
        return;
      }
    }
  }

  //Validations
  const email_status = valid_email(useremail_value);
  if (!email_status) {
    useremail.focus();
    useremail.classList.add("invalid");
    sweet_alert( `Invalid Email!`,"error")
    setTimeout(() => {
      useremail.classList.remove("invalid");
    }, 3000);
    return;
  }

  const password_status = valid_password(userpassword_value);

  if (!password_status) {
    sweet_alert( "Password doesn't meet requirements!","error")
    userpassword.focus();
    userpassword.type = "text";

    setTimeout(() => {
      userpassword.type = "password";
    }, 5000);
    return;
  }

  users.push({
    userName: username_value,
    userEmail: useremail_value,
    userPassword: userpassword_value,
  });
  localStorage.setItem("users", JSON.stringify(users));

  document.getElementById("user_name").value = "";
  document.getElementById("user_email").value = "";
  document.getElementById("user_password").value = "";
  // Show success and switch to login
  sweet_alert( "Registration successful! Please sign in.","success")
  change_sign({ currentTarget: { id: "signin_link" } });
}

function on_signin(event) {
  event.preventDefault();

  const check_email_value = document.getElementById("check_email").value.trim();
  const check_password_value = document.getElementById("check_password").value;

  // Inputs to focus
  const check_email = document.getElementById("check_email");
  const check_password = document.getElementById("check_password");

  //Validations
  const email_status = valid_email(check_email_value);
  if (!email_status) {
    check_email.focus();
    check_email.classList.add("invalid");
    sweet_alert( `Invalid Email!`,"error")
    setTimeout(() => {
      check_email.classList.remove("invalid");
    }, 3000);
    return;
  }

  const password_status = valid_password(check_password_value);
  if (!password_status) {
    sweet_alert( "Password doesn't meet requirements!","error")
    check_password.focus();
    check_password.type = "text";

    setTimeout(() => {
      check_password.type = "password";
    }, 5000);
    return;
  }

  // Get Users (if exist)
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  console.log(users);
  if (users.length > 0) {
    for (let i = 0; i < users.length; i++) {
      // checks the password after getting the email
      if (check_email_value === users[i].userEmail) {
        if (check_password_value !== users[i].userPassword) {
          sweet_alert( "Incorrect Password","error")
          check_password.focus();
          check_password.type = "text";
          return;
        } else {
          sweet_alert( "Login successful!","success")
          setTimeout(window.location.pathname = "https://muhammadkhuzaima12.github.io/mini_hackathon/index.html",1500)
          return;
        }
      }

      // alert when email don't match with any existing email
      if (check_email_value !== users[users.length - 1].userEmail) {
        sweet_alert( "No account found with this email!","error")
        check_email.focus();
        check_email.classList.add("invalid");
        setTimeout(() => {
          check_email.classList.remove("invalid");
        }, 3000);
        return;
      }
    }
  } else {
    sweet_alert( "There is not any email registered.","error")
    change_sign({ currentTarget: { id: "signup_link" } });
  }
}

// Initialize Bootstrap Popovers
document.addEventListener("DOMContentLoaded", function () {
  // Select all popover elements
  var popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]')
  );

  // Initialize each one
  popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl, {
      trigger: "hover focus", // Optional: makes it show on hover
    });
  });
});
