import {ObservablePersistLocalStorage} from '@legendapp/state/persist-plugins/local-storage';
import {syncedCrud} from '@legendapp/state/sync-plugins/crud';
import {Parent, client} from '../../types/data';
import axios from 'axios';

export const ParentListCrud = syncedCrud({
  list: async () => {
    const {data} = await axios.get('http://localhost:3000/parents');

    console.log('Listed parents', JSON.stringify(data));

    return data;
  },
  create: async input => {
    try {
      const response = await fetch('http://localhost:3000/parents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

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
        `http://localhost:3000/parents/${input.id}`,
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
        `http://localhost:3000/parents/${input.id}`,
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
    name: 'ParentState20',
    retrySync: true,
    plugin: ObservablePersistLocalStorage,
  },
});
