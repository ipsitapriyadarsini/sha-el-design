import * as React from 'react';
import { stylesheet } from 'typestyle';
import { ThemeService, Theme } from '../../helpers/theme';
import { styleEnum } from '../../helpers/constants';
import { Omit, nestedAccess } from '../../helpers';

export class TextArea extends React.Component<TextAreaProps, State> {

  static defaultProps = {
    containerClassName: '',
    containerStyle: {},
  };

  theme = new ThemeService();
  textarea: HTMLTextAreaElement;

  constructor(props: TextAreaProps) {
    super(props);

    this.state = {
      theme: this.theme.selectedTheme$.value,
      focused: false,
    };
  }

  get isTextAreaActive() {
    return !!(
      this.state.focused || this.props.value || this.props.defaultValue || nestedAccess(this.textarea, 'value')
      || this.props.placeholder || nestedAccess(this.textarea, 'placeholder')
    );
  }

  render() {
    const {
      error,
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

    const css = style(this.state.theme, !!error, !!before, this.isTextAreaActive);
    return (
      <>
        <div className={`${css.container} ${containerClassName}`} style={containerStyle}>
          {
            before &&
            <span
              className={css.seudo}
            >
              {before}
            </span>
          }
          <section
            key='textarea'
            className={css.section}
          >
            <textarea
              className={css.textarea}
              ref={(e) => {
                getElement && getElement(e);
                this.textarea = e;
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
          </section>
          {
            after &&
            <span
              className={css.seudo}
            >
              {after}
            </span>
          }
        </div>
        <div className={`${css.help}`}>
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
        </div>
      </>
    );
  }
}

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  after?: React.ReactNode;
  before?: React.ReactNode;
  error?: React.ReactNode;
  hint?: React.ReactNode;
  getElement?: (textarea: HTMLTextAreaElement) => void;
  containerStyle?: React.CSSProperties;
  containerClassName?: string;
}

interface State {
  theme: Theme;
  focused: boolean;
}

function style(theme: Theme, isError: boolean, before: boolean, active: boolean) {
  const borderColor = isError ? theme.error : 'rgba(0,0,0,.24)';
  return stylesheet({
    container: {
      display: 'flex',
      padding: '3px',
      marginBottom: '24px',
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

      $nest: {
        '*': {
          color: borderColor,
          transition: '.2s all',
        },
        '&:focus-within': {
          borderColor: theme.primary,
          background: '#ffffff',

          $nest: {
            '*:not(textarea)': {
              color: theme.primary,
            },
          },
        },
        '&:hover': {
          borderColor: 'rgb(9, 30, 66)',
        },
      },
    },
    section: {
      position: 'relative',
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
    textarea: {
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
      padding: '8px 5px',
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
      transition: '.4s all',
      left: 0,
      right: 'auto',
      transformOrigin: 'top left',
      background: 'white',
      zIndex: 1000,
      pointerEvents: 'none',
      ...(active ? {
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: 1.13333,
        transform: 'translateY(-21px)',
        left: before ? '-21px' : '5px',
      } : {
          fontSize: '13px',
          fontWeight: 300,
          lineHeight: 1.13333,
          top: 'auto',
        }),
    },
    help: {
      width: '100%',
      marginTop: '-20px',
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
      padding: '0 .4em',
    },
  });
}
