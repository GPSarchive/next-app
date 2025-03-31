"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/effect-fade";
import { Navigation, FreeMode, Autoplay } from "swiper/modules";
import Modal from "./Modal";
import styles from "./Gallery.module.css";
import type { Swiper as SwiperInstance } from "swiper";

interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryProps {
  images: GalleryImage[];
}

export default function Gallery({ images }: GalleryProps): JSX.Element {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const mainSwiperRef = useRef<SwiperInstance | null>(null);
  const thumbSwiperRef = useRef<SwiperInstance | null>(null);

  useEffect(() => {
    if (thumbSwiperRef.current) {
      thumbSwiperRef.current.slideToLoop(selectedIndex, 600);
    }
  }, [selectedIndex]);

  return (
    <div className={styles.container}>
      {/* Main Carousel */}
      <div className={styles.mainCarouselContainer}>
        <Swiper
          onSwiper={(swiper: SwiperInstance) => (mainSwiperRef.current = swiper)}
          onSlideChange={(swiper: SwiperInstance) => setSelectedIndex(swiper.realIndex)}
          navigation={true}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          speed={600}
          modules={[Navigation, Autoplay]}
          className={styles.mainCarousel}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} onClick={() => setIsModalOpen(true)}>
              <Image
                src={image.src}
                alt={image.alt}
                width={600}
                height={400}
                className={styles.mainImage}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Thumbnail Carousel */}
      <div className={styles.thumbnailWrapper}>
        <Swiper
          onSwiper={(swiper: SwiperInstance) => (thumbSwiperRef.current = swiper)}
          freeMode={true}
          slidesPerView={7}
          spaceBetween={2}
          loop={true}
          modules={[FreeMode]}
          className={styles.thumbnailContainer}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div
                onClick={() => {
                  setSelectedIndex(index);
                  if (mainSwiperRef.current) {
                    mainSwiperRef.current.slideToLoop(index);
                  }
                }}
                className={`${styles.thumbnail} ${
                  selectedIndex === index ? styles.selectedThumbnail : ""
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  layout="fill"
                  objectFit="cover"
                  className={styles.mainImage}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        image={images[selectedIndex]}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
