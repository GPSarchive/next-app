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

  useEffect(() => {
    async function fetchData() {
      try {
        const getHouses = httpsCallable<void, { houses: House[] }>(functions, 'getHouses');
        const housesResult = await getHouses();
        setHouses(housesResult.data.houses || []);

        const getUsers = httpsCallable<void, { users: User[] }>(functions, 'getUsers');
        const usersResult = await getUsers();
        setUsers(usersResult.data.users || []);
      } catch (err: any) {
        setError(err.message || 'Fetch error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const saveHouse = async (house: House) => {
    try {
      if (house.id) {
        await httpsCallable<House, { success: boolean }>(functions, 'updateHouse')(house);
      } else {
        const result = await httpsCallable<House, { id: string }>(functions, 'addHouse')(house);
        house.id = result.data.id;
      }
      const fresh = await httpsCallable<void, { houses: House[] }>(functions, 'getHouses')();
      setHouses(fresh.data.houses || []);
      setEditingHouse(null);
    } catch (err: any) {
      setError(err.message || 'Save error');
    }
  };

  const deleteHouse = async (id: string) => {
    if (!confirm('Delete this house?')) return;
    try {
      await httpsCallable<{ id: string }, { success: boolean }>(functions, 'deleteHouse')({ id });
      const fresh = await httpsCallable<void, { houses: House[] }>(functions, 'getHouses')();
      setHouses(fresh.data.houses || []);
    } catch (err: any) {
      setError(err.message || 'Delete error');
    }
  };

  if (loading) return <div>Loading…</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={() => setEditingHouse('new')}>Add New House</button>
      <ul>
        {houses.map(h => (
          <li key={h.id}>
            {h.title || 'Untitled'}
            <button onClick={() => setEditingHouse(h)}>Edit</button>
            <button onClick={() => deleteHouse(h.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {editingHouse && (
        <HouseForm
          key={editingHouse === 'new' ? 'new' : editingHouse.id}
          house={editingHouse === 'new' ? null : editingHouse}
          users={users}
          onSave={saveHouse}
          onCancel={() => setEditingHouse(null)}
        />
      )}
    </div>
  );
}
