<template>
	<v-container>
		<v-row class="justify-start" dense>
			<v-col cols="12">
				<v-btn
					icon
					@click="toHome"
					aria-label="go back"
				>
					<v-icon> mdi-chevron-left </v-icon>
					<v-icon> mdi-home </v-icon>
				</v-btn>
			</v-col>
		</v-row>
		<v-row class="justify-start" dense>
			<Item :data="data" :permessi="permessi" />
		</v-row>
		<v-row class="justify-start" dense>
			<v-col cols="12" sm="8">
				<v-card
					style="border:2px solid lightblue"
					class="pa-2"
					outlined
				>
					<v-card-text>
						<div>
							<p>{{ data.descrizione }}</p>
						</div>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col cols="12" sm="4">
				<Calendario :readonly="true" :date="data.occupato" :permessi="permessi" :modifica="[0,0]" />
				<v-btn
					color="primary"
					small
					text
					type="submit"
					@click="goPay"
				>
					Richiesta noleggio
				</v-btn>
			</v-col>
		</v-row>
	</v-container>
</template>

<script src="./index.js"></script>
