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


var hasSlider = false;


// Now it is actually a class!
class Response extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      item: getItemByKey(this.props.interview.activeKey),
      value: 0,
      hasSlider: false,
      currentPos: 0
    };
    this.inputBox = React.createRef();
    this.slider = React.createRef();
  }

  // Function to create the options, which can be a Slider
  // TODO: Unneccessary arguments interview and inputBox
  write = function(array, pair) {
      if (pair[0].includes("-")) {
      hasSlider = true;
      return ([
        this.isActive(array, pair, pair[1]),
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
      this.isActive(array,pair, pair[1])
      ]);
   }

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

  isActive = function(array, pair, input) {
    if (this.state.currentPos === this.getIndex(pair,array)) {
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

    hasSlider = false;

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

  if (this.getIndex_0(response, Options) != -1) {
    this.state.currentPos = this.getIndex_0(response, Options);
  }

  if (response.includes('-')) {
    this.state.currentPos = 0;
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
          this.setState({
            currentPos: this.getIndex(pair, Options)
          })
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
    {this.write(Options,pair)}
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
          // TODO: This fits question 2.002, and I believe all other questions with a option which can be varied, but should be made more general (e.g., value: 800)
          if(event.keyCode==38) {
            if (hasSlider) {
              if (this.state.currentPos == (Options.length - 1)) {return;}
              else if (this.state.currentPos == 0 && !event.shiftKey) {
                if (this.state.value == "799") {
                  dispatch(setResponse({
                    key: item.key,
                    value: "800"
                  }));
                  this.setState({
                    currentPos: this.state.currentPos + 1
                  });
                }
                else if (event.target.value == ""){
                  dispatch(setResponse({
                    key: item.key,
                    value: "0"
                  }));
                  this.setState({
                    value: 0
                  })
                  event.preventDefault();
                }
                else {
                  this.setState({
                    value: parseInt(this.state.value) + 1
                  })
                  dispatch(setResponse({
                    key: item.key,
                    value: (parseInt(this.state.value) + 1).toString()
                  }));
                  event.preventDefault();
                }
              }
              else {
                dispatch(
                  setResponse({
                    key: item.key,
                    value: Options[this.state.currentPos + 1][0]
                  })
                  );
                event.preventDefault();
                this.setState({
                    currentPos: this.state.currentPos + 1
                  });
              }
            }
            else {
              if (this.state.currentPos == (Options.length - 1)) {
                return;
              }
              else {
              dispatch(
                setResponse({
                  key: item.key,
                  value: Options[this.state.currentPos + 1][0]
                })
                );
              event.preventDefault();
              this.setState({
                    currentPos: this.state.currentPos + 1
                  });
            }
            }
          }
          else if (event.keyCode==40) {
            if (hasSlider) {
              if (event.target.value == "") {
                if (this.state.currentPos == 1) {

                }
                dispatch(setResponse({
                  key: item.key,
                  value: "0"
                }))
                this.setState({
                  value: 0
                })
              }
              else if (this.state.currentPos == 1) {
                dispatch(setResponse({
                  key: item.key,
                  value: this.state.value.toString()
                }));
                event.preventDefault();
                this.state.currentPos--;
                this.inputBox.current.focus();
              }
              else if (this.state.currentPos == 0) {
                if (this.state.value == 0) {return;}
                else {
                  // This is terrible hack, but for some reason, it will not show 0 in the inputbox unless I specify 0 as "0". This also means that when adding 1 when pressing uparrow, it returns "1". and then "11", since for strings, + is concatination, so we have to use parseInt there.
                  if (this.state.value == 1) {
                    dispatch(setResponse({
                      key: item.key,
                      value: "0"
                    }));
                    this.setState({
                      value: 0
                    })
                  }
                  else {
                    this.setState({
                      value: this.state.value - 1
                    })
                    dispatch(setResponse({
                      key: item.key,
                      value: (this.state.value - 1).toString()
                    }));
                    event.preventDefault();
                  }}}

                  else {
                    dispatch(
                      setResponse({
                        key: item.key,
                        value: Options[this.state.currentPos - 1][0]
                      })
                      );
                    event.preventDefault();
                    this.state.currentPos--;
                  }
                }
                else {
                  if (this.state.currentPos == 0) {return;}
                  else {
                  dispatch(
                    setResponse({
                      key: item.key,
                      value: Options[this.state.currentPos - 1][0]
                    })
                    );
                  event.preventDefault();
                  this.state.currentPos--;
                }}}
              }}
              onChange={event => {
                if (item.validate && validateNumeric(event.target.value, Object.keys(item.options))) {
                  dispatch(
                    setResponse({
                      key: item.key,
                      value: event.target.value.toString()
                    })
                    );
                  if (hasSlider) {
                    if (event.target.value == "") {
                      this.state.currentPos = 0;
                    }
                    else if (event.target.value < 800) {
                      this.setState({
                        value: event.target.value
                      });
                      this.state.currentPos = 0;
                    }
                    else {
                      this.state.currentPos = this.getIndex_0(event.target.value, Options)
                    }
                  }
                  else {
                    // TODO: Decide whether deleting all input should set currentPos to 0 or let it be as it is
                    if (event.target.value == "") {}
                      else {
                       this.state.currentPos = this.getIndex_0(event.target.value, Options);
                     }}
                   }
                   else if (!item.validate) {
                    dispatch(
                      setResponse({
                        key: item.key,
                        value: event.target.value.toString()
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
