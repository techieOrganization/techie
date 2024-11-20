'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import '@/styles/pages/home/home.scss';
import Image from 'next/image';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';

import { fetchPlaylistVideos } from '@/app/api/youtubeAPI';
import studentData from '@/data/studentData';
import vidListData from '@/data/vidListData';
import instructorData from '@/data/instructorData';
import { Video } from '@/types/video';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const getVideos = async () => {
      const data = await fetchPlaylistVideos();
      setVideos(data);
    };

    getVideos();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/playlists?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <section className="section sec01">
        <h2 className="dn">메인 슬라이드 화면</h2>
        <Swiper
          navigation={true}
          modules={[Navigation, Autoplay]}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          loop={true}
          className="mySwiper"
        >
          <SwiperSlide className="n2">
            <div className="inner">
              <div className="slide-content">
                <div className="left_cover">
                  <div className="tag">
                    <span>OPEN</span>
                  </div>
                  <h3>
                    드디어 오픈!
                    <br />
                    누구나 공부할 수 있는 테키!
                  </h3>
                  <p>개발 공부를 언제 어디서나 즐겨보세요!</p>
                </div>
                <div className="right_cover">
                  <Image
                    src="/assets/images/main/banner04.png"
                    alt="테키 오픈 배너"
                    width={700}
                    height={500}
                    priority
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="n1">
            <div className="inner">
              <div className="slide-content">
                <div className="left_cover">
                  <div className="tag">
                    <span>고민은 이제 그만!</span>
                  </div>
                  <h3>
                    누구나 쉬운 입문 강의
                    <br />
                    여기 다 모였다! 🐣
                  </h3>
                  <p>어디서부터 시작해야 할지 모르는 당신을 위한 입문 강의</p>
                </div>
                <div className="right_cover">
                  <Image
                    src="/assets/images/main/banner01.webp"
                    alt="입문 강의 배너"
                    width={700}
                    height={500}
                    priority
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="n3">
            <div className="inner">
              <div className="slide-content">
                <div className="left_cover">
                  <div className="tag">
                    <span>실시간 업데이트!</span>
                  </div>
                  <h3>
                    무슨 강의 들을지 고민이라면? <br />
                    현직자 강의 전체보기 👑
                  </h3>
                  <p>
                    입문부터 실전까지,
                    <br />
                    믿고 보는 실무자 Pick!
                  </p>
                </div>
                <div className="right_cover">
                  <Image
                    src="/assets/images/main/banner03.png"
                    alt="실시간 업데이트 배너"
                    width={700}
                    height={500}
                    priority
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>
      <section className="section sec02">
        <h2 className="dn">강의 목록</h2>
        <div className="inner">
          <ul className="dev_list">
            {vidListData.map((tab) => (
              <li key={tab.id}>
                <Link href={`/playlists/${tab.id}`}>
                  <Image src={tab.img} alt={tab.title} width={50} height={50} />
                  <span>{tab.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="search_box">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button type="button" onClick={handleSearch}>
              <FiSearch size={20} />
            </button>
          </div>
        </div>
      </section>
      <section className="section sec03">
        <div className="inner">
          <h2>따끈따끈한 최신 강의 모음🏫</h2>
          <p className="sub_title">최신 트렌드와 함께 배우세요.</p>
          <Swiper
            spaceBetween={20}
            slidesPerView={5}
            navigation={true}
            loop={true}
            grabCursor={true}
            modules={[Navigation]}
            className="mySwiper"
          >
            {videos.map((video, index) => (
              <SwiperSlide key={index}>
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${video.snippet.resourceId.videoId}`}
                  title={video.snippet.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <div className="vid_info">
                  <h3>{video.snippet.title}</h3>
                  <p>{video.snippet.channelTitle}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      <section className="section sec04">
        <div className="inner">
          <h2>당신의 멘토가 될 강사님들을 소개합니다🥳</h2>
          <p className="sub_title">각 분야의 멘토와 함께 실력을 쌓아 보세요!</p>
          <ul className="instructor_list">
            {instructorData.slice(0, 5).map((instructor, index) => (
              <li key={index}>
                <Link href={`/teacher-lists/${instructor.name}`}>
                  <Image src={instructor.img} alt={instructor.name} width={100} height={100} />
                  <div className="txt_box">
                    <span>{instructor.name}</span>
                    <p>{instructor.description}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section sec05">
        <h2>성장한 수강생들의 진솔한 후기✍️</h2>
        <p className="sub_title">함께 이룬 성장을 자랑스럽게 소개합니다.</p>
        <Swiper
          spaceBetween={20}
          slidesPerView={'auto'}
          loop={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          speed={3000}
          modules={[Autoplay]}
          className="personaSwiper"
        >
          {studentData.map((student, index) => (
            <SwiperSlide key={index} className="persona_slide">
              <li>
                <div className="img_box">
                  <Image
                    className="memoji"
                    src={student.img}
                    alt={`${student.name}'s profile picture`}
                    width={150}
                    height={150}
                  />
                </div>
                <div className="student_info">
                  <span className="student_job">{student.title}</span>
                  <strong>{student.title_desc}</strong>
                  <span>{student.rating}</span>
                  <div className="student_details">
                    <span className="student_name">{student.name}</span>
                    <span className="student_age">{student.age}</span>
                  </div>
                </div>
              </li>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </>
  );
}
