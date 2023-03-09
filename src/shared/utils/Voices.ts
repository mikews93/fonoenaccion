import { capitalize } from 'lodash';
import { Voice } from 'shared/types/voices';

export const buildVoicesOptions = (voices: Voice[]) => {
  const engines = [...new Set(voices?.map(({ engine }) => engine))];

  return engines?.map((engine) => ({
    label: capitalize(engine),
    options: voices
      ?.filter(({ engine: voiceEngine }) => voiceEngine === engine)
      .map(({ voice: value, name: label }) => ({
        value,
        label,
        engine,
      })),
  }));
};
