import { requestData, BASE_URL } from "./_config";

const url = `${BASE_URL}/jobs`;

export class JobService {
    static async getAllJobs() {
        return await requestData(`${url}`, 'GET');
    }

    static async getRecommendedJobs(userId) {
        return await requestData(`${url}/get-recommended?id=${userId}`, 'GET');
    }

    static async getJobById(id) {
        return await requestData(`${url}/get-by-id?id=${id}`, 'GET');
    }

    static async getJobSkills(id) {
        return await requestData(`${url}/get-job-skills?id=${id}`, 'GET');
    }

    static async getJobsByEmployer(id) {
        return await requestData(`${url}/get-by-employer?id=${id}`, 'GET');
    }

    static async getSavedJobsByUser(id) {
        return await requestData(`${url}/get-all-saved-jobs-by-user?id=${id}`, 'GET');
    }

    static async getSavedJobByUserJob(userId, jobId) {
        return await requestData(
            `${url}/get-saved-job-by-user-job?userId=${userId}&jobId=${jobId}`,
            'GET'
        );
    }

    static async createJob(job) {
        return await requestData(`${url}/create`, 'POST', undefined, job);
    }

    static async createJobSkill(jobSkill) {
        return await requestData(`${url}/create-job-skill`, 'POST', undefined, jobSkill);
    }

    static async saveJob(userId, jobId) {
        return await requestData(`${url}/save-job?userId=${userId}&jobId=${jobId}`, 'POST');
    }

    static async updateJob(job) {
        return await requestData(`${url}/update`, 'PATCH', undefined, job);
    }

    static async deleteJob(id) {
        return await requestData(`${url}/delete?id=${id}`, 'DELETE');
    }
}
