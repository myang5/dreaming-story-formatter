import React from 'react';
import image from './list.png';

export default function HowTo() {
  return (
    <div id='container'>
      <h2>TEXT GUIDELINES</h2>
      <h3>Text Tab</h3>
      <p>Copy and paste your translated chapter into the text box.</p>
      <ul>
        <li><strong>Names</strong> - Names follow the same rules as described in the <a href='https://dreaminglive.fandom.com/wiki/Story_Formatting_Guide#Story_Body'>Story Formatting Guide</a>. The formatter identifies which character is speaking and fills in the relevant template. This means narration lines should begin with 'Narration: ', and names that do not have their own templates will be formatted with the NPC template.</li>
        <li><strong>Images</strong> - You can include whole row-images such as games screenshots or CGs by inserting the EXACT file name (ex. Friends in Tokyo 2 - 5.png) into the dialogue on its own line. Including the file extension is necessary for the formatter to recognize that it's being given a file.</li>
        <li><strong>Headings for location changes/new chapters</strong> - You can indicate scene changes by including a line that starts with 'Location: ' or 'Chapter: ' in the dialogue. </li>
        <li><strong>Bold and italic text</strong> - Bold and italic text will be formatted, and should be preserved when pasted in from a Word/Google document.</li>
        <li><strong>Links</strong> - Links should also be preserved when pasted in. For now, internal wiki links are not supported so make sure every link is like an external one (i.e. with the https:// in front).</li>
      </ul>
      <p>Here's an example of a short dialogue:</p>
      <blockquote>
        <strong>Person A:</strong> This is a line said by Person A! Their line starts with their name followed by a colon.
      <br /><strong>Person B:</strong> This is a line said by another person!
      <br />Chapter: Chapter 2 (heading will say 'Chapter 2')
      <br />Location: Hallway (heading will say 'Hallway')
      <br />A screenshot of the game.jpeg
      <br /><strong>Person A:</strong> This is a third line from Person A.
    </blockquote>
      <p>When characters have multiple lines at once, the following dialogue formats are accepted:</p>
      <blockquote>
        <strong>Person A:</strong> Line by person A
      <br />Second line by person A (line doesn't begin with name)
      <br /><strong>Person B:</strong> Line by person B
      <br />
        <br /><strong>Person A:</strong> Line by person A
      <br /><strong>Person A:</strong> Second line by person A (line begins with name)
      <br /><strong>Person B:</strong> Line by person B
    </blockquote>

      <h3>Details Tab</h3>
      <p>Fill in information about the chapter and its appearance on the wiki. These are based on the fields in the Header and Footer templates in the <a href='https://dreaminglive.fandom.com/wiki/Story_Formatting_Guide'>Story Formatting Guide</a>, so reading the guide will help you understand what should go into each text field.</p>

      <h3 id='tlNotesSection'>TL Notes Tab</h3>
      <p>In the dialogue, you can mark the place the translation note refers to with a marker like this:</p>
      <blockquote>
        Senri: It says I’m Black Dorm![1] Yumapi, what about you?
    </blockquote>
      <p>You can have markers in the middle or end of the line, or even multiple markers in one line if needed.</p>
      <p>In the TL Notes tab, here's an example of how the notes should be formatted:</p>
      <blockquote>
        Chapter 1
      <ol>
          <li>Place translator notes in a numbered list like this.</li>
          <li>Make sure the numbers correspond to each marker!</li>
        </ol>
      </blockquote>
      <ul>
        <li><strong>The first line should be a chapter title</strong> that's UNIQUE within the story (needed for citations to work with the wiki's tab view)</li>
        <li><strong>The TL notes should be in an actual numbered list</strong> as opposed to paragraphs/lines with numbers in front. You can use the editor to format the list:</li>
        <img src={image} alt='Numbered list' />
      </ul>
    </div>
  )
}