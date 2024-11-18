import axios from 'axios';

interface MemoPayload {
  title: string;
  content: string;
  noteTime: string;
  videoId: string;
}

export const saveMemo = (payload: MemoPayload) => {
  return axios.post('/api/memo', payload);
};

export const updateMemo = (memoId: string, payload: { noteTime: string; content: string }) => {
  return axios.put(`/api/memo/${memoId}`, payload);
};

export const deleteMemo = (memoId: string) => {
  return axios.delete(`/api/memo/${memoId}`);
};

export const getMemo = (memoId: string) => {
  return axios.get(`/api/memo/${memoId}`);
};

export const getAllMemos = () => {
  return axios.get('/api/memos');
};
