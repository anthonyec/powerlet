javascript:
/* DEFINE_POWERLET_SCRIPT */

(function({ actions }) {
  const { pinTabResults } = await actions([
    ['pin_tab', tabId, 'pinTabResults']
  ]);

  const { tabs } = await actions([
    ['query_tabs', tabId, 'results']
  ]);

  console.log(tabs);
})(powerletApi);
