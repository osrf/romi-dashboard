import {
  Checkbox,
  FormControl,
  Input,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from '@material-ui/core';
import { Column, EditCellColumnDef } from 'material-table';
import React from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export interface CustomLookupFilterParserProps {
  // Prop RowData from material-table is not exported so unknown
  columnDef: Column<{ level: string; message: string; timestamp: string }>;
  onFilterChanged: (rowId: string, value: string | number | unknown) => void;
}

/**
 * Component created to override the default lookup filter.
 */

export const CustomLookupFilterParser = (
  props: CustomLookupFilterParserProps,
): React.ReactElement => {
  const { columnDef: columnDefRaw, onFilterChanged } = props;
  /**
   * The column type in the material-table library it's not working correctly. So as a workaround I'm assigning the types to the properties need it in this component.
   */
  const columnDef = columnDefRaw as {
    tableData: EditCellColumnDef['tableData'];
    filterOnItemSelect: unknown;
    lookup: Record<string, string>;
  };

  return (
    <CustomLookupFilter
      tableId={columnDef.tableData.id}
      filterValue={columnDef.tableData.filterValue}
      filterOnItemSelect={columnDef.filterOnItemSelect}
      onFilterChanged={onFilterChanged}
      lookup={columnDef.lookup}
    />
  );
};

export interface CustomLookupFilterProps {
  tableId: number;
  filterValue: EditCellColumnDef['tableData']['filterValue'];
  filterOnItemSelect: unknown;
  onFilterChanged: (rowId: string, value: string | number | unknown) => void;
  lookup: Record<string, string>;
}

export const CustomLookupFilter = (props: CustomLookupFilterProps): React.ReactElement => {
  const { tableId, filterValue, filterOnItemSelect, onFilterChanged, lookup } = props;
  const [selectedFilter, setSelectedFilter] = React.useState(filterValue || []);
  React.useEffect(() => {
    setSelectedFilter(filterValue || []);
  }, [filterValue]);

  return (
    <FormControl style={{ width: '100%' }}>
      <InputLabel
        htmlFor={'select-multiple-checkbox' + tableId}
        style={{ marginTop: -16 }}
      ></InputLabel>
      <Select
        multiple
        value={selectedFilter}
        onClose={() => {
          if (filterOnItemSelect !== true) onFilterChanged(tableId.toString(), selectedFilter);
        }}
        onChange={(event) => {
          setSelectedFilter(event.target.value);
          if (filterOnItemSelect === true) onFilterChanged(tableId.toString(), event.target.value);
        }}
        input={<Input id={'select-multiple-checkbox' + tableId} />}
        renderValue={(selecteds) =>
          (selecteds as string[]).map((selected: string) => lookup[selected]).join(', ')
        }
        MenuProps={MenuProps}
        style={{ marginTop: 0 }}
      >
        {Object.keys(lookup).map((key: string) => (
          <MenuItem key={key} value={key}>
            <Checkbox checked={selectedFilter.indexOf(key.toString()) > -1} />
            <ListItemText primary={lookup[key]} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
