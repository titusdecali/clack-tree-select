import { Prompt, type PromptOptions, isCancel } from '@clack/core';

/**
 * Represents a tree item with optional children and metadata
 * @template T The type of the value stored in each tree item
 */
export interface TreeItem<T = any> {
	/** The unique value/identifier for this tree item */
	value: T;
	/** Display name for the item (falls back to string representation of value) */
	name?: string;
	/** Whether this directory should be initially expanded */
	open?: boolean;
	/** Child items - can be TreeItems, strings, or raw values */
	children?: TreeItem<T>[] | string[] | T[];
}

/**
 * Options for configuring tree selection behavior
 */
export interface TreeSelectConfig {
	/** Allow multiple selections */
	multiple?: boolean;
	/** Require at least one selection */
	required?: boolean;
	/** Show help text with keyboard shortcuts */
	showHelp?: boolean;
	/** Enable inline search via typing letters */
	searchable?: boolean;
	/** Custom icons for different item types */
	icons?: {
		directory?: string;
		file?: string;
		expanded?: string;
		collapsed?: string;
	};
}

/**
 * Complete options for the TreeSelectPrompt
 * @template T The type of values in the tree
 */
export interface TreeSelectOptions<T = any>
	extends PromptOptions<T[], TreeSelectPrompt<T>>, TreeSelectConfig {
	/** The tree structure to display */
	tree: TreeItem<T>[] | string[] | T[];
	/** Initial selected values */
	initialValues?: T[];
	/** Value where cursor should start */
	cursorAt?: T;
	/** Custom validation function */
	validate?: (value: T[] | undefined) => string | void;
}

interface FlatTreeItem<T> {
	value: T;
	name: string;
	level: number;
	isDirectory: boolean;
	isOpen: boolean;
	parent?: FlatTreeItem<T>;
	originalItem: TreeItem<T>;
}

/**
 * Minimal TreeSelectPrompt for testing
 */
export class TreeSelectPrompt<T> extends Prompt<T[]> {
	tree: TreeItem<T>[];
	flatTree: FlatTreeItem<T>[] = [];
	cursor = 0;
	multiple: boolean;
	config: TreeSelectConfig;
	// Search state
	searchQuery = '';
	isSearching = false;

	constructor(opts: TreeSelectOptions<T>) {
		super(opts, false);
		this.tree = this.normalizeTree(opts.tree);
		this.multiple = opts.multiple ?? true;
		this.config = {
			multiple: opts.multiple ?? true,
			required: opts.required ?? false,
			showHelp: opts.showHelp ?? true,
			searchable: (opts as any).searchable ?? true,
			icons: {
				directory: '📁',
				file: '📄',
				expanded: '▼',
				collapsed: '▶',
				...opts.icons
			}
		};
		this.value = opts.initialValues || [];
		this.rebuildFlatTree();

		// Set up event listeners for keyboard input
		this.on('cursor', (key) => {
			this.handleCursor(key);
		});

		// Set up keyboard shortcuts and search handling
		this.on('key', (char, key) => {
			// Handle shifted shortcuts first and do not fall through
			if (key?.shift) {
				switch (key.name) {
					case 'e':
						this.toggleExpandAll();
						return;
					case 'a':
						this.toggleSelectAll();
						return;
				}
			}

			if (!this.config.searchable) return;

			// Backspace deletes last character while searching
			if (key?.name === 'backspace') {
				if (this.isSearching && this.searchQuery.length > 0) {
					this.searchQuery = this.searchQuery.slice(0, -1);
					if (this.searchQuery.length === 0) {
						this.isSearching = false;
					}
					this.cursor = 0;
				}
				return;
			}

			// Escape exits search mode
			if (key?.name === 'escape') {
				if (this.isSearching) {
					this.searchQuery = '';
					this.isSearching = false;
					this.cursor = 0;
				}
				return;
			}

			// Append printable characters to start/continue searching
			if (typeof char === 'string' && char.length === 1 && !key?.ctrl && !key?.meta && !key?.alt) {
				const code = char.charCodeAt(0);
				// Basic printable range including a-z/A-Z/0-9 and common filename chars
				if (code >= 32 && code <= 126) {
					this.isSearching = true;
					this.searchQuery += char;
					this.cursor = 0;
				}
			}
		});
	}

	private normalizeTree(tree: TreeItem<T>[] | string[] | T[]): TreeItem<T>[] {
		return tree.map(item => this.normalizeTreeItem(item));
	}

	private normalizeTreeItem(item: TreeItem<T> | string | T): TreeItem<T> {
		if (typeof item === 'string' || (typeof item === 'object' && !('value' in item))) {
			return {
				value: item as T,
				name: String(item),
				open: false,
			};
		}
		
		const treeItem = item as TreeItem<T>;
		return {
			...treeItem,
			name: treeItem.name || String(treeItem.value),
			open: treeItem.open || false,
			children: treeItem.children ? treeItem.children.map(child => this.normalizeTreeItem(child)) : undefined,
		};
	}

	private rebuildFlatTree() {
		this.flatTree = [];
		const flatten = (items: TreeItem<T>[], level = 0, parent?: FlatTreeItem<T>) => {
			for (const item of items) {
				const flatItem: FlatTreeItem<T> = {
					value: item.value,
					name: item.name || String(item.value),
					level,
					isDirectory: Boolean(item.children),
					isOpen: item.open || false,
					parent,
					originalItem: item,
				};
				
				this.flatTree.push(flatItem);
				
				if (item.children && item.open) {
					flatten(item.children as TreeItem<T>[], level + 1, flatItem);
				}
			}
		};
		flatten(this.tree);
	}

	/** Build a flattened list of the entire tree ignoring open/closed state */
	private buildFullFlatTree(): FlatTreeItem<T>[] {
		const result: FlatTreeItem<T>[] = [];
		const flattenAll = (items: TreeItem<T>[], level = 0, parent?: FlatTreeItem<T>) => {
			for (const item of items) {
				const flatItem: FlatTreeItem<T> = {
					value: item.value,
					name: item.name || String(item.value),
					level,
					isDirectory: Boolean(item.children),
					isOpen: item.open || false,
					parent,
					originalItem: item,
				};
				result.push(flatItem);
				if (item.children) {
					flattenAll(item.children as TreeItem<T>[], level + 1, flatItem);
				}
			}
		};
		flattenAll(this.tree);
		return result;
	}

	/** Return the list of items currently visible (search-filtered or by open state) */
	public getVisibleFlatTree(): FlatTreeItem<T>[] {
		if (!this.isSearching || !this.searchQuery) return this.flatTree;
		const q = this.searchQuery.toLowerCase();
		return this.buildFullFlatTree().filter((it) => it.name.toLowerCase().includes(q));
	}

	private toggleDirectory(targetValue: T) {
		// Find the item in the tree recursively
		const findAndToggle = (items: TreeItem<T>[]): boolean => {
			for (const item of items) {
				if (item.value === targetValue && item.children) {
					item.open = !item.open;
					return true;
				}
				if (item.children && findAndToggle(item.children as TreeItem<T>[])) {
					return true;
				}
			}
			return false;
		};
		
		if (findAndToggle(this.tree)) {
			this.rebuildFlatTree();
		}
	}

	private toggleSelection(targetValue: T) {
		if (!this.value) this.value = [];
		const index = this.value.indexOf(targetValue);
		const isCurrentlySelected = index !== -1;
		
		// Find the target item in the tree
		const findItem = (items: TreeItem<T>[]): TreeItem<T> | null => {
			for (const item of items) {
				if (item.value === targetValue) return item;
				if (item.children) {
					const found = findItem(item.children as TreeItem<T>[]);
					if (found) return found;
				}
			}
			return null;
		};
		
		const targetItem = findItem(this.tree);
		
		// In single selection mode, prevent selection of directories
		if (!this.multiple && targetItem?.children) {
			return;
		}
		
		if (isCurrentlySelected) {
			// Deselect this item and all its children
			this.value = this.value.filter(v => v !== targetValue);
			if (targetItem?.children) {
				this.deselectChildren(targetItem.children as TreeItem<T>[]);
			}
		} else {
			// Select this item and all its children
			if (this.multiple) {
				this.value = [...this.value, targetValue];
				if (targetItem?.children) {
					this.selectChildren(targetItem.children as TreeItem<T>[]);
				}
			} else {
				this.value = [targetValue];
			}
		}
	}

	private selectChildren(children: TreeItem<T>[]) {
		for (const child of children) {
			if (!this.value.includes(child.value)) {
				this.value.push(child.value);
			}
			if (child.children) {
				this.selectChildren(child.children as TreeItem<T>[]);
			}
		}
	}

	private deselectChildren(children: TreeItem<T>[]) {
		for (const child of children) {
			this.value = this.value.filter(v => v !== child.value);
			if (child.children) {
				this.deselectChildren(child.children as TreeItem<T>[]);
			}
		}
	}

	private expandAll() {
		const expandRecursive = (items: TreeItem<T>[]) => {
			for (const item of items) {
				if (item.children) {
					item.open = true;
					expandRecursive(item.children as TreeItem<T>[]);
				}
			}
		};
		expandRecursive(this.tree);
		this.rebuildFlatTree();
	}

	private collapseAll() {
		const collapseRecursive = (items: TreeItem<T>[]) => {
			for (const item of items) {
				if (item.children) {
					item.open = false;
					collapseRecursive(item.children as TreeItem<T>[]);
				}
			}
		};
		collapseRecursive(this.tree);
		this.rebuildFlatTree();
	}

	private selectAll() {
		if (!this.multiple) return;
		
		const getAllValues = (items: TreeItem<T>[]): T[] => {
			const values: T[] = [];
			for (const item of items) {
				values.push(item.value);
				if (item.children) {
					values.push(...getAllValues(item.children as TreeItem<T>[]));
				}
			}
			return values;
		};
		
		this.value = getAllValues(this.tree);
	}

	private deselectAll() {
		this.value = [];
	}

	private areAllDirectoriesExpanded(): boolean {
		const checkExpanded = (items: TreeItem<T>[]): boolean => {
			for (const item of items) {
				if (item.children) {
					if (!item.open) return false;
					if (!checkExpanded(item.children as TreeItem<T>[])) return false;
				}
			}
			return true;
		};
		return checkExpanded(this.tree);
	}

	private areAllItemsSelected(): boolean {
		if (!this.multiple) return false;
		
		const getAllValues = (items: TreeItem<T>[]): T[] => {
			const values: T[] = [];
			for (const item of items) {
				values.push(item.value);
				if (item.children) {
					values.push(...getAllValues(item.children as TreeItem<T>[]));
				}
			}
			return values;
		};
		
		const allValues = getAllValues(this.tree);
		return allValues.length === this.value.length && 
			   allValues.every(val => this.value.includes(val));
	}

	private toggleExpandAll() {
		if (this.areAllDirectoriesExpanded()) {
			this.collapseAll();
		} else {
			this.expandAll();
		}
	}

	private toggleSelectAll() {
		if (!this.multiple) return;
		
		if (this.areAllItemsSelected()) {
			this.deselectAll();
		} else {
			this.selectAll();
		}
	}

	private handleCursor(key: string): void {
		if (this.state !== 'active') return;

		const visible = this.getVisibleFlatTree();
		const currentItem = visible[this.cursor];
		
		switch (key) {
			case 'up':
				this.cursor = Math.max(0, this.cursor - 1);
				break;
			case 'down':
				this.cursor = Math.min(Math.max(visible.length - 1, 0), this.cursor + 1);
				break;
			case 'right':
				if (currentItem?.isDirectory && !currentItem.isOpen) {
					this.toggleDirectory(currentItem.value);
				}
				break;
			case 'left':
				if (currentItem?.isDirectory && currentItem.isOpen) {
					this.toggleDirectory(currentItem.value);
				}
				break;
			case 'space':
				if (currentItem) {
					// In single selection mode, only allow selecting leaf nodes (non-directories)
					if (!this.multiple && currentItem.isDirectory) {
						// Don't allow selecting directories in single selection mode
						return;
					}
					this.toggleSelection(currentItem.value);
				}
				break;
		}
	}

	public getState() {
		return {
			value: this.value,
			cursor: this.cursor,
			state: this.state,
			flatTree: this.flatTree,
			searchQuery: this.searchQuery,
			isSearching: this.isSearching,
		};
	}

	/**
	 * Start the prompt and return a Promise that resolves with the selected values or cancel symbol
	 */

}

export default TreeSelectPrompt;