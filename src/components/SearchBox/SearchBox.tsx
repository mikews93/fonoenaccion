import { ChangeEvent, forwardRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import Input, { InputProps, InputRef } from 'antd/es/input/Input';
import { SearchOutlined } from '@ant-design/icons';
import { toLower, startCase } from 'lodash';

// @utils
import { useCurrentPath } from 'shared/utils/Route';

// @routes
import { HOME_ROUTES } from 'shared/routes';

// @hooks
import { useSharedDataContext } from 'shared/context/useSharedData';
import { useLocation } from 'react-router-dom';

// @styles
import styles from './styles.module.scss';
import { SCREEN_SEARCH_PLACEHOLDER } from 'shared/constants';

interface SearchBoxProps extends InputProps {
  onSearch: (value?: string) => void;
  resetOnLocationChange?: boolean;
}

export const SearchBox = forwardRef<InputRef, SearchBoxProps>(
  ({ className, onSearch, resetOnLocationChange, ...props }, ref) => {
    /**
     * hooks
     */
    const location = useLocation();
    const [{ theme }] = useSharedDataContext();

    /**
     * state
     */
    const [inputValue, setInputValue] = useState<string>();

    /**
     * Effects
     */
    useEffect(() => {
      if (resetOnLocationChange) {
        setInputValue(undefined);
        onSearch(undefined);
      }
    }, [location.pathname]);

    /**
     * Callbacks
     */
    const handleChangeInput = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      onSearch(value);
      setInputValue(value);
    };

    const getCurrentPath = useCurrentPath(Object.values(HOME_ROUTES).map((path) => ({ path })));
    const pathKey = (
      Object.keys(SCREEN_SEARCH_PLACEHOLDER) as Array<keyof typeof SCREEN_SEARCH_PLACEHOLDER>
    ).find((key) => toLower(key) === toLower(getCurrentPath()));
    const pathName = pathKey ? SCREEN_SEARCH_PLACEHOLDER[pathKey] : '';

    return (
      <Input
        allowClear
        bordered={false}
        className={classNames(styles.searchBox, className)}
        onChange={handleChangeInput}
        placeholder={['Search', startCase(toLower(pathName))].join(' ')}
        prefix={<SearchOutlined />}
        ref={ref}
        size='large'
        value={inputValue}
        style={{
          backgroundColor: theme?.colorBgBase,
        }}
        {...props}
      />
    );
  }
);
