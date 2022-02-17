export default {
	data() {
		return {
			data: JSON.parse(localStorage.getItem(window.location.href.slice(window.location.href.indexOf('#') + 1))),
			permessi: JSON.parse(localStorage.getItem("permesso"))
		}
	},
	methods: {
		toHome() {
			localStorage.removeItem(this.data._id)
			window.location.href = '/Home'
		},
		goPay() {
			localStorage.setItem("modifica", false)
			localStorage.setItem("show", false)
			localStorage.setItem("noleggio", JSON.stringify({"inizio": null, "fine": null}))
			window.location.href = '/Pay/#' + this.data._id
		}
	}
}
