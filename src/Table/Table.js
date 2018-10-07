import React from 'react';
import styles from './Table.module.css';
import Button from '../Button/Button';
import TableRow from '../TableRow/TableRow';
import EditableText from '../EditableText/EditableText';
import Panel from '../Panel/Panel';

const Table = props => (
  <Panel className={styles.panel}>
    <div className={styles.header}>
      <EditableText
        className={styles.title}
        rows={2}
        onChange={newName => {
          props.updateScenarioName(newName);
        }}
        text={props.scenario.name}
      />

      <button
        className={styles.deleteButton}
        onClick={() => {
          props.removeScenario(props.scenario.id);
        }}
      >
        ✕
      </button>
    </div>

    <div className={styles.sets}>
      {props.scenario.sets.map((set, index) => (
        <TableRow
          key={set.id}
          set={set}
          scenario={props.scenario}
          rowIndex={index}
          addValueToSet={props.addValueToSet}
          removeValueFromSet={props.removeValueFromSet}
          changeSetName={props.changeSetName}
          removeSet={props.removeSet}
        />
      ))}
    </div>

    <div className={styles.addSetWrapper}>
      <Button onClick={props.addSet}>
        Add a new set
      </Button>
    </div>
  </Panel>
);

export default Table;
