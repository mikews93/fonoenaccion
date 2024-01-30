import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

// @components
import { Root } from 'components/Root/Root';

// @styles
import './styles/main.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Root />
	</StrictMode>
);
