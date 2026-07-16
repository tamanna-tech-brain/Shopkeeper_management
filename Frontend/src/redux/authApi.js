import API from "../apis/api";

export const loginAPI = async (data) => {
    const res = await API.post("/user/login", data);
    return res.data;
};

export const registerAPI = async (data) => {
    const res = await API.post("/user/register", data);
    return res.data;
};