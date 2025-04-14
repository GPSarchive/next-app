'use client';

import { useState, useEffect } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/app/firebase/firebaseConfig';
import { House } from '@/app/types/house';
import HouseForm from '@/app/components/AdminPageComponents/HouseForm';
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
          setHouses(housesResult.data.houses);
  
          const getUsers = httpsCallable<void, { users: User[] }>(functions, 'getUsers');
          const usersResult = await getUsers();
          setUsers(usersResult.data.users);
        } catch (err: any) {
          setError(err.message);
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
        setHouses(housesResult.data.houses);
        setEditingHouse(null);
      } catch (err: any) {
        setError(err.message);
      }
    };
  
    const deleteHouse = async (id: string) => {
      if (confirm('Are you sure you want to delete this house?')) {
        try {
          const deleteHouseFunc = httpsCallable<{ id: string }, { success: boolean }>(functions, 'deleteHouse');
          await deleteHouseFunc({ id });
          const getHouses = httpsCallable<void, { houses: House[] }>(functions, 'getHouses');
          const housesResult = await getHouses();
          setHouses(housesResult.data.houses);
        } catch (err: any) {
          setError(err.message);
        }
      }
    };
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
  
    return (
      <div>
        <h1>Admin Dashboard</h1>
        <button onClick={() => setEditingHouse('new')}>Add New House</button>
        <ul>
          {houses.map(house => (
            <li key={house.id}>
              {house.title}
              <button onClick={() => setEditingHouse(house)}>Edit</button>
              <button onClick={() => deleteHouse(house.id)}>Delete</button>
            </li>
          ))}
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

