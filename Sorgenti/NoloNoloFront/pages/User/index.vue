<template>
	<v-container style="padding: 1% 10% 2% 10%; height:100%">
		<v-row class="justify-start" dense>
			<v-col cols="12">
				<v-btn
					icon
					@click="goHome"
					aria-label="go back"
				>
					<v-icon> mdi-chevron-left </v-icon>
				</v-btn>
			</v-col>
		</v-row>
		<v-row style="height:100%">
			<v-card style="height:100%; width:100%">
				<v-toolbar
					flat
					dark
				>
					<v-toolbar-title>User Profile</v-toolbar-title>
				</v-toolbar>
				<v-tabs>
					<v-tab>
						<v-icon>
							mdi-account
						</v-icon>
						General
					</v-tab>
					<v-tab>
						<v-icon>
							mdi-home
						</v-icon>
						I miei noleggi
					</v-tab>
					<v-tab>
						<v-icon>
							mdi-pencil
						</v-icon>
						Modifica
					</v-tab>
					<v-tab-item>
						<v-container style="margin: 20px 20px 20px 20px">
							<v-row style="margin-bottom: 20px">
								<v-col cols="4" sm="2">
									<v-avatar size="70">
										<img
											alt="user"
											:src="('https://site202109.tw.cs.unibo.it' + user.img.slice(2)) || '' "
										>
									</v-avatar>
								</v-col>
								<v-col class="d-flex align-center" cols="8" sm="10">
									<v-row>
										<p>Nome<br>{{ user.nome }}</p>
									</v-row>
								</v-col>
							</v-row>
							<v-row>
								<v-divider />
							</v-row>
							<v-row style="margin-top: 10px">
								<v-col>
									<v-row>
										<p>E-Mail<br>{{ user.mail }}</p>
									</v-row>
									<v-row>
										<p>Indirizzo di fatturazione<br>{{ user.indirizzo }}</p>
									</v-row>
								</v-col>
							</v-row>
						</v-container>
					</v-tab-item>
					<v-tab-item>
						<v-card flat>
							<v-card-text>
								<v-list dense>
									<v-list-item
										v-for="(noleggio, index) in user.storico_noleggi"
										:key="index"
										:style="active(noleggio)"
										dense
										style="border: 1px solid white"
									>
										<v-list-item-content>
											<v-col cols="8" sm="5">
												<v-row>
													<v-list-item-title>Ufficio: {{ noleggio.office_id }}</v-list-item-title>
												</v-row>
												<v-row>
													<v-list-item-subtitle>Started at: {{ noleggio.inizio }}</v-list-item-subtitle>
												</v-row>
												<v-row>
													<v-list-item-subtitle>Ended at: {{ noleggio.fine }}</v-list-item-subtitle>
												</v-row>
											</v-col>
											<v-col cols="8" sm="5">
												<v-row>
													<v-list-item-title>Stato: {{ noleggio.concluso }}</v-list-item-title>
												</v-row>
												<v-row>
													<v-list-item-subtitle>Prezzo: {{ noleggio.pagamento }}</v-list-item-subtitle>
												</v-row>
											</v-col>
											<v-col :cols="noleggio.concluso === 'Da iniziare' ? 1 : 2">
												<v-btn
													color="primary"
													small
													text
													type="submit"
													@click="modificaShow(noleggio,false)"
												>
													<v-icon>
														mdi-eye
													</v-icon>
												</v-btn>
											</v-col>
											<v-col v-show="noleggio.concluso === 'Da iniziare'" cols="1">
												<v-btn
													color="primary"
													small
													text
													type="submit"
													@click="modificaShow(noleggio,true)"
												>
													<v-icon>
														mdi-pencil
													</v-icon>
												</v-btn>
												<v-btn
													color="primary"
													small
													text
													type="submit"
													@click="eliminaNoleggio(noleggio)"
												>
													<v-icon>
														mdi-close
													</v-icon>
												</v-btn>
											</v-col>
										</v-list-item-content>
									</v-list-item>
								</v-list>
							</v-card-text>
						</v-card>
					</v-tab-item>
					<v-tab-item>
						<v-card
							flat
							style="padding: 20px 30px 0px 10px"
						>
							<v-form
								@submit.prevent="modifica"
							>
								<v-text-field
									v-model="UserName"
									class="expanding-search rounded-pill reg"
									clearable
									dense
									:placeholder="user.nome"
									label="Nuovo UserName"
									hide-details
								/>
								<v-text-field
									v-model="EMail"
									class="expanding-search rounded-pill reg"
									type="email"
									clearable
									dense
									:placeholder="user.mail"
									label="Nuova E-Mail"
									hide-details
								/>
								<v-text-field
									v-model="Indirizzo"
									class="expanding-search rounded-pill reg"
									clearable
									dense
									:placeholder="user.indirizzo"
									label="Nuovo Indirizzo di fatturazzione"
									hide-details
								/>
								<v-text-field
									v-model="Password"
									class="reg"
									:type="show ? 'text' : 'password'"
									clearable
									dense
									label=" Nuova password"
									hide-details
									:append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
									@click:append="show = !show"
								/>
								<v-text-field
									v-model="Rpassword"
									class="reg"
									:type="show ? 'text' : 'password'"
									clearable
									dense
									label="Ripeti nuova password"
									hide-details
									:append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
									@click:append="show = !show"
								/>
								<v-btn
									color="primary"
									small
									text
									type="submit"
								>
									Salva Modifiche
								</v-btn>
							</v-form>
							<v-divider />
							<div
								class="d-flex justify-end"
							>
								<v-btn
									color="primary"
									small
									text
									type="submit"
									@click="elimina"
								>
									Elimina account
								</v-btn>
							</div>
						</v-card>
					</v-tab-item>
				</v-tabs>
			</v-card>
		</v-row>
		<v-dialog v-model="alert.show" transition="dialog-top-transition" width="auto">
			<v-alert class="ma-0" :type="alert.type">{{ alert.message }}</v-alert>
		</v-dialog>
	</v-container>
</template>

<script src="./index.js"/>

<style>
	.reg{
		margin-bottom: 20px;
	}
	.v-slide-group__prev {
		position: absolute;
	}
</style>
