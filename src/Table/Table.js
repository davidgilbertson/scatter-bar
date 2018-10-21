import React from 'react';
import Button from '../Button/Button.styles';
import TableRow from '../TableRow/TableRow';
import EditableText from '../EditableText/EditableText';
import {
  AddSetWrapper,
  DeleteButton,
  Header,
  Sets,
  TablePanel,
  Title,
} from './Table.styles';

const Table = props => (
  <TablePanel data-testid="Table">
    <Header>
      <Title
        as={EditableText}
        rows={2}
        onChange={newName => {
          props.updateStoryName(newName);
        }}
        text={props.story.name}
      />

      <DeleteButton
        onClick={() => {
          props.removeStory(props.story.id);
        }}
      >
        ✕
      </DeleteButton>
    </Header>

    <Sets>
      {props.story.sets.map((set, index) => (
        <TableRow
          key={set.id}
          set={set}
          story={props.story}
          rowIndex={index}
          addValueToSet={props.addValueToSet}
          removeValueFromSet={props.removeValueFromSet}
          changeSetName={props.changeSetName}
          removeSet={props.removeSet}
        />
      ))}
    </Sets>

    <AddSetWrapper>
      <Button onClick={props.addSet}>
        Add a new set
      </Button>
    </AddSetWrapper>
  </TablePanel>
);

export default Table;
