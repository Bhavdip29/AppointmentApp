import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import { initializeDatabase } from './db/database'; // Database setup file
import RootNavigator from './navigation/RootNavigator';

const Stack = createNativeStackNavigator();

const App = () => {
  // Initialize the database on app load
  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <View
      style={{
        flex: 1,
      }}>
      <StatusBar backgroundColor={'black'} barStyle={'light-content'} />
      <RootNavigator />
    </View>
  );
};

export default App;
