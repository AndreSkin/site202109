<template>
	<v-container>
		<v-row no-gutters>
			<v-col cols="12" sm="6">
				<v-card outlined>
					<v-img :src="'https://site202109.tw.cs.unibo.it' + data.img.slice(2)" height="300" :alt="'immagine di:' + data.nome" />
				</v-card>
			</v-col>
			<v-col cols="12" sm="6">
				<FirstData :data="data" :permessi="permessi" />
			</v-col>
		</v-row>
	</v-container>
</template>

<script src="./Item.js"/>
