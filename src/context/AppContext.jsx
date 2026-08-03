import React, { createContext, useState, useEffect } from 'react';
import localforage from 'localforage';
import { supabase } from '../config/supabaseClient';
import { defaultMembers } from '../data/seedData';

export const AppContext = createContext();

const defaultSettings = {
  eventName: 'SEGUE-ME XXXIII',
  priceWithShirt: 130,
  priceWithoutShirt: 80,
  priceWithShirtCasal: 260,
  priceWithoutShirtCasal: 160,
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
          finalMembers = supaMembers.map(row => {
            const localObj = localMembers?.find(m => m.id === row.id);
            if (localObj) {
              // Mescla os dados de presença locais para não perder caso o Supabase falhe
              return { 
                ...row.data, 
                attendance: { ...(row.data.attendance || {}), ...(localObj.attendance || {}) } 
              };
            }
            return row.data;
          });
          
          if (supaSettings && supaSettings.length > 0) {
             const setRow = supaSettings.find(s => s.id === 'main');
             if (setRow) {
               // Mescla as colunas de chamada
               const localCols = localSettings?.attendanceColumns || [];
               const supaCols = setRow.data.attendanceColumns || [];
               const mergedCols = [...new Set([...supaCols, ...localCols])];
               setSettings({ ...setRow.data, attendanceColumns: mergedCols });
             }
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

  // Persist locally automatically
  useEffect(() => {
    if (!loading) {
      localforage.setItem('bastidores_members', members).catch(console.error);
    }
  }, [members, loading]);

  useEffect(() => {
    if (!loading) {
      localforage.setItem('bastidores_settings', settings).catch(console.error);
    }
  }, [settings, loading]);

  const updateSettings = async (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await supabase.from('settings').upsert({ id: 'main', data: updated });
  };

  const addMember = async (member) => {
    const newMember = { ...member, id: member.id || crypto.randomUUID() };
    setMembers(prev => [...prev, newMember]);
    const { error } = await supabase.from('members').insert({ id: newMember.id, data: newMember });
    if (error) console.error("Erro ao inserir membro:", error);
  };

  const updateMember = async (id, updatedData) => {
    let updatedMember = null;
    
    setMembers(prev => {
       const newArray = prev.map(m => {
         if (m.id === id) {
           updatedMember = { ...m, ...updatedData };
           return updatedMember;
         }
         return m;
       });
       return newArray;
    });

    if (updatedMember) {
      const { error } = await supabase.from('members').update({ data: updatedMember }).eq('id', id);
      if (error) console.error("Erro ao atualizar membro no Supabase:", error);
    }
  };

  const deleteMember = async (id) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    const { error } = await supabase.from('members').delete().eq('id', id);
    if (error) console.error("Erro ao deletar membro:", error);
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
