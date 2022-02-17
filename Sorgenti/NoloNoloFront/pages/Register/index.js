const bcrypt = require('bcryptjs')

export default {
	layout: "empty",
	data() {
		return {
			UserName: "",
			Password: "",
			Rpassword: "",
			EMail: "",
			Indirizzo: "",
			Image: [],
			Rules: [ v => !!v ],
			pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			valid: false,
			show: false,
			alert: {
				message: "",
				show: false,
				type: ""
			},
		}
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
			let res = null
			try {
				res = await this.$axios({
					method: 'get',
					url: "https://site202109.tw.cs.unibo.it/mongo/people?nome=" + this.UserName,
				}).then(resp => {
					if (resp.status === 200) {
						this.alert.message = "Nome utente già presente"
						this.alert.type = "error"
						this.alert.show = true
					}
				})
			} catch (err) {
				try {
					res = await this.$axios({
						method: 'get',
						url: "https://site202109.tw.cs.unibo.it/mongo/people?mail=" + this.EMail
					}).then(resp => {
						if (resp.status === 200) {
							this.alert.message = "Email già presente"
							this.alert.type = "error"
							this.alert.show = true
						}
					})
					if (res) { res = null }
				} catch (err) {
					if (!this.pattern.test(this.EMail)) {
						this.alert.message = "Email non corretta"
						this.alert.type = "error"
						this.alert.show = true
					} else if (this.Password !== this.Rpassword) {
						this.alert.message = "Password diverse"
						this.alert.type = "error"
						this.alert.show = true
						this.Rpassword = ""
					} else {
						const data = new FormData()
						data.append("nome", this.UserName.trim())
						data.append("mail", this.EMail)
						data.append("address", this.Indirizzo)
						data.append("image", this.Image)
						res = await bcrypt.hash(this.Password, 10, async (err, password) => {
							if (err) { throw err }
							try {
								data.append("psw", password)
								res = await this.$axios({
									method: 'post',
									url: "https://site202109.tw.cs.unibo.it/mongo/posthere?type=user",
									headers: {
										'Content-Type': 'multipart/form-data',
									},
									data,
								}).then(async (resp) => {
									if (resp.status === 200) {
										try {
											res = await this.$axios({
												method: 'get',
												url: "https://site202109.tw.cs.unibo.it/mongo/people?nome=" + this.UserName
											}).then(respo => {
												if (respo.status === 200) {
													localStorage.setItem("user", JSON.stringify({nome: respo.data.val.nome, img: respo.data.val.img}))
													localStorage.setItem("permesso", 1)
													window.location.href = '../Home'
												}
											})
										} catch (e) {
											if (res) { res = null }
										}
									}
								})
							} catch (e) {
								if (res) { res = null }
							}
						})
					}
				}
			}
		},

		back() {
			window.location.href = '../'
		},
	}
}
