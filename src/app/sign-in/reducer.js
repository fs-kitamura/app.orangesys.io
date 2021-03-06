// @flow

import * as ACTION_TYPES from './actions'

export type State = {
  submitting: boolean
}

const reducer = (state: State, action: any) => {
  switch (action.type) {
    case ACTION_TYPES.SIGN_IN: {
      return { ...state, submitting: true }
    }
    case ACTION_TYPES.SIGN_IN_FINISH: {
      return { ...state, submitting: false }
    }
    default:
      return state
  }
}
export default reducer
