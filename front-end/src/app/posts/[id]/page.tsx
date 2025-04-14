'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchPosts, deletePost } from '@/app/api/postAPI';
import '@/styles/pages/post/post.scss';

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
        let foundPost = null;
        const categories = ['FREE', 'QNA'];
        for (const category of categories) {
          const data = await fetchPosts(category, '', 0);
          foundPost = data.content.find((post: Post) => post.id.toString() === params.id);
          if (foundPost) break;
        }
        if (!foundPost) {
          throw new Error(`게시글 ${params.id}을 찾을 수 없습니다.`);
        }
        setPost(foundPost);
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
        setError('게시글을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

  const handleDelete = async () => {
    try {
      await deletePost(params.id);
      alert('게시글이 삭제되었습니다.');
      router.push('/posts');
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      alert('게시글을 삭제하는 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <p>게시글을 불러오는 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="posts_container post_detail">
      <div className="inner">
        <h2>{post?.title}</h2>
        <p>카테고리: {post?.category === 'FREE' ? '자유게시판' : '질문게시판'}</p>
        <p>
          작성자: {post?.nickname} ({post?.email})
        </p>
        <p>작성일: {post?.writtenAt ? new Date(post.writtenAt).toLocaleString() : '-'}</p>
        <p>{post?.content}</p>

        <button onClick={() => router.push(`/posts/${params.id}/edit`)}>수정</button>
        <button onClick={handleDelete}>삭제</button>
        <button onClick={() => router.push('/posts')}>목록으로</button>
      </div>
    </div>
  );
}
