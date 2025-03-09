import apiClient from '@/components/axios/apiClient';

// 게시글 목록 조회
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

// 게시글 단건 조회
export const fetchPostDetail = async (id: string) => {
  try {
    console.log(`Fetching post detail for ID: ${id}`);
    const response = await apiClient.get(`/post/${id}`);
    console.log(`Fetched post detail: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    console.error(`게시글 ${id} 불러오기 실패:`, error);
    throw error;
  }
};

// 게시글 작성
export const createPost = async (newPost: {
  title: string;
  content: string;
  category: 'FREE' | 'QNA';
}) => {
  try {
    const response = await apiClient.post('/post', newPost);
    return response.data;
  } catch (error) {
    console.error('게시글 작성 중 오류 발생:', error);
    throw error;
  }
};

// 게시글 수정
export const updatePost = async (id: string, updatedPost: { title: string; content: string }) => {
  try {
    const response = await apiClient.put(`/post/${id}`, updatedPost);
    return response.data;
  } catch (error) {
    console.error(`게시글 ${id} 수정 실패:`, error);
    throw error;
  }
};

// 게시글 삭제
export const deletePost = async (id: string) => {
  try {
    await apiClient.delete('/post', { data: { postIds: [id] } });
  } catch (error) {
    console.error(`게시글 ${id} 삭제 실패:`, error);
    throw error;
  }
};