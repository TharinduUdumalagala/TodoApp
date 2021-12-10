import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const COLORS = {primary: '#1f145c', white: '#fff'};

const App = () =>{
  const [textInput, setTextIput] = React.useState('');
  const [todos, setTodos] = React.useState([]);

  React.useEffect(()=>{
    getTodoFromIserDevice();
  },[])

  React.useEffect(() => {
    saveTodosTouserDevice(todos);
  }, [todos])

  const ListItem = ({todo}) => {
    return(
      <View style={styles.listItem}>
        <View style={{flex: 1}}>
          <Text 
          style={{fontWeight: 'bold',
           fontSize: 15, 
           color: COLORS.primary, 
           textDecorationLine: todo?.completed?'line-through' : 'none'
          }}>
            {todo?.task}
          </Text>
        </View>
        {
          !todo?.completed && (
            <TouchableOpacity 
            style={[styles.actionIcon]} 
            onPress={()=>markTodoComplete(todo?.id)}>
              <Icon name="done" size={20} color={COLORS.white} />
            </TouchableOpacity>
          )
        }
        <TouchableOpacity 
        style={[styles.actionIcon, {backgroundColor: 'red'}]} 
        onPress={()=>deleteTodo(todo?.id)}>
          <Icon name="delete" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    );
  };

  const saveTodosTouserDevice = async todos =>{
    try {
      const stringifyTodos = JSON.stringify(todos)
      await AsyncStorage.setItem('todos', stringifyTodos);
    } catch (e) {
      console.log(e);
      // saving error
    }
  };


  const getTodoFromIserDevice = async () => {
    try {
      const todos =await AsyncStorage.getItem("todos");
      if(todos != null){
        setTodos(JSON.parse(todos));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addTodo = () => {
    if(textInput == ''){
      Alert.alert('Error', 'Please input your todo...');
    }else{
      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setTextIput('');
    }
  };

  const markTodoComplete = (todoId)=>{
    const newTodosItem =todos.map(item => {
      if(item.id == todoId){
        return {...item, completed:true}
      }
      return item;
    });
    setTodos(newTodosItem);
  };

  const deleteTodo = (todoId) => {
    const  newTodosItem = todos.filter(item => item.id != todoId);
    setTodos(newTodosItem);
  }

  const clearTodo = () => {
    Alert.alert('Confirm', 'Clear todos?', [
      {
        text: 'Yes',
        onPress: () => setTodos([]),
      },
      {
        text: 'No'
      },
    ]);
  }
  
  return(
    <SafeAreaView style={{flex:1,backgroundColor: COLORS.white}}>
      <View style={styles.header}>
        <Text style={{fontWeight: 'bold', fontSize: 25, color: COLORS.primary}}>
          TODO APP
        </Text>
        <Icon name="delete" size={25} color="red" 
        onPress ={clearTodo}/>    
      </View>
      <FlatList
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{padding: 20, paddingBottom: 100}}
      data={todos}
      renderItem={({item}) => <ListItem todo={item} />}
      />
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput 
          placeholder="Add Todo..." 
          value={textInput}
          onChangeText={(text) => setTextIput(text)}/>
        </View>
        <TouchableOpacity onPress={addTodo}>
          <View style={styles.iconeContainer}>
            <Icon name="add" color={COLORS.white} size={30} />
          </View>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};



const styles = StyleSheet.create({

  actionIcon:{
    height: 25,
    width: 25,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 3,
  },

  listItem:{
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },

  header:{
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  footer:{
    position:'absolute',
    bottom: 0,
    backgroundColor:COLORS.white,
    width:'100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  inputContainer:{
    backgroundColor: COLORS.white,
    elevation: 40,
    flex: 1,
    height: 50,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
    paddingHorizontal: 20,
  },

  iconeContainer:{
    height: 50,
    width:50,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    elevation: 40,
    justifyContent: 'center',
    alignItems: 'center',
  }

});

export default App;