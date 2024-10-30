'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '@/styles/pages/home/home.scss';
import Image from 'next/image';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';
import { fetchPlaylistVideos } from '@/libs/api/youtubeAPI';
import studentData from '@/data/studentData';

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const getVideos = async () => {
      const data = await fetchPlaylistVideos();
      setVideos(data);
    };

    getVideos();
  }, []);

  return (
    <>
      <section className="section sec01">
        <h2 className="dn">메인 슬라이드 화면</h2>
        <Swiper
          pagination={{
            type: 'fraction',
          }}
          navigation={true}
          modules={[Pagination, Navigation, Autoplay]}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          loop={true}
          className="mySwiper"
        >
          <SwiperSlide>
            <div className="slide-content">
              <h2>Slide 1</h2>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide-content">
              <h2>Slide 2</h2>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide-content">
              <h2>Slide 3</h2>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide-content">
              <h2>Slide 4</h2>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>
      <section className="section sec02">
        <h2 className="dn">강의 목록</h2>
        <div className="inner">
          <ul className="dev_list">
            <li>
              <Link href="#">
                <Image src="/assets/images/main/dev_01.png" alt="언어" width={50} height={50} />
                <span>언어</span>
              </Link>
            </li>
            <li>
              <Link href="#">
                <Image src="/assets/images/main/dev_02.png" alt="게임개발" width={50} height={50} />
                <span>게임개발</span>
              </Link>
            </li>
            <li>
              <Link href="#">
                <Image src="/assets/images/main/dev_03.png" alt="백엔드" width={50} height={50} />
                <span>백엔드</span>
              </Link>
            </li>
            <li>
              <Link href="#">
                <Image src="/assets/images/main/dev_04.png" alt="모바일" width={50} height={50} />
                <span>모바일</span>
              </Link>
            </li>
            <li>
              <Link href="#">
                <Image
                  src="/assets/images/main/dev_05.png"
                  alt="프론트엔드"
                  width={50}
                  height={50}
                />
                <span>프론트엔드</span>
              </Link>
            </li>
            <li>
              <Link href="#">
                <Image src="/assets/images/main/dev_06.png" alt="데이터" width={50} height={50} />
                <span>데이터</span>
              </Link>
            </li>
            <li>
              <Link href="#">
                <Image src="/assets/images/main/dev_07.png" alt="인공지능" width={50} height={50} />
                <span>인공지능</span>
              </Link>
            </li>
            <li>
              <Link href="#">
                <Image src="/assets/images/main/dev_08.png" alt="보안" width={50} height={50} />
                <span>보안</span>
              </Link>
            </li>
            <li>
              <Link href="#">
                <Image src="/assets/images/main/dev_09.png" alt="CS" width={50} height={50} />
                <span>CS</span>
              </Link>
            </li>
          </ul>
          <div className="search_box">
            <input type="text" placeholder="검색어를 입력하세요" />
            <button type="button">
              <FiSearch size={20} />
            </button>
          </div>
        </div>
      </section>
      <section className="section sec03">
        <div className="inner">
          <h2>최신 등록 강의</h2>
          <Swiper
            spaceBetween={20}
            slidesPerView={5}
            navigation={true}
            pagination={{ clickable: true }}
            loop={true}
            grabCursor={true}
            modules={[Navigation, Pagination]}
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
          <h2>강사 리스트</h2>
          <ul className="instructor_list">
            {/* <li>
              <Link href="#">
                <Image src="/assets/images/main/logo01.jpg" alt="강사" width={100} height={100} />
                <span>생활코딩</span>
              </Link>
            </li>
            <li>
              <Link href="#">
                <Image src="/assets/images/main/logo02.jpg" alt="강사" width={100} height={100} />
                <span>드림코딩</span>
              </Link>
            </li> */}
            <li>
              <Link href="#">
                <Image src="/assets/images/main/logo03.jpg" alt="강사" width={100} height={100} />
                <div className="txt_box">
                  <span>조코딩</span>
                  <p>주로 파이썬, 데이터 분석, AI 관련 강좌</p>
                </div>
              </Link>
            </li>
            <li>
              <Link href="#">
                <Image src="/assets/images/main/logo04.jpg" alt="강사" width={100} height={100} />
                <div className="txt_box">
                  <span>코딩 알려주는 누나</span>
                  <p>초보자들을 위한 다양한 프로그래밍 강좌</p>
                </div>
              </Link>
            </li>
            <li>
              <Link href="#">
                <Image src="/assets/images/main/logo05.jpg" alt="강사" width={100} height={100} />
                <div className="txt_box">
                  <span>애플코딩</span>
                  <p>iOS 개발자를 위한 Swift와 다양한 앱 개발 강좌를 제공</p>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </section>
      <section className="section sec05">
        <h2>수강생 리스트</h2>
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
                    className='memoji'
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
