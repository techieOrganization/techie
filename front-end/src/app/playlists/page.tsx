import Link from 'next/link';
import React from 'react';

interface Playlists {
  id: string;
  name: string;
}
const playlists: Playlists[] = [
  { id: '1', name: '재생목록 1' },
  { id: '2', name: '재생목록 2' },
];

const Playlists = () => {
  return (
    <div>
      <h2>재생목록</h2>
      <div>
        {playlists.map((playlist) => (
          <div key={playlist.id}>
            <Link href={`/playlists/${playlist.id}`}>{playlist.name}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlists;
