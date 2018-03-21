// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import {Editor} from 'slate-react';
import {Value, Change} from 'slate';
import renderNodesFn from '@canner/slate-icon-rendernodes';
import {AlignCenter, AlignLeft, AlignRight} from '@canner/slate-icon-align';
import Blockquote from '@canner/slate-icon-blockquote';
import Bold from '@canner/slate-icon-bold';
import Clean from '@canner/slate-icon-clean';
import Code from '@canner/slate-icon-code';
import {Header1, Header2} from '@canner/slate-icon-header';
import Italic from '@canner/slate-icon-italic';
import Link from '@canner/slate-icon-link';
import {OlList, UlList} from '@canner/slate-icon-list';
import StrikeThrough from '@canner/slate-icon-strikethrough';
import Underline from '@canner/slate-icon-underline';
import Undo from '@canner/slate-icon-undo';
import toolbar from '../src';

import {DEFAULT as DEFAULTLIST} from '@canner/slate-helper-block-list';
import {DEFAULT as DEFAULTBLOCKQUOTE} from '@canner/slate-helper-block-quote';
import EditList from 'slate-edit-list';
import EditBlockquote from 'slate-edit-blockquote';

import "./style.css";
import "github-markdown-css";

const {
  commonNode,
  commonMark,
  linkNode
} = renderNodesFn;

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
  toolbarMarks: [
    Undo,
    Bold,
    Italic,
    Underline,
    Code,
    StrikeThrough,
    Clean,
    "divider"
  ],
  toolbarBlocks: [
    Link,
    Header1,
    Header2,
    Blockquote,
    AlignCenter,
    AlignLeft,
    AlignRight,
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
  EditBlockquote(DEFAULTBLOCKQUOTE)
]

@toolbar(options)
class EditorContainer extends React.Component<Props> {

  // On change, update the app's React state with the new editor state.
  render() {
    return (
      <div className="editor">
        <Editor
          value={this.props.value}
          onChange={this.props.onChange}
          renderMark={renderMark}
          renderNode={renderNode}
          plugins={plugins}
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
        />
      </div>
    );
  }
}


function renderMark(props) {
  switch (props.mark.type) {
    case 'bold':
      return commonMark('strong')(props);
    case 'code':
      return commonMark('code')(props);
    case 'italic':
      return commonMark('i')(props);
    case 'strikethrough':
      return commonMark('s')(props);
    case 'underline':
      return commonMark('u')(props);
  }
}

function renderNode(props) {
  switch (props.node.type) {
    case 'paragraph':
      return commonNode('p')(props);
    case 'blockquote':
      return commonNode('blockquote')(props);
    case 'heading1':
      return commonNode('h1')(props);
    case 'heading2':
      return commonNode('h2')(props);
    case 'list-ul':
      return commonNode('ul')(props);
    case 'list-ol':
      return commonNode('ol')(props);
    case 'list-item':
      return commonNode('li')(props);
    case 'link':
      return linkNode()(props);
  }
}

ReactDOM.render(
  <App/>
, (document: any).getElementById('root'));
