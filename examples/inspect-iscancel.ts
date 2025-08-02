async function inspectIsCancel() {
	const { isCancel } = await import('@clack/prompts');
	
	console.log('--- Inspecting isCancel function ---');
	console.log('isCancel function:', isCancel.toString());
	
	// Test various symbol types  
	const symbols = [
		Symbol('clack:cancel'),
		Symbol.for('clack:cancel'),
		Symbol('cancel'),
		Symbol.for('cancel'),
	];
	
	console.log('\n--- Testing different symbols ---');
	symbols.forEach((sym, i) => {
		console.log(`Symbol ${i}: ${String(sym)}`);
		console.log(`  isCancel detects: ${isCancel(sym)}`);
		console.log(`  Type: ${typeof sym}`);
		console.log(`  For: ${sym === Symbol.for('clack:cancel')}`);
	});
	
	// Check if there's an internal cancel symbol
	const core = await import('@clack/core');
	console.log('\n--- Core exports ---');
	Object.getOwnPropertyNames(core).forEach(name => {
		if (name.toLowerCase().includes('cancel')) {
			console.log(`${name}:`, core[name]);
		}
	});
}

inspectIsCancel().catch(console.error);