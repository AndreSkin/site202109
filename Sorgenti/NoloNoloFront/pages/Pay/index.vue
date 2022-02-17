<template>
	<v-container d-flex flex-column>
		<v-row class="justify-start" dense>
			<v-col cols="12">
				<v-btn
					icon
					@click="back"
					aria-label="go back"
				>
					<v-icon> mdi-chevron-left </v-icon>
					<v-icon> mdi-home </v-icon>
				</v-btn>
			</v-col>
		</v-row>
		<v-row class="justify-start" dense>
			<v-col cols="12">
				<Item :data="data" :permessi="permessi" />
			</v-col>
		</v-row>
		<v-row class="justify-start" dense>
			<v-col cols="12" sm="4">
				<v-text-field
					v-model="pick"
					label="Date range"
					prepend-icon="mdi-calendar"
					readonly
				/>
				<Calendario :readonly="show ? true : false" :date="data.occupato" :permessi="permessi" :modifica="[noleggio.inizio, noleggio.fine]" />
				<v-form
					v-if="permessi >= 2"
					@submit.prevent="getCliente(NomeCliente)"
				>
					<v-text-field
						v-model="NomeCliente"
						label="Nome del cliente"
						prepend-icon="mdi-account"
					/>
					<v-btn
						color="primary"
						small
						text
						type="submit"
						@click="getCliente(NomeCliente)"
					>
						Conferma
					</v-btn>
				</v-form>
				<div
					v-if="permessi >= 1"
					style="padding: 5px 0 5px 0"
				>
					<v-select
						v-model="selectPay"
						:items="pay"
						filled
						:readonly="show"
						label="Metodo di pagamento"
						append-icon="mdi-credit-card-chip-outline"
						hide-details
					/>
				</div>
				<div
					v-if="permessi >= 2"
					style="padding: 5px 0 5px 0"
				>
					<v-select
						v-model="selectConcluso"
						:items="concluso"
						filled
						:readonly="show"
						label="Concluso"
						append-icon="mdi-credit-card-chip-outline"
						hide-details
					/>
				</div>
			</v-col>
			<v-col cols="12" sm="8">
				<v-simple-table>
					<thead>
						<tr>
							<th class="text-left">
								Descrizzione
							</th>
							<th class="text-left">
								valore
							</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(item, i) in fattura"
							:key="i"
						>
							<td>{{ item.desc }}</td>
							<td>{{ item.val }}</td>
						</tr>
					</tbody>
				</v-simple-table>
				<v-btn
					v-show="!modifica && !show"
					color="primary"
					small
					text
					type="submit"
					@click="fine"
				>
					Completa noleggio
				</v-btn>
				<v-btn
					v-show="modifica && !show"
					color="primary"
					small
					text
					type="submit"
					@click="modifiche"
				>
					Conferma modifiche
				</v-btn>
			</v-col>
		</v-row>
		<v-dialog v-model="alert.show" transition="dialog-top-transition" width="auto">
			<v-alert class="ma-0" :type="alert.type">{{ alert.message }}</v-alert>
		</v-dialog>
	</v-container>
</template>

<script src="./index.js"/>
