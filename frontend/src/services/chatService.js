import axios from "axios";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:5001/api"}/chat`;

export const askQuestion = async (question) => {
  const response = await axios.post(API, {
    question,
  });

  return response.data;
};
