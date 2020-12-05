import Cookies from "js-cookie";

const TOKEN_COOKIE_KEY = "stochastic-exchange-cookie-key";

export function setTokenInCookie(token: string | undefined) {
    if (token === undefined) {
        Cookies.remove(TOKEN_COOKIE_KEY);
    } else {
        Cookies.set(TOKEN_COOKIE_KEY, token, { expires: 3 });
    }
}

export function getTokenInCookie() {
    return Cookies.get(TOKEN_COOKIE_KEY);
}
