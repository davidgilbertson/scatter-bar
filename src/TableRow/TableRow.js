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
          data-testid="TableRow__form"
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
            onPaste={e => {
              const rawData = e.clipboardData.getData('text');

              try {
                e.preventDefault();

                rawData.split(/[\n\r\t,]/).forEach(maybeNumber => {
                  if (maybeNumber === '') return;

                  if (isNaN(Number(maybeNumber))) return;

                  props.addValueToSet(Number(maybeNumber), props.scenario.id);
                }).filter(Boolean);

                this.inputEl.current.focus();
              } catch(err) {
                console.error('Could not handle clipboard data');
                this.updateValue(rawData);
              }
            }}
            onChange={e => {
              this.updateValue(e.target.value);
            }}
          />

          <Button disabled={!isNewValueValid}>
            Add
          </Button>
        </form>

        <div className={styles.values} data-testid="TableRow__values">
          {props.scenario.data.map((value, valueIndex) => (
            <span className={styles.value} key={valueIndex}>
              {value.toLocaleString()}
              <button
                className={styles.deleteValueButton}
                tabIndex="-1"
                title="Remove value from set"
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
            title="Remove set"
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
