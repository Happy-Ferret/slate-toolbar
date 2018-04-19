// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button} from 'antd';
import {Editor} from 'slate-react';
import {Value, Change} from 'slate';
import {AlignCenter, AlignLeft, AlignRight} from '@canner/slate-icon-align';
import Blockquote, {BlockquotePlugin} from '@canner/slate-icon-blockquote';
import Bold, {BoldPlugin} from '@canner/slate-icon-bold';
import Clean from '@canner/slate-icon-clean';
import Code, {CodePlugin} from '@canner/slate-icon-code';
import {Header1, Header2, HeaderOnePlugin, HeaderTwoPlugin} from '@canner/slate-icon-header';
import Italic, {ItalicPlugin} from '@canner/slate-icon-italic';
import {OlList, UlList, ListPlugin} from '@canner/slate-icon-list';
import StrikeThrough, {StrikeThroughPlugin} from '@canner/slate-icon-strikethrough';
import Underline, {UnderlinePlugin} from '@canner/slate-icon-underline';
import Undo from '@canner/slate-icon-undo';
import {ParagraphPlugin} from '@canner/slate-icon-shared';
import toolbar from '../src';

import {DEFAULT as DEFAULTLIST} from '@canner/slate-helper-block-list';
import {DEFAULT as DEFAULTBLOCKQUOTE} from '@canner/slate-helper-block-quote';
import EditList from 'slate-edit-list';
import EditBlockquote from 'slate-edit-blockquote';

import "./style.css";
import "github-markdown-css";

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: 'A line of text in a paragraph.',
              },
            ],
          },
        ],
      },
    ],
  },
});

const options = {
  position: 'bottom',
  disabledTypes: ['code_block', 'code_line', 'header_one', 'header_two'],
  icons: [
    Undo,
    Bold,
    Italic,
    Underline,
    Code,
    StrikeThrough,
    Clean,
    "divider",
    AlignCenter,
    AlignLeft,
    AlignRight,
    "divider",
    OlList,
    UlList,
    "divider",
    Blockquote,
    Header1,
    Header2
  ]
};

type Props = {
  value: Value,
  onChange: (change: Change) => void
}

const plugins = [
  EditList(DEFAULTLIST),
  EditBlockquote(DEFAULTBLOCKQUOTE),
  BlockquotePlugin(),
  BoldPlugin(),
  CodePlugin(),
  ItalicPlugin(),
  StrikeThroughPlugin(),
  ListPlugin(),
  UnderlinePlugin(),
  ParagraphPlugin(),
  HeaderOnePlugin(),
  HeaderTwoPlugin()
]

@toolbar(options)
class EditorContainer extends React.Component<Props> {

  // On change, update the app's React state with the new editor state.
  render() {
    return (
      <Editor
        {...this.props}
      />
    );
  }
}

class App extends React.Component<{}, {value: Value, visible: boolean}> {
  // Set the initial state when the app is first constructed.
  constructor(props: {}) {
    super(props);
  
    this.state = {
      value: initialValue,
      visible: false
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = () => {
    this.setState({
      visible: false,
    });
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  onChange = ({value}) => {
    this.setState({value});
  }

  render() {
    return (
      <div className="editor container markdown-body">
        {
          !this.state.visible &&
          <EditorContainer
            value={this.state.value}
            onChange={this.onChange}
            plugins={plugins}
          />
        }

        <div>
          <Button type="primary" onClick={this.showModal}>Open in Modal</Button>
          <Modal
            title="Test toolbar in modal"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
              <EditorContainer
                value={this.state.value}
                onChange={({value}) => this.setState({value})}
                plugins={plugins}
              />
          </Modal>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <App/>
, (document: any).getElementById('root'));
