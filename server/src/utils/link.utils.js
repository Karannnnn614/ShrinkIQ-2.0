import validUrl from "valid-url";
import { nanoid } from "nanoid";

export const generateShortUrl = (longUrl) => {
  const baseUrl = process.env.BASE_URL;
  const urlCode = nanoid();
  return `${baseUrl}/${urlCode}`;
};

export const isValidUrl = (url) => {
  return validUrl.isUri(url);
};
