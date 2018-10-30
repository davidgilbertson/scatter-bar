import React from 'react';
import { collect, store } from 'react-recollect';
import styles from './Table.module.css';
import Button from '../Button/Button';
import TableRow from '../TableRow/TableRow';
import EditableText from '../EditableText/EditableText';
import Panel from '../Panel/Panel';
import uuid from 'uuid/v4';
import removeById from '../utils/removeById';

const Table = () => (
  <Panel className={styles.panel} data-testid="Table">
    <div className={styles.header}>
      <EditableText
        className={styles.title}
        rows={2}
        onChange={newName => store.currentStory.name = newName}
        text={store.currentStory.name}
      />

      <button
        className={styles.deleteButton}
        onClick={() => {
          if (store.stories.length === 1) {
            window.alert(`I'm afraid I can't let you delete the last story, Dave.`);
            if (document.activeElement) document.activeElement.blur();
          } else {
            store.stories = removeById(store.stories, store.currentStory.id);
            store.currentStory = store.stories[0];
          }
        }}
      >
        ✕
      </button>
    </div>

    <div className={styles.sets}>
      {store.currentStory.sets.map((set, index) => (
        <TableRow
          key={set.id}
          set={set}
          story={store.currentStory}
          rowIndex={index}
        />
      ))}
    </div>

    <div className={styles.addSetWrapper}>
      <Button
        onClick={() => {
          store.currentStory.sets.push({
            id: uuid(),
            name: 'A new set',
            data: [],
            new: true,
          });
        }}
      >
        Add a new set
      </Button>
    </div>
  </Panel>
);

export default collect(Table);
