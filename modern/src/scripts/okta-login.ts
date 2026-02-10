type OktaSignInWidget = {
  token: {
    hasTokensInUrl(): boolean;
    parseTokensFromUrl(
      success: (res: any[]) => void,
      error: (err: unknown) => void
    ): void;
  };
  tokenManager: {
    add(key: string, token: any): void;
    clear(): void;
  };
  session: {
    get(cb: (res: { status: string; login?: string }) => void): void;
  };
  renderEl(
    opts: { el: string },
    success: (res: unknown) => void,
    error: (err: unknown) => void
  ): void;
  remove(): void;
};

declare global {
  interface Window {
    OktaSignIn?: new (config: Record<string, unknown>) => OktaSignInWidget;
  }
}

function setMessage(text: string) {
  const messageBox = document.getElementById("messageBox");
  if (messageBox) messageBox.textContent = text;
}

function errorHelp(baseUrl: string) {
  const origin = window.location.origin;
  return [
    "If this fails on the live site, Okta usually needs:",
    `- Redirect URI: ${origin}/login/`,
    `- Trusted Origin (CORS + Redirect): ${origin}`,
    `Okta org: ${baseUrl}`,
  ].join("\n");
}

function getOktaConfig(container: HTMLElement) {
  const baseUrl = container.dataset.oktaBaseUrl;
  const issuer = container.dataset.oktaIssuer;
  const clientId = container.dataset.oktaClientId;
  const logo = container.dataset.oktaLogo;
  const brandName = container.dataset.oktaBrandName;

  if (!baseUrl || !issuer || !clientId) {
    throw new Error("Missing Okta configuration on #okta-login-container.");
  }

  const redirectUri = `${window.location.origin}/login/`;

  return { baseUrl, issuer, clientId, redirectUri, logo, brandName };
}

async function waitForOktaSignIn(timeoutMs = 8000) {
  const start = Date.now();
  while (!window.OktaSignIn) {
    if (Date.now() - start > timeoutMs) return false;
    await new Promise((r) => setTimeout(r, 50));
  }
  return true;
}

function wireLogout(oktaBaseUrl: string, widget: OktaSignInWidget) {
  const logoutButton = document.getElementById("logout-button");
  if (!logoutButton) return;

  logoutButton.addEventListener("click", (event) => {
    event.preventDefault();

    try {
      widget.tokenManager.clear();
    } catch {
      // ignore
    }

    const signoutWindow = window.open(
      `${oktaBaseUrl}/login/signout`,
      "okta-signout",
      "height=1,width=1"
    );

    setTimeout(() => {
      if (signoutWindow) signoutWindow.close();
      window.location.href = "/";
    }, 1500);
  });
}

async function init() {
  const container = document.getElementById("okta-login-container");
  if (!container) return;

  window.addEventListener("unhandledrejection", (event) => {
    const reason = (event as PromiseRejectionEvent).reason;
    const msg = reason instanceof Error ? reason.message : String(reason);
    setMessage(`Unexpected error: ${msg}`);
  });

  const ok = await waitForOktaSignIn();
  if (!ok || !window.OktaSignIn) {
    setMessage("Okta widget failed to load. Check your network and refresh.");
    return;
  }

  let config: ReturnType<typeof getOktaConfig>;
  try {
    config = getOktaConfig(container);
  } catch (err) {
    setMessage(err instanceof Error ? err.message : "Invalid Okta configuration.");
    return;
  }

  const oktaSignIn = new window.OktaSignIn({
    features: {
      registration: true,
      router: true,
    },
    baseUrl: config.baseUrl,
    logo: config.logo,
    brandName: config.brandName,
    clientId: config.clientId,
    redirectUri: config.redirectUri,
    i18n: {
      en: {
        "primaryauth.title": "Sign in",
        "primaryauth.username.placeholder": "your@email.com",
        "primaryauth.username.tooltip": "Username must be Email",
      },
    },
    authParams: {
      issuer: config.issuer,
      responseType: ["token", "id_token"],
      display: "page",
    },
    colors: {
      brand: "#495057",
    },
  });

  wireLogout(config.baseUrl, oktaSignIn);

  if (oktaSignIn.token.hasTokensInUrl()) {
    oktaSignIn.token.parseTokensFromUrl(
      (res) => {
        const accessToken = res[0];
        const idToken = res[1];

        oktaSignIn.tokenManager.add("accessToken", accessToken);
        oktaSignIn.tokenManager.add("idToken", idToken);

        window.location.hash = "";
        const email = idToken?.claims?.email ?? "you";
        setMessage(`Hello, ${email}! You are logged in.`);
      },
      (err) => {
        console.error(err);
        setMessage(`Sign-in failed. See console for details.\n\n${errorHelp(config.baseUrl)}`);
      }
    );
    return;
  }

  oktaSignIn.session.get((res) => {
    if (res.status === "ACTIVE" && res.login) {
      setMessage(`Hello, ${res.login}! You are logged in.`);
      return;
    }

    oktaSignIn.renderEl(
      { el: "#okta-login-container" },
      () => {},
      (err) => {
        console.error(err);
        setMessage(
          `Unable to render Okta widget. See console for details.\n\n${errorHelp(config.baseUrl)}`
        );
      }
    );
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  void init();
}
