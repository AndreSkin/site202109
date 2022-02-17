export default {
	layout: 'empty',
	data() {
		return {
			permessi: JSON.parse(localStorage.getItem("permesso")),
			data: JSON.parse(localStorage.getItem(window.location.href.slice(window.location.href.indexOf('#') + 1))),
			user: JSON.parse(localStorage.getItem("user")),
			modifica: JSON.parse(localStorage.getItem("modifica")),
			noleggio: JSON.parse(localStorage.getItem("noleggio")),
			show: JSON.parse(localStorage.getItem("show")),
			selectPay: "",
			pay: [
				"Visa",
				"Paypal",
				"Mastercard",
				"Amex"
			],
			selectConcluso: "",
			concluso: [
				"Da iniziare",
				"In corso",
				"Nel passato",
				"Da confermare",
				"Concluso"
			],
			holy: [],
			cliente: [],
			NomeCliente: "",
			valid: false,
			today: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
			warn: 1,
			alert: {
				message: "",
				show: false,
				type: ""
			},
			pick: [],
			fattura: [
				{desc: "Prezzo al giorno", val: 100},
				{desc: "Quant. giorni non festivi", val: ""},
				{desc: "TOT", val: ""},
				{desc: "Quant. giorni festivi", val: ""},
				{desc: "Sconto festività in %", val: "10"},
				{desc: "TOT", val: ""},
				{desc: "Quant. Weekend", val: ""},
				{desc: "Sconto dal 3° Weekend in %", val: 2},
				{desc: "TOT", val: ""},
				{desc: "Sconto fedeltà in %", val: 0},
				{desc: "TOT", val: ""},
				{desc: "1° Noleggio", val: true},
				{desc: "Sconto 1° Noleggio in %", val: 10},
				{desc: "TOT", val: ""},
				{desc: "Quantita di noleggi fatti", val: 0},
				{desc: "Sconto ogni 5° noleggio in %", val: 10},
				{desc: "TOT", val: ""}
			]
		}
	},
	watch: {
		pick() {
			this.warn = 1
		}
	},
	beforeMount() {
		if (this.permessi === 1 && !this.show) {
			this.getCliente(this.user.nome)
		}
		if (this.modifica || this.show) {
			this.fattura = this.noleggio.fattura
			this.pick[0] = this.noleggio.inizio
			this.pick[1] = this.noleggio.fine
			this.selectPay = this.noleggio.payment
		}
		this.holyday()
	},
	mounted() {
		if (this.modifica || this.show) {
			this.$nuxt.$emit("day", this.pick)
			this.fattura = this.noleggio.fattura
		}
	},
	created() {
		this.$nuxt.$on("date", this.onPiker)
		this.$nuxt.$on("clear", this.clear)
		this.fattura[0].val = this.data.costo_base
	},
	methods: {
		async holyday() {
			await this.$axios({
				method: "get",
				url: "https://site202109.tw.cs.unibo.it/feste"
			}).then((res) => {
				if (res.status === 200) {
					this.holy = res.data
				}
			})
		},
		back() {
			if (this.modifica || this.show) {
				localStorage.removeItem(this.data._id)
			}
			localStorage.removeItem("modifica")
			localStorage.removeItem("noleggio")
			localStorage.removeItem("show")
			this.$router.back()
		},
		onPiker(daterange) {
			if (!daterange.length) {
				this.clear()
			} else {
				this.pick = daterange
				this.fattura[1].val = daterange.length === 1 ? 1 : (Math.ceil(Math.abs(new Date(this.pick[0]) - new Date(this.pick[1])) / (1000 * 60 * 60 * 24)) + 1) - (this.holy.filter(val => val >= this.pick[0] && val <= this.pick[1]).length)
				this.fattura[2].val = this.fattura[0].val * this.fattura[1].val
				this.fattura[3].val = this.holy.filter(val => val >= this.pick[0] && val <= this.pick[1]).length
				this.fattura[5].val = this.fattura[2].val
				for (let i = 0; i < this.fattura[3].val; i++) {
					this.fattura[5].val = this.fattura[5].val + (this.fattura[0].val - (((this.fattura[0].val / 100) * this.fattura[4].val)))
				}
				this.Weekend()
				this.fattura[8].val = this.fattura[5].val
				for (let i = 3; i <= this.fattura[6].val; i++) {
					this.fattura[8].val = this.fattura[5].val - ((this.fattura[5].val / 100) * this.fattura[4].val).toFixed(2)
				}
				this.fattura[10].val = this.fattura[8].val - ((this.fattura[8].val / 100) * this.fattura[9].val).toFixed(2)
				this.fattura[13].val = this.fattura[10].val - ((this.fattura[11].val) ? ((this.fattura[10].val / 100 * this.fattura[12].val).toFixed(2)) : 0)
				this.fattura[16].val = this.fattura[13].val - (((this.fattura[14].val % 5) === 0 && this.fattura[14].val !== 0) ? ((this.fattura[13].val / 100 * this.fattura[15].val).toFixed(2)) : 0)
			}
		},
		Weekend() {
			const start = new Date(this.pick[0]).getDay()
			const end = new Date(this.pick[1]).getDay()
			if (end > start && this.fattura[1].val === (end - start + 1)) {
				this.fattura[6].val = 0
			} else {
				this.fattura[6].val = 1 + Math.floor((this.fattura[1].val - (6 - start + 1)) / 7)
			}
		},
		clear() {
			this.pick = []
			this.fattura[1].val = ""
			this.fattura[2].val = ""
			this.fattura[3].val = ""
			this.fattura[5].val = ""
			this.fattura[6].val = ""
			this.fattura[8].val = ""
			this.fattura[10].val = ""
			this.fattura[13].val = ""
			this.fattura[16].val = ""
		},
		async put(nome) {
			await this.$axios({
				method: 'put',
				url: "https://site202109.tw.cs.unibo.it/mongo/putpending?type=ins",
				data: {
					ToChange: this.cliente.nome || nome,
					pending: {
						"office_id": this.data.nome,
						"inizio": this.pick[0],
						"fine": this.pick[1] || this.pick[0],
						"pagamento": this.fattura[16].val,
						"fattura": this.fattura,
						"payment": this.selectPay,
						"danno": 0,
						"concluso": (this.selectConcluso) || (this.today > this.pick[0] ? "Nel passato" : (this.NomeCliente === "" && this.today === this.pick[0]) ? "In corso" : "Da iniziare"),
						"funzionario": this.NomeCliente === "" ? "" : this.user.nome
					}
				}
			}).then(res => {
				if (res.status === 200) {
					localStorage.removeItem(this.data._id)
					localStorage.removeItem("modifica")
					localStorage.removeItem("show")
					localStorage.removeItem("noleggio")
					window.location.href = "../Home"
				}
			})
		},
		async getCliente(nome) {
			try {
				await this.$axios({
					method: "get",
					url: "https://site202109.tw.cs.unibo.it/mongo/people?nome=" + nome
				}).then((res) => {
					if (res.status === 200) {
						this.cliente = res.data.val
						if (!this.modifica && !this.show) {
							this.fattura[9].val = this.cliente.tier_cliente * 2
							this.fattura[11].val = !this.cliente.storico_noleggi.length
							this.fattura[14].val = this.cliente.storico_noleggi.length
						}
						this.valid = true
						if (this.permessi > 1) {
							this.alert.message = "Cliente esistente"
							this.alert.type = "success"
							this.alert.show = true
						}
					}
				})
			} catch (e) {
				this.alert.message = "Cliente non esistente"
				this.alert.type = "warning"
				this.alert.show = true
			}
		},
		async modifiche() {
			await this.$axios({
				method: 'put',
				url: "https://site202109.tw.cs.unibo.it/mongo/putnoleggi?type=front",
				headers: {},
				data: {
					office: this.noleggio.office_id,
					or_inizio: this.noleggio.inizio,
					or_fine: this.noleggio.fine,
					nome: this.cliente.nome,
					inizio: this.pick[0],
					fine: this.pick[1],
					fattura: this.fattura,
					payment: this.selectPay,
					costo: this.fattura[16].val
				}
			}).then(res => {
				if (res.status === 200) {
					localStorage.removeItem(this.data._id)
					localStorage.removeItem("modifica")
					localStorage.removeItem("show")
					localStorage.removeItem("noleggio")
					window.location.href = "../User"
				}
			})
		},
		async fine() {
			if (!this.permessi) {
				this.alert.message = "Registrati prima di proseguire"
				this.alert.type = "warning"
				this.alert.show = true
			} else if (!this.pick.length) {
				this.alert.message = "Scegliere le date"
				this.alert.type = "warning"
				this.alert.show = true
			} else if (this.pick[0] < this.today && this.warn) {
				this.alert.message = "Scelta una data antecedente ad oggi, premere nuovamante per confermare"
				this.alert.type = "warning"
				this.alert.show = true
				this.warn--
			} else if (this.permessi >= 2) {
				if (!this.valid) {
					this.alert.message = "Inserire il nome del cliente"
					this.alert.type = "warning"
					this.alert.show = true
				} else {
					await this.put(this.NomeCliente)
				}
			} else {
				await this.put(this.cliente.nome)
			}
		},
	}
}
