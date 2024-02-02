import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { lazy, Suspense } from 'react';
import { SWRConfig } from 'swr';

// @components
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import { AppLoading } from 'components/AppLoading/AppLoading';

// @providers
import { SharedDataProvider } from 'shared/context/sharedDataProvider';

// @api
import { SWR_CONFIG } from 'shared/api/api';

// @routes
import { ROUTES } from 'shared/routes';

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
									<Route path={ROUTES.PUBLIC} element={<Public />} />
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
