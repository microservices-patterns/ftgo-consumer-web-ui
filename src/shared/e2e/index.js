import { cssSel, defineTestIdDictionary, FOR_RENDER, FOR_RENDER_SVG, FOR_TEST_SVG, FOR_TESTS } from './helpers';

const defaultExport = Object.assign(defineTestIdDictionary, {
  FOR_RENDER,
  FOR_TESTS,
  FOR_TEST_SVG,
  FOR_RENDER_SVG,
  cssSel
});
export default defaultExport;
export { FOR_RENDER, FOR_TESTS, FOR_TEST_SVG, FOR_RENDER_SVG, defineTestIdDictionary, cssSel };
