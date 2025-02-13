'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/components/axios/apiClient';

interface Post {
  id: number;
  title: string;
  content: string;
  category: 'FREE' | 'QNA';
  writtenAt: string;
  email: string;
  nickname: string;
}

export default function PostDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await apiClient.get(`/post/${params.id}`);
        setPost(response.data);
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
        setError('게시글을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

  if (loading) return <p>게시글을 불러오는 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="posts_container">
      <div className="inner">
        <h2>{post?.title}</h2>
        <p>카테고리: {post?.category === 'FREE' ? '자유게시판' : '질문게시판'}</p>
        <p>
          작성자: {post?.nickname} ({post?.email})
        </p>
        <p>작성일: {post?.writtenAt ? new Date(post.writtenAt).toLocaleString() : '-'}</p>
        <p>{post?.content}</p>

        <button onClick={() => router.push(`/posts/${params.id}/edit`)}>수정</button>
        <button onClick={() => router.push('/posts')}>목록으로</button>
      </div>
    </div>
  );
}
