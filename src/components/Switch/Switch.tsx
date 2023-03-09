import { Switch as AntSwitch, SwitchProps as AntSwitchProps } from 'antd';
import classNames from 'classnames';
import { FC, MouseEvent, useEffect, useState } from 'react';
import { useSharedDataContext } from 'shared/context/useSharedData';

// @utils
import { makeId } from 'shared/utils/Strings';

// @styles
import styles from './styles.module.scss';

interface SwitchHandleProps {
  switchHandleIcon: string;
}

interface SwitchProps extends AntSwitchProps {
  checkedProps?: Partial<SwitchHandleProps>;
  unCheckedProps?: Partial<SwitchHandleProps>;
  inverted?: boolean;
}

export const Switch: FC<SwitchProps> = ({
  checkedProps,
  unCheckedProps,
  inverted,
  checked,
  onChange,
  ...props
}) => {
  /**
   * hooks
   */
  const [{ theme }] = useSharedDataContext();

  /**
   * state
   */
  const [switchId] = useState(makeId());
  const [selected, setSelected] = useState(checked || false);

  /**
   * Callbacks
   */
  const setSwitchIcon = (checked: boolean) => {
    const switchToggle: HTMLDivElement | null = document.querySelector(`#${switchId} > div`);
    if (!switchToggle) {
      return;
    }

    const content = checked ? checkedProps?.switchHandleIcon : unCheckedProps?.switchHandleIcon;
    switchToggle.dataset.content = content || '';
  };
  const handleChange = (checked: boolean, event: MouseEvent<HTMLButtonElement>) => {
    setSelected(checked);
    onChange?.(checked, event);
  };
  /**
   * Effects
   */
  useEffect(() => {
    setSwitchIcon(selected);
  }, [selected]);

  return (
    <AntSwitch
      id={switchId}
      checked={selected}
      onChange={handleChange}
      className={classNames(styles.switch, { [styles.invertedColor]: inverted })}
      {...props}
    />
  );
};
