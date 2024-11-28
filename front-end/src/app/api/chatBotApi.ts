import axios from 'axios';
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
interface GptParams {
  request: string;
  token: string | undefined;
}

interface ApiResponse {
  request: string;
  response: string;
}

const fetchChatBot = async (params: GptParams): Promise<ApiResponse> => {
  try {
    const reponse = await axios.post(
      `${baseUrl}/api/gpt/qna`,
      {
        request: params.request,
      },
      {
        headers: {
          Authorization: `Bearer ${params.token}`,
        },
      },
    );

    return reponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('알 수 없는 오류가 발생했습니다.');
  }
};

export default fetchChatBot;
