import React, {useState} from 'react'
import {useFormik} from 'formik'
import {useDispatch} from 'react-redux'
import {useHistory} from 'react-router-dom'
import {StatusCodes} from 'http-status-codes'

import {userLogin} from '../slices/user-slice'
import FormComponent from '../../components/Form/Form'
import Card from '../../components/Card'

const UserLogin = () => {
  const [loginErrorMessage, setLoginErrorMessage] = useState(null)
  const dispatch = useDispatch()
  const history = useHistory()

  const formik = useFormik({
    initialValues: {email: '', password: ''},
    onSubmit: async values => {
      const {payload} = await dispatch(userLogin(values))
      if (payload.statusCode && payload.statusCode !== StatusCodes.OK) {
        setLoginErrorMessage(payload.details)
      } else {
        localStorage.setItem('token', payload.data.token)
        history.push('/')
      }
    }
  })

  const {handleSubmit, handleChange, values, isSubmitting} = formik

  const formTemplate = [
    {
      name: 'email',
      type: 'text',
      value: values.email,
      placeHolder: 'Email',
      label: 'Email address',
      onChange: handleChange
    },
    {
      name: 'password',
      type: 'password',
      value: values.password,
      placeHolder: 'Password',
      label: 'Password',
      onChange: handleChange
    }
  ]

  return (
    <div className="mt-32">
      <div className="grid justify-items-stretch">
        <div className="justify-self-center">
          <Card>
            <div class="self-center mb-2 text-xl font-light text-gray-800 sm:text-2xl dark:text-white">
              Ingresa a tu cuenta
            </div>
            <FormComponent
              formTemplate={formTemplate}
              isSubmitting={isSubmitting}
              handleSubmit={handleSubmit}
              textButton="Iniciar Sesión"
              errorMessage={loginErrorMessage}
            />
            <div className="flex ml-auto">
              <div
                className="inline-flex mt-2 cursor-pointer text-xs font-thin text-gray-500 sm:text-sm dark:text-gray-100 hover:text-gray-700 dark:hover:text-white"
                onClick={() => history.push('/register')}
              >
                No tienes cuenta?
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default UserLogin