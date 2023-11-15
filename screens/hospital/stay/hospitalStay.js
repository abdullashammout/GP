import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet ,Button,TextInput,Modal} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';




export default function HospitalStay() {
  const [newItem,setNewItem]=useState('');
  const [userName, setUserName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const[date,setDate]=useState(new Date());
  const[showPicker,setShowPicker]=useState(false);
  const[data,setData]=useState([{id:'1',title:'hospital admission 1',createdBy:'sara',hospitalName:'abdali',entryDate:new Date("11/11/2023").toISOString}]);
  const [modalVisible,setModalVisibile]=useState(false);
 
    
    
  
  const renderItem=({item})=>(
  <View style={styles.itemContainer}>
    <Text>hospital admission {item.id}</Text>
    <Text>hospital name: {item.hospitalName}</Text>
    <Text>Doctor name:{item.createdBy}</Text>
    <Text>entry date:{new Date(item.entryDate).toLocaleDateString()}</Text>
    

  </View>

  );
    const handleAddItem=()=>{
      var x;
      for(i=1;i<=1;i++){
         x=i;
      }
      setData(prevData=>[...prevData,{id:i.toString(),title:newItem,createdBy:userName,hospitalName:hospitalName,entryDate:date}]);
      setNewItem('');
      setUserName('');
      setHospitalName('');
      setDate('');
      setModalVisibile(false);
    };
    return(
      <View style={styles.container}>
        <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <Modal animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={()=>{
          setModalVisibile(!modalVisible);
        }}
      >
      <View style={styles.centeredView}>
      <View style={styles.modalView}>
     <Text onChangeText={text=>setNewItem(text)}>enter doctor name</Text>
      <TextInput style={styles.input} placeholder='your name' value={userName} onChangeText={text=>setUserName(text)}/>
      <Text onChangeText={text=>setMedicineName(text)}>enter hospital name</Text>
      <TextInput style={styles.input} placeholder='stay' value={hospitalName} onChangeText={text=>setHospitalName(text)}/>
      <Button title="select date" onPress={()=>setShowPicker(true)}/>
      {showPicker && (<DateTimePicker
        mode="date" display="default" value={date} onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              setDate(selectedDate);
              
              
            }}}
      />)}
      {date && (<Text>admission date:{date.toLocaleDateString()}</Text>)}
      
      <Button title="Add" onPress={handleAddItem} />
      </View>

      </View>
      </Modal>
      <Button title='add new item' onPress={()=>setModalVisibile(true)}/>
      
    </View>
    
    );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    backgroundColor: '#f9c2ff',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

