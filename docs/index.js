// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import {Editor} from 'slate-react';
import {Value, Change} from 'slate';
import {AlignCenter, AlignLeft, AlignRight} from '@canner/slate-icon-align';
// import Blockquote from '@canner/slate-icon-blockquote';
import Bold, {BoldPlugin} from '@canner/slate-icon-bold';
import Clean from '@canner/slate-icon-clean';
import Code, {CodePlugin} from '@canner/slate-icon-code';
// import {Header1, Header2} from '@canner/slate-icon-header';
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
    UlList
  ]
};

type Props = {
  value: Value,
  onChange: (change: Change) => void
}

const plugins = [
  EditList(DEFAULTLIST),
  EditBlockquote(DEFAULTBLOCKQUOTE),
  BoldPlugin(),
  CodePlugin(),
  ItalicPlugin(),
  StrikeThroughPlugin(),
  ListPlugin(),
  UnderlinePlugin(),
  ParagraphPlugin()
]

@toolbar(options)
class EditorContainer extends React.Component<Props> {

  // On change, update the app's React state with the new editor state.
  render() {
    return (
      <div className="editor">
        <Editor
          {...this.props}
        />
      </div>
    );
  }
}

class App extends React.Component<{}, {value: Value}> {
  // Set the initial state when the app is first constructed.
  state = {
    value: initialValue
  }

  render() {
    return (
      <div className="container markdown-body">
        <EditorContainer
          value={this.state.value}
          onChange={({value}) => this.setState({value})}
          plugins={plugins}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <App/>
, (document: any).getElementById('root'));
