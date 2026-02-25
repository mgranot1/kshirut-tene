import cookie from "react-cookie";
import AxiosInstance from "../../shared/utils/axios.instance";

export default class AuthService {
  public static async getCSRFToken() {
    const res = await AxiosInstance.head(`userunit`, {
      headers: { "x-csrf-token": "fetch" },
    });

    cookie.save("X-CSRF-Token", res.headers["x-csrf-token"], { path: "/" });

    return res.headers["x-csrf-token"];
  }
}
