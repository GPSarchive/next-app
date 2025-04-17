'use client';

import { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/app/firebase/firebaseConfig';
import { House } from '@/app/types/house';
import styles from './HouseForm.module.css';

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(options[i].value);
    }
    setFormData((prev) => ({ ...prev, allowedUsers: selected }));
  };

  // ─── UPDATES START ───
  // Toggle a single user in allowedUsers
  const handleToggleUser = async (uid: string) => {
    // New house: just update local state
    if (!formData.id) {
      setFormData((prev) => ({
        ...prev,
        allowedUsers: prev.allowedUsers.includes(uid)
          ? prev.allowedUsers.filter((u) => u !== uid)
          : [...prev.allowedUsers, uid],
      }));
      return;
    }

    // Existing house: call Cloud Function
    const fnName = formData.allowedUsers.includes(uid)
      ? 'removeAllowedUser'
      : 'addAllowedUser';
    const callable = httpsCallable<{ houseId: string; uid: string }, { success: boolean }>(
      functions,
      fnName
    );
    await callable({ houseId: formData.id, uid });

    // Update local state
    setFormData((prev) => ({
      ...prev,
      allowedUsers: prev.allowedUsers.includes(uid)
        ? prev.allowedUsers.filter((u) => u !== uid)
        : [...prev.allowedUsers, uid],
    }));
  };
  // ─── UPDATES END ───

  const handleImageChange = (index: number, field: 'src' | 'alt', value: string) => {
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
      location: { latitude: formData.latitude, longitude: formData.longitude },
      allowedUsers: formData.isPublic ? [] : formData.allowedUsers,
    };
    onSave(dataToSave);
  };

  
  

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.label}>
        Title:
        <input type="text" name="title" value={formData.title} onChange={handleChange} className={styles.input} />
      </label>

      <label className={styles.label}>
        Description:
        <textarea name="description" value={formData.description} onChange={handleChange} className={styles.textarea} />
      </label>

      <label className={styles.label}>
        Price:
        <input type="text" name="price" value={formData.price} onChange={handleChange} className={styles.input} />
      </label>

      <label className={styles.label}>
        Bedrooms:
        <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className={styles.number} />
      </label>

      <label className={styles.label}>
        Category:
        <input type="text" name="category" value={formData.category} onChange={handleChange} className={styles.input} />
      </label>

      <label className={styles.label}>
        Energy Class:
        <input type="text" name="energyClass" value={formData.energyClass} onChange={handleChange} className={styles.input} />
      </label>

      <label className={styles.label}>
        Floor:
        <input type="text" name="floor" value={formData.floor} onChange={handleChange} className={styles.input} />
      </label>

      <label className={styles.label}>
        Has Heating:
        <input type="checkbox" name="hasHeating" checked={formData.hasHeating === 'Yes'} onChange={(e) => setFormData((prev) => ({ ...prev, hasHeating: e.target.checked ? 'Yes' : 'No' }))} className={styles.checkbox} />
      </label>

      <label className={styles.label}>
        Heating Type:
        <input type="text" name="heatingType" value={formData.heatingType} onChange={handleChange} className={styles.input} />
      </label>

      <label className={styles.label}>
        Kitchens:
        <input type="text" name="kitchens" value={formData.kitchens} onChange={handleChange} className={styles.input} />
      </label>

      <label className={styles.label}>
        Latitude:
        <input type="number" name="latitude" value={formData.latitude} onChange={handleChange} className={styles.number} />
      </label>

      <label className={styles.label}>
        Longitude:
        <input type="number" name="longitude" value={formData.longitude} onChange={handleChange} className={styles.number} />
      </label>

      <label className={styles.label}>
        Parking:
        <input type="text" name="parking" value={formData.parking} onChange={handleChange} className={styles.input} />
      </label>

      <label className={styles.label}>
        Size:
        <input type="text" name="size" value={formData.size} onChange={handleChange} className={styles.input} />
      </label>

      <label className={styles.label}>
        Special Features:
        <input type="text" name="specialFeatures" value={formData.specialFeatures} onChange={handleChange} className={styles.input} />
      </label>

      <label className={styles.label}>
        Suitable For:
        <input type="text" name="suitableFor" value={formData.suitableFor} onChange={handleChange} className={styles.input} />
      </label>

      <label className={styles.label}>
        Window Type:
        <input type="text" name="windowType" value={formData.windowType} onChange={handleChange} className={styles.input} />
      </label>

      <label className={styles.label}>
        Year Built:
        <input type="text" name="yearBuilt" value={formData.yearBuilt} onChange={handleChange} className={styles.input} />
      </label>

      <label className={styles.label}>
        Is Public:
        <input type="checkbox" name="isPublic" checked={formData.isPublic} onChange={handleCheckboxChange} className={styles.checkbox} />
      </label>

      {!formData.isPublic && (
        <fieldset className={styles.allowedUsers}>
          <legend>Allowed Users</legend>
          {users.map((u) => (
            <label key={u.uid} className={styles.userRow}>
              <input
                type="checkbox"
                checked={formData.allowedUsers.includes(u.uid)}
                onChange={() => handleToggleUser(u.uid)}
              />
              {u.displayName || u.email}
            </label>
          ))}
        </fieldset>
        )}
      <h3>Images</h3>
      {formData.images.map((image, index) => (
        <div key={index} className={styles.imageRow}>
          <label>
            Src:
            <input type="text" value={image.src} onChange={(e) => handleImageChange(index, 'src', e.target.value)} className={styles.input} />
          </label>
          <label>
            Alt:
            <input type="text" value={image.alt} onChange={(e) => handleImageChange(index, 'alt', e.target.value)} className={styles.input} />
          </label>
          <button type="button" onClick={() => removeImage(index)} className={styles.buttonRemoveImage}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={addImage} className={styles.buttonAddImage}>Add Image</button>
      <button type="submit" className={styles.buttonSave}>Save</button>
      <button type="button" onClick={onCancel} className={styles.buttonCancel}>Cancel</button>
    </form>
  );
}
