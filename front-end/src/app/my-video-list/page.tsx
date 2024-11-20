'use client';

import '@/styles/pages/my-video-list/my-video-list.scss';

const myVideoList = () => {
  return (
    <div>
      <h1 className="my-video-list-header">재생 목록</h1>
      <ul></ul>
      <div></div>
    </div>
  );
};

export default myVideoList;

// 재생목록이 비어있을 시 비었다는 문구를 출력하는 로직 추가
// 3항 연산자로 영상이 있을 때와 없을 때를 구현
//      {playlist.length === 0 ? (
//  <p>재생목록이 비어 있습니다.</p>
//) : (
//  <ul>
//    {playlist.map((video) => (
//     <li key={video.id}>{video.title}</li>
//  ))}
