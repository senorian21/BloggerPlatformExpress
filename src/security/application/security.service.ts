import {jwtService} from "../../auth/adapters/jwt.service";
import {ResultStatus} from "../../core/result/resultCode";
import {RefreshToken} from "../../auth/types/tokens";
import {authRepositories} from "../../auth/repositories/auth.Repository";
import {session} from "../../auth/types/session";



export const securityService = {
  async deleteSessionsByDeviceId(
      refreshToken: string,
      deleteDeviceId: string
  ){
    // Проверяем refreshToken
    const payload = (await jwtService.verifyRefreshToken(refreshToken)) as RefreshToken;

    if (!payload) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: "Invalid refresh token",
        data: null,
        extensions: [],
      };
    }

    // Извлекаем userId из payload
    const { userId } = payload;

    // Вызываем репозиторий для удаления сессии
    const deleted = await authRepositories.deleteSessionByDeviceId(userId, deleteDeviceId);

    if (!deleted) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "Session not found",
        data: null,
        extensions: [],
      };
    }

    return {
      status: ResultStatus.Success,
      errorMessage: "",
      data: null,
      extensions: [],
    };
  },
};
