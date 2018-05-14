import axios from 'axios';

export const scanInfo = window.scanInfo;
export const scanData = window.scanData;

export const saveInterview = (id, data) => {
  axios
    .post(`/scan/${id}/save`, {
      data
    })
    .then(response => {
      console.log(response);
    });
};
