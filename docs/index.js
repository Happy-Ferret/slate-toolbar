/* eslint-disable new-cap */
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Editor, Raw} from 'slate';
import toolbar from '../src';
import Icons from 'slate-editor-icons';
import EditList from 'slate-edit-list';
import EditBlockquote from 'slate-edit-blockquote';
import {Emoji} from 'emoji-mart';

import "./style.css";

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

const makeTagNode = Tag => {
  const NodeComponent = ({attributes, children, node}) => {
    const align = node.data.get('align');
    return (
      <Tag {...attributes} style={{textAlign: align}}>{children}</Tag>
    );
  };

  NodeComponent.displayName = `${Tag}-node`;

  NodeComponent.propTypes = {
    attributes: PropTypes.object,
    children: PropTypes.any,
    node: PropTypes.any
  };

  return NodeComponent;
};

/* eslint-disable react/prop-types, react/display-name */
const schema = {
  nodes: {
    'blockquote': makeTagNode('blockquote'),
    'list-ul': makeTagNode('ul'),
    'list-ol': makeTagNode('ol'),
    'list-item': makeTagNode('li'),
    'heading1': makeTagNode('h1'),
    'heading2': makeTagNode('h2'),
    'heading3': makeTagNode('h3'),
    'heading4': makeTagNode('h4'),
    'heading5': makeTagNode('h5'),
    'heading6': makeTagNode('h6'),
    'paragraph': makeTagNode('p'),
    'link': props => {
      return (
        <a {...props.attributes} href={props.node.data.get('url')}>
          {props.children}
        </a>
      );
    },
    'emoji': props => {
      return (
        <Emoji emoji={props.node.data.get('code').colons} size={18}/>
      );
    },
    // 'table': props => <table><tbody {...props.attributes}>{props.children}</tbody></table>,
    'table_row': props => <tr {...props.attributes}>{props.children}</tr>,
    'table_cell': props => <td {...props.attributes}>{props.children}</td>
  },
  marks: {
    bold: ({children}) => <strong>{children}</strong>,
    code: ({children}) => <code>{children}</code>,
    italic: ({children}) => <em>{children}</em>,
    underline: ({children}) => <u>{children}</u>,
    fontColor: ({children, mark}) => {
      const color = mark.get('data').get('rgba');
      return (
        <span style={{color}}>
          {children}
        </span>
      );
    },
    fontBgColor: ({children, mark}) => {
      const color = mark.get('data').get('rgba');
      return (
        <span style={{backgroundColor: color}}>
          {children}
        </span>
      );
    },
    strikethrough: ({children}) => <s>{children}</s>
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
      <div className="container">
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
