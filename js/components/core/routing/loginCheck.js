import { AJAX } from "../ajax/ajax.js";

export const loginCheck = async () => {
   return await AJAX("http://localhost:8080/api/v1/auth/verify/", "GET")
        .then((res) => res.json())
        .catch((err) => null);
};
