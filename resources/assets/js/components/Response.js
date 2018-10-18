/*import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { setActiveItem, setResponse, setNote } from '../actions';
import { ItemCard } from './ItemCard';
import { validateNumeric, isValueWithinWholeRangeOfRules } from '../lib/helpers';
import { Markdown } from './Markdown';
import { items, scales, getItemByKey } from '../items';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import Horizontal from './Horizontal';

var previousValue = 0;
var currentPos = 0;
var sliderVal = 0;


// TODO: Make this a class extending Component

const Response = ({ dispatch, interview, settings }) => {
  let item = getItemByKey(interview.activeKey);
  let inputBox = React.createRef();

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

  let response = (interview.responses && interview.responses[item.key]) || '';

  const note = (interview.notes && interview.notes[item.key]) || '';
  const hasInput = input || item.scale;
  const showGlossary = settings.showGlossary && item.glossary;

  // Compare function, used to sort the upcomming Options array, so that for example 0-799 is smaller than 800
  // TODO: This only correctly sorts if x is an interval with values less than y. Currently a complete hack.
  function compareKey(x,y) {
    if (x < y) return -1;
    if (x === y) return 0;
    if (x > y) return 1;
  }

  //Array containing the options, as pairs with 0th enntry the key, and second entry the description.
  const Options = [];
  if (item.options) {
    Object.keys(item.options).map(key =>
      Options.push(
        [key, item.options[key]]
        )
      );
    Options.sort(compareKey);
  }

  // Function returning the index of a possible element in an array.
  function getIndex(value, arr) {
    for(var i = 0; i < arr.length; i++) {
      if(arr[i] === value) {
        return i;
      }
    }
    return -1; //to handle the case where the value doesn't exist
  }

  // Function returning the index of a possible element in an array, given that the array contains lists with at least 1 element..
  function getIndex_0(value, arr) {
    for(var i = 0; i < arr.length; i++) {
      if(arr[i][0] === value) {
        return i;
      }
    }
    return -1; //to handle the case where the value doesn't exist
  }

  function isActive(response, pair, input) {
    if (response === pair[0]) {
      return <b>{input}</b>;
    }
    else {
      return input;
    }
  }

  function write(response, pair) {
    if (pair[0].includes("-")) {
    //var inputBox = document.getElementById("ResponseInput")
    return ([
      <b>{pair[0] + " "}</b>,
      <Horizontal
      id='Slider'
      min={
        parseInt(pair[0].split('-')[0])
      }
      max={
        parseInt(pair[0].split('-')[1])
      }
      interview={interview}
      inputBox={inputBox}
      />
      ]);
  }
  else {
   return ([
    <b>{pair[0] + " "}</b>,
    isActive(response,pair, pair[1])
    ]);
 }
}

 // Handler for when changing Slider

 // Returns the specific interview item.
 return (
  <div key={item.key} className="interview-item-container">
  <div style={{ flex: 1 }}>
  <ItemCard item={item} />
  {item.options &&
    Options.map(pair => (
      <div
      key={pair[0]}
      className="interview-response-list"
      onClick={() => {
        currentPos = getIndex(pair, Options)
        if (pair[0].includes("-")) {
          //So far, the Horizontal class handles all this
        }
        else {
          dispatch(setResponse({ key: item.key, value: pair[0] }))
        }
        inputBox.current.focus()
      }
    }
    >
    {write(response,pair)}
    </div>
    ))}
    {item.scale && (
      <div>
      Scale: <strong>{item.scale}</strong>
      </div>
      )}
    {hasInput && (
      <Fragment>
      <label htmlFor="response">Response</label>
      <input
      type={input}
      className={`interview-input interview-input-${input}`}
      id="ResponseInput"
      name="response"
      ref={inputBox}
      onKeyDown={event =>{
          //Keycode 38 is arrow key up, 40 is down
          if(event.keyCode==38) {
            if (currentPos === (Options.length - 1)) {return;}
            else {
              dispatch(
                setResponse({
                  key: item.key,
                  value: Options[currentPos + 1][0]
                })
                );
              event.preventDefault();
              currentPos++;
            }
          }
          else if (event.keyCode==40){
           {
            dispatch(
              setResponse({
                key: item.key,
                value: Options[currentPos - 1][0]
              })
              );
            event.preventDefault();
            currentPos--;
          }
        }
        else {return;}
      }}
      onChange={event => {
        if (item.validate && validateNumeric(event.target.value, pair[0])) {
          dispatch(
            setResponse({
              key: item.key,
              value: event.target.value
            })
            );
          currentPos = getIndex_0(event.target.value, Options);
        }
        else if (!item.validate) {
          dispatch(
            setResponse({
              key: item.key,
              value: event.target.value
            })
            );
        }}}

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
};

export const ResponseContainer = connect(state => state)(Response);
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
};*/


import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { setActiveItem, setResponse, setNote, getResponse } from '../actions';
import { ItemCard } from './ItemCard';
import { validateNumeric, isValueWithinWholeRangeOfRules } from '../lib/helpers';
import { Markdown } from './Markdown';
import { items, scales, getItemByKey } from '../items';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import Horizontal from './Horizontal';

var previousValue = 0;
var currentPos = 0;
var sliderVal = 0;


// Now it is actually a class!
class Response extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      item: getItemByKey(this.props.interview.activeKey),
      value: 0,
      slider: null,
      currentPos: 0
    };
    this.inputBox = React.createRef();
    this.slider = React.createRef();
  }

  // Function to create the options, which can be a Slider
  // TODO: Unneccessary arguments interview and inputBox
  write = function(response, pair) {
    if (pair[0].includes("-")) {
      return ([
        <b>{pair[0] + " "}</b>,
        <Horizontal
        id='Slider'
        responseValue={this.state.value}
        min={
          parseInt(pair[0].split('-')[0])
        }
        max={
          parseInt(pair[0].split('-')[1])
        }
        ref={this.slider}
        response={this}
        interview={this.props.interview}
        inputBox={this.inputBox}
        />
        ]);
    }
    else {
     return ([
      <b>{pair[0] + " "}</b>,
      this.isActive(response,pair, pair[1])
      ]);
   }
 };

 //Handler methods for the slider
 handleChangeStart = function() {
  console.log('Change event started')
};

handleChange = function(value) {
  dispatch(setResponse({
    key: this.interview.activeKey,
    value: value
  }))
};

handleChangeComplete = function() {
  console.log('Change event completed')
};

  // Function returning the index of a possible element in an array.
  getIndex = function(value, arr) {
    for(var i = 0; i < arr.length; i++) {
      if(arr[i] === value) {
        return i;
      }
    }
    return -1; //to handle the case where the value doesn't exist
  }

  // Function returning the index of a possible element in an array, given that the array contains lists with at least 1 element..
  getIndex_0 = function(value, arr) {
    for(var i = 0; i < arr.length; i++) {
      if(arr[i][0] === value) {
        return i;
      }
    }
    return -1; //to handle the case where the value doesn't exist
  }

  isActive = function(response, pair, input) {
    if (response === pair[0]) {
      return <b>{input}</b>;
    }
    else {
      return input;
    }
  }

  render() {
    const dispatch = this.props.dispatch;
    const interview = this.props.interview;
    const settings = this.props.settings;

    let item = getItemByKey(interview.activeKey);
    //let inputBox = React.createRef();

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

  let response = (interview.responses && interview.responses[item.key]) || '';

  const note = (interview.notes && interview.notes[item.key]) || '';
  const hasInput = input || item.scale;
  const showGlossary = settings.showGlossary && item.glossary;

  // Compare function, used to sort the upcomming Options array, so that for example 0-799 is smaller than 800
  // TODO: This only correctly sorts if x is an interval with values less than y. Currently a complete hack.
  function compareKey(x,y) {
    if (x < y) return -1;
    if (x === y) return 0;
    if (x > y) return 1;
  }

  //Array containing the options, as pairs with 0th enntry the key, and second entry the description.
  const Options = [];
  if (item.options) {
    Object.keys(item.options).map(key =>
      Options.push(
        [key, item.options[key]]
        )
      );
    Options.sort(compareKey);
  }



  // Returns the specific interview item.
  return (
    <div key={item.key} className="interview-item-container">
    <div style={{ flex: 1 }}>
    <ItemCard item={item} />
    {item.options &&
      Options.map(pair => (
        <div
        key={pair[0]}
        className="interview-response-list"
        onClick={() => {
          currentPos = this.getIndex(pair, Options)
          if (pair[0].includes("-")) {
          //So far, the Horizontal class handles all this
        }
        else {
          dispatch(setResponse({ key: item.key, value: pair[0] }))
        }
        this.inputBox.current.focus()
      }
    }
    >
    {this.write(response,pair)}
    </div>
    ))}
      {item.scale && (
        <div>
        Scale: <strong>{item.scale}</strong>
        </div>
        )}
      {hasInput && (
        <Fragment>
        <label htmlFor="response">Response</label>
        <input
        type={input}
        className={`interview-input interview-input-${input}`}
        id="ResponseInput"
        name="response"
        ref={this.inputBox}
        onKeyDown={event =>{
          //Keycode 38 is arrow key up, 40 is down
          if(event.keyCode==38) {
            if (currentPos === (Options.length - 1)) {return;}
            else if (currentPos === 0 && !event.shiftKey) {
              this.setState({
                value: this.state.value + 1
              })
              dispatch(setResponse({
                key: item.key,
                value: this.state.value + 1
              }));
              event.preventDefault();
            }
            else {
              dispatch(
                setResponse({
                  key: item.key,
                  value: Options[currentPos + 1][0]
                })
                );
              event.preventDefault();
              currentPos++;
            }
          }
          else if (event.keyCode==40) {
           if (currentPos === 1) {
            dispatch(setResponse({
              key: item.key,
              value: this.state.value
            }));
            event.preventDefault();
            currentPos--;
            this.inputBox.current.focus();
          }
          else if (currentPos === 0) {
            this.setState({
              value: this.state.value - 1
            })
            dispatch(setResponse({
              key: item.key,
              value: this.state.value - 1
            }));
            event.preventDefault();
          }
          else {
            dispatch(
              setResponse({
                key: item.key,
                value: Options[currentPos - 1][0]
              })
              );
            event.preventDefault();
            currentPos--;
          }}
          else {return;}
        }}
        onChange={event => {
          if (item.validate && validateNumeric(event.target.value, Object.keys(item.options))) {
            dispatch(
              setResponse({
                key: item.key,
                value: event.target.value
              })
              );
            if (event.target.value < 800) {
              currentPos = 0;
            }

            else {
            currentPos = this.getIndex_0(event.target.value, Options);
          }
          this.setState({
                value: parseInt(event.target.value)
              })
          }
          else if (!item.validate) {
            dispatch(
              setResponse({
                key: item.key,
                value: event.target.value
              })
              );
          }}}

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
