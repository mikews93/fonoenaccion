import { ClearOutlined, PlayCircleOutlined, ShareAltOutlined } from '@ant-design/icons';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { FC, useEffect, useState } from 'react';
import { Button, Dropdown } from 'antd';

// @components
import { DropListColumn } from 'components/DropListColumn/DropListColumn';
import { PlaylistLink } from 'components/PlaylistLink/PlaylistLink';
import { ContentPane } from 'components/ContentPane/ContentPane';

// @hooks
import { useSharedDataContext } from 'shared/context/useSharedData';
import { useNotifications } from 'shared/hooks/useNotifications';
import { useGetRequest, useMutationRequest } from 'shared/hooks/useRequest';

// @types
import { Playlist } from 'shared/types/playlistTypes';
import { SpielType } from 'shared/types/spielType';

// @constants
import { PLAYLIST_FORMATS } from 'containers/Playlists/constants';

// @styles
import styles from './styles.module.scss';

interface PlaylistDetailsProps {
  playlist: Playlist;
}

enum GROUP_TYPES {
  AVAILABLE = 'Available',
  PLAYLIST = 'Playlist',
}

const getInitialState = (spiels: SpielType[], playlistItems: Playlist['members']) => {
  const memberIds = playlistItems.map(({ spiel_id }) => spiel_id);
  const filteredSpiels = spiels.filter(({ id }) => !memberIds.includes(id));
  return [
    {
      groupName: GROUP_TYPES.AVAILABLE,
      spiels: filteredSpiels.map(({ id, title: name }) => ({ id: id.toString(), name })),
    },
    {
      groupName: GROUP_TYPES.PLAYLIST,
      spiels: playlistItems.map(({ spiel_id, title: name }) => ({
        id: spiel_id.toString(),
        name,
      })),
    },
  ];
};

export const PlaylistDetails: FC<PlaylistDetailsProps> = ({ playlist }) => {
  /**
   * hooks
   */
  const [sharedData] = useSharedDataContext();
  const { errorNotification, successNotification } = useNotifications();

  /**
   * Queries
   */
  const [spiels] = useGetRequest<SpielType[]>('/spiels');
  const [{ members }, { mutate }] = useGetRequest<Playlist>(`${location.pathname}/${playlist?.id}`);
  const [updatePlaylist] = useMutationRequest<number[], Playlist>();

  /**
   * State
   */
  const [columns, setColumns] = useState(getInitialState(spiels, members));

  useEffect(() => {
    setColumns(getInitialState(spiels, members));
  }, [playlist]);

  /**
   * Callbacks
   */
  const handleClickWatch = async () =>
    open(
      `${sharedData.settings.watchPlaylistUrl}${sharedData.settings.downloadPlaylistUrl}/${playlist?.slug}${PLAYLIST_FORMATS.M3U}`
    );

  const onDragEnd = async ({ source, destination, draggableId }: DropResult) => {
    if (!destination) {
      return null;
    }

    if (source.droppableId === destination.droppableId && destination.index === source.index) {
      return null;
    }

    const [sourceGroup] = columns.filter((column) => column.groupName === source.droppableId);
    const [destinationGroup] = columns.filter(
      (column) => column.groupName === destination.droppableId
    );

    const [movingItem] = sourceGroup.spiels.filter((t) => t.id === draggableId);

    sourceGroup.spiels.splice(source.index, 1);
    destinationGroup.spiels.splice(destination.index, 0, movingItem);

    const playlistMembers =
      columns.find(({ groupName }) => groupName === GROUP_TYPES.PLAYLIST)?.spiels || [];

    const { error } = await updatePlaylist(
      playlistMembers.map((member) => +member.id),
      'PATCH',
      `${location.pathname}/${playlist?.id}/members`
    );
    if (error) {
      errorNotification('Playlist Error', 'Could not update Playlist', { error });
      return { error };
    }
    mutate({
      ...playlist,
      members: playlistMembers.map(({ id, name: title }, ordinal) => ({
        id: +id,
        spiel_id: +id,
        ordinal,
        videos: '1',
        title,
      })),
    });
    return successNotification('Success!', 'Playlist updated');
  };

  const handleClearPlaylist = async () => {
    const { error } = await updatePlaylist(
      [],
      'PATCH',
      `${location.pathname}/${playlist?.id}/members`
    );
    if (error) {
      return errorNotification('Playlist Error', 'Could not update Playlist', { error });
    }
    setColumns(getInitialState(spiels, []));
    mutate({
      ...playlist,
      members: [],
    });
    return successNotification('Success!', 'Playlist updated');
  };

  const handleSearchSpiel = (type: GROUP_TYPES, lookUpText: string) => {
    const [availableItems, playlistItems] = getInitialState(spiels, members);

    const filterFn = ({ name }: { name: string }) =>
      name.toLowerCase().includes(lookUpText.toLowerCase());

    if (type === GROUP_TYPES.PLAYLIST) {
      playlistItems.spiels = playlistItems.spiels.filter(filterFn);
    }

    if (type === GROUP_TYPES.AVAILABLE) {
      availableItems.spiels = availableItems.spiels.filter(filterFn);
    }

    setColumns([availableItems, playlistItems]);
  };

  /**
   * Conditional rendering
   */
  const PlaylistActions = (
    <div className='flex'>
      <Dropdown
        arrow
        trigger={['click']}
        menu={{
          items: Object.values(PLAYLIST_FORMATS).map((value, index) => ({
            key: index,
            label: <PlaylistLink type={value} slug={playlist?.slug} />,
          })),
        }}
      >
        <Button size='large' shape='circle' title='Share' icon={<ShareAltOutlined />} type='text' />
      </Dropdown>
      <Button
        icon={<PlayCircleOutlined />}
        onClick={handleClickWatch}
        shape='circle'
        size='large'
        title='Watch'
        type='text'
      />
    </div>
  );

  return (
    <ContentPane
      extra={PlaylistActions}
      subTitle='Create set of Videos to share'
      title={playlist.name}
      className={styles.contentPane}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.dndZone}>
          {columns.map(({ spiels, groupName }, index) => {
            const handleChangeSearch = (searchText: string) =>
              handleSearchSpiel(groupName, searchText);
            const extra =
              groupName === GROUP_TYPES.PLAYLIST ? (
                <Button
                  icon={<ClearOutlined />}
                  onClick={handleClearPlaylist}
                  shape='circle'
                  title='Clear Playlist'
                  type='text'
                />
              ) : null;
            return (
              <DropListColumn
                key={index}
                droppableId={groupName}
                dataSource={spiels}
                type='spiel'
                bordered
                headerProps={{
                  content: `${groupName} Spiels`,
                  searchable: true,
                  extra,
                  onSearch: handleChangeSearch,
                  searchPlaceholder: 'Search Videos',
                }}
              />
            );
          })}
        </div>
      </DragDropContext>
    </ContentPane>
  );
};
