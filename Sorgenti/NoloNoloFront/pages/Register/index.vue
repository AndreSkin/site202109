<template>
	<v-container fill-height>
		<v-row>
			<v-col align="center">
				<v-card heigt="30%" :width="width" style="padding:50px 50px 50px 50px">
					<v-form
						v-model="valid"
						class="form"
						@submit.prevent="submit"
					>
						<v-file-input
							id="img"
							v-model="Image"
							class="expanding-search rounded-pill reg"
							accept="image/*"
							clearable
							dense
							persistent-label
							label="Image input"
							required
							hide-details
							:rules="Rules"
						/>
						<v-text-field
							v-model="UserName"
							class="expanding-search rounded-pill reg"
							aria-label="username"
							clearable
							dense
							persistent-placeholder
							placeholder="UserName"
							required
							hide-details
							:rules="Rules"
						/>
						<v-text-field
							v-model="EMail"
							class="expanding-search rounded-pill reg"
							aria-label="email"
							clearable
							dense
							persistent-placeholder
							placeholder="E-Mail"
							required
							hide-details
							:rules="Rules"
						/>
						<v-text-field
							v-model="Password"
							class="reg"
							aria-label="password"
							:rules="Rules"
							:type="show ? 'text' : 'password'"
							clearable
							dense
							persistent-placeholder
							placeholder="Password"
							required
							hide-details
							:append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
							@click:append="show = !show"
						/>
						<v-text-field
							v-model="Rpassword"
							class="reg"
							aria-label="ripeti password"
							:rules="Rules"
							:type="show ? 'text' : 'password'"
							clearable
							dense
							persistent-placeholder
							placeholder="Ripeti password"
							required
							hide-details
							:append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
							@click:append="show = !show"
						/>
						<v-text-field
							v-model="Indirizzo"
							class="expanding-search rounded-pill reg"
							aria-label="indirizzo id fatturazzione"
							clearable
							dense
							placeholder="Indirizzo di fatturazzione"
							required
							hide-details
							:rules="Rules"
						/>
						<v-btn
							color="primary"
							small
							text
							type="submit"
							:disabled="!valid"
						>
							Register
						</v-btn>
					</v-form>
					<div class="text--disabled"><small>or</small></div>
					<v-btn
						color="primary"
						small
						text
						type="submit"
						@click="back"
					>
						Ho già un account
					</v-btn>
					<v-dialog v-model="alert.show" transition="dialog-top-transition" width="auto">
						<v-alert class="ma-0" :type="alert.type">{{ alert.message }}</v-alert>
					</v-dialog>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script src="./index.js"/>

<style>
	.reg{
		margin-bottom: 20px;
	}
</style>
