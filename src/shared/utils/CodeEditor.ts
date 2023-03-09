// @types
import { SpielType } from 'shared/types/spielType';
import { HighlightType, HIGHLIGHT_TYPE, ParagraphMap } from 'shared/types/codeEditorTypes';
import { MODES } from 'components/CodeEditor/CodeEditor';

// @hooks
import { useMonaco } from '@monaco-editor/react';
import { useState } from 'react';

// @utils
import { log } from './Log';

/**
 * formats text into proper xml
 * @param text xml text to forma
 * @returns formatted xml
 */
export const formatEditorXml = (spiel: SpielType['spiel']) => {
  spiel = spiel.replace(/\n[ ]{12}([^ ])/g, '\n      $1');
  spiel = spiel.replace(/\n[ ]{6}<\/speak/g, '    </speak');
  return spiel;
};

/**
 * removes line jumps and spaces
 * @param spiel xml to process
 * @returns formatted spiel
 */
export const cleanXmlText = (spiel: SpielType['spiel']) => {
  spiel = spiel.replace(/\n/g, ' ');
  spiel = spiel.replace(/([ ])+/g, ' ');
  spiel = spiel.trim();
  return spiel;
};

/**
 * Removes everything from xml but the text inside the <speak> tags
 * @param spiel text on the spiel
 */
export const extractTextFromSpeakBlocks = (spiel: SpielType['spiel']): [string, ParagraphMap] => {
  const spielXML = new DOMParser().parseFromString(spiel, 'application/xml');

  const nsResolver = spielXML.createNSResolver(spielXML.documentElement);
  const speaks = document.evaluate(
    `//speak`,
    spielXML,
    nsResolver,
    XPathResult.ORDERED_NODE_ITERATOR_TYPE
  );

  let speakIdx = 0;
  const paragraphs = [];
  let speak = speaks.iterateNext();
  while (speak) {
    paragraphs[speakIdx] = cleanXmlText(speak.textContent || '');
    speak = speaks.iterateNext();
    speakIdx++;
  }

  // speak to paragraph map, can be used for scrolling later
  const speakToParagraphMap: ParagraphMap = {};
  const xmlLines = formatEditorXml(spielXML.documentElement.outerHTML).split(/\n/g);

  speakIdx = 0;
  let xmlLineNo = 0;
  xmlLines.forEach((line) => {
    xmlLineNo++;
    try {
      if (/<speak/.test(line) && /xml:lang="en-us"/i.test(line)) {
        speakToParagraphMap[speakIdx] = xmlLineNo;
      }
      // at the end of speak block
      if (/<\/speak/.test(line) && speakToParagraphMap[speakIdx]) {
        speakIdx++;
      }
    } catch (e) {
      console.warn(e);
    }
  });

  return [paragraphs.join('\n\n'), speakToParagraphMap];
};

type HighlightLineArgs = {
  editor: any;
  highlightedLine?: HighlightType;
  mode: MODES;
  paragraphMapper?: ParagraphMap;
  errorLineClassName?: string;
  lineDecorationClassName?: string;
};

/**
 * Custom hook to create decorations in monaco editor to select line
 * @returns function to highlight a line in the code editor
 */
export const useHighlightLine = () => {
  /**
   * hooks
   */
  const monaco = useMonaco();

  /**
   * state
   */
  const [deltaDecorations, setDeltaDecorations] = useState<any[]>([]);

  /**
   *
   * @description Creates a decoration in the indicated line of code, attach a lineDecorationClassName
   * to change the look of the line or errorLineClassName to change the look of errored line
   * @note when passing line to highlight it will clean possible previous highlighted lines
   * @note Only edit and read modes will highlight a line
   * @param config configuration for the function
   * @returns void - if editor or highlighted line is undefined will early return void
   */
  const highlightLine = ({
    editor,
    errorLineClassName,
    highlightedLine,
    lineDecorationClassName,
    mode,
    paragraphMapper,
  }: HighlightLineArgs) => {
    if (!editor || !highlightedLine || (highlightedLine?.line ?? -1) < 0) {
      if (editor && highlightedLine?.line === -1) {
        const newDeltaDecorations = editor.deltaDecorations(deltaDecorations, []);
        setDeltaDecorations(newDeltaDecorations);
      }
      return;
    }

    const errorDecorationProperties = {
      className: errorLineClassName,
      glyphMarginHoverMessage: { value: highlightedLine.errorMessage },
    };

    let decorationProperties = {
      isWholeLine: true,
      linesDecorationsClassName: lineDecorationClassName,
    };

    let startLine, endLine;

    if (highlightedLine.type === HIGHLIGHT_TYPE.ERROR) {
      decorationProperties = {
        ...decorationProperties,
        ...errorDecorationProperties,
      };
    }

    switch (mode) {
      case MODES.EDIT:
        startLine = highlightedLine.line;
        endLine = highlightedLine.line;
        break;
      case MODES.READ:
        if (paragraphMapper) {
          let matchIndex = 0;
          while (paragraphMapper[matchIndex] < highlightedLine.line) {
            matchIndex++;
          }
          startLine = Math.max(0, matchIndex - 1) * 2 + 1;
          endLine = startLine;
        }
        break;
      default:
        return;
    }
    // * scroll to line
    editor.revealLineInCenter(startLine);
    const newDeltaDecorations = editor.deltaDecorations(deltaDecorations, [
      {
        range: new monaco.Range(startLine, 1, endLine, 1),
        options: decorationProperties,
      },
    ]);
    setDeltaDecorations(newDeltaDecorations);
  };

  return highlightLine;
};
