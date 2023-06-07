import Realm from "realm";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from "react";
import Navigator from "./navigator";
import { DBContext } from "./context";

const FeelingSchema = {
  name: "Feeling",
  properties: {
    _id: "int",
    emotion: "string",
    message: "string",
  },
  primaryKey: "_id",
};

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [realm, setRealm] = useState(null);
  async function prepare() {
    try {
      const connection = await Realm.open({
        path: "diaryDB",
        schema: [FeelingSchema],
      });
      setRealm(connection);
    } catch (e) {
      console.warn(e);
    } finally {
      // Tell the application to render
      setAppIsReady(true);
    }
  };
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);
  useEffect(() => {
    prepare();
  }, [])

  if (!appIsReady) {
    return null;
  }

  return (
    <DBContext.Provider value={realm}>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </DBContext.Provider>
  );
}
