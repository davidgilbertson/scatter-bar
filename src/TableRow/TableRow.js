import React, { Component } from 'react';
import styles from './TableRow.module.css';
import Button from '../Button/Button';
import EditableText from '../EditableText/EditableText';
import { register } from '../magicStore';
import removeById from '../utils/removeById';

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

  componentDidMount() {
    // We want to auto-focus the input for a newly added set
    if (this.props.set.new) {
      delete this.props.set.new;

      this.inputEl.current.focus();
    }
  }

  render () {
    const { props, state } = this;
    const isNewValueValid = state.newValue !== '' && !isNaN(Number(state.newValue));

    return (
      <React.Fragment>
        <div className={styles.setNameWrapper}>
          <EditableText
            className={styles.setName}
            onChange={newSetName => {
              props.set.name = newSetName
            }}
            text={props.set.name}
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

            props.set.data.push(Number(state.newValue));

            this.updateValue('');

            this.inputEl.current.focus();
          }}
        >
          <input
            ref={this.inputEl}
            className={styles.input}
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

                  props.set.data.push(Number(maybeNumber));
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
          {props.set.data.map((value, valueIndex) => (
            <span className={styles.value} key={valueIndex}>
              {value.toLocaleString()}
              <button
                className={styles.deleteValueButton}
                tabIndex="-1"
                title="Remove value from set"
                onClick={() => {
                  props.set.data.splice(valueIndex, 1);
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
              props.story.sets = removeById(props.story.sets, props.set.id);
            }}
          >
            ✕
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default register(TableRow);
