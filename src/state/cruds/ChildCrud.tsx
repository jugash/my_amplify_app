import {ObservablePersistLocalStorage} from '@legendapp/state/persist-plugins/local-storage';
import {syncedCrud} from '@legendapp/state/sync-plugins/crud';
import axios from 'axios';
import {Child} from '../State';

export const ChildCrud = (parentId: string) =>
  syncedCrud({
    transform: {
      save: (data: Child) => {
        return {
          postId: data.parentId,
          id: data.id,
          name: data.name,
          email: 'abc@def.com',
          body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
        };
      },
      load: data => {
        return {
          parentId: data.postId,
          id: data.id,
          name: data.name,
          createdAt: '2020-01-01T00:00:00Z',
          updatedAt: '2020-01-01T00:00:00Z',
        };
      },
    },
    list: async () => {
      console.log('Listing children for parent', parentId);
      const {data} = await axios.get(
        'https://jsonplaceholder.typicode.com/comments?postId=' + parentId,
      );
      console.log('Listed children', JSON.stringify(data));
      return data.map(d => ({
        ...d,
        createdAt: '2020-01-01T00:00:00Z',
        updatedAt: '2020-01-01T00:00:00Z',
      }));
    },
    create: async input => {
      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/comments',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
          },
        );

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
          `https://jsonplaceholder.typicode.com/comments/${input.id}`,
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
          `https://jsonplaceholder.typicode.com/comments/${input.id}`,
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
    // waitFor: () => State$.parents.get(),
    // onSaved: 'createdUpdatedAt',
    persist: {
      name: 'CSS_' + parentId,
      retrySync: false,
      plugin: ObservablePersistLocalStorage,
    },
  });
