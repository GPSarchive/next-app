'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Slider, { Settings as SlickSettings } from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import styles from '@/app/components/ListingsPageComponents/HouseCarousel.module.css';

type HouseImage = {
  src: string;
  alt?: string;
};

type House = {
  id: string;
  title: string;
  price: string;
  images: HouseImage[];
};

type HouseCarouselProps = {
  house: House;
  onHover: (house: House) => void;
};

type ArrowProps = {
  onClick?: () => void;
};

const CustomPrevArrow = ({ onClick }: ArrowProps) => (
  <button
    className={`${styles.arrow} ${styles.prevArrow}`}
    onClick={onClick}
    aria-label="Previous Slide"
  >
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  </button>
);

const CustomNextArrow = ({ onClick }: ArrowProps) => (
  <button
    className={`${styles.arrow} ${styles.nextArrow}`}
    onClick={onClick}
    aria-label="Next Slide"
  >
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  </button>
);

const HouseCarousel = ({ house, onHover }: HouseCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const settings: SlickSettings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    beforeChange: (_: number, next: number) => setCurrentIndex(next),
  };

  return (
    <Link href={`/houses/${house.id}`}>
      <a
        className={styles.carousel}
        onMouseEnter={() => onHover(house)}
      >
        <Slider {...settings}>
          {house.images.map((img, index) => (
            <figure key={index} className={styles.carouselSlide}>
              <Image
                src={img.src}
                alt={img.alt ?? `${house.title} — image ${index + 1}`}
                width={1200}
                height={800}
                className={styles.carouselImage}
                priority={index === 0}
              />
              <figcaption className="sr-only">
                {house.title} — {house.price}
              </figcaption>
              <div className={styles.gradientOverlay} />
            </figure>
          ))}
        </Slider>
        <div className={styles.overlay}>
          <h3>{house.title}</h3>
          <p>{house.price}</p>
        </div>
      </a>
    </Link>
  );
};

export default HouseCarousel;
