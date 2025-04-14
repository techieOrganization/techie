'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updatePost } from '@/app/api/postAPI';
import '@/styles/pages/post/post.scss';

export default function EditPost({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [post, setPost] = useState({
    title: '',
    content: '',
    category: 'FREE',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await apiClient.get(`/post/${params.id}`);
        setPost(response.data);
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
        alert('게시글을 불러오지 못했습니다.');
        router.back();
      }
    };

    fetchPost();
  }, [params.id, router]);

  const handleUpdate = async () => {
    if (!title || !content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      await updatePost(params.id, { title, content });
      alert('게시글이 수정되었습니다.');
      router.push(`/posts/${params.id}`);
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      alert('게시글을 수정하는 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="posts_container new_post">
      <div className="inner">
        <h2>게시글 수정</h2>
        <label htmlFor="title">제목</label>
        <input
          id="title"
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="content">내용</label>
        <textarea
          id="content"
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="button_group">
          <button onClick={handleUpdate}>수정</button>
          <button onClick={() => router.push(`/posts/${params.id}`)}>취소</button>
        </div>
      </div>
    </div>
  );
}
