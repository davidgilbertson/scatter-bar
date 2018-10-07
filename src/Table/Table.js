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
    </div>

    <div className={styles.sets}>
      {props.scenario.sets.map((set, index) => (
        <TableRow
          key={set.id}
          set={set}
          rowIndex={index}
          addValueToSet={props.addValueToSet}
          removeValueFromSet={props.removeValueFromSet}
          changeSetName={props.changeSetName}
          removeSetFromScenario={props.removeSetFromScenario}
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
