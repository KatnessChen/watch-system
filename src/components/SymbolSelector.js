import { Select } from 'antd';

const { Option } = Select;

const SymbolSelector = ({
  defaultValue = '',
  options = [],
  onSelect
}) => {
  return (
    <Select
      showSearch
      style={{ width: 200 }}
      placeholder="Select Symbol"
      optionFilterProp="children"
      defaultValue={defaultValue}
      onSelect={onSelect}
      filterOption={(input, option) =>
        option.children.toLowerCase().startsWith(input.toLowerCase())
      }
      filterSort={(optionA, optionB) =>
        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
      }
    >
      {options.map(({ value, label }) => <Option key={value} value={value}>{label}</Option>)}
    </Select>
  )
}

export default SymbolSelector