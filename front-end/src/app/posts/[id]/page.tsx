'use client';

import { useRouter } from 'next/navigation';

interface Post {
  id: number;
  title: string;
  content: string;
  nickname: string;
  writtenAt: string;
}

const dummyPost: Post = {
  id: 1,
  title: '첫 번째 게시글',
  content: '이곳은 게시글 내용이 들어가는 자리입니다.',
  nickname: '김혜인',
  writtenAt: '2025-02-04',
};

export default function PostDetail({ params }: { params: { id: string } }) {
  const router = useRouter();

  return (
    <div className='posts_container'>
      <div className="inner">
      <h2>{dummyPost.title}</h2>
      <p>작성자: {dummyPost.nickname}</p>
      <p>작성일: {dummyPost.writtenAt}</p>
      <p>{dummyPost.content}</p>

      <button onClick={() => router.push(`/posts/${params.id}/edit`)}>수정</button>
      <button onClick={() => router.push('/posts')}>목록으로</button>
      </div>
    </div>
  );
}
