"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/effect-fade";
import { Navigation, FreeMode, Autoplay } from "swiper/modules";
import Modal from "./Modal"; // Ensure you have a Modal component in the same folder

import styles from "./Gallery.module.css";

// Define a type for your image objects
export interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryProps {
  images: GalleryImage[];
}

export default function Gallery({ images }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const mainSwiperRef = useRef<any>(null);
  const thumbSwiperRef = useRef<any>(null);

  useEffect(() => {
    if (mainSwiperRef.current && thumbSwiperRef.current) {
      thumbSwiperRef.current.slideToLoop(selectedIndex, 600);
    }
  }, [selectedIndex]);

  return (
    <div className={styles.container}>
      {/* Main Carousel */}
      <div className={styles.mainCarouselContainer}>
        <Swiper
          onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
          onSlideChange={(swiper) => setSelectedIndex(swiper.realIndex)}
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
            <SwiperSlide style={{ width: "100px" }} key={index} onClick={() => setIsModalOpen(true)}>
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
          onSwiper={(swiper) => (thumbSwiperRef.current = swiper)}
          
          freeMode={true}
          slidesPerView={6}
          spaceBetween={1}
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
                  fill={true}
                  
                  className={styles.thumbnailImage}
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
