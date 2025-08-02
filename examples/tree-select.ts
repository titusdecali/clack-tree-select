import { treeSelect, fileSystemTreeSelect } from 'clack-tree-select';
import { intro, outro, isCancel } from '@clack/prompts';

/**
 * 🌳 Enhanced Tree Select Demo
 * 
 * This demo showcases the improved clack-tree-select with:
 * - ✨ Better TypeScript types and inference
 * - 🚀 Performance optimizations with caching
 * - ⌨️  Smart toggle shortcuts (Ctrl+E expand/collapse all, Ctrl+A select/deselect all)
 * - 🎨 Customizable icons and better defaults
 * - 📚 Comprehensive JSDoc documentation
 * - ✅ Improved validation with helpful messages
 */
async function main() {
	intro('🌳 Enhanced Tree Select Demo - DX Improvements');

	// Example 1: Simple tree with enhanced defaults
	console.log('\n📁 Example 1: Enhanced Simple Tree with keyboard shortcuts');
	
	const simpleTree = [
		{
			value: 'src',
			name: 'src',
			open: true, // Start expanded
			children: [
				{ value: 'src/components', name: 'components' },
				{ value: 'src/utils', name: 'utils' },
				{
					value: 'src/pages',
					name: 'pages',
					open: true,
					children: [
						{ value: 'src/pages/home.tsx', name: 'home.tsx' },
						{ value: 'src/pages/about.tsx', name: 'about.tsx' },
						{ value: 'src/pages/contact.tsx', name: 'contact.tsx' },
					],
				},
			],
		},
		{
			value: 'public',
			name: 'public',
			children: [
				{ value: 'public/images', name: 'images' },
				{ value: 'public/styles', name: 'styles' },
				{ value: 'public/fonts', name: 'fonts' },
			],
		},
		{ value: 'package.json', name: 'package.json' },
		{ value: 'README.md', name: 'README.md' },
		{ value: '.gitignore', name: '.gitignore' },
	];

	const selected = await treeSelect<string>({
		message: 'Select files and folders (try Ctrl+E to expand all, Ctrl+A to select all):',
		tree: simpleTree,
		// Enhanced defaults: multiple=true, required=false
		showHelp: true, // Shows keyboard shortcuts in validation message
	});

	if (isCancel(selected)) {
		outro('❌ Operation cancelled');
		return;
	}

	console.log('✅ Selected items:', selected);

	// Example 2: File system navigation
	console.log('\n📂 Example 2: File System Navigation');
	
	const fileSystemSelected = await fileSystemTreeSelect({
		message: 'Select files from your project:',
		root: '.',  // Current directory
		includeFiles: true,
		includeHidden: false,
		maxDepth: 3,
		multiple: true,
		required: false,
		filter: (path) => {
			// Filter out node_modules and other directories we don't want to show in the selection tree
			return !path.includes('node_modules') && 
			       !path.includes('.git') && 
			       !path.includes('dist') &&
			       !path.includes('.pnpm');
		},
	});

	if (isCancel(fileSystemSelected)) {
		outro('❌ File system operation cancelled');
		return;
	}

	console.log('Selected files:', fileSystemSelected);

	// Example 3: Single selection mode
	console.log('\n🎯 Example 3: Single Selection Mode');
	
	const singleSelected = await treeSelect({
		message: 'Choose one configuration file:',
		tree: [
			{
				value: 'config',
				name: 'config',
				children: [
					{ value: 'tsconfig.json', name: 'tsconfig.json' },
					{ value: 'package.json', name: 'package.json' },
					{ value: 'biome.json', name: 'biome.json' },
				],
			},
		],
		multiple: false,
		required: true,
	});

	if (isCancel(singleSelected)) {
		outro('❌ Configuration selection cancelled');
		return;
	}

	console.log('Selected configuration:', singleSelected);

	outro('✅ Tree Select Demo completed!');
}

main().catch(console.error);