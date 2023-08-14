import { SET_CURRENT_PAGE } from './actions' // import action type

export const reducer = (state, action) => {
  switch (action.type) {
    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      }
    default:
      console.log('Unknown action: ' + action.type)
      return state
  }
}