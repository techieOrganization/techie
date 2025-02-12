import apiClient from '@/components/axios/apiClient';

export const fetchPosts = async (category: string, query: string, page: number) => {
  try {
    const apiUrl = query
      ? `/post?category=${category}&query=${query}&page=${page}`
      : `/post/category/${category}?page=${page}`;

    const response = await apiClient.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error('게시글을 불러오는 중 오류 발생:', error);
    throw error;
  }
};

export const fetchPostDetail = async (id: string) => {
  try {
    const response = await apiClient.get(`/post/${id}`);
    return response.data;
  } catch (error) {
    console.error(`게시글 ${id} 불러오기 실패:`, error);
    throw error;
  }
};

export const createPost = async (newPost: { title: string; content: string; category: 'FREE' | 'QNA' }) => {
  try {
    const response = await apiClient.post('/post', newPost);
    return response.data;
  } catch (error) {
    console.error('게시글 작성 중 오류 발생:', error);
    throw error;
  }
};