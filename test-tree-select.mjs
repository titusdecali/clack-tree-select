#!/usr/bin/env node
import { treeSelect } from 'clack-tree-select';

console.log('Testing clack-tree-select package...');

const simpleTree = [
  {
    name: 'folder1',
    value: 'folder1',
    open: true,
    children: [
      {
        name: 'file1.txt',
        value: 'folder1/file1.txt',
        open: false
      },
      {
        name: 'file2.txt', 
        value: 'folder1/file2.txt',
        open: false
      }
    ]
  },
  {
    name: 'folder2',
    value: 'folder2', 
    open: true,
    children: [
      {
        name: 'file3.txt',
        value: 'folder2/file3.txt',
        open: false
      }
    ]
  }
];

async function test() {
  console.log('Calling treeSelect with simple data...');
  
  try {
    const result = await treeSelect({
      message: 'Select items (this is a test)',
      tree: simpleTree,
      multiple: true,
      required: false
    });
    
    console.log('Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();