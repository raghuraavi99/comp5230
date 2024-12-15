import axios from "axios";

export const createNewNote = (payload) => {
  console.log(payload);

  const cleanedPayload = payload
    ? Object.entries(payload)
        .filter(([_, value]) => !!value)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {})
    : {};

  return axios.post(
    `${process.env.REACT_APP_NOTES_API_URL}/notes/create`,
    {
      ...cleanedPayload,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

export const forceDeleteNote = (noteId) => {
  return axios.delete(`${process.env.REACT_APP_NOTES_API_URL}/notes/${noteId}`);
};


export const getNote = (noteId) => {
  return axios.get(`${process.env.REACT_APP_NOTES_API_URL}/notes/${noteId}`);
};

export const getNoteStatus = (noteId) => {
  return axios.get(
    `${process.env.REACT_APP_NOTES_API_URL}/notes/exists/${noteId}`
  );
};
