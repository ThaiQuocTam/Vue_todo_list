<template>
	<div
		@click="handleClickStopEvent"
		class="md:w-2/3 w-full bg-white max-h-[72%] mt-[80px] rounded-xl items-center px-10 pt-5 animate-modalForm relative overflow-auto pb-2"
	>
		<div
			@click="propsCloseModal"
			class="absolute top-[8px] right-5 text-2xl cursor-pointer text-red-600 hover:text-red-500"
		>
			<i class="bi bi-dash-circle-fill"></i>
		</div>
		<div class="text-center my-5 text-2xl font-black">
			<h3>
				{{
					dataTodoUpdate && dataTodoUpdate.taskName !== ""
						? $t("updateTodo")
						: $t("addTodo")
				}}
			</h3>
		</div>
		<div>
			<form @submit.prevent="handleSubmitTodo" class="">
				<div class="mb-5 items-center h-[230px] overflow-hidden">
					<div class="w-full mb-2 flex items-center">
						<label class="font-semibold text-lg italic"
							>{{ $t("taskName") }}:</label
						>
					</div>
					<div class="w-full h-[182px] flex items-start relative">
						<editor
							name="taskName"
							v-model="contentTaskName"
							textareaName="contentTaskName"
							api-key="no-api-key"
							@input="onChangeTaskName"
							:init="{
								width: '100%',
								height: '100%',
								menubar: false,
								plugins: [
									'advlist autolink lists link image charmap print preview anchor',
									'searchreplace visualblocks code fullscreen',
									'insertdatetime media table paste code help wordcount',
								],
								toolbar:
									'undo redo | formatselect | bold italic backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | help',
							}"
						/>
					</div>
				</div>
				<div class="mb-5 items-center">
					<div class="w-full flex items-center mb-2">
						<label class="font-semibold text-lg italic"
							>{{ $t("time") }}:</label
						>
					</div>
					<div class="w-fullitems-center">
						<input
							name="time"
							type="datetime-local"
							:min="dataTodoUpdate.time ? dataTodoUpdate.time : minDateTime"
							:value="dataTodoUpdate.time ? dataTodoUpdate.time : minDateTime"
							class="w-full border-2 cursor-pointer border-gray-300 text-slate-500 text-base rounded-xl placeholder: p-2 px-5 outline-none focus:border-blue-400"
						/>
						<span class="text-gray-500 text-xs mt-1"
							>({{ $t("timeLimit") }})</span
						>
					</div>
				</div>
				<div class="w-full text-right">
					<button
						class="border-2 hover:text-blue-700 hover:border-blue-700 py-2 px-12 lg:w-auto w-full rounded-lg border-blue-400 text-blue-400"
						v-if="!dataTodoUpdate.taskName"
					>
						{{ $t("btnAdd") }}
					</button>
					<button
						class="border-2 hover:text-yellow-700 hover:border-yellow-700 py-2 px-12 rounded-lg border-yellow-400 text-yellow-400"
						v-else
					>
						{{ $t("btnUpdate") }}
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
	import Editor from "@tinymce/tinymce-vue";
	import { toast } from "vue3-toastify";
	import "vue3-toastify/dist/index.css";

	export default {
		name: "ModalForm",
		props: ["propsDataUpdate", "propsGetData", "propsCloseModal"],
		components: {
			editor: Editor,
		},
		data() {
			return {
				minDateTime: "",
				contentTaskName: "",
				dataTodoUpdate: {},
			};
		},
		methods: {
			handleClickStopEvent(event) {
				event.stopPropagation();
			},
			onChangeTaskName(value) {
				this.contentTaskName = value;
			},
			getDate() {
				const currentDate = new Date();
				currentDate.setMinutes(currentDate.getMinutes() + 30);
				const year = currentDate.getFullYear();
				const month = String(currentDate.getMonth() + 1).padStart(2, "0");
				const day = String(currentDate.getDate()).padStart(2, "0");
				const hours = String(currentDate.getHours()).padStart(2, "0");
				const minutes = String(currentDate.getMinutes()).padStart(2, "0");
				this.minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
			},
			addTodo(e) {
				try {
					const parser = new DOMParser();
					const parsedDocument = parser.parseFromString(
						this.contentTaskName,
						"text/html"
					);
					let taskName = parsedDocument.body.textContent.trim();
					let time = e.target.time.value;
					if (taskName && time) {
						const todo = {
							taskName: taskName,
							time: time,
							status: "In Progress",
						};
						const dataLocalStore = JSON.parse(localStorage.getItem("todoList"));
						if (dataLocalStore) {
							const arrTodoList = [...dataLocalStore];
							const checkTodo = arrTodoList.some(
								(item) => item.taskName === taskName
							);
							if (checkTodo) {
								toast.warning(this.$t("toastExistTaskName"), {
									autoClose: "1500",
								});
							} else {
								localStorage.setItem(
									"todoList",
									JSON.stringify([...arrTodoList, todo])
								);
								toast.success(this.$t("toastAddSuccess"), {
									autoClose: "1500",
								});
								this.contentTaskName = "";
							}
						} else {
							localStorage.setItem("todoList", JSON.stringify([todo]));
						}
					} else {
						toast.warning(this.$t("toastVerify"), {
							autoClose: 1500,
						});
					}
					this.propsGetData();
				} catch (e) {
					console.log(e);
				}
			},
			updateTodo(e, indexTodo) {
				try {
					const parser = new DOMParser();
					const parsedDocument = parser.parseFromString(
						this.contentTaskName,
						"text/html"
					);
					let taskName = parsedDocument.body.textContent;
					let time = e.target.time.value;
					if (taskName && time) {
						const dataLocalStore = JSON.parse(localStorage.getItem("todoList"));
						if (dataLocalStore) {
							const check = dataLocalStore.filter((item, index) => {
								if (indexTodo !== index) return item;
							});
							const checkTaskName = check.every((item) => {
								return item.taskName !== taskName;
							});
							if (!checkTaskName) {
								toast.warning(this.$t("toastExistTaskName"), {
									autoClose: 1500,
								});
							} else {
								dataLocalStore.forEach((item, index) => {
									if (index === indexTodo) {
										item.taskName = taskName;
										item.time = time;
										return;
									}
								});
								toast.success(this.$t("toastUpdateSuccess"), {
									autoClose: 1500,
								});
								this.propsCloseModal();
							}
							localStorage.setItem(
								"todoList",
								JSON.stringify([...dataLocalStore])
							);
						} else {
							toast.warning(this.$t("toastVerify"), {
								autoClose: 1500,
							});
						}
					} else {
						toast.warning(this.$t("toastVerify"), {
							autoClose: 1500,
						});
					}
				} catch (e) {
					toast.warning("Error", {
						autoClose: 1500,
					});
				}
				this.propsGetData();
			},
			handleSubmitTodo(e) {
				if (!this.dataTodoUpdate.taskName) this.addTodo(e);
				else {
					let indexTodo;
					const dataLocalStore = JSON.parse(localStorage.getItem("todoList"));
					dataLocalStore.forEach((item, index) => {
						if (item.taskName === this.dataTodoUpdate.taskName)
							indexTodo = index;
					});
					this.updateTodo(e, indexTodo);
				}
			},
		},
		mounted() {
			this.getDate();
			if (this.propsDataUpdate) {
				this.contentTaskName = this.propsDataUpdate.taskName;
				this.dataTodoUpdate = {
					taskName: this.propsDataUpdate.taskName,
					time: this.propsDataUpdate.time,
					status: this.propsDataUpdate.status,
				};
			}
		},
	};
</script>

<style></style>
