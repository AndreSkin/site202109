export default {
	props: ["permessi"],
	data() {
		return {
			selectOrdine: "Più recente",
			itemOrdine: [
				"Più recente",
				"Meno recente",
				"Prezzo crescente",
				"Prezzo decerescente",
				"Dimensione crescente",
				"Dimensione decerescente",
				"Qualità crescente",
				"Qualità decrescente"
			],
			selectStato: "qualsiasi",
			itemStato: [
				"ottimo",
				"sufficiente",
				"buono",
				"pessimo",
				"qualsiasi"
			],
			min: 0,
			max: 0,
			range: [0, 0]
		}
	},
	beforeMount() {
		this.$nuxt.$on("max", (val) => {
			this.range[1] = val
			this.max = val
		})
	},
	computed: {
		height() {
			switch (this.$vuetify.breakpoint.name) {
			case 'xs': return "200%"
			case 'sm': return "100%"
			case 'md': return "100%"
			case 'lg': return "100%"
			case 'xl': return "100%"
			}
		}
	},
	watch: {
		selectOrdine(val) {
			this.$nuxt.$emit(val)
		},
		selectStato(val) {
			this.$nuxt.$emit(val, val, this.selectOrdine, this.range)
		}
	},
	methods: {
		submit() {
			this.$nuxt.$emit("prezzo", this.selectStato, this.selectOrdine, this.range)
		}
	}
}
