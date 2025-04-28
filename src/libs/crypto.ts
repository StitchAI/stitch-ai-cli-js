import CryptoJS from 'crypto-js';

import { AES_IV, AES_SALT, AES_SECRET } from '~/constants';

export const encrypt = (data: string) => {
  const salt = CryptoJS.enc.Hex.parse(AES_SALT);
  const key = CryptoJS.PBKDF2(AES_SECRET, salt, {
    keySize: 256 / 32,
    iterations: 1,
  });

  const hashedId = CryptoJS.AES.encrypt(data, key, {
    iv: CryptoJS.enc.Utf8.parse(AES_IV),
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();

  const base64HashedId = Buffer.from(hashedId).toString('base64');

  return base64HashedId;
};

export const decrypt = (data: string) => {
  const salt = CryptoJS.enc.Hex.parse(AES_SALT);
  const key = CryptoJS.PBKDF2(AES_SECRET, salt, {
    keySize: 256 / 32,
    iterations: 1,
  });

  const decodedData = Buffer.from(data, 'base64');

  const decrypted = CryptoJS.AES.decrypt(decodedData.toString(), key, {
    iv: CryptoJS.enc.Utf8.parse(AES_IV),
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};
