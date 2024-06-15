import {ObservablePersistMMKV} from '@legendapp/state/persist-plugins/mmkv';
import {syncedCrud} from '@legendapp/state/sync-plugins/crud';
import {Child, client} from '../../types/data';

export const ChildCrud = (parentId: string) =>
  syncedCrud({
    list: async () => {
      console.log('Listing children for parent', parentId);
      const {data, errors} = await client.models.Child.list({
        filter: {
          parentId: {eq: parentId},
        },
      });

      if (errors) {
        console.error('Error listing children', errors);
        return null;
      }

      console.log('Listed children', JSON.stringify(data));

      return data;
    },

    create: async input => {
      console.log('Creating Child called', input);
      const {data, errors} = await client.models.Child.create(input);

      if (errors) {
        console.error('Error creating child', errors);
        return null;
      }

      console.log('Created child', JSON.stringify(data));

      return data;
    },

    update: async input => {
      const {data, errors} = await client.models.Child.update(input);

      if (errors) {
        console.error('Error updating child', errors);
        return null;
      }

      return data;
    },

    delete: async input => {
      const {data, errors} = await client.models.Child.delete({
        id: parentId,
      });
      if (errors) {
        console.error('Error deleting child', errors);
        return null;
      }
    },
    mode: 'merge',
    updatePartial: true,
    onSavedUpdate: 'createdUpdatedAt',
    persist: {
      name: 'ChildState12',
      retrySync: true,
      plugin: ObservablePersistMMKV,
    },
  });
