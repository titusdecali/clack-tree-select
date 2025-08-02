import { intro, outro, isCancel } from '@clack/prompts';

async function testRealCancel() {
	intro('🔍 Testing Real Cancel Symbol');

	// Get the real cancel symbol the same way Clack does it
	const { cancel } = await import('@clack/core');
	const realCancel = cancel();
	
	console.log('Real cancel symbol:', realCancel);
	console.log('Type:', typeof realCancel);
	console.log('Constructor:', realCancel?.constructor?.name);
	console.log('String:', String(realCancel));
	console.log('isCancel works?:', isCancel(realCancel));
	
	outro('Done');
}

testRealCancel().catch(console.error);