import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import { UncontrolledTooltip } from 'reactstrap';
import { If } from '../conditions';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash';
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/docco';
import './snippet.scss';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('bash', bash);


const COPIED_MESSAGE_LIFE = 5000;

export const Snippet = ({ messageToCopy, lang, style = docco }) => {

  const initialized = useRef(true);

  const [ copiedTs, setCopiedTs ] = useState(0);
  const [ copyState, copyToClipboard ] = useCopyToClipboard();

  const copyBtnHandler = useCallback(() => {
    copyToClipboard(messageToCopy);
  }, [ copyToClipboard, messageToCopy ]);

  useEffect(() => {
    if (copyState.error || !copyState.value) {
      return;
    }
    setCopiedTs(new Date() - 0);
    setTimeout(() => {
      if (!initialized.current) {
        return;
      }
      setCopiedTs(0);
    }, COPIED_MESSAGE_LIFE);
  }, [ copyState, copyState.error ]);

  useEffect(() => {
    // unloading
    return () => {
      initialized.current = false;
    };
  }, []);

  const elapsedSinceCopied = new Date() - copiedTs;

  const buttonId = useMemo(() => `id_${ Math.random().toString().substring(2) }`, []);

  return (<>
    <div className="bd-clipboard">
      <button type="button" id={ buttonId } className="btn-clipboard" title="Copy To Clipboard"
        onClick={ copyBtnHandler }>Copy
      </button>
      <UncontrolledTooltip placement="top" target={ buttonId }><If
        condition={ elapsedSinceCopied > COPIED_MESSAGE_LIFE }>Copy
        to clipboard</If><If condition={ elapsedSinceCopied <= COPIED_MESSAGE_LIFE }>Successfully
        copied!</If></UncontrolledTooltip>
    </div>

    <SyntaxHighlighter language={ lang } className="highlight" style={ style }>
      { messageToCopy }
    </SyntaxHighlighter>
  </>);
};
