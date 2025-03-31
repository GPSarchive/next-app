import Image from 'next/image';

type House = {
  id: string;
  title: string;
  price: string;
  images: Array<{ src: string; alt?: string }>;
};

type ViewState = {
  latitude: number;
  longitude: number;
  zoom: number;
};

type MapComponentSSRProps = {
  houses: House[];
  viewState: ViewState;
};

export default function MapComponentSSR({ houses, viewState }: MapComponentSSRProps) {
  return (
    <div className="w-full bg-gray-100 border rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Map Preview</h2>
      <p className="text-gray-600 mb-4">
        Showing listings near lat: {viewState.latitude}, long: {viewState.longitude}
      </p>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {houses.map((house) => (
          <li key={house.id} className="flex items-start gap-4">
            <Image
              src={house.images[0]?.src || '/placeholder.jpg'}
              alt={house.images[0]?.alt || house.title}
              width={120}
              height={80}
              className="object-cover rounded-md"
            />
            <div>
              <h3 className="font-medium">{house.title}</h3>
              <p className="text-sm text-gray-500">{house.price}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
