import { DEFAULT_LANGUAGE } from 'src/constants/language'

export interface IState {
  language: string
}

export interface IAction {
  type: string
  value: any
}

export const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case 'CHANGE_LANGUAGE':
      return {
        ...state,
        language: action.value,
      }

    default:
      return state
  }
}

export const initialState: IState = {
  language: DEFAULT_LANGUAGE.code,
}
