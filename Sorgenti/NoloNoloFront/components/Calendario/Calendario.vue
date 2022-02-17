<template>
	<v-card outlined bolded>
		<v-date-picker
			v-model="daterange"
			flat
			:readonly="readonly"
			:first-day-of-week="1"
			locale="it-UE"
			:allowed-dates="valid"
			no-title
			full-width
			range
		>
			<v-btn
				v-if="!readonly"
				text
				color="primary"
				@click="clear"
			>
				CLEAR
			</v-btn>
			<v-btn
				v-if="!readonly"
				text
				color="primary"
				@click="save"
			>
				OK
			</v-btn>
		</v-date-picker>
	</v-card>
</template>

<script src="./Calendario.js" />
