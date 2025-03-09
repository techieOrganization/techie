'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { fetchPosts } from '@/app/api/postAPI';
import '@/styles/pages/post/post.scss';

interface Post {
  id: number;
  title: string;
  nickname: string;
  writtenAt: string;
  category: 'FREE' | 'QNA';
}

export default function PostList() {
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.user.userInfo !== null);
  const [category, setCategory] = useState<'FREE' | 'QNA'>('FREE');
  const [query, setQuery] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const loadPosts = useCallback(async () => {
    try {
      const data = await fetchPosts(category, searchQuery, currentPage);
      setPosts(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('게시글 로딩 실패:', error);
    }
  }, [category, searchQuery, currentPage]);

  useEffect(() => {
    loadPosts();
  }, [category, searchQuery, currentPage, loadPosts]);

  const handleSearch = () => {
    setSearchQuery(query);
    setCurrentPage(0);
  };

  const handleNewPost = () => {
    if (!isLoggedIn) {
      alert('로그인 후 시도하세요');
      return;
    }
    router.push('/posts/new');
  };

  return (
    <div className="posts_container">
      <div className="inner">
        <h2 className="section_title">커뮤니티 게시판</h2>

        <div className="tab_menu">
          <button
            onClick={() => {
              setCategory('FREE');
              setSearchQuery('');
              setCurrentPage(0);
            }}
            className={category === 'FREE' ? 'active' : ''}
          >
            자유게시판
          </button>
          <button
            onClick={() => {
              setCategory('QNA');
              setSearchQuery('');
              setCurrentPage(0);
            }}
            className={category === 'QNA' ? 'active' : ''}
          >
            질문게시판
          </button>
        </div>

        <div className="search_bar">
          <input
            type="text"
            placeholder="검색어 입력"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}>검색</button>
        </div>

        <button onClick={handleNewPost}>새 글 작성</button>

        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <tr key={index}>
                  <td>{index + 1 + currentPage * 20}</td>
                  <td onClick={() => router.push(`/posts/${post.id}`)}>{post.title}</td>
                  <td onClick={() => router.push(`/posts/nickname/${post.nickname}`)}>
                    {post.nickname}
                  </td>
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
      </div>
    </div>
  );
}
