'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '@/styles/pages/home/home.scss';
import Image from 'next/image';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';

export default function Home() {
  return (
    <>
      <section className='section sec01'>
        <h2 className='dn'>메인 슬라이드 화면</h2>
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
              <p>This is the first slide content</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide-content">
              <h2>Slide 2</h2>
              <p>This is the second slide content</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide-content">
              <h2>Slide 3</h2>
              <p>This is the third slide content</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide-content">
              <h2>Slide 4</h2>
              <p>This is the fourth slide content</p>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>
      <section className="section sec02">
        <h2 className='dn'>강의 목록</h2>
        <div className="inner">
          <ul className='dev_list'>
            <li>
              <Link href="#">
                <Image src="/assets/images/main/dev_01.png" alt="언어" width={60} height={60} />
                <span>언어</span>
              </Link>
            </li>
            <li>
              <Link href="#">
                <Image src="/assets/images/main/dev_02.png" alt="게임개발" width={60} height={60} />
                <span>게임개발</span>
              </Link>
            </li>
            <li>
              <Link href="#">
                <Image src="/assets/images/main/dev_03.png" alt="백엔드" width={60} height={60} />
                <span>백엔드</span>
              </Link>
            </li>
            <li>
              <Link href="#">
                <Image src="/assets/images/main/dev_04.png" alt="모바일" width={60} height={60} />
                <span>모바일</span>
              </Link>
            </li>
            <li>
              <Link href="#">
                <Image src="/assets/images/main/dev_05.png" alt="프론트엔드" width={60} height={60} />
                <span>프론트엔드</span>
              </Link>
            </li>
            <li>
              <Link href="#">
                <Image src="/assets/images/main/dev_06.png" alt="데이터" width={60} height={60} />
                <span>데이터</span>
              </Link>
            </li>
            <li>
              <Link href="#">
                <Image src="/assets/images/main/dev_07.png" alt="인공지능" width={60} height={60} />
                <span>인공지능</span>
              </Link>
            </li>
            <li>
              <Link href="#">
                <Image src="/assets/images/main/dev_08.png" alt="보안" width={60} height={60} />
                <span>보안</span>
              </Link>
            </li>
            <li>
              <Link href="#">
                <Image src="/assets/images/main/dev_09.png" alt="CS" width={60} height={60} />
                <span>CS</span>
              </Link>
            </li>
          </ul>
          <div className="search_box">
            <input type="text" placeholder="검색어를 입력하세요" />
            <button type="button"><FiSearch size={20} /></button>
          </div>
        </div>
      </section>
      <section className='section sec03'></section>
      <section className='section sec04'></section>
    </>
  );
}
