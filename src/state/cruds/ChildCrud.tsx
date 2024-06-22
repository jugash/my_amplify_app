import {ObservablePersistLocalStorage} from '@legendapp/state/persist-plugins/local-storage';
import {syncedCrud} from '@legendapp/state/sync-plugins/crud';
import {Child, client} from '../../types/data';
import axios from 'axios';

export const ChildCrud = (parentId: string) =>
  syncedCrud({
    list: async () => {
      console.log('Listing children for parent', parentId);
      const {data} = await axios.get(
        'http://localhost:3000/children?parentId=' + parentId,
      );
      console.log('Listed children', JSON.stringify(data));
      return data;
    },
    create: async input => {
      try {
        const response = await fetch('http://localhost:3000/children', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          console.error('Error creating child', response.statusText);
          return null;
        }

        const data = await response.json();
        console.log('Created child', JSON.stringify(data));
        return data;
      } catch (error) {
        console.error('Error creating child', error);
        return null;
      }
    },

    update: async input => {
      try {
        const response = await fetch(
          `http://localhost:3000/children/${input.id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
          },
        );

        if (!response.ok) {
          console.error('Error updating child', response.statusText);
          return null;
        }

        const data = await response.json();
        console.log('Updated child', JSON.stringify(data));
        return data;
      } catch (error) {
        console.error('Error updating child', error);
        return null;
      }
    },
    delete: async input => {
      try {
        const response = await fetch(
          `http://localhost:3000/children/${input.id}`,
          {
            method: 'DELETE',
          },
        );

        if (!response.ok) {
          console.error('Error deleting child', response.statusText);
          return null;
        }

        console.log('Deleted child with ID:', input.id);
        return null;
      } catch (error) {
        console.error('Error deleting child', error);
        return null;
      }
    },
    mode: 'assign',
    updatePartial: true,
    onSaved: ({saved, input, currentValue, isCreate}) => {
      return {
        createdAt: '2020-01-01T00:00:00Z',
        updatedAt: '2020-01-01T00:00:00Z',
      };
    },
    // onSaved: 'createdUpdatedAt',
    persist: {
      name: 'ChildState2_' + parentId,
      retrySync: false,
      plugin: ObservablePersistLocalStorage,
    },
  });
