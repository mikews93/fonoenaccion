import { Layout } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import { GeneralLoading } from 'components/GeneralLoading/GeneralLoading';

// @components
import { NavbarHeader } from 'components/NavbarHeader/NavbarHeader';
import NotFound from 'components/NotFound/NotFound';
import AppWrapper from 'components/Wrapper/AppWrapper';
import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// @utils
import { translate } from 'shared/internationalization/translate';
import { generateSlug } from 'shared/utils/Strings';

// @constants
import { PUBLIC_ROUTES } from 'shared/routes';

// @styles
import styles from './styles.module.scss';
import { getLazyContainer } from 'shared/utils/Containers';

const Public = () => {
	const routes = Object.entries(PUBLIC_ROUTES);

	return (
		<Layout className={styles.public}>
			<Header>
				<NavbarHeader />
			</Header>
			<Content className={styles.content}>
				<ErrorBoundary>
					<Suspense fallback={<GeneralLoading />}>
						<Routes>
							{routes.map(([_, value]) => (
								<Route
									element={
										<AppWrapper>{getLazyContainer<PUBLIC_ROUTES>(value, routes)}</AppWrapper>
									}
									key={generateSlug()}
									path={value}
								/>
							))}
							<Route path='/' element={<Navigate to={PUBLIC_ROUTES.START} />} />
							<Route path='*' element={<NotFound />} />
						</Routes>
					</Suspense>
				</ErrorBoundary>
			</Content>
			<Footer>
				<div className='flex-column center'>
					<p className='p-text'>@{new Date().getFullYear()} Fonoenacción</p>
					<p className='p-text'>{`${translate('all_rights_reserved')}`}</p>
				</div>
			</Footer>
		</Layout>
	);
};

export default Public;
