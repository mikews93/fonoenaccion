import { useEffect, useState } from 'react';
import { AiFillEye, AiFillGithub } from 'react-icons/ai';
import { motion } from 'framer-motion';

// @components
import AppWrapper from 'components/Wrapper/AppWrapper';
import MotionWrap from 'components/Wrapper/MotionWrapper';

// @styles
import styles from './styles.module.scss';

// @utils
import { urlFor } from 'shared/sanity/client';
import { translate } from 'shared/internationalization/translate';

// @hooks
import { useRequest } from 'shared/hooks/useRequest';

interface WorkType {
	title: string;
	name: string;
	description: string;
	imgUrl: string;
	projectLink: string;
	codeLink: string;
	tags: string[];
}

const Work = () => {
	/**
	 * Queries
	 */
	const [works] = useRequest<WorkType[]>({
		path: '*[_type == "works"]',
		options: { isSanity: true },
	});

	const [filterWork, setFilterWork] = useState<WorkType[]>([]);
	const [filters, setFilters] = useState<string[]>([]);
	const [activeFilter, setActiveFilter] = useState('All');
	const [animateCard, setAnimateCard] = useState<any>({
		y: 0,
		opacity: 1,
	});

	useEffect(() => {
		setFilterWork(works);
		setFilters([...new Set(works.map((work: WorkType) => work.tags).flat()), 'All']);
	}, [works]);

	const handleWorkFilter = (item: string) => {
		setActiveFilter(item);
		setAnimateCard([{ y: 100, opacity: 0 }]);

		setTimeout(() => {
			setAnimateCard([{ y: 0, opacity: 1 }]);

			if (item === 'All') {
				setFilterWork(works);
			} else {
				setFilterWork(works.filter((work) => work.tags.includes(item)));
			}
		}, 500);
	};

	return (
		<AppWrapper idName='work' classNames='primarybg'>
			<MotionWrap classNames={styles.works}>
				<>
					<h2 className='head-text'>
						{`${translate('some_of_my_recent')}`} <span>{`${translate('projects')}`}</span>
					</h2>

					<div className={styles.filter}>
						{filters.map((item, index) => (
							<div
								key={index}
								onClick={() => handleWorkFilter(item)}
								className={`${styles.filterItem} p-text ${
									activeFilter === item ? styles.itemActive : ''
								}`}
							>
								{item}
							</div>
						))}
					</div>

					<motion.div
						animate={animateCard}
						transition={{ duration: 0.5, delayChildren: 0.5 }}
						className={styles.portfolio}
					>
						{filterWork.map((work, index) => (
							<div className={styles.item} key={index}>
								<div className={styles.img}>
									<img src={urlFor(work.imgUrl)} alt={work.title} />

									<motion.div
										whileHover={{ opacity: [0, 1] }}
										transition={{ duration: 0.25, ease: 'easeInOut', staggerChildren: 0.5 }}
										className={styles.hover}
									>
										<a href={work.projectLink} target='_blank' rel='noreferrer'>
											<motion.div
												whileInView={{ scale: [0, 1] }}
												whileHover={{ scale: [1, 0.9] }}
												transition={{ duration: 0.25 }}
												className='flex'
											>
												<AiFillEye />
											</motion.div>
										</a>
										<a href={work.codeLink} target='_blank' rel='noreferrer'>
											<motion.div
												whileInView={{ scale: [0, 1] }}
												whileHover={{ scale: [1, 0.9] }}
												transition={{ duration: 0.25 }}
												className='flex'
											>
												<AiFillGithub />
											</motion.div>
										</a>
									</motion.div>
								</div>

								<div className={styles.content}>
									<h4 className='bold-text'>{work.title}</h4>
									<p className='p-text' style={{ marginTop: 10 }}>
										{work.description}
									</p>

									<div className={styles.tag}>
										<p className='p-text'>{work.tags[0]}</p>
									</div>
								</div>
							</div>
						))}
					</motion.div>
				</>
			</MotionWrap>
		</AppWrapper>
	);
};

export default Work;
