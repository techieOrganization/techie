import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h2>메인 페이지</h2>
      <div>
        <Link href="/playlists">재생목록</Link>
      </div>
      <div>
        <Link href="/watch-histories">시청기록</Link>
      </div>
      <div>
        <Link href="/gpt-histories">GPT기록</Link>
      </div>
      <div>
        <Link href="/search-histories">검색기록</Link>
      </div>
      <div>
        <Link href="/memo">메모</Link>
      </div>
    </div>
  );
}
