import { createElement, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import { capitalize } from 'lodash';
import classNames from 'classnames';

// @components
import { GlobalMutationProgress } from 'components/GlobalMutationProgress/GlobalMutationProgress';
import { GeneralLoading } from 'components/GeneralLoading/GeneralLoading';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import { AppHeader } from 'components/AppHeader/AppHeader';
import AppWrapper from 'components/Wrapper/AppWrapper';
import { Sidebar } from 'components/Sidebar/Sidebar';
import NotFound from 'components/NotFound/NotFound';

// @utils
import { generateSlug } from 'shared/utils/Strings';

// @constants
import {
	APP_ROUTES,
	HOME_ROUTES,
	ORGANIZATIONAL_ROUTES,
	PROJECT_ROUTES,
	USER_ROUTES,
} from 'shared/routes';

// @styles
import styles from './styles.module.scss';
import { useSharedDataContext } from 'shared/context/useSharedData';
import { THEMES } from 'shared/types/theme';
import { getLazyContainer } from 'shared/utils/Containers';

const { Header, Content } = Layout;

type RoutesType = APP_ROUTES | PROJECT_ROUTES | USER_ROUTES | ORGANIZATIONAL_ROUTES;

const allRoutes = Object.entries(HOME_ROUTES);

const Home = () => {
	/**
	 * Hooks
	 */
	const [{ theme }] = useSharedDataContext();

	return (
		<>
			<GlobalMutationProgress />
			<Layout className={styles.home}>
				<Sidebar />
				<Layout
					className={classNames(styles.siteLayout, { [styles.dark]: theme?.name === THEMES.DARK })}
				>
					<Header className={styles.header}>
						<AppHeader />
					</Header>
					<Content className={styles.content}>
						<ErrorBoundary>
							<Suspense fallback={<GeneralLoading />}>
								<Routes>
									{allRoutes.map(([_, value]) => (
										<Route
											element={
												<AppWrapper>{getLazyContainer<RoutesType>(value, allRoutes)}</AppWrapper>
											}
											key={generateSlug()}
											path={value}
										/>
									))}
									<Route path='/' element={<Navigate to={allRoutes[0][1]} />} />
									<Route path='*' element={<NotFound />} />
								</Routes>
							</Suspense>
						</ErrorBoundary>
					</Content>
				</Layout>
			</Layout>
		</>
	);
};

export default Home;
