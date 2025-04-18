import axios from "axios";

export const createClient = (xpub: string) => {
  return axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
      "xpub": xpub,
    },
  });
};