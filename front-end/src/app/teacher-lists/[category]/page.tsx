'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import instructorData from '@/data/instructorData';
import TeacherPlaylist from '@/components/playlist/TeacherPlaylist';

const TeacherCategoryPage: React.FC = () => {
  const params = useParams();

  const teacherName = Array.isArray(params.category)
    ? decodeURIComponent(params.category[0])
    : decodeURIComponent(params.category);

  const instructor = instructorData.find((instructor) => instructor.name === teacherName);

  if (!instructor) {
    return <p>해당 강사를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="playlists_container">
      <TeacherPlaylist channelId={instructor.channeld} />
    </div>
  );
};

export default TeacherCategoryPage;
