import { requestData, BASE_URL } from "./_config";

const url = `${BASE_URL}/users`;

export class UserService {
    /* ===========================
       🔹 GET REQUESTS
    ============================ */
    static async getAllUsers() {
        return await requestData(`${url}`, "GET");
    }

    static async getUserById(id) {
        return await requestData(`${url}/get-by-id?id=${id}`, "GET");
    }

    static async getUserByRole(role) {
        return await requestData(`${url}/get-by-role?role=${role}`, "GET");
    }

    static async getUserProfileStrength(id) {
        const profileStrength = await requestData(`${url}/get-profile-strength?id=${id}`, "GET");
        return Number(profileStrength);
    }

    static async getUserCredential(id) {
        return await requestData(`${url}/get-credentials?id=${id}`, "GET");
    }

    static async getUserPersonalInformation(id) {
        return await requestData(`${url}/get-personal-information?id=${id}`, "GET");
    }

    static async getUserJobReference(id) {
        return await requestData(`${url}/get-job-reference?id=${id}`, "GET");
    }

    static async getUserLanguageProfeciency(id) {
        return await requestData(`${url}/get-language-profeciency?id=${id}`, "GET");
    }

    static async getUserEducationalBackground(id) {
        return await requestData(`${url}/get-educational-background?id=${id}`, "GET");
    }

    static async getUserTechVocTrainings(id) {
        return await requestData(`${url}/get-tech-voc-trainings?id=${id}`, "GET");
    }

    static async getUserEligibility(id) {
        return await requestData(`${url}/get-eligibility?id=${id}`, "GET");
    }

    static async getUserProfLicense(id) {
        return await requestData(`${url}/get-prof-license?id=${id}`, "GET");
    }

    static async getUserWorkExperience(id) {
        return await requestData(`${url}/get-work-experience?id=${id}`, "GET");
    }

    static async getUserOtherSkills(id) {
        return await requestData(`${url}/get-other-skills?id=${id}`, "GET");
    }

    /* ===========================
       🔹 CREATE REQUESTS
    ============================ */
    static async createPersonalInformation(personalInfo) {
        return await requestData(`${url}/create-personal-info`, "POST", undefined, personalInfo);
    }

    static async createJobReference(jobRef) {
        return await requestData(`${url}/create-job-ref`, "POST", undefined, jobRef);
    }

    static async createLanguageProfeciency(languageProf) {
        return await requestData(`${url}/create-language-prof`, "POST", undefined, languageProf);
    }

    static async createEducationalBackground(edBg) {
        return await requestData(`${url}/create-educ-bg`, "POST", undefined, edBg);
    }

    static async createTechVocTraining(techVoc) {
        return await requestData(`${url}/create-techvoc-training`, "POST", undefined, techVoc);
    }

    static async createEligibility(eligibility) {
        return await requestData(`${url}/create-eligibility`, "POST", undefined, eligibility);
    }

    static async createProfessionalLicense(prc) {
        return await requestData(`${url}/create-prof-license`, "POST", undefined, prc);
    }

    static async createWorkExperience(workExp) {
        return await requestData(`${url}/create-work-exp`, "POST", undefined, workExp);
    }

    static async createOtherSkill(otherSkill) {
        return await requestData(`${url}/create-other-skill`, "POST", undefined, otherSkill);
    }

    /* ===========================
       🔹 UPDATE REQUESTS
    ============================ */
    static async updateUserCredential(user) {
        return await requestData(`${url}/update-credential`, "PATCH", undefined, user);
    }

    static async updateUserPersonalInformation(user) {
        return await requestData(`${url}/update-personal-info`, "PATCH", undefined, user);
    }

    static async updateUserJobReference(user) {
        return await requestData(`${url}/update-job-ref`, "PATCH", undefined, user);
    }

    static async updateUserLanguageProficiency(user) {
        return await requestData(`${url}/update-language`, "PATCH", undefined, user);
    }

    static async updateUserTechVocTraining(user) {
        return await requestData(`${url}/update-techvoc-training`, "PATCH", undefined, user);
    }

    static async updateUserEligibility(user) {
        return await requestData(`${url}/update-eligibility`, "PATCH", undefined, user);
    }

    static async updateUserProfessionalLicense(user) {
        return await requestData(`${url}/update-prof-license`, "PATCH", undefined, user);
    }

    static async updateUserWorkExperience(user) {
        return await requestData(`${url}/update-work-exp`, "PATCH", undefined, user);
    }

    /* ===========================
       🔹 DEACTIVATE
    ============================ */
    static async deactivateUser(id) {
        return await requestData(`${url}/deactivate?id=${id}`, "PATCH");
    }
}
