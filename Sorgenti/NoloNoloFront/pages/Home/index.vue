<template>
	<v-container>
		<Filtri :permessi="permessi" />
		<div
			v-for="( data, i ) in datas"
			:key="i"
			@click="goItem(data)"
		>
			<Item
				:data="data"
				:permessi="permessi"
			/>
		</div>
	</v-container>
</template>

<script src="./index.js"/>
