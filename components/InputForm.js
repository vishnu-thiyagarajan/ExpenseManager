import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function InputForm ({setDisplay, navigation}){
    const [name, setName] = useState('');
    const [val, setVal] = useState('');
    const handleName = (text) => setName(text);
    const handleVal = (text) => setVal(text);
    const handleView = () => navigation.navigate('Display');
    const add = async(type) => {
        const record = {
        category: name,
        amount: val,
        type,
        date: new Date().getTime(),
        }
        await UpdateStore(record);
        setVal('');
        setName('');
    }
    const UpdateStore = async ({category, amount, type, date}) => {
        const defaultRec = {
        income: [],
        expense: [],
        }
        try {
        const result = await AsyncStorage.getItem('store');
        let storeObj;
        if (!result) {
            storeObj = {[category]: defaultRec}
        } else {
            storeObj = JSON.parse(result);
            if(!storeObj[category]) {
            storeObj[category] = defaultRec 
            }
        }
        storeObj[category][type].push({date, amount});
        await AsyncStorage.setItem('store', JSON.stringify(storeObj));
        alert(`Added successfully`);
        } catch(e) {
        alert("error:" + e);
        }  
    }
    const clear = async () => {
        try {
          await AsyncStorage.clear();
        } catch(e) {
          alert("error:" + e);
        }
    }
    return (
    <View>
        <Text style={styles.title}>Add your transactions here!</Text>
        <TextInput
          autoFocus
          value={name}
          style={styles.input}
          onChangeText={handleName}
          placeholder='Enter Category name...'
        />
        <TextInput
          keyboardType='numeric'
          value={val}
          style={styles.input}
          onChangeText={handleVal}
          placeholder='Enter Amount...'
        />
        <View style={styles.fixToText}>
          <Button onPress={()=>add('expense')} title="Add Expense"/>
          <Button onPress={()=>add('income')} title="Add Income"/>
        </View>
        <View style={styles.separator} />
        <Button onPress={handleView} title="View Weekly Report"/>
        <View style={styles.separator} />
        <Button onPress={clear} title="Clear All"/>
      </View>
    )
}

const styles = StyleSheet.create({
    title: {
      textAlign: 'center',
      marginVertical: 8,
      fontSize: 30,
    },
    input: {
      height: 40,
      width: '95%',
      margin: 12,
      borderWidth: 1,
      padding: 10,
      fontSize: 20,
    },
    fixToText: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
    separator: {
      marginVertical: 16,
      borderWidth: 1,
    },
  });
  