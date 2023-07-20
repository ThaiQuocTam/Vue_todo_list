<template>
	<div class="flex w-full justify-center pt-[80px] h-screen">
		<!-- container -->
		<div class="w-2/3 bg-white p-14 rounded-xl max-h-[80%] overflow-auto">
			<div class="w-full text-right">
				<label class="mr-2 font-medium text-sm">{{ $t("language") }}</label>
				<select
					v-model="$i18n.locale"
					class="text-xs text-gray-500 border-2 cursor-pointer border-gray-200 w-[110px] p-2 outline-none focus:border-gray-400 rounded-md focus:border-2"
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
					<h3 class="uppercase lg:text-4xl md:text-xl text-lg font-black">
						Todo list
					</h3>
					<span class="italic text-gray-600 mt-[3px] lg:text-base text-xs"
						>"
						{{ $t("slogan") }}
						"</span
					>
				</div>
				<div class="text-right my-5">
					<button
						@click="handleAddTask"
						class="border-2 hover:text-blue-700 hover:border-blue-700 sm:w-auto w-full py-2 px-7 rounded-lg border-blue-400 text-blue-400"
					>
						{{ $t("addTask") }}
					</button>
				</div>
			</div>
			<!-- body -->
			<div class="w-full overflow-auto">
				<!-- table -->
				<table class="w-full">
					<thead class="">
						<tr class="w-full border-b-2 border-gray-600">
							<th
								class="w-[50px] font-semibold text-gray-500 text-sm lg:text-lg text-center p-3"
							>
								#
							</th>
							<th
								class="w-[390px ] font-semibold text-gray-500 text-sm lg:text-lg text-center p-3"
							>
								{{ $t("taskName") }}
							</th>
							<th
								class="w-[150px ] font-semibold text-gray-500 text-sm lg:text-lg text-center p-3"
							>
								{{ $t("status") }}
							</th>
							<th
								class="w-[140px ] font-semibold text-gray-500 text-sm lg:text-lg text-center p-3"
							>
								{{ $t("time") }}
							</th>
							<th
								class="w-[53px] font-semibold text-gray-500 text-sm lg:text-lg text-center p-3"
							></th>
							<th
								class="w-[53px] font-semibold text-gray-500 text-sm lg:text-lg text-center p-3"
							></th>
						</tr>
					</thead>
					<tbody class="">
						<tr
							v-for="(item, index) in dataLocal"
							:key="item"
							class="w-full border-b-2 border-gray-200"
						>
							<td class="p-3 text-xs lg:text-sm lg:w-auto text-center">
								{{ (count = index + 1) }}
							</td>
							<td
								class="p-3 text-xs lg:text-sm text-center lg:w-auto flex lg:min-w-[300px] max-w-[400px] h-[83px] max-h-24 lg:max-h-20 overflow-auto justify-center items-center py-1"
							>
								{{ item.taskName }}
							</td>
							<td
								class="p-3 text-xs lg:text-sm w-auto text-center min-w-50px max-w-100px"
							>
								<div
									v-if="item.status === 'Completed'"
									class="text-green-600 italic py-2 border border-green-600 rounded-md"
								>
									<span class="mr-1">{{ $t("toastCompleted") }}</span>
									<i class="bi bi-check-square-fill"></i>
								</div>
								<div
									class="italic py-2 border border-gray-600 rounded-md text-gray-600"
									v-if="item.status === 'In Progress'"
								>
									<span class="mr-1">{{ $t("toastInProgress") }}</span>
									<input
										class="cursor-pointer"
										v-if="item.status === 'In Progress'"
										v-show="true"
										@click="handleCheckedCompleted(index)"
										type="checkbox"
									/>
								</div>
								<div
									class="italic py-2 px-1 border border-yellow-600 rounded-md text-yellow-600"
									v-if="item.status === 'Not Completed'"
								>
									<span class="mr-1">{{ $t("toastNotCompleted") }}</span>
									<i class="bi bi-exclamation-triangle-fill"></i>
								</div>
							</td>
							<td class="p-3 lg:text-sm text-xs text-center">
								{{ moment(item.time).format("DD/MM/YYYY - HH:mm") }}
							</td>
							<td
								v-if="item.status === 'In Progress'"
								@click="handleUpdateTodo(item)"
								class="p-3 lg:text-2xl text-base text-center text-blue-500 cursor-pointer hover:text-blue-600 relative"
							>
								<i class="bi bi-wrench-adjustable-circle-fill"></i>
							</td>

							<td
								v-else
								class="p-3 lg:text-2xl text-base text-center text-blue-300"
							>
								<i class="bi bi-wrench-adjustable-circle-fill"></i>
							</td>
							<td
								@click="handleDeleteTask(item.taskName)"
								class="p-3 lg:text-2xl text-base text-center text-red-400 cursor-pointer hover:text-red-600 relative"
							>
								<i class="bi bi-trash-fill"></i>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div
			v-if="isShowModalForm"
			class="absolute inset-0 flex justify-center bg-[#0f0f128a]"
		>
			<ModalForm
				v-bind:propsCloseModal="handleCloseModalForm"
				v-bind:propsDataUpdate="dataTodoUpdate"
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
				isShowModalForm: false,
				isShowToast: false,
				dataLocal: [],
				moment: moment,
				dataTodoUpdate: {
					taskName: "",
					time: "",
					status: "",
				},
				count: 0,
			};
		},
		methods: {
			handleCloseModalForm() {
				this.isShowModalForm = false;
			},
			handleAddTask() {
				this.dataTodoUpdate = { taskName: "", time: "", status: "" };
				this.isShowModalForm = true;
			},
			getData() {
				const listDataTodoLocal = JSON.parse(localStorage.getItem("todoList"));
				if (listDataTodoLocal) this.dataLocal = [...listDataTodoLocal];
				this.checkTimeTodoLimit();
			},
			handleDeleteTask(taskName) {
				const dataLocal = JSON.parse(localStorage.getItem("todoList"));
				const newArrTodo = [];
				if (dataLocal) {
					dataLocal.forEach((item) => {
						if (item.taskName !== taskName) newArrTodo.push(item);
					});
					localStorage.setItem("todoList", JSON.stringify([...newArrTodo]));
					toast.success(this.$t("toastDeleteSuccess"), {
						autoClose: 1500,
					});
				}
				this.getData();
			},
			handleUpdateTodo(data) {
				this.dataTodoUpdate = {
					taskName: data.taskName,
					time: data.time,
					status: data.status,
				};
				this.isShowModalForm = true;
			},
			updateTodoLocalStore() {
				const newArrTodo = [];
				this.dataLocal.forEach((item) => newArrTodo.push(item));
				localStorage.setItem("todoList", JSON.stringify([...newArrTodo]));
			},
			checkTimeTodoLimit() {
				if (!this.isShowToast && this.dataLocal.length !== 0) {
					this.dataLocal.forEach((item) => {
						if (item.status === "In Progress") {
							const dueTime = moment(item.time, "YYYY-MM-DD HH:mm");
							const alertTime = dueTime.clone().subtract(30, "minutes");
							if (moment().isAfter(alertTime)) {
								toast.warning(
									`${this.$t("toastWarning")} task '${item.taskName}' ${this.$t(
										"toastTimeUp"
									)} `,
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
					this.isShowToast = true;
					setTimeout(() => {
						this.isShowToast = false;
					}, 1000 * 30);
				}
			},
			handleCheckedCompleted(index) {
				const newArrTodo = [];
				this.dataLocal.forEach((item, indexItem) => {
					if (indexItem === index) {
						item.status = "Completed";
					}
					newArrTodo.push(item);
				});
				localStorage.setItem("todoList", JSON.stringify([...newArrTodo]));
				toast.success(this.$t("toastCompleted"), {
					autoClose: 1500,
				});
				this.getData();
			},
		},
		mounted() {
			try {
				this.getData();
				setInterval(() => {
					this.checkTimeTodoLimit();
				}, 1000);
			} catch (error) {
				console.log(error);
			}
		},
	};
</script>

<style></style>
