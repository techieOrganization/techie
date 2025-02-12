'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/components/axios/apiClient';

export default function PostEdit({ params }: { params: { id: string } }) {
  const router = useRouter();
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
  }, [params.id]);

  const handleUpdate = async () => {
    if (!post.title.trim() || !post.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.put(`/post/${params.id}`, post);
      alert('게시글이 수정되었습니다.');
      router.push(`/posts/${params.id}`);
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      alert('게시글 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="posts_container">
      <div className="inner">
        <h2 className="section_title">게시글 수정</h2>
        <label>카테고리</label>
        <select
          value={post.category}
          onChange={(e) => setPost({ ...post, category: e.target.value })}
        >
          <option value="FREE">자유게시판</option>
          <option value="QNA">질문게시판</option>
        </select>
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
        />
        <textarea
          placeholder="내용을 입력하세요"
          value={post.content}
          onChange={(e) => setPost({ ...post, content: e.target.value })}
        />
        <button onClick={handleUpdate} disabled={loading}>
          {loading ? '수정 중...' : '수정 완료'}
        </button>
        <button onClick={() => router.back()} disabled={loading}>
          취소
        </button>
      </div>
    </div>
  );
}
