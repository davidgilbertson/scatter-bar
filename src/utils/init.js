import { afterChange } from 'react-recollect';
import * as storage from './storage';

const init = () => {
  afterChange(({store}) => {
    storage.setItem(storage.KEYS.APP_DATA, {
      stories: store.stories,
      currentStoryIndex: store.currentStoryIndex,
    });
  });
};

export default init;
