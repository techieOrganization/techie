'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PostForm() {
  const router = useRouter();
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  const handleSubmit = () => {
    router.push('/posts');
  };

  return (
    <div className='posts_container'>
      <div className="inner">
      <h2 className='section_title'>커뮤니티 게시판</h2>
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
