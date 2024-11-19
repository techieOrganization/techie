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
    console.log('searchQuery:', searchQuery);
    if (searchQuery.trim()) {
      router.push(`/playlists?query=${encodeURIComponent(searchQuery)}`);
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
            <li>
              <Link href="/playlists/language">
                <Image src="/assets/images/main/dev_01.png" alt="언어" width={50} height={50} />
                <span>언어</span>
              </Link>
            </li>
            <li>
              <Link href="/playlists/gameDev">
                <Image src="/assets/images/main/dev_02.png" alt="게임개발" width={50} height={50} />
                <span>게임개발</span>
              </Link>
            </li>
            <li>
              <Link href="/playlists/backend">
                <Image src="/assets/images/main/dev_03.png" alt="백엔드" width={50} height={50} />
                <span>백엔드</span>
              </Link>
            </li>
            <li>
              <Link href="/playlists/mobile">
                <Image src="/assets/images/main/dev_04.png" alt="모바일" width={50} height={50} />
                <span>모바일</span>
              </Link>
            </li>
            <li>
              <Link href="/playlists/frontend">
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
              <Link href="/playlists/data">
                <Image src="/assets/images/main/dev_06.png" alt="데이터" width={50} height={50} />
                <span>데이터</span>
              </Link>
            </li>
            <li>
              <Link href="/playlists/ai">
                <Image src="/assets/images/main/dev_07.png" alt="인공지능" width={50} height={50} />
                <span>인공지능</span>
              </Link>
            </li>
            <li>
              <Link href="/playlists/security">
                <Image src="/assets/images/main/dev_08.png" alt="보안" width={50} height={50} />
                <span>보안</span>
              </Link>
            </li>
            <li>
              <Link href="/playlists/cs">
                <Image src="/assets/images/main/dev_09.png" alt="CS" width={50} height={50} />
                <span>CS</span>
              </Link>
            </li>
          </ul>
          <div className="search_box">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            <li>
              <Link href="/teacher-lists/생활코딩">
                <Image src="/assets/images/main/logo01.jpg" alt="강사" width={100} height={100} />
                <div className="txt_box">
                  <span>생활코딩</span>
                  <p>프로그래밍 기초부터 고급까지, 누구나 쉽게 배울 수 있는 강좌 제공</p>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/teacher-lists/드림코딩">
                <Image src="/assets/images/main/logo02.jpg" alt="강사" width={100} height={100} />
                <div className="txt_box">
                  <span>드림코딩</span>
                  <p>초보자를 위한 친절한 강의로 웹 개발 전반을 배울 수 있어요</p>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/teacher-lists/조코딩">
                <Image src="/assets/images/main/logo03.jpg" alt="강사" width={100} height={100} />
                <div className="txt_box">
                  <span>조코딩</span>
                  <p>파이썬과 AI, 데이터 분석 등 최신 기술을 다루는 실용적 강좌</p>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/teacher-lists/코딩 알려주는 누나">
                <Image src="/assets/images/main/logo04.jpg" alt="강사" width={100} height={100} />
                <div className="txt_box">
                  <span>코딩 알려주는 누나</span>
                  <p>비전공자도 쉽게 접근할 수 있는 다양한 프로그래밍 강좌</p>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/teacher-lists/애플코딩">
                <Image src="/assets/images/main/logo05.jpg" alt="강사" width={100} height={100} />
                <div className="txt_box">
                  <span>애플코딩</span>
                  <p>iOS 개발자와 앱 개발자를 위한 Swift와 다양한 앱 개발 강의</p>
                </div>
              </Link>
            </li>
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
