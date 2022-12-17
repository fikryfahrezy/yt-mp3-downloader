<div class="form-container">
	<div>
		<h1>Download</h1>
		<form action="/api/download">
			<input name="yturl" />
			<button type="submit">OK</button>
		</form>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
	}

	* {
		box-sizing: border-box;
	}

	.form-container {
		display: flex;
		min-height: 100vh;
	}

	.form-container > * {
		margin: auto;
	}
</style>
