'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
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

export default function UserPosts() {
  const router = useRouter();
  const { nickname } = useParams();
  const decodedNickname = decodeURIComponent(nickname as string);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await apiClient.get(`/post/nickname/${decodedNickname}`);
        setPosts(response.data.content);
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
        setError('게시글을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [decodedNickname]);

  if (loading) return <p>게시글을 불러오는 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="posts_container">
      <div className="inner">
        <h2>{decodedNickname} 님의 게시글</h2>
        <button onClick={() => router.push('/posts')}>게시판으로 돌아가기</button>

        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>카테고리</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <tr key={post.id}>
                  <td>{index + 1}</td>
                  <td onClick={() => router.push(`/posts/${post.id}`)}>{post.title}</td>
                  <td>{post.category === 'FREE' ? '자유게시판' : '질문게시판'}</td>
                  <td>{new Date(post.writtenAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center' }}>
                  게시글이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
