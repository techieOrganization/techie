'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import instructorData from '@/data/instructorData';
import { fetchLatestVideosByChannel, fetchAllPlaylistsVideos } from '@/app/api/teacherAPI';
import { Video } from '@/types/video';

const TeacherPlaylist = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState(instructorData[0]);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        if (selectedInstructor.name === '전체') {
          console.log('Fetching all videos'); // 디버깅 로그
          const data = await fetchAllPlaylistsVideos();
          console.log('Fetched all videos:', data); // 확인용 로그
          setVideos(data);
        } else if (selectedInstructor.channeld) {
          console.log(`Fetching videos for ${selectedInstructor.name}`); // 디버깅 로그
          const data = await fetchLatestVideosByChannel(selectedInstructor.channeld);
          setVideos(data);
        } else {
          console.warn(`No channel ID for ${selectedInstructor.name}`);
          setVideos([]);
        }
      } catch (error) {
        console.error('Error loading videos:', error);
        setVideos([]);
      }
    };

    loadVideos();
  }, [selectedInstructor]);

  return (
    <div className="playlists_container">
      <ul className="dev_list teacher">
        {instructorData.map((instructor) => (
          <li key={instructor.name}>
            <button
              type="button"
              onClick={() => {
                console.log('Instructor selected:', instructor); // 버튼 클릭 시 선택된 강사 정보 확인
                setSelectedInstructor(instructor);
              }}
            >
              <Image src={instructor.img} alt={instructor.name} width={70} height={70} />
              <span>{instructor.name}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="video_list_cont">
        <div className="inner">
          <ul className="video_list">
            {videos.length > 0 ? (
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
              <p>해당 강사의 영상을 불러오는 중입니다...</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeacherPlaylist;
