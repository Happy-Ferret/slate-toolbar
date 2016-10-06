# slate-toolbar [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> slate toolbar for plugins.

## Installation

```sh
$ npm install --save slate-toolbar
```

## Usage

```js
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Editor, Raw} from 'slate';
import {toolbar, items} from 'slate-toolbar';

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
    items.Bold,
    items.Italic,
    items.Underline,
    items.Code,
    items.StrikeThrough
  ],
  toolbarBlocks: [
    items.Link,
    items.Heading,
    items.Blockquote,
    items.OlList,
    items.UlList
  ]
};

@toolbar(options) // embed a toolbar in editor!
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

```

## Start example server

```
node devServer.js
```

## License

MIT © [chilijung]()


[npm-image]: https://badge.fury.io/js/slate-toolbar.svg
[npm-url]: https://npmjs.org/package/slate-toolbar
[travis-image]: https://travis-ci.org/Canner/slate-toolbar.svg?branch=master
[travis-url]: https://travis-ci.org/Canner/slate-toolbar
[daviddm-image]: https://david-dm.org/Canner/slate-toolbar.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/Canner/slate-toolbar
