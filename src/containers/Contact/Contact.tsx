import { ChangeEvent, useState } from 'react';

// @components
import AppWrapper from 'components/Wrapper/AppWrapper';
import MotionWrap from 'components/Wrapper/MotionWrapper';

// @styles
import styles from './styles.module.scss';

// @utils
import { client } from 'shared/sanity/client';
import { translate } from 'shared/internationalization/translate';

type FormData = {
	name: string;
	email: string;
	message: string;
};

const Contact = () => {
	/**
	 * State
	 */
	const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
	const [isFormSubmitted, setIsFormSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);

	const { name, email, message } = formData;

	/**
	 * Handlers
	 */
	const handleChangeInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = () => {
		setLoading(true);

		const contact = {
			_type: 'contact',
			name: formData.name,
			email: formData.email,
			message: formData.message,
		};

		client
			.create(contact)
			.then(() => {
				setLoading(false);
				setIsFormSubmitted(true);
			})
			.catch((err) => console.log(err));
	};

	return (
		<AppWrapper idName='contact' classNames='whitebg'>
			<MotionWrap classNames={styles.contact}>
				<>
					<h2 className='head-text'>
						{`${translate('take_a_coffee')}`} & {`${translate('chat_with_me')}`}
					</h2>

					<div className={styles.cards}>
						<div className={styles.card}>
							<img src='/assets/email.png' alt='email' />
							<a
								href='mailto:&#109;&#97;&#105;&#108;&#116;&#111;&#58;&#109;&#98;&#116;&#101;&#99;&#104;&#111;&#114;&#103;&#64;&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;'
								className='p-text'
							>
								{`${translate('email_me')}`}
							</a>
						</div>
						<div className={styles.card}>
							<img src='/assets/mobile.png' alt='phone' />
							<a href='tel:+57 (300) 732-3102' className='p-text'>
								+57 (300) 732-3102
							</a>
						</div>
					</div>
					{!isFormSubmitted ? (
						<div className={styles.form}>
							<div className='flex'>
								<input
									className='p-text'
									type='text'
									placeholder={`${translate('your')} ${translate('name')}`}
									name='name'
									value={name}
									onChange={handleChangeInput}
								/>
							</div>
							<div className='flex'>
								<input
									className='p-text'
									type='email'
									placeholder={`${translate('your')} ${translate('email')}`}
									name='email'
									value={email}
									onChange={handleChangeInput}
								/>
							</div>
							<div>
								<textarea
									className='p-text'
									placeholder={`${translate('your')} ${translate('message')}`}
									value={message}
									name='message'
									onChange={handleChangeInput}
								/>
							</div>
							<button type='button' className='p-text' onClick={handleSubmit}>
								{!loading
									? `${translate('send')} ${translate('message')}`
									: `${translate('sending')}`}
							</button>
						</div>
					) : (
						<div>
							<h3 className='head-text'>{`${translate('thanks_for_contacting')}`}</h3>
						</div>
					)}
				</>
			</MotionWrap>
		</AppWrapper>
	);
};

export default Contact;
