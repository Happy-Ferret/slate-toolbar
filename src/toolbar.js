import React, {Component, PropTypes} from 'react';
import Portal from 'react-portal';
import {utils} from 'slate-plugins';
const {getVisibleSelectionRect} = utils.range;
import './style.css';

export default (options = {}) => {
  let {defaultNode, toolbarBlocks, toolbarMarks} = options;
  let i = 0;

  if (!defaultNode) {
    defaultNode = 'paragraph';
  }
  if (!toolbarBlocks) {
    toolbarBlocks = [];
  }
  if (!toolbarMarks) {
    toolbarMarks = [];
  }

  return Editor => class SlateToolbarDecorator extends Component {

    constructor(props) {
      super(props);
      this.renderBlockButton = this.renderBlockButton.bind(this);
      this.renderMarkButton = this.renderMarkButton.bind(this);
      this.onOpen = this.onOpen.bind(this);

      this.state = {menu: null};
    }

    static propTypes = {
      toolbarMarks: PropTypes.array,
      toolbarBlocks: PropTypes.array,
      state: PropTypes.object,
      onChange: PropTypes.func
    };

    static defaultProps = {
      toolbarMarks: [],
      toolbarBlocks: [],
      children: []
    };

    componentDidMount() {
      const {menu} = this.state;
      if (!menu) {
        return;
      }

      const rect = getVisibleSelectionRect();
      if (!rect) {
        return;
      }
      const top = (rect.top + window.scrollY) - menu.offsetHeight;
      const left = rect.left + window.scrollX - menu.offsetWidth / 2 + rect.width / 2; // eslint-disable-line
      menu.style.top = `${top}px`;
      menu.style.left = `${left}px`;
    }

    componentDidUpdate() {
      this.componentDidMount();
    }

    renderBlockButton(Type) {
      const {state, onChange} = this.props;
      return React.createElement(Type, {
        state,
        onChange,
        key: ++i,
        className: 'slate-toolbar-item',
        activeClassName: 'slate-toolbar-item active-item'
      });
    }

    renderMarkButton(Type) {
      const {state, onChange} = this.props;

      if (Type === 'devider') {
        return <div className="devider"/>;
      }

      return React.createElement(Type, {
        state,
        onChange,
        key: ++i,
        className: 'slate-toolbar-item',
        activeClassName: 'slate-toolbar-item active-item'
      });
    }

    onOpen({firstChild: menu}) {
      this.setState({menu});
    }

    renderMenu() {
      // const {value} = this.props;
      const theToolbarMarks = [...toolbarMarks, ...this.props.toolbarMarks];
      const theToolbarBlocks = [...toolbarBlocks, ...this.props.toolbarBlocks];

      return (
        <Portal
          // isOpened={value.isBlurred === false && value.isExpanded === true}
          isOpened
          onOpen={this.onOpen}>
          <div className="slate-toolbar">
            {
              theToolbarMarks.length > 0 ?
                <div className="slate-toolbar-section">
                  {theToolbarMarks.map(this.renderMarkButton)}
                </div> : null
            }
            {
              theToolbarBlocks.length > 0 ?
                <div className="slate-toolbar-section">
                  {theToolbarBlocks.map(this.renderBlockButton)}
                </div> : null
            }
          </div>
        </Portal>
      );
    }
    render() {
      return (
        <div>
          {this.renderMenu()}
          <Editor {...this.props}/>
        </div>
      );
    }
  };
};
