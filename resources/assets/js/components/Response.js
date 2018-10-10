import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { setActiveItem, setResponse, setNote } from '../actions';
import { ItemCard } from './ItemCard';
import { validateNumeric, isValueWithinWholeRangeOfRules } from '../lib/helpers';
import { Markdown } from './Markdown';
import { items, scales, getItemByKey } from '../items';
var previousValue = 0;
var currentPos = 0;

const Response = ({ dispatch, interview, settings }) => {
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



  //Array containing the options, as pairs with 0th enntry the key, and second entry the description.
  const Options = [];
  Object.keys(item.options).map(key =>
    Options.push(
      [key, item.options[key]]
      )
    );

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

 // Modified original return by storing the options in an array
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
        dispatch(setResponse({ key: item.key, value: pair[0] }))
        currentPos = getIndex(pair, Options)
      }
    }
    >
    <b>{pair[0] + ' '}</b>
    {pair[0] === response ? (
      <b>{pair[1]}</b>
      ) : (
      pair[1]
      )}
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
      onKeyDown={event =>{
          //Keycode 38 is arrow key up, 40 is down
          if(event.keyCode==38) {
            dispatch(
              setResponse({
                key: item.key,
                value: Options[currentPos + 1][0]
              })
              );
            event.preventDefault();
            currentPos++;
          }
          else if (event.keyCode==40){
            dispatch(
              setResponse({
                key: item.key,
                value: Options[currentPos - 1][0]
              })
              );
            event.preventDefault();
            currentPos--;
          }
          else {return;}
        }}
        onChange={event => {
          if (item.validate && validateNumeric(event.target.value, item.validate)) {
            dispatch(
              setResponse({
                key: item.key,
                value: event.target.value
              })
              );
            currentPos = getIndex_0(event.target.value, Options);
          } else if (!item.validate) {
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





  // Original return
  // return (
  //   <div key={item.key} className="interview-item-container">
  //     <div style={{ flex: 1 }}>
  //       <ItemCard item={item} />
  //       {item.options &&
  //         Object.keys(item.options).map(key => (
  //           <div
  //             key={key}
  //             className="interview-response-list"
  //             onClick={() =>
  //               dispatch(setResponse({ key: item.key, value: key }))
  //             }
  //           >
  //             <b>{key}</b>{' '}
  //             {key === response ? (
  //               <b>{item.options[key]}</b>
  //             ) : (
  //               item.options[key]
  //             )}
  //           </div>
  //         ))}
  //       {item.scale && (
  //         <div>
  //           Scale: <strong>{item.scale}</strong>
  //         </div>
  //       )}
  //       {hasInput && (
  //         <Fragment>
  //           <label htmlFor="response">Response</label>
  //           <input
  //             type={input}
  //             className={`interview-input interview-input-${input}`}
  //             id="ResponseInput"
  //             name="response"
  //             onKeyDown={event =>{
  //               let adjustment = 0;
  //               //Keycode 38 is arrow key up, 40 is down
  //               if(event.keyCode==38){
  //                 adjustment = 1;
  //               }
  //               else if (event.keyCode==40){
  //                 adjustment = -1;
  //               }
  //               else {return;}
  //               let bonus = adjustment;
  //               while(!validateNumeric((parseInt(event.target.value) + bonus),item.validate)&&isValueWithinWholeRangeOfRules(parseInt(event.target.value)+bonus,item.validate)){
  //                 bonus = bonus + adjustment;
  //                 }
  //                 if(isValueWithinWholeRangeOfRules(parseInt(event.target.value)+bonus,item.validate))
  //                 {
  //                   dispatch(
  //                     setResponse({
  //                       key: item.key,
  //                       value: parseInt(event.target.value)+bonus}));
  //                   event.preventDefault();
  //                 }
  //             }}
  //             onChange={event => {
  //               if (item.validate && validateNumeric(event.target.value, item.validate)) {
  //                 dispatch(
  //                   setResponse({
  //                     key: item.key,
  //                     value: event.target.value
  //                   })
  //                 );
  //               } else if (!item.validate) {
  //                 dispatch(
  //                   setResponse({
  //                     key: item.key,
  //                     value: event.target.value
  //                   })
  //                 );
  //               }}}
  //             placeholder={item.validate}
  //             value={response}
  //             autoFocus
  //           />

  //           {settings.showItemNotes && (
  //             <textarea
  //               onChange={event =>
  //                 dispatch(
  //                   setNote({ key: item.key, value: event.target.value })
  //                 )
  //               }
  //               defaultValue={note}
  //               placeholder="Note"
  //             />
  //           )}
  //         </Fragment>
  //       )}
  //     </div>
  //     {showGlossary && (
  //       <div className="interview-item-glossary">
  //         <strong>Glossary</strong>
  //         <Markdown source={item.glossary} style={{ height: '100%' }} />
  //       </div>
  //     )}
  //   </div>
  // );
  // };

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
};
