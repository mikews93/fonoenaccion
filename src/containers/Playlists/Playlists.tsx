import { BarsOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Typography } from 'antd';
import { Suspense, useEffect, useState } from 'react';

// @components
import { GeneralLoading } from 'components/GeneralLoading/GeneralLoading';
import { ComponentList } from 'components/ComponentList/ComponentList';
import { ContainerPage } from 'components/ContainerPage/ContainerPage';

// @hooks
import { useGetRequest, useMutationRequest } from 'shared/hooks/useRequest';
import { useNotifications } from 'shared/hooks/useNotifications';

// @types
import { Playlist } from 'shared/types/playlistTypes';

// @utils
import { preventDefaultBehavior } from 'shared/utils/Functions';
import { generateSlug } from 'shared/utils/Strings';

// @styles
import styles from './styles.module.scss';
import { useSharedDataContext } from 'shared/context/useSharedData';
import { PlaylistDetails } from 'components/PlaylistDetails/PlaylistDetails';

export default function Playlists() {
  /**
   * hooks
   */
  const { errorNotification, successNotification } = useNotifications();
  const [{ selectedProject }] = useSharedDataContext();
  const [{ isMobileView }] = useSharedDataContext();
  /**
   * Queries
   */
  const [data, { mutate }] = useGetRequest<Playlist[]>(location.pathname);
  const [addNewPlaylist] = useMutationRequest<Partial<Playlist>, Playlist>(location.pathname);
  const [deletePlaylist] = useMutationRequest();

  /**
   * state
   */
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | undefined>(data[0]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showNewItem, setShowNewItem] = useState(false);

  /**
   * Effects
   */
  useEffect(() => {
    setSelectedPlaylist(undefined);
    mutate([]);
  }, [selectedProject?.id]);
  useEffect(() => {
    if (data.length && !selectedPlaylist) {
      setSelectedPlaylist(data[0]);
    }
  }, [data]);

  /**
   * handlers
   */
  const handleListItemClick = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);

    if (isMobileView) {
      handleClosePlaylistModal();
    }
  };
  const handleClickAdd = () => setShowNewItem(true);
  const handleCancelAddNewItem = () => setShowNewItem(false);
  const handleDeletePlaylist = async (playlist: Playlist) => {
    const { error } = await deletePlaylist(null, 'DELETE', `${location.pathname}/${playlist.id}`);
    if (error) {
      return errorNotification('Playlist error', 'Could not delete Playlist', { error });
    }

    const filteredData = data.filter(({ id }) => id !== playlist.id);
    mutate(filteredData);
    if (playlist.id === selectedPlaylist?.id) {
      setSelectedPlaylist(filteredData[0]);
    }
    return successNotification('Success!', 'Playlist deleted successfully');
  };
  const handleAddNewItem = async (values: Partial<Playlist>) => {
    const { error, data } = await addNewPlaylist({ ...values, slug: generateSlug() });
    if (error || !data) {
      return errorNotification('Playlist error', 'Could not add Playlist', { error });
    }

    setSelectedPlaylist(data);
    handleCancelAddNewItem();
    return successNotification('Awesome!', 'Playlist added successfully');
  };
  const handleClickExtra = () => setShowPlaylistModal(true);
  const handleClosePlaylistModal = () => setShowPlaylistModal(false);

  /**
   * Conditional rendering
   */
  const itemActions = (playlist: Playlist) => {
    const onConfirmDelete = (event: any) => {
      preventDefaultBehavior(event);
      handleDeletePlaylist(playlist);
    };

    return [
      <Popconfirm
        placement='bottomLeft'
        key={generateSlug()}
        title={
          <Typography.Text>
            Are you sure to delete <strong>{playlist.name}</strong>?
          </Typography.Text>
        }
        onConfirm={onConfirmDelete}
        onCancel={preventDefaultBehavior}
      >
        <Button
          type='text'
          icon={<DeleteOutlined />}
          title='Delete'
          onClick={preventDefaultBehavior}
        />
      </Popconfirm>,
    ];
  };

  const ListPane = (
    <ComponentList<Playlist>
      dataSource={data}
      selectedItem={selectedPlaylist}
      headerProps={{
        content: 'Project Playlists',
        onAddNewItem: handleClickAdd,
        showAddBtn: true,
        addBtnTitle: 'Create new Playlist',
        searchPlaceholder: 'Search Videos',
      }}
      itemActions={itemActions}
      newItemProps={{
        onCancel: handleCancelAddNewItem,
        onOk: handleAddNewItem,
        visible: showNewItem,
      }}
      onClickItem={handleListItemClick}
      className={styles.listPane}
    />
  );

  return (
    <ContainerPage
      className={styles.playlist}
      title='Playlists'
      extra={<Button className={styles.extra} icon={<BarsOutlined />} onClick={handleClickExtra} />}
    >
      <div className={styles.contentLayout}>
        {ListPane}
        <Suspense fallback={<GeneralLoading />}>
          {selectedPlaylist && <PlaylistDetails playlist={selectedPlaylist} />}
        </Suspense>
      </div>
      <Modal
        className={styles.playlistModal}
        open={showPlaylistModal}
        closable={false}
        footer={null}
        onCancel={handleClosePlaylistModal}
      >
        {ListPane}
      </Modal>
    </ContainerPage>
  );
}
