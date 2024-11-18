'use client';

import React from 'react';

import CategoryPlaylist from '@/components/playlist/CategoryPlaylist';
import '@/styles/pages/playlist/playlist.scss';

const AllPlaylistsPage: React.FC = () => {
  return (
    <div>
      <CategoryPlaylist category="all" />
    </div>
  );
};

export default AllPlaylistsPage;
