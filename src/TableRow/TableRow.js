import React, { Component } from 'react';
import styles from './TableRow.module.css';
import Button from '../Button/Button';
import EditableText from '../EditableText/EditableText';

class TableRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newValue: '',
    };

    this.inputEl = React.createRef();
  }

  updateValue = newValue => {
    this.setState({ newValue });
  };

  render () {
    const { props, state } = this;
    const isNewValueValid = state.newValue !== '' && !isNaN(Number(state.newValue));

    return (
      <React.Fragment>
        <div className={styles.scenarioNameWrapper}>
          <EditableText
            className={styles.scenarioName}
            onChange={newSetName => {
              props.changeSetName(newSetName, props.scenario.id);
            }}
            text={props.scenario.name}
          />
        </div>

        <form
          className={styles.inputs}
          onSubmit={e => {
            e.preventDefault();
            const newValue = state.newValue;

            if (newValue === '') return;

            if (isNaN(Number(newValue))) return;

            props.addValueToSet(Number(state.newValue), props.scenario.id);

            this.updateValue('');

            this.inputEl.current.focus();
          }}
        >
          <input
            ref={this.inputEl}
            className={styles.input}
            // TODO (davidg): allow decimals!
            type="number"
            autoFocus={props.rowIndex === 0}
            value={state.newValue}
            onChange={e => {
              this.updateValue(e.target.value);
            }}
          />

          <Button disabled={!isNewValueValid}>
            Add
          </Button>
        </form>

        <div className={styles.values}>
          {props.scenario.data.map((value, valueIndex) => (
            <span className={styles.value} key={valueIndex}>
              {value.toLocaleString()}
              <button
                className={styles.deleteValueButton}
                tabIndex="-1"
                onClick={() => {
                  props.removeValueFromSet(valueIndex, props.scenario.id);
                  this.inputEl.current.focus();
                }}
              >
                ✕
              </button>
          </span>
          ))}
        </div>

        <div className={styles.deleteWrapper}>
          <button
            className={styles.deleteButton}
            onClick={() => {
              props.removeSet(props.scenario.id);
            }}
          >
            ✕
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default TableRow;
