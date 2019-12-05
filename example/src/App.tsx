import '@patternfly/react-core/dist/styles/base.css';
import React, { useState, useEffect } from "react";
import { EditorContainer, Spinner } from 'sce-sim-grid';
import classNames from 'classnames';
import { Select, SelectOption, SelectOptionObject } from '@patternfly/react-core';
import './App.css';

const App: React.FC = () => {
  const [data, setData] = useState('');
  const [data1, setData1] = useState('');
  const [data2, setData2] = useState('');
  const [model, setModel] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [isExpanded, setExpanded] = useState(false);
  const [isTransitionDone, setTransitionDone] = useState(false);
  const [selected, setSelected] = useState<any>();

  useEffect(() => {
    Promise.all([
      fetch('/data/Violation Scenarios.scesim'),
      fetch('/data/Example2.scesim'),
      fetch('/data/Traffic Violation2.dmn')
    ])
    .then(([res1, res2, res3]) => Promise.all([res1.text(), res2.text(), res3.text()]))
    .then(([sceSimData1, sceSimData2, dmnData]) => {
      setData1(sceSimData1);
      setData2(sceSimData2);
      setData(sceSimData1);
      setModel(dmnData);
      setLoading(false);
      setTimeout(() => {
        setTransitionDone(true);
      }, 1);
    })
    .catch(err => {
      console.log(err);
    });
  }, []);

  const onToggle = (isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  const onSelect = (event: React.MouseEvent | React.ChangeEvent, selection: string | SelectOptionObject, isPlaceholder?: boolean) => {
    if (isPlaceholder) clearSelection();
    if (selected === selection) {
      onToggle(false);
    } else {
      setSelected(selection);
      onToggle(false);
      if (selection === 'Example 1') {
        setData(data1);
      } else {
        setData(data2);
      }
    }
  };

  const clearSelection = () => {
    setSelected(null);
    onToggle(false);
  };

  const options = [
    'Example 1',
    'Example 2'
  ];

  const selectOptions = options.map((option: string, index: number) => (
    <SelectOption key={index} value={option} isSelected />
  ));

  return (
    <div className="App">
      {isLoading ? <Spinner text="Loading scenarios" /> : (
        <>
          <div>
            <Select
              className="data-select"
              toggleId="toggle data"
              variant="single"
              aria-label="Select Input"
              onToggle={onToggle}
              onSelect={onSelect}
              selections={selected}
              isExpanded={isExpanded}
              ariaLabelledBy="typeahead-select-id"
            >
              {selectOptions}
            </Select>
          </div>
          <div className={classNames('editor-container', isTransitionDone && 'show')}>
            <EditorContainer data={data} model={model} showSidePanel={true} readOnly={false} />
          </div>
        </>
      )}
    </div>
  );
};

export default App;
