'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/components/axios/apiClient';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface Post {
  id: number;
  title: string;
  category: 'FREE' | 'QNA';
  writtenAt: string;
}

export default function MyPostsSection() {
  const router = useRouter();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const response = await apiClient.get(`/post/my?page=${currentPage}`);
        setPosts(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
        setError('게시글을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchMyPosts();
    }
  }, [userInfo, currentPage]);

  if (!userInfo) return <p>로그인이 필요합니다.</p>;
  if (loading) return <p>게시글을 불러오는 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="my_posts_section">
      <h3>내가 쓴 글 모음</h3>
      {posts.length > 0 ? (
        <>
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
              {posts.map((post, index) => (
                <tr key={post.id}>
                  <td>{index + 1 + currentPage * 20}</td>
                  <td
                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                    onClick={() => router.push(`/posts/${post.id}`)}
                  >
                    {post.title}
                  </td>
                  <td>{post.category === 'FREE' ? '자유게시판' : '질문게시판'}</td>
                  <td>{new Date(post.writtenAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
            >
              이전
            </button>
            <span>
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev))}
              disabled={currentPage === totalPages - 1}
            >
              다음
            </button>
          </div>
        </>
      ) : (
        <p>작성한 게시글이 없습니다.</p>
      )}
    </div>
  );
}
