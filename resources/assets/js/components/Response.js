import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { setActiveItem, setResponse, setNote, getResponse } from '../actions';
import { ItemCard } from './ItemCard';
import { validateNumeric, isValueWithinWholeRangeOfRules, monthsToYears } from '../lib/helpers';
import { Markdown } from './Markdown';
import { items, scales, getItemByKey, getNextItemByKey } from '../items';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import ResponseSlider from './ResponseSlider';
import SelectResponse from './SelectResponse';
import { nullUp, up, nullDown, down, handleKeyDown, test } from '../lib/arrowFunctionalities';



class Response extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      item: getItemByKey(this.props.interview.activeKey),
      value: -1,
      hasSlider: false,
      currentPos: null,
      // Making sure that if not initialized, min-max is the empty set
      min: 1,
      max: 0,
      OptionsWithoutDescriptions: [],
      OptionsWithDescriptions: [],
      OptionsAsObjects: [],
      sliderValue: 0,
      showDescription: false,
      dropdownValue: null,
      dropdownMin: null,
      dropdownMax: null,

    };
    this.inputBox = React.createRef();
    this.slider = React.createRef();
    this.dropdownMenu = React.createRef();
  }

  getResponseType = (key) => {
    if (key.includes('-')) {
      if (key.split('-')[0].includes('.') && key.split('-')[0].includes('.')) {
        return 'dropdown'
      }
      else {
        return 'slider'
      }
    }
    else {
      return 'simple'
    }
  }

  update = () => {
    console.log('UPDATE')
    let item = getItemByKey(this.props.interview.activeKey);
    let hasScale = item.scale;
    if (hasScale && scales[item.scale]) {
      const scale = scales[item.scale];
      item = {
        ...item,
        options: scale.options,
        validate: scale.validate,
        input: scale.input
      };
    }

    const OptionsWithoutDescriptions = [];
    const OptionsWithDescriptions = [];
    /*
    if (item.dropdownOptions) {
      OptionsWithoutDescriptions.push(this.dropdownMenu)
    }*/
    if (item.options) {
      Object.keys(item.options).map(key => {
        OptionsWithoutDescriptions.push(
        {
          key: key,
          text: item.options[key],
          responseType: this.getResponseType(key),
        }
        )
      }
      );
    }
    OptionsWithoutDescriptions.sort(this.compareKey)

    Object.keys(scales['1ad'].options).map(key => {
      OptionsWithDescriptions.push(
      {
        key: key,
        text: scales['1ad'].options[key]['description'],
        responseType: this.getResponseType(key),
        title: scales['1ad'].options[key]['title']

      }
      )
    })

    const sliderRanges = [];
    const dropdownRanges = [];
    OptionsWithoutDescriptions.map(option => {
      if (option.responseType === 'slider') {
        sliderRanges.push(option.key.split('-').map(n => parseInt(n, 10)))
      }
      else if (option.responseType === 'dropdown') {
        dropdownRanges.push(option.key.split('-'));
      }
    })

    const response = (this.props.interview.responses && this.props.interview.responses[item.key]) || '';
    let sliderValue = (this.props.interview.sliderValues && this.props.interview.sliderValues[item.key]) || null;
    let dropdownValue = (this.props.interview.dropdownValues && this.props.interview.dropdownValues[item.key]) || null;
    let currentPos;
    if (!item.dropdownOptions) {
      currentPos = this.getIndexByKey(response, OptionsWithoutDescriptions)
    }
    else {
      // TODO: This is just to avoid crashing
      currentPos = 0
    }

    if (sliderRanges.length) {
      const min = sliderRanges[0][0];
      const max = sliderRanges[0][1];
      if (sliderValue === null) {
        sliderValue = min
      }
      this.setState({
        OptionsWithoutDescriptions: OptionsWithoutDescriptions,
        OptionsWithDescriptions: OptionsWithDescriptions,
        response: response,
        sliderValue: sliderValue,
        value: sliderValue,
        currentPos: currentPos,
        min: min,
        max: max,
        showDescription: false,
        dropdownValue: null,
        dropdownMin: null,
        dropdownMax: null,
      });
    }
    else if (dropdownRanges.length) {
      const min = dropdownRanges[0][0];
      const max = dropdownRanges[0][1];
      this.setState({
        OptionsWithoutDescriptions: OptionsWithoutDescriptions,
        OptionsWithDescriptions: OptionsWithDescriptions,
        response: response,
        sliderValue: sliderValue,
        value: sliderValue,
        currentPos: currentPos,
        min: null,
        max: null,
        showDescription: false,
        dropdownValue: dropdownValue,
        dropdownMin: min,
        dropdownMax: max,
      })
    }
    else {
      this.setState({
        OptionsWithoutDescriptions: OptionsWithoutDescriptions,
        OptionsWithDescriptions: OptionsWithDescriptions,
        response: response,
        sliderValue: null,
        value: sliderValue,
        currentPos: currentPos,
        min: null,
        max: null,
        showDescription: false,
        showDescription: false,
        dropdownValue: null,
        dropdownMin: null,
        dropdownMax: null,
      })
    }
  }

  componentDidMount() {
    this.update();
  }

  componentDidUpdate(prevProps) {
    if (this.props.interview.activeKey !== prevProps.interview.activeKey) {
      this.update();
    }
  }

  generateOption = (option, array) => {
    if (this.state.showDescription === false) {
      if (option.key.includes("-")) {
        if (option.key.split('-')[0].includes('.') && option.key.split('-')[1].includes('.')) {
          return (
            <SelectResponse
            key={option.key}
            activeKey={this.props.interview.activeKey}
            options={this.generateOptions(option.key.split('-')[0], option.key.split('-')[1])}
            inputBox={this.inputBox}
            ref={this.dropdownMenu}
            responseContainer={this}
            >
            </SelectResponse>
/*            <Dropdown
            key='dropdownMenu'
            activeKey={this.props.interview.activeKey}
            options={this.generateOptions(option.key.split('-')[0], option.key.split('-')[1])}
            inputBox={this.inputBox}
            ref={this.dropdownMenu}
            responseContainer={this}
            >
            </Dropdown>*/
            )
        }

        else {
          this.state.hasSlider = true;
          return ([
            option.text,
            <ResponseSlider
            id='Slider'
            key={'slider'}
            value={this.state.sliderValue || 1}
            min={
              parseInt(option.key.split('-')[0])
            }
            max={
              parseInt(option.key.split('-')[1])
            }
            ref={this.slider}
            array={array}
            response={this}
            interview={this.props.interview}
            inputBox={this.inputBox}
            />,
            <center key='center'>
            {monthsToYears(this.state.sliderValue)}
            </center>
            ]);
        }
      }

      else {
       return ([
        <b key='teatKey'>{option.key + ' '}</b>,
        option.text
        ]);
     }
   }
   else {
    return (
      <div key='testKey'>
      <b key='testKey'>{option.key + ': '}</b>
      <div key='testKey2'>
      <b key='testKey2'>Title: </b>
      {option.text}
      </div>
      <div>
      <b key='testKey3'>Description: </b>
      {option.description}
      </div>
      </div>
      )
  }
}

getIndexByKey = (key, array) => {
  for(var i = 0; i < array.length; i++) {
    if(array[i].key === key) {
      return i;
    }
    else if (array[i].key.includes('-')) {
      const ranges = array[i].key.split('-').map(n => (parseInt(n, 10)))
      const min = ranges[0];
      const max = ranges[1];
      if ((min <= parseInt(key, 10)) && (parseInt(key, 10) <= max)) {
        return i
      }
    }
  }
  return null;
}

  // Function returning the index of a possible element in an array.
  getIndex = (value, arr) => {
    for(var i = 0; i < arr.length; i++) {
      if(arr[i] === value) {
        return i;
      }
    }
    return -1; //to handle the case where the value doesn't exist
  }

  // Function returning the index of a possible element in an array, given that the array contains lists with at least 1 element..
  getIndex_0 = (value, arr) => {
    for(var i = 0; i < arr.length; i++) {
      if(arr[i][0] === value) {
        return i;
      }
    }
    return -1; //to handle the case where the value doesn't exist
  }

  compareKey = (key1, key2) => {
    let avr1;
    let avr2;
    if (key1.key.includes('-')) {
      const ranges = key1.key.split('-').map(n => (parseInt(n, 10)))
      avr1 = (ranges[0] + ranges[1])/2
    }
    else {
      avr1 = parseInt(key1.key, 10)
    }
    if (key2.key.includes('-')) {
      const ranges = key2.key.split('-').map(n => (parseInt(n, 10)))
      avr2 = (ranges[0] + ranges[1])/2
    }
    else {
      avr2 = parseInt(key2.key, 10)
    }
    if (avr1 < avr2) {
      return -1
    }
    else if (avr1 === avr2) {
      return 0
    }
    else if (avr1 > avr2) {
      return 1
    }
  }

  handleRadioButtonChange = (option, Options, item) => (event) => {
    if (option.key.includes("-")) {
      this.props.dispatch(setResponse({
       key: item.key,
       value: this.state.sliderValue
     }))
    }
    else {
      this.props.dispatch(setResponse({
       key: item.key,
       value: option.key.toString()
     }))
    }
    this.inputBox.current.focus()
    this.setState({
      currentPos: this.getIndexByKey(option.key, Options)
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
  }

  // Method that takes two keys from the item list, and returns an array containing pairs of the form [key, title]. For example, running generateOptions(2.002, 2.003) would generate the array
  // [[2.002, Varighed af helbredsbesvær (mdr.)], [2.003, Fysisk sygdom eller svækkelse igennem det sidste år]]
  generateOptions = (first, last) => {
    let arr = [];
    let counter = first.toString();
    while (counter !== last.toString()) {
      arr.push(
      {
        key: counter,
        value: counter,
        label: (getItemByKey(counter).key + ': ' + getItemByKey(counter).title)
      }
      )
      counter = getNextItemByKey(counter).key
    }
    return arr;
  }

  render() {
    // Declaring constants to avoid writing this.props... all the time
    const dispatch = this.props.dispatch;
    const interview = this.props.interview;
    const settings = this.props.settings;
    const sliderValue = this.state.sliderValue;
    const currentPos = this.state.currentPos;


    let Options;
    if (this.state.showDescription === false) {
      Options = this.state.OptionsWithoutDescriptions;
    }
    else {
      Options = this.state.OptionsWithDescriptions;
    }

    let item = getItemByKey(interview.activeKey);
    if (!item) {
      return <div>No item found</div>;
    }
    let input = item.input;

    let hasScale = item.scale;
    if (hasScale && scales[item.scale]) {
      const scale = scales[item.scale];
      item = {
        ...item,
        options: scale.options,
        validate: scale.validate,
        input: scale.input
      };
    }

  let hasPeriods = true; // default periods to true
  if (item.periods === 'false') hasPeriods = false;
  if (input === 'date' || input === 'date_interval') {
    hasPeriods = false;
  }

  if (input === 'integer') {
    input = 'number';
  }
  if (input === 'string') {
    input = 'text';
  }

  const response = (interview.responses && interview.responses[item.key]) || '';
  const note = (interview.notes && interview.notes[item.key]) || '';
  const hasInput = input || item.scale;
  const showGlossary = settings.showGlossary && item.glossary;

  //TODO: This is just a short hack for trying to fix the issue of text size changing. Do this propper with CSS!
  const divStyle = {
    fontSize: 40,
  };

  // For debugging only
  console.log('currentPos: ' + currentPos);
  console.log('min: ' + this.state.min);
  console.log('response: ' + 'type = ' + typeof(response) + ', value = ' + response);
  console.log('max: ' + this.state.max);
  console.log('hasSlider: ' + this.state.hasSlider);
  console.log('sliderValue: ' + 'type = ' + typeof(sliderValue) + ', value = ' + sliderValue);
  console.log('showDescription: ' + this.state.showDescription)
  console.log('Options:')
  console.log(Options)
  console.log('Dropdown value')
  console.log(this.state.dropdownValue || 'no dropdownvalue')

  // Returns the specific interview item.
  return (
    <div key={item.key} className="interview-item-container">
    <div style={{ flex: 1 }}>
    <ItemCard item={item} />
    {item.scale && (
      <div key={'testKey'}>
      Scale: <strong>{item.scale}</strong>
      <button
      key={'testKey'}
      onClick={() => {
        this.setState({
          showDescription: !this.state.showDescription
        })
        this.inputBox.current.focus();
      }}
      >
      {this.state.showDescription ?
        'Hide Description'
        :
        'Show Description'
      }
      </button>
      </div>
      )}

    {item.options &&
      Options.map(option => {
       return (
        <div
        key={option.key}
        className="interview-response-list">
        <label style={{ fontWeight: 'normal' }} key={option.key + ' label'}>
        <input
        key={option.key + ' input'}
        type='radio'
        checked={option === Options[currentPos]}
        onChange={this.handleRadioButtonChange(option, Options, item)}

        />
        {this.generateOption(option, Options)}
        </label>
        </div>
        )

     })
    }

    {hasInput && (
      <Fragment>
      <label htmlFor="response">Response</label>
      <input
      type={input}
      style={divStyle}
      className={`interview-input interview-input-${input}`}
      id="ResponseInput"
      name="response"
      ref={this.inputBox}

      onKeyDown={event => {
        const direction = event.keyCode;
        handleKeyDown(interview.activeKey, currentPos, Options, this, dispatch, event, direction)
      }}

      onChange={event => {
        if (input === 'date' || input === 'date_interval') {
          dispatch(setResponse({
            key: item.key,
            value: event.target.value
          }))
        }
        else if (validateNumeric(event.target.value, Object.keys(item.options))) {
          dispatch(
            setResponse({
              key: item.key,
              value: event.target.value.toString()
            })
            );
          if (event.target.value == "") {
            this.setState({
              currentPos: null
            })
          }
          else if (this.state.hasSlider) {
            if ((this.state.min <= event.target.value) && (event.target.value <= this.state.max)) {
              this.setState({
                value: event.target.value,
                currentPos: this.getIndexByKey(event.target.value.toString(), Options),
                sliderValue: event.target.value
              });
            }
            else {
              this.setState({
                currentPos: this.getIndexByKey(event.target.value.toString(), Options)
              })
            }
          }
          else {
           this.setState({
            currentPos: this.getIndexByKey(event.target.value.toString(), Options)
          })
         }
       }}
     }
     placeholder={item.validate}
     value={response}
     autoFocus
     />

     {settings.showItemNotes && (
      <textarea
      onChange={event =>
        dispatch(
          setNote({ key: item.key, value: event.target.value })
          )
      }
      defaultValue={note}
      placeholder="Note"
      />
      )}
     </Fragment>
     )}
    </div>
    {showGlossary && (
      <div className="interview-item-glossary">
      <strong>Glossary</strong>
      <Markdown source={item.glossary} style={{ height: '100%' }} />
      </div>
      )}
    </div>
    );
}
}

export default connect()(Response);
const manualInputChange = (value,valid) =>{
  if (
    valid &&
    validateNumeric(value, valid)
    ) {
    dispatch(
      setResponse({
        key: item.key,
        value: value
      })
      );
} else if (!valid) {
  dispatch(
    setResponse({
      key: item.key,
      value: value
    })
    );
}
};
