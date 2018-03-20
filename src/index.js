// @flow
import * as React from "react";
import type { Value, Change } from "slate";
import { Portal } from "react-portal";
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

  return (Editor: any) =>
    class SlateToolbarDecorator extends React.Component<Props> {
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

      containerNode: ?HTMLDivElement;
      toolbarElement: HTMLElement;

      static defaultProps = {
        toolbarMarks: [],
        toolbarBlocks: []
      };

      componentDidUpdate() {
        const rect = getVisibleSelectionRect();
        if (!rect || !this.containerNode) {
          return;
        }

        const top = rect.top + window.scrollY - this.containerNode.offsetHeight;
        const left =
          rect.left +
          window.scrollX -
          this.containerNode.offsetWidth / 2 +
          rect.width / 2; // eslint-disable-line
        this.containerNode.style.top = `${top}px`;
        this.containerNode.style.left = `${left}px`;
      }

      renderButton = (Type: any) => {
        const { value, onChange } = this.props;

        if (Type === "divider") {
          return <div className="divider" />;
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
                  ref={node => (this.containerNode = node)}
                >
                  <div className="slateToolbarMarkSection">
                    {toolbarMarksList.length && (
                      <div className="slateToolbarSection">
                        {toolbarMarksList.map(this.renderButton)}
                      </div>
                    )}
                  </div>
                  <div className="slateToolbarBlockSection">
                    {toolbarBlocksList.length && (
                      <div className="slateToolbarSection">
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
          <div>
            {this.renderMenu()}
            <Editor {...this.props} />
          </div>
        );
      }
    };
};
