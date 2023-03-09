import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionWrapperProps {
	children: ReactNode;
	className?: string;
}

const MotionWrap = ({ children, className }: MotionWrapperProps) => (
	<motion.div
		whileInView={{ y: [100, 50, 0], opacity: [0, 0, 1] }}
		transition={{ duration: 0.5 }}
		className={`${className || ''} flex`}
	>
		{children}
	</motion.div>
);

export default MotionWrap;
