'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { getAllVideos, getLatestVideos } from '@/app/api/teacherAPI';
import { Video } from '@/types/video';

import { deletePlaylist, getVideo, detailPlaylist } from '@/app/api/playlistApi';
import Cookies from 'js-cookie';
import instructorData from '@/data/instructorData';
import { PlayLists } from '@/types/playlist';
import { devConsoleError } from '@/utils/logger';

import TeacherTabs from './TeacherTap';
import TeacherVideoList from './teacherVideolist';
import Modal from './Modal';

const TeacherPlaylistPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const teacherName = searchParams.get('teacher') || 'ALL';

  const [selected, setSelected] = useState(
    instructorData.find((inst) => inst.name === teacherName) || instructorData[0],
  );
  const [showModal, setShowModal] = useState(false);
  const [selectVideo, setSelectVideo] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<PlayLists | undefined>(undefined);

  const token = Cookies.get('token');

  const handleTeacherSelect = (inst: (typeof instructorData)[number]) => {
    setSelected(inst);
    router.push(`/teacher-lists?teacher=${encodeURIComponent(inst.name)}`);
  };

  const allQuery = useQuery<Video[], Error>({
    queryKey: ['allVideos'],
    queryFn: getAllVideos,
    enabled: selected.name === 'ALL',
    staleTime: 1000 * 60 * 30,
  });

  const instQuery = useQuery<Video[], Error>({
    queryKey: ['instVideos', selected.channeld],
    queryFn: () => getLatestVideos(selected.channeld!),
    enabled: selected.name !== 'ALL' && !!selected.channeld,
    staleTime: 1000 * 60 * 10,
  });

  const openModal = (videoId: string) => {
    setSelectVideo(videoId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectVideo(null);
  };

  const fetchPlaylists = async () => {
    if (!token) {
      setPlaylists(undefined);
      return;
    }

    try {
      const playlistsData = await getVideo(token);

      if (!playlistsData || !playlistsData.playlists || playlistsData.playlists.length === 0) {
        setPlaylists({ playlists: [] });

        return;
      }

      const playlistsWithDetails = await Promise.all(
        playlistsData.playlists.map(async (playlist: { playlistId: string | undefined }) => {
          try {
            const detail = await detailPlaylist(playlist.playlistId, token);
            return {
              ...playlist,

              videos: detail && detail.videos && Array.isArray(detail.videos) ? detail.videos : [],
            };
          } catch (detailError) {
            devConsoleError(
              `Failed to fetch detail for playlist ${playlist.playlistId}`,
              detailError,
            );
            return { ...playlist, videos: [] };
          }
        }),
      );

      setPlaylists({ ...playlistsData, playlists: playlistsWithDetails });
    } catch (error) {
      devConsoleError('Failed to fetch playlists or details in page', error);
      setPlaylists(undefined);
    } finally {
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [token, setPlaylists, selectVideo, getVideo, detailPlaylist]);

  const onClickDeletePlaylist = async (playlistId: string) => {
    const confirmDelete = confirm('재생목록을 삭제하시겠습니까?');
    if (!confirmDelete) {
      return;
    }

    if (!token) return;

    try {
      await deletePlaylist(playlistId, token);
      alert('재생목록이 삭제되었습니다.');

      setPlaylists((prevPlaylists: PlayLists | undefined) =>
        prevPlaylists
          ? {
              ...prevPlaylists,
              playlists: prevPlaylists.playlists.filter(
                (playlist) => playlist.playlistId !== playlistId,
              ),
            }
          : undefined,
      );
    } catch (error) {
      devConsoleError('Failed to delete playlist', error);
      alert('재생목록 삭제에 실패했습니다.');
    }
  };

  const videos = selected.name === 'ALL' ? allQuery.data || [] : instQuery.data || [];

  return (
    <div className="playlists_container">
      <TeacherTabs
        instructorData={instructorData}
        selected={selected}
        onSelectTeacher={handleTeacherSelect}
      />

      <TeacherVideoList
        videos={videos}
        isLoading={allQuery.isLoading || instQuery.isLoading}
        error={allQuery.error || instQuery.error}
        selectedTeacherName={selected.name}
        token={token}
        onOpenModal={openModal}
      />

      {showModal && (
        <Modal
          playlists={playlists}
          setPlaylists={setPlaylists}
          onClose={closeModal}
          selectVideo={selectVideo}
          onClickDelete={onClickDeletePlaylist}
        />
      )}
    </div>
  );
};

export default TeacherPlaylistPage;
