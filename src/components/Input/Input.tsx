import * as React from 'react';
import { stylesheet } from 'typestyle';
import { ThemeService, Theme } from '../../helpers/theme';
import { Omit, nestedAccess } from '../../helpers';
import { Row, Col } from '../../';

export class Input extends React.Component<InputProps, State> {

  static defaultProps = {
    containerClassName: '',
    containerStyle: {},
  };

  theme = new ThemeService();
  input: HTMLInputElement;

  constructor(props: InputProps) {
    super(props);

    this.state = {
      theme: this.theme.selectedTheme$.value,
      focused: false,
    };
  }

  get isInputActive() {
    return !!(
      this.state.focused || this.props.value || this.props.defaultValue || nestedAccess(this.input, 'value')
      || this.props.placeholder || nestedAccess(this.input, 'placeholder') || this.props.before
    );
  }

  render() {
    const {
      error,
      label,
      getElement,
      after,
      before,
      required,
      hint,
    } = this.props;

    const {
      containerStyle,
      containerClassName,
      ...rest
    } = this.props;

    const css = style(this.state.theme, !!error, !!label, this.isInputActive);
    return (
      <>
        <Row gutter={[0, 0]} className={`${css.container} ${containerClassName}`} style={containerStyle}>
          {
            before &&
            <Col
              className={css.seudo}
              flex='0 1 auto'
            >
              {before}
            </Col>
          }
          {label && <span
            key='label'
            className={css.label}
          >
            {label} {required && <span style={{ color: 'red' }}>*</span>}
          </span>}
          <Col
            key='input'
            className={css.section}
            flex='1 0 auto'
          >
            <input
              className={css.input}
              ref={(e) => {
                getElement && getElement(e);
                this.input = e;
              }}
              onFocus={(e) => {
                this.props.onFocus && this.props.onFocus(e);
                this.setState({ focused: true });
              }}
              onBlur={(e) => {
                this.props.onBlur && this.props.onBlur(e);
                this.setState({ focused: false });
              }}
              {...rest}
            />
          </Col>
          {
            after &&
            <Col
              className={css.seudo}
              flex='0 1 auto'
            >
              {after}
            </Col>
          }
        </Row>
        {(error || hint) && <div className={`${css.help}`}>
          {
            error &&
            <label
              className={`${css.error}`}
            >
              {error}
            </label>
          }
          {
            hint &&
            <label
              className={`${css.hint}`}
            >
              {hint}
            </label>
          }
        </div>}
      </>
    );
  }
}

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  label?: React.ReactNode;
  after?: React.ReactNode;
  before?: React.ReactNode;
  error?: React.ReactNode;
  hint?: React.ReactNode;
  getElement?: (input: HTMLInputElement) => void;
  containerStyle?: React.CSSProperties;
  containerClassName?: string;
}

interface State {
  theme: Theme;
  focused: boolean;
}

function style(theme: Theme, isError: boolean, label: boolean, active: boolean) {
  const borderColor = isError ? theme.error : 'rgba(0,0,0,.24)';
  return stylesheet({
    container: {
      display: 'flex',
      position: 'relative',
      boxSizing: 'border-box',
      color: 'rgb(9, 30, 66)',
      fontSize: '14px',
      justifyContent: 'space-between',
      lineHeight: 1.12857,
      maxWidth: '100%',
      overflowWrap: 'break-word',
      borderWidth: '1px',
      borderColor,
      borderRadius: '4px',
      borderStyle: 'solid',
      cursor: 'text',
      borderTop: (active && label) && 'none',
      $nest: {
        '&:focus-within': {
          borderColor: theme.primary,
          background: '#ffffff',

          $nest: {
            '*:not(input)': {
              color: theme.primary,
              $nest: {
                '&::after, &::before': {
                  borderColor: theme.primary,
                },
              },
            },
          },
        },
        '&:hover': {
          borderColor: !active && 'rgb(9, 30, 66)',
        },
      },
    },
    section: {
      boxSizing: 'border-box',
      color: 'rgb(9, 30, 66)',
      display: 'flex',
      fontSize: '14px',
      justifyContent: 'space-between',
      lineHeight: 1.12857,
      maxWidth: '100%',
      flex: '1 0 auto',
      transition: 'background-color 0.2s ease-in-out 0s, border-color 0.2s ease-in-out 0s',
      borderWidth: '1px',
    },
    input: {
      fontSize: '16px',
      minWidth: '0px',
      width: '100%',
      background: 'transparent',
      borderWidth: '0px',
      borderStyle: 'initial',
      borderColor: 'initial',
      borderImage: 'initial',
      outline: 'none',
      flex: '1 1 auto',
      lineHeight: '12px',
      padding: '15px',
      maxWidth: '100%',
      color: '#090909',
      $nest: {
        '&::placeholder': {
          color: '#aaaaaa',
        },
      },
    },
    label: {
      position: 'absolute',
      display: 'flex',
      alignSelf: 'center',
      color: 'rgb(107, 119, 140)',
      boxSizing: 'border-box',
      left: 0,
      top: -7,
      height: '100%',
      pointerEvents: 'none',
      transition: 'line-height 0.2s',
      $nest: {
        '&::after, &::before': {
          content: `''`,
          display: 'block',
          boxSizing: 'border-box',
          marginTop: '6px',
          borderTop: 'solid 1px',
          borderTopColor: active ? borderColor : 'transparent',
          minWidth: '10px',
          height: '8px',
          pointerEvents: 'none',
          boxShadow: 'inset 0 1px transparent',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        },
        '&::before': {
          marginRight: '4px',
          borderTopLeftRadius: '4px',
        },
        '&::after': {
          flexGrow: 1,
          marginLeft: '4px',
          borderTopRightRadius: '4px',
        },
      },
      ...(active ? {
        fontSize: '10px',
        fontWeight: 400,
        lineHeight: '14px',
        width: '100%',
      } : {
          fontSize: '13px',
          fontWeight: 300,
          lineHeight: '58px',
        }),
    },
    help: {
      width: '100%',
      marginBottom: '20px',
      display: 'flex',
      placeContent: 'space-between',
      fontSize: '12px',
    },
    hint: {
      color: '#aaaaaa',
      padding: '0 5px',
    },
    error: {
      color: theme.error,
      padding: '0 5px',
    },
    seudo: {
      display: 'flex',
      alignItems: 'center',
      padding: '0 .4rem !important',
    },
  });
}
