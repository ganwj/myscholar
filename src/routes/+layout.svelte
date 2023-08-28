<script>
	import Nav from '$lib/components/Nav.svelte';
	import messagesStore from '$lib/stores/messages.store';
	import '../app.postcss';
	import { Alert } from 'flowbite-svelte';
	import { Icon } from 'flowbite-svelte-icons';
</script>

<Nav />
<div class="container">
	{#if $messagesStore.show}
		{#if $messagesStore.type === 'error'}
			<Alert class="mt-4" color="red" dismissable>
				<Icon name="exclamation-circle-solid" slot="icon" class="w-4 h-4" />
				<span class="font-medium">Error: </span>
				{$messagesStore.message}
			</Alert>
		{:else if $messagesStore.type === 'success'}
			<Alert class="mt-4" color="green" dismissable>
				<Icon name="check-circle-solid" slot="icon" class="w-4 h-4" />
				<span class="font-medium">Success: </span>
				{$messagesStore.message}
			</Alert>
		{/if}
	{/if}
	<slot />
</div>
