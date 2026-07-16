import CryptoJS from "crypto-js";

const SECRET = "SHOP_SECRET";

export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    SECRET
  ).toString();
};