// universal
// Landing Nabar
$(document).ready(function () {
  $("#openDropdown").click(function () {
    $("#mobileDropdown").slideToggle();
  });
});

// Dark mode
$(document).ready(function () {
  const isDarkMode = localStorage.getItem("darkMode") === "true";
  if (isDarkMode) {
    $("body").addClass("dark");
    $("#darkModeCheckbox").prop("checked", true);
  }

  $("#toggleDarkMode").click(function () {
    $("#darkModeCheckbox").prop("checked", function (_, checked) {
      if (!checked) {
        $("body").addClass("dark");
        localStorage.setItem("darkMode", "true");
      } else {
        $("body").removeClass("dark");
        localStorage.setItem("darkMode", "false");
      }
      return !checked;
    });
  });
});

// sidebar

// end of universal
// page Register
$(document).ready(function () {
  $("#togglePassword").click(function () {
    const passwordInput = $("#password");

    if (passwordInput.attr("type") === "password") {
      passwordInput.attr("type", "text");
    } else {
      passwordInput.attr("type", "password");
    }
  });

  $("#toggleConfirmPassword").click(function () {
    const passwordInput = $("#confirm-password");

    if (passwordInput.attr("type") === "password") {
      passwordInput.attr("type", "text");
    } else {
      passwordInput.attr("type", "password");
    }
  });

  $("#registerBtn").click(function () {
    const username = $("#username").val();
    const email = $("#email").val();
    const password = $("#password").val();
    const confirmPassword = $("#confirm-password").val();
    const registerButton = $(this);

    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      $("#alert").text("Please fill in all fields").fadeIn();
      return;
    }

    if (password !== confirmPassword) {
      $("#alert").text("Passwords do not match").fadeIn();
      return;
    }

  registerButton.prop("disabled", true).addClass("opacity-50");

    $.ajax({
      url: "/register",
      method: "POST",
      data: $("#registerForm").serialize(),
      success: function (response) {
        // console.log(response);
        if (response.status === true) {
          $("#alert")
            .text(response.message)
            .removeClass("text-red-500")
            .addClass("text-green-500")
            .fadeIn();
          setTimeout(function () {
            window.location.href = "/login";
          }, 3500);
        } else {
          $("#alert")
            .text(response.message)
            .removeClass("text-green-500")
            .addClass("text-red-500")
            .fadeIn();
        }
      },
      error: function (xhr, status, error) {
        $("#alert")
          .text("Error: " + xhr.responseText)
          .fadeIn();
      },
      complete: function () {
        registerButton.prop("disabled", false).removeClass("opacity-50");
      },
    });
  });
});

// page login
$(document).ready(function () {
  $("#btnPasswordLogin").click(function () {
    const passwordInput = $("#password");

    if (passwordInput.attr("type") === "password") {
      passwordInput.attr("type", "text");
    } else {
      passwordInput.attr("type", "password");
    }
  });

  $("#loginForm").submit(function (event) {
    event.preventDefault();

    const formData = $(this).serialize();
    const loginButton = $("#login"); 

    loginButton.prop("disabled", true).addClass("opacity-50");

    $.ajax({
      type: "POST",
      url: "/login",
      data: formData,
      success: function (response) {
        $("#alert")
          .text(response.message)
          .removeClass("text-red-500")
          .addClass("text-green-500")
          .fadeIn();
        setTimeout(function () {
          window.location.href = "/home";
        }, 500);
      },
      error: function (xhr, status, error) {
        console.error("Error:", error);
        $("#alert").text(xhr.responseJSON.message).fadeIn();
      },
      complete: function () {
        loginButton.prop("disabled", false).removeClass("opacity-50");
      },
    });
  });
});


// page home
$(document).ready(function () {
  $(".profile").click(function (e) {
    e.stopPropagation();
    $("#profileMenu").toggleClass("hidden");
  });

  $(document).click(function (e) {
    if (
      !$(e.target).closest("#profileMenu").length &&
      !$(e.target).is(".profile")
    ) {
      $("#profileMenu").addClass("hidden");
    }
  });

  $("#profileMenu").on("click", "#logoutButton", function () {
    $("#logoutModal").fadeIn();
  });

  $("#cancelLogout").click(function () {
    $("#logoutModal").fadeOut();
  });

  $("#confirmLogout").click(function () {
    $.ajax({
      url: "/logout",
      type: "POST",
      success: function (response) {
        if (response.status === true) {
          window.location.href = "/login";
        } else {
          console.error("Logout failed:", response.message);
        }
      },
      error: function (xhr, status, error) {
        console.error("Logout failed:", error);
      },
    });
  });
});
