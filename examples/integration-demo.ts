import { treeSelect, fileSystemTreeSelect } from 'clack-tree-select';
import { 
  intro, 
  outro, 
  text, 
  select, 
  multiselect, 
  confirm, 
  isCancel, 
  cancel 
} from '@clack/prompts';

/**
 * 🔧 Integration Demo
 * 
 * Shows how to seamlessly integrate clack-tree-select 
 * with other Clack prompts in a real CLI workflow
 */
async function main() {
  intro('🚀 Project Setup Wizard');

  // Regular Clack text prompt
  const projectName = await text({
    message: 'What is your project name?',
    placeholder: 'my-awesome-project',
    validate: (value) => {
      if (!value) return 'Please enter a project name.';
    }
  });

  if (isCancel(projectName)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  // Regular Clack select prompt  
  const framework = await select({
    message: 'Choose a framework:',
    options: [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue' },
      { value: 'svelte', label: 'Svelte' },
    ]
  });

  if (isCancel(framework)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  // 🌳 OUR TREE SELECT - integrates seamlessly!
  const components = await treeSelect({
    message: `Select ${framework} components to generate:`,
    tree: [
      {
        value: 'ui',
        name: 'UI Components',
        children: [
          { value: 'ui/button', name: 'Button' },
          { value: 'ui/input', name: 'Input' },
          { value: 'ui/modal', name: 'Modal' },
          {
            value: 'ui/forms',
            name: 'Forms',
            children: [
              { value: 'ui/forms/text-field', name: 'TextField' },
              { value: 'ui/forms/checkbox', name: 'Checkbox' },
              { value: 'ui/forms/select', name: 'Select' }
            ]
          }
        ]
      },
      {
        value: 'layout',
        name: 'Layout Components', 
        children: [
          { value: 'layout/header', name: 'Header' },
          { value: 'layout/sidebar', name: 'Sidebar' },
          { value: 'layout/footer', name: 'Footer' }
        ]
      },
      {
        value: 'pages',
        name: 'Page Templates',
        children: [
          { value: 'pages/home', name: 'Home' },
          { value: 'pages/about', name: 'About' },
          { value: 'pages/contact', name: 'Contact' }
        ]
      }
    ],
    multiple: true,
    required: true
  });

  if (isCancel(components)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  // Another tree select for files
  const configFiles = await treeSelect({
    message: 'Select configuration files to include:',
    tree: [
      { value: 'tsconfig.json', name: 'TypeScript Config' },
      { value: 'package.json', name: 'Package.json' },
      { value: 'vite.config.js', name: 'Vite Config' },
      {
        value: 'configs',
        name: 'Additional Configs',
        children: [
          { value: 'configs/tailwind.config.js', name: 'Tailwind CSS' },
          { value: 'configs/biome.json', name: 'Biome' },
          { value: 'configs/.env.example', name: 'Environment' }
        ]
      }
    ],
    multiple: true,
    required: false
  });

  if (isCancel(configFiles)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  // Regular Clack multiselect
  const tools = await multiselect({
    message: 'Select development tools:',
    options: [
      { value: 'eslint', label: 'ESLint' },
      { value: 'prettier', label: 'Prettier' },
      { value: 'husky', label: 'Husky' },
      { value: 'jest', label: 'Jest' }
    ],
    required: false
  });

  if (isCancel(tools)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  // 🌳 File system tree select for source directory
  const sourceFiles = await fileSystemTreeSelect({
    message: 'Select existing files to copy:',
    root: process.cwd(),
    includeFiles: true,
    includeHidden: false,
    maxDepth: 2,
    filter: (path) => {
      return !path.includes('node_modules') && 
             !path.includes('.git') &&
             !path.includes('dist');
    }
  });

  if (isCancel(sourceFiles)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  // Regular Clack confirm
  const shouldInstallDeps = await confirm({
    message: 'Install dependencies automatically?',
    initialValue: true
  });

  if (isCancel(shouldInstallDeps)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  // Show results
  outro(`
✅ Project configured successfully!

📦 Project: ${projectName}
⚡ Framework: ${framework}
🌳 Components: ${components.length} selected
📄 Config files: ${configFiles.length} selected  
🔧 Tools: ${tools.length} selected
📁 Source files: ${sourceFiles.length} selected
${shouldInstallDeps ? '📥 Dependencies will be installed' : '⏭️  Skipping dependency installation'}
  `);
}

main().catch(console.error);