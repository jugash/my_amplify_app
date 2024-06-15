import React from 'react';
import {
  Button,
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Alert,
} from 'react-native';

import {Amplify} from 'aws-amplify';

import outputs from './amplify_outputs.json';
import {State$} from './src/state/State';
import {Parent} from './src/types/data';
import {For, observer} from '@legendapp/state/react';
import {Observable, syncState, when} from '@legendapp/state';
import {v4 as uuidv4} from 'uuid';
import {
  adjectives,
  animals,
  names,
  uniqueNamesGenerator,
} from 'unique-names-generator';

Amplify.configure(outputs);

const waitForState = async () => {
  console.log('Waiting for state to load');
  // Activate to run list functions
  State$.parents.get();
  State$.selectedParent.get();
  State$.selectedChildren.get();

  // Wait for load
  await when(syncState(State$.parents).isLoaded);
  await when(syncState(State$.selectedParent).isLoaded);
  await when(syncState(State$.selectedChildren).isLoaded);

  // Log loaded state
  console.log('State[parents] is loaded', State$.parents.get());
  console.log('State[parent] is loaded', State$.selectedParent.get());
  console.log('State[children] is loaded', State$.selectedChildren.get());
};

const createParentAndChildren = async () => {
  try {
    console.log('Creating parent and children');
    const id = uuidv4();
    State$.selectedParentId.set(id);

    waitForState();

    State$.parents[id].set({
      id: id,
      name: uniqueNamesGenerator({
        dictionaries: [adjectives, animals, names],
      }),
    });

    const children = Array.from({length: 1}, () => ({
      id: uuidv4(),
      name: uniqueNamesGenerator({
        dictionaries: [adjectives, animals, names],
      }),
      parentId: id,
    }));

    for (const child of Object.values(children)) {
      State$.selectedChildren[child.id].set(child);
    }
    console.log('Created parent and children');
  } catch (e) {
    console.error('Error creating parent and children', e);
  }
};

const renderParent = (parent: Observable<Parent>) => {
  return (
    <View style={styles.data}>
      <Text style={styles.text}>{parent.name.get()}</Text>
      <Button
        title="Details"
        onPress={() => {
          State$.selectedParentId.set(parent.id.get());
          waitForState();
          Alert.alert(
            JSON.stringify(
              Object.values(State$.selectedChildren.get()).map(it => it.name),
            ),
          );
        }}
      />
      <Button
        title="Delete"
        onPress={() => {
          State$.parents[parent.id.get()].delete();
        }}
      />
    </View>
  );
};

const App = observer(() => {
  waitForState();
  return (
    <SafeAreaView>
      <Button title="Create Pack" onPress={() => createParentAndChildren()} />
      {State$.get() === undefined || State$.isEmpty() ? (
        <Text>No Packs found</Text>
      ) : (
        <View>
          <For each={State$.parents}>
            {parent =>
              parent.get() === undefined ? null : renderParent(parent)
            }
          </For>
        </View>
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  data: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#dddddd',
    flexDirection: 'row',
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
  },
});

export default App;
