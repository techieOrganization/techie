'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import instructorData from '@/data/instructorData';

import { fetchPlaylistVideos, fetchAllPlaylistsVideos, Video } from '@/app/api/teacherAPI';
import '@/styles/pages/playlist/playlist.scss';

interface TeacherPlaylistProps {
  playlistId: string;
}

const TeacherPlaylist: React.FC<TeacherPlaylistProps> = ({ playlistId }) => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const loadVideos = async () => {
      const data = playlistId
        ? await fetchPlaylistVideos(playlistId)
        : await fetchAllPlaylistsVideos();
      setVideos(data);
    };
    loadVideos();
  }, [playlistId]);

  return (
    <div className="playlists_container">
      <ul className="dev_list teacher">
        {instructorData.map((instructor) => (
          <li key={instructor.name}>
            <Link href={`/teacher-lists/${instructor.name}`}>
              <Image src={instructor.img} alt={instructor.name} width={70} height={70} />
              <span>{instructor.name}</span>
            </Link>
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
