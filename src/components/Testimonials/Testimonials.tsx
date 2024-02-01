import { Typography } from 'antd';
import AppWrapper from 'components/Wrapper/AppWrapper';
import MotionWrap from 'components/Wrapper/MotionWrapper';
import { useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { translate } from 'shared/internationalization/translate';
import { testimonials } from './constants';

// @styles
import styles from './styles.module.scss';

export const Testimonials = () => {
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
