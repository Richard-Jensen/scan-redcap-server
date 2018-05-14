export const loggerMiddleware = store => next => action => {
  console.log('Dispatching:', action);
  next(action);
};
