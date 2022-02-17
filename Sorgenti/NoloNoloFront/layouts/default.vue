<template>
	<v-app>
		<v-row>
			<v-col cols="12" md="2">
				<v-navigation-drawer
					v-model="drawer"
					permanent
					width="100%"
				>
					<v-img src="https://site202109.tw.cs.unibo.it/NoloNolo.png" alt="logo di NoloNoloPlus" @click="goTo('/Home')" />
					<v-divider />
					<v-list-item v-show="permesso == 3" class="px-2">
						<v-list-item-title>Manager: {{ user.nome }}</v-list-item-title>
					</v-list-item>
					<v-list-item v-show="permesso == 2" class="px-2">
						<v-list-item-title>Dipendente: {{ user.nome }}</v-list-item-title>
					</v-list-item>
					<v-list-item v-show="permesso == 1" link :to="{ path: '/User'}" class="px-2">
						<v-list-item-avatar>
							<v-img :src="'https://site202109.tw.cs.unibo.it' + user.img.slice(2)" />
						</v-list-item-avatar>
						<v-list-item-title>{{ user.nome }}</v-list-item-title>
					</v-list-item>
					<v-divider />
					<v-list dense>
						<v-list-item v-show="permesso == 3" link @click="goTo('/management/')">
							<v-list-item-icon>
								<v-icon>mdi-home-city</v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-title>Management</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
						<v-list-item v-show="permesso >= 2" link @click="goTo('/backoffice/')">
							<v-list-item-icon>
								<v-icon>mdi-account</v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-title>Back Office</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
						<v-list-item v-show="permesso == 0" link :to="{ path: '/Register'}">
							<v-list-item-icon>
								<v-icon>mdi-account-plus</v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-title>Register</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
						<v-list-item link :to="{ path: '/'}">
							<v-list-item-icon>
								<v-icon>mdi-chevron-left</v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-title>Exit/Logout</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</v-list>
				</v-navigation-drawer>
			</v-col>
			<v-col cols="12" md="10">
				<v-main>
					<Nuxt />
				</v-main>
			</v-col>
		</v-row>
	</v-app>
</template>

<script type="text/javascript">
export default {
	data () {
		return {
			drawer: true,
			user: JSON.parse(localStorage.getItem("user")),
			permesso: localStorage.getItem("permesso")
		}
	},
	methods: {
		goTo(location) {
			window.location.href = "https://site202109.tw.cs.unibo.it" + location
		}
	}
}
</script>
