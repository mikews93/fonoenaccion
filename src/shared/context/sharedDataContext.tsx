// @vendors
import { createContext, Dispatch, SetStateAction } from 'react';
import { SHARED_DATA_INITIAL_STATE } from './constants';
import { ProviderConfig } from 'launchdarkly-react-client-sdk';

// @constants
import { SPIEL_JOB_TYPE, SPIEL_MESSAGES } from 'shared/constants';

// @types
import { UserType } from 'shared/types/userType';
import { ProjectType } from 'shared/types/projectType';
import { ClientType } from 'shared/types/clientType';
import { Theme } from 'shared/types/theme';

export interface SharedDataType {
	theme?: Partial<Theme>;
	searchText?: string;
	settings: {
		apiUrl?: string;
		legacyApiUrl?: string;
		previewerUrl?: string;
		videateVideoUrl?: string;
		downloadPlaylistUrl?: string;
		watchPlaylistUrl?: string;
		socketUrl?: string;
		launchDarklyId: string;
		enableSocket?: boolean;
		classicConsoleUrl?: string;
		switchCookieDomain?: string;
		mapsApiKey?: string;
	};
	clientSettings: {
		hasWistiaConfig?: boolean;
	};
	featureFlags?: ProviderConfig['flags'];
	user: {
		info?: UserType;
		isFetching: boolean;
		isAuthenticated: boolean;
	};
	selectedClient?: ClientType['id'];
	selectedProject?: ProjectType;
	mutationPercentage?: number;
	isSidebarCollapsed?: boolean;
	isMobileView?: boolean;
	spiel?: {
		decorations?: any;
		status?: SPIEL_MESSAGES;
		currentJob?: {
			id: string;
			type: SPIEL_JOB_TYPE;
		};
	};
}

export interface SharedDataContextType extends SharedDataType {
	setSharedData: Dispatch<SetStateAction<SharedDataType>>;
}

const initialState: SharedDataContextType = {
	setSharedData: () => {},
	...SHARED_DATA_INITIAL_STATE,
};

// @context
export const SharedDataContext = createContext(initialState);
