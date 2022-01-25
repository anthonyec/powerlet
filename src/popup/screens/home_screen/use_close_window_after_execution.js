import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectShouldCloseWindowAfterExecutingScript } from '../../store/selectors/bookmarklets';

// Hook to close the window only after a script has been executed.
// This is done by checking if the most recent script
// matches the `setExecutedScriptId`.
export default function useCloseWindowAfterExecution() {
  const [executedScriptId, setExecutedScriptId] = useState(null);
  const shouldCloseWindow = useSelector(
    selectShouldCloseWindowAfterExecutingScript(executedScriptId)
  );

  useEffect(() => {
    if (shouldCloseWindow) {
      // window.close();
    }
  }, [shouldCloseWindow]);

  return setExecutedScriptId;
}
