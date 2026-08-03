import React, { createContext, useState, useEffect } from 'react';
import localforage from 'localforage';
import { supabase } from '../config/supabaseClient';
import { defaultMembers } from '../data/seedData';

export const AppContext = createContext();

const defaultSettings = {
  eventName: 'SEGUE-ME XXXIII',
  priceWithShirt: 100,
  priceWithoutShirt: 50,
  coordinators: ['Coordenador 1', 'Coordenador 2', 'Coordenador 3', 'Coordenador 4']
};

export const AppProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data asynchronously on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const localMembers = await localforage.getItem('bastidores_members');
        const localSettings = await localforage.getItem('bastidores_settings');

        const { data: supaMembers, error: memErr } = await supabase.from('members').select('*');
        const { data: supaSettings, error: setErr } = await supabase.from('settings').select('*');

        if (memErr) console.error("Erro ao buscar membros:", memErr);
        if (setErr) console.error("Erro ao buscar configs:", setErr);

        let finalMembers = [];

        if (supaMembers && supaMembers.length > 0) {
          finalMembers = supaMembers.map(row => row.data);
          
          if (supaSettings && supaSettings.length > 0) {
             const setRow = supaSettings.find(s => s.id === 'main');
             if (setRow) setSettings(setRow.data);
          }
        }

        // Migration Check: If we have more members locally than in Supabase, upload the missing ones
        if (localMembers && localMembers.length > finalMembers.length) {
          const supaIds = finalMembers.map(m => m.id);
          const missing = localMembers.filter(m => !supaIds.includes(m.id));
          
          if (missing.length > 0) {
             const migratedMissing = missing.map(m => {
                if (m.id && m.id.includes('-')) return m;
                return { ...m, id: crypto.randomUUID() };
             });
             
             for (const m of migratedMissing) {
                await supabase.from('members').insert({ id: m.id, data: m });
                finalMembers.push(m);
             }
          }
        }
        
        // Se ainda estiver tudo vazio, usamos o seed
        if (finalMembers.length === 0) {
           const seeded = localStorage.getItem('bastidores_seeded_v3');
           if (!seeded) {
              finalMembers = defaultMembers;
              for (const m of defaultMembers) {
                 await supabase.from('members').insert({ id: m.id, data: m });
              }
              localStorage.setItem('bastidores_seeded_v3', 'true');
           }
        }

        setMembers(finalMembers);
        
        // Se configs do supabase estiverem vazias, migra do local
        if (!supaSettings || supaSettings.length === 0) {
          if (localSettings) {
            setSettings(localSettings);
            await supabase.from('settings').insert({ id: 'main', data: localSettings });
          } else {
            await supabase.from('settings').insert({ id: 'main', data: defaultSettings });
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Realtime Subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, (payload) => {
         setMembers(prev => {
            if (payload.eventType === 'INSERT') {
               if (prev.find(m => m.id === payload.new.id)) return prev;
               return [...prev, payload.new.data];
            }
            if (payload.eventType === 'UPDATE') {
               return prev.map(m => m.id === payload.new.id ? payload.new.data : m);
            }
            if (payload.eventType === 'DELETE') {
               return prev.filter(m => m.id !== payload.old.id);
            }
            return prev;
         });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, (payload) => {
         if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            setSettings(payload.new.data);
         }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateSettings = async (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await supabase.from('settings').upsert({ id: 'main', data: updated });
  };

  const addMember = async (member) => {
    const newMember = { ...member, id: member.id || crypto.randomUUID() };
    setMembers(prev => [...prev, newMember]);
    await supabase.from('members').insert({ id: newMember.id, data: newMember });
  };

  const updateMember = async (id, updatedData) => {
    setMembers(prev => {
       const newArray = prev.map(m => m.id === id ? { ...m, ...updatedData } : m);
       const updatedMember = newArray.find(m => m.id === id);
       supabase.from('members').update({ data: updatedMember }).eq('id', id);
       return newArray;
    });
  };

  const deleteMember = async (id) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    await supabase.from('members').delete().eq('id', id);
  };

  return (
    <AppContext.Provider value={{
      settings,
      updateSettings,
      members,
      addMember,
      updateMember,
      deleteMember,
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
};
