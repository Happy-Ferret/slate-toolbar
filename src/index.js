// @flow
import * as React from "react";
import type { Value, Change } from "slate";
import WindowDimensions from "react-window-detect-dimensions";
import Bold, { BoldPlugin } from "@canner/slate-icon-bold";
import Italic, { ItalicPlugin } from "@canner/slate-icon-italic";
import Underline, { UnderlinePlugin } from "@canner/slate-icon-underline";
import { ParagraphPlugin } from "@canner/slate-icon-shared";
import { getVisibleSelectionRect } from "./utils";
import Container from "./container";

type Props = {
  icons: Array<React.Element<*> | string>,
  plugins?: Array<any>,
  value: Value,
  onChange: (change: Change) => void
};

const defaultPlugins = [
  ParagraphPlugin(),
  BoldPlugin(),
  ItalicPlugin(),
  UnderlinePlugin()
];

export default (options: { [string]: any } = {}) => {
  let {
    icons = [Bold, Italic, Underline],
    position = "top"
  } = options;
  let i = 0;

  return (Editor: any) => {
    class Toolbar extends React.Component<Props> {
      constructor(props: Props) {
        super(props);
      }

      toolbarContainerNode: any;
      containerNode: ?HTMLDivElement;

      componentDidMount() {
        window.addEventListener("scroll", () => this.componentDidUpdate());
      }

      componentWillUnmount() {
        window.removeEventListener("scroll", () => this.componentDidUpdate());
      }

      componentDidUpdate() {
        const rect = getVisibleSelectionRect();
        if (!rect || !this.toolbarContainerNode || !this.containerNode) {
          return;
        }

        const containerBound = this.containerNode.getBoundingClientRect()
        const {
          left: containerBoundLeft,
          top: containerBoundTop
        } = containerBound;


        const left = rect.left + rect.width / 2 - containerBoundLeft - this.toolbarContainerNode.offsetWidth / 2;
        this.toolbarContainerNode.style.left = `${left}px`;

        if (position === "bottom") {
          const top = rect.top - containerBoundTop + this.toolbarContainerNode.offsetHeight;
          this.toolbarContainerNode.style.top = `${top}px`;
        } else if (position === "top") {
          const top = rect.top - containerBoundTop - this.toolbarContainerNode.offsetHeight;
          this.toolbarContainerNode.style.top = `${top}px`;
        }
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

        return (
          value.isExpanded &&
          value.isFocused && (
            <Container
              position={position}
              innerRef={node => (this.toolbarContainerNode = node)}>
              <div className="slateToolbarItems">
                {icons.length && (
                  <div className="item">{icons.map(this.renderButton)}</div>
                )}
              </div>
            </Container>
          )
        );
      };
      render() {
        return (
          <div style={{position: 'relative'}} ref={node => (this.containerNode = node)}>
            {this.renderMenu()}
            <Editor {...this.props} />
          </div>
        );
      }
    }

    return class SlateToolbarDecorator extends React.Component<Props> {
      render() {
        return (
          <WindowDimensions>
            {({ windowWidth, windowHeight }) => (
              <Toolbar
                {...this.props}
                plugins={this.props.plugins || defaultPlugins}
                windowWidth={windowWidth}
                windowHeight={windowHeight}
              />
            )}
          </WindowDimensions>
        );
      }
    };
  };
};
