import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Editor, Raw} from 'slate';
import toolbar from '../src';
import toolbarItems from '../src/items';

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

const options = {
  toolbarMarks: [
    toolbarItems.Bold,
    toolbarItems.Italic,
    toolbarItems.Underline,
    toolbarItems.Code,
    toolbarItems.StrikeThrough
  ],
  toolbarBlocks: [
    toolbarItems.Link,
    toolbarItems.Heading,
    toolbarItems.Blockquote,
    toolbarItems.OlList,
    toolbarItems.UlList
  ]
};

@toolbar(options)
class EditorContainer extends React.Component {
  static propTypes = {
    state: PropTypes.object,
    onChange: PropTypes.func
  };

  // On change, update the app's React state with the new editor state.
  render() {
    return (
      <div style={{margin: '50px'}}>
        <Editor
          state={this.props.state}
          onChange={this.props.onChange}
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
      <EditorContainer
        state={this.state.state}
        onChange={state => this.setState({state})}
      />
    );
  }
}

ReactDOM.render(
  <App/>
, document.getElementById('root'));
