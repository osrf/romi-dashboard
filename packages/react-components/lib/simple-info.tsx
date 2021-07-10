import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { joinClasses } from './css-utils';

type DataValueTypePrimitive = number | string;
type DataValueTypeArray = DataValueTypePrimitive[];
type DataValueType = DataValueTypePrimitive | DataValueTypeArray;

/**
 * @param name label of the row
 * @param value value of the row
 * @param className add and override styles
 * @param className.value adds and style to the value
 * @param className.overrideValue overrides the style of the value.
 * @param className.overrideArrayItemValue overrides the style of the value
 * in case the value is an array
 * @param disabled adds the disabled style
 * @param wrap wraps the context of the text
 */
export interface SimpleInfoData<T extends DataValueType = DataValueType> {
  name: string;
  value: T;
  className?: {
    value?: T extends DataValueTypeArray ? string | string[] : string;
    overrideValue?: string;
    overrideArrayItemValue?: string;
  };
  disabled?: boolean;
  wrap?: boolean;
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'table',
    borderCollapse: 'collapse',
    width: '100%',
    overflowX: 'auto',
  },
  tableRow: {
    display: 'table-row',
  },
  displayName: {
    display: 'table-cell',
    borderBottom: '1px solid',
    borderTop: '1px solid',
    background: 'rgba(0, 0, 0, 0.1)',
    padding: theme.spacing(0.25, 2),
    width: '30%',
  },
  value: {
    display: 'table-cell',
    textAlign: 'end',
    borderBottom: '1px solid',
    borderTop: '1px solid',
    padding: theme.spacing(0.25, 2),
  },
  arrayListItem: {
    justifyContent: 'flex-end',
  },
  arrayItemValue: {
    textAlign: 'end',
  },
  disabled: {
    color: theme.palette.action.disabled,
  },
}));

export interface SimpleInfoProps extends React.HTMLProps<HTMLDivElement> {
  infoData: SimpleInfoData[];
  overrideStyle?: {
    container?: string;
    tableRow?: string;
  };
}

export const SimpleInfo = (props: SimpleInfoProps): JSX.Element => {
  const { infoData, overrideStyle, ...otherProps } = props;
  const classes = useStyles();

  const renderPrimitive = ({
    name,
    value,
    className,
    disabled,
    wrap,
  }: SimpleInfoData<DataValueTypePrimitive>) => (
    <>
      <Typography className={classes.displayName} variant="body1" role="rowheader">
        {name}
      </Typography>
      <Typography
        noWrap={!wrap}
        variant="body1"
        className={joinClasses(
          className?.overrideValue ? className?.overrideValue : classes.value,
          disabled ? classes.disabled : undefined,
          className?.value,
        )}
        role="cell"
      >
        {value}
      </Typography>
    </>
  );

  const renderArray = ({
    name,
    value,
    className,
    disabled,
  }: SimpleInfoData<DataValueTypeArray>) => {
    const arrayItemValueStyle = className?.overrideArrayItemValue
      ? className?.overrideArrayItemValue
      : classes.arrayItemValue;
    const valueStyle = className?.overrideValue ? className?.overrideValue : classes.value;
    return (
      <>
        <Typography className={classes.displayName} variant="body1" role="rowheader">
          {name}
        </Typography>
        <List className={valueStyle} dense role="cell">
          {value.map((item, i) => (
            <ListItem key={i} className={classes.arrayListItem}>
              <Typography
                variant="body1"
                className={joinClasses(
                  arrayItemValueStyle,
                  disabled ? classes.disabled : undefined,
                  Array.isArray(className?.value) ? className?.value[i] : className?.value,
                )}
              >
                {item}
              </Typography>
            </ListItem>
          ))}
        </List>
      </>
    );
  };

  const renderLine = (data: SimpleInfoData) => {
    switch (typeof data.value) {
      case 'object':
        if (Array.isArray(data.value)) {
          return renderArray(data as SimpleInfoData<DataValueTypeArray>);
        } else {
          throw Error('nested object is not supported');
        }
        break;
      case 'function':
      case 'symbol':
        break;
      default:
        return renderPrimitive(data as SimpleInfoData<DataValueTypePrimitive>);
    }
  };

  return (
    <div {...otherProps}>
      <div
        className={overrideStyle?.container ? overrideStyle?.container : classes.container}
        role="table"
      >
        {infoData.map((item) => (
          <React.Fragment key={item.name}>
            <div
              className={overrideStyle?.tableRow ? overrideStyle?.tableRow : classes.tableRow}
              role="row"
              aria-label={item.name}
            >
              {renderLine(item)}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SimpleInfoProps;
