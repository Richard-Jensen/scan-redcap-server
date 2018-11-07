export const scanInfo = window.scanInfo;
export const scanData = window.scanData;

export const saveInterview = (id, data) => {
  window.axios
    .post(`/scan/${id}/save`, {
      data
    })
    .then(response => {
      console.log('test')
      console.log(response);
    });
};
