import React, {Component, PropTypes} from 'react';
import Portal from 'react-portal';
import {utils} from 'slate-plugins';
const {getVisibleSelectionRect} = utils.range;
import styles from './style.scss';

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
        className: styles.slateToolbarItem,
        strokeClassName: styles.qlStroke,
        strokeMitterClassName: styles.qlStrokeMitter,
        fillClassName: styles.qlFill,
        evenClassName: styles.qlEven,
        colorLabelClassName: styles.qlColorLabel,
        thinClassName: styles.qlThin,
        activeStrokeMitterClassName: styles.qlStrokeMitterActive,
        activeClassName: `${styles.slateToolbarItem} ${styles.activeItem}`,
        activeStrokeClassName: styles.qlStrokeActive,
        activeFillClassName: styles.qlFillActive,
        activeThinClassName: styles.qlThinActive,
        activeEvenClassName: styles.qlEvenActive
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
        className: styles.slateToolbarItem,
        strokeClassName: styles.qlStroke,
        strokeMitterClassName: styles.qlStrokeMitter,
        fillClassName: styles.qlFill,
        evenClassName: styles.qlEven,
        colorLabelClassName: styles.qlColorLabel,
        thinClassName: styles.qlThin,
        activeStrokeMitterClassName: styles.qlStrokeMitterActive,
        activeClassName: `${styles.slateToolbarItem} ${styles.activeItem}`,
        activeStrokeClassName: styles.qlStrokeActive,
        activeFillClassName: styles.qlFillActive,
        activeThinClassName: styles.qlThinActive,
        activeEvenClassName: styles.qlEvenActive
      });
    }

    onOpen({firstChild: menu}) {
      this.setState({menu});
    }

    renderMenu() {
      const {state} = this.props;
      const theToolbarMarks = [...toolbarMarks, ...this.props.toolbarMarks];
      const theToolbarBlocks = [...toolbarBlocks, ...this.props.toolbarBlocks];
      return (
        <Portal
          isOpened={state.isExpanded === true && state.isBlurred !== true}
          onOpen={this.onOpen}>
          <div className={styles.slateToolbar}>
            <div className={styles.slateToolbarMarkSection}>
              {
                theToolbarMarks.length > 0 ?
                  <div className={styles.slateToolbarSection}>
                    {theToolbarMarks.map(this.renderMarkButton)}
                  </div> : null
              }
            </div>
            <div className={styles.slateToolbarBlockSection}>
              {
                theToolbarBlocks.length > 0 ?
                  <div className={styles.slateToolbarSection}>
                    {theToolbarBlocks.map(this.renderBlockButton)}
                  </div> : null
              }
            </div>
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
