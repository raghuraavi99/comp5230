import axios from "axios";

export const register = (payload) => {
  console.log(payload);
  return axios.post(`${process.env.REACT_APP_NOTES_API_URL}/auth/register`, {
    ...payload,
  });
};

export const login = (payload) => {
  console.log(payload);
  return axios.post(`${process.env.REACT_APP_NOTES_API_URL}/auth/login`, {
    ...payload,
  });
};
