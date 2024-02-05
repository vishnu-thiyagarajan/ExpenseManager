import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, SectionList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getStartEndOfWeek, timeStampToDate, oneWeekInTimestamp} from '../Utils/utils';

export default function WeeklyTransactions ({setDisplay}){
    const [list, setList] = useState([]);
    const [cursor, setCursor] = useState(getStartEndOfWeek());
    const getData = async({startOfWeek, endOfWeek}) => {
        const reducer = (acc, obj) => {
        if(obj.date >= startOfWeek && obj.date <= endOfWeek) return acc + Number(obj.amount);
        return acc;
        };
        try {
        const result = await AsyncStorage.getItem('store');
        const store = JSON.parse(result);
        if (!store) return [];
        const categories = Object.keys(store);
        const data = categories.map((category)=>{
        const incomeTotal = store[category].income.reduce(reducer,0)
        const expenseTotal = store[category].expense.reduce(reducer,0)
        return{
            title: category,
            data: [{type: 'income', total: incomeTotal }, {type: 'expense', total: expenseTotal }]
        }
        })
        return data;
        } catch(e) {
        alert("error:" + e);
        }
    };
    const handleView = () => setDisplay((prev) => !prev);

    const prev = async () => {
        const newCursor = {'startOfWeek': (cursor.startOfWeek - oneWeekInTimestamp), 'endOfWeek' : (cursor.endOfWeek - oneWeekInTimestamp)}
        setList(await getData(newCursor));
        setCursor(newCursor);
    };
    const next = async () => {
        const newCursor = {'startOfWeek': (cursor.startOfWeek + oneWeekInTimestamp), 'endOfWeek' : (cursor.endOfWeek + oneWeekInTimestamp)}
        setList(await getData(newCursor));
        setCursor(newCursor);
    };

    useEffect(() => {
        const fetchData = async() => setList(await getData(cursor));
        fetchData();
    },[])

    return (
        <View style={{ flex: 1 }}>
          <TouchableOpacity style={styles.floatLeftBtn}>
            <Button onPress={prev} title="Prev"/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.floatRightBtn}>
            <Button onPress={next} title="Next"/>
          </TouchableOpacity>
          <Text style={styles.title}>{timeStampToDate(cursor.startOfWeek) +" to "+ timeStampToDate(cursor.endOfWeek)}</Text>
          {(!list.length) ? <Text style={styles.title}>No data available</Text> :
          <SectionList
            sections={list}
            keyExtractor={(item, index) => item + index}
            renderItem={({item}) => (
              <View style={styles.fixToText}>
                <Text style={{fontSize: 20}}>{item.type}</Text> 
                <Text style={{fontSize: 20}}>{item.total}</Text>
              </View>
            )}
            renderSectionHeader={({section: {title}}) => (
              <Text style={styles.sectionTitle}>{title}</Text>
            )}
          />}
          <TouchableOpacity style={styles.floatBtn}>
            <Button onPress={handleView} title="Back"/>
          </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
      textAlign: 'center',
      marginVertical: 8,
      fontSize: 30,
      marginTop: 60
    },
    fixToText: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
    sectionTitle:{
      textAlign: 'left',
      marginVertical: 8,
      fontSize: 30,
    },
    floatBtn:{
      alignItems: 'center',
      justifyContent: 'center',
      width: 70,
      position: 'absolute',
      top: 0,
      left: 10,
      height: 70,
      backgroundColor: '#fff',
      borderRadius: 100,
    },
    floatLeftBtn:{
      alignItems: 'center',
      justifyContent: 'center',
      width: 70,
      position: 'absolute',
      top: 0,
      right: 70,
      height: 70,
      backgroundColor: '#fff',
      borderRadius: 100,
    },
    floatRightBtn:{
      alignItems: 'center',
      justifyContent: 'center',
      width: 70,
      position: 'absolute',
      top: 0,
      right: 10,
      height: 70,
      backgroundColor: '#fff',
      borderRadius: 100,
    }
});
  
  