// services/noteService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/notes';

const createNote = async (noteData) => {
  const response = await axios.post(API_URL, noteData);
  return response.data;
};

const getNotes = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const updateNote = async (id, noteData) => {
  const response = await axios.patch(`${API_URL}/${id}`, noteData);
  return response.data;
};

const deleteNote = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export default {
    createNote,
    getNotes,
    updateNote,
    deleteNote
};
