import {ObservablePersistLocalStorage} from '@legendapp/state/persist-plugins/local-storage';
import {syncedCrud} from '@legendapp/state/sync-plugins/crud';
import axios from 'axios';
import {Parent} from '../State';

export const ParentListCrud = syncedCrud({
  transform: {
    save: (data: Parent) => {
      return {
        userId: 1,
        id: data.id,
        title: data.name,
        body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
      };
    },
    load: data => {
      return {
        id: data.id,
        name: data.title,
        createdAt: '2020-01-01T00:00:00Z',
        updatedAt: '2020-01-01T00:00:00Z',
      };
    },
  },
  list: async () => {
    const {data} = await axios.get(
      'https://jsonplaceholder.typicode.com/posts',
    );

    console.log('Listed parents', JSON.stringify(data));

    return data.map(d => ({
      ...d,
      createdAt: '2020-01-01T00:00:00Z',
      updatedAt: '2020-01-01T00:00:00Z',
    }));
  },
  create: async input => {
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        },
      );

      if (!response.ok) {
        console.error('Error creating parent', response.statusText);
        return null;
      }

      const data = await response.json();
      console.log('Created parent', JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('Error creating parent', error);
      return null;
    }
  },

  update: async input => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${input.id}`,
        {
          method: 'PATCH', // Use PATCH if you're partially updating the record
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        },
      );

      if (!response.ok) {
        console.error('Error updating parent', response.statusText);
        return null;
      }

      const data = await response.json();
      console.log('Updated parent', JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('Error updating parent', error);
      return null;
    }
  },

  delete: async input => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${input.id}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        console.error('Error deleting parent', response.statusText);
        return null;
      }

      console.log('Deleted parent with ID:', input.id);
      return null;
    } catch (error) {
      console.error('Error deleting parent', error);
      return null;
    }
  },
  onSaved: ({saved, input, currentValue, isCreate}) => {
    return {
      createdAt: '2020-01-01T00:00:00Z',
      updatedAt: '2020-01-01T00:00:00Z',
    };
  },
  // onSavedUpdate: 'createdUpdatedAt',
  persist: {
    name: 'PSS_PARENTS',
    retrySync: true,
    plugin: ObservablePersistLocalStorage,
  },
});
