import { IApp } from "src/models/IApp";
import HttpClient from "./HttpClient";

export class UserService {
  static async login(token) {
    localStorage.setItem("token", token);
  }

  static async logout() {
    await HttpClient().post("/api/auth/logout");
  }

  static async removeApp(appId) {
    await HttpClient().delete("/api/apps/" + appId);
  }

  static async getApp(clientId: string): Promise<IApp | string | undefined> {
    try {
      const { data } = await HttpClient().get(
        "/api/auth/getAppData?clientId=" + clientId
      );

      const app: IApp = data.app ?? undefined;
      return app;
    } catch (error) {
      if (error.response.status === 400) {
        return error.response.data.error;
      }

      return undefined;
    }
  }

  static async getMyApps() {
    try {
      const { data } = await HttpClient().get("/api/apps/my");

      return { apps: data.apps };
    } catch (error) {
      if (error.response.status === 400) {
        return { error: error.response.data.error };
      }
    }

    return undefined;
  }

  static async getApps() {
    try {
      const { data } = await HttpClient().get("/api/apps");

      return { apps: data.apps };
    } catch (error) {
      if (error.response.status === 400) {
        return { error: error.response.data.error };
      }
    }

    return undefined;
  }
}
