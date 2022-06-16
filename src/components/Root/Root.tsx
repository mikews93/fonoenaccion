import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SWRConfig } from 'swr';

// @components
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import { Home } from 'containers/Home/Home';
import { NotFound } from 'components/NotFound/NotFound';

// @providers
import { SharedDataProvider } from 'shared/context/sharedDataProvider';

// @api
import { SWR_CONFIG } from 'shared/api/api';

// @routes
import { ROUTES } from 'shared/routes';

export const Root = () => {
	return (
		<ErrorBoundary>
			<SharedDataProvider>
				<SWRConfig value={SWR_CONFIG}>
					<BrowserRouter>
						<Routes>
							<Route path={ROUTES.HOME} element={<Home />} />
							<Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
						</Routes>
					</BrowserRouter>
				</SWRConfig>
			</SharedDataProvider>
		</ErrorBoundary>
	);
};
