import React, { Component } from 'react';
import Button from '../Button/Button.styles';
import EditableText from '../EditableText/EditableText';
import {
  SetNameWrapper,
  SetName,
  Inputs,
  Input,
  Values,
  DeleteValueButton,
  Value,
  DeleteWrapper,
  DeleteButton,
} from './TableRow.styles';

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
        <SetNameWrapper>
          <SetName
            as={EditableText}
            onChange={newSetName => {
              props.changeSetName(newSetName, props.set.id);
            }}
            text={props.set.name}
          />
        </SetNameWrapper>

        <Inputs
          data-testid="TableRow__form"
          onSubmit={e => {
            e.preventDefault();
            const newValue = state.newValue;

            if (newValue === '') return;

            if (isNaN(Number(newValue))) return;

            props.addValueToSet(Number(state.newValue), props.set.id);

            this.updateValue('');

            this.inputEl.current.focus();
          }}
        >
          <Input
            ref={this.inputEl}
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

                  props.addValueToSet(Number(maybeNumber), props.set.id);
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
        </Inputs>

        <Values data-testid="TableRow__values">
          {props.set.data.map((value, valueIndex) => (
            <Value key={valueIndex}>
              {value.toLocaleString()}
              <DeleteValueButton
                tabIndex="-1"
                title="Remove value from set"
                onClick={() => {
                  props.removeValueFromSet(valueIndex, props.set.id);
                  this.inputEl.current.focus();
                }}
              >
                ✕
              </DeleteValueButton>
          </Value>
          ))}
        </Values>

        <DeleteWrapper>
          <DeleteButton
            title="Remove set"
            onClick={() => {
              props.removeSet(props.set.id);
            }}
          >
            ✕
          </DeleteButton>
        </DeleteWrapper>
      </React.Fragment>
    );
  }
}

export default TableRow;
