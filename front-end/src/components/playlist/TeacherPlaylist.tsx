'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getAllVideos, getLatestVideos } from '@/app/api/teacherAPI';
import { Video } from '@/types/video';
import instructorData from '@/data/instructorData';

interface TeacherPlaylistProps {
  channelId: string;
}

const TeacherPlaylist: React.FC<TeacherPlaylistProps> = ({ channelId }) => {
  const [selected, setSelected] = useState(
    instructorData.find((inst) => inst.channeld === channelId) || instructorData[0],
  );

  const allQuery = useQuery<Video[], Error>({
    queryKey: ['allVideos'],
    queryFn: getAllVideos,
    enabled: selected.name === 'ALL',
    staleTime: 1000 * 60 * 30,
  });

  const instQuery = useQuery<Video[], Error>({
    queryKey: ['instVideos', selected.channeld],
    queryFn: () => getLatestVideos(selected.channeld!),
    enabled: selected.name !== 'ALL' && !!selected.channeld,
    staleTime: 1000 * 60 * 10,
  });

  const videos = selected.name === 'ALL' ? allQuery.data || [] : instQuery.data || [];

  useEffect(() => {
    const matchedInstructor = instructorData.find((inst) => inst.channeld === channelId);
    if (matchedInstructor) {
      setSelected(matchedInstructor);
    }
  }, [channelId]);

  return (
    <div className="playlists_container">
      <ul className="dev_list teacher">
        {instructorData.map((inst) => (
          <li key={inst.name} className={selected.name === inst.name ? 'active' : ''}>
            <button
              type="button"
              onClick={() => setSelected(inst)}
              disabled={selected.name === inst.name}
            >
              <Image src={inst.img} alt={inst.name} width={70} height={70} />
              <span>{inst.name}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="video_list_cont">
        <div className="inner">
          <ul className="video_list">
            {allQuery.isLoading || instQuery.isLoading ? (
              <p>로딩 중입니다...</p>
            ) : videos.length > 0 ? (
              videos.map((video) => (
                <li key={video.videoId} className="video_item">
                  <Link href={`/playlists/${selected.name}/${video.videoId}`}>
                    <Image
                      src={video.thumbnails.medium.url}
                      alt={video.title}
                      width={video.thumbnails.medium.width}
                      height={video.thumbnails.medium.height}
                    />
                    <h3 className="title">{video.title}</h3>
                    <p className="channel_title">{video.channelTitle}</p>
                    <p className="date">{new Date(video.publishedAt).toLocaleDateString()}</p>
                  </Link>
                </li>
              ))
            ) : (
              <p>동영상을 찾을 수 없습니다.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeacherPlaylist;
