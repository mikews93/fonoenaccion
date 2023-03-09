import { Button, notification, Space } from 'antd';
import { ArgsProps } from 'antd/es/message';
import { createElement, ReactNode } from 'react';
import { log } from 'shared/utils/Log';

export enum NotificationTypes {
	success = 'success',
	error = 'error',
	warning = 'warning',
	info = 'info',
}

export enum DURATION_TYPES {
	NOT_AUTOMATICALLY_CLOSABLE = 0,
	DEFAULT_DURATION = 4,
}

export enum NotificationFunctionTypes {
	success = 'successNotification',
	error = 'errorNotification',
	warning = 'warningNotification',
	info = 'infoNotification',
}

export type Options = {
	error?: any;
	action?: {
		name?: string;
		icon?: ReactNode;
		onClick: () => void;
	};
};

export type useNotificationType = {
	[key in NotificationFunctionTypes]: (title: string, message: ReactNode, Options?: Options) => any;
};

notification.config({
	maxCount: 3,
});

/**
 * @function useNotifications
 * @description hook to manage notifications
 * @returns the different types of notifications
 */

export const useNotifications = (): useNotificationType =>
	Object.values(NotificationTypes).reduce((acc, type) => {
		const notificationName: NotificationFunctionTypes = NotificationFunctionTypes[type];
		acc[notificationName] = (
			title: string,
			message: ReactNode,
			{ error, action }: Options = {}
		) => {
			const durationType: ArgsProps['duration'] =
				error || action
					? DURATION_TYPES.NOT_AUTOMATICALLY_CLOSABLE
					: DURATION_TYPES.DEFAULT_DURATION;

			if (error) {
				log.error(error);
			}

			if (action) {
				message = createElement(Space, {
					className: 'space-between',
					children: (
						<>
							{message}
							<Button type='primary' onClick={action.onClick} icon={action.icon} shape='round'>
								{action.name}
							</Button>
						</>
					),
				});
			}

			return notification[type]({
				description: message,
				duration: durationType,
				message: (
					<span style={{ color: 'var(--fna-colorTextHeading)', fontWeight: 700 }}>{title}</span>
				),
				style: {
					backgroundColor: 'var(--fna-colorBgSpotlight)',
					fontFamily: 'var(--fna-fontFamily)',
					color: 'var(--fna-colorText)',
				},
			});
		};
		return acc;
	}, {} as { [key in NotificationFunctionTypes]: (title: string, message: ReactNode, Options?: Options) => void });
