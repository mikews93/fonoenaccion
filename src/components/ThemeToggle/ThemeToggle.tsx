// @components
import { ConfigItem } from 'components/ConfigItem/ConfigItem';
import { SELECTED_THEME } from 'shared/constants';
import { Switch } from 'components/Switch/Switch';

// @hooks
import { useSharedDataContext } from 'shared/context/useSharedData';
import { THEMES } from 'shared/types/theme';
import { setLocalStorage } from 'shared/utils/LocalStorage';

export default function ThemeToggle() {
  /**
   * hooks
   */
  const [sharedData, setSharedData] = useSharedDataContext();

  const handleChangeDarkMode = (checked: boolean) => {
    const selectedTheme = checked ? THEMES.DARK : THEMES.LIGHT;
    setSharedData({ ...sharedData, theme: { ...sharedData.theme, name: selectedTheme } });
    setLocalStorage({ key: SELECTED_THEME, value: selectedTheme });
  };

  return (
    <ConfigItem
      title='Dark Mode'
      subTitle='Experimental implementation'
      extra={
        <Switch
          inverted
          checkedProps={{
            switchHandleIcon: '🔆',
          }}
          unCheckedProps={{
            switchHandleIcon: '🌙',
          }}
          checked={sharedData.theme?.name === THEMES.DARK}
          onChange={handleChangeDarkMode}
        />
      }
    />
  );
}
