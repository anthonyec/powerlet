import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectShouldCloseWindowAfterExecutingScript } from "../../store/selectors/bookmarklets";

export default function useCloseWindowAfterExecution() {
  const [executedScriptId, setExecutedScriptId] = useState(null);
  const shouldCloseWindow = useSelector(selectShouldCloseWindowAfterExecutingScript(executedScriptId));

  useEffect(() => {
    if (shouldCloseWindow) {
      window.close();
    }
  }, [shouldCloseWindow]);

  return setExecutedScriptId;
}
