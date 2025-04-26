// src/app/components/DetailsPageComponents/DetailsContent.js
'use client';

import Gallery from '@/app/components/DetailsPageComponents/Gallery';
import PropertyDetails from '@/app/components/DetailsPageComponents/PropertyDetails';
import PropertyDescription from '@/app/components/DetailsPageComponents/PropertyDescription';
import DetailsMap from '@/app/components/DetailsPageComponents/DetailsMap';

export default function DetailsContent({ property }) {
  return (
    <main className="flex flex-col gap-8 min-h-screen bg-[#D6D2C4] pt-0 pb-44 px-44">
      {/* Gallery */}
      <Gallery
        images={property.images.map((image, i) => ({
          src: image.src,
          alt: image.alt || `Property image ${i + 1}`,
        }))}
      />

      {/* detailsMapContainer */}
      <div className="flex flex-row gap-8 h-[500px] w-full">
        {/* detailsWrapper */}
        <div className="flex-1 bg-[#D6D2C4] p-4 w-1/2">
          <PropertyDetails property={property} />
        </div>

        {/* mapWrapper */}
        <div className="w-[63%] h-[500px] mt-5">
          <DetailsMap
            location={property.location}
            title={property.title}
          />
        </div>
      </div>

      {/* descriptionWrapper */}
      <div className="bg-[#D6D2C4] p-4 overflow-hidden transition-[max-height] duration-500 ease-in-out">
        <PropertyDescription description={property.description || ''} />
      </div>
    </main>
  );
}