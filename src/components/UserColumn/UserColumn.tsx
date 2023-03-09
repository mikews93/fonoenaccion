import { InfoCircleOutlined, LockOutlined } from '@ant-design/icons';
import { Space, Tooltip, Typography } from 'antd';
import { createElement, FC, ReactNode } from 'react';
import { useSharedDataContext } from 'shared/context/useSharedData';
import { UserType } from 'shared/types/userType';

interface LockedByColumnProps {
  user: UserType;
  noUserTooltip?: string;
  tooltip?: string;
}

enum USER_TYPES {
  ME = 'me',
  OTHER = 'other',
  NO_USER = 'no_user',
}

export const UserColumn: FC<LockedByColumnProps> = ({
  user,
  noUserTooltip = 'Not found',
  tooltip,
}) => {
  /**
   * hooks
   */
  const [sharedData] = useSharedDataContext();

  /**
   * Callbacks
   */
  const renderLockedBy = (): ReactNode => {
    const userName = sharedData.user.info?.name;
    let lockStatus: USER_TYPES, icon, text: ReactNode;

    if (!user || !user.fullName) {
      lockStatus = USER_TYPES.NO_USER;
    } else if (userName === user.fullName) {
      lockStatus = USER_TYPES.ME;
    } else {
      lockStatus = USER_TYPES.OTHER;
    }

    const renderText = (user: ReactNode, tooltip?: string) => {
      return createElement('div', {
        children: tooltip ? (
          <Tooltip title={<Typography.Text>{tooltip}</Typography.Text>} placement='right'>
            {user}
          </Tooltip>
        ) : (
          user
        ),
      });
    };

    switch (lockStatus) {
      case USER_TYPES.ME:
        icon = <LockOutlined style={{ color: sharedData.theme?.colorPrimary }} />;
        text = renderText('Me', tooltip);
        break;
      case USER_TYPES.OTHER:
        icon = <LockOutlined style={{ color: sharedData.theme?.colorError }} />;
        text = renderText(user.fullName, tooltip);
        break;
      default:
        icon = <InfoCircleOutlined style={{ color: sharedData.theme?.colorTextDisabled }} />;
        text = renderText('-', noUserTooltip);
        break;
    }
    return (
      <>
        {icon} {text}
      </>
    );
  };

  return <Space>{renderLockedBy()}</Space>;
};
