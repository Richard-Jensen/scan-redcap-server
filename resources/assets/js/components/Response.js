import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { setActiveItem, setResponse, setNote, getResponse } from '../actions';
import { ItemCard } from './ItemCard';
import { validateNumeric, isValueWithinWholeRangeOfRules } from '../lib/helpers';
import { Markdown } from './Markdown';
import { items, scales, getItemByKey } from '../items';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import ResponseSlider from './ResponseSlider';

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
      Options: [],
      response: null
    };
    this.inputBox = React.createRef();
    this.slider = React.createRef();
  }

  componentDidMount() {
    const item = getItemByKey(this.props.interview.activeKey);
    const Options = [];
    if (item.options) {
      Object.keys(item.options).map(key =>
        Options.push(
          [key, item.options[key]]
          )
        );
      Options.sort(this.compareKey);
      this.setState({
        Options: Options,
        value: 1
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.interview.activeKey !== prevProps.interview.activeKey) {
      console.log('update')
      const item = getItemByKey(this.props.interview.activeKey);
      const Options = [];
      if (item.options) {
        Object.keys(item.options).map(key =>
          Options.push(
            [key, item.options[key]]
            )
          );
      }
      Options.sort(this.compareKey)
      const ranges = [];
      Options.map(pair => {
        if (pair[0].includes('-')) {
          ranges.push(pair[0].split('-').map(n => parseInt(n, 10)))
        }
      })

      const response = (this.props.interview.responses && this.props.interview.responses[item.key]) || '';
      let sliderValue = (this.props.interview.sliderValues && this.props.interview.sliderValues[item.key]) || null;

      if (ranges.length) {
        const min = ranges[0][0];
        const max = ranges[0][1];
        if (sliderValue === null) {
          sliderValue = min
        }
        console.log('response and Options:')
        console.log(response)
        console.log(Options)
        console.log('test:')
        console.log(this.getIndexComb(4, Options))
        const currentPos = this.getIndexComb(response, Options);
        this.setState({
          Options: Options,
          response: response,
          sliderValue: sliderValue,
          value: sliderValue,
          currentPos: currentPos,
          min: min,
          max: max
        })
      }
      else {
        const currentPos = this.getIndex_0(response, Options);
        this.setState({
          Options: Options,
          response: response,
          sliderValue: sliderValue,
          value: sliderValue,
          currentPos: currentPos,
          min: null,
          max: null
        })
      }
    }
  }


  write = (array, pair) => {
    if (pair[0].includes("-")) {
      this.state.hasSlider = true;
      return ([
        this.isActive(array, pair, pair[1]),
        <ResponseSlider
        id='Slider'
        array={array}
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

 getIndexComb = (value, array) => {
  for(var i = 0; i < array.length; i++) {
    if(array[i][0] === value) {
      return i;
    }
    else if (array[i][0].toString().includes('-')) {
      const ranges = array[i][0].toString().split('-').map(n => parseInt(n, 10));
      const min = ranges[0];
      const max = ranges[1];
      if ((min <= value) && (value <= max)) {
        return i
      }
    }
    else {
      return null
    }
  }
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

  isActive = (array, pair, input) => {
    if (this.state.currentPos === this.getIndex(pair,array)) {
      return <b>{input}</b>;
    }
    else {
      return input;
    }
  }

  compareKey = (x,y) => {
    if (x < y) return -1;
    if (x === y) return 0;
    if (x > y) return 1;
  }



  render() {

    const dispatch = this.props.dispatch;
    const interview = this.props.interview;
    const settings = this.props.settings;
    const Options = this.state.Options;

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
  let sliderValue = (interview.sliderValues && interview.sliderValues[item.key]) || '';

  const note = (interview.notes && interview.notes[item.key]) || '';
  const hasInput = input || item.scale;
  const showGlossary = settings.showGlossary && item.glossary;

  //TODO: This is just a short hack for trying to fix the issue of text size changing. Do this propper with CSS!
  const divStyle = {
    fontSize: 40,
  };

  // Compare function, used to sort the upcomming Options array, so that for example 0-799 is smaller than 800
  // TODO: This only correctly sorts if x is an interval with values less than y. Currently a complete hack.


  //Array containing the options, as pairs with 0th enntry the key, and second entry the description.
  // TODO: This gives the error "Warning: Each child in an array or iterator should have a unique "key" prop.". I believe the solution is to somehow attach a key to each pushed entry, but I have not found out how to do this. So far it mostly looks like a aestethic error, but it needs to be fixed to be sure.


  const ranges = [];
  Options.map(pair => {
    if (pair[0].includes('-')) {
      ranges.push(pair[0])
    }
  })

  if (!(ranges.length === 0)) {
    this.state.min = parseInt(ranges[0].split('-')[0])
    this.state.max = parseInt(ranges[0].split('-')[1])
  }




  // For debugging only
  console.log('currentPos: ' + this.state.currentPos);
  console.log('min: ' + this.state.min);
  console.log('response: ' + response);
  console.log('max: ' + this.state.max);
  console.log('value: ' + this.state.value);
  console.log('hasSlider: ' + this.state.hasSlider);
  console.log('sliderValue: ' + sliderValue);
  console.log('true sliderValue: ' + this.props.interview.sliderValues[item.key])

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
            dispatch(setResponse({
             key: item.key,
             value: this.state.value.toString()
           }))
          }
          else {
            dispatch(setResponse({ key: item.key, value: pair[0]}))
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
        style={divStyle}
        className={`interview-input interview-input-${input}`}
        id="ResponseInput"
        name="response"
        ref={this.inputBox}
        onKeyDown={event => {
          //Keycode 38 is arrow key up, 40 is down
          // TODO: Refactor this. It's a huge mess.
          if(event.keyCode==38) {
            if (this.state.currentPos === null) {
              if (Options[0][0].includes('-')) {
                dispatch(setResponse({
                  key: item.key,
                  value: this.state.min,
                  sliderValue: this.state.min
                }))
              }
              else {
                dispatch(setResponse({
                  key: item.key,
                  value: Options[0][0]
                }))
              }
              this.setState({
                currentPos: 0
              })
              event.preventDefault()
            }
            else {
              if (Options[this.state.currentPos][0].includes('-') && !event.shiftKey) {
                if (this.state.value === this.state.max) {
                  if (this.state.currentPos === (Options.length - 1)) {
                    return
                  }
                  else {
                    dispatch(setResponse({
                      key: item.key,
                      value: Options[this.state.currentPos + 1][0]
                    }));
                    this.setState({
                      currentPos: this.state.currentPos + 1
                    });
                    event.preventDefault();
                  }
                }
                else if (event.target.value == "") {
                  dispatch(setResponse({
                    key: item.key,
                    value: this.state.min
                  }));
                  this.setState({
                    value: parseInt(this.state.min)
                  })
                  event.preventDefault();
                }
                else {
                  this.setState({
                    value: parseInt(this.state.value) + 1
                  })
                  dispatch(setResponse({
                    key: item.key,
                    value: (parseInt(this.state.value) + 1).toString(),
                    sliderValue: (parseInt(this.state.value) + 1).toString()
                  }));
                  event.preventDefault();
                }
              }
              else if (this.state.currentPos === (Options.length - 1)) {
                return
              }
              else if (Options[this.state.currentPos + 1][0].includes('-')) {
                dispatch(
                  setResponse({
                    key: item.key,
                    value: this.state.value.toString()
                  })
                  );
                this.setState({
                  currentPos: this.state.currentPos + 1
                });
                event.preventDefault();
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
            if (this.state.currentPos === null) {
              dispatch(setResponse({
                key: item.key,
                value: Options[0][0]
              }))
              this.setState({
                currentPos: 0
              })
            }
            else {
              if (Options[this.state.currentPos][0].includes('-') && !event.shiftKey) {
                if (this.state.value === this.state.min) {
                  if (this.state.currentPos === 0) {
                    if (Options.length === 1) {
                      dispatch(setResponse({
                        key: item.key,
                        value: 1
                      }))
                    }
                    else {
                     return
                   }
                 }
                 else {
                  dispatch(setResponse({
                    key: item.key,
                    value: Options[this.state.currentPos - 1][0]
                  }));
                  this.setState({
                    currentPos: this.state.currentPos - 1
                  });
                  event.preventDefault();
                }
              }
              else if (event.target.value == "") {
                dispatch(setResponse({
                  key: item.key,
                  value: this.state.min
                }));
                this.setState({
                  value: parseInt(this.state.min)
                })
                event.preventDefault();
              }
              else {
                this.setState({
                  value: parseInt(this.state.value) - 1
                })
                dispatch(setResponse({
                  key: item.key,
                  value: (parseInt(this.state.value) - 1).toString(),
                  sliderValue: (parseInt(this.state.value) - 1).toString()
                }));
                event.preventDefault();
              }
            }
            else if (this.state.currentPos === 0) {
              return
            }
            else if (Options[this.state.currentPos - 1][0].includes('-')) {
              this.setState({
                currentPos: this.state.currentPos - 1
              });
              dispatch(
                setResponse({
                  key: item.key,
                  value: this.state.value.toString()
                })
                );
              event.preventDefault();
            }
            else {
              dispatch(
                setResponse({
                  key: item.key,
                  value: Options[this.state.currentPos - 1][0]
                })
                );
              event.preventDefault();
              this.setState({
                currentPos: this.state.currentPos - 1
              });
            }
          }
        }
      }
    }

    onChange={event => {
      if (validateNumeric(event.target.value, Object.keys(item.options))) {
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
              currentPos: this.getIndexComb(event.target.value.toString(), Options),
              sliderValue: event.target.value
            });
          }
          else {
            this.state.currentPos = this.getIndex_0(event.target.value, Options)
          }
        }
        else {
         this.state.currentPos = this.getIndex_0(event.target.value, Options);
       }
     }
   }}
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
