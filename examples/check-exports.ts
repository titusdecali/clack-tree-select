async function checkExports() {
	console.log('--- @clack/core exports ---');
	const core = await import('@clack/core');
	console.log(Object.keys(core));
	
	console.log('\n--- @clack/prompts exports ---');
	const prompts = await import('@clack/prompts');
	console.log(Object.keys(prompts));
	
	// Check if there's a CANCEL_SYMBOL or similar
	console.log('\n--- Looking for cancel-related exports ---');
	console.log('core.CANCEL_SYMBOL:', core.CANCEL_SYMBOL);
	console.log('prompts.CANCEL_SYMBOL:', prompts.CANCEL_SYMBOL);
	console.log('prompts.cancel:', typeof prompts.cancel);
}

checkExports().catch(console.error);