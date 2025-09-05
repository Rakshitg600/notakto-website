'use client'
import { useEffect, useRef } from 'react';

// Components
import Menu from '@/app/Menu';
import TutorialModal from '@/modals/TutorialModal';

import { useCoins, useUser, useXP, useMute, useTut } from '@/services/store';

// Firebase module
import { onAuthStateChangedListener, saveEconomyToFirestore, loadEconomyFromFirestore } from '@/services/firebase';

import { MenuLayout } from '@/components/ui/Containers/Menu/MenuLayout';

export default function Home() {
  const mute = useMute((state) => state.mute);

  const coins = useCoins((state) => state.coins);
  const setCoins = useCoins((state) => state.setCoins);

  const XP = useXP((state) => state.XP);
  const setXP = useXP((state) => state.setXP);

  const user = useUser((state) => state.user);
  const setUser = useUser((state) => state.setUser);
  const dataLoadedRef = useRef(false); // avoid triggering saveEconomy on every render
  const showTut = useTut((state) => state.showTut);


  // Load user and economy data
  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(async (usr) => {
      setUser(usr);
      if (usr) {
        const cloudData = await loadEconomyFromFirestore(usr.uid) as { coins?: number; XP?: number };
        if (cloudData) {
          console.log(1);
          setCoins(cloudData.coins ?? 1000);
          setXP(cloudData.XP ?? 0);
        } else {
          console.log(2);
          setCoins(1000);
          setXP(0);
        }
        dataLoadedRef.current = true;
      } else {
        dataLoadedRef.current = false;
      }
    });

    return () => unsubscribe();
  }, []);

  // Save to Firestore only after data is loaded and user exists
  useEffect(() => {
    if (user && dataLoadedRef.current) {
      saveEconomyToFirestore(user.uid, coins, XP);
    }
  }, [coins, XP, user]);

  return (
    <MenuLayout>
      <Menu />
      {showTut && <TutorialModal />}
    </MenuLayout>
  );
}