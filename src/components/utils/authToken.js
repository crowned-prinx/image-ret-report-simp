// utils/auth.js
import Cookies from "js-cookie";

export function setAuthToken(token) {
  // Set cookie for 7 days
  Cookies.set("auth_token", token, {
    expires: 7,
    secure: true,
    sameSite: "strict",
  });
}

export function getAuthToken() {
  return Cookies.get("auth_token") || null;
}
