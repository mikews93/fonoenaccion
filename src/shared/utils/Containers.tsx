import { capitalize } from 'lodash';
import { createElement, lazy } from 'react';

/**
 * ROUTES TO CONTAINER:
 * @param containerName
 * @returns promise with lazy container
 */
export const getLazyContainer = <T extends string>(
	containerName: T,
	routes: [string, T][],
	separator: string = '_'
): JSX.Element => {
	type ContainerObject = { [key in T]: JSX.Element };

	const containers: Partial<ContainerObject> = routes.reduce(
		(acc, [routeName, route]: [string, T]) => {
			const moduleName = routeName
				.split(separator)
				.map((route) => capitalize(route))
				.join('');

			const lazyImport = lazy(() => {
				return import(`../../containers/${moduleName}/${moduleName}.tsx`);
			});
			return { ...acc, [route]: createElement(lazyImport) };
		},
		{}
	);

	return containers[containerName] || <></>;
};
