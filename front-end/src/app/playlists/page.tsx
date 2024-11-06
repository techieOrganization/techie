'use client';

import React from 'react';
import CategoryPlaylist from '@/components/playlist/CategoryPlaylist';

const AllPlaylistsPage: React.FC = () => {
  return (
    <div>
      <CategoryPlaylist category="all" />
    </div>
  );
};

export default AllPlaylistsPage;
