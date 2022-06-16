import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

// @components
import AppWrapper from 'components/Wrapper/AppWrapper';
import MotionWrap from 'components/Wrapper/MotionWrapper';

// @styles
import styles from './styles.module.scss';

// @utils
import { urlFor } from 'shared/sanity/client';

// @hooks
import { useRequest } from 'shared/hooks/useRequest';

type TestimonialType = {
	imageurl: string;
	feedback: string;
	name: string;
	company: string;
};

type BrandType = {
	_id: string;
	name: string;
	imgUrl: string;
};

const Testimonials = () => {
	/**
	 * Queries
	 */
	const [testimonials] = useRequest<TestimonialType[]>({
		path: '*[_type == "testimonials"]',
		options: { isSanity: true },
	});
	const [brands] = useRequest<BrandType[]>({
		path: '*[_type == "brands"]',
		options: { isSanity: true },
	});

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
		<AppWrapper idName='testimonials' classNames='primarybg'>
			<MotionWrap classNames={styles.testimonials}>
				<>
					{testimonials.length && (
						<>
							<div className={styles.item}>
								<img
									src={urlFor(testimonials[currentIndex].imageurl)}
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

					<div className={styles.brands}>
						{brands.map((brand) => (
							<motion.div
								whileInView={{ opacity: [0, 1] }}
								transition={{ duration: 0.5, type: 'tween' }}
								key={brand._id}
							>
								<img src={urlFor(brand.imgUrl)} alt={brand.name} />
							</motion.div>
						))}
					</div>
				</>
			</MotionWrap>
		</AppWrapper>
	);
};

export default Testimonials;
