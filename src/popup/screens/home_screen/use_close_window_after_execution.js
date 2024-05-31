import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as identifiers from '../../../identifiers';
import { isMessage } from '../../../utils/is_message';
import { selectShouldCloseWindowAfterExecutingScript } from '../../store/selectors/bookmarklets';

function useRuntimeMessage(callback = (message) => {}, dependencies = []) {
  useEffect(() => {
    const handleMessage = (message) => {
      if (!isMessage(message)) return;
      callback(message);
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, dependencies);
}

// Hook to close the window only after a script has been executed. This is done
// by checking if the most recent script matches the `setExecutedScriptId` and
// has received a message from the main content script saying it's started
// executing the script.
export default function useCloseWindowAfterExecution() {
  const [executedScriptId, setExecutedScriptId] = useState(null);
  const shouldCloseWindow = useSelector(
    selectShouldCloseWindowAfterExecutingScript(executedScriptId)
  );

  useRuntimeMessage(
    (message) => {
      if (
        message.type === identifiers.startExecuteBookmarkletEvent &&
        message.bookmarkId === executedScriptId
      ) {
        if (shouldCloseWindow) {
          window.close();
        }
      }
    },
    [executedScriptId, shouldCloseWindow]
  );

  return setExecutedScriptId;
}
