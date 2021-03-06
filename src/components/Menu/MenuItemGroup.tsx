import * as React from 'react';
import posed from 'react-pose';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

import { css } from './style';
import { SidePanelContext } from '../Layout/SidePanel';
import { Popover } from '../Popover';
import { PopoverProps } from '../Popover/Popover';
import { ThemeConsumer } from '../Theme/Theme';

export class MenuItemGroup extends React.Component<MenuItemGroupProps, State> {

  constructor(props: MenuItemGroupProps) {
    super(props);

    this.state = {
      active: this.props.defaultActive,
    };
  }

  static defaultProps = {
    inline: true,
    position: 'right',
  };

  toggle = () => {
    this.setState({ active: !this.state.active });
  }

  renderChilden = () => {
    if (Array.isArray(this.props.children)) {
      return this.props.children.map(el => {
        if (['string', 'number', 'boolean'].indexOf(typeof (el)) < 0) {
          return React.cloneElement(el as React.ReactElement<any>, { nested: true });
        }
      });
    }
    return (
      React.cloneElement(this.props.children as React.ReactElement<any>, { nested: true })
    );
  }

  renderPopup = (isBarOpen: boolean) => {
    const { icon, title } = this.props;

    if (isBarOpen) {
      return (
        <ThemeConsumer>
          {(theme) => {
            const style = css(false, theme, isBarOpen);
            return (
              <li
                key={name}
                className={`${style.flex} ${style.menuItem}`}
                onClick={this.toggle}
              >
                {icon
                  && <div
                    className={`${style.icon}`}
                    style={{
                      padding: isBarOpen ? '0 20px 0 0' : '0',
                    }}
                  >
                    {icon}
                  </div>
                }
                {isBarOpen && <div className={`${style.flex_1}`}>
                  <span className={style.groupTitle}>{title}</span>
                </div>}
                {isBarOpen && <div className={style.flexEnd}>
                  {this.state.active ? <FaChevronDown key='1' /> : <FaChevronUp key='2' />}
                </div>}
              </li>
            );
          }}
        </ThemeConsumer>
      );
    }

    return (
      <ThemeConsumer>
        {(theme) => {
          const style = css(false, theme, isBarOpen);
          return (
            <Popover
              content={
                <div
                  className={`${style.groupContainer} ${style.popoverContent}`}
                >
                  {this.renderChilden()}
                </div>
              }
              trigger={this.props.trigger}
              position={this.props.position}
              hideArrow
              style={{
                content: {
                  padding: '0',
                },
                child: {
                  display: 'inline-block',
                },
              }}
              align={this.props.offset && { offset: this.props.offset }}
            >
              {this.props.anchor || <li
                key={name}
                className={`${style.flex} ${style.menuItem}`}
                onClick={this.toggle}
              >
                <div
                  className={`${style.icon}`}
                  style={{
                    padding: isBarOpen ? '0 20px 0 0' : '0',
                  }}
                >
                  {icon} {!this.props.inline && title}
                </div>
              </li>}
            </Popover>
          );
        }}
      </ThemeConsumer>
    );
  }

  render() {
    return (
      <SidePanelContext.Consumer>
        {context => {
          const isBarOpen = this.props.inline && context.width > 200;
          return (
            <ThemeConsumer>
              {(theme) => {
                const style = css(false, theme, false);
                return (
                  <>
                    {this.renderPopup(isBarOpen)}
                    {isBarOpen && <Content
                      className={`${style.groupContainer}`}
                      pose={this.state.active ? 'open' : 'closed'}
                    >
                      {this.props.children}
                    </Content>}
                  </>
                );
              }}
            </ThemeConsumer>
          );
        }}
      </SidePanelContext.Consumer>
    );
  }
}

const Content = posed.div({
  closed: { height: 0 },
  open: { height: 'auto' },
});

interface MenuItemGroupProps {
  title: React.ReactNode;
  icon?: React.ReactNode;
  name?: string;
  defaultActive?: boolean;
  inline?: boolean;
  position?: PopoverProps['position'];
  trigger?: PopoverProps['trigger'];

  /**
   * Custom element to be shown as anchor
   * Applicable only for popover menu.
   */
  anchor?: PopoverProps['children'];

  /**
   * Offset for element popup placement
   * [X, Y]
   */
  offset?: [number, number];
}

interface State {
  active?: boolean;
}
