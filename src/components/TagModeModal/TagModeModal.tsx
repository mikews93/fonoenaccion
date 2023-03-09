import { FC } from 'react';
import { Modal, ModalProps, Radio, RadioChangeEvent } from 'antd';

// @constants
import { MARKUP_TYPES, TAG_MODES } from 'components/UploadsTable/constants';

// @styles
import styles from './styles.module.scss';

interface TagModeModalProps extends ModalProps {
  onSelect: (selectedTag: TAG_MODES) => void;
  value: TAG_MODES;
}

export const TagModeModal: FC<TagModeModalProps> = ({ onSelect, value, ...props }) => {
  /**
   * Callbacks
   */
  const handleChange = ({ target: { value } }: RadioChangeEvent) => {
    onSelect(value);
  };

  return (
    <Modal
      footer={null}
      {...props}
      title='Tag Mode'
      centered
      width={300}
      className={styles.tagModeModal}
    >
      <Radio.Group onChange={handleChange} value={value} className='flex-column'>
        {Object.entries(MARKUP_TYPES).map(([mode, template]) => {
          return (
            <Radio key={mode} value={mode}>
              {template.label}
            </Radio>
          );
        })}
      </Radio.Group>
    </Modal>
  );
};
