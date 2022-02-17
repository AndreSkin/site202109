export default {
	data() {
		return {
			permessi: JSON.parse(localStorage.getItem("permesso")),
			original: [],
			prova: [],
			datas: [],
			recente: true,
			max: 0,
		}
	},
	beforeMount() {
		this.search("offices").then((resolve) => {
			this.original = resolve.reverse()
			this.datas = this.original
			this.max = this.datas.slice().sort((a, b) => b.costo_base - a.costo_base )[0].costo_base
			this.$nuxt.$emit("max", this.max)
		})
	},
	created() {
		this.$nuxt.$on("Più recente", () => {
			this.datas = this.datas.sort((a, b) => new Date(b.insertion) - new Date(a.insertion))
		})
		this.$nuxt.$on("Meno recente", () => {
			this.datas = this.datas.sort((a, b) => new Date(a.insertion) - new Date(b.insertion))
		})
		this.$nuxt.$on("Prezzo crescente", () => {
			this.datas = this.datas.sort((a, b) => a.costo_base - b.costo_base )
		})
		this.$nuxt.$on("Prezzo decerescente", () => {
			this.datas = this.datas.sort((a, b) => b.costo_base - a.costo_base )
		})
		this.$nuxt.$on("Dimensione crescente", () => {
			this.datas = this.datas.sort((a, b) => a.mq - b.mq )
		})
		this.$nuxt.$on("Dimensione decerescente", () => {
			this.datas = this.datas.sort((a, b) => b.mq - a.mq )
		})
		this.$nuxt.$on("Qualità crescente", () => {
			this.datas = this.datas.sort((a, b) => a.tier - b.tier )
		})
		this.$nuxt.$on("Qualità decrescente", () => {
			this.datas = this.datas.sort((a, b) => b.tier - a.tier )
		})
		this.$nuxt.$on("ottimo", (stato, ordine, range) => {
			this.filter(stato, ordine, range)
		})
		this.$nuxt.$on("sufficiente", (stato, ordine, range) => {
			this.filter(stato, ordine, range)
		})
		this.$nuxt.$on("buono", (stato, ordine, range) => {
			this.filter(stato, ordine, range)
		})
		this.$nuxt.$on("pessimo", (stato, ordine, range) => {
			this.filter(stato, ordine, range)
		})
		this.$nuxt.$on("qualsiasi", (stato, ordine, range) => {
			this.filter(stato, ordine, range)
		})
		this.$nuxt.$on("prezzo", (stato, ordine, range) => {
			this.filter(stato, ordine, range)
		})
	},
	methods: {
		async search(what) {
			return await this.$axios.$get("https://site202109.tw.cs.unibo.it/mongo/" + what )
		},
		goItem(data) {
			localStorage.setItem(data._id, JSON.stringify(data))
			window.location.href = "/Item/#" + data._id
		},
		filter(stato, ordine, range) {
			if (stato === "qualsiasi") {
				this.datas = this.original.slice().filter(a => a.costo_base >= range[0] && a.costo_base <= range[1])
			} else {
				this.datas = this.original.slice().filter(a => a.stato === stato && a.costo_base >= range[0] && a.costo_base <= range[1])
			}
			this.$nuxt.$emit(ordine)
		}
	},
}
