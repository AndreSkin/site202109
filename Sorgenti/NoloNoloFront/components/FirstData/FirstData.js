export default {
	props: [ 'data', "permessi" ],
	data() {
		return {
			today: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
			avaliable: {
				icon: "",
				dispo: "",
			}
		}
	},
	created() {
		this.OnOff()
	},
	methods: {
		OnOff() {
			if (this.data.occupato.find(elem => elem.from <= this.today && elem.to >= this.today) === undefined) {
				this.avaliable.icon = "green"
				this.avaliable.dispo = "Disponibile"
			} else {
				this.avaliable.icon = "red"
				this.avaliable.dispo = "Non Disponibile"
			}
		}
	},
	watch: {
		data() {
			this.OnOff()
		}
	}
}
