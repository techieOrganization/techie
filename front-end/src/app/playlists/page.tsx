'use client';

import Image from 'next/image';
import '@/styles/pages/playlist/playlist.scss';
import vidListData from '@/data/vidListData';

const Playlists = () => {
  return (
    <div className="playlists_container">
      <div className="inner">
        <h2 className="dn">재생목록</h2>
        <ul className="dev_list">
          {vidListData.map((tab) => (
            <li key={tab.id}>
              <button type="button">
                <Image src={tab.img} alt={tab.title} width={40} height={40} />
                <span>{tab.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Playlists;
