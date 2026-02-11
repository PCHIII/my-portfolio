import { createAuth0Client, type Auth0Client, type User } from "@auth0/auth0-spa-js";

const DEFAULT_AUTH0_DOMAIN = "dev-857utmcrtxtcove4.us.auth0.com";
const DEFAULT_AUTH0_CLIENT_ID = "giCqBzfSwhuj9pEXHcU34ncHRuOYWit6";
const AUTH_STATE_KEY = "th.authenticated";

const loadingState = document.getElementById("loading-state");
const errorState = document.getElementById("error-state");
const errorDetails = document.getElementById("error-details");
const authApp = document.getElementById("auth-app");
const loggedOutSection = document.getElementById("logged-out-section");
const loggedInSection = document.getElementById("logged-in-section");
const profileContainer = document.getElementById("profile-container");
const loginButton = document.getElementById("login-button");
const logoutButton = document.getElementById("logout-button");

let auth0Client: Auth0Client | null = null;

function setAuthState(isAuthenticated: boolean) {
  window.localStorage.setItem(AUTH_STATE_KEY, isAuthenticated ? "true" : "false");
  const authLinks = document.querySelectorAll('a[data-auth-link="true"]');
  authLinks.forEach((link) => {
    if (!(link instanceof HTMLAnchorElement)) return;
    link.href = isAuthenticated ? "/secret" : "/login";
    link.textContent = isAuthenticated ? "Secret" : "Login";
  });
}

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
  setVisible(authApp as HTMLElement, false);
  setVisible(errorState as HTMLElement, true);
  if (errorDetails) {
    errorDetails.textContent = message;
  }
}

function formatDisplayValue(value: string | undefined) {
  if (!value || value.trim().length === 0) return "Not provided";
  return value;
}

function renderProfile(user: User) {
  if (!profileContainer) return;

  const name = formatDisplayValue(user.name ?? user.nickname);
  const email = formatDisplayValue(user.email);
  const picture = user.picture ?? "";

  profileContainer.innerHTML = `
    <div class="flex items-center gap-4">
      ${
        picture
          ? `<img src="${picture}" alt="${name}" class="h-14 w-14 rounded-xl border border-white/10 object-cover" loading="lazy" />`
          : `<div class="grid h-14 w-14 place-items-center rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white/75">${name
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((segment) => segment[0]?.toUpperCase() ?? "")
              .join("")}</div>`
      }
      <div>
        <p class="text-sm font-semibold text-white/90">${name}</p>
        <p class="text-sm text-white/60">${email}</p>
      </div>
    </div>
  `;
}

async function updateUi() {
  if (!auth0Client) return;

  const isAuthenticated = await auth0Client.isAuthenticated();
  setVisible(loadingState as HTMLElement, false);
  setVisible(errorState as HTMLElement, false);
  setVisible(authApp as HTMLElement, true);
  setVisible(loggedOutSection as HTMLElement, !isAuthenticated);
  setVisible(loggedInSection as HTMLElement, isAuthenticated);

  if (isAuthenticated) {
    setAuthState(true);
    const user = await auth0Client.getUser();
    if (user) renderProfile(user);
    return;
  }

  setAuthState(false);
}

async function handleLogin() {
  if (!auth0Client) return;
  await auth0Client.loginWithRedirect({
    authorizationParams: {
      redirect_uri: `${window.location.origin}/login/`,
    },
  });
}

async function handleLogout() {
  if (!auth0Client) return;
  setAuthState(false);
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
      const { appState } = await auth0Client.handleRedirectCallback();
      const returnTo = typeof appState?.returnTo === "string" ? appState.returnTo : "/login/";
      if (returnTo !== "/login/") {
        window.location.replace(returnTo);
        return;
      }
      window.history.replaceState({}, document.title, "/login/");
    } else {
      try {
        await auth0Client.checkSession();
      } catch {
        // checkSession fails when not logged in; this is expected.
      }
    }

    await updateUi();
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
