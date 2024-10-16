import React from 'react';
import Link from 'next/link';
interface Playlists {
  params: { id: string };
}
interface CategoriesLists {
  id: string;
  name: string;
}

// interface Video {
//   id: string;
// }

const categorieslists: CategoriesLists[] = [
  { id: '1', name: '카테고리 1' },
  { id: '2', name: '카테고리 2' },
];

export default function PlaylistsVideo({ params }: Playlists) {
  return (
    <div>
      <h2>{params.id}번재생목록</h2>
      <div>
        {categorieslists.map((categories) => (
          <div key={categories.id}>
            <Link href={`/categories/${categories.id}`}>{categories.name}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
