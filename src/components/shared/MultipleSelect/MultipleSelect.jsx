import Select from 'react-select';

export const DropDown = (props) => {
  const options = props?.options?.length > 0 && [
    { label: 'Select All', value: 'all' },
    ...props?.options,
  ];

  return (
    <div className={`react-select-wrapper ${props?.multi ? 'multi' : ''}`}>
      <Select
        classNamePrefix="select"
        options={options}
        isMulti
        isLoading={props?.isLoading}
        isDisabled={props?.isDisabled}
        value={props?.value ? props?.value : null}
        onChange={(selected) => {
          props?.multi &&
          selected.length &&
          selected.find((option) => option.value === 'all')
            ? props.handleChange(options.slice(1))
            : !props.multi
            ? props.handleChange((selected && selected.value) || null)
            : props.handleChange(selected);
        }}
      />
    </div>
  );
};
