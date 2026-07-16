import CryptoJS from "crypto-js";

const SECRET = "SHOP_SECRET";

export const decryptData = (data) => {
  const bytes = CryptoJS.AES.decrypt(data, SECRET);

  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};