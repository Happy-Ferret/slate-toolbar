/* eslint-disable new-cap */
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Editor, Raw} from 'slate';
import toolbar from '../src';
import Icons from 'slate-editor-icons';
import EditList from 'slate-edit-list';
import EditBlockquote from 'slate-edit-blockquote';

import "./style.css";
import "./github-markdown.css";

const {
  commonNode,
  commonMark,
  videoNode,
  imageNode,
  emojiNode,
  linkNode
} = Icons.helpers;

const initialState = Raw.deserialize({
  nodes: [
    {
      kind: 'block',
      type: 'paragraph',
      nodes: [
        {
          kind: 'text',
          text: 'A line of text in a paragraph.'
        }
      ]
    }
  ]
}, {terse: true});

const LIST_DEFAULT = {
  typeUL: 'list-ul',
  typeOL: 'list-ol',
  typeItem: 'list-item',
  typeDefault: 'paragraph',
  ordered: true
};

const BLOCKQUOTE_DEFAULT = {
  type: 'blockquote',
  typeDefault: 'paragraph'
};

const options = {
  toolbarMarks: [
    Icons.history.Undo,
    Icons.marks.Bold,
    Icons.marks.Italic,
    Icons.marks.Underline,
    Icons.marks.Code,
    Icons.marks.StrikeThrough,
    Icons.marks.Clean,
    Icons.marks.FontColor,
    Icons.marks.FontBgColor,
    "devider"
  ],
  toolbarBlocks: [
    Icons.inlines.Link,
    Icons.inlines.Emoji,
    Icons.blocks.Header1,
    Icons.blocks.Header2,
    Icons.blocks.Blockquote,
    Icons.blocks.AlignCenter,
    Icons.blocks.AlignLeft,
    Icons.blocks.AlignRight,
    Icons.blocks.OlList,
    Icons.blocks.UlList
  ]
};

/* eslint-disable react/prop-types, react/display-name */
const schema = {
  nodes: {
    'blockquote': commonNode('blockquote'),
    'list-ul': commonNode('ul'),
    'list-ol': commonNode('ol'),
    'list-item': commonNode('li'),
    'heading1': commonNode('h1'),
    'heading2': commonNode('h2'),
    'heading3': commonNode('h3'),
    'heading4': commonNode('h4'),
    'heading5': commonNode('h5'),
    'heading6': commonNode('h6'),
    'paragraph': commonNode('p'),
    'youtube': videoNode('youtube'),
    'dailymotion': videoNode('dailymotion'),
    'vimeo': videoNode('vimeo'),
    'youku': videoNode('youku'),
    'image': imageNode(),
    'link': linkNode(),
    'emoji': emojiNode()
  },
  marks: {
    bold: commonMark('strong'),
    code: commonMark('code'),
    italic: commonMark('em'),
    underline: commonMark('u'),
    fontColor: commonMark('span', 'fontColor'),
    fontBgColor: commonMark('span', 'fontBgColor'),
    strikethrough: commonMark('s')
  }
};

/* eslint-enable */
@toolbar(options)
class EditorContainer extends React.Component {
  static propTypes = {
    state: PropTypes.object,
    onChange: PropTypes.func
  };

  // On change, update the app's React state with the new editor state.
  render() {
    return (
      <div className="editor">
        <Editor
          state={this.props.state}
          onChange={this.props.onChange}
          schema={schema}
          plugins={[
            EditList(LIST_DEFAULT),
            EditBlockquote(BLOCKQUOTE_DEFAULT)
          ]}
        />
      </div>
    );
  }
}

class App extends React.Component {
  // Set the initial state when the app is first constructed.
  state = {
    state: initialState
  }

  render() {
    return (
      <div className="container markdown-body">
        <EditorContainer
          state={this.state.state}
          onChange={state => this.setState({state})}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <App/>
, document.getElementById('root'));
