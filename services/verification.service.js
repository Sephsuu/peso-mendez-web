import { requestData, BASE_URL } from "./_config";

const url = `${BASE_URL}/verifications`;

export class VerificationService {

    static async getVerificationsByRole(role) {
        return await requestData(`${url}?role=${role}`, 'GET');
    }

    static async getVerificationByUser(id) {
        return await requestData(`${url}/get-by-user?id=${id}`, 'GET');
    }

    static async uploadDocuments(file, role) {
        try {
            const uploadUrl = `${BASE_URL}/uploads/${role}`;
            const formData = new FormData();

            // Append file to formData
            formData.append("file", file);

            const response = await fetch(uploadUrl, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed with code ${response.status}`);
            }

            const jsonRes = await response.json();
            return jsonRes;
        } catch (error) {
            throw new Error(`UploadService error: ${error}`);
        }
    }

    static async createVerification(data) {
        return await requestData(`${url}/create`, "POST", undefined, data);
    }

    static async updateVerificationStatus(id, status) {
        return await requestData(
            `${url}/update-status?id=${id}&status=${status}`,
            "PATCH"
        );
    }
}
