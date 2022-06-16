import { motion } from 'framer-motion';

interface MotionWrapperProps {
	children: JSX.Element;
	classNames: string;
}

const MotionWrap = ({ children, classNames }: MotionWrapperProps) => (
	<motion.div
		whileInView={{ y: [100, 50, 0], opacity: [0, 0, 1] }}
		transition={{ duration: 0.5 }}
		className={`${classNames} flex`}
	>
		{children}
	</motion.div>
);

export default MotionWrap;
