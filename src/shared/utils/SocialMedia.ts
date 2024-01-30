/**
 * Creates a link to start a conversation with the specified number via whatsapp
 * @param phone number to contact
 * @returns string
 */
export const getWhatsappMessageMeURL = (
	phone: string = '573244071940',
	message: string = 'Hola! me topé con tu pagina web y me interesan tus servicios'
) => {
	const url = new URL('send', 'https://api.whatsapp.com');
	url.searchParams.append('phone', phone);
	url.searchParams.append('text', message);

	return url.toString();
};
