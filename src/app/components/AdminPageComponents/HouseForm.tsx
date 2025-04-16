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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
      allowedUsers: name === 'isPublic' && checked ? [] : prev.allowedUsers,
    }));
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setFormData(prev => ({ ...prev, allowedUsers: selected }));
  };

  const handleImageChange = (index: number, field: 'src' | 'alt', value: string) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages[index] = { ...newImages[index], [field]: value };
      return { ...prev, images: newImages };
    });
  };

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { src: '', alt: '' }],
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      location: { latitude: formData.latitude, longitude: formData.longitude },
      allowedUsers: formData.isPublic ? [] : formData.allowedUsers,
    };
    onSave(dataToSave);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input type="text" name="title" value={formData.title} onChange={handleChange} />
      </label>
      <label>
        Description:
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </label>
      <label>
        Price:
        <input type="text" name="price" value={formData.price} onChange={handleChange} />
      </label>
      <label>
        Bedrooms:
        <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} />
      </label>
      <label>
        Category:
        <input type="text" name="category" value={formData.category} onChange={handleChange} />
      </label>
      <label>
        Energy Class:
        <input type="text" name="energyClass" value={formData.energyClass} onChange={handleChange} />
      </label>
      <label>
        Floor:
        <input type="text" name="floor" value={formData.floor} onChange={handleChange} />
      </label>
      <label>
        Has Heating:
        <input type="checkbox" name="hasHeating" checked={formData.hasHeating === 'Yes'} onChange={e => setFormData(prev => ({ ...prev, hasHeating: e.target.checked ? 'Yes' : 'No' }))} />
      </label>
      <label>
        Heating Type:
        <input type="text" name="heatingType" value={formData.heatingType} onChange={handleChange} />
      </label>
      <label>
        Kitchens:
        <input type="text" name="kitchens" value={formData.kitchens} onChange={handleChange} />
      </label>
      <label>
        Latitude:
        <input type="number" name="latitude" value={formData.latitude} onChange={handleChange} />
      </label>
      <label>
        Longitude:
        <input type="number" name="longitude" value={formData.longitude} onChange={handleChange} />
      </label>
      <label>
        Parking:
        <input type="text" name="parking" value={formData.parking} onChange={handleChange} />
      </label>
      <label>
        Size:
        <input type="text" name="size" value={formData.size} onChange={handleChange} />
      </label>
      <label>
        Special Features:
        <input type="text" name="specialFeatures" value={formData.specialFeatures} onChange={handleChange} />
      </label>
      <label>
        Suitable For:
        <input type="text" name="suitableFor" value={formData.suitableFor} onChange={handleChange} />
      </label>
      <label>
        Window Type:
        <input type="text" name="windowType" value={formData.windowType} onChange={handleChange} />
      </label>
      <label>
        Year Built:
        <input type="text" name="yearBuilt" value={formData.yearBuilt} onChange={handleChange} />
      </label>
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