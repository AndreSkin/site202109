<template>
	<v-card outlined height="300">
		<v-card-title class="text-h4">{{ data.nome }}</v-card-title>
		<v-divider />
		<v-card-text style="font-size:100%" class="text--primary">
			<div class="text-h5">
				{{ data.costo_base }}€<sub>/day</sub>
			</div>
			<div>
				Indirizzo: {{ data.indirizzo }}
			</div>
			<div v-show="permessi != 0">
				Stato:{{ data.stato }}
			</div>
			<div>
				MQ: {{ data.mq }}<sub>m<sup>2</sup></sub>
			</div>
			<div v-show="permessi != 0">
				<v-icon :color="avaliable.icon">
					mdi-circle
				</v-icon>
				{{ avaliable.dispo }}
			</div>
			<div>
				Tier: {{ data.tier }}
				<v-rating
					:value="data.tier"
					:length="data.tier"
					aria-hidden="true"
					color="amber"
					dense
					readonly
					size="25"
				/>
			</div>
		</v-card-text>
	</v-card>
</template>

<script src="./FirstData.js"/>
