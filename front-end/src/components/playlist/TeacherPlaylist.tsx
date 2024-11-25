'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import instructorData from '@/data/instructorData';
import { useQuery } from '@tanstack/react-query';
import { getAllVideos, getLatestVideos } from '@/app/api/teacherAPI';
import { Video } from '@/types/video';

const TeacherPlaylist = () => {
  const [selected, setSelected] = useState(instructorData[0]);

  // 전체 강사의 동영상 가져오기
  const allQuery = useQuery<Video[], Error>({
    queryKey: ['allVideos'],
    queryFn: getAllVideos,
    enabled: selected.name === 'ALL',
    staleTime: 1000 * 60 * 30,
  });

  // 특정 강사의 동영상을 가져오기
  const instQuery = useQuery<Video[], Error>({
    queryKey: ['instVideos', selected.channeld],
    queryFn: () => getLatestVideos(selected.channeld!),
    enabled: selected.name !== 'ALL' && !!selected.channeld,
    staleTime: 1000 * 60 * 10,
  });

  const videos = selected.name === 'ALL' ? allQuery.data || [] : instQuery.data || [];

  return (
    <div className="playlists_container">
      <ul className="dev_list teacher">
        {instructorData.map((inst) => (
          <li key={inst.name}>
            <button type="button" onClick={() => setSelected(inst)}>
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
              videos.map((video, index) => (
                <li key={index} className="video_item">
                  <a
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={video.thumbnails.medium.url}
                      alt={video.title}
                      width={video.thumbnails.medium.width}
                      height={video.thumbnails.medium.height}
                    />
                    <h3 className="title">{video.title}</h3>
                    <p className="channel_title">{video.channelTitle}</p>
                    <p className="date">{new Date(video.publishedAt).toLocaleDateString()}</p>
                  </a>
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
