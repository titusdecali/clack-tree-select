import { treeSelect } from 'clack-tree-select';

console.log('🔍 Testing clack-tree-select package directly...');

const simpleTestTree = [
  {
    name: 'src',
    value: 'src',
    open: true,
    children: [
      {
        name: 'index.ts',
        value: 'src/index.ts',
        open: false
      },
      {
        name: 'utils.ts', 
        value: 'src/utils.ts',
        open: false
      }
    ]
  },
  {
    name: 'tests',
    value: 'tests', 
    open: true,
    children: [
      {
        name: 'test.spec.ts',
        value: 'tests/test.spec.ts',
        open: false
      }
    ]
  }
];

async function debugTest() {
  console.log('📋 Tree data:', JSON.stringify(simpleTestTree, null, 2));
  
  try {
    console.log('🚀 Calling treeSelect...');
    const result = await treeSelect({
      message: '🌲 Select items from this test tree',
      tree: simpleTestTree,
      multiple: true,
      required: false
    });
    
    console.log('✅ Result:', result);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugTest();