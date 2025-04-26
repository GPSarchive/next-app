'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Slider, { Settings as SlickSettings } from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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
    className="absolute top-1/2 left-2.5 transform -translate-y-1/2 bg-transparent text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition-colors duration-300 z-10 hover:bg-black/80"
    onClick={onClick}
    aria-label="Previous Slide"
  >
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
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
    className="absolute top-1/2 right-2.5 transform -translate-y-1/2 bg-transparent text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition-colors duration-300 z-10 hover:bg-black/80"
    onClick={onClick}
    aria-label="Next Slide"
  >
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
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
    <Link
      href={`/houses/${house.id}`}
      className="group relative w-full overflow-hidden rounded-lg border-[0px] border-black shadow-lg"
      onMouseEnter={() => onHover(house)}
    >
      <Slider {...settings}>
        {house.images.map((img, index) => (
          <figure
            key={index}
            className="relative w-full h-64 overflow-hidden -mb-[10px] p-0 flex items-center justify-center rounded-lg"
          >
            <Image
              src={img.src}
              alt={img.alt ?? `${house.title} — image ${index + 1}`}
              width={1200}
              height={800}
              className="w-full h-full objec"
              priority={index === 0}
            />
            <figcaption className="hidden">
              {house.title} — {house.price}
            </figcaption>
            <div
            className="
              absolute bottom-0 left-0 w-full h-16
              bg-gradient-to-t from-black/80 to-transparent
              pointer-events-none rounded-b-lg
              opacity-0
              transition-opacity duration-300 ease-in-out
               group-hover:opacity-100" />
          </figure>
        ))}
      </Slider>

        <div className="
        absolute bottom-0 left-0 w-full
        bg-gradient-to-t from-black/80 to-transparent 
        text-white p-2.5
        opacity-0 transition-opacity duration-300 ease-in-out
        group-hover:opacity-100"
        >
        <h3 className="text-lg font-semibold">{house.title}</h3>
        <p className="text-sm">{house.price}</p>
      </div>
    </Link>
  );
};

export default HouseCarousel;