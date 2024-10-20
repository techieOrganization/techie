'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '@/styles/pages/home/home.scss';

export default function Home() {
  return (
    <>
      <section className='section sec01'>
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

      <section className='section sec02'></section>
      <section className='section sec03'></section>
      <section className='section sec04'></section>
    </>
  );
}
