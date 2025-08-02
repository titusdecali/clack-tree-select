# Contributing to clack-tree-select

Thank you for your interest in contributing to clack-tree-select! 🌳

## Development Setup

### Prerequisites

- Node.js 18+ 
- pnpm (recommended package manager)

### Getting Started

1. **Fork & Clone**
   ```bash
   git clone https://github.com/yourusername/clack-tree-select.git
   cd clack-tree-select
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Build the Project**
   ```bash
   pnpm build
   ```

4. **Run Examples**
   ```bash
   cd clack/examples/basic
   npx tsx tree-select.ts
   ```

## Project Structure

```
clack-tree-select/
├── clack/                          # Main implementation
│   ├── packages/
│   │   ├── core/src/prompts/       # Core TreeSelectPrompt class
│   │   └── prompts/src/            # Styled tree-select wrapper
│   └── examples/basic/             # Demo and testing
├── README.md                       # Main documentation
├── CHANGELOG.md                    # Release notes
└── package.json                    # Standalone package config
```

## Development Workflow

### Making Changes

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Core logic: `clack/packages/core/src/prompts/tree-select.ts`
   - Styling: `clack/packages/prompts/src/tree-select.ts`
   - Examples: `clack/examples/basic/tree-select.ts`

3. **Test Your Changes**
   ```bash
   # Build and test
   cd clack
   pnpm build
   cd examples/basic
   npx tsx tree-select.ts
   ```

4. **Update Documentation**
   - Update README.md for new features
   - Add examples for new functionality
   - Update CHANGELOG.md

### Code Standards

- **TypeScript**: All code should be properly typed
- **ESM**: Use ES modules (import/export)
- **Formatting**: Run `pnpm format` before committing
- **Linting**: Run `pnpm lint` to check code quality

### Testing

Currently testing is done manually with the examples. For new features:

1. Add examples to `clack/examples/basic/tree-select.ts`
2. Test all keyboard shortcuts work correctly
3. Test edge cases (empty trees, single items, etc.)
4. Test both single and multiple selection modes

## Submitting Changes

### Pull Request Process

1. **Ensure Your Branch is Up to Date**
   ```bash
   git checkout main
   git pull origin main
   git checkout your-branch
   git rebase main
   ```

2. **Create a Pull Request**
   - Clear title describing the change
   - Description explaining the motivation
   - Screenshots/GIFs for UI changes
   - Reference any related issues

3. **PR Requirements**
   - [ ] Code builds successfully (`pnpm build`)
   - [ ] Examples work correctly
   - [ ] Documentation updated
   - [ ] CHANGELOG.md updated

### Commit Message Format

We use [Conventional Commits](https://conventionalcommits.org/):

```
type(scope): description

feat(shortcuts): add Ctrl+D to deselect all items
fix(rendering): prevent cursor overflow on large trees
docs(readme): add file system integration examples
```

**Types:**
- `feat`: New features
- `fix`: Bug fixes  
- `docs`: Documentation changes
- `style`: Code style/formatting
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding/updating tests

## Areas for Contribution

### 🔥 High Priority
- **Test Suite** - Automated testing with vitest
- **Search Functionality** - Filter tree items by name
- **Performance** - Optimize for very large trees (1000+ items)
- **Accessibility** - Screen reader support, better keyboard navigation

### 🌟 Feature Ideas
- **Custom Themes** - Color scheme customization
- **Tree Manipulation** - Add/remove/rename items dynamically
- **Async Loading** - Load children on demand
- **Icons** - Support for custom icon libraries
- **Sorting** - Sort tree items alphabetically or by type

### 🐛 Bug Reports
If you find a bug, please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior  
- Environment details (Node.js version, terminal, OS)

## Getting Help

- **Discord**: Join the [Clack Discord](https://discord.gg/clack) for real-time help
- **Issues**: Search existing issues or create a new one
- **Discussions**: Use GitHub Discussions for questions and ideas

## Recognition

Contributors will be:
- Added to the README.md contributors section
- Mentioned in release notes
- Eligible for contributor badges/swag (when available)

## Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/). Please be respectful and inclusive in all interactions.

---

Thank you for helping make clack-tree-select better! 🚀

**Questions?** Feel free to reach out in issues or discussions.

---

**Sponsored by [Stringer CLI](https://stringer-cli.com) - "Make your React & Vue apps multilingual in minutes!"**