//lmao
function convertToDom(data) {
  return new DOMParser().parseFromString(data, 'text/html');
}

//each line in CKEditor has <p> wrapper
//params: editorDom - editor data already converted to DOM object
//returns an Array of each line of text
function getTextFromDom(editorDom) {
  const paragraphs = editorDom.querySelectorAll('p');
  const input = []
  paragraphs.forEach(function (p) {
    input.push(p.innerHTML.replace(/&nbsp;/g, ''));
  });
  return input;
}

function convertText() {

  const values = getValues(); //get user input from all the tabs

  //format wiki code with user input
  const headerCode =
`{{Story Header
|Title=         
|Image=         
|Source=        
|TranslatorURL= 
|TranslatorName=
|Chapter=       
}}
`;
  const dialogueCode =
`{{NAME|
Dialogue=
}}
`;

  const imageCode =
`{{Story Image|
Image=VALUE
}}
`;

const locationCode =
`{{Location|
Location=VALUE
}}
`;

const chapterCode =
`{{Chapter Divider|
Chapter=VALUE
}}
`;

  const footerCode =
`{{Story Footer
|Prev=          
|Next=          
}}`

  let inputDom = formatStyling(convertToDom(editor1.getData()));
  let input = getTextFromDom(inputDom);
  let output = header;

  let currentName = ''; //needed for case where dialogue has name on every line
  input.forEach(function (line) {
    if (line != '') { //ignore empty lines
      if (isFileName(line)) {
        //console.log('isFileName: true...');
        //alert user if there is no header
        if (input.indexOf(line) === 0) { //if image file for the header 
          //console.log('headerfile');
          output = output.replace("HEADERFILE", line.trim());
        }
        else { //if CG or scene change image file
          //console.log('image file');
          let cgCode = cgRender;
          output += cgCode.replace("FILENAME", line.trim());
          currentName = ''; //since its new section
        }
      }
      else { //if dialogue line or header
        line = formatTlMarker(line);
        let firstWord = line.split(" ")[0];
        if (!firstWord.includes(":")) { //if no colon --> continuing dialogue line
          //console.log('no colon, continue dialogue');
          output += line + "\n\n";
        }
        else {
          //console.log('has colon...')
          firstWord = firstWord.slice(0, -1); //remove colon
          if (firstWord.toUpperCase() === 'HEADING') { //if heading
            //console.log('new HEADING');
            let headingCode = heading;
            output += headingCode.replace("HEADING", line.slice(line.indexOf(':') + 1).trim());
            currentName = ''; //since its new section
          }
          else if (namesLink[firstWord.toUpperCase()] != undefined) { //if valid character is speaking
            //console.log('character speaking... ' + firstWord);
            if (firstWord !== currentName) { //if new character is speaking
              //console.log('new character detected')
              //add dialogueRender code to output
              let renderCode = dialogueRender;
              let id = "#" + firstWord[0].toUpperCase() + firstWord.slice(1, firstWord.length); //create id to access chara's render file in Renders tab
              output += renderCode.replace("FILENAME", document.querySelector(id).value.trim());
              //update currentName
              currentName = firstWord;
            }
            line = line.slice(line.indexOf(":") + 1).trim(); //get chara's spoken line
            output += line + "\n\n";
          }
          else {
            //console.log('Formatter was unable to process this name: ' + firstWord);
          }
        }
      }
    }

  });

  output += formatTlNotes(editor2.getData());
  output += footer;
  document.querySelector('#output').value = output;
}

//helper function for convertText
function getValues() {
  const values = {}
  values.location = document.querySelector('#location').value.trim();
  const select = document.querySelector('#author');
  values.author = select.options[select.selectedIndex].text;
  values.translator = document.querySelector('#translator').value.trim();
  values.tlLink = document.querySelector('#tlLink').value.trim();
  if (values.tlLink === '') { //if TL credit is to a wiki user
    values.translator = `[User:${values.translator}|${values.translator}]`;
  }
  else { //if TL credit is to an external wiki user
    values.translator = `${values.tlLink} ${values.translator}`;
  }
  values.writerCol = '#' + document.querySelector('input[name=writerCol]').value;
  values.locationCol = '#' + document.querySelector("input[name=locationCol]").value;
  values.bottomCol = '#' + document.querySelector('input[name=bottomCol]').value;
  values.textCol = '#' + document.querySelector('input[name=textCol]').value;
  return values;
}

//helper function to check if the line is a file
//params: line - a String
//returns a boolean value representing if the string is a file name
function isFileName(line) {
  const extensions = ['.png', '.gif', '.jpg', '.jpeg', '.ico', '.pdf', '.svg'];
  for (let i = 0; i < extensions.length; i++) {
    if (line.toLowerCase().endsWith(extensions[i])) {
      return true;
    }
  }
  return false;
}

//helper function to format bold, italics, links based on HTML tags
//params: editorDom - editor data already converted to DOM object
//returns a DOM object with specified HTML tags converted to wiki code equivalent
function formatStyling(editorDom) {
  editorDom.querySelectorAll('strong').forEach(function (strong) {
    strong.replaceWith(`'''${strong.innerText}'''`);
  });
  editorDom.querySelectorAll('i').forEach(function (italic) {
    italic.replaceWith(`''${italic.innerText}''`);
  });
  editorDom.querySelectorAll('a').forEach(function (link) {
    link.replaceWith(`[${link.href} ${link.innerText}]`);
  });
  return editorDom;
}

//helper function to format tl note markers
function formatTlMarker(line) {
  if (line.search(/\[\d+\]/) != -1) { //if there is a tlMarker
    let title = getChapTitle(editor2.getData());
    if (title != undefined) {
      let tlCode = `<span id='${title}RefNUM'>[[#${title}NoteNUM|<sup>[NUM]</sup>]]</span>`;
      const markers = line.match(/\[\d+\]/g);
      markers.forEach(function (marker) {
        let num = marker.substring(marker.indexOf('[') + 1, marker.indexOf(']'));
        let newTlCode = tlCode.replace(/NUM/g, num);
        line = line.replace(marker, newTlCode)
      });
    }
  }
  return line;
}

//helper function to get and format chapter title from tl notes
//assumes the editor has some data
function getChapTitle(data) {
  if (data.includes('<ol>') && data.includes('<p>')) { //editor already has the <p> in it, so user must input some sort of new <p> (the chapter title) and an <ol> (the TL notes)
    //let inputDom = clearGDocSpan(convertToDom(data).querySelector('p'));
    let inputDom = (convertToDom(data).querySelector('p'));
    let title = inputDom.innerText;
    title = title.replace(' ', '');
    return title;
  }
  else {
    //ERROR: add alert to let user know they didn't provide a chapter title
    //console.log('Please make sure to include a title in the TL Notes section')
  }
}

//helper function to format TlNotes
//assumes that there is a valid title and correct number of TL notes
function formatTlNotes() {
  let title = getChapTitle(editor2.getData()); //ERROR: only do this if there are tl notes available
  if (title != undefined) {
    let inputDom = formatStyling(convertToDom(editor2.getData()));
    let notes = []
    const listItems = inputDom.querySelectorAll('li');
    listItems.forEach(function (li) {
      notes.push(li.innerHTML.replace(/&nbsp;/g, ''));
    });
    let output =
      `|-
| colspan="2"|`;
    let tlCode = `<span id='${title}NoteNUM'>NUM.[[#${title}RefNUM|↑]] TEXT</span><br />`;
    for (let i = 0; i < notes.length; i++) {
      let newTlCode = tlCode.replace(/NUM/g, i + 1);
      output += newTlCode.replace('TEXT', notes[i]);
    }
    output = output.replace(/<br \/>$/m, "\n");
    return output;
  }
  else return ''
}


export default convertText;