'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Post {
  id: number;
  title: string;
  content: string;
  nickname: string;
  writtenAt: string;
  category: 'FREE' | 'QNA';
}

export default function PostList() {
  const router = useRouter();
  const [category, setCategory] = useState<'FREE' | 'QNA'>('FREE');

  const dummyPosts: Post[] = [
    {
      id: 1,
      title: '첫 번째 자유게시글',
      content: '내용입니다.',
      nickname: '사용자1',
      writtenAt: '2025-02-04',
      category: 'FREE',
    },
    {
      id: 2,
      title: '두 번째 자유게시글',
      content: '또 다른 내용입니다.',
      nickname: '사용자2',
      writtenAt: '2025-02-03',
      category: 'FREE',
    },
    {
      id: 3,
      title: '첫 번째 질문게시글',
      content: '질문 내용입니다.',
      nickname: '사용자3',
      writtenAt: '2025-02-02',
      category: 'QNA',
    },
    {
      id: 4,
      title: '두 번째 질문게시글',
      content: '또 다른 질문 내용입니다.',
      nickname: '사용자4',
      writtenAt: '2025-02-01',
      category: 'QNA',
    },
  ];

  return (
    <div className="posts_container">
      <div className="inner">
        <h2 className="section_title">커뮤니티 게시판</h2>
        <div className="tab_menu">
          <button
            onClick={() => setCategory('FREE')}
            style={{ fontWeight: category === 'FREE' ? 'bold' : 'normal' }}
          >
            자유게시판
          </button>
          <button
            onClick={() => setCategory('QNA')}
            style={{ fontWeight: category === 'QNA' ? 'bold' : 'normal' }}
          >
            질문게시판
          </button>
        </div>

        <button onClick={() => router.push('/posts/new')}>새 글 작성</button>

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
            {dummyPosts
              .filter((post) => post.category === category)
              .map((post) => (
                <tr
                  key={post.id}
                  onClick={() => router.push(`/posts/${post.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{post.id}</td>
                  <td>{post.title}</td>
                  <td>{post.nickname}</td>
                  <td>{post.writtenAt}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
