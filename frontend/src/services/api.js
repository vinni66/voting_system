import axios from 'axios';

const API = axios.create({ baseURL: 'https://voting-system-ebon-xi.vercel.app/api' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `${localStorage.getItem('token')}`;
  }
  return req;
});

// Auth
export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);

// Candidates
export const getCandidates = () => API.get('/candidates');
export const addCandidate = (candidateData) => API.post('/candidates', candidateData);
export const updateCandidate = (id, updatedData) => API.put(`/candidates/${id}`, updatedData);
export const deleteCandidate = (id) => API.delete(`/candidates/${id}`);

// Voting
export const vote = (candidateId) => API.post(`/vote/${candidateId}`);
export const getResults = () => API.get('/vote/results');
export const getVoteStatus = () => API.get('/vote/status');
export const resetVotes = () => API.post('/vote/reset');
export const declareWinner = () => API.post('/vote/declare-winner');

// Users (Admin)
export const getUsers = () => API.get('/users');
