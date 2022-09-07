import React, { Component, KeyboardEventHandler, useEffect } from 'react';

import CreatableSelect from 'react-select/creatable';
import { ActionMeta, OnChangeValue } from 'react-select';

const components = {
  DropdownIndicator: null,
};

const createOption = (label) => ({
  label,
  value: label,
});

const CreateSelect = (props) => {
  const handleChange = (value, actionMeta) => {
    // console.group('Value Changed');
    console.log(value);
    // console.log(`action: ${actionMeta.action}`);
    // console.groupEnd();
    props.setTags({ ...props?.tags, value });
  };
  const handleInputChange = (inputValue) => {
    props.setTags({ ...props?.tags, inputValue });
  };
  const handleKeyDown = (event) => {
    // console.log(event.key);
    const { inputValue, value } = props?.tags;
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        // console.group('Value Added');
        console.log(value);
        // console.groupEnd();
        props.setTags({
          inputValue: '',
          value: [...value, createOption(inputValue)],
        });
        event.preventDefault();
    }
  };

  useEffect(() => {
    return () => {
      setTags({
        inputValue: '',
        value: [],
      });
    };
  }, []);

  return (
    <CreatableSelect
      components={components}
      inputValue={props?.tags?.inputValue}
      isClearable
      isMulti
      menuIsOpen={false}
      onChange={handleChange}
      onInputChange={handleInputChange}
      onKeyDown={handleKeyDown}
      placeholder="Type something and press enter..."
      value={props?.tags?.value}
    />
  );
};

export default CreateSelect;
