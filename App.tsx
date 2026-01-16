import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { store } from './src/store/store';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {
  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <NavigationContainer children={undefined}>
          {/* StackNavigator */}
        </NavigationContainer>
      </PaperProvider>
    </ReduxProvider>
  );
};

export default App;
