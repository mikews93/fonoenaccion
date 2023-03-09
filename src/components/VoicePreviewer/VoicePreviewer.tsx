import { Image, Select, Typography } from 'antd';
import { FC, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { debounce, isEmpty } from 'lodash';

// @types
import { Replacement } from 'shared/types/replacementTypes';
import { Voice } from 'shared/types/voices';

// @hooks
import { useGetRequest, useMutationRequest } from 'shared/hooks/useRequest';
import { useNotifications } from 'shared/hooks/useNotifications';

// @utils
import { generateSlug } from 'shared/utils/Strings';
import { getCountryFlag } from 'shared/utils/Icons';

// @styles
import styles from './styles.module.scss';

interface VoicePreviewerProps {
  textToPlay: string;
  textToDisplay: string;
  noTextCaption?: string;
  languages: string[];
}

export const VoicePreviewer: FC<VoicePreviewerProps> = ({
  textToPlay,
  textToDisplay = textToPlay,
  languages = [],
  noTextCaption = '[No text provided]',
}) => {
  /**
   * hooks
   */
  const { errorNotification } = useNotifications();

  /**
   * Queries
   */
  const [voices] = useGetRequest<Voice[]>('/voices');
  const [getAudio, { isLoading: isGettingAudio }] = useMutationRequest<
    { engine: string; voice: string; text: string },
    any
  >();

  /**
   * State
   */
  const [isPlaying, setIsPlaying] = useState(false);
  const [validationError, setValidationError] = useState<string>();
  const [selectedVoice, setSelectedVoice] = useState<Voice>();
  const [filteredVoices, setFilteredVoices] = useState<
    { label: string; options: { label: string; value: string; engine: string }[] }[]
  >([]);
  const [playableAudio, setPlayableAudio] = useState<HTMLAudioElement | null>(null);

  /**
   * Effect
   */
  useEffect(() => {
    if (voices.length && !selectedVoice) {
      setSelectedVoice(voices[0]);
    }
    setFilteredVoices(generateGroupedOptions(voices, languages));
    return () => {
      setFilteredVoices([]);
    };
  }, [voices.length, languages.length]);

  const generateGroupedOptions = (voices: Voice[], languages: Replacement['languages']) => {
    return [...languages].map((dialect) => ({
      label: dialect,
      options: voices
        .filter(({ language }) => language === dialect)
        .map(({ voice, name, engine }) => ({ value: voice, label: name, engine })),
    }));
  };

  /**
   * Callbacks
   */
  const handleChangeVoice = (value: string) => {
    setSelectedVoice(voices.find(({ voice }) => voice === value));
    setValidationError(undefined);
  };

  const handleClickPlayPause = useCallback(
    debounce(async () => {
      if (playableAudio && isPlaying) {
        setIsPlaying(false);
        return playableAudio.pause();
      }

      if (selectedVoice) {
        const { error, data } = await getAudio(
          {
            engine: selectedVoice.engine,
            voice: selectedVoice.voice,
            text: textToPlay,
          },
          'POST',
          '/asseter/speak',
          { useFetchApi: true }
        );
        if (error) {
          setIsPlaying(false);
          return errorNotification('Playback error', 'Could not reproduce audio');
        }
        const audioBlob = await data.blob();
        const audioComponent = new Audio();
        audioComponent.src = window.URL.createObjectURL(audioBlob);
        setPlayableAudio(audioComponent);

        audioComponent.onplay = () => setIsPlaying(true);
        audioComponent.onpause = () => setIsPlaying(false);
        audioComponent.onended = () => setIsPlaying(false);
        audioComponent.onerror = () => setIsPlaying(false);
        audioComponent.play();
      } else {
        setValidationError('Please select a voice');
      }
    }, 200),
    [selectedVoice, playableAudio, isPlaying, textToPlay]
  );

  return (
    <div className={styles.voicePreviewer}>
      <Typography.Title level={5}>
        {isEmpty(textToDisplay) ? noTextCaption : textToDisplay}
      </Typography.Title>
      <div className={styles.controlsLayout}>
        <Image
          src={!isPlaying ? '/images/play.svg' : '/images/stop.svg'}
          preview={false}
          color='white'
          className={classNames(styles.control, { [styles.loading]: isGettingAudio })}
          onClick={handleClickPlayPause}
        />
        <Select
          bordered={false}
          className={styles.voiceSelect}
          placeholder='Select a voice'
          showSearch
          onChange={handleChangeVoice}
          value={selectedVoice?.voice}
        >
          {filteredVoices.map(({ label, options }) => (
            <Select.OptGroup
              label={
                <>
                  {getCountryFlag(label.split('-')?.[1])} {label.toUpperCase()}
                </>
              }
              key={generateSlug()}
            >
              {options.map(({ label, value }) => (
                <Select.Option value={value} key={generateSlug()}>
                  {label}
                </Select.Option>
              ))}
            </Select.OptGroup>
          ))}
        </Select>
      </div>
      {validationError && (
        <div className={styles.validation}>
          <Typography.Text type='danger'>{validationError}</Typography.Text>
        </div>
      )}
    </div>
  );
};
