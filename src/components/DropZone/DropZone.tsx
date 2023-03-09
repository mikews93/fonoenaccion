// @vendors
import { cloneElement, forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { Uppy } from '@uppy/core';
import { Dashboard } from '@uppy/react';
import DropTarget from '@uppy/drop-target';
import XHRUpload from '@uppy/xhr-upload';
import { isFunction, debounce } from 'lodash';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

// @styles
import styles from './styles.module.scss';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import '@uppy/drag-drop/dist/style.css';

// @context
import { useSharedDataContext } from 'shared/context/useSharedData';

// @utils
import { useClickOutside, useEscape } from 'shared/utils/Miscellaneous';

// @types
import { ConfigType } from 'shared/types/UppyConfigType';

// @constants
const DEBOUNCE_TIME = 3000;

interface DropZoneProps {
  children: JSX.Element;
  config: ConfigType;
  onSuccessUpload?: () => void;
  childSpacing?: boolean;
  isSummaryActive?: boolean;
  isOverlayActive?: boolean;
  setIsOverlayActive?: Function;
  setIsSummaryActive?: Function;
  childrenWrapperClass?: string;
}

export const DropZone = forwardRef<HTMLElement | null, DropZoneProps>(
  (
    {
      children,
      config,
      onSuccessUpload,
      childSpacing = false,
      isSummaryActive,
      isOverlayActive,
      setIsOverlayActive,
      setIsSummaryActive,
      childrenWrapperClass,
    },
    ref
  ) => {
    /**
     * refs
     */
    const DZRef = useRef(null);

    /**
     * Context
     */
    const [{ selectedProject, settings, user }] = useSharedDataContext();

    /**
     * state
     */
    const [uppy, setUppy] = useState(new Uppy());
    const [showSummary, setShowSummary] = useState(isSummaryActive);
    const [showOverlay, setShowOverlay] = useState(isOverlayActive);
    const isControlledFromParent = isOverlayActive !== undefined || isSummaryActive !== undefined;

    const destroyUppyInstance = () => uppy?.close();

    /**
     * Effects
     */
    useEffect(() => {
      destroyUppyInstance();
      setUppy(getNewUppy());
      return destroyUppyInstance;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config, selectedProject]);

    useEffect(() => {
      if (isSummaryActive !== undefined) {
        setShowSummary(isSummaryActive);
      }
      if (isOverlayActive !== undefined) {
        setShowOverlay(isOverlayActive);
      }
    }, [isSummaryActive, isOverlayActive]);

    /**
     * callbacks
     */
    const getNewUppy = () => {
      const { endpoint, metaFields, ...uppyConfig }: ConfigType = config;
      const uppyEntity = new Uppy(uppyConfig)
        .use(DropTarget, {
          target: '#drop-area',
          onDrop: handleShowSummary,
          onDragOver: handleShowOverlay,
          onDragLeave: handleHideOverlayDebounced,
        })
        .use(XHRUpload, {
          endpoint: [settings.apiUrl, endpoint].join('/'),
          headers: {
            Authorization: `Bearer ${user.info?.token}`,
            Accept: 'application/json',
          },
        })
        .on('cancel-all', handleHideSummary)
        .on('upload-success', handleSuccessUpload)
        .on('complete', handleCompleteDebounced)
        .on('upload-error', console.error);
      uppyEntity.setMeta(metaFields);
      return uppyEntity;
    };

    const handleShowSummary = () => {
      setShowSummary(true);
      if (isControlledFromParent && isFunction(setIsSummaryActive)) {
        setIsSummaryActive(true);
      }

      handleHideOverlay();
    };
    const handleHideSummary = () => {
      setShowSummary(false);
      if (isControlledFromParent && isFunction(setIsSummaryActive)) {
        setIsSummaryActive(false);
      }
    };
    const handleShowOverlay = () => {
      setShowOverlay(true);
      if (isControlledFromParent && isFunction(setIsOverlayActive)) {
        setIsOverlayActive(true);
      }
    };
    const handleHideOverlay = () => {
      setShowOverlay(false);
      if (isControlledFromParent && isFunction(setIsOverlayActive)) {
        setIsOverlayActive(false);
      }
    };
    const handleCompleteUpload = () => {
      handleHideSummary();
      setUppy(getNewUppy());
    };
    const handleHideOverlayDebounced = useCallback(debounce(handleHideOverlay, DEBOUNCE_TIME), []);
    const handleCompleteDebounced = useCallback(debounce(handleCompleteUpload, DEBOUNCE_TIME), [
      selectedProject,
    ]);
    const handleSuccessUpload = (result: any) => {
      console.debug(`[upload] [${moment().format()}]`, result);
      if (isFunction(onSuccessUpload)) onSuccessUpload(result);
    };
    const handleGetNotes = ({ restrictions: { allowedFileTypes } }: ConfigType) => {
      const separator = ' ';
      const escMessage = 'Esc to close this window.';
      const allowedFileTypesMessage = `
      Allowed file types: ${allowedFileTypes?.join(separator)}.
    `;
      return `
      ${allowedFileTypesMessage}
      ${escMessage}
    `;
    };

    /**
     * Hooks
     */
    useEscape(handleHideOverlay);
    useEscape(handleHideSummary);
    useClickOutside(DZRef, handleHideOverlay);

    return (
      <div
        id='drop-area'
        ref={ref ? (ref as any) : DZRef}
        className={classNames(styles.dropZone, {
          [styles.dropZoneOverlay]: showOverlay,
        })}
      >
        <div
          className={classNames(
            styles.childrenWrapper,
            {
              [styles.childSpacing]: childSpacing,
            },
            childrenWrapperClass
          )}
        >
          {!isControlledFromParent
            ? cloneElement(children, {
                handleUpload: handleShowOverlay,
                handleHideSummary,
              })
            : children}
        </div>
        <div>
          <Dashboard
            uppy={uppy}
            id='dropWrapper'
            proudlyDisplayPoweredByUppy={false}
            showProgressDetails
            hideProgressAfterFinish
            className={classNames(styles.uploadSummary, {
              [styles.show]: showSummary,
            })}
            note={handleGetNotes(config)}
            metaFields={[{ id: 'name', name: 'Name', placeholder: 'file name' }]}
          />
        </div>
        {showOverlay && (
          <>
            <p className={styles.dropZoneText}>Drop your files here...</p>
            <Button
              type='text'
              shape='circle'
              icon={<CloseOutlined />}
              onClick={handleHideOverlay}
              className={styles.dropZoneCloseButton}
            />
          </>
        )}
      </div>
    );
  }
);
