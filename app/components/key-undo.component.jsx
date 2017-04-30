import React from 'react';
import PropTypes from 'prop-types';

/**
 * Pure React function for the rendering of the UNDO key on the keypad.
 * @param {Object} props Component properties.
 * @property {Object} _handleOnClick Event handler for clicking the key.
 */
function KeyUndo(props) {
  const tip = 'Undo the last stack action';

  return (
    <button
      data-tip={tip}
      className="key key-width-2"
      type="button"
      value="undo"
      onClick={props._handleOnClick}
    >
      UNDO
    </button>
  );
}

KeyUndo.propTypes = {
  _handleOnClick: PropTypes.func,
};

export default KeyUndo;
