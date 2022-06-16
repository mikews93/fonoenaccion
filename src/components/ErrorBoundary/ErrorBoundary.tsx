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
		const handleReload = () => window.location.reload();

		if (this.state.hasError) {
			return (
				<Result
					status='500'
					title='There was an error on this page.'
					subTitle='Sorry, something went wrong.'
					extra={
						<Button type='primary' shape='round' onClick={handleReload}>
							Reload
						</Button>
					}
				/>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
