import { requestData, BASE_URL } from "./_config";
const url = `${BASE_URL}/auth`
export class AuthService {
    static async login(credentials) {
        return await requestData(
            `${url}/login`,
            'POST',
            undefined,
            credentials
        )
    }

    static async register(credentials) {
        return await requestData(
            `${url}/register`,
            'POST',
            undefined,
            credentials
        )
    }

    static async resetPassword({ email, token, newPassword }) {
        return await requestData(
            `${url}/reset-password`,
            'POST',
            undefined,
            { email, token, newPassword }
        )
    }
}