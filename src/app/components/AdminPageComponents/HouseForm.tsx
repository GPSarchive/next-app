'use client';

import { useState } from 'react';
import { House } from '@/app/types/house';

interface User {
  uid: string;
  email: string;
  displayName?: string;
}

interface HouseFormProps {
  house: House | null;
  users: User[];
  onSave: (house: House) => void;
  onCancel: () => void;
}

export default function HouseForm({
  house,
  users,
  onSave,
  onCancel,
}: HouseFormProps) {
  const [formData, setFormData] = useState<House>(
    house || {
      id: '',
      title: '',
      description: '',
      price: '',
      bedrooms: 0,
      category: '',
      energyClass: '',
      floor: '',
      hasHeating: 'Yes',
      heatingType: '',
      kitchens: '1',
      latitude: 0,
      longitude: 0,
      location: { latitude: 0, longitude: 0 },
      parking: '',
      size: '',
      specialFeatures: '',
      suitableFor: '',
      windowType: '',
      yearBuilt: '',
      images: [],
      isPublic: true,
      allowedUsers: [],
    }
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
      allowedUsers: name === 'isPublic' && checked ? [] : prev.allowedUsers,
    }));
  };

  const handleMultiSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const options = e.target.options;
    const selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(options[i].value);
    }
    setFormData((prev) => ({ ...prev, allowedUsers: selected }));
  };

  const handleImageChange = (
    index: number,
    field: 'src' | 'alt',
    value: string
  ) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      newImages[index] = { ...newImages[index], [field]: value };
      return { ...prev, images: newImages };
    });
  };

  const addImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { src: '', alt: '' }],
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      location: {
        latitude: formData.latitude,
        longitude: formData.longitude,
      },
      allowedUsers: formData.isPublic ? [] : formData.allowedUsers,
    };
    onSave(dataToSave);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 bg-white p-6 rounded-2xl shadow-lg max-w-2xl mx-auto"
    >
      {/* Title */}
      <label className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">Title</span>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 p-2 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
        />
      </label>

      {/* Description */}
      <label className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">Description</span>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 p-2 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200 resize-y h-24"
        />
      </label>

      {/* Price / Bedrooms */}
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">Price</span>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">Bedrooms</span>
          <input
            type="number"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </label>
      </div>

      {/* Category / Energy */}
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">Category</span>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">Energy Class</span>
          <input
            type="text"
            name="energyClass"
            value={formData.energyClass}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </label>
      </div>

      {/* Floor / Heating */}
      <div className="grid grid-cols-2 gap-4 items-center">
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">Floor</span>
          <input
            type="text"
            name="floor"
            value={formData.floor}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="hasHeating"
            checked={formData.hasHeating === 'Yes'}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                hasHeating: e.target.checked ? 'Yes' : 'No',
              }))
            }
            className="h-5 w-5 rounded border-gray-300 focus:ring focus:ring-blue-200"
          />
          <span className="text-sm font-medium text-gray-700">Has Heating</span>
        </label>
      </div>

      {/* Heating Type / Kitchens */}
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">Heating Type</span>
          <input
            type="text"
            name="heatingType"
            value={formData.heatingType}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">Kitchens</span>
          <input
            type="text"
            name="kitchens"
            value={formData.kitchens}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </label>
      </div>

      {/* Location */}
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">Latitude</span>
          <input
            type="number"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">Longitude</span>
          <input
            type="number"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </label>
      </div>

      {/* Parking / Size */}
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">Parking</span>
          <input
            type="text"
            name="parking"
            value={formData.parking}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">Size</span>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </label>
      </div>

      {/* Special / Suitable */}
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">Special Features</span>
          <input
            type="text"
            name="specialFeatures"
            value={formData.specialFeatures}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">Suitable For</span>
          <input
            type="text"
            name="suitableFor"
            value={formData.suitableFor}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </label>
      </div>

      {/* Window / Year */}
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">Window Type</span>
          <input
            type="text"
            name="windowType"
            value={formData.windowType}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">Year Built</span>
          <input
            type="text"
            name="yearBuilt"
            value={formData.yearBuilt}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </label>
      </div>

      {/* Public / Allowed Users */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="isPublic"
          checked={formData.isPublic}
          onChange={handleCheckboxChange}
          className="h-5 w-5 rounded border-gray-300 focus:ring focus:ring-blue-200"
        />
        <span className="text-sm font-medium text-gray-700">Is Public</span>
      </div>

      {!formData.isPublic && (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-700 mb-1">
            Allowed Users
          </span>
          <select
            multiple
            name="allowedUsers"
            value={formData.allowedUsers}
            onChange={handleMultiSelectChange}
            className="mt-1 p-2 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200 h-32"
          >
            {users.map((user) => (
              <option key={user.uid} value={user.uid}>
                {user.displayName || user.email}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Images */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Images</h3>
        {formData.images.map((image, idx) => (
          <div
            key={idx}
            className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center mb-2"
          >
            <input
              type="text"
              placeholder="Src"
              value={image.src}
              onChange={(e) => handleImageChange(idx, 'src', e.target.value)}
              className="p-2 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
            />
            <input
              type="text"
              placeholder="Alt"
              value={image.alt}
              onChange={(e) => handleImageChange(idx, 'alt', e.target.value)}
              className="p-2 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
            />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addImage}
          className="px-4 py-2 mb-4 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          Add Image
        </button>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  );
}
