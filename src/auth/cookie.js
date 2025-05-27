import { Cookies } from "react-cookie";

const cookies = new Cookies();

/**
 * 쿠키 설정 함수
 * @param {string} name - 쿠키 이름
 * @param {any} value - 저장할 값
 * @param {object} options - 설정 옵션 (path, maxAge 등)
 */
export const setCookie = (name, value, options = {}) => {
  return cookies.set(name, value, {
    path: "/",
    sameSite: "strict",
    secure: window.location.protocol === "https:",
    ...options,
  });
};

/**
 * 쿠키 가져오기
 * @param {string} name - 쿠키 이름
 */
export const getCookie = (name) => {
  return cookies.get(name);
};

/**
 * 쿠키 삭제
 * @param {string} name - 쿠키 이름
 */
export const removeCookie = (name) => {
  return cookies.remove(name, { path: "/" });
};
