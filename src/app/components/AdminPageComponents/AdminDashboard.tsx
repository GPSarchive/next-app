'use client';

import { useState, useEffect } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/app/firebase/firebaseConfig';
import { House } from '@/app/types/house';
import HouseForm from '@/app/components/AdminPageComponents/HouseForm';

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

  if (loading) return <div className="max-w-4xl mx-auto p-6 text-center text-gray-500">Loading…</div>;
  if (error)   return <div className="max-w-4xl mx-auto p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
        onClick={() => setEditingHouse('new')}
      >
        Add New House
      </button>

      <ul className="space-y-4">
        {houses.length > 0 ? (
          houses.map(h => (
            <li key={h.id} className="flex justify-between items-center p-4 bg-white rounded shadow">
              {h.title || 'Untitled'}
              <span className="space-x-2">
                <button
                  onClick={() => setEditingHouse(h)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteHouse(h.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </span>
            </li>
          ))
        ) : (
          <li className="w-full text-center text-gray-500">No houses available.</li>
        )}
      </ul>

      {editingHouse !== null && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">
            {editingHouse === 'new' ? 'Add New House' : 'Edit House'}
          </h2>
          <HouseForm
            house={editingHouse === 'new' ? null : editingHouse}
            users={users}
            onSave={saveHouse}
            onCancel={() => setEditingHouse(null)}
          />
        </div>
      )}
    </div>
  );
}