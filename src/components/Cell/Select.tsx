import * as React from "react";
import { Tooltip, Select as PfSelect, SelectOption, SelectVariant, SelectOptionObject } from '@patternfly/react-core';
import { focusCell } from '../utils';
import './Input.css';
import './Select.css';

const Select = React.memo<{ 
  originalValue?: any, 
  path?: string, 
  id?: any, 
  type?: string, 
  isReadOnly?: boolean,
  onSelectToggleCallback?: any,
  options?: any,
  deactivateAndFocusCell?: any,
  setEditable: any,
  onSave: any
}>(({ 
  originalValue, 
  path, 
  id, 
  type, 
  isReadOnly, 
  onSelectToggleCallback, 
  options, 
  deactivateAndFocusCell, 
  setEditable,
  onSave
}) => {
  // console.log('render Select');
  const [isExpanded, setExpanded] = React.useState<boolean>(true);
  const [selected, setSelected] = React.useState<any>(originalValue);
  const [savedSelection, setSavedSelection] = React.useState<any>(originalValue);
  const [overflown, setOverflown] = React.useState<boolean>(false);

  React.useEffect(() => {
    // workaround to focus on the first list item to enable keyboard navigation
    if (!isReadOnly) {
      onToggle(true);
      setTimeout(() => {
        const element = document.querySelector(`button[id="${id}"]`);
        if (element && element.parentNode && (element.parentNode as HTMLElement).querySelector('.pf-c-select__menu-item')) {
          ((element.parentNode as HTMLElement).querySelector('.pf-c-select__menu-item') as HTMLButtonElement).focus();
        }
      }, 1);
    }
  }, [isReadOnly]);

  React.useEffect(() => {
    setSelected(originalValue);
    setSavedSelection(originalValue);
  }, [originalValue]);

  /**
   * Returns the current DOM element
   * 
   * TODO: Possibly change to React refs
   */
  const thisElement = () => {
    return document.getElementById(id) as HTMLInputElement;
  }

  /**
   * Saves the current value
   */
  const save = (selection: string) => {
    setSelected(selection);
    if (savedSelection !== selection) {
      setSavedSelection(selection);
      onSave && onSave(id, selection, originalValue);
    }
  }

  /**
   * The Select options
   */
  const selectOptions = options.map((option: string, index: number) => (
    <SelectOption key={index} value={option} isSelected />
  ));

  /**
   * Toggle the Select
   */
  const onToggle = (isExpanded: boolean) => {
    setExpanded(isExpanded);
    onSelectToggleCallback(id, isExpanded);
  };

  /**
   * Set the selection
   */
  const onSelect = (event: React.MouseEvent | React.ChangeEvent, selection: string | SelectOptionObject) => {
    // close the dropdown
    onToggle(false);
    // save operation
    save(selection as string);
    // mark itself as not editable but maintain focus
    setTimeout(() => {
      deactivateAndFocusCell(id);
    }, 1)
  };

  const onKeyDown = (event: any) => {
    const { key } = event;
    if (key === 'Escape') {
      onSelectToggleCallback(false);
      setTimeout(() => {
        deactivateAndFocusCell(id);
      }, 1)
    }
  }

  /**
   * Check if the element is overflown
   */
  const checkForOverflow = (event?: any) => {
    const element = event ? event.target : thisElement();
    const isOverflown = element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
    setOverflown(isOverflown);
  }

  return (
    <>
      {isReadOnly ? (
        <Tooltip content={selected} distance={0} exitDelay={0} trigger={overflown ? 'mouseenter focus' : 'manual'}>
          <input 
            onMouseOver={checkForOverflow}
            className="editor-input truncate" 
            style={{ cursor: 'default', textAlign: type === 'string' ? 'left' : 'center' }} 
            type="text" 
            value={selected}
            id={id}
            aria-label={selected}
            readOnly
          />
        </Tooltip>
      ) : (
        <PfSelect
          toggleId={id}
          variant={SelectVariant.single}
          aria-label="Select Input"
          onToggle={onToggle}
          onSelect={onSelect}
          selections={selected}
          isExpanded={isExpanded}
          ariaLabelledBy="typeahead-select-id"
          onKeyDown={onKeyDown}
        >
          {selectOptions}
        </PfSelect>
      )}
    </>);
}, (prevProps, nextProps) => {
  const shouldRerender = (prevProps.isReadOnly !== nextProps.isReadOnly) || (prevProps.originalValue !== nextProps.originalValue);
  if (shouldRerender) {
    console.log(`prevProps ${prevProps.originalValue}, nextProps ${nextProps.originalValue}`);
    return false;
  }
  return true;
});

export { Select };
