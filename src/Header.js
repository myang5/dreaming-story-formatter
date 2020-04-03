import React from 'react';

function Header() {
  return (
    <header>
      <h1>
      <a href="index.html">DREAM!ing STORY FORMATTER</a>
      </h1>
      <div className="horizontal">
        <p>
          A website to more easily upload event/gacha stories from the mobile idol game Ensemble Stars to the fandom wiki.
          <br />It takes formats your story chapter into text that can be pasted directly into the "source"
        section of the page.
          <br />Developed by <a target="_blank" href="https://twitter.com/gayandasleep">midori</a>.
        </p>
        <ul id="navbar">
          <li><a href="./howto.html">HOW TO USE</a></li>
          <li><a href="./plans.html">DESIGN PLANS</a></li>
          <li><a target="_blank" href="https://goo.gl/forms/Xu42LLAgWKxVYV873">FEEDBACK</a></li>
        </ul>
      </div>
    </header>
  )
}

export default Header;