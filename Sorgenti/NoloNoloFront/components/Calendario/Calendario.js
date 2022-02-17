export default {
	props: [ 'readonly', 'date', "permessi", "modifica" ],
	data() {
		return {
			today: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
			valid: val => (this.date.every(day => ((val < day.from || val > day.to) || (val < day.from && day.to === "NC")) || (val <= this.today && this.permessi > 1) || (val >= this.modifica[0] && val <= this.modifica[1])) || this.permessi === 0) && (val >= this.today || this.permessi > 1),
			daterange: []
		}
	},
	created() {
		this.$nuxt.$on("day", (pick) => { this.daterange = pick })
	},
	methods: {
		save () {
			if ( this.daterange[0] > this.daterange[1] ) {
				this.daterange = [this.daterange[1], this.daterange[0]]
			}
			this.$nuxt.$emit("date", this.daterange)
		},
		clear() {
			this.daterange = []
			this.$nuxt.$emit("clear")
		}
	}
}
