import { requestData, BASE_URL } from "./_config";

const url = `${BASE_URL}/applications`;

export class ApplicationService {
    static async getApplicationByJobAndUser(jobId, userId) {
        return await requestData(
            `${url}/get-by-job-user?jobId=${jobId}&userId=${userId}`,
            'GET'
        );
    }

    static async getApplicationsByEmployer(id) {
        return await requestData(
            `${url}/get-by-employer?id=${id}`,
            'GET'
        );
    }

    static async getApplicationsByUser(id) {
        return await requestData(
            `${url}/get-by-user?id=${id}`,
            'GET'
        );
    }

    static async createApplication(jobId, userId) {
        return await requestData(
            `${url}/create?jobId=${jobId}&userId=${userId}`,
            'POST'
        );
    }

    static async updateApplicationStatus(id, status) {
        return await requestData(
            `${url}/update-status?id=${id}&status=${status}`,
            'PATCH'
        );
    }

    static async deleteApplicationByJobUser(jobId, userId) {
        return await requestData(
            `${url}/delete-by-job-user?jobId=${jobId}&userId=${userId}`,
            'DELETE'
        );
    }
}
