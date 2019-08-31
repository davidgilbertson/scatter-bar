import React from 'react';
import { collect } from 'react-recollect';
import styles from './Table.module.css';
import Button from '../Button/Button';
import TableRow from '../TableRow/TableRow';
import EditableText from '../EditableText/EditableText';
import Panel from '../Panel/Panel';
import uuid from 'uuid/v4';
import removeById from '../utils/removeById';

const Table = ({store}) => {
  const currentStory = store.stories[store.currentStoryIndex];

  return (
    <Panel className={styles.panel} data-testid="Table">
      <div className={styles.header}>
        <EditableText
          className={styles.title}
          rows={2}
          onChange={newName => currentStory.name = newName}
          text={currentStory.name}
        />

        <button
          className={styles.deleteButton}
          onClick={() => {
            if (store.stories.length === 1) {
              window.alert(`I'm afraid I can't let you delete the last story, Dave.`);
              if (document.activeElement) document.activeElement.blur();
            } else {
              store.stories = removeById(store.stories, currentStory.id);
              store.currentStoryIndex = store.stories.length - 1;
            }
          }}
        >
          ✕
        </button>
      </div>

      <div className={styles.sets}>
        {currentStory.sets.map((set, index) => (
          <TableRow
            key={set.id}
            set={set}
            story={currentStory}
            rowIndex={index}
          />
        ))}
      </div>

      <div className={styles.addSetWrapper}>
        <Button
          onClick={() => {
            currentStory.sets.push({
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
};

export default collect(Table);
