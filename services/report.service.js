import { requestData, BASE_URL } from "./_config";

const url = `${BASE_URL}/reports`;

export class ReportService {
    static async getHighestEducationCounts() {
        return await requestData(`${url}/highest-education`, "GET");
    }

    static async getGenderCounts() {
        return await requestData(`${url}/genders`, "GET");
    }

    static async getPlacementCounts() {
        return await requestData(`${url}/placements`, "GET");
    }

    static async getEmployerTypesCounts() {
        return await requestData(`${url}/employer-types`, "GET");
    }

    static async getClienteleCounts() {
        return await requestData(`${url}/clientele`, "GET");
    }

    static async getCitmunCounts() {
        return await requestData(`${url}/citmun`, "GET");
    }
}
