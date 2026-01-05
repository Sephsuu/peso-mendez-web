import { requestData, BASE_URL } from "./_config";

const url = `${BASE_URL}/announcements`;

export class AnnouncementService {
    static async getAllAnnouncements() {
        return await requestData(`${url}`, "GET");
    }

    static async createAnnouncement(announcement) {
        return await requestData(`${url}/create`, "POST", undefined, announcement);
    }

    static async getAnnouncementsByRole(role) {
        return await requestData(`${url}/get-by-audience?role=${role}`, "GET");
    }
}
