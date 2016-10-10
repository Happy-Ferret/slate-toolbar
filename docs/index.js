/* eslint-disable new-cap */
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Editor, Raw} from 'slate';
import toolbar from '../src';
import Icons from 'slate-editor-icons';
import EditList from 'slate-edit-list';
import EditBlockquote from 'slate-edit-blockquote';

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
    Icons.marks.Bold,
    Icons.marks.Italic,
    Icons.marks.Underline,
    Icons.marks.Code,
    Icons.marks.StrikeThrough,
    "devider"
  ],
  toolbarBlocks: [
    Icons.inlines.Link,
    Icons.blocks.Heading,
    Icons.blocks.Blockquote,
    Icons.blocks.OlList,
    Icons.blocks.UlList
  ]
};

/* eslint-disable react/prop-types, react/display-name */
const schema = {
  nodes: {
    'blockquote': ({children}) => <blockquote>{children}</blockquote>,
    'list-ul': ({children}) => <ul>{children}</ul>,
    'list-ol': ({children, attributes}) => <ol {...attributes}>{children}</ol>,
    'list-item': ({children}) => <li>{children}</li>,
    'heading1': ({children}) => <h1>{children}</h1>,
    'heading2': ({children}) => <h2>{children}</h2>,
    'heading3': ({children}) => <h3>{children}</h3>,
    'heading4': ({children}) => <h4>{children}</h4>,
    'heading5': ({children}) => <h5>{children}</h5>,
    'heading6': ({children}) => <h6>{children}</h6>,
    'paragraph': ({children}) => <p>{children}</p>,
    'link': props => {
      return (
        <a {...props.attributes} href={props.node.data.get('url')}>
          {props.children}
        </a>
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
