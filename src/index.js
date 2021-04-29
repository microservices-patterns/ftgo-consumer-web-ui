import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import rootAppNode from './app/rootNode';


ReactDOM.render(rootAppNode,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
export { LessLargeTextDiv } from './ui/elements/textElements';
export { LargeTextDiv } from './ui/elements/textElements';
