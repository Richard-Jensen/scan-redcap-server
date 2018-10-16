// import React, { Fragment, Component } from 'react';
// import { connect } from 'react-redux';
// import { setActiveItem, setResponse, setNote } from '../actions';
// import { ItemCard } from './ItemCard';
// import { validateNumeric, isValueWithinWholeRangeOfRules } from '../lib/helpers';
// import { Markdown } from './Markdown';
// import { items, scales, getItemByKey } from '../items';
// import Slider from 'react-rangeslider';
// import 'react-rangeslider/lib/index.css'

// let createHandlers = function(dispatch) {
//     let handleChange = function(value) {
//       this.setState({
//         value: value
//       })
//       dispatch(setResponse({
//         key: 0,
//         value: value
//       }))

//     };
//     let handleChangeStart = function() {
//       console.log('Change event started')
//     };
//     let handleChangeComplete = function() {
//       console.log('Change event completed')
//     }
//     return {
//       handleChangeStart,
//       handleChange,
//       handleChangeComplete
//     }
//   }

// class Horizontal extends Component {
//   constructor (props, context, dispatch) {
//     super(props, context)
//     this.state = {
//       value: 10,
//     };
//     this.handlers = createHandlers(this.props.dispatch);
//   }


//   // handleChangeStart = () => {
//   //   console.log('Change event started')
//   // };



//   // handleChange = value => {
//   //   this.setState({
//   //     value: value
//   //   })
//   //   dispatch(
//   //     setResponse({
//   //       key: 0,
//   //       value: value
//   //     })
//   //     );

//   // };

//   // handleChangeComplete = () => {
//   //   console.log('Change event completed')
//   // };

//   render () {
//     const { value } = this.state
//     return (
//       <div className='slider'>
//       <Slider
//       min={this.props.min}
//       max={this.props.max}
//       value={value}
//       onChangeStart={this.handlers.handleChangeStart}
//       onChange={this.handlers.handleChange(1)}
//       onChangeComplete={this.handlers.handleChangeComplete}
//       />
//       <div className='value'>{value}</div>
//       </div>
//       )
//   }
// }

// export default connect()(Horizontal);

