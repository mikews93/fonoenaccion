import { FC, ReactNode, useCallback, useEffect } from 'react';
import { Theme, THEMES } from 'shared/types/theme';
import { ConfigProvider, theme } from 'antd';
import enUS from 'antd/locale/en_US';
import esES from 'antd/locale/es_ES';

// @hooks
import { useSharedDataContext } from './useSharedData';

// @styles
import darkTheme from '../themes/dark.module.scss';
import lightTheme from '../themes/light.module.scss';
import { currentLanguage } from 'shared/internationalization/translate';
import { ConfigProviderProps } from 'antd/es/config-provider';

interface ThemeProviderProps {
	children: ReactNode;
}

const themeMapper = {
	[THEMES.DARK]: darkTheme as Partial<Theme>,
	[THEMES.LIGHT]: lightTheme as Partial<Theme>,
};

const localeMapper: { [key: string]: ConfigProviderProps['locale'] } = {
	en: enUS,
	es: esES,
};

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
	/**
	 * hooks
	 */
	const [{ theme }, setSharedData] = useSharedDataContext();

	/**
	 * Callbacks
	 */
	const getThemeProps = useCallback(() => {
		const themeName = theme?.name || THEMES.LIGHT;
		return { ...themeMapper[themeName], name: themeName };
	}, [theme?.name]);

	/**
	 * effects
	 */
	useEffect(() => {
		if (theme) {
			const newTheme = getThemeProps();
			Object.entries(newTheme).forEach(([prop, value]) => {
				if (value) {
					document.documentElement.style.setProperty(`--fna-${prop}`, value.toString());
				}
			});
			setSharedData((prev) => ({ ...prev, theme: newTheme }));
		}
	}, [theme?.name]);

	return (
		<ConfigProvider theme={{ token: theme }} locale={localeMapper[currentLanguage] || enUS}>
			{children}
		</ConfigProvider>
	);
};
