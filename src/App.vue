<template>
	<TodoList />
</template>

<script>
	import TodoList from "./components/TodoList";

	export default {
		name: "App",
		components: {
			TodoList: TodoList,
		},
	};
</script>

<style>
	/* #app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		margin-top: 60px;
		height: 100%;
	} */
</style>
