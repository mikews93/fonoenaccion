import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { lazy, Suspense } from 'react';
import { SWRConfig } from 'swr';

// @components
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import { RestrictedRoutes } from 'components/RestrictedRoute/RestrictedRoute';
import { AppLoading } from 'components/AppLoading/AppLoading';

// @providers
import { SharedDataProvider } from 'shared/context/sharedDataProvider';

// @api
import { SWR_CONFIG } from 'shared/api/api';

// @routes
import { ROUTES } from 'shared/routes';

const Login = lazy(() => import('containers/Login/Login'));
const Home = lazy(() => import('containers/Home/Home'));
const Public = lazy(() => import('containers/Public/Public'));
const NotFound = lazy(() => import('components/NotFound/NotFound'));

export const Root = () => {
	return (
		<ErrorBoundary>
			<CookiesProvider>
				<SharedDataProvider>
					<SWRConfig value={SWR_CONFIG}>
						<Suspense fallback={<AppLoading />}>
							<BrowserRouter>
								<Routes>
									<Route
										path={`${ROUTES.HOME}*`}
										element={
											<RestrictedRoutes>
												<Home />
											</RestrictedRoutes>
										}
									/>
									<Route path={ROUTES.PUBLIC} element={<Public />} />
									<Route path={ROUTES.LOGIN} element={<Login />} />
									<Route path={ROUTES.LOGOUT} element={<Navigate to={ROUTES.LOGIN} />} />
									<Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
								</Routes>
							</BrowserRouter>
						</Suspense>
					</SWRConfig>
				</SharedDataProvider>
			</CookiesProvider>
		</ErrorBoundary>
	);
};
