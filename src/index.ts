// Export only our tree-select functionality
export {
  treeSelect,
  fileSystemTreeSelect,
  buildFileSystemTree,
  type TreeSelectOptions,
  type FileSystemTreeOptions
} from './tree-select.js';

export {
  TreeSelectPrompt,
  type TreeItem,
  type TreeSelectOptions as CoreTreeSelectOptions
} from './core/tree-select.js';