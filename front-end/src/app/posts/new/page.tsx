'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PostForm() {
  const router = useRouter();
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'FREE' });

  const handleSubmit = () => {
    router.push('/posts');
  };

  return (
    <div className='posts_container'>
      <div className="inner">
        <h2 className='section_title'>커뮤니티 게시판</h2>
        <label>카테고리</label>
        <select 
          value={newPost.category} 
          onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
        >
          <option value="FREE">자유게시판</option>
          <option value="QNA">질문게시판</option>
        </select>
        <input
          type="text"
          placeholder="제목"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <textarea
          placeholder="내용"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
        />
        <button onClick={handleSubmit}>작성</button>
        <button onClick={() => router.back()}>취소</button>
      </div>
    </div>
  );
}
