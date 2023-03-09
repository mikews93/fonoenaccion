import { Typography } from 'antd';

// @utils
import { translate } from 'shared/internationalization/translate';

export const Copyright = () => {
  return (
    <div className='justify-center flex-column'>
      <Typography.Text type='secondary'>@{new Date().getFullYear()} Videate</Typography.Text>
      <Typography.Text type='secondary'>{`${translate('all_rights_reserved')}`}</Typography.Text>
    </div>
  );
};
