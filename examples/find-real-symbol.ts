async function findRealSymbol() {
	// Let's try to trigger a real cancellation in a standard prompt to see what it returns
	const { select, isCancel } = await import('@clack/prompts');
	
	console.log('Testing with a real Clack prompt...');
	
	// Set up a timeout to auto-cancel after 1 second
	setTimeout(() => {
		// Simulate Ctrl+C
		process.emit('SIGINT');
	}, 100);
	
	try {
		const result = await select({
			message: 'Quick test (will auto-cancel):',
			options: [
				{ value: 'test', label: 'Test' }
			]
		});
		
		console.log('Result:', result);
		console.log('Type:', typeof result);
		console.log('isCancel:', isCancel(result));
		console.log('String:', String(result));
		
	} catch (error) {
		console.log('Caught error:', error.message);
	}
}

findRealSymbol().catch(console.error);