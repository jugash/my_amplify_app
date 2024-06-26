import {observable, observe} from '@legendapp/state';
import {syncedCrud} from '@legendapp/state/sync-plugins/crud';
import {Parent, Child} from '../types/data';
import {ParentListCrud} from './cruds/ParentListCrud';
import {ChildCrud} from './cruds/ChildCrud';

type State = {
  selectedParentId: string;
  parents: ReturnType<typeof syncedCrud>;
  children: (id: string) => ReturnType<typeof syncedCrud>;
  selectedParent: () => Parent | undefined;
  selectedChildren: () => Child[];
  isEmpty: () => boolean;
};

export const State$ = observable<State>({
  selectedParentId: undefined,
  selectedParent: () =>
    State$.selectedParentId.get() !== undefined
      ? State$.packs[State$.selectedParentId.get()]
      : undefined,
  selectedChildren: () => {
    return State$.selectedParentId.get() !== undefined
      ? State$.children[State$.selectedParentId.get()]
      : undefined;
  },
  isEmpty: () =>
    State$.parents.get() === undefined ||
    Object.keys(State$.parents.get()).length === 0,
  parents: ParentListCrud,
  children: ChildCrud,
});
