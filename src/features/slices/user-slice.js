import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'

import {apiClient} from '../../api/user'

export const userLogin = createAsyncThunk('@@USER/LOGIN', async formData => {
  const options = {
    endpoint: 'signin',
    method: 'POST',
    data: formData
  }
  return apiClient(options)
})

export const userProfile = createAsyncThunk('@@USER/PROFILE', async () => {
  const options = {
    endpoint: 'users/me',
    method: 'GET'
  }
  return apiClient(options)
})

export const userRegisterAction = createAsyncThunk('@@USER/REGISTER', async formData => {
  const options = {
    endpoint: 'signup',
    method: 'POST',
    data: formData
  }
  return apiClient(options)
})

const initialState = {
  users: {
    loading: false,
    data: {},
    error: {}
  }
}

const hasPrefix = (action, prefix) => action.type.startsWith(prefix)
const isPending = action => action.type.endsWith('/pending')
const isRejected = action => action.type.endsWith('/rejected')

const isPendingAction = prefix => action => {
  // Note: this cast to AnyAction could also be `any` or whatever fits your case best
  return hasPrefix(action, prefix) && isPending(action)
}

const isRejectedAction = prefix => action => {
  // Note: this cast to AnyAction could also be `any` or whatever fits your case best - like if you had standardized errors and used `rejectWithValue`
  return hasPrefix(action, prefix) && isRejected(action)
}

const fulfilledPayloadReducer = (state, action) => {
  console.log('@@ ACTION: ', action)
  state.users = {
    loading: false,
    data: action.payload.data,
    error: {}
  }
}

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    userLogout: state => {
      state.users = initialState.users
    }
  },
  extraReducers: builder => {
    builder
      .addCase(userLogin.fulfilled, fulfilledPayloadReducer)
      .addCase(userProfile.fulfilled, fulfilledPayloadReducer)
      .addCase(userRegisterAction.fulfilled, fulfilledPayloadReducer)
      .addMatcher(isPendingAction('@@USER/'), state => {
        state.users = {
          loading: true,
          data: {},
          error: {}
        }
      })
      .addMatcher(isRejectedAction('@@USER/'), (state, action) => {
        state.users = {
          loading: false,
          data: {},
          error: action.payload.data
        }
      })
  }
})

export const {userLogout, fetchRequest} = userSlice.actions
export default userSlice.reducer