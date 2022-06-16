// @vendors
import { Navigate, useLocation } from 'react-router-dom';

// @utils
import { isUserAuthenticated } from 'shared/utils/Auth';

// @constants
import { ROUTES } from 'shared/routes';

interface RestrictedRoutesProps {
	children: JSX.Element;
}

export const RestrictedRoutes = ({ children }: RestrictedRoutesProps) => {
	const location = useLocation();
	return isUserAuthenticated() ? (
		children
	) : (
		<Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
	);
};
