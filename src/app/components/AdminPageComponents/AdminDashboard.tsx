import { useState, useEffect } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/app/firebase/firebaseConfig';
import { House } from '@/app/types/house';
import HouseForm from '@/app/components/AdminPageComponents/HouseForm';
import styles from './AdminDashboard.module.css';

interface User {
  uid: string;
  email: string;
  displayName: string;
}

export default function AdminDashboard() {
  const [houses, setHouses] = useState<House[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingHouse, setEditingHouse] = useState<House | 'new' | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const getHouses = httpsCallable<void, { houses: House[] }>(functions, 'getHouses');
        const housesResult = await getHouses();

        let housesData: House[] = [];
        if (Array.isArray(housesResult.data)) {
          housesData = housesResult.data.map(house => ({
            ...house,
            location: {
              ...house.location,
              longitude: Number(house.location.longitude),
            },
          }));
        } else if (housesResult.data && Array.isArray(housesResult.data.houses)) {
          housesData = housesResult.data.houses.map(house => ({
            ...house,
            location: {
              ...house.location,
              longitude: Number(house.location.longitude),
            },
          }));
        } else {
          setError("Failed to load houses: invalid data format.");
        }
        setHouses(housesData);

        const getUsers = httpsCallable<void, { users: User[] }>(functions, 'getUsers');
        const usersResult = await getUsers();
        if (usersResult.data && Array.isArray(usersResult.data.users)) {
          setUsers(usersResult.data.users);
        } else {
          setError("Failed to load users: invalid data format.");
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching data.');
        setHouses([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const saveHouse = async (house: House) => {
    try {
      if (house.id) {
        const updateHouse = httpsCallable<House, { success: boolean }>(functions, 'updateHouse');
        await updateHouse(house);
      } else {
        const addHouse = httpsCallable<House, { id: string }>(functions, 'addHouse');
        const result = await addHouse(house);
        house.id = result.data.id;
      }
      const getHouses = httpsCallable<void, { houses: House[] }>(functions, 'getHouses');
      const housesResult = await getHouses();
      if (housesResult.data && Array.isArray(housesResult.data.houses)) {
        setHouses(housesResult.data.houses);
      } else {
        setError("Failed to refresh houses after save.");
      }
      setEditingHouse(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the house.');
    }
  };

  const deleteHouse = async (id: string) => {
    if (confirm('Are you sure you want to delete this house?')) {
      try {
        const deleteHouseFunc = httpsCallable<{ id: string }, { success: boolean }>(functions, 'deleteHouse');
        await deleteHouseFunc({ id });
        const getHouses = httpsCallable<void, { houses: House[] }>(functions, 'getHouses');
        const housesResult = await getHouses();
        if (housesResult.data && Array.isArray(housesResult.data.houses)) {
          setHouses(housesResult.data.houses);
        } else {
          setError("Failed to refresh houses after delete.");
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while deleting the house.');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Admin Dashboard</h1>
      <button className={styles.buttonAdd} onClick={() => setEditingHouse('new')}>
        Add New House
      </button>
      <ul className={styles.houseList}>
        {houses.length > 0 ? (
          houses.map(house => (
            <li key={house.id} className={styles.houseItem}>
              {house.title || 'Untitled House'}
              <span>
                <button onClick={() => setEditingHouse(house)}>Edit</button>
                <button onClick={() => deleteHouse(house.id)}>Delete</button>
              </span>
            </li>
          ))
        ) : (
          <li>No houses available.</li>
        )}
      </ul>
      {editingHouse && (
        <HouseForm
          house={editingHouse === 'new' ? null : editingHouse}
          users={users}
          onSave={saveHouse}
          onCancel={() => setEditingHouse(null)}
        />
      )}
    </div>
  );
}
