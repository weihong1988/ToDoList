import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput } from 'react-native';

export default function AddScreen({ navigation }) {
  const [titleValue, onChangeTitle] = React.useState("");
  const [detailsValue, onChangeDetails] = React.useState("");

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30 }}>Add your ToDo</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeTitle}
        value={titleValue}
        placeholder="ToDo Item"
      />
      <TextInput
        style={[styles.input, {height: 100}]}
        onChangeText={onChangeDetails}
        value={detailsValue}
        numberOfLines={4}
        multiline={true}

        placeholder="Details"
      />
      <View style={{ flexDirection:"row" }}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Notes App", {title: titleValue, details: detailsValue})}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: "lightyellow",
  },
  input: {
    height: 40,
    width: '80%',
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    backgroundColor: 'red',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 50,
    marginRight: 50,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
  }
});
