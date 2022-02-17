<template>
	<v-container fill-height>
		<v-row>
			<v-col align="center">
				<v-card height="100%" :width="width" style="padding:50px 50px 50px 50px">
					<v-card-title class="d-flex justify-center">Login</v-card-title>
					<v-form
						v-model="valid"
						@submit.prevent="submit"
					>
						<v-text-field
							v-model="UserName"
							class="expanding-search rounded-pill log"
							aria-label="username"
							clearable
							dense
							persistent-placeholder
							placeholder="UserName"
							required
							hide-details
							:rules="queryRules"
						/>
						<v-text-field
							v-model="password"
							class="log"
							:rules="queryRules"
							:type="show ? 'text' : 'password'"
							clearable
							dense
							persistent-placeholder
							placeholder="Password"
							required
							hide-details
							:append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
							aria-label="password"
							@click:append="show = !show"
						/>
						<v-btn
							color="primary"
							small
							text
							type="submit"
							:disabled="!valid"
						>
							Login
						</v-btn>
					</v-form>
					<v-divider />
					<v-btn
						color="primary"
						small
						text
						type="submit"
						@click="register"
					>
						Register
					</v-btn>
					<div class="text--disabled"><small>or</small></div>
					<v-btn
						color="primary"
						small
						text
						type="submit"
						@click="guest"
					>
						Guest Login
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
	.log{
		margin-bottom: 20px;
	}
</style>
