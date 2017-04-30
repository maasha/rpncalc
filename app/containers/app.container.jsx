import React from 'react';
import PropTypes from 'prop-types';
import History from '../utils/history.util';
import Stack from '../utils/stack.util';
import Prompt from '../components/prompt.component';
import Display from '../components/display.component';
import Keypad from '../components/keypad.component';

/**
 * Number of rows in the textarea used in the Display component.
 * @type {String}
 */
const ROWS = 4;

/**
 * Number of columns in the textarea used in the Display component and the input
 * field used in the Prompt component.
 * @type {String}
 */
const COLS = 30;

/**
 * Calculator keypad keys.
 * @type {Object}
 */
const KEYS = {
  undo: 'UNDO',
  clear: 'CLEAR',
  del: 'DEL',
  pop: 'POP',
  swap: 'SWAP',
  reciprocal: '1/x',
  divide: '/',
  exp: 'x^y',
  multiply: 'x',
  subtract: '-',
  add: '+',
  dot: '.',
  root: '\u221a',
  sum: '\u03a3',
  enter: 'ENTER',
  key0: '0',
  key1: '1',
  key2: '2',
  key3: '3',
  key4: '4',
  key5: '5',
  key6: '6',
  key7: '7',
  key8: '8',
  key9: '9',
};

/**
 * Main application container for the RPN calculator.
 * @type {React.Component}
 * @extends {React.Component}
 */
class AppContainer extends React.Component {
  /**
   * Constructor for AppContainer.
   * @return {React.Component} Main application container.
   */
  constructor() {
    super();

    const history = new History();
    history.load();
    const stack = new Stack(history.last());

    /**
     * [state description]
     * @type {Object}
     * @property {String} promptValue Prompt value.
     * @property {Stack} stack The current stack.
     * @property {History} history The current history.
     * @property {Object} keys Map of key names and values.
     */
    this.state = {
      promptValue: '',
      stack,
      history,
      keys: KEYS,
    };

    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  /**
   * React lifecycle method called when component is mounted.
   */
  componentDidMount() {
    this.inputElement.focus();
  }

  /**
   * React lifecycle method called when component is updated.
   */
  componentDidUpdate() {
    this.state.history.save();
    this.inputElement.focus();
  }

  /**
   * Event handler for OnChange events in the Prompt component.
   * @param {Object} event Input field OnChange event.
   */
  handleOnChange(event) {
    this.setState({ promptValue: event.target.value });
  }

  /**
   * Event handler for OnSubmit events in the Prompt component.
   * @param {Object} event Form submit event.
   */
  handleOnSubmit(event) {
    const newStack = new Stack(this.state.stack.ary);
    newStack.push(this.state.promptValue);

    this.setState({
      promptValue: '',
      stack: newStack,
    });

    this.addToHistory();
    event.preventDefault();
  }

  /**
   * Event handler for OnClick events in the Keypad component.
   * @param {Object} event Button OnClick event.
   */
  handleOnClick(event) {
    const value = event.currentTarget.value;
    let newStack = new Stack(this.state.stack.ary);
    let skipHistory = false;
    let newPromptValue;

    switch (value) {
      case 'root':
        newStack.calcRoot();
        break;
      case 'exp':
        newStack.calcExp();
        break;
      case 'reciprocal':
        newStack.calcReciprocal();
        break;
      case 'add':
        newStack.calcAdd();
        break;
      case 'subtract':
        if (this.state.promptValue) {
          if (this.state.promptValue.charAt(0) !== '-') {
            newPromptValue = `-${this.state.promptValue}`;
            skipHistory = true;
          }
        } else {
          newStack.calcSubstract();
        }
        break;
      case 'multiply':
        newStack.calcMultiply();
        break;
      case 'divide':
        newStack.calcDivide();
        break;
      case 'sum':
        newStack.calcSum();
        break;
      case 'del':
        newPromptValue = this.chopPromptValue();
        break;
      case 'clear':
        newStack.empty();
        break;
      case 'pop':
        newStack.pop();
        break;
      case 'swap':
        newStack.swap();
        break;
      case 'enter':
        newStack.push(this.state.promptValue);
        break;
      case 'undo':
        newStack = this.undoHistory();
        skipHistory = true;
        break;
      default: {
        const key = this.state.keys[value];
        newPromptValue = this.state.promptValue + key;
        skipHistory = true;
        break;
      }
    }

    this.setState({ stack: newStack });
    this.setState({ promptValue: newPromptValue || '' });

    if (!skipHistory) {
      this.addToHistory();
    }
  }

  /**
   * Method that chops the promptValue, that is remove the last char.
   * @return {String} Chopped promptValue
   */
  chopPromptValue() {
    let promptValue = this.state.promptValue;
    promptValue = promptValue.substring(0, promptValue.length - 1);
    return (promptValue);
  }

  /**
   * Add the current stack to the history if the stack is not empty.
   */
  addToHistory() {
    if (this.state.stack.ary.length === 0) {
      return;
    }

    const newHistory = new History(this.state.history.ary);
    const newStack = new Stack(JSON.parse(JSON.stringify(this.state.stack.ary)));

    newHistory.push(newStack.ary);
    this.setState({ history: newHistory });
  }

  /**
   * Undo action by replacing the current stack with last one from the history.
   * @return {Stack} Stack object one step back in time.
   */
  undoHistory() {
    if (this.state.history.ary.length === 0) {
      return this.state.stack;
    }

    const newHistory = new History(this.state.history.ary);
    newHistory.pop();
    const newStack = new Stack(JSON.parse(JSON.stringify(newHistory.last())));

    this.setState({ history: newHistory });

    return newStack;
  }

  /**
   * React.component's required render method for rendering the app.
   * @return {Object} JSX code that is transpiled to Javascript.
   * @property {Number} rows Number of rows in Display element.
   * @property {Number} cols Number of columns in Display and Prompt elements.
   * @property {Number} prefixSize Size of prefix used for padding.
   * @property {Number} suffixSize Size of suffex used for padding.
   * @property {Stack} stack Current stack.
   * @property {Object} inputRef ref callback.
   * @property {String} promptValue Value in the prompt.
   * @property {Object} handleOnChange Event handler for OnChange.
   * @property {Object} handleOnSubmit Event hndler for OnSubmit.
   * @property {Object} handleOnClick Event handler for OnClick.
   * @property {Object} keys Map of key names and labels.
   */
  render() {
    return (
      <div className="app">
        <Display
          rows={ROWS}
          cols={COLS}
          prefixSize={this.state.prefixSize}
          suffixSize={this.state.suffixSize}
          stack={this.state.stack}
        />
        <Prompt
          cols={COLS}
          inputRef={(inputElement) => { this.inputElement = inputElement; }}
          promptValue={this.state.promptValue}
          handleOnChange={this.handleOnChange}
          handleOnSubmit={this.handleOnSubmit}
        />
        <Keypad
          keys={this.state.keys}
          handleOnClick={this.handleOnClick}
        />
      </div>
    );
  }
}

AppContainer.propTypes = {
  handleOnSubmit: PropTypes.func,
  handleOnChange: PropTypes.func,
  handleOnClick: PropTypes.func,
};

export default AppContainer;