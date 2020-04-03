import React from 'react';
import Header from './Header.js';

import CKEditor from '@ckeditor/ckeditor5-react';
import BalloonEditor from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor.js';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js';
import Link from '@ckeditor/ckeditor5-link/src/link.js';
import List from '@ckeditor/ckeditor5-list/src/list.js';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';

import convertText from './convertText.js'

const inputEditorConfig = {
  plugins: [Bold, Italic, Link, PasteFromOffice, Essentials, Paragraph],
  toolbar: ['bold', 'italic', 'link', '|', 'undo', 'redo']
};

const tlNotesEditorConfig = {
  plugins: [Bold, Italic, Link, List, PasteFromOffice, Essentials, Paragraph],
  toolbar: ['bold', 'italic', 'link', 'numberedList', '|', 'undo', 'redo']
};

function Index() {
  return (
    <>
      <Header />
      <Main />
    </>
  );
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.convertText = convertText.bind(this);
    this.state = {
      input: "<p>If this is your first time using the formatter, please check the <a href='./howto.html'>Text Guidelines</a> to make sure your text is ready.</p>",
      details: {},
      tlNotes: "<p>If this is your first time using the formatter, please check the <a href='./howto.html#tlNotesSection'>Text Guidelines</a> for how to add translation notes.</p>",
      output: '',
    }
    this.inputEditor = (
      <CKEditor
        editor={BalloonEditor}
        config={inputEditorConfig}
        data={this.state.input}
        id='inputEditor'
        spellcheck={false}
        onChange={(event, editor) => {
          const data = editor.getData();
          //console.log({ event, editor, data });
          this.setState({ input: data });
        }}
      />
    )
    this.tlNotesEditor = (
      <CKEditor
        editor={BalloonEditor}
        config={tlNotesEditorConfig}
        data={this.state.tlNotes}
        id='tlEditor'
        spellcheck={false}
        onChange={(event, editor) => {
          const data = editor.getData();
          //console.log({ event, editor, data });
          this.setState({ tlNotes: data });
        }}
      />
    )
  }

  // convertText() {
  //   //this.setState((state) => ({output: state.input}));
  //   convertText();
  // }

  render() {
    return (
      <div className='main'>
        <Input inputEditor={this.inputEditor} tlNotesEditor={this.tlNotesEditor} />
        <Buttons convert={this.convertText} />
        <Output value={this.state.output} />
      </div>
    )
  }
}

class Input extends React.Component {
  constructor(props) {
    super(props)
    this.openTab = this.openTab.bind(this);
    this.state = {
      tabLinks: {
        'Text': 'inputArea',
        'Details': 'detailArea',
        'TL Notes': 'tlArea',
      },
      clicked: ''
    }
  }

  openTab(tab) {
    const area = '#' + this.state.tabLinks[tab]
    // console.log(tab, area);
    const tabcontent = document.querySelectorAll('.tabcontent');
    for (let i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }
    document.querySelector(area).style.display = 'block';
    this.setState({ clicked: tab })
  }

  render() {
    return (
      <div id='input'>
        <TabMenu tabs={Object.keys(this.state.tabLinks)} clicked={this.state.clicked} openTab={this.openTab} />
        <InputArea inputEditor={this.props.inputEditor} />
        <DetailArea />
        <TlArea tlNotesEditor={this.props.tlNotesEditor} />
      </div>
    )
  }
}

class TabMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultOpen: 'Text',
    }
  }

  componentDidMount() {
    document.querySelector(`[value='${this.state.defaultOpen}']`).click();
  }

  render() {
    const tabs = this.props.tabs.map((btn) =>
      <Tab key={btn}
        value={btn}
        className={'tablink' + (this.props.clicked === btn ? ' active' : '')}
        text={btn}
        onClick={() => this.props.openTab(btn)}
      />
    )
    return <div className='tabMenu'>{tabs}</div>;
  }
}

function Tab(props) {
  return (
    <button className={props.className} value={props.value} onClick={props.onClick}>
      {props.text}
    </button>
  )
}

class TabContent extends React.Component {
  render() {
    return (
      <div id={this.props.id} className='tabcontent'>
        {this.props.content}
      </div>
    )
  }
}

class InputArea extends React.Component {
  render() {
    return <TabContent id={'inputArea'} content={this.props.inputEditor} />
  }
}

class DetailArea extends React.Component {
  render() {
    const content = (
      <>
        <div className='row'>
          <h3>Story Details</h3>
        </div>
        <DetailRow label='Title' />
        <DetailRow label='Header Image' />
        <DetailRow label='Source' />
        <DetailRow label='Translator' />
        <div className='row'>
          <span className='spacer'></span>
          <label className='spacer' htmlFor='tlLink'>Translator credit link</label>
        </div>
        <div className='row'>
          <span className='spacer'></span>
          <input type='text' id='tlLink' />
        </div>
      </>
    )
    return <TabContent id={'detailArea'} content={content} />
  }
}

function DetailRow(props) {
  const id = props.label[0].toUpperCase() + props.label.slice(1, props.label.length).replace(' ', '')
  return (
    <div className='row'>
      <label className='spacer'>{props.label}</label>
      <input type='text' id={id} />
    </div>
  )
}

class TlArea extends React.Component {
  render() {
    return <TabContent id={'tlArea'} content={this.props.tlNotesEditor} />
  }
}

class Buttons extends React.Component {
  constructor(props) {
    super(props)
    this.copyToClip = this.copyToClip.bind(this)
    this.state = {
      copied: false,
    }
  }

  copyToClip() {
    document.querySelector('#output').select();
    document.execCommand('copy');
    this.setState({ copied: true });
  }

  render() {
    return (
      <div id='btnArea'>
        <ActionButton onClick={this.props.convert} id='convertBtn' text='CONVERT' />
        <ActionButton onClick={this.copyToClip} id='copyBtn' text={this.state.copied ? 'Copied' : 'Copy Output'} />
      </div>
    )
  }
}

function ActionButton(props) {
  return (
    <button onClick={props.onClick} id={props.id}>{props.text}</button>
  )
}

function Output(props) {
  return <textarea id='output' defaultValue={props.value}></textarea>
}


export default Index;