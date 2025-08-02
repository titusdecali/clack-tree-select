import { select, isCancel, intro, outro } from '@clack/prompts';

async function testCancel() {
	intro('🧪 Testing Cancel Behavior');

	const result = await select({
		message: 'Choose something (try pressing Ctrl+C):',
		options: [
			{ value: 'a', label: 'Option A' },
			{ value: 'b', label: 'Option B' },
		],
	});

	console.log('Raw result:', result);
	console.log('Is cancel?:', isCancel(result));

	if (isCancel(result)) {
		outro('❌ Standard select cancelled correctly');
		return;
	}

	console.log('✅ Selected:', result);
	outro('✅ Test complete');
}

testCancel().catch(console.error);