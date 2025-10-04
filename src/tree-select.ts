import { TreeSelectPrompt, type TreeItem } from './core/tree-select.js';
import color from 'picocolors';
import fs from 'node:fs';
import path from 'node:path';
import {
	type CommonOptions,
	S_BAR,
	S_BAR_END,
	S_CHECKBOX_ACTIVE,
	S_CHECKBOX_INACTIVE,
	S_CHECKBOX_SELECTED,
	symbol,
} from './common.js';
import { limitOptions } from './limit-options.js';

export interface TreeSelectOptions<Value> extends CommonOptions {
	message: string;
	tree: TreeItem<Value>[] | Value[];
	multiple?: boolean;
	initialValues?: Value[];
	required?: boolean;
	cursorAt?: Value;
	maxItems?: number;
	onlyShowDirectories?: boolean;
	/** Enable search functionality (default: true for better UX) */
	searchable?: boolean;
	/** Maximum tree depth to display (default: Infinity) */
	maxDepth?: number;
	/** Custom icons for different item types */
	icons?: {
		directory?: string;
		file?: string;
		expanded?: string;
		collapsed?: string;
	};
	/** Show help text with keyboard shortcuts */
	showHelp?: boolean;
}

export interface FileSystemTreeOptions extends Omit<TreeSelectOptions<string>, 'tree'> {
	root: string;
	includeFiles?: boolean;
	includeHidden?: boolean;
	maxDepth?: number;
	filter?: (path: string) => boolean;
}

/**
 * Build a tree structure from a file system path
 */
export function buildFileSystemTree(
	rootPath: string,
	options: {
		includeFiles?: boolean;
		includeHidden?: boolean;
		maxDepth?: number;
		filter?: (path: string) => boolean;
		currentDepth?: number;
	} = {}
): TreeItem<string>[] {
	const {
		includeFiles = true,
		includeHidden = false,
		maxDepth = Infinity,
		filter,
		currentDepth = 0,
	} = options;

	if (currentDepth >= maxDepth) {
		return [];
	}

	try {
		const entries = fs.readdirSync(rootPath, { withFileTypes: true });
		const tree: TreeItem<string>[] = [];

		for (const entry of entries) {
			// Skip hidden files/directories if not requested
			if (!includeHidden && entry.name.startsWith('.')) {
				continue;
			}

			const fullPath = path.join(rootPath, entry.name);

			// Apply custom filter if provided
			if (filter && !filter(fullPath)) {
				continue;
			}

			if (entry.isDirectory()) {
				const children = buildFileSystemTree(fullPath, {
					...options,
					currentDepth: currentDepth + 1,
				});

				tree.push({
					value: fullPath,
					name: entry.name,
					open: false,
					children,
				});
			} else if (includeFiles) {
				tree.push({
					value: fullPath,
					name: entry.name,
					open: false,
				});
			}
		}

		return tree.sort((a, b) => {
			// Directories first, then files
			const aIsDir = Boolean(a.children);
			const bIsDir = Boolean(b.children);
			if (aIsDir && !bIsDir) return -1;
			if (!aIsDir && bIsDir) return 1;
			return (a.name || '').localeCompare(b.name || '');
		});
	} catch (error) {
		console.warn(`Warning: Could not read directory ${rootPath}:`, error);
		return [];
	}
}

/**
 * Create a tree-select prompt for file system navigation
 */
export const fileSystemTreeSelect = (opts: FileSystemTreeOptions) => {
	const tree = buildFileSystemTree(opts.root, {
		includeFiles: opts.includeFiles,
		includeHidden: opts.includeHidden,
		maxDepth: opts.maxDepth,
		filter: opts.filter,
	});

	return treeSelect({
		...opts,
		tree,
	});
};

/**
 * Create a beautiful tree-select prompt with enhanced UX
 * @param opts Configuration options for the tree select
 * @returns Promise resolving to selected values
 */
export const treeSelect = <Value>(opts: TreeSelectOptions<Value>) => {
	// Enhanced defaults for better DX
	const defaultOptions = {
		multiple: true,
		required: false,
		searchable: true,
		maxDepth: Infinity,
		showHelp: true,
		icons: {
			directory: opts.icons?.directory || '📁',
			file: opts.icons?.file || '📄',  
			expanded: opts.icons?.expanded || '▼',
			collapsed: opts.icons?.collapsed || '▶'
		}
	};

	const config = { ...defaultOptions, ...opts };

	const renderTreeItem = (
		item: { value: Value; name: string; level: number; isDirectory: boolean; isOpen: boolean },
		state: 'inactive' | 'active' | 'selected' | 'active-selected' | 'submitted' | 'cancelled'
	) => {
		const indent = '  '.repeat(item.level);
		const icon = item.isDirectory ? config.icons.directory : config.icons.file;
		const dirIndicator = item.isDirectory 
			? item.isOpen 
				? `${config.icons.expanded} ` 
				: `${config.icons.collapsed} `
			: '';
		const name = item.name;

		// In single selection mode, directories are not selectable
		const isDirectoryInSingleMode = !config.multiple && item.isDirectory;
		
		if (state === 'active') {
			if (isDirectoryInSingleMode) {
				// Show directory as non-selectable when active in single mode
				return `${indent}${color.dim('○')} ${dirIndicator}${icon} ${color.cyan(name)}`;
			}
			return `${indent}${color.cyan(S_CHECKBOX_ACTIVE)} ${dirIndicator}${icon} ${color.cyan(name)}`;
		}
		if (state === 'selected') {
			return `${indent}${color.green(S_CHECKBOX_SELECTED)} ${dirIndicator}${icon} ${color.dim(name)}`;
		}
		if (state === 'cancelled') {
			return `${indent}${color.strikethrough(color.dim(`${dirIndicator}${icon} ${name}`))}`;
		}
		if (state === 'active-selected') {
			return `${indent}${color.green(S_CHECKBOX_SELECTED)} ${dirIndicator}${icon} ${color.cyan(name)}`;
		}
		if (state === 'submitted') {
			return `${indent}${color.dim(`${dirIndicator}${icon} ${name}`)}`;
		}
		
		if (isDirectoryInSingleMode) {
			// Show directories as non-selectable in single mode
			return `${indent}${color.dim('○')} ${color.dim(`${dirIndicator}${icon} ${name}`)}`;
		}
		
		return `${indent}${color.dim(S_CHECKBOX_INACTIVE)} ${color.dim(`${dirIndicator}${icon} ${name}`)}`;
	};

  const prompt = new TreeSelectPrompt({
    ...(config as any),
    tree: config.tree as any,
    validate(selected: any) {
			if (config.required && (selected === undefined || selected.length === 0)) {
				const helpText = config.showHelp ? `\n${color.reset(
					color.dim(
						`Shortcuts: ${color.gray(color.bgWhite(color.inverse(' space ')))} select, ` +
						`${color.gray(color.bgWhite(color.inverse(' → ')))} expand, ` +
						`${color.gray(color.bgWhite(color.inverse(' ← ')))} collapse, ` +
						`${color.gray(color.bgWhite(color.inverse(' shift+e ')))} toggle expand all, ` +
						`${color.gray(color.bgWhite(color.inverse(' shift+a ')))} toggle select all, ` +
						`${color.gray(color.bgWhite(color.inverse(' enter ')))} submit` +
						(config.searchable ? `, ${color.gray(color.bgWhite(color.inverse(' type ')))} search, ${color.gray(color.bgWhite(color.inverse(' esc ')))} clear` : '')
					)
				)}` : '';
				
				return `Please select at least one option.${helpText}`;
			}
		},
    render(this: any) {
      const title = `${color.gray(S_BAR)}\n${symbol(this.state)}  ${opts.message}\n`;
      const value: Value[] = this.value ?? [];

			// Get visible items (search-aware); apply fuzzy filter that ignores spaces
      const baseItems = this.getVisibleFlatTree ? this.getVisibleFlatTree() : (this.flatTree || []);
      const searchText: string = this.searchQuery ?? '';
			const normalized = searchText.replace(/\s+/g, '').toLowerCase();
			const isFuzzyMatch = (name: string, q: string): boolean => {
				if (!q) return true;
				const target = (name || '').replace(/\s+/g, '').toLowerCase();
				let ti = 0;
				for (let qi = 0; qi < q.length; qi++) {
					const qc = q[qi];
					ti = target.indexOf(qc, ti);
					if (ti === -1) return false;
					ti += 1;
				}
				return true;
			};
      const visibleItems = normalized ? baseItems.filter((it: any) => isFuzzyMatch(it.name, normalized)) : baseItems;
      const searching = this.isSearching ?? false;
      const searchQuery = this.searchQuery ?? '';
			
			const styleOption = (item: any, active: boolean) => {
				const selected = value.includes(item.value);
				if (active && selected) {
					return renderTreeItem(item, 'active-selected');
				}
				if (selected) {
					return renderTreeItem(item, 'selected');
				}
				return renderTreeItem(item, active ? 'active' : 'inactive');
			};

      const searchLine = config.searchable && (searching || searchQuery)
				? `${color.gray(S_BAR)}  ${color.dim('Search: ')}${searchQuery || ''}\n`
				: '';

      switch (this.state) {
				case 'submit': {
					const selectedItems = visibleItems
						.filter((item: any) => value.includes(item.value))
						.map((item: any) => renderTreeItem(item, 'submitted'))
						.join(color.dim(', '));
					
					return `${title}${searchLine}${color.gray(S_BAR)}  ${selectedItems || color.dim('none')}`;
				}
				case 'cancel': {
					const selectedItems = visibleItems
						.filter((item: any) => value.includes(item.value))
						.map((item: any) => renderTreeItem(item, 'cancelled'))
						.join(color.dim(', '));
					
					return `${title}${searchLine}${color.gray(S_BAR)}${
						selectedItems.trim() ? `  ${selectedItems}\n${color.gray(S_BAR)}` : ''
					}`;
				}
				case 'error': {
          const footer = String(this.error)
            .split('\n')
            .map((ln: string, i: number) =>
							i === 0 ? `${color.yellow(S_BAR_END)}  ${color.yellow(ln)}` : `   ${ln}`
						)
						.join('\n');
					
					return `${title}${searchLine}${color.yellow(S_BAR)}  ${limitOptions({
						output: opts.output,
						options: visibleItems,
						cursor: this.cursor,
						maxItems: opts.maxItems,
						style: styleOption,
					}).join(`\n${color.yellow(S_BAR)}  `)}\n${footer}\n`;
				}
				default: {
					return `${title}${searchLine}${color.cyan(S_BAR)}  ${limitOptions({
						output: opts.output,
						options: visibleItems,
						cursor: this.cursor,
						maxItems: opts.maxItems,
						style: styleOption,
					}).join(`\n${color.cyan(S_BAR)}  `)}\n${color.cyan(S_BAR_END)}\n`;
				}
			}
		},
	});

	// Handle cancellation properly by listening to events
	return new Promise<Value[] | symbol>((resolve) => {
		prompt.on('submit', (value) => {
			resolve(value);
		});
		
		prompt.on('cancel', (value) => {
			// The cancel event should pass the cancel symbol
			resolve(value);
		});
		
		prompt.prompt();
	});
};