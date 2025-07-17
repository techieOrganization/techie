'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPost } from '@/app/api/postAPI';
import { AxiosError } from 'axios';
import '@/styles/pages/post/post.scss';

interface NewPost {
  title: string;
  content: string;
  category: 'FREE' | 'QNA';
}

export default function PostForm() {
  const router = useRouter();
  const [newPost, setNewPost] = useState<NewPost>({ title: '', content: '', category: 'FREE' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await createPost(newPost);

      alert('게시글이 작성되었습니다.');
      router.push('/posts');
    } catch (error) {
      console.error('게시글 작성 중 오류 발생:', error);

      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
          router.push('/login');
        }
      } else {
        console.error('알 수 없는 오류 발생:', error);
      }

      alert('게시글 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="posts_container new_post">
      <div className="inner">
        <h2 className="section_title">새 글 작성</h2>
        
        <div className="form_group">
          <label>카테고리</label>
          <select
            value={newPost.category}
            onChange={(e) => setNewPost({ ...newPost, category: e.target.value as 'FREE' | 'QNA' })}
          >
            <option value="FREE">자유게시판</option>
            <option value="QNA">질문게시판</option>
          </select>
        </div>

        <div className="form_group">
          <label>제목</label>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
        </div>

        <div className="form_group">
          <label>내용</label>
          <textarea
            placeholder="내용을 입력하세요"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          />
        </div>

        <div className="button_group">
          <button className="submit_btn" onClick={handleSubmit} disabled={loading}>
            {loading ? '작성 중...' : '작성하기'}
          </button>
          <button className="cancel_btn" onClick={() => router.back()} disabled={loading}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
