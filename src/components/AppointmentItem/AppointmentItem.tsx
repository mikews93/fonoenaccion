import classNames from 'classnames';
import { cloneElement, FC, ReactElement, ReactNode } from 'react';
import { translate } from 'shared/internationalization/translate';

// @styles
import styles from './styles.module.scss';

interface AppointmentItemProps {
	icon: ReactNode;
	type?: 'primary' | 'secondary';
	name?: string;
	value?: string;
	children?: ReactElement;
	onChange?: (...args: any) => any;
}

export const AppointmentItem: FC<AppointmentItemProps> = ({
	icon,
	type = 'primary',
	name = '',
	value,
	children,
	onChange,
}) => {
	return (
		<div className={styles.appointmentItem}>
			<div className={classNames(styles.iconsLayout, styles[type])}>{icon}</div>
			<div className={styles.appointmentItemLayout}>
				<span className={styles.name}>{`${translate(name)}`}</span>
				<span className={styles.value}>
					{children
						? cloneElement(children, { value, onChange, className: styles.appointmentInput })
						: value}
				</span>
			</div>
		</div>
	);
};
