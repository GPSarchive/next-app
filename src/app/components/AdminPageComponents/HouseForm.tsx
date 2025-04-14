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

export default function HouseForm({ house, users, onSave, onCancel }: HouseFormProps) {
  const [formData, setFormData] = useState<House>(house || {
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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: House) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev: House) => ({ ...prev, [name]: checked }));
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setFormData((prev: House) => ({ ...prev, allowedUsers: selected }));
  };

  const handleImageChange = (index: number, field: 'src' | 'alt', value: string) => {
    setFormData((prev: House) => {
      const newImages = [...prev.images];
      newImages[index] = { ...newImages[index], [field]: value };
      return { ...prev, images: newImages };
    });
  };

  const addImage = () => {
    setFormData((prev: House) => ({
      ...prev,
      images: [...prev.images, { src: '', alt: '' }],
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev: House) => ({
      ...prev,
      images: prev.images.filter((image: { src: string; alt: string }, i: number) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, location: { latitude: formData.latitude, longitude: formData.longitude } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input type="text" name="title" value={formData.title} onChange={handleChange} />
      </label>
      {/* Add similar inputs for all fields: bedrooms, category, description, etc. */}
      <label>
        Is Public:
        <input type="checkbox" name="isPublic" checked={formData.isPublic} onChange={handleCheckboxChange} />
      </label>
      {!formData.isPublic && (
        <label>
          Allowed Users:
          <select multiple name="allowedUsers" value={formData.allowedUsers} onChange={handleMultiSelectChange}>
            {users.map(user => (
              <option key={user.uid} value={user.uid}>
                {user.displayName || user.email}
              </option>
            ))}
          </select>
        </label>
      )}
      <h3>Images</h3>
      {formData.images.map((image, index) => (
        <div key={index}>
          <label>
            Image {index + 1} SRC:
            <input type="text" value={image.src} onChange={e => handleImageChange(index, 'src', e.target.value)} />
          </label>
          <label>
            Image {index + 1} ALT:
            <input type="text" value={image.alt} onChange={e => handleImageChange(index, 'alt', e.target.value)} />
          </label>
          <button type="button" onClick={() => removeImage(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={addImage}>Add Image</button>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}