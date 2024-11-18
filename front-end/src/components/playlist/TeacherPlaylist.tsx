'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import instructorData from '@/data/instructorData';
import { fetchLatestVideosByChannel, fetchAllPlayVids } from '@/app/api/teacherAPI';
import { useQuery } from '@tanstack/react-query';
import { Video } from '@/types/video';

const TeacherPlaylist = () => {
  const [selectedInstructor, setSelectedInstructor] = useState(instructorData[0]);

  // 전체 강사의 동영상 가져오기
  const allVideosQuery = useQuery<Video[], Error>({
    queryKey: ['allVideos'],
    queryFn: fetchAllPlayVids,
    enabled: selectedInstructor.name === '전체',
    staleTime: 1000 * 60 * 30,
  });

  // 특정 강사의 동영상을 가져오기
  const instructorVideosQuery = useQuery<Video[], Error>({
    queryKey: ['instructorVideos', selectedInstructor.channeld],
    queryFn: () => fetchLatestVideosByChannel(selectedInstructor.channeld!),
    enabled: selectedInstructor.name !== '전체' && !!selectedInstructor.channeld,
    staleTime: 1000 * 60 * 10,
  });

  // 현재 보여줄 동영상
  const videos =
    selectedInstructor.name === '전체'
      ? allVideosQuery.data || []
      : instructorVideosQuery.data || [];

  return (
    <div className="playlists_container">
      <ul className="dev_list teacher">
        {instructorData.map((instructor) => (
          <li key={instructor.name}>
            <button type="button" onClick={() => setSelectedInstructor(instructor)}>
              <Image src={instructor.img} alt={instructor.name} width={70} height={70} />
              <span>{instructor.name}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="video_list_cont">
        <div className="inner">
          <ul className="video_list">
            {allVideosQuery.isLoading || instructorVideosQuery.isLoading ? (
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
              <p>해당 강사의 동영상을 찾을 수 없습니다.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeacherPlaylist;
