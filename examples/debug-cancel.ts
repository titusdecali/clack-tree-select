import { treeSelect } from 'clack-tree-select';
import { intro, outro, isCancel } from '@clack/prompts';

async function debugCancel() {
	intro('🐛 Debug Cancel Handling');

	const result = await treeSelect({
		message: 'Test cancel (press Ctrl+C):',
		tree: [
			{ value: 'test.txt', name: 'test.txt' }
		],
		multiple: false,
		required: true,
	});

	console.log('📊 Raw result:', result);
	console.log('🔍 Type of result:', typeof result);
	console.log('🔍 Constructor:', result?.constructor?.name);
	console.log('🔍 Is array?:', Array.isArray(result));
	console.log('🔍 String representation:', String(result));
	console.log('🔍 isCancel result:', isCancel(result));
	
	// Let's also test what a real cancel symbol looks like
	const { cancel } = await import('@clack/prompts');
	const realCancelSymbol = cancel('test');
	console.log('🔍 Real cancel symbol:', realCancelSymbol);
	console.log('🔍 Real cancel isCancel:', isCancel(realCancelSymbol));
	console.log('🔍 Are they equal?:', result === realCancelSymbol);

	if (isCancel(result)) {
		outro('✅ Cancel detected correctly');
	} else {
		console.log('❌ Cancel was NOT detected by isCancel()');
		outro('Selected: ' + result);
	}
}

debugCancel().catch(console.error);