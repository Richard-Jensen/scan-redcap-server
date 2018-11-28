import { setActiveItem, setResponse, setNote, getResponse } from '../actions';
import { connect } from 'react-redux';
import { items, scales, getItemByKey, getNextItemByKey, getPreviousItemByKey } from '../items';

// Handles down and up arrow for the Response class
export const handleArrowKey = (activeKey, currentPos, array, responseContainer, dispatch, direction, event) => {

  if (currentPos === null) {
    console.log('NULL')
    handleNull(activeKey, array, responseContainer, dispatch, direction);
  }
  else if (event.shiftKey || (array[currentPos].responseType === 'simple')) {
    handleSimple(activeKey, currentPos, array, responseContainer, dispatch, direction, event);
  }
  else if (array[currentPos].responseType === 'slider') {
    handleSlider(activeKey, currentPos, array, responseContainer, dispatch, direction, event);
  }
  else if (array[currentPos].responseType === 'dropdown') {
    handleDropdown(activeKey, currentPos, array, responseContainer, dispatch, direction, event);
  }

}

// Selecting a simple option
const selectSimple = (activeKey, pos, array, responseContainer, dispatch) => {
  responseContainer.setState({
    key: activeKey,
    currentPos: pos,
  });
  dispatch(setResponse({
    key: activeKey,
    value: array[pos].key,
  }));
}

// Selecting a slider option
const selectSlider = (activeKey, pos, responseContainer, dispatch) => {
  responseContainer.setState({
    currentPos: pos,
  });
  dispatch(setResponse({
    key: activeKey,
    value: responseContainer.state.sliderValue.toString(),
  }))
}

// Selecting a dropdown option
const selectDropdown = (activeKey, pos, responseContainer, dispatch) => {
  responseContainer.setState({
    currentPos: pos,
  });
  dispatch(setResponse({
    key: activeKey,
    value: responseContainer.state.dropdownValue,
  }));
}

const handleSimple = (activeKey, currentPos, array, responseContainer, dispatch, direction, event) => {
  if ( ((currentPos === (array.length - 1)) && (direction === 38)) || ((currentPos === 0) && (direction === 40)) )
  {
   return;
 }

 else {
  let dir = 0;
  if (direction === 38) {
    dir = 1;
  }
  else if (direction === 40) {
   dir = -1;
 }
 const updatePos = currentPos + dir;

 if (array[updatePos].responseType === 'simple') {
  selectSimple(activeKey, updatePos, array, responseContainer, dispatch);
}
else if (array[updatePos].responseType === 'slider') {
  selectSlider(activeKey, updatePos, responseContainer, dispatch);
}
else if (array[updatePos].responseType === 'dropdown') {
  selectDropdown(activeKey, updatePos, responseContainer, dispatch);
}
}
}

const handleSlider = (activeKey, currentPos, array, responseContainer, dispatch, direction, event) => {
  if (
    ((responseContainer.state.sliderValue === responseContainer.state.sliderMax) && (direction === 38))
    ||
    ((responseContainer.state.sliderValue === responseContainer.state.sliderMin) && (direction === 40))
    )
  {
    handleSimple(activeKey, currentPos, array, responseContainer, dispatch, direction, event);
  }

  else {
    let dir = 0;
    if (direction === 38) {
      dir = 1;
    }
    else if (direction === 40) {
      dir = -1;
    }
    responseContainer.setState({
      sliderValue: parseInt(responseContainer.state.sliderValue, 10) + parseInt(dir, 10)
    })
    dispatch(setResponse({
      key: activeKey,
      value: (parseInt(responseContainer.state.sliderValue, 10) + parseInt(dir, 10)).toString(),
      sliderValue: parseInt(responseContainer.state.sliderValue, 10) + parseInt(dir, 10),
    }))
  }
}

const handleDropdown = (activeKey, currentPos, array, responseContainer, dispatch, direction, event) => {
  if (
    ((responseContainer.state.dropdownValue === responseContainer.state.dropdownMax) && (direction === 38))
    ||
    ((responseContainer.state.dropdownValue === responseContainer.state.dropdownMin) && (direction === 40))
    )
  {
    handleSimple(activeKey, currentPos, array, responseContainer, dispatch, direction, event);
  }

  else {
    let dir = (arg) => {};
    if (direction === 38) {

      dir = getNextItemByKey;
    }
    else if (direction === 40) {
      dir = getPreviousItemByKey;
    }

    let dropdownOption = dir(responseContainer.state.dropdownValue);
    while (typeof (dropdownOption.scale || dropdownOption.input) === 'undefined') {
      dropdownOption = dir(dropdownOption.key)
    }
    responseContainer.setState({
      dropdownValue: dropdownOption.key,
    })
    dispatch(setResponse({
      key: activeKey,
      value: dropdownOption.key,
      dropdownValue: dropdownOption.key,
    }));
  }
}

const handleNull = (activeKey, array, responseContainer, dispatch, direction) => {
  if ( (direction === 38) || (direction === 40) ) {

    if (array[0].responseType === 'simple') {
      console.log('simple')
      selectSimple(activeKey, 0, array, responseContainer, dispatch);
    }

    else if (array[0].responseType === 'slider') {
      console.log('slider')
      selectSlider(activeKey, 0, responseContainer, dispatch);
    }

    else if (array[0].responseType === 'dropdown') {
      console.log('dropdown')
      selectDropdown(activeKey, 0, responseContainer, dispatch);
    }
  }
}

// Old handlers

/*// Handles down and up arrow keystrokes
export const handleKeyDownBad = (activeKey, currentPos, array, responseContainer, dispatch, event, direction) => {
  if (responseContainer.state.dropdownValue) {
    selectArrowPress(activeKey, currentPos, array, responseContainer, dispatch, event, direction);
  }
  else
    {if (currentPos === null) {
      if (direction === 38) {
        event.preventDefault();
        nullUp(activeKey, currentPos, array, responseContainer, dispatch, event);
      }
      else if (direction === 40) {
        event.preventDefault();
        nullDown(activeKey, currentPos, array, responseContainer, dispatch, event);
      }
    }

    else {
      if (direction === 38) {
        event.preventDefault();
        up(activeKey, currentPos, array, responseContainer, dispatch, event);
      }
      else if (direction == 40) {
        event.preventDefault();
        down(activeKey, currentPos, array, responseContainer, dispatch, event);
      }
    }}
  }

// Handling up arrow if currentPos is null
const nullUp = (activeKey, currentPos, array, responseContainer, dispatch, event) => {

  const sliderValue = responseContainer.state.sliderValue;

  if (currentPos === null) {
    if (array[0].key.includes('-')) {
      if (sliderValue !== null) {
        dispatch(setResponse({
          key: activeKey,
          value: sliderValue,
          sliderValue: sliderValue,
        }));
        responseContainer.setState({
          currentPos: 0
        });
      }
      else {
        dispatch(setResponse({
          key: activeKey,
          value: responseContainer.state.min.toString(),
          sliderValue: responseContainer.state.min
        }))
        responseContainer.setState({
          currentPos: 0,
          sliderValue: responseContainer.state.min
        })
      }
    }
    else {
      dispatch(setResponse({
        key: activeKey,
        value: array[0].key
      }))
      responseContainer.setState({
        currentPos: 0
      })
    }
  }
}

// Handling up arrow if currentPos is not null
const up = (activeKey, currentPos, array, responseContainer, dispatch, event) => {

  const sliderValue = responseContainer.state.sliderValue;

  if (array[currentPos].key.includes('-') && !event.shiftKey) {
    if (responseContainer.state.sliderValue === responseContainer.state.max) {
      if (currentPos === (array.length - 1)) {
        return
      }
      else {
        dispatch(setResponse({
          key: activeKey,
          value: array[currentPos + 1].key
        }));
        responseContainer.setState({
          currentPos: currentPos + 1
        });

      }
    }

    else if (event.target.value == "") {
      dispatch(setResponse({
        key: activeKey,
        value: responseContainer.state.min.toString()
      }));
      responseContainer.setState({
        sliderValue: responseContainer.state.min
      })

    }
    else {
      responseContainer.setState({
        sliderValue: parseInt(responseContainer.state.sliderValue) + 1
      })
      dispatch(setResponse({
        key: activeKey,
        value: (parseInt(responseContainer.state.sliderValue) + 1).toString(),
        sliderValue: (parseInt(responseContainer.state.sliderValue) + 1)
      }));

    }
  }
  else if (currentPos === (array.length - 1)) {
    return
  }
  else if (array[currentPos + 1].key.includes('-')) {
    dispatch(
      setResponse({
        key: activeKey,
        value: responseContainer.state.sliderValue
      })
      );
    responseContainer.setState({
      currentPos: currentPos + 1
    });

  }
  else {
    dispatch(
      setResponse({
        key: activeKey,
        value: array[currentPos + 1].key
      })
      );

    responseContainer.setState({
      currentPos: currentPos + 1
    });
  }
}

// Handling down arrow if currentPos is null
const nullDown = (activeKey, currentPos, array, responseContainer, dispatch, event) => {

  const sliderValue = responseContainer.state.sliderValue;

  if (array[0].key.includes('-')) {
    if (sliderValue !== null) {
      dispatch(setResponse({
        key: activeKey,
        value: sliderValue,
      }))
      responseContainer.setState({
        currentPos: 0
      })
    }
    else {
      dispatch(setResponse({
        key: activeKey,
        value: responseContainer.state.min.toString(),
        sliderValue: responseContainer.state.min
      }))
      responseContainer.setState({
        currentPos: 0,
        sliderValue: responseContainer.state.min
      })
    }
  }
  else {
    dispatch(setResponse({
      key: activeKey,
      value: array[0].key
    }))
    responseContainer.setState({
      currentPos: 0
    })
  }

}

// Handling down arrow if currentPos is not null
const down = (activeKey, currentPos, array, responseContainer, dispatch, event) => {

  const sliderValue = responseContainer.state.sliderValue;

  if (array[currentPos].key.includes('-') && !event.shiftKey) {
    if (responseContainer.state.sliderValue === responseContainer.state.min) {
      if (currentPos === 0) {
        return
      }
      else {
        dispatch(setResponse({
          key: activeKey,
          value: array[currentPos - 1].key
        }));
        responseContainer.setState({
          currentPos: currentPos - 1
        });

      }
    }
    else if (event.target.value == "") {
      dispatch(setResponse({
        key: activeKey,
        value: responseContainer.state.min
      }));
      responseContainer.setState({
        sliderValue: parseInt(responseContainer.state.min)
      })

    }
    else {
      responseContainer.setState({
        sliderValue: parseInt(responseContainer.state.sliderValue) - 1
      })
      dispatch(setResponse({
        key: activeKey,
        value: (parseInt(responseContainer.state.sliderValue) - 1).toString(),
        sliderValue: (parseInt(responseContainer.state.sliderValue) - 1)
      }));

    }
  }
  else if (currentPos === 0) {

    return
  }
  else if (array[currentPos - 1].key.includes('-')) {
    responseContainer.setState({
      currentPos: currentPos - 1
    });
    dispatch(
      setResponse({
        key: activeKey,
        value: responseContainer.state.sliderValue
      })
      );

  }

  else {
    dispatch(
      setResponse({
        key: activeKey,
        value: array[currentPos - 1].key
      })
      );

    responseContainer.setState({
      currentPos: currentPos - 1
    });
  }
}

// Handling up and down arrow for a dropdown menu (created specifically by SelectResponse in ./SelectResponse.js)
const selectArrowPress = (activeKey, currentPos, array, responseContainer, dispatch, event, direction) => {
 if (direction === 38) {
  if (responseContainer.state.dropdownValue === responseContainer.state.dropdownMax) {
    return;
  }
  else {
    responseContainer.setState({
      dropdownValue: getNextItemByKey(responseContainer.state.dropdownValue).key,
    })
    dispatch(setResponse({
      key: activeKey,
      value: getNextItemByKey(responseContainer.state.dropdownValue).key
    }));
  }
}
}
*/
