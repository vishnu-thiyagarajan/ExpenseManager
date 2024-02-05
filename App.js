import { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import InputForm from './components/InputForm';
import WeeklyTransactions from './components/WeeklyTransactions';

export default function App() {
  const [display, setDisplay] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden/>
      {!display && <InputForm setDisplay={setDisplay} />} 
      {display && <WeeklyTransactions setDisplay={setDisplay}/>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  }
});
