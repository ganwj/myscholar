<script>
	import ProfileForm from '$lib/components/Profile/ProfileForm.svelte';
	export let form;
	export let data;
</script>

{#if data.user}
	{#if data.user.hasProfile}
		<ProfileForm text="Edit profile" user={data.user} {form} />
	{:else}
		<ProfileForm text="Create profile" user={data.user} {form} />
	{/if}
{/if}
