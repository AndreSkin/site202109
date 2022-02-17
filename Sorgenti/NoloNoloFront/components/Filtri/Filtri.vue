<template>
	<v-card>
		<v-app-bar
			color="white"
			:height="height"
		>
			<v-row>
				<v-col :cols="permessi ? 6 : 12" :sm="permessi ? 4 : 6">
					<v-select
						v-model="selectOrdine"
						:items="itemOrdine"
						filled
						label="Ordine"
						hide-details
					/>
				</v-col>
				<v-col v-show="permessi" cols="6" sm="4">
					<v-select
						v-model="selectStato"
						:items="itemStato"
						filled
						label="Stato"
						hide-details
					/>
				</v-col>
				<v-col cols="12" :sm="permessi ? 4 : 6">
					<v-form
						@submit.prevent="submit"
					>
						<v-range-slider
							v-model="range"
							:max="max"
							:min="min"
							hide-details
							:aria-label="'range di prezzo: ' + range"
							aria-hidden="true"
							class="align-center"
						/>
						<v-row
							no-gutters
						>
							<v-col cols="4">
								<v-text-field
									:value="range[0]"
									class="mt-0 pt-0"
									aria_label="prezzo minimo"
									hide-details
									single-line
									type="number"
									style="width: 60px"
									@change="$set(range, 0, $event)"
								/>
							</v-col>
							<v-col cols="4">
								<v-text-field
									:value="range[1]"
									class="mt-0 pt-0"
									aria_label="prezzo massimo"
									hide-details
									single-line
									type="number"
									style="width: 60px"
									@change="$set(range, 1, $event)"
								/>
							</v-col>
							<v-col cols="4">
								<v-btn
									color="primary"
									small
									text
									type="submit"
									@click="submit"
								>
									OK
								</v-btn>
							</v-col>
						</v-row>
					</v-form>
				</v-col>
			</v-row>
		</v-app-bar>
	</v-card>
</template>

<script src="./Filtri.js">
