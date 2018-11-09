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
      OptionsWithoutDescriptions: [],
      OptionsWithDescriptions: [],
      sliderValue: 0,
      showDescription: false
    };
    this.inputBox = React.createRef();
    this.slider = React.createRef();
  }

  update = () => {
    let item = getItemByKey(this.props.interview.activeKey);
    const OptionsWithoutDescriptions = [];
    const OptionsWithDescriptions = [];
    if (item.options) {
      Object.keys(item.options).map(key => {
        OptionsWithoutDescriptions.push(
          [key, item.options[key]]
          )
      }
      );
    }
    OptionsWithoutDescriptions.sort(this.compareKey)
    let hasScale = item.scale;
    if (hasScale && scales[item.scale]) {
      const scale = scales[item.scale];
      item = {
        ...item,
        options: scale.options,
        validate: scale.validate,
        input: scale.input
      };
      Object.keys(scales['1ad'].options).map(key => {
        OptionsWithDescriptions.push(
          [key, scales['1ad'].options[key]['title'], scales['1ad'].options[key]['description']]
          )
      })
    }

    const ranges = [];
    OptionsWithoutDescriptions.map(pair => {
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
      const currentPos = this.getIndexComb(response, OptionsWithoutDescriptions);
      this.setState({
        OptionsWithoutDescriptions: OptionsWithoutDescriptions,
        OptionsWithDescriptions: OptionsWithDescriptions,
        response: response,
        sliderValue: sliderValue,
        value: sliderValue,
        currentPos: currentPos,
        min: min,
        max: max,
        showDescription: false
      })
    }
    else {
      const currentPos = this.getIndexComb(response, OptionsWithoutDescriptions);
      this.setState({
        OptionsWithoutDescriptions: OptionsWithoutDescriptions,
        OptionsWithDescriptions: OptionsWithDescriptions,
        response: response,
        sliderValue: null,
        value: sliderValue,
        currentPos: currentPos,
        min: null,
        max: null,
        showDescription: false
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

  write = (array, pair) => {
    if (this.state.showDescription === false) {
      if (pair[0].includes("-")) {
        this.state.hasSlider = true;
        return ([
          this.isActive(array, pair, pair[1]),
          <ResponseSlider
          id='Slider'
          array={array}
          responseValue={this.state.sliderValue}
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
        <b>{pair[0] + ' '}</b>,
        this.isActive(array, pair, pair[1])
        ]);
     }
   }
   else {
    return (
      this.isActive(array, pair,
        (<div>
          <b>{pair[0] + ': '}</b>
          <div>
          <b>Title: </b>
          {pair[1]}
          </div>
          <div>
          <b>Description: </b>
          {pair[2]}
          </div>
          </div>)
        ))
  }
}

getIndexComb = (value, array) => {
  for(var i = 0; i < array.length; i++) {
    if(array[i][0] === value) {
      return i;
    }
    else if (array[i][0].includes('-')) {
      const ranges = array[i][0].split('-').map(n => (parseInt(n, 10)))
      const min = ranges[0];
      const max = ranges[1];
      if ((min <= parseInt(value, 10)) && (parseInt(value, 10) <= max)) {
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

  isActive = (array, pair, input) => {
    if (this.state.currentPos === this.getIndex(pair,array)) {
      return <b>{input}</b>;
    }
    else {
      return input;
    }
  }

  compareKey = (x,y) => {
    if (parseInt(x[0], 10) < parseInt(y[0])) return -1;
    if (parseInt(x[0], 10) === parseInt(y[0], 10)) return 0;
    if (parseInt(x[0], 10) > parseInt(y[0],10)) return 1;
  }



  render() {
    const dispatch = this.props.dispatch;
    const interview = this.props.interview;
    const settings = this.props.settings;

    console.log(this.state.OptionsWithoutDescriptions)
    console.log(this.state.OptionsWithDescriptions)

    let Options;
    if (this.state.showDescription === false) {
      Options = this.state.OptionsWithoutDescriptions;
    }
    else {
      Options = this.state.OptionsWithDescriptions;
    }
    console.log(Options)

    const sliderValue = this.state.sliderValue;

    const currentPos = this.state.currentPos;

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
  /*console.log('currentPos: ' + currentPos);
  console.log('min: ' + this.state.min);
  console.log('response: ' + 'type = ' + typeof(response) + ', value = ' + response);
  console.log('max: ' + this.state.max);
  console.log('hasSlider: ' + this.state.hasSlider);
  console.log('sliderValue: ' + 'type = ' + typeof(sliderValue) + ', value = ' + sliderValue);
  console.log('showDescription: ' + this.state.showDescription)*/

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
             value: this.state.sliderValue
           }))
          }
          else {
            dispatch(setResponse({ key: item.key, value: pair[0]}))
          }
          this.inputBox.current.focus()
        }
      }
      >
      {this.write(Options, pair)}
      </div>
      ))}
      {item.scale && (
        <div>
        Scale: <strong>{item.scale}</strong>
        <button
        onClick={() => {
          this.setState({
            showDescription: !this.state.showDescription
          })
          this.inputBox.current.focus();
        }
      }
      >
      Show descriptions
      </button>
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
          if (event.keyCode==38) {
            if (currentPos === null) {
              if (Options[0][0].includes('-')) {
                if (sliderValue !== null) {
                  dispatch(setResponse({
                    key: item.key,
                    value: sliderValue.toString(),
                  }))
                  this.setState({
                    currentPos: 0
                  })
                }
                else {
                  dispatch(setResponse({
                    key: item.key,
                    value: this.state.min.toString(),
                    sliderValue: this.state.min
                  }))
                  this.setState({
                    currentPos: 0,
                    sliderValue: this.state.min
                  })
                }
              }
              else {
                dispatch(setResponse({
                  key: item.key,
                  value: Options[0][0]
                }))
                this.setState({
                  currentPos: 0
                })
              }
              event.preventDefault()
            }

            else {
              if (Options[currentPos][0].includes('-') && !event.shiftKey) {
                if (this.state.sliderValue === this.state.max) {
                  if (currentPos === (Options.length - 1)) {
                    return
                  }
                  else {
                    dispatch(setResponse({
                      key: item.key,
                      value: Options[currentPos + 1][0]
                    }));
                    this.setState({
                      currentPos: currentPos + 1
                    });
                    event.preventDefault();
                  }
                }

                else if (event.target.value == "") {
                  dispatch(setResponse({
                    key: item.key,
                    value: this.state.min.toString()
                  }));
                  this.setState({
                    sliderValue: this.state.min
                  })
                  event.preventDefault();
                }
                else {
                  this.setState({
                    sliderValue: parseInt(this.state.sliderValue) + 1
                  })
                  dispatch(setResponse({
                    key: item.key,
                    value: (parseInt(this.state.sliderValue) + 1).toString(),
                    sliderValue: (parseInt(this.state.sliderValue) + 1)
                  }));
                  event.preventDefault();
                }
              }
              else if (currentPos === (Options.length - 1)) {
                return
              }
              else if (Options[currentPos + 1][0].includes('-')) {
                dispatch(
                  setResponse({
                    key: item.key,
                    value: this.state.sliderValue.toString()
                  })
                  );
                this.setState({
                  currentPos: currentPos + 1
                });
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
                this.setState({
                  currentPos: currentPos + 1
                });
              }
            }
          }
          else if (event.keyCode==40) {
            if (currentPos === null) {
              if (Options[0][0].includes('-')) {
                if (sliderValue !== null) {
                  dispatch(setResponse({
                    key: item.key,
                    value: sliderValue.toString(),
                  }))
                  this.setState({
                    currentPos: 0
                  })
                }
                else {
                  dispatch(setResponse({
                    key: item.key,
                    value: this.state.min.toString(),
                    sliderValue: this.state.min
                  }))
                  this.setState({
                    currentPos: 0,
                    sliderValue: this.state.min
                  })
                }
              }
              else {
                dispatch(setResponse({
                  key: item.key,
                  value: Options[0][0]
                }))
                this.setState({
                  currentPos: 0
                })
              }
              event.preventDefault()
            }

            else {
              if (Options[currentPos][0].includes('-') && !event.shiftKey) {
                if (this.state.sliderValue === this.state.min) {
                  if (currentPos === 0) {
                   return
                 }
                 else {
                  dispatch(setResponse({
                    key: item.key,
                    value: Options[currentPos - 1][0]
                  }));
                  this.setState({
                    currentPos: currentPos - 1
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
                  sliderValue: parseInt(this.state.min)
                })
                event.preventDefault();
              }
              else {
                this.setState({
                  sliderValue: parseInt(this.state.sliderValue) - 1
                })
                dispatch(setResponse({
                  key: item.key,
                  value: (parseInt(this.state.sliderValue) - 1).toString(),
                  sliderValue: (parseInt(this.state.sliderValue) - 1)
                }));
                event.preventDefault();
              }
            }

            else if (Options[currentPos - 1][0].includes('-')) {
              this.setState({
                currentPos: currentPos - 1
              });
              dispatch(
                setResponse({
                  key: item.key,
                  value: this.state.sliderValue.toString()
                })
                );
              event.preventDefault();
            }
            else if (currentPos === 0) {
              return
            }
            else {
              dispatch(
                setResponse({
                  key: item.key,
                  value: Options[currentPos - 1][0]
                })
                );
              event.preventDefault();
              this.setState({
                currentPos: currentPos - 1
              });
            }
          }
        }
      }
    }

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
              currentPos: this.getIndexComb(event.target.value.toString(), Options),
              sliderValue: event.target.value
            });
          }
          else {
            this.setState({
              currentPos: this.getIndex_0(event.target.value, Options)
            })
          }
        }
        else {
          this.setState({
            currentPos: this.getIndex_0(event.target.value, Options)
          })
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
