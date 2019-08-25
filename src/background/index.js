import createIconRenderer from './icon_renderer';

const renderIcon = createIconRenderer();

setInterval(renderIcon, 1000);
renderIcon();
