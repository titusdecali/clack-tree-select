import { treeSelect } from 'clack-tree-select';
import { intro, outro, isCancel } from '@clack/prompts';

async function main() {
	intro('🔎 Searchable Tree Select Demo');

	const tree = [
		{
			value: 'src',
			name: 'src',
			open: true,
			children: [
				{ value: 'src/index.ts', name: 'index.ts' },
				{ value: 'src/utils.ts', name: 'utils.ts' },
				{ value: 'src/components', name: 'components', children: [
					{ value: 'src/components/Button.tsx', name: 'Button.tsx' },
					{ value: 'src/components/Card.tsx', name: 'Card.tsx' },
				] },
			],
		},
		{ value: 'README.md', name: 'README.md' },
		{ value: 'package.json', name: 'package.json' },
	];

	const result = await treeSelect<string>({
		message: 'Type to search files. Esc to clear. Space to toggle. Enter to submit.',
		tree,
		searchable: true,
		showHelp: true,
	});

	if (isCancel(result)) {
		outro('Cancelled');
		return;
	}

	console.log('Selected:', result);
	outro('Done');
}

main().catch(console.error);


