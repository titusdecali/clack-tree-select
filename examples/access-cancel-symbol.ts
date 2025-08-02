async function accessCancelSymbol() {
	const core = await import('@clack/core');
	const prompts = await import('@clack/prompts');
	
	console.log('--- Looking for cancel symbol in modules ---');
	
	// Try to find hidden/internal symbols
	console.log('Core symbols:', Object.getOwnPropertySymbols(core));
	console.log('Prompts symbols:', Object.getOwnPropertySymbols(prompts));
	
	// Check global Symbol registry
	console.log('\n--- Checking global Symbol registry ---');
	const globalCancel = Symbol.for('clack:cancel');
	console.log('Global Symbol.for("clack:cancel"):', globalCancel);
	console.log('isCancel detects global:', prompts.isCancel(globalCancel));
	
	// Try other common patterns
	const patterns = [
		'@@clack:cancel',
		'clack.cancel',
		'cancel',
		'CANCEL',
		'CANCEL_SYMBOL'
	];
	
	console.log('\n--- Testing Symbol.for patterns ---');
	patterns.forEach(pattern => {
		const sym = Symbol.for(pattern);
		console.log(`${pattern}: ${prompts.isCancel(sym)}`);
	});
}

accessCancelSymbol().catch(console.error);