'use client';

import { detailPlaylist } from '@/app/api/playlistApi';
import '@/styles/pages/my-video-list/my-video-list.scss';
import { useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { DetailPlayList } from '@/types/playlist';
import Link from 'next/link';
import '@/styles/pages/my-video-list/my-video-list.scss';
interface Params {
  playlistId?: string;
}

const MyVideoList = () => {
  const params = useParams() as Params;
  const { playlistId } = params;

  const [playlist, setPlaylist] = useState<DetailPlayList | null>(null);

  const fetchVideo = async () => {
    const token = Cookies.get('token');
    try {
      const response = await detailPlaylist(playlistId, token);
      console.log(response);
      setPlaylist(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, [playlistId]); // 의존성 배열에 playlistId와 userId 추가

  return (
    <div className="video_container">
      <h1 className="my-video-list-header">{playlist?.playlistName}</h1>

      <div className="video-item-container">
        {playlist && playlist.videos && playlist.videos.length > 0 ? (
          playlist.videos.map((video) => (
            <Link href={`/playlists/ALL/${video.videoId}`} className="video_title">
              <div key={video.videoId} className="video-item">
                {video.title}
              </div>
            </Link>
          ))
        ) : (
          <p>재생목록에 영상이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default MyVideoList;

//1. userId와 playlistId 를 전체 플레이리스트 api 에서 응답으로 받아와서 상세 영상 api의 매개변수로 넣고 호출해준다
//2.1 모든 비디오를 호출해오는 api로 호출하고 상세 플레이리스트의 videoId 값이랑 동일하지 않은 비디오들은 모두 필터링해준다.
//2.2 상세 플레이리스트의 반환값인 videoId,title를 렌더링해주고 Link태그를 이용해서 동적으로 해당영상의 url로 라우팅시킨다 ++ 참고사항 그러려면 카테고리도 동적으로 받아와야한다
