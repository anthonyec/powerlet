import React, { useState, useLayoutEffect } from 'react';
import AceEditor from 'react-ace';

import Button from '../../components/button';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';

import './editor_screen.css';

export default function EditorScreen() {
  const [code, setCode] = useState('');
  const [reloadPage, setReloadPage] = useState(false);

  useLayoutEffect(() => {
    window.document.title = 'Script Editor';
  }, []);

  const handleCheckboxClick = () => {
    setReloadPage(!reloadPage);
  };

  const handleRunScriptClick = () => {
    console.log('handleRunScriptClick');

    chrome.tabs.query({}, function(tabs) {
      const filteredTab = tabs.filter((tab) => {
        return tab.active && tab.url;
      });

      console.log(filteredTab, code);

      if (filteredTab.length) {
        function onUpdate(tabId) {
          console.log('onUpdate');

          if (tabId === filteredTab[0].id) {
            chrome.tabs.executeScript(filteredTab[0].id, { code, runAt: 'document_end' });
          }

          chrome.tabs.onUpdated.removeListener(onUpdate);
        }

        if (reloadPage) {
          chrome.tabs.onUpdated.addListener(onUpdate);
          chrome.tabs.reload(filteredTab[0].id);
        } else {
          chrome.tabs.executeScript(filteredTab[0].id, { code, runAt: 'document_end' });
        }
      }
   });
  };

  return <div className="editor-screen">
    <label>Reload page before run</label>
    <input type="checkbox" onChange={handleCheckboxClick}/>

    <Button onClick={handleRunScriptClick}> Run Script</Button>
    <AceEditor
      mode="javascript"
      theme="github"
      name="UNIQUE_ID_OF_DIV"
      value={code}
      onChange={(value) => { setCode(value) }}
      editorProps={{ $blockScrolling: true }}
    />
  </div>;
}
