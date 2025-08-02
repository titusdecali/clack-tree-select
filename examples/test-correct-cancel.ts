async function testCorrectCancel() {
	// Test the correct cancel mechanism
	const { cancel, isCancel } = await import('@clack/prompts');
	const { isCancel: coreIsCancel } = await import('@clack/core');
	
	console.log('--- Testing @clack/prompts cancel ---');
	const promptsCancel = cancel('Test cancellation');
	console.log('prompts cancel:', promptsCancel);
	console.log('Type:', typeof promptsCancel);
	console.log('String:', String(promptsCancel));
	console.log('prompts.isCancel detects it:', isCancel(promptsCancel));
	console.log('core.isCancel detects it:', coreIsCancel(promptsCancel));
	
	console.log('\n--- Comparing with our symbol ---');
	const ourSymbol = Symbol('clack:cancel');
	console.log('Our symbol:', ourSymbol);
	console.log('prompts.isCancel detects our symbol:', isCancel(ourSymbol));
	console.log('core.isCancel detects our symbol:', coreIsCancel(ourSymbol));
	
	console.log('\n--- Are they the same? ---');
	console.log('Equal:', promptsCancel === ourSymbol);
	console.log('Same string:', String(promptsCancel) === String(ourSymbol));
}

testCorrectCancel().catch(console.error);