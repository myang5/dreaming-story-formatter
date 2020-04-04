import React from 'react';

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

const inputTest = `<p>Senri: test</p><p>senri still speaking[1]</p><p>Location: Hallway</p><p>Chapter: Chapter 2</p><p>Senri: third line</p><p>NPC: test</p><p>NPC: still <i><strong>speaking</strong></i></p>`;
const inputDefault = `<p>If this is your first time using the formatter, please check the <a href='/howto'>Text Guidelines</a> to make sure your text is ready.</p>`;

const notesTest = `<p>Chapter 1</p><ol><li>note 1</li></ol>`;
const notesDefault = `<p>If this is your first time using the formatter, please check the <a href='/howto#tlNotesSection'>Text Guidelines</a> for how to add translation notes.</p>`;

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.convertText = convertText.bind(this);
    this.onDetailChange = this.onDetailChange.bind(this);
    this.state = {
      input: inputDefault,
      details: { //label, placeholder, value
        title: ['Title', '', ''],
        image: ['Header Image', '', ''],
        source: ['Source Story', '', ''],
        tlName: ['Translator', '', ''],
        tlCredit: ['Translator Credit', '', ''],
        chapter: ['Chapter', '', ''],
        prev: ['Previous Chapter Link', '(optional)', ''],
        next: ['Next Chapter Link', '(optional)', ''],
      },
      tlNotes: notesDefault,
      output: '',
    }
    this.inputEditor = (
      <CKEditor
        editor={BalloonEditor}
        config={inputEditorConfig}
        data={this.state.input}
        id='inputEditor'
        spellcheck='false'
        onChange={(event, editor) => {
          const data = editor.getData();
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
          this.setState({ tlNotes: data });
        }}
      />
    )
  };

  onDetailChange(name, value) {
    this.setState((state, props) => {
      const newDetails = state.details;
      newDetails[name][2] = value;
      return { details: newDetails };
    });
  }

  render() {
    return (
      <div className='main'>
        <Input inputEditor={this.inputEditor}
          details={this.state.details}
          onDetailChange={this.onDetailChange}
          tlNotesEditor={this.tlNotesEditor} />
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
        <DetailArea details={this.props.details} onDetailChange={this.props.onDetailChange} />
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
    const inputs = Object.keys(this.props.details).map((key) =>
      <DetailRow key={key}
        name={key}
        label={this.props.details[key][0]}
        placeholder={this.props.details[key][1]}
        value={this.props.details[key][2]}
        onDetailChange={this.props.onDetailChange}
      />
    );
    const content = (
      <>
        <div className='row'>
          <p>For more explanation on what each text field does, check the wiki's <a href='https://dreaminglive.fandom.com/wiki/Story_Formatting_Guide'>Story Formatting Guide</a>.</p>
        </div>
        {inputs}
      </>
    )
    return <TabContent id={'detailArea'} content={content} />
  }
}

function DetailRow(props) {
  return (
    <div className='row'>
      <label className='spacer'>{props.label}</label>
      <input type='text'
        placeholder={props.placeholder}
        value={props.value}
        onChange={(event) => props.onDetailChange(props.name, event.target.value)}
      />
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
  return <textarea spellCheck='false' id='output' defaultValue={props.value}></textarea>
}