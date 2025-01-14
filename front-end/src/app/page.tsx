'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import '@/styles/pages/home/home.scss';
import Image from 'next/image';
import Link from 'next/link';
import { fetchVideosByCategory } from '@/app/api/videoAPI';
import studentData from '@/data/studentData';
import vidListData from '@/data/vidListData';
import instructorData from '@/data/instructorData';
import { Video } from '@/types/video';
import { devConsoleError } from '@/utils/logger';

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const getVideos = async () => {
      try {
        const allVideosResponse = await fetchVideosByCategory({ category: 'all', page: 0 });

        const latestVideos = allVideosResponse.content.slice(0, 10);

        setVideos(latestVideos);
      } catch (error) {
        devConsoleError('Failed to fetch videos:', error);
      }
    };

    getVideos();
  }, []);

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
                    무엇을 배워야 할지
                    <br />
                    고민된다면? 🐣
                  </h3>
                  <p>다양한 주제로 기초부터 실전까지 모두 경험하세요.</p>
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
                    <span>지금 이 순간 업데이트!</span>
                  </div>
                  <h3>믿고 보는 유튜버 Pick! 👑</h3>
                  <p>
                    핫한 개발 주제를 다룬 강의들로
                    <br />
                    최신 트렌드를 따라잡으세요!
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
        </div>
      </section>
      <section className="section sec03">
        <div className="inner">
          <h2>따끈따끈한 최신 강의 모음🏫</h2>
          <p className="sub_title">최신 트렌드와 함께 배우세요.</p>
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            navigation={true}
            loop={true}
            grabCursor={true}
            modules={[Navigation, Autoplay]}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            className="mySwiper"
            breakpoints={{
              1280: {
                slidesPerView: 5,
              },
              989: {
                slidesPerView: 3,
              },
              767: {
                slidesPerView: 2,
              },
              500: {
                slidesPerView: 1,
              },
            }}
          >
            {videos.map((video, index) => (
              <SwiperSlide key={index}>
                <Link href={`/playlists/all/${video.videoId}`} className="vid_desc">
                  <div>
                    <Image
                      src={video.thumbnails.medium.url}
                      alt={video.title}
                      width={video.thumbnails.medium.width}
                      height={video.thumbnails.medium.height}
                      className="thumbnail"
                    />
                    <div className="vid_info">
                      <h3>{video.title}</h3>
                      <p>{video.channelTitle}</p>
                    </div>
                  </div>
                </Link>
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
            {instructorData.slice(1, 6).map((instructor, index) => (
              <li key={index}>
                <Link href={`/teacher-lists?teacher=${instructor.name}`}>
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
          slidesPerView={'auto'}
          loop={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          speed={3000}
          modules={[Autoplay]}
          className="personaSwiper"
          breakpoints={{
            501: {
              spaceBetween: 20,
            },
            500: {
              spaceBetween: 10,
            },
          }}
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
