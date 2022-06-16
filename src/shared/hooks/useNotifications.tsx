/* eslint-disable no-unused-vars */
import { notification } from 'antd';

export enum NotificationTypes {
	success = 'success',
	error = 'error',
	warning = 'warning',
	info = 'info',
}

type useNotificationReturnType = {
	[key: string]: (title: string, message: string) => void;
};

/**
 * @function useNotification
 * @description hook to manage notifications
 * @returns different types of notifications
 */
export const useNotifications = (): useNotificationReturnType =>
	Object.values(NotificationTypes).reduce((acc, type) => {
		const notificationName: string = `${type}Notification`;
		acc[notificationName] = (title: string, message: string) => {
			return notification[type]({
				message: title,
				description: message,
			});
		};
		return acc;
	}, {} as { [key: string]: (title: string, message: string) => void });
