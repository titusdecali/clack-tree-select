import { describe, it, expect } from 'vitest';
import { TreeSelectPrompt, type TreeItem } from '../src/core/tree-select.ts';

describe('TreeSelectPrompt search', () => {
	it('returns flatTree when not searching', () => {
		const tree: TreeItem<string>[] = [
			{ value: 'README.md', name: 'README.md' },
			{
				value: 'src',
				name: 'src',
				open: false,
				children: [
					{ value: 'src/index.ts', name: 'index.ts' },
				],
			},
		];

		const prompt = new TreeSelectPrompt({ tree });
		const visible = prompt.getVisibleFlatTree();
		expect(visible).toEqual(prompt.flatTree);
	});

	it('filters across full hierarchy when searching', () => {
		const tree: TreeItem<string>[] = [
			{ value: 'README.md', name: 'README.md' },
			{
				value: 'src',
				name: 'src',
				open: false,
				children: [
					{ value: 'src/index.ts', name: 'index.ts' },
					{ value: 'src/util.ts', name: 'util.ts' },
				],
			},
		];

		const prompt = new TreeSelectPrompt({ tree });
		(prompt as any).isSearching = true;
		(prompt as any).searchQuery = 'index';
		const visible = prompt.getVisibleFlatTree();
		const names = visible.map((v) => v.name);
		expect(names).toContain('index.ts');
		expect(names).not.toContain('README.md');
		expect(names).not.toContain('util.ts');
	});
});


