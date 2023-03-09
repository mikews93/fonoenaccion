import { FC, useCallback, useEffect, useRef, useState } from 'react';
import Editor, { EditorProps, OnMount } from '@monaco-editor/react';
import classNames from 'classnames';

// @hooks
import { useSharedDataContext } from 'shared/context/useSharedData';

// @utils
import { initCustomEditor } from './customizations';
import { extractTextFromSpeakBlocks, useHighlightLine } from 'shared/utils/CodeEditor';

// @types
import { HighlightType, ParagraphMap } from 'shared/types/codeEditorTypes';

// @styles
import styles from './styles.module.scss';

export enum MODES {
  READ = 'READ',
  EDIT = 'EDIT',
  TRANSLATE = 'TRANSLATE',
  DISABLED = 'DISABLED',
}

export enum LANGUAGES {
  SPIEL = 'spiel',
  TEXT = 'text',
}

const initialDimensions = {
  height: 100,
  width: 100,
};

interface CodeEditorProps extends EditorProps {
  className?: string;
  defaultLanguage?: LANGUAGES;
  highlightedLine?: HighlightType;
  language?: LANGUAGES;
  mode?: MODES;
  parentRef?: React.RefObject<HTMLElement>;
}

export const CodeEditor: FC<CodeEditorProps> = ({
  className,
  defaultLanguage = LANGUAGES.SPIEL,
  height = initialDimensions.height,
  highlightedLine,
  language: editorLanguage = LANGUAGES.SPIEL,
  mode = MODES.EDIT,
  onMount,
  parentRef,
  value,
  width = initialDimensions.width,
  ...props
}) => {
  /**
   * hooks
   */
  const codeEditorRef = useRef<any>(null);
  const highlightLine = useHighlightLine();

  /**
   * State
   */
  const [paragraphMapper, setParagraphMapper] = useState<ParagraphMap | undefined>();
  const [dimensions, setDimensions] = useState({ height, width });
  const [language, setLanguage] = useState(defaultLanguage || editorLanguage);
  const [code, setCode] = useState(value);

  /**
   * Effects
   */
  useEffect(() => {
    // TODO: attach a resize event to the parent to update this dimensions
    setDimensions({
      height: parentRef?.current?.offsetHeight || dimensions.height,
      width: parentRef?.current?.offsetWidth || dimensions.width,
    });
    return () => {
      setDimensions(initialDimensions);
    };
  }, []);
  useEffect(() => {
    handleChangeEditorMode(mode);
  }, [mode, codeEditorRef.current]);
  useEffect(() => {
    highlightLine({
      mode,
      highlightedLine,
      paragraphMapper,
      editor: codeEditorRef.current,
      errorLineClassName: styles.errorLineDecoration,
      lineDecorationClassName: styles.editorRunningLine,
    });
  }, [highlightedLine, codeEditorRef.current]);
  useEffect(() => {
    setCode(value);
  }, [value]);

  /**
   * Callbacks
   */
  const handleEditorMount: OnMount = (editor, monaco) => {
    editor.setValue(value || '');
    codeEditorRef.current = editor;
    onMount?.(editor, monaco);
  };

  const handleChangeEditorMode = useCallback(
    (mode: MODES) => {
      if (!codeEditorRef.current) {
        return;
      }
      const editor = codeEditorRef.current;

      switch (mode) {
        case MODES.EDIT:
          setLanguage(LANGUAGES.SPIEL);
          editor.updateOptions({ readOnly: false, wordWrap: 'off' });
          setCode(value);
          break;
        case MODES.DISABLED:
          editor.updateOptions({ readOnly: true });
          break;
        default:
          setLanguage(LANGUAGES.TEXT);
          const [paragraphs, paragraphsMap] = extractTextFromSpeakBlocks(value ?? '');
          setParagraphMapper(paragraphsMap);
          editor.updateOptions({ readOnly: true, wordWrap: 'on' });
          setCode(paragraphs);
          break;
      }
    },
    [mode]
  );

  return (
    <Editor
      {...props}
      value={code}
      className={classNames(styles.codeEditor, className)}
      theme='spielTheme'
      height={dimensions.height}
      width={dimensions.width}
      defaultLanguage={language}
      language={language}
      onMount={handleEditorMount}
      beforeMount={initCustomEditor}
    />
  );
};
