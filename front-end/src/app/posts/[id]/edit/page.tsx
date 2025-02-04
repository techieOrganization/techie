'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PostEdit({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState({ title: '첫 번째 게시글', content: '수정할 내용을 입력하세요.' });

  const handleUpdate = () => {
    router.push(`/posts/${params.id}`);
  };

  return (
    <div className='posts_container'>
      <div className="inner">
      <h2 className='section_title'>커뮤니티 게시판</h2>
      <input
        type="text"
        value={post.title}
        onChange={(e) => setPost({ ...post, title: e.target.value })}
      />
      <textarea
        value={post.content}
        onChange={(e) => setPost({ ...post, content: e.target.value })}
      />
      <button onClick={handleUpdate}>수정 완료</button>
      <button onClick={() => router.back()}>취소</button>
      </div>
    </div>
  );
}
