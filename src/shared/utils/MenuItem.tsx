import { MenuProps } from 'antd';
import { Key, MouseEvent, ReactNode } from 'react';

export type MenuItem = Required<MenuProps>['items'][number];

interface ItemProps {
  label: ReactNode;
  key: Key;
  icon?: ReactNode;
  children?: MenuItem[] | ReactNode;
  onClick?: (event?: MouseEvent<HTMLButtonElement>) => any;
  className?: string;
  expandIcon?: boolean | ReactNode;
  disabled?: boolean;
}

export const getItem = ({
  key,
  icon,
  children,
  label,
  onClick,
  className,
  expandIcon,
  disabled,
}: ItemProps): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
    onClick,
    className,
    expandIcon,
    disabled,
  } as MenuItem;
};
