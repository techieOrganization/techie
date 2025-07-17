'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { fetchPosts, deletePost } from '@/app/api/postAPI';
import { RootState } from '@/redux/store';
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
  const userState = useSelector((state: RootState) => state.user);
  const currentUser = userState.userInfo;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 현재 사용자가 게시글 작성자인지 확인
  const isAuthor = currentUser && post && currentUser.email === post.email;

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
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      await deletePost(params.id);
      alert('게시글이 삭제되었습니다.');
      router.push('/posts');
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      alert('게시글을 삭제하는 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="posts_container post_detail">
        <div className="inner">
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '2rem', color: '#667eea', marginBottom: '1rem' }}>📖</div>
            <p style={{ fontSize: '1.6rem', color: '#495057' }}>게시글을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="posts_container post_detail">
        <div className="inner">
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '2rem', color: '#ff6b6b', marginBottom: '1rem' }}>⚠️</div>
            <p style={{ fontSize: '1.6rem', color: '#495057' }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="posts_container post_detail">
      <div className="inner">
        <div className="post_header">
          <h2 className="section_title">{post?.title}</h2>
          <div className="post_meta">
            <span className="category">{post?.category === 'FREE' ? '자유게시판' : '질문게시판'}</span>
            <span className="author">작성자: {post?.nickname}</span>
            <span className="date">
              {post?.writtenAt ? new Date(post.writtenAt).toLocaleDateString() : '-'}
            </span>
          </div>
        </div>

        <div className="post_content">
          <p>{post?.content}</p>
        </div>

        <div className="post_actions">
          {isAuthor && (
            <>
              <button className="edit_btn" onClick={() => router.push(`/posts/${params.id}/edit`)}>
                수정
              </button>
              <button className="delete_btn" onClick={handleDelete}>
                삭제
              </button>
            </>
          )}
          <button className="list_btn" onClick={() => router.push('/posts')}>
            목록으로
          </button>
        </div>
      </div>
    </div>
  );
}
