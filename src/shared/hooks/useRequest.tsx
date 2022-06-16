import useSwr from 'swr';

// @api
import { getFetcher } from 'shared/api/api';

type UseRequestReturn<T> = [
	T,
	{
		isLoading: boolean;
		error: any;
		mutate: (data: T) => void;
	}
];

type UseRequestOptions = {
	path: string;
	name?: string;
	options?: any;
};

export const useRequest = <T,>({ path, name, options }: UseRequestOptions): UseRequestReturn<T> => {
	if (!path && !options.isSanity) {
		throw new Error('Path is required');
	}

	const url = name ? `${path}/${name}` : path;
	const { data, error, isValidating, mutate } = useSwr(url, getFetcher(options));

	return [data, { mutate, error, isLoading: (!data && !error) || isValidating }];
};
