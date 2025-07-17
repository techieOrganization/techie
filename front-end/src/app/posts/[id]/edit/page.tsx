'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { updatePost } from '@/app/api/postAPI';
import apiClient from '@/components/axios/apiClient';
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

export default function EditPost({ params }: { params: { id: string } }) {
  const router = useRouter();
  const userState = useSelector((state: RootState) => state.user);
  const currentUser = userState.userInfo;
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // 게시글 목록에서 해당 게시글 찾기
        let foundPost = null;
        const categories = ['FREE', 'QNA'];
        for (const category of categories) {
          const response = await apiClient.get(`/post/category/${category}?page=0`);
          foundPost = response.data.content.find((post: Post) => post.id.toString() === params.id);
          if (foundPost) break;
        }
        
        if (!foundPost) {
          throw new Error('게시글을 찾을 수 없습니다.');
        }

        // 현재 사용자가 게시글 작성자인지 확인
        if (currentUser && foundPost.email !== currentUser.email) {
          throw new Error('게시글을 수정할 권한이 없습니다.');
        }

        setPost(foundPost);
        setTitle(foundPost.title);
        setContent(foundPost.content);
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
        setError(error instanceof Error ? error.message : '게시글을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id, currentUser]);

  const handleUpdate = async () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    
    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      await updatePost(params.id, { title: title.trim(), content: content.trim() });
      alert('게시글이 수정되었습니다.');
      router.push(`/posts/${params.id}`);
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      alert('게시글을 수정하는 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = () => {
    if (title !== post?.title || content !== post?.content) {
      const shouldCancel = confirm('수정사항이 있습니다. 정말로 취소하시겠습니까?');
      if (!shouldCancel) return;
    }
    router.push(`/posts/${params.id}`);
  };

  if (loading) {
    return (
      <div className="posts_container new_post">
        <div className="inner">
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '2rem', color: '#667eea', marginBottom: '1rem' }}>📝</div>
            <p style={{ fontSize: '1.6rem', color: '#495057' }}>게시글을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="posts_container new_post">
        <div className="inner">
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '2rem', color: '#ff6b6b', marginBottom: '1rem' }}>⚠️</div>
            <p style={{ fontSize: '1.6rem', color: '#495057', marginBottom: '2rem' }}>{error}</p>
            <button 
              onClick={() => router.push('/posts')}
              style={{
                padding: '1rem 2rem',
                background: 'var(--btn-color)',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1.4rem'
              }}
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="posts_container new_post">
      <div className="inner">
        <h2 className="section_title">게시글 수정</h2>
        
        <div className="form_group">
          <label htmlFor="title">제목</label>
          <input
            id="title"
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
        </div>

        <div className="form_group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={2000}
          />
        </div>

        <div className="button_group">
          <button className="submit_btn" onClick={handleUpdate}>
            수정 완료
          </button>
          <button className="cancel_btn" onClick={handleCancel}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
