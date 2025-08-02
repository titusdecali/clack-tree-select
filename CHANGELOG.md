# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2024-12-XX

### Added
- 🌳 **Initial Release** - Beautiful tree selection prompts for CLI applications
- ⌨️ **Smart Keyboard Shortcuts** - Intuitive navigation with toggle shortcuts
  - `Ctrl+E` - Toggle expand/collapse all directories
  - `Ctrl+A` - Toggle select/deselect all items  
  - `Ctrl+C` - Collapse all directories
  - Arrow keys for navigation, Space for selection
- 🎯 **Hierarchical Selection** - Selecting parent directories automatically selects all children
- 🎨 **Customizable Icons** - Personalize directory, file, expand/collapse icons
- 📁 **File System Integration** - `fileSystemTreeSelect` for browsing local directories
- 🚀 **Performance Optimized** - Efficient rendering for large directory trees
- 📱 **TypeScript Ready** - Full type safety with excellent IntelliSense
- ✅ **Validation Support** - Custom validation with helpful error messages
- 🎨 **Beautiful Styling** - Consistent with Clack's design system
- 📚 **Comprehensive Documentation** - API reference, examples, and guides

### Features
- Multiple selection mode (default) and single selection mode
- Customizable validation with error messages
- Help text with keyboard shortcuts
- Maximum items display with scrolling
- Filter support for file system browsing
- Hidden file inclusion/exclusion options
- Maximum depth control for large trees
- Initial value pre-selection

### Technical
- Built on top of `@clack/core` for extensibility
- ESM module support
- Minimal bundle size optimized for CLI tools
- Compatible with Node.js 18+ 
- Works within ESBuild class size constraints

---

**Sponsored by [Stringer CLI](https://stringer-cli.com) - "Make your React & Vue apps multilingual in minutes!"**