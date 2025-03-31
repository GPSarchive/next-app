'use client';

import Link from 'next/link';
import Slider, { Settings as SlickSettings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from '@/app/components/HouseCarousel.module.css';
import { SetStateAction, useState } from 'react';

interface Image {
  src: string;
  alt?: string;
}

interface House {
  firestoreId: string;
  title: string;
  price: string;
  images: Image[];
}

interface HouseCarouselProps {
  house: House;
  onHover: (house: House) => void;
}

interface ArrowProps {
  onClick?: () => void;
}

const CustomPrevArrow: React.FC<ArrowProps> = ({ onClick }) => (
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

const CustomNextArrow: React.FC<ArrowProps> = ({ onClick }) => (
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

const HouseCarousel: React.FC<HouseCarouselProps> = ({ house, onHover }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

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
    beforeChange: (_: any, next: SetStateAction<number>) => setCurrentIndex(next),
  };

  return (
    <Link href={`/houses/${house.firestoreId}`}>
      <div className={styles.carousel} onMouseEnter={() => onHover(house)}>
        <Slider {...settings}>
          {house.images.map((img, index) => (
            <figure key={index} className={styles.carouselSlide}>
              <img
                src={img.src}
                alt={img.alt || `${house.title} - Image ${index + 1}`}
                className={styles.carouselImage}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              <figcaption className="sr-only">
                {house.title} - {house.price}
              </figcaption>
              <div className={styles.gradientOverlay}></div>
            </figure>
          ))}
        </Slider>
        <div className={styles.overlay}>
          <h3>{house.title}</h3>
          <p>{house.price}</p>
        </div>
      </div>
    </Link>
  );
};

export default HouseCarousel;
