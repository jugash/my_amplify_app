import React from 'react';
import {
  Button,
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Alert,
  ScrollView,
} from 'react-native';

import {State$} from './src/state/State';
import {For, observer} from '@legendapp/state/react';
import {Observable, syncState, when} from '@legendapp/state';
import {v4 as uuidv4} from 'uuid';
import {
  adjectives,
  animals,
  names,
  uniqueNamesGenerator,
} from 'unique-names-generator';
import 'react-native-get-random-values';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const getState = (obs$: Observable) => {
  const state$ = syncState(obs$);
  const error = state$.error.get();
  const isLoaded = state$.isLoaded.get();

  if (error) {
    console.error('Error loading state', error);
    return null;
  } else if (!isLoaded) {
    // Do something while loading
    console.log('State is loading');
    return null;
  } else {
    return obs$.get();
  }
};

const waitForState = async () => {
  console.log('Waiting for state to load');
  // Activate to run list functions
  State$.parents.get();
  // State$.children.get();
  State$.selectedParent.get();
  State$.selectedChildren.get();

  // Wait for load
  await when(syncState(State$.parents).isLoaded);
  await when(syncState(State$.selectedParent).isLoaded);
  await when(syncState(State$.selectedChildren).isLoaded);
  console.log('State loaded', JSON.stringify(State$.get()));
  await when(State$.selectedParent.get() !== undefined);
  console.log(
    'Selected parent loaded',
    State$.selectedParentId.get(),
    JSON.stringify(State$.selectedParent.get()),
    JSON.stringify(State$.selectedChildren.get()),
  );
  await when(State$.selectedChildren.get() !== undefined);

  // getState(State$.parents);
  // getState(State$.selectedParent);
  console.log('*******', getState(State$.selectedChildren));

  // Log loaded state
  // console.log('State[parents] is loaded', JSON.stringify(State$.parents.get()));
  // console.log(
  //   'State[parent] is loaded',
  //   JSON.stringify(State$.selectedParent.get()),
  // );
  // console.log(
  //   'State[children] is loaded',
  //   JSON.stringify(State$.children.get()),
  // );
  // console.log(
  //   'State[selected children] is loaded',
  //   State$.selectedChildren.get(),
  // );
};

const createParentAndChildren = async () => {
  try {
    console.log('Creating parent and children');
    const id = uuidv4();
    State$.selectedParentId.set(id);

    await waitForState();

    State$.parents[id].set({
      id: id,
      name: uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
      }),
    });

    const children = Array.from({length: 1}, () => ({
      id: uuidv4(),
      name: uniqueNamesGenerator({
        dictionaries: [names],
      }),
      parentId: id,
    }));

    const childrenObject = {};
    for (const child of Object.values(children)) {
      childrenObject[child.id] = child;
    }

    State$.selectedChildren.set(childrenObject);

    // for (const child of Object.values(children)) {
    //   State$.selectedChildren[child.id].set(child);
    // }
    console.log('Created parent and children');
  } catch (e) {
    console.error('Error creating parent and children', e);
  }
};

const renderParent = (parent: Observable) => {
  return (
    <View style={styles.data}>
      <Text style={styles.text}>
        {parent.id.get() + ' ' + parent.name.get()}
      </Text>
      <View style={styles.buttons}>
        <Button
          title="Select"
          onPress={async () => {
            State$.selectedParentId.set(undefined);
            State$.selectedParentId.set(parent.id.get());
            await waitForState();
          }}
        />
        <Button
          title="Delete"
          onPress={() => {
            State$.parents[parent.id.get()].delete();
          }}
        />
      </View>
    </View>
  );
};

const App = observer(() => {
  waitForState();
  return (
    <SafeAreaView>
      {/* <Button title="Create Parent" onPress={() => createParentAndChildren()} /> */}
      {State$.get() === undefined || State$.isEmpty() ? (
        <Text>No Packs found</Text>
      ) : (
        <View style={styles.layout}>
          <View style={styles.child}>
            <Text>Selected Children</Text>
            <Text>-----------</Text>
            <For each={State$.selectedChildren}>
              {child =>
                child.get() === undefined ? null : (
                  <Text>{child.parentId.get() + ' ' + child.id.get()}</Text>
                )
              }
            </For>
          </View>
          <ScrollView style={styles.parent}>
            <For each={State$.parents}>
              {parent =>
                parent.get() === undefined ? null : renderParent(parent)
              }
            </For>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
    width: '100%',
  },
  layout: {
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
    width: '100%',
  },
  parent: {
    flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    height: '75%',
  },
  child: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f3f3ff',
    width: '100%',
    height: '25%',
  },
  data: {
    padding: 20,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
    textAlign: 'center',
    width: '100%',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
  },
});

export default App;
