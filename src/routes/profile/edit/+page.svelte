<script>
	import ProfileForm from '$lib/components/Profile/ProfileForm.svelte';
	export let form;
	export let data;
</script>

{#if data.user}
	<ProfileForm user={data.user} {form} />
{/if}
