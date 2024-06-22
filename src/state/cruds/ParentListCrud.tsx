import {ObservablePersistMMKV} from '@legendapp/state/persist-plugins/mmkv';
import {syncedCrud} from '@legendapp/state/sync-plugins/crud';
import {Parent, client} from '../../types/data';

export const ParentListCrud = syncedCrud({
  subscribe: ({refresh}) => {
    const subscription = client.models.Parent.observeQuery().subscribe({
      next: () => {
        refresh();
      },
    });

    return () => subscription.unsubscribe();
  },

  list: async () => {
    const {data, errors} = await client.models.Parent.list();

    if (errors) {
      console.error('Error listing parents', errors);
      return null;
    }

    console.log('Listed parents', JSON.stringify(data));

    return data;
  },

  create: async (input, params) => {
    const {data, errors} = await client.models.Parent.create(input);

    if (errors) {
      console.error('Error creating parent', errors);
      return null;
    }

    console.log('Created parent', JSON.stringify(data));
    return data;
  },

  update: async input => {
    const {data, errors} = await client.models.Parent.update(input);

    if (errors) {
      console.error('Error updating parent', errors);
      return null;
    }

    return data;
  },

  delete: async (input, params) => {
    const {data, errors} = await client.models.Parent.delete({
      id: input.id,
    });

    if (errors) {
      console.error('Error deleting parent', errors);
      return null;
    }
  },

  onSavedUpdate: 'createdUpdatedAt',
  persist: {
    name: 'ParentState15',
    retrySync: true,
    plugin: ObservablePersistMMKV,
  },
});
