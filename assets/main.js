$(document).ready(function () {
  // tooltip

  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });

  $(function () {
    $('[data-toggle="popover"]').popover();
    $("body").on("click", function (e) {
      $('[data-toggle="popover"]').each(function () {
        //the 'is' for buttons that trigger popups
        //the 'has' for icons within a button that triggers a popup
        if (
          !$(this).is(e.target) &&
          $(this).has(e.target).length === 0 &&
          $(".popover").has(e.target).length === 0
        ) {
          $(this).popover("hide");
        }
      });
    });
  });
});

// Okta sign up/sign in

var oktaSignIn = new OktaSignIn({
  features: {
    registration: true, // Enable self-service registration flow
    router: true,
  },

  baseUrl: "https://dev-970237.okta.com",
  logo: "assets/images/icons/gt.png",
  brandName: "Trey Helmer",
  clientId: "0oa24xeu76kpUA5wY357",
  redirectUri: "https://pchiii.github.io/my-portfolio/login.html",
  i18n: {
    en: {
      "primaryauth.title": "Sign in to VIP Lounge",
      "primaryauth.username.placeholder": "your@email.com",
      "primaryauth.username.tooltip": "Username must be Email",
    },
  },

  authParams: {
    issuer: "https://dev-970237.okta.com/oauth2/default",
    responseType: ["token", "id_token"],
    display: "page",
    // scopes: ['openid', 'email', 'profile'],
  },

  colors: {
    brand: "#495057",
  },

  // idps: [
  //   {type: 'GOOGLE', id: '0oaaix1twko0jyKik0g4'},
  // {type: 'FACEBOOK', id: '0oar25ZnMM5LrpY1O0g3'},
  // {type: 'LINKEDIN', id: '0oaaix1twko0jyKik0g4'},

  // ]
});

if (oktaSignIn.token.hasTokensInUrl()) {
  oktaSignIn.token.parseTokensFromUrl(
    // If we get here, the user just logged in.
    function success(res) {
      var accessToken = res[0];
      var idToken = res[1];

      oktaSignIn.tokenManager.add("accessToken", accessToken);
      oktaSignIn.tokenManager.add("idToken", idToken);

      window.location.hash = "";
      document.getElementById("messageBox").innerHTML =
        "Hello, " + idToken.claims.email + "! You are logged in! :)";
    },
    function error(err) {
      console.error(err);
    }
  );
} else {
  oktaSignIn.session.get(function (res) {
    // If we get here, the user is already signed in.
    if (res.status === "ACTIVE") {
      document.getElementById("messageBox").innerHTML =
        "Hello, " + res.login + "! You are logged in! :)";
      return;
    }
    oktaSignIn.renderEl(
      {
        el: "#okta-login-container",
      },
      function success(res) {},
      function error(err) {
        console.error(err);
      }
    );
  });
}

// Improved sign-out logic
document.getElementById("logout-button").addEventListener("click", (event) => {
  event.preventDefault();

  const signoutWindow = window.open(
    "https://dev-970237.okta.com/login/signout",
    "okta-signout",
    "height=1,width=1"
  );

  setTimeout(() => {
    if (signoutWindow) {
      signoutWindow.close();
    }
    window.location.href = "https://pchiii.github.io/my-portfolio"; // Redirect after logout
  }, 2000); // Increased timeout for better reliability
});
