const bcrypt = require("bcryptjs")

export default {
	layout: 'empty',
	data() {
		return {
			UserName: "",
			Password: "",
			Rpassword: "",
			EMail: "",
			Indirizzo: "",
			pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			show: false,
			alert: {
				message: "",
				show: false,
				type: ""
			},
			user: JSON.parse(localStorage.getItem("user")),
			items: [
				{ title: 'General', icon: 'mdi-account' },
				{ title: 'I miei noleggi', icon: 'mdi-home-city' },
				{ title: 'Users', icon: 'mdi-account-group-outline' },
			],
		}
	},
	beforeMount() {
		this.$axios.$get("https://site202109.tw.cs.unibo.it/mongo/people?nome=" + this.user.nome).then((res) => {
			this.user = res.val
		})
	},
	methods: {
		goHome() {
			window.location.href = '../Home'
		},
		active(noleggio) {
			const inizio = new Date(noleggio.inizio)
			const fine = new Date(noleggio.fine)
			const today = new Date(Date.now())

			if (noleggio.funzionario === "") {
				return "background-color: #f1c40f" //giallo
			} else if (today < inizio) {
				return "background-color: #3498db" //blu
			} else if (today > fine && noleggio.concluso === "Concluso") {
				return "background-color: #27ae60" //verde => concluso
			} else if (today >= inizio && today <= fine) {
				return "background-color: #e67e22" //arancione => in corso
			} else if (today > fine && noleggio.concluso === "Concluso ma non pagato") {
				return "background-color: #e74c3c" //rosso => concluso ma non pagato
			}
		},
		async elimina() {
			if (this.user.storico_noleggi.find(elem => elem.concluso === "Da concludere" || elem.concluso === "Concluso ma non pagato" || elem.concluso === "In corso" || elem.concluso === "Da iniziare")) {
				this.alert.message = "Alcuni noleggi non permettono la cancellazione"
				this.alert.type = "warning"
				this.alert.show = true
			} else {
				let res = null
				try {
					res = await this.$axios({
						method: 'delete',
						url: "https://site202109.tw.cs.unibo.it/mongo/deletehere?type=cliente",
						data: {
							nome: this.user.nome
						}
					}).then(resp => {
						if (resp.status === 200) {
							window.location.href = '../'
						}
					})
				} catch (e) {
					if (res) { res = null }
				}
			}
		},
		async eliminaNoleggio(noleggio) {
			await this.$axios({
				method: 'delete',
				url: "https://site202109.tw.cs.unibo.it/mongo/deletenoleggi",
				data: {
					nome: this.user.nome,
					office: noleggio.office_id,
					inizio: noleggio.inizio,
					fine: noleggio.fine
				}
			}).then(resp => {
				if (resp.status === 200) {
					window.location.reload()
				}
			})
		},
		async modificaShow(noleggio, bool) {
			await this.$axios({
				method: 'get',
				url: "https://site202109.tw.cs.unibo.it/mongo/offices?nome=" + noleggio.office_id
			}).then(res => {
				localStorage.setItem(res.data._id, JSON.stringify(res.data))
				localStorage.setItem("modifica", bool)
				localStorage.setItem("noleggio", JSON.stringify(noleggio))
				localStorage.setItem("show", !bool)
				window.location.href = '../Pay/#' + res.data._id
			})
		},
		async modifica() {
			if (!this.UserName && !this.EMail && !this.Password && !this.Indirizzo) {
				this.alert.message = "Nessun elemnto da modificare"
				this.alert.type = "warning"
				this.alert.show = true
			} else {
				try {
					await this.$axios({
						method: 'get',
						url: "https://site202109.tw.cs.unibo.it/mongo/people?nome=" + this.UserName
					}).then(resp => {
						if (resp.status === 200) {
							this.alert.message = "Nome utente già presente"
							this.alert.type = "error"
							this.alert.show = true
						}
					})
				} catch (e) {
					try {
						await this.$axios({
							method: 'get',
							url: "https://site202109.tw.cs.unibo.it/mongo/people?mail=" + this.EMail
						}).then(resp => {
							if (resp.status === 200) {
								this.alert.message = "Email già presente"
								this.alert.type = "error"
								this.alert.show = true
							}
						})
					} catch (e) {
						if (this.EMail !== "" && !this.pattern.test(this.EMail)) {
							this.alert.message = "Email non corretta"
							this.alert.type = "error"
							this.alert.show = true
						} else if (this.Password !== this.Rpassword) {
							this.alert.message = "Password diverse"
							this.alert.type = "error"
							this.alert.show = true
							this.Rpassword = ""
						} else {
							bcrypt.hash(this.Password || this.user.psw, 10, async (err, hash) => {
								if (err) { throw err }
								await this.$axios({
									method: 'put',
									url: "https://site202109.tw.cs.unibo.it/mongo/puthere?type=modcliente",
									headers: {},
									data: {
										ToChange: this.user.nome,
										nome: this.UserName ? this.UserName : this.user.nome,
										indirizzo: this.Indirizzo ? this.Indirizzo : this.user.indirizzo,
										mail: this.EMail ? this.EMail : this.user.mail,
										psw: this.Password ? hash : this.user.psw
									}
								}).then(res => {
									if (res.status === 200) {
										if (this.UserName !== "") {
											localStorage.setItem("user", JSON.stringify({nome: this.UserName || this.user.nome, img: this.user.img}))
										}
										window.location.reload()
									}
								})
							})
						}
					}
				}
			}
		}
	}
}
