import { Typography } from 'antd';
import AppWrapper from 'components/Wrapper/AppWrapper';
import MotionWrap from 'components/Wrapper/MotionWrapper';
import { useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { translate } from 'shared/internationalization/translate';

// @styles
import styles from './styles.module.scss';

export const Testimonials = () => {
	/**
	 * Queries
	 */
	const testimonials = [
		{
			picture:
				'https://images.pexels.com/photos/3270224/pexels-photo-3270224.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
			company: 'Mamá de Isa',
			feedback:
				'Super  agradecida contigo por habernos ayudado con las terapias de Isabella, ya Isa habla muy bien! Y de verdad que fue un cambio radical con tus terapias. Gracias por el compromiso, la paciencia y el cariño con el que haces tu trabajo! Que sigas creciendo profesionalmente! Un abrazo!',
			name: 'Gabriela Riofrio',
		},
		{
			picture:
				'https://images.pexels.com/photos/325265/pexels-photo-325265.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
			company: 'Mamá de zhaky',
			feedback:
				'Gracias Hillary, 🥰 en verdad apreciamos tu cariño y dedicación en este tiempo con Zhaky.',
			name: 'Kim decena',
		},
	];

	/**
	 * State
	 */
	const [currentIndex, setCurrentIndex] = useState(0);

	/**
	 * handlers
	 */
	const handleClick = (index: number) => {
		setCurrentIndex(index);
	};
	return (
		<AppWrapper idName='testimonials' background='regular'>
			<MotionWrap className={`${styles.testimonials}`}>
				<Typography.Title className={styles.title}>{`${translate(
					'testimonials_title'
				)}`}</Typography.Title>
				<Typography.Title className={styles.subtitle}>{`${translate(
					'testimonials_subtile'
				)}`}</Typography.Title>
				<div className={styles.layout}>
					{testimonials.length && (
						<>
							<div className={styles.item}>
								<img
									src={testimonials[currentIndex].picture}
									alt={testimonials[currentIndex].name}
								/>
								<div className={styles.content}>
									<p className='p-text'>{testimonials[currentIndex].feedback}</p>
									<div>
										<h4 className='bold-text'>{testimonials[currentIndex].name}</h4>
										<h5 className='p-text'>{testimonials[currentIndex].company}</h5>
									</div>
								</div>
							</div>

							<div className={styles.btns}>
								<div
									className='flex'
									onClick={() =>
										handleClick(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1)
									}
								>
									<HiChevronLeft />
								</div>

								<div
									className='flex'
									onClick={() =>
										handleClick(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1)
									}
								>
									<HiChevronRight />
								</div>
							</div>
						</>
					)}
				</div>
			</MotionWrap>
		</AppWrapper>
	);
};
