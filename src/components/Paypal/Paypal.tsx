export const Paypal = () => {
	return (
		<form action='https://www.paypal.com/cgi-bin/webscr' method='post' target='_top'>
			<input type='hidden' name='cmd' value='_s-xclick' />
			<input type='hidden' name='hosted_button_id' value='UBQLXSYDLGHYE' />
			<input type='hidden' name='currency_code' value='USD' />
			<input
				type='image'
				src='https://www.paypalobjects.com/es_XC/i/btn/btn_buynowCC_LG.gif'
				border='0'
				name='submit'
				title='PayPal - The safer, easier way to pay online!'
				alt='Buy Now'
			/>
		</form>
	);
};
