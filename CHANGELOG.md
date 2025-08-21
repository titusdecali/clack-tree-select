# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- **Keyboard Shortcuts**: Updated toggle shortcuts from `Ctrl+A`/`Ctrl+E` to `Shift+A`/`Shift+E` for better cross-platform compatibility (Windows compatibility fix).

### Fixed
- **Single Selection Mode**: Fixed directories being selectable in single selection mode. Directories now display with circle (○) indicators and cannot be selected, ensuring only leaf nodes (files) are selectable.
- **Dependency Updates**: Updated to `@clack/core@1.0.0-alpha.1` and `@clack/prompts@1.0.0-alpha.1` for improved compatibility and performance.
- **Cancellation Handling**: Removed custom cancel symbol handling to use Clack's built-in `isCancel` function, fixing symbol display issues.
- **Code Cleanup**: Removed debug code and test artifacts for cleaner codebase.

## [0.1.3] - 2025-08-02

### Fixed
- **Critical Fix**: Resolved hanging issue caused by mixing CommonJS `require()` with ES modules in cancel handler. Prompt now properly displays interactive tree interface and responds to user input.

## [0.1.1] - 2025-08-02

### Fixed
- **Demo Enhancement**: Replaced asciinema link with inline animated GIF for better GitHub README experience. Demo now plays directly in the README instead of redirecting to external site.

## [0.1.0] - 2025-08-02

### Added
- 🌳 **Initial Release** - Beautiful tree selection prompts for CLI applications
- ⌨️ **Smart Keyboard Shortcuts** - Intuitive navigation with toggle shortcuts
  - `Shift+E` - Toggle expand/collapse all directories
  - `Shift+A` - Toggle select/deselect all items  
  - Arrow keys for navigation, Space for selection
  - `Ctrl+C` - Cancel prompt (standard terminal behavior)
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