import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('notes.db');

export default function NotesStack({ navigation, route }) {
  // Setup Notes object
  const [NotesArray, setNotesArray] = useState([]);

  // Draw the custom headers on the top header bar
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('AddScreen')}>
          <MaterialCommunityIcons name="note-plus-outline" size={36} color="black" style={{marginRight: 20,}} />
        </TouchableOpacity>
      ),
    });
  });

  function refreshNotes() {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM notes ORDER BY done",
        null,
        (txObj, { rows: {_array}}) => setNotesArray(_array),
        (txObj, error) => console.log("Error ", error)
      );
    });
  }

  function deleteNote(id) {
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM notes WHERE id = ?;", [id]);
    },
    null,
    refreshNotes
    );
  }

  function markNoteRead(id, isRead) {
    db.transaction((tx) => {
      if (isRead)
        tx.executeSql("UPDATE notes SET done = 0 WHERE id = ?;", [id]);
      else
        tx.executeSql("UPDATE notes SET done = 1 WHERE id = ?;", [id]);
    },
    null,
    refreshNotes
    );
  } 

  function UpdateNoteScreen(item) {
    navigation.navigate("Note Detail", {item})
  }

  // Set up the database
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS
        notes
        (id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        details TEXT,
        done INT);`
      );
    },
    null,
    refreshNotes
    );
  }, []);

  useEffect(() => {
    if (route.params?.title) {
      db.transaction((tx) => {
        tx.executeSql("INSERT INTO notes (done, title, details) VALUES (0, ?, ?);", 
          [route.params.title, route.params.details,]);
      },
      null,
      refreshNotes
      );
    }
  }, [route.params?.title]);

  useEffect(() => {
    if (route.params?.updateItem) {
      db.transaction((tx) => {
        tx.executeSql("UPDATE notes SET title = ?, details = ? WHERE id = ?;", 
          [route.params.updateItem.title, route.params.updateItem.details, route.params.updateItem.id]);
      },
      null,
      refreshNotes
      );
    }
  }, [route.params?.updateItem]);

  // Renderer for FlatList
  function renderItem({ item }) {
    let iconName;

    if (item.done)
      iconName = "close-circle-outline";
    else
      iconName = "check-circle-outline";

    return (
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        backgroundColor: "lightyellow",
        padding: 10,
        width: '100%',
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        }}>

        <TouchableOpacity onPress={() => UpdateNoteScreen(item)}>
          <Text style={item.done ? [styles.titleText, styles.titleTextDone] : [styles.titleText, styles.titleTextOngoing]}>{item.title}</Text>
        </TouchableOpacity>
        
        <View style={{flexDirection: "row",}}>
          <TouchableOpacity onPress={() => markNoteRead(item.id, item.done)}>
            <MaterialCommunityIcons style={{marginLeft: 20, marginRight: 10,}} name={iconName} size={30} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => deleteNote(item.id)}>
            <MaterialCommunityIcons style={{marginLeft: 10, marginRight: 20,}} name="trash-can" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList style={styles.list} data={NotesArray} renderItem={renderItem} keyExtractor={(item, index) => item.id.toString()} />
    </View>
   );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    width: "100%",
  }, 
  titleText: {
    marginLeft: 20,
    fontSize: 20,
    width: "100%",
  },
  titleTextDone: {
    textDecorationLine: 'line-through', 
    textDecorationStyle: 'solid',
    color: "gray",
  },
  titleTextOngoing: {
    textDecorationLine: 'none', 
    textDecorationStyle: 'solid',
    color: "black",
  }
});
