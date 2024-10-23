"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styled from 'styled-components';
import '@/styles/pages/youtube/youtube.scss';
import Link from 'next/link';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface Note {
  time: string;
  timeInSeconds: number;
  content: string;
}

const VideoDetailPage: React.FC = () => {
  const { videoId } = useParams();
  const [noteTime, setNoteTime] = useState<string | null>(null);
  const [noteTimeInSeconds, setNoteTimeInSeconds] = useState<number>(0);
  const [note, setNote] = useState<string>('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [playerReady, setPlayerReady] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!videoId) return; 

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: videoId,
        events: {
          onReady: () => {
            setPlayerReady(true);
          },
        },
      });
    };

    if (!document.getElementById('youtube-iframe-api')) {
      const script = document.createElement('script');
      script.id = 'youtube-iframe-api';
      script.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(script);
    } else if (window.YT && window.YT.Player) {
      window.onYouTubeIframeAPIReady();
    }
  }, [videoId]);

  const handleNoteClick = () => {
    if (playerRef.current && playerRef.current.getCurrentTime) {
      const currentTime = playerRef.current.getCurrentTime(); 
      const minutes = Math.floor(currentTime / 60);
      const seconds = Math.floor(currentTime % 60);
      const formattedTime = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
      setNoteTime(formattedTime);
      setNoteTimeInSeconds(currentTime);
    } else {

    }
  };
  
  const handleSaveNote = () => {
    const newNote: Note = {
      time: noteTime!,
      timeInSeconds: noteTimeInSeconds,
      content: note,
    };
    setNotes([...notes, newNote]);
    setNote('');
    setNoteTime(null);
    setNoteTimeInSeconds(0);
  };

  const handleSeekTo = (timeInSeconds: number) => {
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(timeInSeconds, true);
    }
  };

  if (!videoId) {
    return <p>Loading...</p>;
  }

  return (
    <div className='vid'>
      <div className="inner">
        <h2 className='title'>강의 상세</h2>
        <div id="youtube-player"></div>

        <button onClick={handleNoteClick} disabled={!playerReady}>메모하기</button>

        {noteTime && (
          <div className="note-editor">
            <FlexContainer>
              <TimeLabel>
                {noteTime}
              </TimeLabel>
              <FlexItem>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  style={{ width: '100%' }}
                />
              </FlexItem>
            </FlexContainer>

            <ButtonContainer>
              <button onClick={() => setNoteTime(null)}>취소</button>
              <SaveButton onClick={handleSaveNote}>메모 저장</SaveButton>
            </ButtonContainer>
          </div>
        )}

        <NoteList className="note-list">
          <h3>저장된 메모</h3>
          {notes.length === 0 ? (
            <p>저장된 메모가 없습니다.</p>
          ) : (
            notes.map((noteItem, index) => (
              <NoteItem key={index}>
                <NoteItemContent>
                  <NoteTime
                    onClick={() => handleSeekTo(noteItem.timeInSeconds)}
                  >
                    {noteItem.time}
                  </NoteTime>
                  <div>{noteItem.content}</div>
                </NoteItemContent>
              </NoteItem>
            ))
          )}
        </NoteList>

        <Link href='/youtube' className='list_btn'>목록으로 돌아가기</Link>
      </div>
    </div>
  );
};

export default VideoDetailPage;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

const TimeLabel = styled.span`
  background-color: black;
  color: white;
  padding: 5px;
  border-radius: 5px;
  margin-right: 10px;
`;

const FlexItem = styled.div`
  flex: 1;
`;

const ButtonContainer = styled.div`
  margin-top: 10px;
  text-align: right;
`;

const SaveButton = styled.button`
  margin-left: 10px;
`;

const NoteList = styled.div`
  margin-top: 20px;
`;

const NoteItem = styled.div`
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
`;

const NoteItemContent = styled.div`
  display: flex;
  align-items: center;
`;

const NoteTime = styled.span`
  cursor: pointer;
  color: blue;
  margin-right: 10px;
`;
