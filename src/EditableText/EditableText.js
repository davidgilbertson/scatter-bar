import React, { Component } from 'react';
import styles from './EditableText.module.css';

class EditableText extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
    };

    this.textAreaRef = React.createRef();
  }

  enterEditMode = () => {
    if (this.editMode) return;

    this.setState({ editMode: true });


    setTimeout(() => {
      this.textAreaRef.current.select();
      window.addEventListener('click', this.handleWindowClick);
      document.addEventListener('keydown', this.handleKeyPress);
    });
  };

  handleKeyPress = (e) => {
    if (e.key === 'Escape' || e.key === 'Tab') {
      this.leaveEditMode();
    }
  };

  handleWindowClick = e => {
    if (e.target === this.textAreaRef.current) return;

    this.leaveEditMode();
  };

  leaveEditMode = () => {
    window.removeEventListener('click', this.handleWindowClick);
    document.removeEventListener('keydown', this.handleKeyPress);

    this.setState({ editMode: false });
  };

  componentDidUpdate(nextProps) {
    // TODO (davidg): wrong lifecycle method to use?
    // handle external updates to the text
    if (nextProps.children !== this.props.children) {
      this.setState({
        text: nextProps.children
      });
    }
  }

  render () {
    const { props, state } = this;

    return state.editMode
    ? (
      <textarea
        data-testid="EditableText__test-area"
        rows={props.rows || 3}
        className={styles.textArea}
        ref={this.textAreaRef}
        onChange={e => {
          props.onChange(e.target.value);
        }}
        value={props.text}
      />
    ) : (
      <div className={`${styles.staticText} ${props.className}`} onClick={this.enterEditMode}>
        {props.text}
        <button className={styles.editButton}>EDIT</button>
      </div>
    );
  }
}

export default EditableText;
