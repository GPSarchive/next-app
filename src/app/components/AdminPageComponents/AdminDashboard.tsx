'use client';

import { useState, useEffect } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/app/firebase/firebaseConfig';
import { House } from '@/app/types/house';
import HouseForm from '@/app/components/AdminPageComponents/HouseForm';
import styles from './AdminDashboard.module.css';

interface User {
  uid: string;
  email: string;
  displayName?: string;
}

export default function AdminDashboard() {
  const [houses, setHouses] = useState<House[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingHouse, setEditingHouse] = useState<House | 'new' | null>(null);

  // Fetch houses + users on mount
  useEffect(() => {
    async function fetchData() {
      try {
        // getHouses -> returns House[]
        const getHousesFn = httpsCallable<void, House[]>(functions, 'getHouses');
        const housesResult = await getHousesFn();
        if (Array.isArray(housesResult.data)) {
          setHouses(
            housesResult.data.map(h => ({
              ...h,
              // ensure lat/lng are numbers
              location: {
                latitude: Number(h.location.latitude),
                longitude: Number(h.location.longitude),
              },
            }))
          );
        } else {
          throw new Error('Unexpected getHouses response');
        }

        // getUsers -> returns { users: User[] }
        const getUsersFn = httpsCallable<void, { users: User[] }>(functions, 'getUsers');
        const usersResult = await getUsersFn();
        if (Array.isArray(usersResult.data.users)) {
          setUsers(usersResult.data.users);
        } else {
          throw new Error('Unexpected getUsers response');
        }

      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Single onSave for both add & update
  const saveHouse = async (house: House) => {
    setLoading(true);
    try {
      if (house.id) {
        // update existing
        const updateHouseFn = httpsCallable<House, { success: boolean }>(functions, 'updateHouse');
        await updateHouseFn(house);
      } else {
        // add new
        const addHouseFn = httpsCallable<House, { id: string }>(functions, 'addHouse');
        const result = await addHouseFn(house);
        house.id = result.data.id;
      }

      // refresh list
      const getHousesFn = httpsCallable<void, House[]>(functions, 'getHouses');
      const fresh = await getHousesFn();
      if (Array.isArray(fresh.data)) {
        setHouses(
          fresh.data.map(h => ({
            ...h,
            location: {
              latitude: Number(h.location.latitude),
              longitude: Number(h.location.longitude),
            },
          }))
        );
      } else {
        throw new Error('Failed to refresh houses');
      }
      setEditingHouse(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save house.');
    } finally {
      setLoading(false);
    }
  };

  const deleteHouse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this house?')) return;
    setLoading(true);
    try {
      const deleteHouseFn = httpsCallable<{ id: string }, { success: boolean }>(
        functions,
        'deleteHouse'
      );
      await deleteHouseFn({ id });

      // refresh list
      const getHousesFn = httpsCallable<void, House[]>(functions, 'getHouses');
      const fresh = await getHousesFn();
      if (Array.isArray(fresh.data)) {
        setHouses(fresh.data);
      } else {
        throw new Error('Failed to refresh houses');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to delete house.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.message}>Loading…</div>;
  if (error)   return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Admin Dashboard</h1>
      <button
        className={styles.buttonAdd}
        onClick={() => setEditingHouse('new')}
      >
        Add New House
      </button>

      <ul className={styles.houseList}>
        {houses.length > 0 ? (
          houses.map(h => (
            <li key={h.id} className={styles.houseItem}>
              {h.title || 'Untitled'}
              <span className={styles.actions}>
                <button onClick={() => setEditingHouse(h)}>Edit</button>
                <button onClick={() => deleteHouse(h.id)}>Delete</button>
              </span>
            </li>
          ))
        ) : (
          <li>No houses available.</li>
        )}
      </ul>

      {editingHouse !== null && (
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
