import { createAuth0Client, type Auth0Client } from "@auth0/auth0-spa-js";

const DEFAULT_AUTH0_DOMAIN = "dev-857utmcrtxtcove4.us.auth0.com";
const DEFAULT_AUTH0_CLIENT_ID = "giCqBzfSwhuj9pEXHcU34ncHRuOYWit6";

const loadingState = document.getElementById("secret-loading");
const errorState = document.getElementById("secret-error");
const errorDetails = document.getElementById("secret-error-details");
const loggedOutState = document.getElementById("secret-logged-out");
const loggedInState = document.getElementById("secret-logged-in");
const loginButton = document.getElementById("secret-login-button");
const logoutButton = document.getElementById("secret-logout-button");
const greeting = document.getElementById("secret-greeting");

let auth0Client: Auth0Client | null = null;

function setVisible(element: HTMLElement | null, visible: boolean) {
  if (!element) return;
  element.classList.toggle("hidden", !visible);
}

function getAuth0Config() {
  const env = import.meta.env as Record<string, string | undefined>;
  const domain = env.VITE_AUTH0_DOMAIN ?? DEFAULT_AUTH0_DOMAIN;
  const clientId = env.VITE_AUTH0_CLIENT_ID ?? DEFAULT_AUTH0_CLIENT_ID;

  if (!domain || !clientId) {
    throw new Error(
      [
        "Missing Auth0 environment variables.",
        "Set these values in modern/.env.local:",
        "VITE_AUTH0_DOMAIN=your-tenant.auth0.com",
        "VITE_AUTH0_CLIENT_ID=your-client-id",
      ].join("\n")
    );
  }

  return { domain, clientId };
}

function getOriginSetupHelp() {
  const origin = window.location.origin;
  return [
    "Auth0 application settings required:",
    `Allowed Callback URLs: ${origin}/login/`,
    `Allowed Logout URLs: ${origin}/`,
    `Allowed Web Origins: ${origin}`,
  ].join("\n");
}

function showError(message: string) {
  setVisible(loadingState as HTMLElement, false);
  setVisible(loggedOutState as HTMLElement, false);
  setVisible(loggedInState as HTMLElement, false);
  setVisible(errorState as HTMLElement, true);
  if (errorDetails) {
    errorDetails.textContent = message;
  }
}

async function showAuthenticatedState() {
  if (!auth0Client) return;
  const user = await auth0Client.getUser();
  const name = user?.name ?? user?.nickname ?? "agent";
  if (greeting) {
    greeting.textContent = `Welcome ${name}. Clearance level: Midnight Blue.`;
  }
  setVisible(loadingState as HTMLElement, false);
  setVisible(errorState as HTMLElement, false);
  setVisible(loggedOutState as HTMLElement, false);
  setVisible(loggedInState as HTMLElement, true);
}

function showLoggedOutState() {
  setVisible(loadingState as HTMLElement, false);
  setVisible(errorState as HTMLElement, false);
  setVisible(loggedInState as HTMLElement, false);
  setVisible(loggedOutState as HTMLElement, true);
}

async function handleLogin() {
  if (!auth0Client) return;
  await auth0Client.loginWithRedirect({
    appState: {
      returnTo: "/secret/",
    },
    authorizationParams: {
      redirect_uri: `${window.location.origin}/login/`,
    },
  });
}

async function handleLogout() {
  if (!auth0Client) return;
  await auth0Client.logout({
    logoutParams: {
      returnTo: `${window.location.origin}/`,
    },
  });
}

async function init() {
  try {
    const { domain, clientId } = getAuth0Config();

    auth0Client = await createAuth0Client({
      domain,
      clientId,
      authorizationParams: {
        redirect_uri: `${window.location.origin}/login/`,
      },
    });

    const hasAuthResult = window.location.search.includes("code=") &&
      window.location.search.includes("state=");

    if (hasAuthResult) {
      await auth0Client.handleRedirectCallback();
      window.history.replaceState({}, document.title, "/secret/");
    } else {
      try {
        await auth0Client.checkSession({
          authorizationParams: {
            redirect_uri: `${window.location.origin}/login/`,
          },
        });
      } catch {
        showLoggedOutState();
        return;
      }
    }

    const isAuthenticated = await auth0Client.isAuthenticated();
    if (isAuthenticated) {
      await showAuthenticatedState();
      return;
    }

    showLoggedOutState();
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown Auth0 error";
    showError(`${detail}\n\n${getOriginSetupHelp()}`);
  }
}

loginButton?.addEventListener("click", () => {
  void handleLogin().catch((error) => {
    const detail = error instanceof Error ? error.message : "Login failed";
    showError(detail);
  });
});

logoutButton?.addEventListener("click", () => {
  void handleLogout().catch((error) => {
    const detail = error instanceof Error ? error.message : "Logout failed";
    showError(detail);
  });
});

void init();
