import { Fragment } from 'react';
import { motion } from 'framer-motion';
import orderBy from 'lodash/orderBy';

// @components
import AppWrapper from 'components/Wrapper/AppWrapper';
import MotionWrap from 'components/Wrapper/MotionWrapper';

// @styles
import styles from './styles.module.scss';

// @utils
import { urlFor } from 'shared/sanity/client';
import { translate } from 'shared/internationalization/translate';
import { generateSlug } from 'shared/utils/Strings';

// @hooks
import { useRequest } from 'shared/hooks/useRequest';

type SkillsType = {
	name: string;
	bgColor: string;
	icon: string;
};

type ExperienceType = {
	year: string;
	works: {
		name: string;
		company: string;
		desc: string;
	}[];
};

const Skills = () => {
	/**
	 * Queries
	 */
	const [experiences] = useRequest<ExperienceType[]>({
		path: '*[_type == "experiences"]',
		options: { isSanity: true },
	});
	const [skills] = useRequest<SkillsType[]>({
		path: '*[_type == "skills"]',
		options: { isSanity: true },
	});

	return (
		<AppWrapper idName='skills' classNames='whitebg'>
			<MotionWrap classNames={styles.skills}>
				<>
					<h2 className='head-text'>
						{`${translate('skills')}`} & {`${translate('experiences')}`}
					</h2>

					<div className={styles.container}>
						<motion.div className={styles.list}>
							{skills.map((skill: SkillsType, index: number) => (
								<motion.div
									whileInView={{ opacity: [0, 1] }}
									transition={{ duration: 0.5 }}
									className={styles.item}
									key={skill.name + index}
								>
									<div className='flex' style={{ backgroundColor: skill.bgColor }}>
										<img src={urlFor(skill.icon)} alt={skill.name} />
									</div>
									<p className='p-text'>{skill.name}</p>
								</motion.div>
							))}
						</motion.div>
						<div className={styles.exp}>
							{orderBy(experiences, 'year', 'desc').map((experience) => (
								<motion.div className={styles.item} key={experience.year + generateSlug()}>
									<div className={styles.expYear}>
										<p className='bold-text'>{experience.year}</p>
									</div>
									<motion.div className={styles.expWorks}>
										{experience.works.map((work, index) => (
											<Fragment key={generateSlug()}>
												<motion.div
													whileInView={{ opacity: [0, 1] }}
													transition={{ duration: 0.5, delay: index * 0.1 }}
													className={styles.expWork}
													data-tip
													data-for={work.name}
												>
													<h4 className='bold-text'>{work.name}</h4>
													<p className='p-text'>{work.company}</p>
													<p id={work.name} className={styles.description}>
														{work.desc}
													</p>
												</motion.div>
											</Fragment>
										))}
									</motion.div>
								</motion.div>
							))}
						</div>
					</div>
				</>
			</MotionWrap>
		</AppWrapper>
	);
};

export default Skills;
