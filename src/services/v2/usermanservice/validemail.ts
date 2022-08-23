import api from "../../../utils/api";
import { usermanService } from "../constant";


const basePath = `${usermanService}`;

const emailVerify = async (): Promise<any> => {
    const response = await api.get(`${basePath}/public/verifikasi-email`);
    // console.log(response.data.return);
    return response.data.return;
};


const tokenVerify = async (token): Promise<any> => {
    const response = await api.get(`${basePath}/public/verify?token=${token}`);
    // console.log(response.data.return);
    return response.data.return;
};

const gantiEmail = async (uuid, params): Promise<any> => {
    const response = await api.put(`${basePath}/management-user/edit-user/${uuid}`, params);
    // console.log(response.data.return);
    return response.data.return;
};

const gantiPassword = async (password_baru, password_lama): Promise<any> => {
    const response = await api.put(`${basePath}/ganti-password`, {
        password_baru: password_baru,
        password_lama: password_lama
    });
    // console.log(response.data.return);
    return response.data.return;
};

const gantiPasswordWithToken = async (token, password_baru, password_lama): Promise<any> => {
    const response = await api.put(`${basePath}/public/ganti-password?token=${token}`, {
        password_baru: password_baru,
        password_lama: password_lama
    });
    // console.log(response.data.return);
    return response.data.return;
};
export {
    emailVerify, 
    gantiEmail,
    tokenVerify,
    gantiPassword,
    gantiPasswordWithToken
}