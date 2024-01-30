import { ReloadOutlined, RollbackOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
	children?: ReactNode;
}

interface State {
	hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
	};

	public static getDerivedStateFromError(_: Error): State {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Uncaught error:', error, errorInfo);
	}

	public render() {
		/**
		 * Callbacks
		 */
		const handleReload = () => window.location.reload();

		const handleGoHome = () => window.location.replace('/');

		if (this.state.hasError) {
			return (
				<Result
					className='absolute-center'
					status='500'
					title='There was an error on this page.'
					subTitle='Sorry, something went wrong.'
					extra={
						<>
							<Button type='primary' shape='round' onClick={handleReload} icon={<ReloadOutlined />}>
								Reload
							</Button>
							<Button
								type='dashed'
								shape='round'
								onClick={handleGoHome}
								icon={<RollbackOutlined />}
							>
								Go home
							</Button>
						</>
					}
				/>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
