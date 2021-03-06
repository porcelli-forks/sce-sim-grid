import { Button, Expandable, TextContent } from '@patternfly/react-core';
import { AngleRightIcon, CopyIcon } from '@patternfly/react-icons';
import classNames from 'classnames';
import * as React from 'react';
import { setCaretPositionAtEnd } from '../utils';
import './Sidebar.css';

const DefinitionsDrawerPanel = React.memo<{
  definitions: any,
  dmnFilePath: string,
}>(({ definitions, dmnFilePath }) => {
  // console.log('render DefinitionsDrawerPanel');

  // DMN file path ClipboardCopy expansion
  const [isExpanded, setExpanded] = React.useState(false);
  const [definitionsState, setDefinitionsState] = React.useState(definitions);
  const [dmnFilePathState, setDmnFilePathState] = React.useState(dmnFilePath);

  React.useEffect(() => {
    // scroll towards the end of the DMN file path input
    setTimeout(() => {
      const element = document.getElementById('dmnFilePath') as HTMLInputElement;
      if (element) {
        setCaretPositionAtEnd(element);
      }
    }, 1);
  }, [dmnFilePath]);

  React.useEffect(() => {
    if (definitions !== definitionsState) {
      setDefinitionsState(definitions);
    }
    if (dmnFilePath !== dmnFilePathState) {
      setDmnFilePathState(dmnFilePath);
    }
  }, [definitions, dmnFilePath]);

  /**
   * Toggles the DMN file path
   */
  const onToggle = () => {
    setExpanded(!isExpanded);
  };

  /**
   * Copy the DMN file path
   */
  const onCopy = (event: any) => {
    /* Get the text field */
    const copyText = document.getElementById('dmnFilePath') as HTMLInputElement;
    if (copyText && copyText.select) {
      /* Select the text field */
      copyText.select();
      copyText.setSelectionRange(0, 99999); /*For mobile devices*/
      /* Copy the text inside the text field */
      document.execCommand('copy');
      // do not mark the whole text as selected
      setCaretPositionAtEnd(copyText);
    }
  };

  const ClipboardCopy = () => (
    <div className={classNames('pf-c-clipboard-copy', isExpanded && 'pf-m-expanded')}>
      <div className="pf-c-clipboard-copy__group">
        <button
          className="pf-c-clipboard-copy__group-toggle"
          id="dmnPathToggle"
          aria-labelledby="dmnPathToggle dmnFilePath"
          aria-controls="content-6"
          aria-expanded="true"
          aria-label="Show content"
          onClick={onToggle}
        >
          <AngleRightIcon
            className="pf-c-clipboard-copy__group-toggle-icon"
          />
        </button>
        <input className="pf-c-form-control" readOnly={true} type="text" value={dmnFilePathState} id="dmnFilePath" aria-label="Copyable input"/>
        <button
          className="pf-c-clipboard-copy__group-copy"
          aria-label="Copy to clipboard"
          id="dmnPathCopy"
          aria-labelledby="dmnPathCopy dmnFilePath"
          onClick={onCopy}
        >
          <CopyIcon />
        </button>
      </div>
      {isExpanded && (
        <div
          className="pf-c-clipboard-copy__expandable-content"
          id="dmnPathContent"
          style={{ color: 'rgb(33, 36, 39)' }}
        >
          {dmnFilePathState}
        </div>
      )}
    </div>
  );
  return (
    <div>
      <TextContent className="pf-u-m-lg">
        <div className="pf-u-mb-xl">
          <div>DMN file path</div>
          <ClipboardCopy />
        </div>
        <p>To create a test template, define the "Given" and "Expect" columns by using the expression editor below.</p>
        <h2>Select Data Object</h2>
        <h3>Complex Types</h3>
        {definitionsState.complex.map((item: any) => (
          <Expandable key={item.typeRef} toggleText={item.text}>
            {Object.keys(item.elements).map((elementKey: any) => (
              <div className="pf-u-mb-sm" key={elementKey}>
                <Button variant="link">{elementKey}</Button>
                <span> [{item.elements[elementKey]}]</span>
              </div>
            ))}
          </Expandable>
        ))}

        <h3>Simple Types</h3>
        {definitionsState.simple.map((item: any) => (
          <Expandable key={item.typeRef} toggleText={item.text}>
            {Object.keys(item.elements).map((elementKey: any) => (
              <div className="pf-u-mb-sm" key={elementKey}>
                <Button variant="link">{elementKey}</Button>
                <span> [{item.elements[elementKey]}]</span>
              </div>
            ))}
          </Expandable>
        ))}
      </TextContent>
    </div>
  );
}, (prevProps, nextProps) => {
  if (JSON.stringify(prevProps.definitions) !== JSON.stringify(nextProps.definitions)) {
    // definitions have changed, re-render
    return false;
  }
  if (prevProps.dmnFilePath !== nextProps.dmnFilePath) {
    // dmnFilePath have changed, re-render
    return false;
  }
  return true;
});

export { DefinitionsDrawerPanel };
