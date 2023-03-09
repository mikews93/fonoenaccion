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
			_createdAt: '2022-06-09T15:39:14Z',
			_id: 'c88a888f-70ce-4713-9f8b-e403ce1562da',
			_rev: 'oV5AkreV0DW9Fuq9c9Pl0s',
			_type: 'testimonials',
			_updatedAt: '2022-06-11T08:25:24Z',
			company: 'Fonoaudiologia en acción',
			feedback: 'El mejor de todos ',
			imageurl: {
				_type: 'image',
				asset: {
					_ref: 'image-d94df41ccad26dee17fd6145de6975529f3bc680-1092x1286-png',
					_type: 'reference',
				},
				crop: {
					_type: 'sanity.imageCrop',
					bottom: 0.2232708860759497,
					left: 0,
					right: 0,
					top: 0.0021468354430379867,
				},
				hotspot: {
					_type: 'sanity.imageHotspot',
					height: 0.7745822784810124,
					width: 0.9037974683544315,
					x: 0.5,
					y: 0.3894379746835442,
				},
			},
			name: 'Hilary Triviño',
		},
		{
			_createdAt: '2022-06-09T15:39:14Z',
			_id: 'c88a888f-70ce-4713-9f8b-e403ce1562da',
			_rev: 'oV5AkreV0DW9Fuq9c9Pl0s',
			_type: 'testimonials',
			_updatedAt: '2022-06-11T08:25:24Z',
			company: 'Fonoaudiologia en acción',
			feedback: 'El mejor de todos ',
			imageurl: {
				_type: 'image',
				asset: {
					_ref: 'image-d94df41ccad26dee17fd6145de6975529f3bc680-1092x1286-png',
					_type: 'reference',
				},
				crop: {
					_type: 'sanity.imageCrop',
					bottom: 0.2232708860759497,
					left: 0,
					right: 0,
					top: 0.0021468354430379867,
				},
				hotspot: {
					_type: 'sanity.imageHotspot',
					height: 0.7745822784810124,
					width: 0.9037974683544315,
					x: 0.5,
					y: 0.3894379746835442,
				},
			},
			name: 'Mike',
		},
	];
	// const [testimonials] = useRequest<TestimonialType[]>({
	// 	path: '*[_type == "testimonials"]',
	// 	options: { isSanity: true },
	// });

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
									src='https://cdn.sanity.io/images/8shaqiaz/production/d94df41ccad26dee17fd6145de6975529f3bc680-1092x1286.png?rect=0,3,1092,996'
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
