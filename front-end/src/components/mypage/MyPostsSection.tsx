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

  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [displayedCount, setDisplayedCount] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const POSTS_PER_LOAD = 5;

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const response = await apiClient.get(`/post/my?page=${currentPage}`);
        const newPosts = response.data.content;
        setAllPosts((prev) => [...prev, ...newPosts]);

        // 더 보여줄 게시글이 있는지 확인
        setHasMore(currentPage < response.data.totalPages - 1);
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

  const handleLoadMore = async () => {
    if (!hasMore) return;

    setLoadingMore(true);
    setCurrentPage((prev) => prev + 1);
    setLoadingMore(false);
  };

  const handleShowMore = () => {
    setDisplayedCount((prev) => prev + POSTS_PER_LOAD);
  };

  // 현재 표시할 게시글들
  const displayedPosts = allPosts.slice(0, displayedCount);
  const canShowMore = displayedCount < allPosts.length;
  const showCompletionMessage = !hasMore && !canShowMore && allPosts.length > 0;

  if (!userInfo) {
    return (
      <div className="my_posts_section">
        <div className="error_state">
          <div className="icon">🔒</div>
          <p className="message">로그인이 필요합니다.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="my_posts_section">
        <div className="loading_state">
          <div className="icon">📝</div>
          <p className="message">게시글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my_posts_section">
        <div className="error_state">
          <div className="icon">⚠️</div>
          <p className="message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my_posts_section">
      <h2 className="section_title">내가 쓴 글 모음</h2>

      {displayedPosts.length > 0 ? (
        <>
          <div className="posts_list">
            {displayedPosts.map((post, index) => (
              <div
                key={post.id}
                className="post_item"
                onClick={() => router.push(`/posts/${post.id}`)}
              >
                <div className="post_header">
                  <h3 className="post_title">{post.title}</h3>
                  <span className="post_category">
                    {post.category === 'FREE' ? '자유게시판' : '질문게시판'}
                  </span>
                </div>
                <div className="post_meta">
                  <span className="post_number">#{index + 1}</span>
                  <span className="post_date">
                    {new Date(post.writtenAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="load_more_section">
            {canShowMore ? (
              <button className="load_more_btn" onClick={handleShowMore}>
                더보기
              </button>
            ) : hasMore ? (
              <button className="load_more_btn" onClick={handleLoadMore} disabled={loadingMore}>
                {loadingMore ? '불러오는 중...' : '더보기'}
              </button>
            ) : showCompletionMessage ? (
              <div className="completion_message">
                <div className="completion_icon">🎉</div>
                <p className="completion_title">모든 게시글을 확인했습니다!</p>
                <p className="completion_subtitle">
                  총 {allPosts.length}개의 게시글을 작성하셨네요.
                </p>
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <div className="empty_state">
          <div className="empty_icon">📝</div>
          <p className="empty_message">아직 작성한 게시글이 없습니다.</p>
          <button className="empty_button" onClick={() => router.push('/posts/new')}>
            첫 게시글 작성하기
          </button>
        </div>
      )}
    </div>
  );
}
