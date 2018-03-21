// @flow
import * as React from "react";
import type { Value, Change } from "slate";
import { Portal } from "react-portal";
import WindowDimensions from 'react-window-detect-dimensions';
import { getVisibleSelectionRect } from "./utils";
import Container from "./container";

type Props = {
  toolbarMarks: Array<React.Element<*> | string>,
  toolbarBlocks: Array<React.Element<*> | string>,
  value: Value,
  onChange: (change: Change) => void
};

export default (options: { [string]: any } = {}) => {
  let { defaultNode, toolbarBlocks, toolbarMarks, toolbarElement } = options;
  let i = 0;

  if (!defaultNode) {
    defaultNode = "paragraph";
  }
  if (!toolbarBlocks) {
    toolbarBlocks = [];
  }
  if (!toolbarMarks) {
    toolbarMarks = [];
  }

  if (!toolbarElement) {
    toolbarElement = "slate-editor-toolbar";
  }

  return (Editor: any) => {
    class Toolbar extends React.Component<Props> {
      constructor(props: Props) {
        super(props);

        if (document && document.getElementById(toolbarElement)) {
          this.toolbarElement =
            document && (document: any).getElementById(toolbarElement);
        } else {
          throw new Error(
            `You have to have a element id: "${toolbarElement}" in your html`
          );
        }
      }

      toolbarContainerNode: ?HTMLDivElement;
      containerNode: ?HTMLDivElement;
      toolbarElement: HTMLElement;

      static defaultProps = {
        toolbarMarks: [],
        toolbarBlocks: []
      };

      componentDidMount() {
        window.addEventListener('scroll', () => this.componentDidUpdate());
      }

      componentWillUnmount() {
        window.removeEventListener('scroll', () => this.componentDidUpdate());
      }

      componentDidUpdate() {
        const rect = getVisibleSelectionRect();
        if (!rect || !this.toolbarContainerNode || !this.containerNode) {
          return;
        }

        const top = rect.top - this.toolbarContainerNode.offsetHeight;
        const left =
          rect.left -
          this.toolbarContainerNode.offsetWidth / 2 +
          rect.width / 2;

        this.toolbarContainerNode.style.position = "fixed";
        this.toolbarContainerNode.style.top = `${top}px`;
        this.toolbarContainerNode.style.left = `${left}px`;
      }

      renderButton = (Type: any) => {
        const { value, onChange } = this.props;

        if (Type === "divider") {
          return <div className="divider" key={i++} />;
        }

        return (
          <Type
            change={value.change()}
            onChange={onChange}
            key={i++}
            className="slateToolbarItem"
            strokeClassName="qlStroke"
            strokeMitterClassName="qlStrokeMitter"
            fillClassName="qlFill"
            evenClassName="qlEven"
            colorLabelClassName="qlColorLabel"
            thinClassName="qlThin"
            activeStrokeMitterClassName="qlStrokeMitterActive"
            activeClassName="slateToolbarItem activeItem"
            activeStrokeClassName="qlStrokeActive"
            activeFillClassName="qlFillActive"
            activeThinClassName="qlThinActive"
            activeEvenClassName="qlEvenActive"
          />
        );
      };

      renderMenu = () => {
        const { value } = this.props;
        const toolbarMarksList = [...toolbarMarks, ...this.props.toolbarMarks];

        const toolbarBlocksList = [
          ...toolbarBlocks,
          ...this.props.toolbarBlocks
        ];

        return (
          value.isExpanded &&
          value.isFocused && (
            <Portal node={this.toolbarElement}>
              <Container>
                <div
                  className="slateToolbar"
                  ref={node => (this.toolbarContainerNode = node)}
                >
                  <div className="slateToolbarItems">
                    {toolbarMarksList.length && (
                      <div className="item">
                        {toolbarMarksList.map(this.renderButton)}
                      </div>
                    )}
                    {toolbarBlocksList.length && (
                      <div className="item">
                        {toolbarBlocksList.map(this.renderButton)}
                      </div>
                    )}
                  </div>
                </div>
              </Container>
            </Portal>
          )
        );
      };
      render() {
        return (
          <div ref={node => (this.containerNode = node)}>
            {this.renderMenu()}
            <Editor {...this.props} />
          </div>
        );
      }
    };

    return class SlateToolbarDecorator extends React.Component<Props> {
      render() {
        return (
          <WindowDimensions>
            { ({ windowWidth, windowHeight }) => (
              <Toolbar
                {...this.props}
                windowWidth={windowWidth}
                windowHeight={windowHeight}
                />
            )}
          </WindowDimensions>
        );
      }
    }
  }
};
