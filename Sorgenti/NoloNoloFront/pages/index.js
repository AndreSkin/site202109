const bcrypt = require('bcryptjs')
export default {
	layout: "empty",
	data() {
		return {
			UserName: "",
			password: "",
			queryRules: [ v => !!v ],
			valid: false,
			show: false,
			alert: {
				message: "",
				show: false,
				type: ""
			},
		}
	},
	beforeMount() {
		localStorage.clear()
	},
	computed: {
		width() {
			switch (this.$vuetify.breakpoint.name) {
			case 'xs': return "100%"
			case 'sm': return "100%"
			case 'md': return "50%"
			case 'lg': return "30%"
			case 'xl': return "30%"
			}
		}
	},
	methods: {
		async submit() {
			try {
				await this.$axios.$get("https://site202109.tw.cs.unibo.it/mongo/people?nome=" + this.UserName).then((res) => {
					bcrypt.compare(this.password, res.val.psw, (err, resp) => {
						if (err) { throw err }
						if (!resp) {
							this.alert.message = "Password errata"
							this.alert.type = "warning"
							this.alert.show = true
							this.password = ""
						} else {
							localStorage.setItem("user", JSON.stringify({nome: res.val.nome, img: res.val.img || "../funz.jpg"}))
							localStorage.setItem("permesso", res.permesso)
							window.location.href = '/Home'
						}
					})

				})
			} catch (e) {
				this.alert.message = "Utente non esistente"
				this.alert.type = "warning"
				this.alert.show = true
			}
		},
		guest() {
			localStorage.setItem("user", JSON.stringify({nome: "", img: ""}))
			localStorage.setItem("permesso", 0)
			window.location.href = '/Home'
		},
		register() {
			window.location.href = '/Register'
		},
	}
}
