<template>
	<div class="flex w-full justify-center pt-[80px] h-screen">
		<!-- container -->
		<div class="w-2/3 bg-white p-14 rounded-xl max-h-[80%] overflow-auto">
			<div class="w-full text-right">
				<label class="mr-2 font-medium text-sm">{{ $t("language") }}</label>
				<select
					v-model="$i18n.locale"
					class="text-xs text-gray-500 border-2 cursor-pointer border-gray-200 w-[92px] pr-2 p-2 outline-none focus:border-gray-400 rounded-md focus:border-2"
				>
					<option
						v-for="locale in $i18n.availableLocales"
						:key="`locale-${locale}`"
						:value="locale"
					>
						{{ locale }}
					</option>
				</select>
			</div>

			<!-- head -->
			<div class="w-full justify-center">
				<div class="my-5 text-left">
					<h3 class="uppercase text-4xl font-black">Todo list</h3>
					<span class="italic text-gray-600 mt-[3px]"
						>"
						{{ $t("slogan") }}
						"</span
					>
				</div>
				<div class="text-right my-5">
					<button
						@click="handleAddTask"
						class="border-2 hover:text-blue-700 hover:border-blue-700 py-2 px-7 rounded-lg border-blue-400 text-blue-400"
					>
						{{ $t("addTask") }}
					</button>
				</div>
			</div>
			<!-- body -->
			<div class="w-full">
				<!-- table -->
				<table class="w-full">
					<thead>
						<tr class="w-full border-b-2 border-gray-600">
							<th
								class="w-[50px] font-semibold text-gray-500 text-lg text-center p-3"
							>
								#
							</th>
							<th
								class="w-[390px] font-semibold text-gray-500 text-lg text-center p-3"
							>
								{{ $t("taskName") }}
							</th>
							<th
								class="w-[150px] font-semibold text-gray-500 text-lg text-center p-3"
							>
								{{ $t("status") }}
							</th>
							<th
								class="w-[140px] font-semibold text-gray-500 text-lg text-center p-3"
							>
								{{ $t("time") }}
							</th>
							<th
								class="w-[53px] font-semibold text-gray-500 text-lg text-center p-3"
							></th>
							<th
								class="w-[53px] font-semibold text-gray-500 text-lg text-center p-3"
							></th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(item, index) in dataLocal"
							:key="item"
							class="w-full border-b-2 border-gray-200"
						>
							<td class="p-3 text-sm text-center">
								{{ (indexTodo = index + 1) }}
							</td>
							<td class="p-3 text-sm text-center">{{ item.taskName }}</td>
							<td class="p-3 text-sm text-center">
								<div
									v-if="item.status === 'Completed'"
									class="text-green-600 italic py-2 border border-green-600 rounded-md"
								>
									<span class="mr-1">{{ item.status }}</span>
									<i class="bi bi-check-square-fill"></i>
								</div>
								<div
									class="italic py-2 border border-gray-600 rounded-md text-gray-600"
									v-if="item.status === 'In Progress'"
								>
									<span class="mr-1">{{ item.status }}</span>
									<input
										class="cursor-pointer"
										v-if="item.status === 'In Progress'"
										v-show="true"
										@click="handleChecked(index)"
										type="checkbox"
									/>
								</div>
								<div
									class="italic py-2 px-1 border border-yellow-600 rounded-md text-yellow-600"
									v-if="item.status === 'Not Completed'"
								>
									<span class="mr-1">{{ item.status }}</span>
									<i class="bi bi-exclamation-triangle-fill"></i>
								</div>
							</td>
							<td class="p-3 text-sm text-center">
								{{ moment(item.time).format("DD/MM/YYYY - HH:mm") }}
							</td>
							<td
								v-if="item.status === 'In Progress'"
								@click="
									handelEditTask(item);
									isShow = true;
								"
								class="p-3 text-2xl text-center text-blue-500 cursor-pointer hover:text-blue-600 relative"
							>
								<i class="bi bi-wrench-adjustable-circle-fill"></i>
							</td>

							<td v-else class="p-3 text-2xl text-center text-blue-300">
								<i class="bi bi-wrench-adjustable-circle-fill"></i>
							</td>
							<td
								@click="handleDeleteTask(item.taskName)"
								class="p-3 text-2xl text-center text-red-400 cursor-pointer hover:text-red-600 relative"
							>
								<i class="bi bi-trash-fill"></i>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div
			v-show="isShow"
			class="absolute inset-0 flex justify-center bg-[#0f0f128a]"
		>
			<ModalForm
				v-bind:closeModal="handleCloseModal"
				v-bind:propsDataEdit="dataEdit"
				v-bind:propsGetData="getData"
			/>
		</div>
	</div>
</template>

<script>
	import ModalForm from "./ModalForm.vue";
	import moment from "moment";
	import { toast } from "vue3-toastify";
	import "vue3-toastify/dist/index.css";

	export default {
		name: "TodoList",
		components: {
			ModalForm: ModalForm,
		},

		data() {
			return {
				isShow: false,
				isToastShow: false,
				dataLocal: [],
				moment: moment,
				dataEdit: {
					taskName: "",
					time: "",
					status: "",
				},
				indexTodo: 0,
			};
		},
		methods: {
			handleClick(event) {
				event.stopPropagation();
			},
			handleCloseModal() {
				this.isShow = false;
			},
			handleAddTask() {
				this.dataEdit = { taskName: "", time: "", status: "" };
				this.isShow = true;
			},
			getData() {
				const listData = JSON.parse(localStorage.getItem("todoList"));
				if (listData) this.dataLocal = [...listData];
				this.render();
			},
			handleDeleteTask(taskName) {
				const dataLocal = JSON.parse(localStorage.getItem("todoList"));
				const newArr = [];
				if (dataLocal) {
					dataLocal.forEach((item) => {
						if (item.taskName !== taskName) newArr.push(item);
					});
					localStorage.setItem("todoList", JSON.stringify([...newArr]));
					toast.success("Delete Success", {
						autoClose: 1500,
					});
				}
				this.getData();
			},
			handelEditTask(data) {
				this.dataEdit = {
					taskName: data.taskName,
					time: data.time,
					status: data.status,
				};
			},
			updateTodoLocalStore() {
				const newArr = [];
				this.dataLocal.forEach((item) => newArr.push(item));
				localStorage.setItem("todoList", JSON.stringify([...newArr]));
			},
			render() {
				if (!this.isToastShow && this.dataLocal.length !== 0) {
					this.dataLocal.forEach((item) => {
						if (item.status === "In Progress") {
							const dueTime = moment(item.time, "YYYY-MM-DD HH:mm");
							console.log(dueTime.toString());
							const alertTime = dueTime.clone().subtract(30, "minutes");
							if (moment().isAfter(alertTime)) {
								toast.warning(
									`Warning: Task ${item.taskName} is approaching the deadline`,
									{
										autoClose: "4500",
									}
								);
							}
							if (moment().isAfter(dueTime)) {
								item.status = "Not Completed";
								this.updateTodoLocalStore();
							}
						}
					});
					this.isToastShow = true;
					setTimeout(() => {
						this.isToastShow = false;
					}, 1000 * 30);
				}
			},
			handleChecked(index) {
				const newArr = [];
				this.dataLocal.forEach((item, indexItem) => {
					if (indexItem === index) {
						console.log("haha");
						item.status = "Completed";
					}
					newArr.push(item);
				});
				console.log(newArr);
				localStorage.setItem("todoList", JSON.stringify([...newArr]));
				toast.success("Completed", {
					autoClose: 1500,
				});
				this.getData();
			},
		},
		mounted() {
			try {
				this.getData();
				setInterval(() => {
					this.render();
				}, 1000);
				this.render();
			} catch (error) {
				console.log(error);
			}
		},
	};
</script>

<style></style>
